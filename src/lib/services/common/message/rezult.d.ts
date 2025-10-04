import { ErrorName } from './errorName.js';
export type RezultStatus = 'message' | 'error';
export declare class Rezult extends Error {
    status: RezultStatus;
    data: any;
    context: string | undefined;
    static mode: 'test' | 'app';
    constructor(errorName?: ErrorName, data?: any, context?: string);
    setName: (errorName: ErrorName) => void;
    toObj: () => any;
    serialize: () => string;
    toString: () => string;
    toDisplayString: () => string;
    toDetailString: () => string;
    stringifyOneLevel: (obj: any) => string;
    print: (str: string) => void;
    static build: (err: any, data?: any, context?: any) => Rezult;
}
export declare const OK: Rezult;
