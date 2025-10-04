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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OK = exports.Rezult = void 0;
var errorName_js_1 = require("./errorName.js");
var string_utils_js_1 = require("../util/string.utils.js");
var Rezult = /** @class */ (function (_super) {
    __extends(Rezult, _super);
    function Rezult(errorName, data, context) {
        if (errorName === void 0) { errorName = errorName_js_1.ErrorName.ok; }
        var _this = _super.call(this) || this;
        _this.status = 'error';
        _this.setName = function (errorName) {
            _this.name = errorName_js_1.ErrorName[errorName];
        };
        _this.toObj = function () {
            var obj = {
                name: _this.name,
                status: _this.status,
            };
            if (_this.context)
                obj.context = _this.context;
            if (_this.data)
                obj.data = _this.data;
            return obj;
        };
        _this.serialize = function () { return JSON.stringify(_this.toObj()); };
        _this.toString = function () { return _this.toDisplayString(); };
        _this.toDisplayString = function () {
            var data = _this.data;
            try {
                data = JSON.stringify(_this.data);
            }
            catch (err) {
                try {
                    data = _this.stringifyOneLevel(_this.data);
                }
                catch (err) {
                    try {
                        data = _this.data.toString();
                    }
                    catch (err) {
                        data = _this.data;
                    }
                }
            }
            return "".concat(_this.status, " ").concat(_this.context || '', " ").concat(_this.name, " ").concat(_this.message, " ").concat(data ? JSON.stringify(data) : '');
        };
        _this.toDetailString = function () { return (0, string_utils_js_1.jsonToDisplayString)({
            status: _this.status, data: _this.data, context: _this.context
        }); };
        _this.stringifyOneLevel = function (obj) { return JSON.stringify(obj, function (k, v) { return k && v && typeof v !== "number" ? (Array.isArray(v) ? "[object Array]" : "" + v) : v; }); };
        _this.print = function (str) {
            _this.context = str;
            // if (!process.env.testing) {
            //   console.log(this.toString())
            // }
        };
        _this.setName(errorName);
        _this.data = data;
        _this.context = context;
        return _this;
        // if (errorName != ErrorName.ok)
        //   console.trace(`==>rezult.ts:19 `, this.toString())
    }
    Rezult.mode = 'test';
    Rezult.build = function (err, data, context) {
        if (err && err instanceof Rezult)
            return err;
        var rezult = new Rezult(errorName_js_1.ErrorName.type5_error);
        console.trace("==>rezult.ts:78 rezult", rezult);
        if (data)
            rezult.data = data;
        if (context)
            rezult.context = context;
        if (err && err.message) {
            rezult.data = __assign(__assign({}, rezult.data), { err: err.message });
            // {message: err.message}
        }
        return rezult;
    };
    return Rezult;
}(Error));
exports.Rezult = Rezult;
exports.OK = new Rezult(errorName_js_1.ErrorName.ok);
