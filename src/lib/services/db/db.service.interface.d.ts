import type { Mo } from '../../models/managedObjects/Mo.js';
export interface DbServiceInterface {
    getMo: (moDbName: string, id: any) => Promise<Mo | undefined>;
    addMo: (mo: Mo) => Promise<Mo>;
    saveMo: (mo: Mo) => Promise<Mo>;
    updateMo: (mo: Mo) => Promise<Mo>;
    getMos: (moDbName: string) => Promise<Mo[]>;
    saveMos: (mos: Mo[]) => Promise<Mo[]>;
    deleteMo: (mo: Mo) => Promise<void>;
}
