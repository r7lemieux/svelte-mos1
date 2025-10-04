import type { MoMetaInterface } from './MoMetaInterface.js';
import type { DataSourceInterface } from '../../services/db/DataSource.interface.js';
import type { MoDefinitionInterface } from './MoDefinitionInterface.js';
import { MoMeta } from './MoMeta.js';
import { MoDefinition } from './MoDefinition.js';
import { Mo } from './Mo.js';
import type { MoInterface } from './MoInterface.js';
export declare class MoMetaMo extends Mo implements MoMetaInterface {
    name: string;
    dbName: string;
    moDef: MoDefinitionInterface;
    dataSource: DataSourceInterface<MoInterface>;
    constructor(moMeta: MoMetaInterface);
    init: () => void;
    setName: (name?: string) => void;
    toDisplayString: () => string;
    newMo: () => MoInterface;
    objToMo: (obj: any) => MoInterface;
    documentToMo: (doc: any) => MoInterface;
    moToObj: (mo: any) => any;
    moToDocument: (mo: any) => any;
    static fromMoDef: (moDef: MoDefinitionInterface) => MoMeta;
    getDisplayName: () => string;
}
export declare const moMetaMoDef: MoDefinition;
export declare const moMetaMoMeta: MoMeta;
