"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoFieldDefinition = void 0;
var FieldDefinition_js_1 = require("./FieldDefinition.js");
var CommonFieldDefinition_js_1 = require("./CommonFieldDefinition.js");
// export const BaseFieldDefs: { [name: string]: FieldDefinition<any> } = {
exports.MoFieldDefinition = (0, FieldDefinition_js_1.from)(CommonFieldDefinition_js_1.BaseFieldDefs.Object);
exports.MoFieldDefinition.type = 'MO';
exports.MoFieldDefinition.gridColDef = {
    type: 'object'
};
