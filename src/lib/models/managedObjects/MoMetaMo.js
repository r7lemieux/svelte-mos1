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
exports.moMetaMoMeta = exports.moMetaMoDef = exports.MoMetaMo = void 0;
var MoMeta_js_1 = require("./MoMeta.js");
var MoDefinition_js_1 = require("./MoDefinition.js");
var CommonFieldDefinition_js_1 = require("../fields/CommonFieldDefinition.js");
var FieldDefinition_js_1 = require("../fields/FieldDefinition.js");
var Heap_dataSource_js_1 = require("../../services/db/Heap.dataSource.js");
var Mo_js_1 = require("./Mo.js");
var MoMetaMo = /** @class */ (function (_super) {
    __extends(MoMetaMo, _super);
    function MoMetaMo(moMeta) {
        var _this = _super.call(this, {}) || this;
        _this.init = function () { };
        _this.setName = function (name) { };
        _this.toDisplayString = function () { return _this.name || _this.moDef.name; };
        _this.newMo = function () {
            var moClass = _this.moDef.moClass || Mo_js_1.Mo;
            var mo = new moClass(_this);
            // const mo: Mo = new moClass({moDef: this} as MoMetaInterface)
            return mo;
        };
        _this.objToMo = function (obj) { return _this.newMo().setProps(obj); };
        _this.documentToMo = function (doc) {
            var mo = _this.newMo();
            for (var _i = 0, _a = Array.from(_this.moDef.fieldDefs.entries()); _i < _a.length; _i++) {
                var _b = _a[_i], fname = _b[0], fDef = _b[1];
                mo[fname] = fDef.documentToValue(doc[fname]);
            }
            return mo;
        };
        _this.moToObj = function (mo) { return _this.moDef.moToObj(mo); };
        _this.moToDocument = function (mo) { return _this.moDef.moToDocument(mo); };
        /*  ---------
         *  Accessors
         *  ---------
         */
        _this.getDisplayName = function () { return _this.moDef.getDisplayName(); };
        _this.moMeta = exports.moMetaMoMeta;
        _this.moDef = moMeta.moDef;
        _this.dataSource = moMeta.dataSource;
        _this.name = moMeta.name;
        _this.dbName = moMeta.dbName || _this.name;
        return _this;
    }
    MoMetaMo.fromMoDef = function (moDef) { return new MoMeta_js_1.MoMeta(moDef); };
    return MoMetaMo;
}(Mo_js_1.Mo));
exports.MoMetaMo = MoMetaMo;
exports.moMetaMoDef = new MoDefinition_js_1.MoDefinition('moMeta');
exports.moMetaMoDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('name'));
var moDefFieldDef = (0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.CommonFieldDefs.mo).chainSetName('moDef');
moDefFieldDef.mapValueType = 'object';
exports.moMetaMoDef.addFieldDef(moDefFieldDef);
var dataSourceFieldDef = (0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Object).chainSetName('dataSource');
dataSourceFieldDef.mapValueType = 'object';
exports.moMetaMoDef.addFieldDef(dataSourceFieldDef);
Object.assign(exports.moMetaMoDef, {
    name: 'moMeta',
    dbName: 'moMetas',
    moDef: MoDefinition_js_1.moDefDef,
});
exports.moMetaMoMeta = new MoMeta_js_1.MoMeta(exports.moMetaMoDef);
exports.moMetaMoMeta.moDef.name = 'moMeta';
exports.moMetaMoMeta.name = 'moMeta';
exports.moMetaMoDef.documentToMo = function (doc) {
    var moMetaMo = new MoMetaMo({});
    var obj = JSON.parse(doc.json);
    Object.assign(moMetaMo, obj);
    return moMetaMo;
};
var cacheDataSource = new Heap_dataSource_js_1.HeapDataSource(exports.moMetaMoDef);
cacheDataSource.keyname = 'name';
exports.moMetaMoMeta.dataSource = cacheDataSource;
