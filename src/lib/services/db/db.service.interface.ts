// Prototype
import type { Mo } from '../../models/managedObjects/Mo.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
// import type {MoDefinition} from '../../models/managedObjects/MoDefinition.js'
// import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js';
// import type {DataSource} from './DataSource.js'

export interface DbServiceInterface {
  // getDataSource: (moDef: MoDefinitionInterface) => DataSource<Mo>
  getMo: (moDbName: string, id: any) => Promise<Mo | undefined>
  getMoid: (moDbName: string, id: any) => Promise<MoidInterface | undefined>
  addMo: (mo: Mo) => Promise<Mo>
  saveMo: (mo: Mo) => Promise<Mo>
  updateMo: (mo: Mo) => Promise<Mo>
  getMos: (moDbName: string) => Promise<Mo[]>
  getMoids: (moDbName: string) => Promise<MoidInterface[]>
  saveMos: (mos: Mo[]) => Promise<Mo[]>
  deleteMo: (mo: Mo) => Promise<void>
}
