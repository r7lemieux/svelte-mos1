import { DbService } from './db.service.js';
import type { Mo } from '../../models/managedObjects/Mo.js';
import type { MoInterface } from '../../models/managedObjects/MoInterface.js';
import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js';
import type { DataSourceInterface } from './DataSource.interface.js';
export declare class NoDataSource<M extends MoInterface> implements DataSourceInterface<M> {
    moDef: MoDefinitionInterface;
    records: Map<string | number, M>;
    db: DbService;
    constructor(moDef: MoDefinitionInterface);
    getMo: (id: any) => Promise<M | undefined>;
    saveMo: (mo: M) => Promise<M>;
    updateMo: (mo: M) => Promise<M>;
    addMo: (mo: M) => Promise<M>;
    getMos: () => Promise<M[]>;
    saveMos: (givenMos: Mo[]) => Promise<M[]>;
    deleteMo: (id: any) => Promise<void>;
}
