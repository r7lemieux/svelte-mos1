// import type {MoDefinitionInterface} from './MoDefinitionInterface'
import type {MoMetaInterface} from './MoMetaInterface.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import type {MoInterface} from './MoInterface.js'
// import {initMoDefDef} from './MoDefinition.js'

export class Mo implements MoInterface {

  moMeta: MoMetaInterface
  id?: number | string

  constructor(moMeta?: MoMetaInterface) {
    this.moMeta = moMeta || getDefaultMoMeta()
  }

  getDisplayName = () => '' + this.id

  setProps = (props: any): Mo => {
    for (const key of Object.getOwnPropertyNames(props)) {
      // if (key != 'fieldDefs') {
        this[key] = props[key]
      // }
    }
    return this
  }
  toObj = () => {
    const data: any = {}
    if (this.id) data.id = this.id
    for (const fname of Array.from(this.moMeta.moDef.fieldDefs.keys())) {
      //const fieldDef = this.moMeta.moDef.fieldDefs.get(fname)
      const value = this[fname]
      if (value !== undefined && value !== null) {
        data[fname] = this[fname]
      }
    }
    return data
  }
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
  hydrate(partial: Partial<Mo>) {
    // noinspection TypeScriptValidateTypes
    Object.assign(this, partial)
  }
}
// initMoDefDef()
//1 defaultMoMeta.moDef.moClass = Mo
