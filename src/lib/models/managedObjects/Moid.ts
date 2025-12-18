import type {MoMetaInterface} from './MoMetaInterface.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import {toDisplayString} from '../../services/common/util/string.utils.js'
import {type MoidInterface} from './MoidInterface.js'
import {moidToObj} from '../../services/mo/moTransport.implementation.js'

export class Moid implements MoidInterface {

  moMeta: MoMetaInterface
  id: number | string
  displayName: string
  _isLoaded = false

  constructor(moMeta: MoMetaInterface, id: string | number, displayName?: string) {
    // super(Moid.moMeta)
    this.moMeta = moMeta || getDefaultMoMeta()
    this.id = id
    this.displayName = displayName || ''
    this.init()
  }
  init = () => {
    this.displayName = this.displayName || this.id.toString()
    return this
  }

  getDisplayName = () => this.displayName

  toMoid=  () => this
  toObj = () => moidToObj(this)

  isSameAs = (mo: any) => {
    if (!mo) return false
    if (!mo.moMeta) return false
    return this.moMeta.name === mo.moMeta.name && this.id === mo.id
  }
}
