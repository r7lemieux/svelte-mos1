import {FieldDefinition, from} from './FieldDefinition.js'
import {fromMoField, MoFieldDefinition} from './MoFieldDefinition.js'
import {EnumFieldDefinition} from './EnumFieldDefinition.js'
// import { MoFieldDefinition } from './MoFieldDefinition.js'
//ref some regex from https://owasp.org/www-community/OWASP_Validation_Regex_Repository
export const BaseFieldDefs: { [name: string]: FieldDefinition<any> } = {
  Id: new FieldDefinition<string>({
    type: 'string',
    regex: /^[A-Za-z0-9]{1-40}$/,
    maxLen: 40,
    gridColDef: {
      hide: true
    },
  }),
  Name: new FieldDefinition<string>({
    type: 'string',
    regex: /^[A-Za-z][A-Za-z0-9_\-]{1,59}$/,
    regexFlag: 'i',
    maxLen: 60,
  }),
  ProperName: new FieldDefinition<string>({
    type: 'string',
    regex: /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' \-]{1,59}$/,
    regexFlag: 'i',
    maxLen: 60,
  }),
  Text: new FieldDefinition<string>({
    type: 'string',
    regex: /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' .\-]*$/,
    regexFlag: 'i',
  }),
  Email: new FieldDefinition<string>({
    type: 'string',
    // regex: /(?:[a-z0-9!#$%&'*+\/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_\`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0E-\\x0F \\x21\\x23-\\x5b\\x5D-\\x7F]|[\\x01-\\x09\\x0b\\x0c\\x0E-\\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0E-\\x7F])+)])/,
    // regex: /(?:[a-z0-9!#$%&'*+\/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+\/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])/,
    maxLen: 254,
    inputType: 'email',
  }),
  PhoneNumber: new FieldDefinition<string>({
    type: 'string',
    regex: /^[*#\-()\s]{25}$`/,
    gridColDef: {
      minWidth: 120,
    },
    inputType: 'tel',
    parse: function (s) {
      if (!s) return
      let r = s
      let s1 = s
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll(' ', '')
        .replaceAll('-', '')
        .replaceAll('*', '')
        .replaceAll('#', '')
      if (s1.startsWith('1')) s1 = s1.slice(1)
      if (s1.length >= 10) {
        r = `${s1.slice(0, 3)}-${s1.slice(3, 6)}-${s1.slice(6, 10)}`

        if (s1.length > 10) {
          r += ` #${s1.slice(10)}`
        }
      }
      return r
    }
  }),
  AddressLine: new FieldDefinition({
    type: 'string',
    regex: /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9' \\-]{1,59}$/,
    regexFlag: 'i',
    maxLen: 60,
  }),
  PostalCode: new FieldDefinition({
    type: 'string',
    regex: /^[A-Za-z0-9 ]{1,20}$/,
    maxLen: 10,
  }),
  Date: new FieldDefinition<number>({
      type: 'date',
      gridColDef: {
        cellRenderer: params => {
          if (!params.value.toLocaleString) {
            console.log(`==> CommonFieldDefinition.ts:80 params.value `, params.value)
            return 'invalid date'
          }
          return params.value?.toLocaleDateString('en-US', {dateStyle: 'medium'})
        },
        minWidth: 130,
        maxWidth: 135,
      },
      inputType: 'datetime-local',
      regex: /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
    }
  ),
  Timestamp: new FieldDefinition({
      type: 'int',
      inputType: 'number',
      regex: /\d{10,13}/,
    }
  ),
  IpAddress: new FieldDefinition({
    type: 'string',
    name: 'IP address',
    example: '111.222.333.444',
    regex: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  }),
  URL: new FieldDefinition({
    type: 'string',
    inputType: 'url',
    regex: /^((((https?|ftps?|gopher|telnet|nntp):\/\/)|(mailto:|news:))(%[0-9A-Fa-f]{2}|[-()_.!~*';/?:@&=+$,A-Za-z0-9])+)([).!';/?:,][[:blank:|:blank:]])?$]/
  }),
  UrlPath: new FieldDefinition({
    regex: /^[a-zA-z0-9\-]+(\/[a-zA-Z0-9\-]+)*$/
  }),
  MacAddress: new FieldDefinition({
    regex: /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/,
    example: `0A:52:F9:8A:23:Bc:`
  }),
  Integer: new FieldDefinition({
    type: 'int',
    regex: /^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/,
  }),
  Float: new FieldDefinition({
    type: 'float',
    regex: /^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$/,
  }),
  Filename: new FieldDefinition({
    regex: /^(([a-zA-Z]:|\\)\\)?(((\.)|(\.\.)|([^\\/:*?"|<>. ](([^\\/:*?"|<>. ])|([^\\/:*?"|<>]*[^\\/:*?"|<>. ]))?))\\)*[^\\/:*?"|<>. ](([^\\/:*?"|<>. ])|([^\\/:*?"|<>]*[^\\/:*?"|<>. ]))?$/
  }),
  DomainName: new FieldDefinition({
    regex: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
    example: `allo5.google-map.com`
  }),
  Object: new FieldDefinition({
    type: 'object',
  }),
  Mo: new MoFieldDefinition('', {
    type: 'mo',
    gridColDef: {
      cellRenderer: params => {
        return params.value?.getDisplayName()
      }
    },
  }),
  MoArray: new MoFieldDefinition('Mo', {
    type: 'moArray',
    gridColDef: {
      cellRenderer: params => {
         if (params.value) {
             const arr = params.value as Array<any>
             return arr.join(', ')
         }
         return ''
      }
    }}),
  Array: new FieldDefinition({
    type: 'array'
  }),
  Map: new FieldDefinition({
    type: 'map',
  }),
  Enum: new EnumFieldDefinition({
    type: 'enum'
  }),
  Boolean: new FieldDefinition({
    type: 'boolean',
    gridColDef: {
      maxWidth: 25,
      cellStyle: params => {
        return {background: params.value ? '#0F0' : '#555'}
      }
    },
  }),
  NullableBoolean: new FieldDefinition({
    type: 'boolean',
    gridColDef: {
      type: 'object',
      maxWidth: 25,
      cellStyle: params => {
        const v = params.value
        if (v === undefined || v === null) return
        return {background: v ? '#0F0' : '#555'}
      }
    }
  }),
  Icon: new FieldDefinition({
    type: 'icon',
    gridColDef: {
      hide: false,
      headerName: ' ',
      minWidth: 125,

      maxWidth: 125,
      flex: 3,
      cellStyle: {padding: '5px'},
      cellRenderer: 'btnCellRenderer'
    }
  }),
  Default: new FieldDefinition(
    {
      name: '',
      maxLen: 256,
      parse: function (v) { return v}
    })
}

export const CommonFieldDefs = {
  name: from(BaseFieldDefs.Name),
  firstName: from(BaseFieldDefs.ProperName),
  middleName: from(BaseFieldDefs.ProperName),
  lastName: from(BaseFieldDefs.ProperName, {gridColDef: {minWidth: 100}}),
  email: from(BaseFieldDefs.Email),
  phoneNumber2: from(BaseFieldDefs.PhoneNumber),
  workPhoneNumber: from(BaseFieldDefs.PhoneNumber),
  addressLine1: from(BaseFieldDefs.AddressLine),
  addressLine2: from(BaseFieldDefs.AddressLine),
  addressLine3: from(BaseFieldDefs.AddressLine),
  city: from(BaseFieldDefs.Name),
  state: from(BaseFieldDefs.Name),
  country: from(BaseFieldDefs.Name),
  company: from(BaseFieldDefs.Name),
  jobTitle: from(BaseFieldDefs.Name),
  time: from(BaseFieldDefs.Date),
  year: from(BaseFieldDefs.Integer),
  month: from(BaseFieldDefs.Integer),
  day: from(BaseFieldDefs.Integer),
  link: from(BaseFieldDefs.URL),
  mo: fromMoField(BaseFieldDefs.Mo),
  moArray: fromMoField(BaseFieldDefs.MoArray),
  id: from(BaseFieldDefs.Id),
  url: from(BaseFieldDefs.URL),
  icon: from(BaseFieldDefs.Icon),
  mimeType: from(BaseFieldDefs.UrlPath),
  '': from(BaseFieldDefs.Default)

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
}

for (const [key, fd] of Object.entries(CommonFieldDefs)) {
  if (!fd.name) fd.name = key
}
for (const [key, fd] of Object.entries(BaseFieldDefs)) {
  const name = key[0].toLowerCase() + key.slice(1)
  if (!CommonFieldDefs[name]) CommonFieldDefs[name] = from(BaseFieldDefs[key])
}
export const buildFieldDef = (name: string): FieldDefinition<any> => {
  return CommonFieldDefs[name]?.clone() || from(BaseFieldDefs.Default, {name})
}


