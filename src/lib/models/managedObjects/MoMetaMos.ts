
import { MoMeta } from './MoMeta.js'
import {MoMetaMo} from './MoMetaMo.js'
import {moMetaMoMeta} from './MoMetaMoDef.js'
import type { MoMetaInterface } from './MoMetaInterface.js'
import {Rezult} from '../../services/common/message/rezult.js'
import {ErrorName} from '../../services/common/message/errorName.js'
// import { MoMetaMo } from './MoMetaMo.js'
// import { Rezult } from '../../services/common/message/Rezult.js'
// import { ErrorName } from '../../services/common/message/ErrorName.js'
// import {FieldDefinitionMo} from '../fields/FieldDefinitionMo'
// import type {FieldDefinition} from '../../fields/FieldDefinition'
// import { MoDefinitionMo } from './MoDefinitionMo.js'


// export const registerMoMeta = (moMeta: MoMeta) => {
//   const moMetaMo = new MoMetaMo(moMeta)
//   const moDefMo = new MoDefinitionMo(moMeta.moDef)
//   // moMetaMo.id = moMetaMo.id || nextId++
//   moMetaMo.id = moMetaMo.id || moMeta.name
//   moMetaMo.name = moMetaMo.name || moMetaMo.id
//   moMetaMo.moDef = moDefMo
//   moMetaMoMeta.dataSource?.saveMo(moMetaMo)
// }
// export const getMoMetaMo = (name): Promise<MoMetaMo> => {
//   return moMetaMoMeta.dataSource?.getMo(name)
//     .then( mo => {
//       return mo as MoMetaMo
//     })
// }

// export const getMoMetaMo = (name): Promise<MoMetaMo> => {
//   const moMetaMo = moMetaMoMeta.dataSource.getMo(name) as Promise<MoMetaMo>
//   if (!moMetaMo) throw new Rezult(ErrorName.missing_param, {name})
//   return moMetaMo
// }