"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoMetaMo = exports.registerMoDef = exports.registerMoMeta = exports.moDefs = exports.moMetas = void 0;
var MoMetaMo_js_1 = require("../../models/managedObjects/MoMetaMo.js");
var MoDefinitionMo_js_1 = require("../../models/managedObjects/MoDefinitionMo.js");
var MoDefinitionMo_js_2 = require("../../models/managedObjects/MoDefinitionMo.js");
var rezult_js_1 = require("../common/message/rezult.js");
var errorName_js_1 = require("../common/message/errorName.js");
exports.moMetas = {};
exports.moDefs = {};
var registerMoMeta = function (moMeta) {
    var _a;
    var name = moMeta.name;
    if (!name)
        throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.missing_param);
    var moDefMo = (0, exports.registerMoDef)(moMeta.moDef);
    exports.moMetas[name] = moMeta;
    var moMetaMo = new MoMetaMo_js_1.MoMetaMo(MoMetaMo_js_1.moMetaMoMeta);
    // moMetaMo.id = moMetaMo.id || nextId++
    moMetaMo.id = moMetaMo.id || moMeta.name;
    // moMetaMo.name = moMetaMo.name || moMetaMo.id
    moMetaMo.moDef = moDefMo;
    exports.moMetas[name] = moMeta;
    (_a = MoMetaMo_js_1.moMetaMoMeta.dataSource) === null || _a === void 0 ? void 0 : _a.saveMo(moMetaMo);
};
exports.registerMoMeta = registerMoMeta;
var registerMoDef = function (moDef) {
    var _a;
    var name = moDef.name;
    if (!name)
        throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.missing_param);
    exports.moDefs[name] = moDef;
    var moDefMo = new MoDefinitionMo_js_1.MoDefinitionMo(moDef);
    (_a = MoDefinitionMo_js_2.moDefMoMeta.dataSource) === null || _a === void 0 ? void 0 : _a.saveMo(moDefMo);
    return moDefMo;
};
exports.registerMoDef = registerMoDef;
var getMoMetaMo = function (name) {
    var moMeta = exports.moMetas[name];
    if (!moMeta)
        throw new rezult_js_1.Rezult(errorName_js_1.ErrorName.missing_param);
    return new MoMetaMo_js_1.MoMetaMo(moMeta);
};
exports.getMoMetaMo = getMoMetaMo;
// export const getMoDefMo = (name): MoDefinition => {
// 	const moDef = moDefs[name]
// 	if (!moDef) throw new Rezult(ErrorName.missing_param)
// 	return new MoDefinitionMo(moDef)
// }
