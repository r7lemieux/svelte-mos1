import { MoDefinition } from './MoDefinition.js';
import { MoDefinitionMo } from './MoDefinitionMo.js';
import { moDefMoMeta } from './MoDefinitionMo.js';


// export const registerMoDef = (moDef: MoDefinition) => {
//   const moDefMo = new MoDefinitionMo(moDef)
//   moDefMo.name = moDef.id = moDef.name
//   moDefMoMeta.dataSource?.saveMo(moDefMo)
// }
export const getMoDefMo = async (moname:string): Promise<MoDefinition> => {
  return moDefMoMeta.dataSource?.getMo(moname)
    .then( mo => {
      return mo as MoDefinitionMo
    })
}