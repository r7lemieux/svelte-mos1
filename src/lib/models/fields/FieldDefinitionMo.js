"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldDefinitionMoDef = exports.FieldDefinitionMo = void 0;
var MoDefinition_js_1 = require("../managedObjects/MoDefinition.js");
var Mo_js_1 = require("../managedObjects/Mo.js");
var FieldDefinition_js_1 = require("./FieldDefinition.js");
var CommonFieldDefinition_js_1 = require("./CommonFieldDefinition.js");
// import { MoMetaInterface } from '../managedObjects/MoMetaInterface.js'
// import { MoMetaInterface } from '../managedObjects/MoMetaInterface'
var FieldDefinitionMo = /** @class */ (function (_super) {
    __extends(FieldDefinitionMo, _super);
    function FieldDefinitionMo(fieldDefinition) {
        var _this = _super.call(this, {}) || this;
        // super(fieldDefinitionMoMeta)
        _this.fieldDef = fieldDefinition;
        _this.hydrate();
        return _this;
    }
    FieldDefinitionMo.prototype.hydrate = function () {
        var _this = this;
        var fieldnames = Object.getOwnPropertyNames(this.fieldDef)
            .filter(function (fn) { return typeof _this.fieldDef[fn] !== 'function'; });
        for (var _i = 0, fieldnames_1 = fieldnames; _i < fieldnames_1.length; _i++) {
            var fieldname = fieldnames_1[_i];
            this[fieldname] = this.fieldDef[fieldname];
        }
    };
    FieldDefinitionMo.prototype.hydrate1 = function () {
        var fieldnames = Object.getOwnPropertyNames(this)
            .filter(function (fn) { return fn !== 'fieldDef'; });
        for (var _i = 0, fieldnames_2 = fieldnames; _i < fieldnames_2.length; _i++) {
            var fieldname = fieldnames_2[_i];
            this[fieldname] = this.fieldDef[fieldname];
        }
    };
    return FieldDefinitionMo;
}(Mo_js_1.Mo));
exports.FieldDefinitionMo = FieldDefinitionMo;
exports.fieldDefinitionMoDef = new MoDefinition_js_1.MoDefinition('FieldDefinition');
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('name'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('type'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('description'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('displayName'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Text).chainSetName('example'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Text).chainSetName('regex'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('regexFlag'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Integer).chainSetName('minLen'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Integer).chainSetName('maxLen'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('key'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('inputType'));
exports.fieldDefinitionMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('gridColDef'));
// const fieldDefinitionMoMeta = new MoMeta(fieldDefinitionMoDef)
Object.assign(exports.fieldDefinitionMoDef, {
    name: 'meta',
    dbName: 'MoDefinition',
    displayName: 'Meta',
    keyFieldnames: ['moName'],
    gridFieldnames: ['name', 'moClass', 'gdriveFilename'],
    moClass: MoDefinition_js_1.MoDefinition,
    hasId: true,
    idType: 'string',
    dataSource: null,
    gdriveFilePath: 'system/resources',
    gdriveFileId: null,
    newMo: function () { return new FieldDefinitionMo(CommonFieldDefinition_js_1.CommonFieldDefs.name); }
});
