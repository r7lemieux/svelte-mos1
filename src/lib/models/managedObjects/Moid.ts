import type {MoMetaInterface} from './MoMetaInterface.js'
import {getDefaultMoMeta} from './moMetaInstances.js'
import type {MoInterface} from './MoInterface.js'
import {toDisplayString, toWords} from '$lib/services/common/util/string.utils.js'
import {MoMeta} from './MoMeta.js'
import {MoDefinition} from './MoDefinition.js'
import {type MoidInterface} from './MoidInterface.js'
import {Mo} from './Mo.js'

export class Moid<T extends MoInterface> extends Mo implements MoidInterface {

  displayName: string
  proxyMoMeta: MoMetaInterface

  constructor(moMeta: MoMetaInterface, id: string|number, name?: string) {
    super(Moid.moMeta)
    this.proxyMoMeta = moMeta || getDefaultMoMeta()
    this.id = id
    this.displayName = name || id.toString()
  }

  setDisplayName = (name?: string) => {
    this.displayName = toDisplayString(name || this.displayName || this.id?.toString() || '')
  }

  toMo = (): Promise<T> => {
    return this.proxyMoMeta.dataSource.getMo(this.id) as Promise<T>
  }

  static moMeta: MoMetaInterface = new MoMeta(MoDefinition.fromProps({
      hasId: false,
      name: 'moid',
      gridFieldnames: ['displayName'],
    })
  ).setName('moid')
  static {
    const moDef = Moid.moMeta.moDef
    moDef.moClass = Moid
    moDef.initFieldDefs()
  }}
