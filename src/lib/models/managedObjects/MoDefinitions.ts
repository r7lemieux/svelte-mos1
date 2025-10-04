import { MoDefinition, moDefDef } from './MoDefinition.js';
import {FieldDefinitionMo} from '../fields/FieldDefinitionMo.js'
import type {FieldDefinition} from '../fields/FieldDefinition.js'

export const UiMoDefs = {}
export const getUiMoDef = moDef => {
  const uiMoDef: MoDefinition = new MoDefinition(moDef.name)
  Object.assign(uiMoDef, moDef)
  uiMoDef.fieldDefs = new Map<string, FieldDefinition<any>>()
  for (const fieldDef of (Array.from(moDef.fieldDefs.values())) as FieldDefinition<any>[]) {
    const uiFieldDef = new FieldDefinitionMo(fieldDef as FieldDefinition<any>)
    uiMoDef.fieldDefs.set(fieldDef.name, uiFieldDef as unknown as FieldDefinition<any>)
  }
  return moDef
}
// export const registerMoDef = (moDef: MoDefinition) => {
//   moDefMeta.dataSource?.saveMo(moDef)
// }
// export const getMoDef = (moname:string): Promise<MoDefinition> => {
//   return moDefMeta.dataSource?.getMo(moname)
//     .then( mo => {
//       return mo as MoDefinition
//     })
// }