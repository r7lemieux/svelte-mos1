import type {MoMetaInterface} from './MoMetaInterface.js'

export interface MoidInterface {


  moMeta: MoMetaInterface
  id: number | string
  displayName: string
  getDisplayName: () => string
  _isLoaded: boolean
  // setDisplayName: (displayName: string) => MoidInterface
  // setProps: (props: any) => MoInterface
  //
  // toObj: () => any
  // toMoid: () => MoidInterface
  // toMo: () => Promise<MoInterface>
  //
  // hydrate(partial: Partial<MoInterface>): void
  //
  // toDocument: () => {}
}
