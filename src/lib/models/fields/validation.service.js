"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationService = exports.ValidationService = void 0;
var errorName_js_1 = require("../../services/common/message/errorName.js");
var rezult_js_1 = require("../../services/common/message/rezult.js");
var ValidationService = /** @class */ (function () {
    function ValidationService() {
        var _this = this;
        this.key = function (str, len) {
            if (len === void 0) { len = 40; }
            var valid = str && typeof str == 'string' && str.match(new RegExp('^[a-zA-Z][a-zA-Z_\\d]{1,' + (len - 1) + '}$'));
            if (!valid) {
                return new rezult_js_1.Rezult(errorName_js_1.ErrorName.db_invalid_key, { key: str });
            }
            return null;
        };
        this.intRegex = new RegExp(/^[0-9]{0,10}$/);
        this.maxInt = Math.pow(2, 31) - 1;
        this.int = function (options) {
            if (options === void 0) { options = {}; }
            var min = options.min || 0;
            var max = options.max || _this.maxInt;
            var validateMinMax = function (value) {
                if (value < min) {
                    return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_numberTooSmall, { value: value, min: min });
                }
                if (max && value > max) {
                    return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_numberTooLarge, { value: value, max: max });
                }
                return null;
            };
            return {
                parse: function (str) {
                    if (options.nullable && (str === undefined || str === null)) {
                        return null;
                    }
                    if (!_this.intRegex.test(str)) {
                        throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_number, { str: str });
                    }
                    var value = parseInt(str);
                    var rezult = validateMinMax(value);
                    if (rezult) {
                        throw rezult;
                    }
                    return value;
                },
                validate: function (value) {
                    if (options.nullable && (value === undefined || value === null)) {
                        return null;
                    }
                    if (!Number.isSafeInteger(value)) {
                        return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_number, { value: value });
                    }
                    return validateMinMax(value);
                },
                validateString: function (str) {
                    if (options.nullable && (str === undefined || str === null)) {
                        return null;
                    }
                    if (!_this.intRegex.test(str)) {
                        return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_number, { value: str });
                    }
                    var value = parseInt(str);
                    return validateMinMax(value);
                },
            };
        };
        this.idRegex = new RegExp(/^[1-9][0-9]{0,9}$/);
        this.id = function (options) {
            if (options === void 0) { options = {}; }
            return {
                parse: function (str) {
                    if (options.nullable && (str === undefined || str === null)) {
                        return null;
                    }
                    if (!_this.idRegex.test(str)) {
                        throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_number, { str: str });
                    }
                    var value = parseInt(str);
                    if (value > _this.maxInt) {
                        throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_numberTooLarge, { str: str });
                    }
                    return value;
                },
                validate: function (value) {
                    if (options.nullable && (value === undefined || value === null)) {
                        return null;
                    }
                    if (!Number.isSafeInteger(value)) {
                        return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_number, { value: value });
                    }
                    if (value < 0) {
                        return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_numberTooSmall, { value: value, min: 0 });
                    }
                    if (value > _this.maxInt) {
                        return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_numberTooLarge, { value: value, max: _this.maxInt });
                    }
                    return null;
                },
                validateString: function (str) {
                    if (options.nullable && (str === undefined || str === null)) {
                        return null;
                    }
                    if (!_this.idRegex.test(str)) {
                        return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_number, { str: str });
                    }
                    var value = parseInt(str);
                    if (value > _this.maxInt) {
                        return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_numberTooLarge, { str: str });
                    }
                    return null;
                },
            };
        };
        this.idValidator = this.id();
        this.validateEmail = function (value) {
            var re = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(value)) {
                return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid_email, { value: value });
            }
            return null;
        };
        this.email = {
            validate: this.validateEmail,
            validateString: this.validateEmail,
            parse: function (str) {
                var rezult = _this.validateEmail(str);
                if (rezult) {
                    return rezult;
                }
                return str;
            },
        };
        this.ok = function () {
            return {
                validate: function (value) {
                    return null;
                },
                validateString: function (str) {
                    return null;
                },
            };
        };
        this.buildText = function (regexStr, minlen, maxlen) {
            return {
                parse: function (value) { return value; },
                validate: function (value) {
                    var fullRegexStr = regexStr;
                    if (minlen) {
                        fullRegexStr = "^".concat(regexStr, "{").concat(minlen).concat(maxlen ? ',' + maxlen : '', "}$");
                    }
                    var regex = new RegExp(fullRegexStr);
                    if (!regex.test(value)) {
                        return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid, { value: value });
                    }
                    return null;
                },
            };
        };
        this.name = {
            parse: function (value) { return value; },
            validate: function (value) {
                var regex = new RegExp(/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' \-]{2,40}$/);
                if (!regex.test(value)) {
                    return new rezult_js_1.Rezult(errorName_js_1.ErrorName.field_invalid, { value: value, format: { min: 2, max: 40, first: 'character', content: ['character', 'space', '-'] } });
                }
                return null;
            },
        };
        this.text = function (minlen, maxlen) {
            return _this.buildText('[\\w]', minlen, maxlen);
        };
        // dbname = this.buildText('[\\w]', 3, 20)
        this.password = this.buildText('[\\w-_!@#$%^&*]*', 8, 20);
    }
    return ValidationService;
}());
exports.ValidationService = ValidationService;
exports.validationService = new ValidationService();
