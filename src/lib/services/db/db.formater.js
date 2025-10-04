"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbToChoicesWithValidChoices = exports.dbToChoices = exports.choicesToDb = exports.buildDbChoiceMaps = exports.dbToPrimitiveMapWithDefaults = exports.dbToPrimitiveMap = exports.primitivesToDb = exports.buildDbKeyMap = exports.buildDbKeys = void 0;
// ====
// Maps
// ====
var buildDbKeys = function (validMap) { return Object.keys(validMap).map(function (key) { return key[0]; }); };
exports.buildDbKeys = buildDbKeys;
var buildDbKeyMap = function (validMap) {
    var keyMap = {};
    for (var _i = 0, _a = Object.keys(validMap); _i < _a.length; _i++) {
        var key = _a[_i];
        var k = key[0];
        keyMap[k] = key;
    }
    return keyMap;
};
exports.buildDbKeyMap = buildDbKeyMap;
// =================
// Map of Primitives
// =================
var primitivesToDb = function (values) {
    var dbValues = {};
    for (var _i = 0, _a = Object.entries(values); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], val = _b[1];
        dbValues[key[0]] = (val !== undefined) ? val : null;
    }
    return dbValues;
};
exports.primitivesToDb = primitivesToDb;
var dbToPrimitiveMap = function (dbValues, keyMap) {
    var values = {};
    for (var _i = 0, _a = Object.entries(dbValues); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], val = _b[1];
        var key = keyMap[k];
        values[key] = val;
    }
    return values;
};
exports.dbToPrimitiveMap = dbToPrimitiveMap;
var dbToPrimitiveMapWithDefaults = function (dbChoices, defaultValues) {
    var keyMap = (0, exports.buildDbKeyMap)(defaultValues);
    return (0, exports.dbToPrimitiveMap)(dbChoices, keyMap);
};
exports.dbToPrimitiveMapWithDefaults = dbToPrimitiveMapWithDefaults;
// ==============
// Map of Choices
// ==============
var buildDbChoiceMaps = function (validChoices) {
    var valueMaps = {};
    for (var _i = 0, _a = Object.entries(validChoices); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], choices = _b[1];
        var k = key[0];
        valueMaps[k] = {};
        if (typeof choices === 'string') {
            valueMaps[k][choices.toString()[0]] = choices;
        }
        else {
            for (var _c = 0, choices_1 = choices; _c < choices_1.length; _c++) {
                var choice = choices_1[_c];
                valueMaps[k][choice.toString()[0]] = choice;
            }
        }
    }
    return valueMaps;
};
exports.buildDbChoiceMaps = buildDbChoiceMaps;
var choicesToDb = function (choices) { return Object
    .entries(choices)
    .map(function (_a) {
    var key = _a[0], val = _a[1];
    return ((val === null || val === void 0 ? void 0 : val.toString()[0]) !== undefined) ? key[0] + val.toString()[0] : '';
})
    .join(''); };
exports.choicesToDb = choicesToDb;
var dbToChoices = function (dbChoices, keyMap, choiceMaps) {
    var choices = {};
    for (var i = 0; i < dbChoices.length; i += 2) {
        var k = dbChoices[i];
        var v = dbChoices[i + 1];
        var key = keyMap[k];
        var val = choiceMaps[k][v];
        choices[key] = val;
    }
    return choices;
};
exports.dbToChoices = dbToChoices;
var dbToChoicesWithValidChoices = function (dbChoices, validChoices) {
    var keyMap = (0, exports.buildDbKeyMap)(validChoices);
    var valueMaps = (0, exports.buildDbChoiceMaps)(validChoices);
    return (0, exports.dbToChoices)(dbChoices, keyMap, valueMaps);
};
exports.dbToChoicesWithValidChoices = dbToChoicesWithValidChoices;
