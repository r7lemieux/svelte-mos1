import type { DataSourceInterface } from './DataSource.interface.js';
import type { MoInterface } from '../../models/managedObjects/MoInterface.js';
export declare class ProxyDataSource<M extends MoInterface> implements DataSourceInterface<M> {
    next: DataSourceInterface<M>;
    target: any;
    constructor(next: any, target: any);
    getMo: (id: any) => Promise<M | undefined>;
    saveMo: (mo: any) => Promise<M>;
    updateMo: (mo: any) => Promise<M>;
    addMo: (mo: any) => Promise<M>;
    getMos: () => Promise<M[]>;
    saveMos: (givenMos: M[]) => Promise<M[]>;
    deleteMo: (id: any) => Promise<void>;
}
