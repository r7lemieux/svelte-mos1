import { Rezult } from '../../services/common/message/rezult.js';
export type validator = keyof ValidationService;
declare interface IValidationOptions {
    nullable?: boolean;
}
declare interface IIntValidationOptions extends IValidationOptions {
    min?: number;
    max?: number;
}
export declare class ValidationService {
    key: (str: any, len?: number) => Rezult | null;
    intRegex: RegExp;
    maxInt: number;
    int: (options?: IIntValidationOptions) => {
        parse: (str: string) => number | null;
        validate: (value: any) => Rezult | null;
        validateString: (str: string) => Rezult | null;
    };
    idRegex: RegExp;
    id: (options?: IValidationOptions) => {
        parse: (str: string) => number | null;
        validate: (value: number) => Rezult | null;
        validateString: (str: string) => Rezult | null;
    };
    idValidator: {
        parse: (str: string) => number | null;
        validate: (value: number) => Rezult | null;
        validateString: (str: string) => Rezult | null;
    };
    validateEmail: (value: any) => Rezult | null;
    email: {
        validate: (value: any) => Rezult | null;
        validateString: (value: any) => Rezult | null;
        parse: (str: any) => any;
    };
    ok: () => {
        validate: (value: number) => Rezult | null;
        validateString: (str: string) => Rezult | null;
    };
    buildText: (regexStr: string, minlen?: number, maxlen?: number) => {
        parse: (value: any) => any;
        validate: (value: any) => Rezult | null;
    };
    name: {
        parse: (value: any) => any;
        validate: (value: any) => Rezult | null;
    };
    text: (minlen?: number, maxlen?: number) => {
        parse: (value: any) => any;
        validate: (value: any) => Rezult | null;
    };
    password: {
        parse: (value: any) => any;
        validate: (value: any) => Rezult | null;
    };
}
export declare const validationService: ValidationService;
export {};
