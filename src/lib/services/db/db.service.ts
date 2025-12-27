// Prototype
import type {Mo} from '../../models/managedObjects/Mo.js'
import {Rezult} from  '../common/message/rezult.js'
import {ErrorName} from  '../common/message/errorName.js'
import type {DbServiceInterface} from './db.service.interface.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'

// import type {MoMeta} from '../../models/managedObjects/MoMeta.js'
// import type {MoDefinition} from '../../models/managedObjects/MoDefinition.js'
// import type {DataSource} from  './DataSource.js'
// import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js';

export class DbService implements DbServiceInterface{

  getMo = async(moDbName: string, id: any): Promise<Mo | undefined> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
  getMoid = async(moDbName: string, id: any): Promise<MoidInterface | undefined> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
  addMo = async(mo: Mo): Promise<Mo> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
  saveMo = async(mo: Mo): Promise<Mo> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
  updateMo = async(mo: Mo): Promise<Mo> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
  deleteMo = async(mo: Mo): Promise<void> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
  getMos = async (moDbName: string): Promise<Mo[]> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
  getMoids = async (moDbName: string): Promise<MoidInterface[]> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
  saveMos = (mos: Mo[]): Promise<Mo[]> =>
    Promise.reject(new Rezult(ErrorName.missing_implementation))
}
