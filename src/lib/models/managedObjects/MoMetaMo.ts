// import { Mo } from './Mo.js'
import type { MoMetaInterface } from './MoMetaInterface.js'
import type { DataSourceInterface } from '../../services/db/DataSource.interface.js'
import type { MoDefinitionInterface } from './MoDefinitionInterface.js'
import { MoMeta } from './MoMeta.js'
import { moDefDef, MoDefinition } from './MoDefinition.js'
import { BaseFieldDefs, CommonFieldDefs } from '../fields/CommonFieldDefinition.js'
import { from } from '../fields/FieldDefinition.js'
import { HeapDataSource } from '../../services/db/Heap.dataSource.js'
import { Mo } from './Mo.js';
import type { MoInterface } from './MoInterface.js'

export class MoMetaMo extends Mo implements MoMetaInterface {
  name: string
  dbName: string
  moDef: MoDefinitionInterface
  dataSource: DataSourceInterface<MoInterface>

  constructor(moMeta: MoMetaInterface) {
    super({} as MoMetaInterface)
    this.moMeta = moMetaMoMeta
    this.moDef = moMeta.moDef
    this.dataSource = moMeta.dataSource
    this.name = moMeta.name
    this.dbName = moMeta.dbName || this.name
  }
  init = () => {}
  setName = (name?: string): MoMetaInterface => {return this}

  toDisplayString = () => this.name || this.moDef.name
  newMo = (): MoInterface => {
    const moClass: MoInterface = this.moDef.moClass || Mo
    const mo: MoInterface = new (moClass as unknown as typeof Mo)(this)
    // const mo: Mo = new moClass({moDef: this} as MoMetaInterface)
    return mo
  }
  objToMo = (obj: any): MoInterface => this.newMo().setProps(obj)
  documentToMo = (doc: any): MoInterface => {
    const mo = this.newMo()
    for (const [fname, fDef] of Array.from(this.moDef.fieldDefs.entries())) {
      mo[fname] = fDef.documentToValue(doc[fname])
    }
    return mo
  }
  moToObj = (mo: any): any => this.moDef.moToObj(mo)
  moToDocument = mo => this.moDef.moToDocument(mo)
  static fromMoDef = (moDef: MoDefinitionInterface) => new MoMeta(moDef)

  /*  ---------
   *  Accessors
   *  ---------
   */
  getDisplayName = () => this.moDef.getDisplayName()
}

export const moMetaMoDef = new MoDefinition('moMeta')
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
moMetaMoDef.documentToMo = doc => {
  const moMetaMo = new MoMetaMo({} as MoMetaInterface)
  const obj = JSON.parse(doc.json)
  Object.assign(moMetaMo, obj)
  return moMetaMo
}
const cacheDataSource = new HeapDataSource(moMetaMoDef)
cacheDataSource.keyname = 'name'
moMetaMoMeta.dataSource = cacheDataSource