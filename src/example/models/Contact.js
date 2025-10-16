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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactMoMeta = exports.Contact = void 0;
var Mo_js_1 = require("../managedObjects/Mo.js");
var MoDefinition_js_1 = require("../managedObjects/MoDefinition.js");
// import { newMoMetaFromMoDef } from '../managedObjects/moMetaInstances.js'
var MoMeta_js_1 = require("../managedObjects/MoMeta.js");
var Contact = /** @class */ (function (_super) {
    __extends(Contact, _super);
    function Contact() {
        var _this = _super.call(this, contactMoMeta) || this;
        _this.hydrate = function (props) {
            Object.assign(_this, props);
        };
        return _this;
    }
    return Contact;
}(Mo_js_1.Mo));
exports.Contact = Contact;
var contactMoDef = MoDefinition_js_1.MoDefinition.fromProps({
    hasId: false,
    name: 'contacts',
    id: 'contacts',
    keyFieldnames: ['phone', 'email'],
    gridFieldnames: ['firstName', 'lastName', 'phone'],
});
contactMoDef.initFieldDefs();
var contactMoMeta;
var getContactMoMeta = function () {
    if (!contactMoMeta)
        contactMoMeta = new MoMeta_js_1.MoMeta(contactMoDef);
    return contactMoMeta;
};
exports.getContactMoMeta = getContactMoMeta;
contactMoDef.moClass = Contact;
