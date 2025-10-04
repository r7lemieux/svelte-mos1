"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyOwnProperties = exports.bindFunctions = void 0;
var bindFunctions = function (obj, props) {
    if (props === void 0) { props = obj; }
    for (var _i = 0, _a = Object.values(props); _i < _a.length; _i++) {
        var prop = _a[_i];
        if (typeof (prop) == 'function') {
            prop.bind(obj);
        }
    }
};
exports.bindFunctions = bindFunctions;
var copyOwnProperties = function (source, target, topTarget) {
    if (topTarget === void 0) { topTarget = target; }
    var sourcePropNames = Object.getOwnPropertyNames(source);
    for (var n = 0; n < sourcePropNames.length; n++) {
        var propname = sourcePropNames[n];
        var value = source[propname];
        if (typeof value === 'object' && value.constructor.name !== 'RegExp') {
            target[propname] = Object.create(source[propname]);
            (0, exports.copyOwnProperties)(source[propname], target[propname], topTarget);
        }
        else {
            target[propname] = source[propname];
        }
    }
    (0, exports.bindFunctions)(topTarget, target);
};
exports.copyOwnProperties = copyOwnProperties;
