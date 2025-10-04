import type {MoMetaInterface} from './MoMetaInterface.js'

export interface MoInterface {


  moMeta: MoMetaInterface
  id?: number | string

  getDisplayName: () => string

  setProps: (props: any) => MoInterface

  toObj: () => any

  hydrate(partial: Partial<MoInterface>): void

  toDocument: () => {}
}
