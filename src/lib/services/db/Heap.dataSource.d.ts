import type { MoInterface } from '../../models/managedObjects/MoInterface.js';
import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js';
import type { DataSourceInterface } from './DataSource.interface.js';
export declare class HeapDataSource<M extends MoInterface> implements DataSourceInterface<M> {
    moDef: MoDefinitionInterface;
    records: {
        [key: string]: M;
    };
    keyname: string;
    constructor(moDef: MoDefinitionInterface);
    getMo: (key: any) => Promise<M | undefined>;
    saveMo: (mo: any) => Promise<any>;
    updateMo: (mo: any) => Promise<any>;
    addMo: (mo: any) => Promise<any>;
    getMos: () => Promise<M[]>;
    saveMos: (givenMos: M[]) => Promise<M[]>;
    deleteMo: (id: any) => Promise<void>;
}
