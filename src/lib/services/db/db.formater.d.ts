export type AnyMap = {
    [key: string]: unknown;
};
export type StrMap = {
    [key: string]: string;
};
export type StsMap = {
    [key: string]: string | string[];
};
export type ChoMap = {
    [key: string]: {
        [key: string]: string;
    };
};
export declare const buildDbKeys: (validMap: AnyMap) => string[];
export declare const buildDbKeyMap: (validMap: AnyMap) => StrMap;
export declare const primitivesToDb: (values: AnyMap) => AnyMap;
export declare const dbToPrimitiveMap: (dbValues: AnyMap, keyMap: StrMap) => AnyMap;
export declare const dbToPrimitiveMapWithDefaults: (dbChoices: AnyMap, defaultValues: AnyMap) => AnyMap;
export declare const buildDbChoiceMaps: (validChoices: StsMap) => ChoMap;
export declare const choicesToDb: (choices: StsMap | StsMap) => string;
export declare const dbToChoices: (dbChoices: string, keyMap: StrMap, choiceMaps: ChoMap) => StsMap;
export declare const dbToChoicesWithValidChoices: (dbChoices: string, validChoices: StsMap) => StsMap;
