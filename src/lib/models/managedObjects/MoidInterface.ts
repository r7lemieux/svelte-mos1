import type {MoMetaInterface} from './MoMetaInterface.js'
import type {MoInterface} from '$lib/models/managedObjects/MoInterface.js'

export interface MoidInterface {


  moMeta: MoMetaInterface
  id: number | string
  displayName: string
  getDisplayName: () => string
  _isLoaded: boolean
  init: () => MoidInterface
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
