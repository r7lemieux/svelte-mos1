"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUiMoDef = exports.UiMoDefs = void 0;
var MoDefinition_js_1 = require("./MoDefinition.js");
var FieldDefinitionMo_js_1 = require("../fields/FieldDefinitionMo.js");
exports.UiMoDefs = {};
var getUiMoDef = function (moDef) {
    var uiMoDef = new MoDefinition_js_1.MoDefinition(moDef.name);
    Object.assign(uiMoDef, moDef);
    uiMoDef.fieldDefs = new Map();
    for (var _i = 0, _a = (Array.from(moDef.fieldDefs.values())); _i < _a.length; _i++) {
        var fieldDef = _a[_i];
        var uiFieldDef = new FieldDefinitionMo_js_1.FieldDefinitionMo(fieldDef);
        uiMoDef.fieldDefs.set(fieldDef.name, uiFieldDef);
    }
    return moDef;
};
exports.getUiMoDef = getUiMoDef;
// export const registerMoDef = (moDef: MoDefinition) => {
//   moDefMeta.dataSource?.saveMo(moDef)
// }
// export const getMoDef = (moname:string): Promise<MoDefinition> => {
//   return moDefMeta.dataSource?.getMo(moname)
//     .then( mo => {
//       return mo as MoDefinition
//     })
// }
