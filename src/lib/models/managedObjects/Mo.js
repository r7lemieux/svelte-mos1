"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mo = void 0;
var moMetaInstances_js_1 = require("./moMetaInstances.js");
var Mo = /** @class */ (function () {
    function Mo(moMeta) {
        var _this = this;
        this.getDisplayName = function () { return '' + _this.id; };
        this.setProps = function (props) {
            for (var _i = 0, _a = Object.getOwnPropertyNames(props); _i < _a.length; _i++) {
                var key = _a[_i];
                // if (key != 'fieldDefs') {
                _this[key] = props[key];
                // }
            }
            return _this;
        };
        this.toObj = function () {
            var data = {};
            if (_this.id)
                data.id = _this.id;
            for (var _i = 0, _a = Array.from(_this.moMeta.moDef.fieldDefs.keys()); _i < _a.length; _i++) {
                var fname = _a[_i];
                //const fieldDef = this.moMeta.moDef.fieldDefs.get(fname)
                var value = _this[fname];
                if (value !== undefined && value !== null) {
                    data[fname] = _this[fname];
                }
            }
            return data;
        };
        this.toDocument = function () {
            var data = {};
            if (_this.id)
                data.id = _this.id;
            for (var _i = 0, _a = Array.from(_this.moMeta.moDef.fieldDefs.keys()); _i < _a.length; _i++) {
                var fname = _a[_i];
                var fieldDef = _this.moMeta.moDef.fieldDefs.get(fname);
                var value = _this[fname];
                if (value !== undefined && value !== null) {
                    data[fname] = fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.valueToDocument(_this[fname]);
                }
            }
            return data;
        };
        this.moMeta = moMeta || (0, moMetaInstances_js_1.getDefaultMoMeta)();
    }
    Mo.prototype.hydrate = function (partial) {
        // noinspection TypeScriptValidateTypes
        Object.assign(this, partial);
    };
    return Mo;
}());
exports.Mo = Mo;
//1 defaultMoMeta.moDef.moClass = Mo
