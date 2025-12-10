import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {FieldDefinitionInterface} from '../../models/fields/FieldDefinition.interface.js'

export interface objectToMoParameters {
  _moname?: string
  mo? : MoInterface
}
export const transp = {
  moidToObj: (mo: MoidInterface) => {},
  moToObject: (mo: MoInterface) => {},
  valueToObject: (value) => {},
  objectToMo: (obj: any, params?: objectToMoParameters): MoInterface => { return {} as MoInterface },
  objectToMoid: (obj: any, params?: objectToMoParameters): MoidInterface => {return {} as MoidInterface },
  valueToField: (fDef: FieldDefinitionInterface<any>, v: any): any | null => {}
}
