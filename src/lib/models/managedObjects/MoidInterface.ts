import type {MoMetaInterface} from './MoMetaInterface.js'
import type {MoInterface} from './MoInterface.js'

export interface MoidInterface<T extends MoInterface> extends MoInterface{

  proxyMoMeta: MoMetaInterface

}
