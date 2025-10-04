import { FieldDefinition } from '../fields/FieldDefinition.js';
import { Rezult } from '../../services/common/message/rezult.js';
import type { Mo } from './Mo.js';
import type { MoMetaInterface } from './MoMetaInterface.js';
import type { MoDefinitionInterface } from './MoDefinitionInterface.js';
export declare class MoListModel {
    moMeta: MoMetaInterface;
    moDef: MoDefinitionInterface;
    mos: Mo[];
    fieldDefs: Map<string, FieldDefinition<any>>;
    constructor(moMeta: MoMetaInterface);
    errors: Rezult[];
    init(): void;
    getName: () => string;
    getFieldDefs: () => Map<string, FieldDefinition<any>>;
    buildFromObjs: (objs: any) => void;
    buildFieldnameToKeys: (objs: any) => {
        [key: string]: string[];
    };
    buildFieldDefs: (objs: any) => Map<string, FieldDefinition<any>>;
    extractFieldNamesFromHeaderLine: (titleStr: any) => any;
    static fromCsv: (name: string, str: string) => MoListModel;
    buildFromCsv(sheetStr: any): void;
    buildFieldDefsFromTitleLine(titleStr: any): void;
    matchFieldDefsFromTitleLine(fieldNames: string[], addFields: boolean): (FieldDefinition<any> | undefined)[];
    fillFromCsv(sheetStr: any, options?: FillFromCsvOptions): void;
}
export type FillFromCsvOptions = {
    addNewFields: boolean;
};
