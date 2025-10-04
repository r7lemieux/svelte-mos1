"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moDefDef = exports.MoDefinition = void 0;
var Mo_js_1 = require("./Mo.js");
// import { MoInterface } from './MoInterface.js'
var FieldDefinition_js_1 = require("../fields/FieldDefinition.js");
var CommonFieldDefinition_js_1 = require("../fields/CommonFieldDefinition.js");
var FieldMatcher_js_1 = require("../fields/FieldMatcher.js");
var string_utils_js_1 = require("../../services/common/util/string.utils.js");
var errorName_js_1 = require("../../services/common/message/errorName.js");
var rezult_js_1 = require("../../services/common/message/rezult.js");
// import { defaultMoMeta } from './moMetaInstances.js'
// import type { MoMetaInterface } from './MoMetaInterface.js'
// import { defaultMoMeta } from './MoMeta.js'
var MoDefinition = /** @class */ (function () {
    function MoDefinition(name, moClass) {
        var _this = this;
        this.keyFieldnames = [];
        this.fieldDefs = new Map();
        this.hasId = false;
        this.idType = 'string';
        this.canCreate = true;
        // del
        // static MoDefFieldDefs = [
        //   FieldDefinition.from(CommonFieldDefs.name),
        //   FieldDefinition.from(BaseFieldDefs.Array, {name: 'keyFieldNames'}),
        //   FieldDefinition.from(BaseFieldDefs.Object, {name: 'fieldDefs'}),
        // ]
        /*  ---------
         *  Accessors
         *  ---------
         */
        this.getDisplayName = function () { return _this.displayName || (0, string_utils_js_1.toDisplayString)(_this.name); };
        this.getDbName = function () { return _this.dbName || _this.name; };
        this.getFieldNames = function () { return Array.from(_this.fieldDefs.keys()); };
        // getMoClass = () => this.moClass || typeof Mo
        this.getMoClass = function () { return _this.moClass; };
        this.addFieldDef = function (fieldDef) {
            _this.fieldDefs.set(fieldDef.name, fieldDef);
            return fieldDef;
        };
        this.addFieldDefsFromNames = function (fieldnames) {
            _this.deriveFieldDefsFromFieldnames(fieldnames)
                .forEach(function (fd) { return _this.fieldDefs.set(fd.name, fd); });
        };
        this.deriveFieldDefsFromFieldnames = function (fieldnames) {
            return fieldnames
                .map(FieldMatcher_js_1.getClosestFieldName)
                .map(CommonFieldDefinition_js_1.getFieldDef)
                .map(function (fd, i) { return (0, FieldDefinition_js_1.from)(fd, { name: fieldnames[i] }); });
        };
        /*  -------------
         *  Mo Management
         *  -------------
         */
        // I would prefer Mo and typeof Mo to MoInterface i
        // but it causes:  ReferenceError: Cannot access 'Mo' before initialization
        // newMo = (): Mo => {
        //   const moClass: typeof Mo = this.moClass || Mo
        //   const mo: Mo = new moClass()
        //   return mo
        // }
        // objToMo = (obj: object, moMeta: MoMetaInterface): Mo => this.newMo().setProps(obj)
        // documentToMo = (doc: any): Mo => {
        //   const mo = this.newMo()
        //   for (const [fname, fDef] of Array.from(this.fieldDefs.entries())) {
        //     mo[fname] = fDef.documentToValue(doc[fname])
        //   }
        //   return mo
        // }
        this.newMo = function () {
            var moClass = _this.moClass || Object;
            var mo = new moClass();
            return mo;
        };
        this.objToMo = function (obj, moMeta) {
            return _this.newMo().setProps(obj);
        };
        this.documentToMo = function (doc) {
            var mo = _this.newMo();
            for (var _i = 0, _a = Array.from(_this.fieldDefs.entries()); _i < _a.length; _i++) {
                var _b = _a[_i], fname = _b[0], fDef = _b[1];
                mo[fname] = fDef.documentToValue(doc[fname]);
            }
            return mo;
        };
        this.moToObj = function (mo) { return mo.toObj(); };
        this.moToDocument = function (mo) { return mo.toDocument(); };
        // super({} as MoMetaInterface)
        if (name && !name.match(/[A-Za-z0-9]/))
            throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid, {
                method: 'MoDefinition.extractFieldnamesFromMo',
                name: name
            });
        this.displayName = this.name = this.dbName = this.id = name;
        this.moClass = moClass || Mo_js_1.Mo;
        // if (this.name !== 'moDef') this.moMeta = moDefMeta
        this.init();
    }
    /* ------------
     * Construction
     * ------------
     */
    MoDefinition.prototype.init = function () { };
    /* -----------------
     * Field Definitions
     * -----------------
     */
    MoDefinition.prototype.initFieldDefs = function () {
        var _this = this;
        this.deriveFieldDefsFromMo()
            .forEach(function (fd) { return _this.fieldDefs.set(fd.name, fd); });
    };
    MoDefinition.prototype.deriveFieldDefsFromMo = function () {
        var fieldnames = this.extractFieldnamesFromMo();
        var fieldDefs = this.deriveFieldDefsFromFieldnames(fieldnames);
        return fieldDefs;
    };
    MoDefinition.prototype.extractFieldnamesFromMo = function () {
        // const moClass: typeof Mo = this.moClass || Mo
        var moClass = this.moClass || Object;
        var mo = this.newMo();
        var fieldnames = Object.getOwnPropertyNames(mo).filter(function (n) { return typeof mo[n] !== 'function' && n !== 'moDef'; });
        return fieldnames;
    };
    MoDefinition.fromProps = function (props) {
        // if (!props.name || ! props.moClass) throw new Rezult(ErrorName.missing_param, {class: 'static DefMo', method: 'fromProps', props })
        var moDef = new MoDefinition(props.name, props.moClass);
        Object.assign(moDef, props);
        if (!props.fieldDefs && props.moClass) {
            moDef.initFieldDefs();
        }
        return moDef;
    };
    return MoDefinition;
}());
exports.MoDefinition = MoDefinition;
// const moDefDef = new MoDefinition('MoDefinition')
var moDefDef = new MoDefinition('moDef');
exports.moDefDef = moDefDef;
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Id).chainSetName('id'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('name'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('dbName'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('displayName'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Array).chainSetName('keyFieldnames'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Array).chainSetName('gridFieldnames'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.NullableBoolean).chainSetName('hasId'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('idType'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.UrlPath).chainSetName('gdriveFilePath'));
moDefDef.addFieldDef((0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('gdriveFileId'));
var fieldDefsFieldDef = (0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Map).chainSetName('fieldDefs');
fieldDefsFieldDef.mapValueType = 'object';
moDefDef.addFieldDef(fieldDefsFieldDef);
var moClassFieldDef = (0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Name).chainSetName('moClass');
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
moDefDef.addFieldDef(moClassFieldDef);
// export const moDefMeta: MoMetaInterface = new MoMeta(moDefDef)
Object.assign(moDefDef, {
    name: 'moDef',
    dbName: 'moDef',
    displayName: 'Mo Definition',
    keyFieldnames: ['moName'],
    gridFieldnames: ['name', 'gdriveFilePath'],
    moClass: typeof MoDefinition,
    hasId: true,
    idType: 'string',
    // dataSource: new CacheDataSource(moDefDef),
    gdriveFilePath: 'system/resources',
    gdriveFileId: null,
    canCreate: false,
});
var moDefDefDef = new MoDefinition('moDefDef');
