import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'
import {Rezult} from '../common/message/rezult.js'
import {ErrorName} from '../common/message/errorName.js'
import type {DataSourceInterface, DeleteResult, SaveMoParams} from './DataSource.interface.js'
import {type MoFieldDefinition} from '../../models/fields/MoFieldDefinition.js'
import {getMoMeta} from '../mo/moManagement.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import {RelationMetas} from '../../models/managedObjects/RelationMeta.js'
import {DeleteCascade} from '../../models/managedObjects/RelationDefinitionInterface.js'


export class HeapDataSource<M extends MoInterface> implements DataSourceInterface<M> {
  moDef: MoDefinitionInterface
  records: { [key: string]: M } = {}
  keyname = 'id'

  nextId: number = 0

  constructor(moDef: MoDefinitionInterface) {
    this.moDef = moDef
    this.nextId = 1
  }

  getMo = async (key: any): Promise<M> => {
    return this.records[key]
  }

  getMoid = async (key: any): Promise<MoidInterface> => {
    return this.records[key]?.toMoid()
  }

  saveMo = async (mo: M, params?: SaveMoParams) => {
    // console.log(`==>Heap.dataSource.ts:saveMo mo.id`, mo.id, this.nextId)
    if (!mo) throw new Rezult(ErrorName.missing_param)
      const moMeta = mo.moMeta
    this.records[mo[this.keyname!]] = mo
      const twoWaysRelation = Object.values(RelationMetas[moMeta.name]).filter(rel => !!rel.reverse)
    for (const relation of twoWaysRelation) {
        const reverseMoMeta = relation.moMeta2
        const relationDef = relation.relationDef
        const fieldname = relationDef.fieldDef1.name
        const reverseFieldname = relationDef.fieldDef2?.name
      if (!reverseFieldname) {
        console.log(`==>Heap.dataSource.ts.saveMo:40 No reverseName ${this.moDef?.name} ${fieldname}`)
        continue
      }
      console.log(`==>Heap.dataSource.ts.saveMo:38 ${fieldname} reverseName`, reverseFieldname)
      const id = mo[fieldname].id
      const reverseFieldDef = relationDef.fieldDef2
      if (!reverseFieldDef) {
        throw new Rezult(ErrorName.missing_field, {
          missing: 'reverseFieldDef',
          reverseField: reverseFieldname,
          moDef: this.moDef?.name,
          id: mo.id,
          field: fieldname,
          reverseId: id
        })
      }
      const reverseMo = await reverseMoMeta.dataSource.getMo(id)
      if (!reverseMo) {
        if (!params?.datafill) {
          throw new Rezult(ErrorName.missing_reverse_mo, {
            moDef: this.moDef?.name,
            id: mo.id,
            field: fieldname,
            reverseId: id,
            reverseField: reverseFieldname
          })
        }
      } else {
        if (reverseFieldDef.type === 'mo') {
          reverseMo[reverseFieldname] = mo.toMoid()
        } else if (reverseFieldDef.type === 'moArray') {
          const reverseMoFields = reverseMo[reverseFieldname] as MoidInterface[]
          if (!reverseMoFields) {
            reverseMo[reverseFieldname] = [mo.toMoid()]
          } else {
            const index = reverseMoFields.findIndex(m => m.id === mo.id)
            if (index >= 0) {
              reverseMo[reverseFieldname][index] = mo.toMoid()
            } else {
              reverseMo[reverseFieldname].push(mo.toMoid())
            }
          }
        }
      }
    }
    return Promise.resolve(this.records[mo[this.keyname!]])
  }

  updateMo = async (mo: M) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    this.records[mo[this.keyname!]] = mo
    const twoWayFieldDefs = this.moDef.getFieldDefs({type: 'mo', twoWays: true})
    for (const fd of twoWayFieldDefs) {
      console.log(`==>Heap.dataSource.ts.saveMo:38 fd`, fd)
    }
    return Promise.resolve(this.records[mo[this.keyname!]])
  }

  addMo = async (mo: M) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    mo[this.keyname] = this.nextId
    this.nextId = this.nextId + 1
    this.records[mo[this.keyname]] = mo
    return mo
  }

  getMos = async (): Promise<M[]> => {
    return Object.values(this.records)
  }

  getMoids = async (): Promise<MoidInterface[]> => {
    return Object.values(this.records).map(mo => mo.toMoid())
  }

  saveMos = async (givenMos: M[]): Promise<M[]> => {
    for (const mo of givenMos) {
      this.records[mo[this.keyname!]] = mo
    }
    return givenMos
  }

  deleteMo = async (id: number | string): Promise<DeleteResult> => {
    const mo: M = this.records[id]
    // const moFieldDefs = Array.from(moMeta.moDef.fieldDefs.values()).filter(fd => fd.type === 'mo')
    // const moArrayFieldDefs = Array.from(moMeta.moDef.fieldDefs.values()).filter(fd => fd.type === 'moArray')
    const moFieldDefs = this.moDef.getFieldDefs({type: 'mo'}) as MoFieldDefinition[]
    const moArrayFieldDefs = this.moDef.getFieldDefs({type: 'moArray'}) as MoFieldDefinition[]

    // no Delete
    // const noDeleteMoFields = this.moDef.getFieldDefs({deleteCascade: DeleteCascade.noDelete}).filter(fd => !!mo[fd.name])
    const noDeleteMoFields = moFieldDefs.filter(fd => fd.relation.deleteCascade1 === DeleteCascade.noDelete && !!mo[fd.name])
    const noDeleteMoArrayFields = moArrayFieldDefs.filter(fd => fd.relation.deleteCascade1 === DeleteCascade.noDelete && !!mo[fd.name])
    const noDeleteMos = {}
    for (const fd of noDeleteMoFields) noDeleteMos[fd.name] = (mo[fd.name] as MoidInterface).toMoid()
    for (const fd of noDeleteMoArrayFields) noDeleteMos[fd.name] = (mo[fd.name].map((dmf: MoidInterface) => dmf.toMoid()))
    if (Object.keys(noDeleteMos).length > 0) {
      throw new Rezult(ErrorName.parent_instance_delete_not_allowed, {mo: this.moDef.name, id, noDeleteMos})
    }

    // Cascade
    const cascadeMoFields = moFieldDefs.filter(fd => fd.relation.deleteCascade1 === DeleteCascade.cascade && !!mo[fd.name])
    const cascadeMoArrayFields = moArrayFieldDefs.filter(fd => fd.relation.deleteCascade1 === DeleteCascade.cascade && !!mo[fd.name])
    const depMoToDelete: MoidInterface[] = []
    for (const fd of cascadeMoFields) depMoToDelete.push((mo[fd.name] as MoidInterface).toMoid())
    for (const fd of cascadeMoArrayFields) depMoToDelete.push(...(mo[fd.name].map((dmf: MoidInterface) => dmf.toMoid())))
    const results: DeleteResult = {deleted: [], errors: []}
    return Promise.allSettled(depMoToDelete.map(dmo => dmo.moMeta.dataSource.deleteMo(dmo.id)))
      .then(settled => {
        for (let i = 0; i < depMoToDelete.length; i++) {
          const res = settled[i]
          const dmo: MoidInterface = depMoToDelete[i]
          if (res.status === 'fulfilled') {
            results.deleted?.push(dmo.toMoid().toObj())
          } else {
            const rezult = (res.reason.context) ? res.reason : new Rezult(ErrorName.server_error)
            rezult.data = rezult.data || {}
            rezult.data.moname = dmo.moMeta.name
            rezult.data.id = dmo.id
            rezult.data.displayName = dmo.getDisplayName()
            results.errors?.push(rezult)
          }
        }
        return results
      })
      .then((results) => {
        results.deleted?.push(mo.toMoid().toObj())
        delete this.records[id]
        // const rezultName = results.errors? ErrorName.db_error : ErrorName.ok
        // const rezult = new Rezult(rezultName, results)
        return results
      })
  }
}

