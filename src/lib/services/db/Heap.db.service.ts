import {DbService} from './db.service.js'
import type {Mo} from '../../models/managedObjects/Mo.js'
import {Rezult} from '../common/message/rezult.js'
import {ErrorName} from '../common/message/errorName.js'

export class HeapDbService implements DbService {
  records: {[tableName: string] : {[key:string]: Mo}} = {}

  getMo = async (moDbName: string, key: any): Promise<Mo | undefined> => {
      return this.records[moDbName][key]
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

  saveMos = async (givenMos: Mo[]): Promise<Mo[]> => {
    for (const mo of givenMos) {
      if (!mo.id) throw new Rezult(ErrorName.missing_id)
      this.records[mo.moMeta.dbName][mo.id] = mo
    }
    return givenMos
  }

  deleteMo = async (mo: Mo) => {
    if (!mo.id) throw new Rezult(ErrorName.missing_id)
    delete this.records[mo.moMeta.dbName][mo.id]
  }
}

export const heapDbService: HeapDbService = new HeapDbService()
// export const getHeapDbService = ():HeapDbService => {
//   if (!heapDbService) heapDbService = new HeapDbService()
//   return heapDbService
// }

