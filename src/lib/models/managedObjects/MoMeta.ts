import { Mo } from './Mo.js'
import { defaultDbService } from '../../config/config.js'
import { ErrorName } from '../../services/common/message/errorName.js'
import { Rezult } from '../../services/common/message/rezult.js'
import { CacheDataSource } from '../../services/db/Cache.dataSource.js'
import type { MoMetaInterface } from './MoMetaInterface.js'
import type { DataSourceInterface } from '../../services/db/DataSource.interface.js'
import type { MoDefinitionInterface } from './MoDefinitionInterface.js'
import type { MoInterface } from './MoInterface.js'
import { MoDefinition } from './MoDefinition.js'
import {HeapDataSource} from '../../services/db/Heap.dataSource.js'

export class MoMeta implements MoMetaInterface {
  name: string = ''
  dbName: string = ''
  moDef: MoDefinitionInterface
  dataSource: DataSourceInterface<MoInterface>

  constructor(moDef: MoDefinitionInterface, dbName?: string) {
    if (!moDef) {
      throw new Rezult(ErrorName.argument_null, {name})
    }
    this.moDef = moDef

    this.dataSource = new HeapDataSource(this.moDef)
    this.setName()
    this.dbName = dbName || this.name
    this.init()
  }

  static fromMoDef = (moDef: MoDefinition) => new MoMeta(moDef)

  /* ------------
   * Construction
   * ------------
   */
  init() {
  }

  setName = (given_name?: string) => {
    let name = ''
    if (given_name) {
      if (!given_name.match(/[A-Za-z-1-9]/)) throw new Rezult(ErrorName.field_invalid, {
        method: 'MoMeta.extractFieldnamesFromMo',
        name: given_name,
      })
      name = given_name
    // } else if (this.dataSource && this.dataSource.name) {
    //   name = this.moDef.name + '.' + this.dataSource.name
    } else if (this.moDef.name) {
      name = this.moDef.name
    } else {
      name = this.dbName
    }
    //Todo ensure name is unique
    this.name = name
  }

  /*  ---------
   *  Accessors
   *  ---------
   */
  getDisplayName = () => this.name

  /*  --
   *  Mo
   *  These methods delegate to MoDef by default
   *  in order to share MoDef behavior
   *  They add the dataSource management
   *  They can be overridden
   *  --
   */
  newMo = () => {
    const mo: MoInterface = this.moDef.newMo()
    mo.moMeta = this
    this.dataSource.addMo(mo)
    return mo
  }
  moToObj = (mo: MoInterface): any => this.moDef.moToObj(mo)
  moToDocument = (mo: MoInterface): any => this.moDef.moToDocument(mo)
  objToMo = (obj: any): MoInterface => this.moDef.objToMo(obj)
  toDocument = (): string => {
    return '' //todo
  }
  documentToMo = (doc: any): MoInterface => {
    const mo = this.newMo()
    for (const [fname, fDef] of Array.from(this.moDef.fieldDefs.entries())) {
      mo[fname] = fDef.documentToValue(doc[fname])
    }
    return mo
  }
}

