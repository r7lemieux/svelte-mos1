"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.from = exports.FieldDefinition = void 0;
var errorName_js_1 = require("../../services/common/message/errorName.js");
var rezult_js_1 = require("../../services/common/message/rezult.js");
var string_utils_js_1 = require("../../services/common/util/string.utils.js");
var ts_utils_js_1 = require("../../services/common/util/ts.utils.js");
// import type { ValueFormatterFunc } from 'ag-grid-community/dist/lib/entities/colDef.js'
// Singleton
var FieldDefinition = /** @class */ (function () {
    function FieldDefinition(props) {
        if (props === void 0) { props = {}; }
        this.name = '';
        this.type = 'string';
        this.minLen = 0;
        this.maxLen = 256;
        this.inputType = 'text';
        this.gridColDef = {};
        this.canBeNull = true;
        this.canBeUndefined = true;
        this.init(props);
    }
    FieldDefinition.prototype.init = function (props) {
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
            var key = _a[_i];
            this[key] = props[key];
        }
    };
    FieldDefinition.prototype.validate = function () {
        if (!this.name)
            throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.missing_field, { type: 'FieldDefinition', fieldname: 'name' });
    };
    FieldDefinition.prototype.clone = function () {
        var newFieldDef = new FieldDefinition();
        (0, ts_utils_js_1.copyOwnProperties)(this, newFieldDef);
        return newFieldDef;
    };
    /// delete
    // clone1 = () => {
    //   const propnames = Object.getOwnPropertyNames(this).filter(pn => typeof (this[pn]) != 'function')
    //   // const propnames = Object.keys(this).filter(pn => typeof(this[pn]) != 'function')
    //   const props = propnames.reduce((ps, f) => {
    //     ps[f] = this[f]
    //     return ps
    //   }, {})
    //   const copy = new FieldDefinition(props)
    //   // bindFunctions(copy, props)
    //   const funcnames = Object.getOwnPropertyNames(this).filter(pn => typeof (this[pn]) == 'function')
    //   for (const funcname of funcnames) {
    //     copy[funcname] = this[funcname]
    //     copy[funcname].bind(copy)
    //   }
    //   copy.parse = this.parse
    //   return copy
    // }
    FieldDefinition.prototype.chainSetName = function (name) {
        this.name = name;
        return this;
    };
    FieldDefinition.prototype.parse = function (v) {
        if (v === undefined && this.canBeUndefined)
            return v;
        if (v === null && this.canBeNull)
            return null;
        switch (this.type) {
            case 'string':
                return v;
            case 'boolean':
                return v && ((['y', 'yes', 't', 'true', 'ok'].indexOf(v.toLowerCase()) !== -1) || v.match(/[\d][\d\ .]*/));
            case 'int':
                return Number.parseInt(v);
            case 'float':
                return Number.parseInt(v);
            case 'date':
                return new Date(v);
            case 'object':
                return JSON.parse(v);
            case 'array': {
                if (v && v[0] !== '[')
                    v = "[".concat(v, "]");
                return JSON.parse(v);
            }
            case 'map': {
                var obj = JSON.parse(v);
                return new Map(Object.entries(obj));
            }
            default:
                return v;
        }
    };
    FieldDefinition.prototype.gridToString = function (gridFields) {
        if (!gridFields)
            return null;
        var data = gridFields.data;
        // if (f === undefined && this.canBeUndefined) return null
        if (data === undefined)
            return null;
        var v = data[this.name];
        return this.valueToString(v);
    };
    FieldDefinition.prototype.valueToString = function (v) {
        if (v === undefined && this.canBeUndefined)
            return v;
        if (v === null && this.canBeNull)
            return 'null';
        switch (this.type) {
            case 'map':
                return Array.from(Object.entries(v)).toString();
            case 'boolean':
                return v ? 'Y' : 'N';
            case 'date':
            case 'object':
            case 'array':
                return (0, string_utils_js_1.objectToString)(v);
            case 'string':
            case 'int':
            case 'float':
            default:
                return v.toString();
        }
    };
    FieldDefinition.prototype.documentToValue = function (v) {
        if (v === undefined || v === 'undefined' && this.canBeUndefined)
            return v;
        if (v === null || v === 'null' && this.canBeNull)
            return null;
        switch (this.type) {
            case 'map':
                return new Map(Object.entries(v));
            case 'boolean':
            case 'string':
            case 'int':
            case 'float':
            case 'date':
            case 'object':
            case 'array':
            default:
                return v;
        }
    };
    FieldDefinition.prototype.valueToDocument = function (v) {
        if (v === undefined || v === 'undefined' && this.canBeUndefined)
            return v;
        if (v === null || v === 'null' && this.canBeNull)
            return null;
        switch (this.type) {
            case 'map':
                return Object.fromEntries(v.entries());
            case 'object':
            case 'boolean':
            case 'string':
            case 'int':
            case 'float':
            case 'date':
            case 'array':
            default:
                return v;
        }
    };
    FieldDefinition.prototype.getDisplayName = function () {
        return this.displayName || (0, string_utils_js_1.toDisplayString)(this.name);
    };
    FieldDefinition.prototype.getColumnName = function () {
        var _a;
        return ((_a = this.gridColDef) === null || _a === void 0 ? void 0 : _a.headerName) || this.displayName || (0, string_utils_js_1.toDisplayString)(this.name);
    };
    FieldDefinition.prototype.getDescription = function () {
        var ex = this.example ? ". For example: ".concat(this.example) : '';
        return this.description || "A valid ".concat(this.name, " ").concat(ex, " ");
    };
    FieldDefinition.prototype.validateValue = function (val0) { return rezult_js_1.OK; };
    FieldDefinition.prototype.validateString = function (str) {
        if (this.minLen && str.length < this.minLen) {
            return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_tooShort, { str: str, minLen: this.minLen });
        }
        else if (this.maxLen && str.length > this.maxLen) {
            return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_tooLong, { str: str, maxLen: this.maxLen });
        }
        else if (this.regex && !this.regex.test(str)) {
            return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid, { str: str, regex: this.regex });
        }
        return rezult_js_1.OK;
    };
    FieldDefinition.prototype.buildColDef = function () {
        var colDef = this.gridColDef || {};
        colDef.field = colDef.field || this.name;
        colDef.cellClass = colDef.cellClass || this.name;
        colDef.headerName = (colDef === null || colDef === void 0 ? void 0 : colDef.headerName) || this.displayName || (0, string_utils_js_1.toDisplayString)(this.name);
        colDef.valueFormatter = this.gridToString.bind(this);
        return colDef;
    };
    FieldDefinition.from = function (fieldDef0, props) {
        if (props === void 0) { props = {}; }
        var newFieldDef = new FieldDefinition();
        (0, ts_utils_js_1.copyOwnProperties)(fieldDef0, newFieldDef);
        (0, ts_utils_js_1.copyOwnProperties)(props, newFieldDef);
        return newFieldDef;
    };
    return FieldDefinition;
}());
exports.FieldDefinition = FieldDefinition;
// export const fieldDefinitionMoField = new MoDefinition('FieldDefinition')
exports.from = FieldDefinition.from;
