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
  init = () => {}
  setName = (name?: string): MoMetaInterface => {return this}

  newMo = (): MoInterface => {
    const moClass: MoInterface = this.moDef.moClass || Mo
    const mo: MoInterface = new (moClass as unknown as typeof Mo)(this)
    // const mo: Mo = new moClass({moDef: this} as MoMetaInterface)
    return mo
  }
  objToMoid = (obj: any): MoidInterface => this.newMo().setProps(obj)
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
  // moidToMo = (moid: MoidInterface): Promise<MoInterface> => this.dataSource.getMo(moid.id)
  // moToMoid = (mo: MoInterface): MoidInterface => mo
  moidToMo = (moid: MoidInterface): Promise<MoInterface> => this.dataSource.getMo(moid.id)
  moToMoid = (mo: MoInterface): MoidInterface => mo
  toDocument =  () => ''

  static fromMoDef = (moDef: MoDefinitionInterface) => new MoMeta(moDef)
  static moMeta = {} as MoMeta // taking a wild chance expecting MoMetaMoDef to fill it before anyone uses it.

  /*  ---------
   *  Accessors
   *  ---------
   */
  getDisplayName = () => this.moDef.getDisplayName()
}
