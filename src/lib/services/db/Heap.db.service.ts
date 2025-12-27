import {DbService} from './db.service.js'
import type {Mo} from '../../models/managedObjects/Mo.js'
import {Rezult} from '../common/message/rezult.js'
import {ErrorName} from '../common/message/errorName.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'

export class HeapDbService implements DbService {
  records: {[tableName: string] : {[key:string]: Mo}} = {}

  getMo = async (moDbName: string, key: any): Promise<Mo | undefined> => {
      return this.records[moDbName][key]
  }
  getMoid = async (moDbName: string, key: any): Promise<MoidInterface | undefined> => {
    return this.records[moDbName][key]?.toMoid()
  }
  saveMo = async (mo: Mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    if (!mo.id) throw new Rezult(ErrorName.missing_id)
    this.records[mo.moMeta.name][mo.id] = mo
    return mo
  }

  updateMo = async (mo: Mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    if (!mo.id) throw new Rezult(ErrorName.missing_id)
    this.records[mo.moMeta.dbName][mo.id] = mo
    return mo
  }

  addMo = async (mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    this.records[mo.moMeta.dbName][mo.id] = mo
    return mo
  }

  getMos = async (moDbName: string): Promise<Mo[]> => {
    return Object.values(this.records[moDbName])
  }

  getMoids = async (moDbName: string): Promise<MoidInterface[]> => {
    return Object.values(this.records[moDbName]).map(mo => mo.toMoid())
  }

  saveMos = async (givenMos: Mo[]): Promise<Mo[]> => {
    for (const mo of givenMos) {
      if (!mo.id) throw new Rezult(ErrorName.missing_id)
      this.records[mo.moMeta.dbName][mo.id] = mo
    }
    return givenMos
  }

  deleteMo = async (mo: Mo) => {
    if (!mo.id) throw new Rezult(ErrorName.missing_id)
    let childStopsDelete = false
    // const moFieldDefs = Array.from(moMeta.moDef.fieldDefs.values()).filter(fd => fd.type === 'mo')
    // const moArrayFieldDefs = Array.from(moMeta.moDef.fieldDefs.values()).filter(fd => fd.type === 'moArray')
    // const moFieldDefs = moDef.getFieldDefs({type:'mo'})
    // const moArrayFieldDefs = moMeta.moDef.getFieldDefs({type:'mo'})
    // for (const fieldDef of moFieldDefs) {
    //   const moFieldDef = fieldDef as MoFieldDefinition
    //   if (moFieldDef.deleteCascade === DeleteCascade.noDelete) {
    //     throw new Rezult(ErrorName.parent_instance_delete_not_allowed, {moname: moMeta.name, id})
    //   }
    //   if (moFieldDef.deleteCascade === DeleteCascade.cascade) {
    //
    //   }
    // }
    //
    // delete this.records[mo.moMeta.dbName][mo.id]
  }
}

export const heapDbService: HeapDbService = new HeapDbService()
// export const getHeapDbService = ():HeapDbService => {
//   if (!heapDbService) heapDbService = new HeapDbService()
//   return heapDbService
// }

