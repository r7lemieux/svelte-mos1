import { MoMeta } from '../../models/managedObjects/MoMeta.js';
import { MoDefinitionMo } from '../../models/managedObjects/MoDefinitionMo.js';
import type { MoMetaInterface } from '../../models/managedObjects/MoMetaInterface.js';
import type { MoDefinitionInterface } from '../../models/managedObjects/MoDefinitionInterface.js';
export declare const moMetas: {
    [name: string]: MoMetaInterface;
};
export declare const moDefs: {
    [name: string]: MoDefinitionInterface;
};
export declare const registerMoMeta: (moMeta: MoMetaInterface) => void;
export declare const registerMoDef: (moDef: MoDefinitionInterface) => MoDefinitionMo;
export declare const getMoMetaMo: (name: any) => MoMeta;
