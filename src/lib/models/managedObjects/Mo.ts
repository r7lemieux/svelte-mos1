// import type {MoDefinitionInterface} from './MoDefinitionInterface'
import type {MoMetaInterface} from './MoMetaInterface.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import type {MoInterface} from './MoInterface.js'
import {toDisplayString} from '../../services/common/util/string.utils.js'
import type {MoidInterface} from './MoidInterface.js'
import {moToObject} from '../../services/mo/moTransport.implementation.js'
import type {FieldDefinitionInterface} from '../fields/FieldDefinition.interface.js'
import {getMoMeta} from '../../services/mo/moManagement.js'
import {Moid} from './Moid.js'

// import {initMoDefDef} from './MoDefinition.js'

export class Mo implements MoInterface {

  // moMeta: MoMetaInterface
  // id: number | string = 0
  moMeta: MoMetaInterface
  id: number | string = 0
  displayName: string = ''
  _isLoaded = true

  constructor(moMeta?: MoMetaInterface, name?: string) {
    // super(Moid.moMeta)
    this.moMeta = moMeta || getDefaultMoMeta()
    this.init()
  }
  init = () => {
    // this.displayName = this.displayName || this.id?.toString() || ''
    return this as MoidInterface
  }
  getDisplayName = () => this.displayName || (this.id? this.id.toString() : '')
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

  hydrate = (partial: Partial<Mo>)=> {
    this.moMeta.moDef.objToMo(partial, {mo:this})
    this.init()
    return this
  }

  isSameAs = (mo: MoidInterface ) => this.moMeta.name === mo.moMeta.name && this.id === mo.id

}


// initMoDefDef()
//1 defaultMoMeta.moDef.moClass = Mo
