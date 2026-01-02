import type {MoMetaInterface} from './MoMetaInterface.js'
import type {MoidInterface, ToMoParams} from './MoidInterface.js'
import type {objectToMoParameters} from '../../services/mo/moTransport.js'

export interface MoInterface extends MoidInterface {


  // moMeta: MoMetaInterface
  // id: number | string
  // getDisplayName: () => string

  setProps: (props: any) => MoInterface

  toObj: () => any
  toMo: (params?: ToMoParams) => Promise<MoInterface>

  hydrate(partial: Partial<MoInterface>): Promise<MoInterface>
  hydrateUntrusted(partial: Partial<MoInterface>): Promise<MoInterface>

  toDocument: () => {}
}
