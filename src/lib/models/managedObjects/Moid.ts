import type {MoMetaInterface} from './MoMetaInterface.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import {toDisplayString} from '../../services/common/util/string.utils.js'
import {type MoidInterface, type ToMoParams} from './MoidInterface.js'
import {moidToObj, objectToMoidSync} from '../../services/mo/moTransport.implementation.js'
import {browser} from '$app/environment'
import {page} from '$app/state'

export class Moid implements MoidInterface {

  _moMeta: MoMetaInterface
  id: number | string
  displayName: string
  _isLoaded = false

  constructor(moMeta: MoMetaInterface, id: string | number, displayName?: string) {
    // super(Moid._moMeta)
    this._moMeta = moMeta || getDefaultMoMeta()
    this.id = id
    this.displayName = displayName || ''
    this.init()
  }
  init = () => {
    this.displayName = this.displayName || this.id.toString()
    return this
  }

  getDisplayName = () => this.displayName

  toMo=  async (params?: ToMoParams) => {
    if (browser) {
      const url = `${page.url.origin}/api/mo/${this._moMeta.name}/${this.id}`
      return fetch(url)
        .then(response => response.json())
        .then(this._moMeta.objToMo)
    } else {
      return this._moMeta.dataSource.getMo(this.id)
    }
  }

  toMoid=  () => this
  toObj = (params?:ToMoParams) => moidToObj(this)

  isSameAs = (mo: any) => {
    if (!mo) return false
    if (!mo._moMeta) return false
    return this._moMeta.name === mo._moMeta.name && this.id === mo.id
  }
  cloneMo = (): MoidInterface => new Moid(this._moMeta, this.id, this.displayName)

  toShortStr = () => this._moMeta.name + '-' + this.id.toString()
}
