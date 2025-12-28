// import { Mo } from './Mo.js'
import type {MoMetaInterface} from './MoMetaInterface.js'
import type {DataSourceInterface} from '../../services/db/DataSource.interface.js'
import type {MoDefinitionInterface} from './MoDefinitionInterface.js'
import {MoMeta} from './MoMeta.js'
import {moDefDef, MoDefinition} from './MoDefinition.js'
import {BaseFieldDefs, CommonFieldDefs} from '../fields/CommonFieldDefinition.js'
import {from} from '../fields/FieldDefinition.js'
import {HeapDataSource} from '../../services/db/Heap.dataSource.js'
import {Mo} from './Mo.js'
import type {MoInterface} from './MoInterface.js'
import type {MoidInterface} from './MoidInterface.js'
import {toDisplayString} from '../../services/common/util/string.utils.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import {Moid} from './Moid.js'

export class MoMetaMo implements MoidInterface, MoMetaInterface {
  moMeta: MoMeta
  id: number = 0
  displayName: string = ''
  name: string
  dbName: string
  moDef: MoDefinitionInterface
  dataSource: DataSourceInterface<MoInterface>
  _isLoaded = true

  constructor(moMeta: MoMetaInterface) {
    this.moMeta = MoMetaMo.moMeta
    this.moDef = moMeta.moDef
    this.dataSource = moMeta.dataSource
    this.name = moMeta.name
    this.displayName = toDisplayString(this.name)
    this.dbName = moMeta.dbName || this.name
  }
  init = () => this
  setName = (name?: string): MoMetaInterface => {return this}
  isSameAs = (mo: any) => {
    if (!mo) return false
    if (!mo.moMeta) return false
    return this.moMeta.name === mo.moMeta.name && this.id === mo.id
  }

  newMo = (): MoInterface => {
    const moClass: MoInterface = this.moDef.moClass || Mo
    const mo: MoInterface = new (moClass as unknown as typeof Mo)(this)
    // const mo: Mo = new moClass({moDef: this} as MoMetaInterface)
    return mo
  }
  objToMoid = (obj: any, mo?:MoInterface): Promise<MoidInterface> => {
    const newMo = this.newMo().setProps(obj)
    return Promise.resolve(newMo)
  }
  objToMo = (obj: any, mo?:MoInterface): Promise<MoInterface> => {
    const newMo = this.newMo().setProps(obj)
    return Promise.resolve(newMo)
  }
  documentToMo = (doc: any): MoInterface => {
    const mo = this.newMo()
    for (const [fname, fDef] of Array.from(this.moDef.fieldDefs.entries())) {
      mo[fname] = fDef.documentToValue(doc[fname])
    }
    return mo
  }
  moToObj = (mo: any): any => this.moDef.moToObj(mo)
  moToDocument = mo => this.moDef.moToDocument(mo)
  // moidToMo = (moid: MoidInterface): Promise<MoInterface> => this.dataSource.getMo(moid.id)
  // moToMoid = (mo: MoInterface): MoidInterface => mo
  moidToMo = (moid: MoidInterface): Promise<MoInterface> => this.dataSource.getMo(moid.id)
  moToMoid = (mo: MoInterface): MoidInterface => mo
  toMoid = () => new Moid(this as MoMeta,0)
  toDocument =  () => ''
  toObj = () => {}
  static fromMoDef = (moDef: MoDefinitionInterface) => new MoMeta(moDef)
  static moMeta = {} as MoMeta // taking a wild chance expecting MoMetaMoDef to fill it before anyone uses it.

  /*  ---------
   *  Accessors
   *  ---------
   */
  getDisplayName = () => this.moDef.getDisplayName()
}
