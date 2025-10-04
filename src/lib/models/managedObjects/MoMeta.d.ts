import type { MoMetaInterface } from './MoMetaInterface.js';
import type { DataSourceInterface } from '../../services/db/DataSource.interface.js';
import type { MoInterface } from './MoInterface.js';
import { MoDefinition } from './MoDefinition.js';
export declare class MoMeta implements MoMetaInterface {
    name: string;
    dbName: string;
    moDef: MoDefinition;
    dataSource: DataSourceInterface<MoInterface>;
    constructor(moDef: MoDefinition, dbName?: string);
    static fromMoDef: (moDef: MoDefinition) => MoMeta;
    init(): void;
    setName: (given_name?: string) => void;
    getDisplayName: () => string;
    newMo: () => MoInterface;
    moToObj: (mo: any) => any;
    moToDocument: (mo: any) => any;
    objToMo: (obj: any) => MoInterface;
    toDocument: () => void;
    documentToMo: (doc: any) => MoInterface;
}
