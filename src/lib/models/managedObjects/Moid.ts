import type {MoMetaInterface} from './MoMetaInterface.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import {toDisplayString} from '../../services/common/util/string.utils.js'
import {type MoidInterface} from './MoidInterface.js'

export class Moid implements MoidInterface {

  moMeta: MoMetaInterface
  id: number | string
  displayName: string
  _isLoaded = false

  constructor(moMeta: MoMetaInterface, id: string | number, name?: string) {
    // super(Moid.moMeta)
    this.moMeta = moMeta || getDefaultMoMeta()
    this.id = id
    this.displayName = toDisplayString(name || id.toString())
  }

  getDisplayName = () => this.displayName
}
