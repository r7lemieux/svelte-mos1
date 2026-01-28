import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'
import {Rezult} from '../common/message/rezult.js'
import {ErrorName} from '../common/message/errorName.js'
import type {DataSourceInterface, DeleteMoParams, DeleteResult, SaveMoParams} from './DataSource.interface.js'
import {type MoFieldDefinition} from '../../models/fields/MoFieldDefinition.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import {RelationMetas} from '../../models/managedObjects/RelationMeta.js'
import {DeleteCascade} from '../../models/managedObjects/RelationDefinitionInterface.js'


export class HeapDataSource<M extends MoInterface> implements DataSourceInterface<M> {
    moDef: MoDefinitionInterface
    records: {
        [key: string]: M
    } = {}
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
        const oldMo = this.records[mo.id]
        const moMeta = mo._moMeta
        this.records[mo[this.keyname!]] = mo
        const relations = RelationMetas[moMeta.name]
        if (!relations) {
            console.log(`==>Heap.dataSource.ts.saveMo:40 No relations for ${this.moDef?.name} `)
        }
        // console.log(`==>Heap.dataSource.js:32  relations`, relations)
        const twoWaysRelation = Object.values(RelationMetas[moMeta.name]).filter(rel => !!rel.reverse)
        for (const relation of twoWaysRelation) {
            const relationDef = relation.relationDef
            const fieldname1 = relationDef.fieldDef1.name
            const fieldname2 = relationDef.fieldDef2!.name

            if (relationDef.max1 < 2) {
                // console.log(`==>Heap.dataSource.ts.saveMo:38 ${fieldname} reverseName`, reverseFieldname)
                const relMoid = mo[fieldname1]
                if (!relMoid && relationDef.min1 > 0) {
                    // Cannot turn that check on until I resolve 1:1 creation
                    // throw new Rezult(ErrorName.missing_value, {
                    //     moDef: this.moDef?.name,
                    //     id: mo.id,
                    //     displayName: mo.displayName,
                    //     field: fieldname
                    // }, 'HeapDataSource.saveMo missing value for relation min')
                }
                if (relMoid) {
                    const mo2id = mo[fieldname1].id
                    if (oldMo[fieldname1].id === mo2id) continue
                    const fieldDef2 = relationDef.fieldDef2!
                    const reverseMo = await relation.moMeta2.dataSource.getMo(mo2id)
                    if (!reverseMo) {
                        if (!params?.datafill) {
                            throw new Rezult(ErrorName.missing_reverse_mo, {
                                moDef: this.moDef?.name,
                                id: mo.id,
                                field: fieldname1,
                                reverseId: mo2id,
                                reverseField: fieldname2
                            })
                        }
                    } else {
                        if (fieldDef2.type === 'mo') {
                            reverseMo[fieldname2] = mo.toMoid()
                        } else if (fieldDef2.type === 'moArray') {
                            const reverseMoFields = reverseMo[fieldname2] as MoidInterface[]
                            if (!reverseMoFields) {
                                reverseMo[fieldname2] = [mo.toMoid()]
                            } else {
                                const index = reverseMoFields.findIndex(m => m.id === mo.id)
                                if (index >= 0) {
                                    reverseMo[fieldname2][index] = mo.toMoid()
                                } else {
                                    reverseMo[fieldname2].push(mo.toMoid())
                                }
                            }
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

    deleteMo = async (id: number | string, params: DeleteMoParams = {pendingDeletes:[], pendingUpdates:[]}): Promise<DeleteResult> => {
        const mo: M = this.records[id]
        const moStr = mo.toShortStr()
        if (params.pendingDeletes.includes(moStr)) return Promise.resolve({})
        params.pendingDeletes.push(mo.toShortStr())

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
        let depMoToDelete: MoidInterface[] = []
        for (const fd of cascadeMoFields) depMoToDelete.push((mo[fd.name] as MoidInterface).toMoid())
        for (const fd of cascadeMoArrayFields) depMoToDelete.push(...(mo[fd.name].map((dmf: MoidInterface) => dmf.toMoid())))
        depMoToDelete = depMoToDelete.filter(m => !params.pendingDeletes.includes(m.toShortStr()))
        depMoToDelete.forEach(m => params.pendingDeletes.push(m.toShortStr()))

        const results: DeleteResult = {deleted: [], errors: []}
        return Promise.allSettled(depMoToDelete.map(dmo => dmo._moMeta.dataSource.deleteMo(dmo.id, params)))
            .then(settled => {
                for (let i = 0; i < depMoToDelete.length; i++) {
                    const res = settled[i]
                    const dmo: MoidInterface = depMoToDelete[i]
                    if (res.status === 'fulfilled') {
                        results.deleted?.push(dmo.toMoid().toObj())
                    } else {
                        const rezult = (res.reason.context) ? res.reason : new Rezult(ErrorName.server_error)
                        rezult.data = rezult.data || {}
                        rezult.data.moname = dmo._moMeta.name
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
            .then((results: DeleteResult) => {
                const twoWayRelations = Object.values(mo._moMeta.relations).filter(rel => rel.relationDef.fieldDef2)
                //const depMoToUpdate: Promise<MoInterface>[] = twoWayRelations.map(rel => mo[rel.relationDef.fieldDef1.name])
                const depMoToUpdate: Promise<MoInterface>[] = twoWayRelations.map(rel => {
                    const relDef = rel.relationDef
                    let mosToUpdate: MoidInterface[] = (relDef.max1 > 1) ? mo[relDef.fieldDef1.name] : [mo[relDef.fieldDef1.name]]
                    mosToUpdate = mosToUpdate.filter(m => !params.pendingUpdates.includes(m.toShortStr()+'_'+moStr))
                    mosToUpdate.forEach(m => {
                        params.pendingUpdates.push(moStr+'_'+m.toShortStr())
                        params.pendingUpdates.push(m.toShortStr()+'_'+moStr)
                    })
                    return mosToUpdate.map(m => {
                        return rel.moMeta2.dataSource.getMo(m.id)
                            .then(mo2 => {
                                const fieldname2 = relDef.fieldDef2!.name
                                if (relDef.max2 > 1) {
                                    const field2Value: MoidInterface[] = mo2[fieldname2]
                                    const index = field2Value.findIndex(m => m.id === mo2.id)
                                    field2Value.splice(index, 1)
                                } else {
                                    mo2[fieldname2] = undefined
                                }
                                return rel.moMeta2.dataSource.saveMo(mo2, {pending: params.pendingUpdates})
                            })
                    })
                }).flat(3)
                return Promise.allSettled(depMoToUpdate)
                    .then(settled => {
                        for (let i = 0; i < settled.length; i++) {
                            const res = settled[i]
                            if (res.status === 'fulfilled') {
                                results.updated?.push(res.value.toMoid().toObj())
                            } else {
                                const rezult = (res.reason.context) ? res.reason : new Rezult(ErrorName.server_error, {
                                    moname: mo._moMeta.name,
                                    id: mo.id,
                                    displayName: mo.getDisplayName(),
                                    reason: res.reason.toString(),
                                    message: res.reason.message,
                                }, 'delete update dependent ' + res.reason.context)
                                results.errors?.push(rezult)
                            }
                        }
                        return results
                    })
            })
    }
}

