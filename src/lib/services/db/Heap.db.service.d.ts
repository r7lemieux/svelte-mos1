import { DbService } from './db.service.js';
import type { Mo } from '../../models/managedObjects/Mo.js';
export declare class HeapDbService implements DbService {
    records: {
        [tableName: string]: {
            [key: string]: Mo;
        };
    };
    getMo: (moDbName: string, key: any) => Promise<Mo | undefined>;
    saveMo: (mo: Mo) => Promise<Mo>;
    updateMo: (mo: Mo) => Promise<Mo>;
    addMo: (mo: any) => Promise<any>;
    getMos: (moDbName: string) => Promise<Mo[]>;
    saveMos: (givenMos: Mo[]) => Promise<Mo[]>;
    deleteMo: (mo: Mo) => Promise<void>;
}
export declare const heapDbService: HeapDbService;
