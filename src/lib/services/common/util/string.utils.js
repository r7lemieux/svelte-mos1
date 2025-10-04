"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToString = exports.objectReplacer = exports.jsonToDisplayString = exports.alphaFromStr = exports.toDisplayString0 = exports.toDisplayString = exports.toWords = exports.toCamelCase = void 0;
var toCamelCase = function (str0) {
    if (!str0)
        return '';
    var camel = str0[0].toLowerCase();
    for (var i = 1; i < str0.length; i++) {
        var pchar = str0[i - 1];
        var char = str0[i];
        if (char.match(/[A-Za-z0-9]/)) {
            if (char.match(/[A-Z]/) || pchar.match(/![A-Z]/)) {
                camel += char;
            }
            else {
                camel += char.toLowerCase();
            }
        }
    }
    return camel;
};
exports.toCamelCase = toCamelCase;
var toWords = function (str0) {
    var words = [];
    if (!str0)
        return words;
    var word = str0[0];
    for (var i = 1; i < str0.length; i++) {
        var pchar = str0[i - 1];
        var char = str0[i];
        if (char.match(/[A-Z]/)) {
            if (pchar.match(/[^A-Z]/)) {
                words.push(word);
                word = char;
            }
            else {
                word += char;
            }
        }
        else {
            word += char;
        }
    }
    if (word)
        words.push(word);
    return words;
};
exports.toWords = toWords;
var toDisplayString = function (str0) {
    if (!str0)
        return '';
    var str1 = (0, exports.toWords)(str0).join(' ');
    return str1[0].toUpperCase() + str1.slice(1);
};
exports.toDisplayString = toDisplayString;
var toDisplayString0 = function (str0) {
    if (!str0)
        return '';
    var str = str0[0].toUpperCase();
    for (var i = 1; i < str0.length; i++) {
        var pchar = str0[i - 1];
        var char = str0[i];
        if (char.match(/[A-Z]/)) {
            if (pchar.match(/[^A-Z]/)) {
                str += ' ' + char;
            }
            else {
                str += char;
            }
        }
        else {
            str += char;
        }
    }
    return str;
};
exports.toDisplayString0 = toDisplayString0;
var alphaRegex = new RegExp(/[A-Za-z]/);
var alphaFromStr = function (str) {
    var alpha = '';
    if (str) {
        var i = str.length;
        while (i--) {
            if (alphaRegex.test(str[i])) {
                alpha = alpha + str[i];
            }
        }
    }
    return alpha;
};
exports.alphaFromStr = alphaFromStr;
var jsonToDisplayString = function (json) {
    if (!json)
        return '';
    if (typeof json === 'string')
        return json;
    return Object.entries(json)
        .map(function (_a) {
        var k = _a[0], v = _a[1];
        if (typeof v === 'object') {
            return (0, exports.jsonToDisplayString)(v);
        }
        else {
            return "".concat(k, ": ").concat(v);
        }
    })
        .join(', ');
};
exports.jsonToDisplayString = jsonToDisplayString;
var objectReplacer = function (k, v) {
    var _a;
    console.log("==>string.utils.ts:90  k", k);
    console.log("==>string.utils.ts:90  v", v);
    if (v && typeof v === 'object') {
        if (v.getDisplayName)
            return v.getDisplayName();
        return v.displayName || v.name || ((_a = v.constructor) === null || _a === void 0 ? void 0 : _a.name) || v.toString();
    }
    else {
        return v;
    }
};
exports.objectReplacer = objectReplacer;
var objectToString = function (o) {
    var _a;
    if (o && typeof o === 'object') {
        if (o.getDisplayName)
            return o.getDisplayName();
        return o.displayName || o.name || ((_a = o.constructor) === null || _a === void 0 ? void 0 : _a.name) || o.toString();
    }
    else {
        return o;
    }
};
exports.objectToString = objectToString;
