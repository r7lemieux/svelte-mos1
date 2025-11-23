import { MoMeta } from '../../models/managedObjects/MoMeta.js'
import type { MoMetaInterface } from '../../models/managedObjects/MoMetaInterface.js'
import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js'
import { MoDefinition } from '../../models/managedObjects/MoDefinition.js'
import { Rezult } from '../common/message/rezult.js'
import { ErrorName } from '../common/message/errorName.js'

export const moMetas: { [name: string]: MoMetaInterface } = {}
export const moDefs: { [name: string]: MoDefinitionInterface } = {}

let nextId = 0
export const registerMoMeta = (moMeta: MoMetaInterface): void => {
  const name = moMeta.name
  // console.log(`==> moManagement.ts:21 register moMeta name `, name);
  if (!name) throw new Rezult(ErrorName.missing_param)

  moMetas[name] = moMeta
}

export const registerMoDef = (moDef: MoDefinitionInterface) : void => {
  const name = moDef.name
  if (!name) throw new Rezult(ErrorName.missing_param, {param: 'moDef.name'}, 'moManagement.registerMoDef')
  moDefs[name] = moDef
}

export const getMoDef = (name: string): MoDefinition => {
  const moDef = moDefs[name]
  if (!moDef) throw new Rezult(ErrorName.resource_not_found, {name})
  return moDef
}

export const getMoMeta = (name: string): MoMeta => {
  const moMeta = moMetas[name]
  if (!moMeta) throw new Rezult(ErrorName.resource_not_found, {name})
  return moMeta
}

// export const getMoDefMo = (name): MoDefinition => {
// 	const moDef = moDefs[name]
// 	if (!moDef) throw new Rezult(ErrorName.missing_param)
// 	return new MoDefinitionMo(moDef)
// }
