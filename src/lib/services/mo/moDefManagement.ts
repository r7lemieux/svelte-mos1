import { MoMeta } from '../../models/managedObjects/MoMeta.js'
import type { MoMetaInterface } from '../../models/managedObjects/MoMetaInterface.js'
import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js'
import { MoDefinition } from '../../models/managedObjects/MoDefinition.js'
import { Rezult } from '../common/message/rezult.js'
import { ErrorName } from '../common/message/errorName.js'

export const moDefs: { [name: string]: MoDefinitionInterface } = {}

export const registerMoDef = (moDef: MoDefinitionInterface) : void => {
  const name = moDef.name
  if (!name) throw new Rezult(ErrorName.missing_param, {param: 'moDef.name'}, 'moManagement.registerMoDef')
  moDefs[name] = moDef
}

export const getMoDef = (name: string): MoDefinitionInterface => {
  const moDef = moDefs[name]
  if (!moDef) throw new Rezult(ErrorName.resource_not_found, {name})
  return moDef
}
