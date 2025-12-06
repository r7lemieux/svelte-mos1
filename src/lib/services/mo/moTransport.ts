import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {FieldDefinitionInterface} from '../../models/fields/FieldDefinition.interface.js'

export const transp = {
  moidToObj: (mo: MoidInterface) => {},
  moToObject: (mo: MoInterface) => {},
  valueToObject: (value) => {},
  objectToMo: (obj: any, _moname?: string): MoInterface => { return {} as MoInterface },
  objectToMoid: (obj: any, _moname?: string): MoidInterface => {return {} as MoidInterface },
  valueToField: (fDef: FieldDefinitionInterface<any>, v: any): any | null => {}
}
