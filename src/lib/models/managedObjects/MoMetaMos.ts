
import { MoMeta } from './MoMeta.js'
import { moMetaMoMeta } from './MoMetaMo.js'
import type { MoMetaInterface } from './MoMetaInterface.js'
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
export const getMoMeta = (name): Promise<MoMetaInterface | undefined> => {
  return moMetaMoMeta.dataSource?.getMo(name)
    .then( mo => {
      return mo?.moMeta
    })
}