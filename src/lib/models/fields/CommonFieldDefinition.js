"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldDef = exports.CommonFieldDefs = exports.BaseFieldDefs = void 0;
var FieldDefinition_js_1 = require("./FieldDefinition.js");
//ref some regex from https://owasp.org/www-community/OWASP_Validation_Regex_Repository
exports.BaseFieldDefs = {
    Id: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        regex: /^[A-Za-z0-9]{1-40}$/,
        maxLen: 40,
        gridColDef: {
            hide: true
        },
    }),
    Name: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        regex: /^[A-Za-z][A-Za-z0-9_\-]{1,59}$/,
        regexFlag: 'i',
        maxLen: 60,
    }),
    ProperName: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        regex: /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' \-]{1,59}$/,
        regexFlag: 'i',
        maxLen: 60,
    }),
    Text: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        regex: /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' .\-]*$/,
        regexFlag: 'i',
    }),
    Email: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        // regex: /(?:[a-z0-9!#$%&'*+\/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_\`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0E-\\x0F \\x21\\x23-\\x5b\\x5D-\\x7F]|[\\x01-\\x09\\x0b\\x0c\\x0E-\\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0E-\\x7F])+)])/,
        // regex: /(?:[a-z0-9!#$%&'*+\/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+\/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])/,
        maxLen: 254,
        inputType: 'email',
    }),
    PhoneNumber: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        regex: /^[*#\-()\s]{25}$`/,
        gridColDef: {
            minWidth: 120,
        },
        inputType: 'tel',
        parse: function (s) {
            if (!s)
                return;
            var r = s;
            var s1 = s
                .replaceAll('(', '')
                .replaceAll(')', '')
                .replaceAll(' ', '')
                .replaceAll('-', '')
                .replaceAll('*', '')
                .replaceAll('#', '');
            if (s1.startsWith('1'))
                s1 = s1.slice(1);
            if (s1.length >= 10) {
                r = "".concat(s1.slice(0, 3), "-").concat(s1.slice(3, 6), "-").concat(s1.slice(6, 10));
                if (s1.length > 10) {
                    r += " #".concat(s1.slice(10));
                }
            }
            return r;
        }
    }),
    AddressLine: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        regex: /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9' \\-]{1,59}$/,
        regexFlag: 'i',
        maxLen: 60,
    }),
    PostalCode: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        regex: /^[A-Za-z0-9 ]{1,20}$/,
        maxLen: 10,
    }),
    Date: new FieldDefinition_js_1.FieldDefinition({
        type: 'date',
        gridColDef: {
            cellRenderer: function (params) {
                var _a;
                return (_a = params.value) === null || _a === void 0 ? void 0 : _a.toLocaleDateString('en-US', { dateStyle: 'medium' });
            },
            minWidth: 130,
            maxWidth: 135,
        },
        inputType: 'datetime-local',
        regex: /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
    }),
    Timestamp: new FieldDefinition_js_1.FieldDefinition({
        type: 'int',
        inputType: 'number',
        regex: /\d{10,13}/,
    }),
    IpAddress: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        name: 'IP address',
        example: '111.222.333.444',
        regex: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    }),
    URL: new FieldDefinition_js_1.FieldDefinition({
        type: 'string',
        inputType: 'url',
        regex: /^((((https?|ftps?|gopher|telnet|nntp):\/\/)|(mailto:|news:))(%[0-9A-Fa-f]{2}|[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)([).!';/?:,][[:blank:|:blank:]])?$]/
    }),
    UrlPath: new FieldDefinition_js_1.FieldDefinition({
        regex: /^[a-zA-z0-9\-]+(\/[a-zA-Z0-9\-]+)*$/
    }),
    MacAddress: new FieldDefinition_js_1.FieldDefinition({
        regex: /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/,
        example: "0A:52:F9:8A:23:Bc:"
    }),
    Integer: new FieldDefinition_js_1.FieldDefinition({
        type: 'int',
        regex: /^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/,
    }),
    Float: new FieldDefinition_js_1.FieldDefinition({
        type: 'float',
        regex: /^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/,
    }),
    Filename: new FieldDefinition_js_1.FieldDefinition({
        regex: /^(([a-zA-Z]:|\\)\\)?(((\.)|(\.\.)|([^\\/:*?"|<>. ](([^\\/:*?"|<>. ])|([^\\/:*?"|<>]*[^\\/:*?"|<>. ]))?))\\)*[^\\/:*?"|<>. ](([^\\/:*?"|<>. ])|([^\\/:*?"|<>]*[^\\/:*?"|<>. ]))?$/
    }),
    DomainName: new FieldDefinition_js_1.FieldDefinition({
        regex: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
        example: "allo5.google-map.com"
    }),
    Object: new FieldDefinition_js_1.FieldDefinition({
        type: 'object',
    }),
    Array: new FieldDefinition_js_1.FieldDefinition({
        type: 'array',
    }),
    Map: new FieldDefinition_js_1.FieldDefinition({
        type: 'map',
    }),
    Boolean: new FieldDefinition_js_1.FieldDefinition({
        type: 'boolean',
        gridColDef: {
            maxWidth: 25,
            cellStyle: function (params) {
                return { background: params.value ? '#0F0' : '#555' };
            }
        },
    }),
    NullableBoolean: new FieldDefinition_js_1.FieldDefinition({
        type: 'boolean',
        gridColDef: {
            type: 'object',
            maxWidth: 25,
            cellStyle: function (params) {
                var v = params.value;
                if (v === undefined || v === null)
                    return;
                return { background: v ? '#0F0' : '#555' };
            }
        }
    }),
    Icon: new FieldDefinition_js_1.FieldDefinition({
        type: 'icon',
        gridColDef: {
            hide: false,
            headerName: ' ',
            minWidth: 125,
            maxWidth: 125,
            flex: 3,
            cellStyle: { padding: '5px' },
            cellRenderer: 'btnCellRenderer'
        }
    }),
    Default: new FieldDefinition_js_1.FieldDefinition({
        name: '',
        maxLen: 256,
        parse: function (v) { return v; }
    })
};
exports.CommonFieldDefs = {
    name: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Name),
    firstName: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.ProperName),
    middleName: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.ProperName),
    lastName: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.ProperName, { gridColDef: { minWidth: 100 } }),
    email: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Email),
    phoneNumber2: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.PhoneNumber),
    workPhoneNumber: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.PhoneNumber),
    addressLine1: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.AddressLine),
    addressLine2: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.AddressLine),
    addressLine3: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.AddressLine),
    city: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Name),
    state: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Name),
    country: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Name),
    company: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Name),
    jobTitle: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Name),
    time: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Date),
    link: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.URL),
    mo: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Object),
    id: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Id),
    url: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.URL),
    icon: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Icon),
    mimeType: (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.UrlPath),
    '': (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Default)
    // generated, delete
    // urlPath: from(BaseFieldDefs.UrlPath),
    // object: from(BaseFieldDefs.Object),
    // array: from(BaseFieldDefs.Array),
    // domainName: from(BaseFieldDefs.DomainName),
    // filename: from(BaseFieldDefs.Filename),
    // floatText: from(BaseFieldDefs.FloatText),
    // macAddress: from(BaseFieldDefs.MacAddress),
    // ipAddress: from(BaseFieldDefs.IpAddress),
    // timestamp: from(BaseFieldDefs.Timestamp),
};
for (var _i = 0, _a = Object.entries(exports.CommonFieldDefs); _i < _a.length; _i++) {
    var _b = _a[_i], key = _b[0], fd = _b[1];
    if (!fd.name)
        fd.name = key;
}
for (var _c = 0, _d = Object.entries(exports.BaseFieldDefs); _c < _d.length; _c++) {
    var _e = _d[_c], key = _e[0], fd = _e[1];
    var name_1 = key[0].toLowerCase() + key.slice(1);
    if (!exports.CommonFieldDefs[name_1])
        exports.CommonFieldDefs[name_1] = (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs[key]);
}
var getFieldDef = function (name) {
    var _a;
    return ((_a = exports.CommonFieldDefs[name]) === null || _a === void 0 ? void 0 : _a.clone()) || (0, FieldDefinition_js_1.from)(exports.BaseFieldDefs.Default, { name: name });
};
exports.getFieldDef = getFieldDef;
