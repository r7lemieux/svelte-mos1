"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoMeta = void 0;
var MoMetaMo_js_1 = require("./MoMetaMo.js");
// import { MoMetaMo } from './MoMetaMo.js'
// import { Rezult } from '../../services/common/message/Rezult.js'
// import { ErrorName } from '../../services/common/message/ErrorName.js'
// import {FieldDefinitionMo} from '../fields/FieldDefinitionMo'
// import type {FieldDefinition} from '../../fields/FieldDefinition'
// import { MoDefinitionMo } from './MoDefinitionMo.js'
// export const registerMoMeta = (moMeta: MoMeta) => {
//   const moMetaMo = new MoMetaMo(moMeta)
//   const moDefMo = new MoDefinitionMo(moMeta.moDef)
//   // moMetaMo.id = moMetaMo.id || nextId++
//   moMetaMo.id = moMetaMo.id || moMeta.name
//   moMetaMo.name = moMetaMo.name || moMetaMo.id
//   moMetaMo.moDef = moDefMo
//   moMetaMoMeta.dataSource?.saveMo(moMetaMo)
// }
// export const getMoMetaMo = (name): Promise<MoMetaMo> => {
//   return moMetaMoMeta.dataSource?.getMo(name)
//     .then( mo => {
//       return mo as MoMetaMo
//     })
// }
var getMoMeta = function (name) {
    var _a;
    return (_a = MoMetaMo_js_1.moMetaMoMeta.dataSource) === null || _a === void 0 ? void 0 : _a.getMo(name).then(function (mo) {
        return mo === null || mo === void 0 ? void 0 : mo.moMeta;
    });
};
exports.getMoMeta = getMoMeta;
