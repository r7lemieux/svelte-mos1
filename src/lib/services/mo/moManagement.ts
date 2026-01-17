import { MoMeta } from '../../models/managedObjects/MoMeta.js'
import type { MoMetaInterface } from '../../models/managedObjects/MoMetaInterface.js'
import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js'
import { MoDefinition } from '../../models/managedObjects/MoDefinition.js'
import { Rezult } from '../common/message/rezult.js'
import { ErrorName } from '../common/message/errorName.js'
import {moDefs} from './moDefManagement.js'

export const moMetas: { [name: string]: MoMetaInterface } = {}

export const registerMoMeta = (moMeta: MoMetaInterface): void => {
  const name = moMeta.name
  if (!name) throw new Rezult(ErrorName.missing_param)
  moMetas[name] = moMeta
  const registeredMoDef = moDefs[moMeta.moDef.name]
  if (registeredMoDef) {
    const diff = moMeta.moDef.assumeIsSameAs(registeredMoDef)
    if (diff) {
      throw new Rezult(ErrorName.mo_mismatch, diff, `registerMoMeta ${name}`)
    }
  } else {
    moDefs[moMeta.moDef.name] = moMeta.moDef
  }
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
