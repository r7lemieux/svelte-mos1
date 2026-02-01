import type {MoMetaInterface} from './MoMetaInterface.js'
import type {MoInterface} from './MoInterface.js'
import type {objectToMoParameters} from '../../services/mo/moTransport.js'

export interface MoidInterface {


    _moMeta: MoMetaInterface
    id: ID
    displayName: string
    getDisplayName: () => string
    _isLoaded: boolean
    init: () => MoidInterface
    toMoid: () => MoidInterface
    toMo: (params?: ToMoParams) => Promise<MoInterface>
    toObj: () => any
    isSameAs: (any) => boolean
    cloneMo: () => MoidInterface
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

export type ID = string | number

export interface ToMoParams {
    trusted?: boolean
}