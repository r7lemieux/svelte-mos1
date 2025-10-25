import {MoMeta} from './MoMeta.js'
import {moDefDef, MoDefinition} from './MoDefinition.js'
import {BaseFieldDefs, CommonFieldDefs} from '../fields/CommonFieldDefinition.js'
import {from} from '../fields/FieldDefinition.js'
import {HeapDataSource} from '../../services/db/Heap.dataSource.js'
import {MoMetaMo} from './MoMetaMo.js'

const moMetaMoDef = new MoDefinition('moMeta')
moMetaMoDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('name'))
const moDefFieldDef = from(CommonFieldDefs.mo).chainSetName('moDef')
moDefFieldDef.mapValueType = 'object'
moMetaMoDef.addFieldDef(moDefFieldDef)
const dataSourceFieldDef = from(BaseFieldDefs.Object).chainSetName('dataSource')
dataSourceFieldDef.mapValueType = 'object'
moMetaMoDef.addFieldDef(dataSourceFieldDef)
Object.assign(moMetaMoDef, {
  name: 'moMeta',
  dbName: 'moMetas',
  moDef: moDefDef,
})
export const moMetaMoMeta = new MoMeta(moMetaMoDef)
moMetaMoMeta.moDef.name = 'moMeta'
moMetaMoMeta.name = 'moMeta'
// moMetaMoDef.documentToMo = doc => {
//   const moMetaMo = new MoMetaMo({} as MoMetaInterface)
//   const obj = JSON.parse(doc.json)
//   Object.assign(moMetaMo, obj)
//   return moMetaMo
// }
const cacheDataSource = new HeapDataSource(moMetaMoDef)
cacheDataSource.keyname = 'name'
moMetaMoMeta.dataSource = cacheDataSource

MoMetaMo.moMeta = moMetaMoMeta