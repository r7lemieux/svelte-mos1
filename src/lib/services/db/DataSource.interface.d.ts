import type { MoInterface } from '../../models/managedObjects/MoInterface.js';
export interface DataSourceInterface<M extends MoInterface> {
    getMo: (id: any) => Promise<M | undefined>;
    saveMo: (mo: M) => Promise<M>;
    updateMo: (mo: M) => Promise<M>;
    addMo: (mo: M) => Promise<M>;
    getMos: () => Promise<M[]>;
    saveMos: (givenMos: M[]) => Promise<M[]>;
    deleteMo: (id: string | number) => Promise<void>;
}
