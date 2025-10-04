"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoListModel = void 0;
// Prototype
var CommonFieldDefinition_js_1 = require("../fields/CommonFieldDefinition.js");
var FieldDefinition_js_1 = require("../fields/FieldDefinition.js");
var rezult_js_1 = require("../../services/common/message/rezult.js");
var FieldMatcher_js_1 = require("../fields/FieldMatcher.js");
var MoDefinition_js_1 = require("./MoDefinition.js");
var errorName_js_1 = require("../../services/common/message/errorName.js");
var MoMeta_js_1 = require("./MoMeta.js");
var MoListModel = /** @class */ (function () {
    function MoListModel(moMeta) {
        var _this = this;
        this.mos = [];
        this.fieldDefs = new Map();
        this.errors = [];
        this.getName = function () { return _this.moDef.name; };
        this.getFieldDefs = function () {
            if (!_this.fieldDefs) {
                _this.fieldDefs = _this.moDef.fieldDefs || new Map();
            }
            return _this.fieldDefs;
        };
        /* ----------------------
        * Construct From Objects
        * -----------------------
        */
        this.buildFromObjs = function (objs) {
            _this.moDef.fieldDefs = _this.buildFieldDefs(objs);
            _this.mos = objs.map(_this.moDef.objToMo);
        };
        this.buildFieldnameToKeys = function (objs) {
            if (!objs || !objs.length)
                return {};
            var keyToFieldname = {};
            var fieldnameToKeys = {};
            for (var _i = 0, objs_1 = objs; _i < objs_1.length; _i++) {
                var obj = objs_1[_i];
                for (var _a = 0, _b = Object.keys(obj); _a < _b.length; _a++) {
                    var key = _b[_a];
                    var mappedFieldName = keyToFieldname[key];
                    if (!mappedFieldName) {
                        var fieldName1 = (0, FieldMatcher_js_1.getClosestFieldName)(key);
                        //later find mapping base on single words. The last one is most important. i.e. "home phone" is phone type
                        if (!fieldnameToKeys[fieldName1])
                            fieldnameToKeys[fieldName1] = [];
                        fieldnameToKeys[fieldName1].push(key);
                        keyToFieldname[key] = fieldName1;
                    }
                }
            }
            return fieldnameToKeys;
        };
        this.buildFieldDefs = function (objs) {
            var fieldDefs = new Map();
            if (!objs || !objs.length)
                return fieldDefs;
            var fieldnameToKeys = _this.buildFieldnameToKeys(objs);
            for (var _i = 0, _a = Object.entries(fieldnameToKeys); _i < _a.length; _i++) {
                var _b = _a[_i], fieldname = _b[0], keys = _b[1];
                for (var _c = 0, keys_1 = keys; _c < keys_1.length; _c++) {
                    var key = keys_1[_c];
                    //later keyToFieldname[key] = normalize(key) // get a nice key name, try to use a common fieldDef
                    // keyToFieldname[key] = key
                    var fieldDef = FieldDefinition_js_1.FieldDefinition.from(CommonFieldDefinition_js_1.CommonFieldDefs[fieldname], { key: key, name: key });
                    fieldDefs.set(fieldname, fieldDef);
                    //Build a field def for those keys.
                }
            }
            return fieldDefs;
        };
        this.extractFieldNamesFromHeaderLine = function (titleStr) { return titleStr.split(',').map(FieldMatcher_js_1.getClosestFieldName); };
        if (!moMeta)
            console.trace("==>MoList.model.ts:20 no moMeta");
        if (!moMeta)
            throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.missing_param);
        this.moMeta = moMeta;
        this.moDef = moMeta.moDef;
    }
    MoListModel.prototype.init = function () {
        // this.mos.forEach(mo => mo.view = 'MMM2')
        // this.addViewButton()
    };
    MoListModel.prototype.buildFromCsv = function (sheetStr) {
        var lines = sheetStr.split('\r\n');
        var titleStr = lines[0];
        this.buildFieldDefsFromTitleLine(titleStr);
        var fieldNames = titleStr.split(',');
        this.moDef.hasId = fieldNames.indexOf('id') !== -1;
        var fieldDefArray = Array.from(this.getFieldDefs().values());
        for (var l = 1; l < lines.length; l++) {
            var line = lines[l];
            var row = {};
            var fields0 = line.split(',');
            for (var i = 0; i < fields0.length; i++) {
                var field0 = fields0[i];
                var fieldDef = fieldDefArray[i];
                if (fieldDef) {
                    try {
                        var field1 = fieldDef.parse(field0);
                        row[fieldDef.name] = field1;
                    }
                    catch (ex) {
                        if (ex && ex instanceof rezult_js_1.Rezult) {
                            ex.context = "parsing line:".concat(l, ", field:").concat(i);
                            this.errors.push(ex);
                        }
                        else {
                            console.trace("==>SpreadSheetBuilder.service.ts:39 ex", ex);
                        }
                    }
                }
            }
            this.mos.push(this.moMeta.objToMo(row));
        }
    };
    MoListModel.prototype.buildFieldDefsFromTitleLine = function (titleStr) {
        var fieldNames = titleStr.split(',');
        var fieldDefNames = this.extractFieldNamesFromHeaderLine(titleStr);
        for (var f = 0; f < fieldNames.length; f++) {
            var fieldDef = FieldDefinition_js_1.FieldDefinition.from(CommonFieldDefinition_js_1.CommonFieldDefs[fieldDefNames[f]] || CommonFieldDefinition_js_1.CommonFieldDefs['default']);
            fieldDef.name = fieldNames[f];
            this.getFieldDefs().set(fieldNames[f], fieldDef);
        }
    };
    MoListModel.prototype.matchFieldDefsFromTitleLine = function (fieldNames, addFields) {
        var _this = this;
        var fieldDefs = fieldNames.map(function (fieldName) {
            var fieldDef = _this.getFieldDefs().get(fieldName);
            if (!fieldDef && addFields) {
                var defFieldName = (0, FieldMatcher_js_1.getClosestFieldName)(fieldName);
                fieldDef = FieldDefinition_js_1.FieldDefinition.from(CommonFieldDefinition_js_1.CommonFieldDefs[defFieldName || CommonFieldDefinition_js_1.CommonFieldDefs['default']]);
                fieldDef.name = fieldName;
                _this.getFieldDefs().set(fieldName, fieldDef);
            }
            return fieldDef;
        });
        return fieldDefs;
    };
    MoListModel.prototype.fillFromCsv = function (sheetStr, options) {
        var lines = sheetStr.split('\r\n');
        var titleStr = lines[0];
        var fieldNames = titleStr.split(',');
        var fieldDefs = this.matchFieldDefsFromTitleLine(fieldNames, !!(options === null || options === void 0 ? void 0 : options.addNewFields));
        if (this.moDef.hasId && fieldNames.indexOf('id') === -1) {
            throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.gdrive_missing_id);
        }
        for (var l = 1; l < lines.length; l++) {
            var line = lines[l];
            var row = {};
            var fields0 = line.split(',');
            for (var i = 0; i < fields0.length; i++) {
                var field0 = fields0[i];
                var fieldDef = fieldDefs[i];
                if (fieldDef) {
                    try {
                        var field1 = fieldDef.parse(field0);
                        row[fieldDef.name] = field1;
                    }
                    catch (ex) {
                        if (ex && ex instanceof rezult_js_1.Rezult) {
                            ex.context = "parsing line:".concat(l, ", field:").concat(i);
                            this.errors.push(ex);
                        }
                        else {
                            console.trace("==>SpreadSheetBuilder.service.ts:39 ex", ex);
                        }
                    }
                }
            }
            this.mos.push(this.moMeta.objToMo(row));
        }
    };
    /* -----
     *  CSV
     * -----
     */
    MoListModel.fromCsv = function (name, str) {
        var moDef = new MoDefinition_js_1.MoDefinition(name);
        var moMeta = new MoMeta_js_1.MoMeta(moDef);
        var model = new MoListModel(moMeta);
        model.buildFromCsv(str);
        return model;
    };
    return MoListModel;
}());
exports.MoListModel = MoListModel;
