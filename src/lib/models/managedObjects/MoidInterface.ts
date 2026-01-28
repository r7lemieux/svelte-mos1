import type {MoMetaInterface} from './MoMetaInterface.js'
import type {MoInterface} from './MoInterface.js'
import type {objectToMoParameters} from '../../services/mo/moTransport.js'

export interface MoidInterface {


  _moMeta: MoMetaInterface
  id: number | string
  displayName: string
  getDisplayName: () => string
  _isLoaded: boolean
  init: () => MoidInterface
  toMoid: () => MoidInterface
  toMo: (params?: ToMoParams) => Promise<MoInterface>
  toObj: () => any
  isSameAs: (any) => boolean
  toShortStr: () => string
  // setDisplayName: (displayName: string) => MoidInterface
  // setProps: (props: any) => MoInterface
  //
  // toObj: () => any
  // toMoid: () => MoidInterface
  // toMo: () => Promise<MoInterface>
  //
  // hydrate(partial: Partial<MoInterface>): MoInterface
  //
  // toDocument: () => {}
}

export interface ToMoParams {
  trusted?: boolean
}