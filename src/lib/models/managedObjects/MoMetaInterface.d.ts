import type { MoInterface } from './MoInterface.js';
import type { DataSourceInterface } from '../../services/db/DataSource.interface.js';
import type { MoDefinitionInterface } from './MoDefinitionInterface.js';
export interface MoMetaInterface {
    name: string;
    dbName: string;
    moDef: MoDefinitionInterface;
    dataSource: DataSourceInterface<MoInterface>;
    newMo?: () => MoInterface;
    objToMo: (any: any) => MoInterface;
    documentToMo?: (any: any) => MoInterface;
}
