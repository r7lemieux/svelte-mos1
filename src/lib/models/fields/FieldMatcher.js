"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClosestFieldName = exports.getClosestFieldname = exports.getClosestName = exports.fnameSimilarity = exports.wordsRank = exports.levenshteinRank = exports.diceRank = void 0;
var stringSimilarity = require("string-similarity");
var levenshtein = require("fastest-levenshtein");
var CommonFieldDefinition_js_1 = require("./CommonFieldDefinition.js");
var string_utils_js_1 = require("../../services/common/util/string.utils.js");
var diceRank = function (word1, word2) {
    if (!word1 || !word2)
        return 0;
    return stringSimilarity.compareTwoStrings(word1.toLowerCase(), word2.toLowerCase());
};
exports.diceRank = diceRank;
var levenshteinRank = function (word1, word2) {
    if (!word1 || !word2)
        return 0;
    return 1 / (Math.log(Math.exp(1) + levenshtein['distance'](word1.toLowerCase(), word2.toLowerCase())));
};
exports.levenshteinRank = levenshteinRank;
var wordsRank = function (word1, word2) { return ((0, exports.diceRank)(word1, word2) + (0, exports.levenshteinRank)(word1, word2)) / 2; };
exports.wordsRank = wordsRank;
var fnameSimilarity = function (word1, word2) {
    if (!word1 || !word2)
        return 0;
    return (0, exports.wordsRank)(word1, word2);
};
exports.fnameSimilarity = fnameSimilarity;
var getClosestName = function (text, names) {
    var closestName = '';
    var bestRank = 0;
    var rank = 0;
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        var rank_1 = (0, exports.fnameSimilarity)(text, name_1);
        if (rank_1 > bestRank) {
            closestName = name_1;
            bestRank = rank_1;
        }
    }
    return { name: closestName, rank: bestRank };
};
exports.getClosestName = getClosestName;
var getClosestFieldname = function (text) {
    var closestName = '';
    var fnames = Object.keys(CommonFieldDefinition_js_1.CommonFieldDefs);
    var textResult = (0, exports.getClosestName)(text, fnames);
    if (textResult.rank > 0.70)
        return textResult.name;
    var words = (0, string_utils_js_1.toWords)(text);
    var fnameWords = fnames.map(string_utils_js_1.toWords);
    var firstWord = words[0];
    var firstFnameWord = fnameWords.map(function (ws) { return ws[0]; });
    var lastWord = words[words.length - 1];
    var lastFnameWord = fnameWords.map(function (ws) { return ws[ws.length - 1]; });
    var ffResult = (0, exports.getClosestName)(firstWord, firstFnameWord);
    var llResult = (0, exports.getClosestName)(lastWord, lastFnameWord);
    var ffllBest = (ffResult.rank < llResult.rank) ? llResult : ffResult;
    if (ffllBest.rank > 0.70)
        return ffllBest.name;
    var flResult = (0, exports.getClosestName)(firstWord, firstFnameWord);
    var lfResult = (0, exports.getClosestName)(firstWord, firstFnameWord);
    var fllfBest = (flResult.rank > lfResult.rank) ? flResult : lfResult;
    if (fllfBest.rank > 0.70)
        return fllfBest.name;
    var results = [textResult, ffllBest, fllfBest];
    var bestRank = Math.max.apply(Math, results.map(function (r) { return r.rank; }));
    if (bestRank > 0.55) {
        var bestResult = results.find(function (r) { return r.rank == bestRank; });
        closestName = (bestResult === null || bestResult === void 0 ? void 0 : bestResult.name) || text;
    }
    else
        closestName = text;
    return closestName;
};
exports.getClosestFieldname = getClosestFieldname;
var getClosestFieldName = function (word) {
    var closestName = '';
    var bestSimilarity = 0;
    for (var _i = 0, _a = Object.keys(CommonFieldDefinition_js_1.CommonFieldDefs); _i < _a.length; _i++) {
        var fname = _a[_i];
        var similarity = (0, exports.fnameSimilarity)(fname, word);
        if ((0, exports.fnameSimilarity)(fname, word) > bestSimilarity) {
            closestName = fname;
            bestSimilarity = similarity;
        }
        if (bestSimilarity < 0.35) {
            closestName = word;
        }
    }
    return closestName;
};
exports.getClosestFieldName = getClosestFieldName;
