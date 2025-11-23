import type {FieldDefinitionInterface} from './FieldDefinition.interface.js'
import {ErrorName} from  '../../services/common/message/errorName.js'
import {OK, Rezult} from  '../../services/common/message/rezult.js'
import { objectReplacer, objectToString, toDisplayString } from '../../services/common/util/string.utils.js'
import type {ColDef} from 'ag-grid-community'
import {copyOwnProperties} from  '../../services/common/util/ts.utils.js'
import type {InputTypes} from  '../../services/common/util/dom.utils.js'
// import type { ValueFormatterFunc } from 'ag-grid-community/dist/lib/entities/colDef.js'
// Singleton
export class FieldDefinition<T> implements FieldDefinitionInterface<T> {

  name = ''
  type = 'string'
  description?: string
  displayName?: string
  moname?: string
  example?: string
  regex?: RegExp
  regexFlag?: string
  minLen= 0
  maxLen= 256
  key?: string // database or column name
  inputType: InputTypes = 'text'
  gridColDef?: ColDef = {}
  canBeNull = true
  canBeUndefined = true
  mapValueType?: string // for maps

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

  /// delete
  // clone1 = () => {
  //   const propnames = Object.getOwnPropertyNames(this).filter(pn => typeof (this[pn]) != 'function')
  //   // const propnames = Object.keys(this).filter(pn => typeof(this[pn]) != 'function')
  //   const props = propnames.reduce((ps, f) => {
  //     ps[f] = this[f]
  //     return ps
  //   }, {})
  //   const copy = new FieldDefinition(props)
  //   // bindFunctions(copy, props)
  //   const funcnames = Object.getOwnPropertyNames(this).filter(pn => typeof (this[pn]) == 'function')
  //   for (const funcname of funcnames) {
  //     copy[funcname] = this[funcname]
  //     copy[funcname].bind(copy)
  //   }
  //   copy.parse = this.parse
  //   return copy
  // }
  chainSetName(name: string): FieldDefinition<any> {
    this.name = name
    return this
  }

  parse(v: any): any | null {
    if (v === undefined && this.canBeUndefined) return v
    if (v === null && this.canBeNull) return null
    switch (this.type) {
      case 'string':
        return v
      case 'boolean':
        return v && ((['y', 'yes', 't', 'true', 'ok'].indexOf(v.toLowerCase()) !== -1) || v.match(/[\d][\d\ .]*/))
      case 'int':
        return Number.parseInt(v)
      case 'float':
        return Number.parseInt(v)
      case 'date':
        return new Date(v)
      case 'object':
        return JSON.parse(v)
      case 'array': {
        if (v && v[0] !== '[') v = `[${v}]`
        return JSON.parse(v)
      }
      case 'map': {
        const obj = JSON.parse(v)
        return new Map(Object.entries(obj))
      }
      default:
        return v
    }
  }

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

// export const fieldDefinitionMoField = new MoDefinition('FieldDefinition')
export const from = FieldDefinition.from

