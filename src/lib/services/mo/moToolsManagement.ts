// import {MoMeta} from '../../models/managedObjects/MoMeta.js'
// import { MoMetaMo } from '../../models/managedObjects/MoMetaMo.js'
// import {MoDefinitionMo} from '../../models/managedObjects/MoDefinitionMo.js'
// import type {MoMetaInterface} from '../../models/managedObjects/MoMetaInterface.js'
// import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'
// import {MoDefinition} from '../../models/managedObjects/MoDefinition.js'
// import {moDefMoMeta} from '../../models/managedObjects/MoDefinitionMo.js'
// import {Rezult} from '../common/message/rezult.js'
// import {ErrorName} from '../common/message/errorName.js'
// // import {moMetaMoMeta} from '../../models/managedObjects/MoMetaMoDef.js'
//
//
// export const moMetas: { [name: string]: MoMetaInterface } = {}
// export const moDefs: { [name: string]: MoDefinitionInterface } = {}
//
// let nextId = 0
// export const registerMoMeta = (moMeta: MoMetaInterface):  MoMetaMo => {
//   const name = moMeta.name
//   const moDefMos: {[name:string]: MoDefinitionMo} = {}
//   // console.log(`==> moManagement.ts:21 register moMeta name `, name);
//   if (!name) throw new Rezult(ErrorName.missing_param)
//
//   let moDefMo = moDefMos[moMeta.moDef.name]
//   if (!moDefMo) {
//     moDefMo = registerMoDef(moMeta.moDef)
//   }
//   moDefMos[moMeta.moDef.name] = moDefMo
//
//   moMetas[name] = moMeta
//
// 	const moMetaMo = new MoMetaMo(MoMetaMo.moMeta)
// 	moMetaMo.id = moMetaMo.id || nextId++
// 	// moMetaMo.name = moMetaMo.name || moMetaMo.id
// 	moMetaMo.moDef = moDefMo
//
//   moMetas[name] = moMeta
// 	// moMetaMoMeta.dataSource?.saveMo(moMetaMo)
// 	return moMetaMo
// }
//
// export const registerMoDef = (moDef: MoDefinitionInterface): MoDefinitionMo => {
//   const name = moDef.name
//   if (!name) throw new Rezult(ErrorName.missing_param, {param: 'moDef.name'}, 'moManagement.registerMoDef')
//   moDefs[name] = moDef
// 	const moDefMo = new MoDefinitionMo(moDef)
// 	moDefMoMeta.dataSource?.saveMo(moDefMo)
// 	return moDefMo
// }
//
// export const getMoDef = (name: string): MoDefinition => {
//   const moDef = moDefs[name]
//   if (!moDef) throw new Rezult(ErrorName.resource_not_found, {name})
//   return moDef
// }
//
// export const getMoMeta = (name: string): MoMeta => {
//   const moMeta = moMetas[name]
//   if (!moMeta) throw new Rezult(ErrorName.resource_not_found, {name})
//   return moMeta
// }
//
// // export const getMoDefMo = (name): MoDefinition => {
// // 	const moDef = moDefs[name]
// // 	if (!moDef) throw new Rezult(ErrorName.missing_param)
// // 	return new MoDefinitionMo(moDef)
// // }
