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
exports.moDefMoMeta = exports.moDefMoDef = exports.MoDefinitionMo = void 0;
var Mo_js_1 = require("./Mo.js");
var FieldDefinition_js_1 = require("../fields/FieldDefinition.js");
var CommonFieldDefinition_js_1 = require("../fields/CommonFieldDefinition.js");
var MoMeta_js_1 = require("./MoMeta.js");
var MoDefinition_js_1 = require("./MoDefinition.js");
var Heap_dataSource_js_1 = require("../../services/db/Heap.dataSource.js");
var MoDefinitionMo = /** @class */ (function (_super) {
    __extends(MoDefinitionMo, _super);
    function MoDefinitionMo(moDef) {
        var _this = _super.call(this, exports.moDefMoMeta) || this;
        _this.keyFieldnames = [];
        _this.fieldDefs = new Map();
        _this.hasId = true;
        _this.idType = 'string';
        _this.gdriveFilePath = '';
        _this.gdriveFileId = null;
        _this.canCreate = false;
        _this.init = function () { };
        _this.addFieldDef = function (fd) { };
        _this.getDisplayName = function () { return ''; };
        _this.getDbName = function () { return ''; };
        _this.getFieldNames = function () { return []; };
        _this.getMoClass = function () { return null; };
        _this.initFieldDefs = function () { };
        _this.addFieldDefsFromNames = function (fn) { };
        _this.deriveFieldDefsFromMo = function () { return []; };
        _this.deriveFieldDefsFromFieldnames = function (fd) { return []; };
        _this.extractFieldnamesFromMo = function () { return []; };
        _this.newMo = function () { return new Mo_js_1.Mo(); };
        _this.objToMo = function (o, mm) { return new Mo_js_1.Mo(); };
        _this.moToObj = function (mo) { return {}; };
        _this.moToDocument = function (mo) { };
        _this.documentToMo = function () { return new Mo_js_1.Mo(); };
        _this.moDef = moDef;
        _this.id = _this.name = _this.dbName = moDef.name;
        _this.getDisplayName = _this.moDef.getDisplayName;
        Object.assign(_this, _this.moDef);
        return _this;
    }
    return MoDefinitionMo;
}(Mo_js_1.Mo));
exports.MoDefinitionMo = MoDefinitionMo;
exports.moDefMoDef = new MoDefinition_js_1.MoDefinition('moDef');
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('name'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Id).chainSetName('id'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('name'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('dbName'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('displayName'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Array).chainSetName('keyFieldnames'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Array).chainSetName('gridFieldnames'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.NullableBoolean).chainSetName('hasId'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('idType'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.UrlPath).chainSetName('gdriveFilePath'));
exports.moDefMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('gdriveFileId'));
var moClassFieldDef = (0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('moClass');
var fieldDefsFieldDef = (0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Map).chainSetName('fieldDefs');
// fieldDefsFieldDef.mapValueType = 'object'
exports.moDefMoDef.addFieldDef(fieldDefsFieldDef);
moClassFieldDef.gridColDef = {
    field: undefined,
    valueGetter: function (params) { return params.data.moClass.name; }
};
moClassFieldDef.valueToString = function (v) {
    if (!v) {
        console.log("==>MoDefinition.ts:172 v ", v);
    }
    (function (v) { return v.name; });
};
exports.moDefMoDef.addFieldDef(moClassFieldDef);
// export const moDefMeta: MoMetaInterface = new MoMeta(moDefDef)
Object.assign(exports.moDefMoDef, {
    name: 'moDef',
    dbName: 'moDef',
    displayName: 'Mo Definition',
    keyFieldnames: ['moName'],
    gridFieldnames: ['name', 'gdriveFilePath'],
    moClass: MoDefinitionMo,
    hasId: true,
    idType: 'string',
    gdriveFilePath: 'system/resources/modefs',
    gdriveFileId: null,
    canCreate: false,
});
exports.moDefMoMeta = new MoMeta_js_1.MoMeta(exports.moDefMoDef);
exports.moDefMoMeta.documentToMo = function (doc) {
    var moDefMo = new MoDefinitionMo(exports.moDefMoDef);
    var obj = JSON.parse(doc.json);
    Object.assign(moDefMo, obj);
    return moDefMo;
};
exports.moDefMoMeta.dataSource = new Heap_dataSource_js_1.HeapDataSource(exports.moDefMoDef);
exports.moDefMoMeta.name = 'moDefMoMeta';
