import type { DataSourceInterface } from './DataSource.interface.js';
import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js';
import type { MoInterface } from '../../models/managedObjects/MoInterface.js';
export declare class CacheDataSource<M extends MoInterface> implements DataSourceInterface<M> {
    moDef: MoDefinitionInterface;
    ds: DataSourceInterface<M>;
    records: Map<string | number, M>;
    constructor(moDef: MoDefinitionInterface, ds: DataSourceInterface<M>);
    getMo: (id: any) => Promise<M | undefined>;
    saveMo: (mo: any) => Promise<M>;
    updateMo: (mo: any) => Promise<M>;
    addMo: (mo: any) => Promise<M>;
    getMos: () => Promise<M[]>;
    saveMos: (givenMos: M[]) => Promise<M[]>;
    deleteMo: (id: any) => Promise<void>;
}
