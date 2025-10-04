"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoMeta = void 0;
var errorName_js_1 = require("../../services/common/message/errorName.js");
var rezult_js_1 = require("../../services/common/message/rezult.js");
var Heap_dataSource_js_1 = require("../../services/db/Heap.dataSource.js");
var MoMeta = /** @class */ (function () {
    function MoMeta(moDef, dbName) {
        var _this = this;
        this.name = '';
        this.dbName = '';
        this.setName = function (given_name) {
            var name = '';
            if (given_name) {
                if (!given_name.match(/[A-Za-z-1-9]/))
                    throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid, {
                        method: 'MoMeta.extractFieldnamesFromMo',
                        name: given_name,
                    });
                name = given_name;
                // } else if (this.dataSource && this.dataSource.name) {
                //   name = this.moDef.name + '.' + this.dataSource.name
            }
            else if (_this.moDef.name) {
                name = _this.moDef.name;
            }
            else {
                name = _this.dbName;
            }
            //Todo ensure name is unique
            _this.name = name;
        };
        /*  ---------
         *  Accessors
         *  ---------
         */
        this.getDisplayName = function () { return _this.name; };
        /*  --
         *  Mo
         *  These methods delegate to MoDef by default
         *  in order to share MoDef behavior
         *  They add the dataSource management
         *  They can be overridden
         *  --
         */
        this.newMo = function () {
            var mo = _this.moDef.newMo();
            mo.moMeta = _this;
            _this.dataSource.addMo(mo);
            return mo;
        };
        this.moToObj = function (mo) { return _this.moDef.moToObj(mo); };
        this.moToDocument = function (mo) { return _this.moDef.moToDocument(mo); };
        this.objToMo = function (obj) { return _this.moDef.objToMo(obj, _this); };
        this.toDocument = function () {
            //Todo
        };
        this.documentToMo = function (doc) {
            var mo = _this.newMo();
            for (var _i = 0, _a = Array.from(_this.moDef.fieldDefs.entries()); _i < _a.length; _i++) {
                var _b = _a[_i], fname = _b[0], fDef = _b[1];
                mo[fname] = fDef.documentToValue(doc[fname]);
            }
            return mo;
        };
        if (!moDef) {
            console.trace("==>MoMeta.ts:21 dbName", dbName || '');
            throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.argument_null, { name: name });
        }
        this.moDef = moDef;
        this.dataSource = new Heap_dataSource_js_1.HeapDataSource(this.moDef);
        this.setName();
        this.dbName = dbName || this.name;
        this.init();
    }
    /* ------------
     * Construction
     * ------------
     */
    MoMeta.prototype.init = function () {
    };
    MoMeta.fromMoDef = function (moDef) { return new MoMeta(moDef); };
    return MoMeta;
}());
exports.MoMeta = MoMeta;
