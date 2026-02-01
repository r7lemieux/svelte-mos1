// import type {MoDefinitionInterface} from './MoDefinitionInterface'
import type {MoMetaInterface} from './MoMetaInterface.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import type {MoInterface} from './MoInterface.js'
import type {MoidInterface} from './MoidInterface.js'
import {moToObject} from '../../services/mo/moTransport.implementation.js'
import {Moid} from './Moid.js'

// import {initMoDefDef} from './MoDefinition.js'

export class Mo implements MoInterface {

  // moMeta: MoMetaInterface
  // id: number | string = 0
  _moMeta: MoMetaInterface
  id: number | string = 0
  displayName: string = ''
  _isLoaded = true

  constructor(moMeta?: MoMetaInterface, name?: string) {
    // super(Moid._moMeta)
    this._moMeta = moMeta || getDefaultMoMeta()
    this.init()
  }
  init = () => {
    // this.displayName = this.displayName || this.id?.toString() || ''
    return this as MoidInterface
  }
  getDisplayName = () => this.displayName || (this.id? this.id.toString() : '')
  // constructor(moMeta?: MoMetaInterface) {
  //   super(moMeta || getDefaultMoMeta(), 0)
  //   //this._moMeta = moMeta || getDefaultMoMeta()
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
  toShortStr = () => this._moMeta.name + '-' + this.id.toString()

  toObj = () => moToObject(this)

  toDocument = () => {
    const data: any = {}
    if (this.id) data.id = this.id
    for (const fname of Array.from(this._moMeta.moDef.fieldDefs.keys())) {
      const fieldDef = this._moMeta.moDef.fieldDefs.get(fname)
      const value = this[fname]
      if (value !== undefined && value !== null) {
        data[fname] = fieldDef?.valueToDocument(this[fname])
      }
    }
    return data
  }
  toMoid = (): MoidInterface => new Moid(this._moMeta, this.id, this.getDisplayName()) // this as MoidInterface
  toMo = () => new Promise<MoInterface>((r) => r(this))

  hydrate = async (partial: Partial<Mo>)=> {
    await this._moMeta.moDef.objToMo(partial, {mo:this, trusted: true})
    this.init()
    return this
  }
  hydrateUntrusted = async (partial: Partial<Mo>)=> {
    await this._moMeta.moDef.objToMo(partial, {mo:this, trusted: false})
    this.init()
    return this
  }
  isSameAs = (mo: any) => {
    if (!mo) return false
    if (!mo._moMeta) return false
    return this._moMeta.name === mo._moMeta.name && this.id === mo.id
  }
  cloneMo = (): MoidInterface => {
   const newMo = this._moMeta.newMo()
   for (const [fieldname, fieldDef] of this._moMeta.moDef.fieldDefs.entries()) {
       const fieldValue = this[fieldname]
       if (fieldDef.type === 'mo') {
           const innerMo = fieldValue as MoidInterface
           newMo[fieldname] = innerMo.toMoid().cloneMo()
       } else if (fieldDef.type === 'moArray') {
           const innerMo = fieldValue as MoidInterface[]
           newMo[fieldname] = innerMo.map(m => m.toMoid().cloneMo())
       } else {
           newMo[fieldname] = structuredClone(fieldValue)
       }
   }
   return newMo
  }

}


// initMoDefDef()
//1 defaultMoMeta.moDef.moClass = Mo
