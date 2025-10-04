"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMoMetaFromMoDef = exports.getDefaultMoMeta = exports.getDefaultMoDef = void 0;
var MoDefinition_js_1 = require("./MoDefinition.js");
var MoMeta_js_1 = require("./MoMeta.js");
var defaultMoDef;
var getDefaultMoDef = function () {
    defaultMoDef = defaultMoDef || new MoDefinition_js_1.MoDefinition('default');
    return defaultMoDef;
};
exports.getDefaultMoDef = getDefaultMoDef;
// defaultMoDef.moClass = Mo
var defaultMoMeta;
var getDefaultMoMeta = function () {
    defaultMoMeta = defaultMoMeta || new MoMeta_js_1.MoMeta((0, exports.getDefaultMoDef)());
    return defaultMoMeta;
};
exports.getDefaultMoMeta = getDefaultMoMeta;
// export const moMetaDef = new MoDefinition('moMeta')
// moMetaDef.addFieldDef(from(BaseFieldDefs.Id).chainSetName('id'))
// moMetaDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('name'))
// const moDefFieldDef = from(BaseFieldDefs.Map).chainSetName('moDef')
// moDefFieldDef.mapValueType = 'object'
// moMetaDef.addFieldDef(moDefFieldDef)
// const dataSourceFieldDef = from(BaseFieldDefs.Map).chainSetName('dataSource')
// dataSourceFieldDef.mapValueType = 'object'
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
var newMoMetaFromMoDef = function (moDef) { return new MoMeta_js_1.MoMeta(moDef); };
exports.newMoMetaFromMoDef = newMoMetaFromMoDef;
