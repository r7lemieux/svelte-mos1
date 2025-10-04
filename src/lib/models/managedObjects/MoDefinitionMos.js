"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoDefMo = void 0;
var MoDefinitionMo_js_1 = require("./MoDefinitionMo.js");
// export const registerMoDef = (moDef: MoDefinition) => {
//   const moDefMo = new MoDefinitionMo(moDef)
//   moDefMo.name = moDef.id = moDef.name
//   moDefMoMeta.dataSource?.saveMo(moDefMo)
// }
var getMoDefMo = function (moname) {
    var _a;
    return (_a = MoDefinitionMo_js_1.moDefMoMeta.dataSource) === null || _a === void 0 ? void 0 : _a.getMo(moname).then(function (mo) {
        return mo;
    });
};
exports.getMoDefMo = getMoDefMo;
