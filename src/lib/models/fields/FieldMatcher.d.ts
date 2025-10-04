export declare const diceRank: (word1: any, word2: any) => number;
export declare const levenshteinRank: (word1: any, word2: any) => number;
export declare const wordsRank: (word1: any, word2: any) => number;
export declare const fnameSimilarity: (word1: any, word2: any) => number;
export declare const getClosestName: (text: string, names: string[]) => {
    name: string;
    rank: number;
};
export declare const getClosestFieldname: (text: string) => string;
export declare const getClosestFieldName: (word: string) => string;
