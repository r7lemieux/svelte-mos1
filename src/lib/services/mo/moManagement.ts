import {MoMeta} from '../../models/managedObjects/MoMeta.js'
import { MoMetaMo, moMetaMoMeta } from '../../models/managedObjects/MoMetaMo.js'
import {MoDefinitionMo} from '../../models/managedObjects/MoDefinitionMo.js'
import type { MoMetaInterface} from '../../models/managedObjects/MoMetaInterface.js'
import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'
import {MoDefinition} from '../../models/managedObjects/MoDefinition.js'
import { moDefMoMeta } from '../../models/managedObjects/MoDefinitionMo.js'
import {Rezult} from '../common/message/rezult.js'
import {ErrorName} from '../common/message/errorName.js'


export const moMetas: {[name:string]: MoMetaInterface} = {}
export const moDefs: {[name:string]: MoDefinitionInterface} = {}

export const registerMoMeta = (moMeta: MoMetaInterface) => {
	const name = moMeta.name
	if (!name) throw new Rezult(ErrorName.missing_param)
	const moDefMo = registerMoDef(moMeta.moDef)

	moMetas[name] = moMeta

	const moMetaMo = new MoMetaMo(moMetaMoMeta)
	// moMetaMo.id = moMetaMo.id || nextId++
	moMetaMo.id = moMetaMo.id || moMeta.name
	// moMetaMo.name = moMetaMo.name || moMetaMo.id
	moMetaMo.moDef = moDefMo

	moMetas[name] = moMeta
	moMetaMoMeta.dataSource?.saveMo(moMetaMo)
}

export const registerMoDef = (moDef: MoDefinitionInterface): MoDefinitionMo => {
	const name = moDef.name
	if (!name) throw new Rezult(ErrorName.missing_param)
	moDefs[name] = moDef
	const moDefMo = new MoDefinitionMo(moDef)
	moDefMoMeta.dataSource?.saveMo(moDefMo)
	return moDefMo
}

export const getMoMetaMo = (name): MoMeta => {
	const moMeta = moMetas[name]
	if (!moMeta) throw new Rezult(ErrorName.missing_param)
	return new MoMetaMo(moMeta)
}

// export const getMoDefMo = (name): MoDefinition => {
// 	const moDef = moDefs[name]
// 	if (!moDef) throw new Rezult(ErrorName.missing_param)
// 	return new MoDefinitionMo(moDef)
// }
