// Prototype
import type { MoInterface } from '../../models/managedObjects/MoInterface.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import {Rezult} from '../common/message/rezult.js'
export interface DataSourceInterface<M extends MoInterface> {
  getMo: (id: any) => Promise<M>
  saveMo: (mo: M) => Promise<M>
  updateMo: (mo: M) => Promise<M>
  addMo: (mo: M) => Promise<M>
  getMos: () => Promise<M[]>
  saveMos: (givenMos: M[]) => Promise<M[]>
  deleteMo: (id: string|number) => Promise<DeleteResult>
}
export interface DeleteResult {
  deleted?: MoidInterface[]
  errors?: Rezult[]
}
