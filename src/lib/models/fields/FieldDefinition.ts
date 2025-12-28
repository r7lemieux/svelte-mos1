import type {FieldDefinitionInterface} from './FieldDefinition.interface.js'
import {ErrorName} from '../../services/common/message/errorName.js'
import {OK, Rezult} from '../../services/common/message/rezult.js'
import {objectReplacer, objectToString, toDisplayString} from '../../services/common/util/string.utils.js'
import type {ColDef} from 'ag-grid-community'
import {copyOwnProperties} from '../../services/common/util/ts.utils.js'
import type {InputTypes} from '../../services/common/util/dom.utils.js'
import {type objectToMoParameters, transp} from '../../services/mo/moTransport.js'
// import {objectToMoid, valueToField} from '$lib/services/mo/moTransport.implementation.js'
// import type { ValueFormatterFunc } from 'ag-grid-community/dist/lib/entities/colDef.js'
// Singleton
export class FieldDefinition<T> implements FieldDefinitionInterface<T> {

  name = ''
  type = 'string'
  description?: string
  displayName?: string
  example?: string
  regex?: RegExp
  regexFlag?: string
  minLen = 0
  maxLen = 256
  key?: string // database or column name
  inputType: InputTypes = 'text'
  gridColDef?: ColDef = {}
  canBeNull = true
  canBeUndefined = true
  itemValueType?: string // for maps and arrays
  itemValueFieldDefinition?: FieldDefinitionInterface<any> // for maps and arrays

  constructor(props: Partial<FieldDefinition<any>> = {}) {
    this.init(props)
  }

  init(props) {
    for (const key of Object.keys(props)) {
      this[key] = props[key]
    }
  }

  validate() {
    if (!this.name) throw new Rezult(ErrorName.missing_field, {type: 'FieldDefinition', fieldname: 'name'})
  }

  static objectToMo = (obj: any): any => {} // registered at init time
  static from = (fieldDef0: FieldDefinition<any>, props: Partial<FieldDefinitionInterface<any>> = {}): FieldDefinition<any> => {
    const newFieldDef = new FieldDefinition()
    copyOwnProperties(fieldDef0, newFieldDef)
    copyOwnProperties(props, newFieldDef)
    return newFieldDef
  }

  clone(): FieldDefinition<any> {
    const newFieldDef = new FieldDefinition()
    copyOwnProperties(this, newFieldDef)
    return newFieldDef
  }

  chainSetName(name: string): FieldDefinition<any> {
    this.name = name
    return this
  }

  parse(s: string): any | null { this.stringToValue(s) }

  stringToValue(s: string): any | null {
    if (s === undefined && this.canBeUndefined) return s
    if (s === null && this.canBeNull) return null
    switch (this.type) {
      case 'string':
        return s
      case 'boolean':
        return s && ((['y', 'yes', 't', 'true', 'ok'].indexOf(s.toLowerCase()) !== -1) || s.match(/[\d][\d .]*/))
      case 'int':
        return Number.parseInt(s)
      case 'float':
        return Number.parseInt(s)
      case 'date':
        return new Date(s)
      case 'mo':
      case 'object':
        return JSON.parse(s)
      case 'array':
      case 'moarray': {
        if (s && s[0] !== '[') s = `[${s}]`
        if (this.itemValueFieldDefinition) {
          return this.itemValueFieldDefinition.stringToValue(s)
        } else {
          return JSON.parse(s)
        }
      }
      case 'map': {
        let obj: any
        if (this.itemValueFieldDefinition) {
          obj = this.itemValueFieldDefinition.stringToValue(s)
        } else {
          obj = JSON.parse(s)
        }
        return new Map(Object.entries(obj))
      }
      default:
        return s
    }
  }

  valueToField?(v: any, params?:hydrateFieldParameters): any | null

  // valueToField(v: any): any | null {
  //   const handleError = (message: string) => {
  //     throw new Rezult(ErrorName.field_invalid, {
  //       fieldName: this.name,
  //       fieldDefType: this.type,
  //       valueType: typeof v,
  //       value: v?.toString(),
  //       message
  //     }, 'FieldDefinition.valueToField')
  //   }
  //
  //   if (v === undefined) {
  //     if (this.canBeUndefined) {
  //       return undefined
  //     } else {
  //       handleError('undefined')
  //     }
  //   } else if (v === null) {
  //     if (this.canBeNull) {
  //       return null
  //     } else {
  //       handleError('null')
  //     }
  //   }
  //   try {
  //     switch (this.type) {
  //       case 'mo':
  //         return FieldDefinition.objectToMo(v)
  //       case 'string':
  //         return v.toString()
  //       case 'boolean':
  //         if (typeof v === 'boolean') return v
  //         if (typeof v === 'string') return v && ((['y', 'yes', 't', 'true', 'ok'].indexOf(v.toLowerCase()) !== -1) || v.match(/[\d][\d\ .]*/))
  //         handleError('not boolean')
  //       case 'int':
  //         if (typeof v === 'number') return Math.floor(v)
  //         if (typeof v === 'string') return Number.parseInt(v)
  //         handleError('not number')
  //       case 'float':
  //         if (typeof v === 'number') return Math.floor(v)
  //         if (typeof v === 'string') return Number.parseFloat(v)
  //         handleError('not number')
  //       case 'date':
  //         if (v instanceof Date) return v
  //         if (typeof v === 'string') return new Date(v)
  //         handleError('not date')
  //       case 'mo':
  //         let json: any
  //         if (typeof v == 'object') {
  //           json = v
  //         } else if (typeof v === 'string') {
  //           json = JSON.parse(v)
  //         } else {
  //           handleError('not object')
  //         }
  //         const moFieldMoname: string = this.moname || v._moname
  //         if (!moFieldMoname) {
  //           handleError('mo without moname')
  //         }
  //         return objectToMoid(json, this.moname)
  //       case 'object':
  //         if (typeof v === 'object') return v
  //         if (typeof v === 'string') {
  //           return JSON.parse(v)
  //         }
  //         handleError('not object')
  //       case 'array':
  //         let rawArray: any[] = []
  //         if (Array.isArray(v)) {
  //           rawArray = v
  //         } else if (typeof v === 'string') {
  //           if (v && v[0] !== '[') v = `[${v}]`
  //           rawArray = JSON.parse(v)
  //         } else {
  //           handleError('not array')
  //         }
  //         if (this.itemValueFieldDefinition) {
  //           return rawArray.map(item => this.itemValueFieldDefinition?.valueToField(item))
  //         } else {
  //           return rawArray
  //         }
  //       case 'moarray': {
  //         let rawArray: any[] = []
  //         if (Array.isArray(v)) {
  //           rawArray = v
  //         } else if (typeof v === 'string') {
  //           if (v && v[0] !== '[') v = `[${v}]`
  //           rawArray = JSON.parse(v)
  //         } else {
  //           handleError('not array')
  //         }
  //         return rawArray.map(item => objectToMoid(item, this.moname))
  //       }
  //       case 'map': {
  //         let newMap = new Map()
  //         let rawMap
  //         if (v instanceof Map) {
  //           rawMap = v
  //         } else if (typeof v === 'string') {
  //           rawMap = json.parse(v)
  //         }
  //         if (!(rawMap instanceof Map)) return handleError('not map')
  //           for (const key of Object.keys(v)) {
  //             const val = (this.itemValueFieldDefinition) ? this.itemValueFieldDefinition.valueToField(v[key]) : v[key]
  //             newMap.set(key, val)
  //           }
  //       }
  //       default:
  //         return v
  //     }
  //   } catch (ex: any) {
  //     handleError(ex.message)
  //   }
  // }

  gridToString(gridFields) {
    if (!gridFields) return null
    const data = gridFields.data
    // if (f === undefined && this.canBeUndefined) return null
    if (data === undefined) return null
    const v = data[this.name]
    return this.valueToString(v)
  }

  valueToString(v) {
    if (v === undefined && this.canBeUndefined) return v
    if (v === null && this.canBeNull) return 'null'
    switch (this.type) {
      case 'map':
        return Array.from(Object.entries(v)).toString()
      case 'boolean':
        return v ? 'Y' : 'N'
      case 'date':
      case 'object':
      case 'array':
        return objectToString(v)
      case 'string':
      case 'int':
      case 'float':
      default:

        return v.toString()
    }
  }

  documentToValue(o: any) {
    if (o === undefined || o === 'undefined' && this.canBeUndefined) return o
    if (o === null || o === 'null' && this.canBeNull) return null

    switch (this.type) {
      case 'mo':
        return FieldDefinition.objectToMo(o)
      case 'map':
        return new Map(Object.entries(o))
      case 'object':
      case 'array':
      case 'date':
        return structuredClone(o)
      case 'boolean':
      case 'string':
      case 'int':
      case 'float':
      default:
        return o
    }
  }

  valueToDocument(v) {
    if (v === undefined || v === 'undefined' && this.canBeUndefined) return v
    if (v === null || v === 'null' && this.canBeNull) return null
    switch (this.type) {
      case 'map':
        return Object.fromEntries(v.entries())
      case 'object':
      case 'boolean':
      case 'string':
      case 'int':
      case 'float':
      case 'date':
      case 'array':
      default:
        return v
    }
  }

  getDisplayName() {
    return this.displayName || toDisplayString(this.name)
  }

  getColumnName() {
    return this.gridColDef?.headerName || this.displayName || toDisplayString(this.name)
  }

  getDescription() {
    const ex = this.example ? `. For example: ${this.example}` : ''
    return this.description || `A valid ${this.name} ${ex} `
  }

  validateValue(val0): Rezult { return OK }

  validateString(str): Rezult {
    if (this.minLen && str.length < this.minLen) {
      return new Rezult(ErrorName.field_invalid_tooShort, {str: str, minLen: this.minLen})
    } else if (this.maxLen && str.length > this.maxLen) {
      return new Rezult(ErrorName.field_invalid_tooLong, {str: str, maxLen: this.maxLen})
    } else if (this.regex && !this.regex.test(str)) {
      return new Rezult(ErrorName.field_invalid, {str: str, regex: this.regex})
    }
    return OK
  }

  buildColDef(sortIndex: number = 0): ColDef {
    const colDef = this.gridColDef || {}
    colDef.field = colDef.field || this.name
    colDef.cellClass = colDef.cellClass || this.name
    colDef.headerName = colDef?.headerName || this.displayName || toDisplayString(this.name)
    colDef.valueFormatter = this.gridToString.bind(this)
    colDef.sortIndex = sortIndex
    return colDef
  }


  // setProps = (props: any): MoInterface => {
  //   for (const key of Object.getOwnPropertyNames(props)) {
  //     if (key != 'fieldDefs') {
  //       this[key] = props[key]
  //     }
  //   }
  //   return this
  // }
  //
  // toObj = () => {
  //   const data: any = {}
  //   if (this.id) data.id = this.id
  //   for (const fname of Array.from(this.moDef.fieldDefs.keys())) {
  //     const value = this[fname]
  //     if (value !== undefined && value !== null) {
  //       data[fname] = this[fname].toString()
  //     }
  //   }
  //   return data
  // }
  //
  // hydrate(partial: Partial<MoInterface>) {
  //   Object.assign(this, partial)
  // }
}
// const objectToMoid = (obj: any, moname: string): any => {}
// // export const fieldDefinitionMoField = new MoDefinition('FieldDefinition')
export const from = FieldDefinition.from

export interface hydrateFieldParameters {
  trusted?: boolean
}