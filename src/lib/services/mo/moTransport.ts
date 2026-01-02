import type {MoidInterface, ToMoParams} from '../../models/managedObjects/MoidInterface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {FieldDefinitionInterface} from '../../models/fields/FieldDefinition.interface.js'

export interface objectToMoParameters extends ToMoParams {
  _moname?: string
  _moid?: boolean
  mo? : MoInterface
  trusted?: boolean
}
export const transp = {
  moidToObj: (mo: MoidInterface): any => {throw new Error('transp is not initialized')},
  moToObject: (mo: MoInterface): any => {throw new Error('transp is not initialized')},
  valueToObject: (value: any): any => {throw new Error('transp is not initialized')},
  objectToMo: (obj: any, params?: objectToMoParameters): Promise<MoInterface> => {return Promise.reject('transp is not initialized') },
  objectToMoid: (obj: any, params?: objectToMoParameters): Promise<MoidInterface> => {return Promise.reject('transp is not initialized') },
  valueToField: (fDef: FieldDefinitionInterface<any>, v: any, params?:objectToMoParameters): Promise<any> => { return Promise.reject('transp is not initialized')},
  objectToMoidSync: (obj: any, params?: objectToMoParameters): MoidInterface => { throw new Error('transp is not initialized') },
  valueToFieldSync: (fDef: FieldDefinitionInterface<any>, v: any, params?:objectToMoParameters): any => { throw new Error('transp is not initialized') }
}
