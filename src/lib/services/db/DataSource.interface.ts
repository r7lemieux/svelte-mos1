// Prototype
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import {Rezult} from '../common/message/rezult.js'

export interface DataSourceInterface<M extends MoInterface> {
    getMo: (id: any) => Promise<M>
    getMoid: (id: any) => Promise<MoidInterface>
    saveMo: (mo: M, params?: SaveMoParams) => Promise<M>
    updateMo: (mo: M) => Promise<M>
    addMo: (mo: M) => Promise<M>
    getMos: () => Promise<M[]>
    getMoids: () => Promise<MoidInterface[]>
    saveMos: (givenMos: M[]) => Promise<M[]>
    deleteMo: (id: number | string, params?: DeleteMoParams) => Promise<DeleteResult>

}
export interface DeleteMoParams {
    pendingDeletes: string[],
    pendingUpdates: string[]
}

export interface DeleteResult {
    deleted?: MoidInterface[]
    updated?: MoidInterface[]
    errors?: Rezult[]
}

export interface SaveMoParams {
    datafill?: boolean,
    pending?: string[]
}
