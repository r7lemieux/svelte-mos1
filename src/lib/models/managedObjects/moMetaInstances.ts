// import { Mo } from './Mo.js'
// import { defaultDbService } from '../../config/config.js'
// import { ErrorName } from '../../services/common/message/errorName.js'
// import { Rezult } from '../../services/common/message/rezult.js'
// import { CacheDataSource } from '../../services/db/Cache.dataSource.js'
// import type { MoMetaInterface } from './MoMetaInterface.js'
// import type { DataSourceInterface } from '../../services/db/DataSource.interface.js'
import type { MoDefinitionInterface } from './MoDefinitionInterface.js'
import { MoDefinition } from './MoDefinition.js'
import { MoMeta } from './MoMeta.js';

let defaultMoDef
export const getDefaultMoDef = (): MoDefinition => {
    defaultMoDef = defaultMoDef || new MoDefinition('default')
    return defaultMoDef
  }
// defaultMoDef.moClass = Mo
let defaultMoMeta
export const getDefaultMoMeta = (): MoMeta => {
  defaultMoMeta = defaultMoMeta || new MoMeta(getDefaultMoDef())
  return defaultMoMeta
}
// export const moMetaDef = new MoDefinition('moMeta')
// moMetaDef.addFieldDef(from(BaseFieldDefs.Id).chainSetName('id'))
// moMetaDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('name'))
// const moDefFieldDef = from(BaseFieldDefs.Map).chainSetName('moDef')
// moDefFieldDef.itemValueType = 'object'
// moMetaDef.addFieldDef(moDefFieldDef)
// const dataSourceFieldDef = from(BaseFieldDefs.Map).chainSetName('dataSource')
// dataSourceFieldDef.itemValueType = 'object'
// moMetaDef.addFieldDef(dataSourceFieldDef)
// Object.assign(moMetaDef, {
//   name: 'moMeta',
//   dbName: 'moMeta',
//   displayName: 'Mo Meta',
//   keyFieldnames: ['name'],
//   gridFieldnames: ['name'],
//   moClass: MoMeta,
//   hasId: true,
//   idType: 'string',
//   // dataSource: new CacheDataSource(moMetaDef),
//   gdriveFilePath: 'system/resources',
//   gdriveFileId: null,
//   canCreate: false,
// })
// const moMetaDefDef = new MoDefinition('moMeta')
// moMetaDef.moDef = moMetaDef
// moMetaDef.documentToMo  = doc => {
//   const moDef = new MoDefinition('moDef', MoMeta)
//   const obj = JSON.parse(doc.json)
//   Object.assign(moDef, obj)
//   return moDef
//   //return JSON.parse(doc)
// }
// const moMetaMeta = new MoMeta(moMetaDef)
// const cacheDataSource = new HeapDataSource(this)
// cacheDataSource.keyname = 'name'
// moMetaMeta.dataSource = cacheDataSource
// export const moDefMeta: MoMetaInterface = new MoMeta(moDefDef)
//
// console.log(`==>MoMeta.ts:127 moDef`, moDef);

export const newMoMetaFromMoDef = (moDef: MoDefinitionInterface) => new MoMeta(moDef)
