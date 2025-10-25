import type {MoMetaInterface} from './MoMetaInterface.js'
import type {MoidInterface} from './MoidInterface.js'

export interface MoInterface extends MoidInterface {


  // moMeta: MoMetaInterface
  // id: number | string
  // getDisplayName: () => string

  setProps: (props: any) => MoInterface

  toObj: () => any
  toMoid: () => MoidInterface
  toMo: () => Promise<MoInterface>

  hydrate(partial: Partial<MoInterface>): void

  toDocument: () => {}
}
