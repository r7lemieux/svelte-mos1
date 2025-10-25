// import type {MoDefinitionInterface} from './MoDefinitionInterface'
import type {MoMetaInterface} from './MoMetaInterface.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import type {MoInterface} from './MoInterface.js'
import {toDisplayString} from '../../services/common/util/string.utils.js'
import type {MoidInterface} from './MoidInterface.js'
import {moToObject} from '../../services/common/util/mo.utils.js'

// import {initMoDefDef} from './MoDefinition.js'

export class Mo implements MoInterface {

  // moMeta: MoMetaInterface
  // id: number | string = 0
  moMeta: MoMetaInterface
  id: number | string = 0
  displayName: string = ''

  constructor(moMeta?: MoMetaInterface, name?: string) {
    // super(Moid.moMeta)
    this.moMeta = moMeta || getDefaultMoMeta()
    this.displayName = toDisplayString(name || this.id ? this.id.toString() : '')
  }

  getDisplayName = () => this.displayName
  // constructor(moMeta?: MoMetaInterface) {
  //   super(moMeta || getDefaultMoMeta(), 0)
  //   //this.moMeta = moMeta || getDefaultMoMeta()
  // }

  // getDisplayName = () => {
  //   const fieldText: string = '' + (this['name'] || this.id)
  //   return toDisplayString(fieldText)
  // }

  setProps = (props: any): Mo => {
    for (const key of Object.getOwnPropertyNames(props)) {
      // if (key != 'fieldDefs') {
      this[key] = props[key]
      // }
    }
    return this
  }
  toObj = () => moToObject(this)

  toDocument = () => {
    const data: any = {}
    if (this.id) data.id = this.id
    for (const fname of Array.from(this.moMeta.moDef.fieldDefs.keys())) {
      const fieldDef = this.moMeta.moDef.fieldDefs.get(fname)
      const value = this[fname]
      if (value !== undefined && value !== null) {
        data[fname] = fieldDef?.valueToDocument(this[fname])
      }
    }
    return data
  }
  toMoid = (): MoidInterface => this as MoidInterface
  toMo = () => new Promise<MoInterface>((r) => r(this))

  hydrate(partial: Partial<Mo>) {
    // noinspection TypeScriptValidateTypes
    Object.assign(this, partial)
  }
}

// initMoDefDef()
//1 defaultMoMeta.moDef.moClass = Mo
