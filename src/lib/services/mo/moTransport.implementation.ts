import {Moid} from '../../models/managedObjects/Moid.js'
import {getMoMeta} from '../mo/moManagement.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import {FieldDefinition} from '../../models/fields/FieldDefinition.js'
import {ErrorName} from '../common/message/errorName.js'
import {Rezult} from '../common/message/rezult.js'
import type {FieldDefinitionInterface} from '../../models/fields/FieldDefinition.interface.js'
import {transp} from './moTransport.js'

export const moidToObj = (mo: MoidInterface) => {
  const obj: any = {}
  obj._moname = mo.moMeta.name
  obj.id = mo.id
  obj.displayName = mo.displayName
  obj._moid = true
  return obj
}

export const moToObject = (mo: MoInterface) => {
  const obj: any = {}
  obj._moname = mo.moMeta.name
  obj.id = mo.id
  obj.displayName = mo.displayName
  for (const fname of Array.from(mo.moMeta.moDef.fieldDefs.keys())) {
    //const fieldDef = this.moMeta.moDef.fieldDefs.get(fname)
    const value = mo[fname]
    obj[fname] = valueToObject(value)
  }
  return obj
}

export const valueToObject = (value) => {
  if (value !== undefined && value !== null) {
    if (value.moMeta && value.id) {
      return moidToObj(value)
    } else if (value instanceof Array) {
      return value.map(v => valueToObject(v))
    } else if (value instanceof Object) {
      const obj = {}
      for (let [k, v] of Object.entries(value)) {
        obj[k] = valueToObject(v)
        return obj
      }
    } else {
      return value
    }
  }
}

export const objectToMo = (obj: any, _moname?: string): MoInterface => {
  if (obj._moid) throw new Rezult(ErrorName.field_unsupported)
  return objectToMoid(obj, _moname) as MoInterface
}

export const objectToMoid = (obj: any, _moname?: string): MoidInterface => {
  const moname = _moname || obj._moname
  if (!moname) {
    throw new Rezult(ErrorName.missing_field, {fieldname: '_moname', method: 'objectToMoid'})
  }
  const moMeta = getMoMeta(moname)
  if (!moMeta) {
    throw new Rezult(ErrorName.moMeta_notFound, {moname: obj._moname, method: 'objectToMoid'})
  }

  if (obj._moname) delete obj._moname
  if (obj._moid) {
    return new Moid(moMeta, obj.id, obj.displayName)
  } else {
    const moDef = moMeta.moDef
    const mo = moDef.newMo()
    mo.id = obj.id
    mo.displayName = obj.displayName
    for (let [fname, fDef] of Array.from(moDef.fieldDefs.entries())) {
      const value = obj[fname]
      if (value instanceof Object) {
        if (fDef.type === 'mo') {
          const moFieldMoname: string = value._moname || fDef.name
          if (!moFieldMoname) {
            console.log(`==>Mo.ts:objectToMoid: missing moname for mo field`, `${moMeta.name}.${fDef.name}`)
            continue
          }
          const moFieldMoMeta = getMoMeta(moFieldMoname)
          if (!moFieldMoMeta) {
            console.log(`==>Mo.ts:objectToMoid: missing moMeta for mo field`, `${moMeta.name}.${fDef.name}`)
            continue
          }
          value._moname = moFieldMoname
          mo[fname] = objectToMoid(value)
        } else if (Array.isArray(value)) {
          if (fDef.type == 'moArray') {
            mo[fname] = value.map(v => objectToMoid(v, fDef.moname))
          } else {
            if (fDef.itemValueFieldDef) {
              mo[fname] = value.map(v => fDef.itemValueFieldDef?.valueToField(v))
            }
          }
        } else {
          mo[fname] = fDef.documentToValue(value)
        }
      } else {
        mo[fname] = fDef.documentToValue(value)
      }
    }
    return mo
  }
}

export const valueToField = (fDef: FieldDefinitionInterface<any>, v: any): any | null => {
  const handleError = (message: string) => {
    throw new Rezult(ErrorName.field_invalid, {
      fieldName: fDef.name,
      fieldDefType: fDef.type,
      valueType: typeof v,
      value: v?.toString(),
      message
    }, 'FieldDefinition.valueToField')
  }

  if (v === undefined) {
    if (fDef.canBeUndefined) {
      return undefined
    } else {
      handleError('undefined')
    }
  } else if (v === null) {
    if (fDef.canBeNull) {
      return null
    } else {
      handleError('null')
    }
  }
  try {
    switch (fDef.type) {
      case 'string':
        return v.toString()
      case 'boolean':
        if (typeof v === 'boolean') return v
        if (typeof v === 'string') return v && ((['y', 'yes', 't', 'true', 'ok'].indexOf(v.toLowerCase()) !== -1) || v.match(/[\d][\d\ .]*/))
        handleError('not boolean')
      case 'int':
        if (typeof v === 'number') return Math.floor(v)
        if (typeof v === 'string') return Number.parseInt(v)
        handleError('not number')
      case 'float':
        if (typeof v === 'number') return Math.floor(v)
        if (typeof v === 'string') return Number.parseFloat(v)
        handleError('not number')
      case 'date':
        if (v instanceof Date) return v
        if (typeof v === 'string') return new Date(v)
        handleError('not date')
      case 'mo':
        let json: any
        if (typeof v == 'object') {
          json = v
        } else if (typeof v === 'string') {
          json = JSON.parse(v)
        } else {
          handleError('not object')
        }
        const moFieldMoname: string = fDef.moname || v._moname
        if (!moFieldMoname) {
          handleError('mo without moname')
        }
        return objectToMoid(json, fDef.moname)
      case 'object':
        if (typeof v === 'object') return v
        if (typeof v === 'string') {
          return JSON.parse(v)
        }
        handleError('not object')
      case 'array':
        let rawArray: any[] = []
        if (Array.isArray(v)) {
          rawArray = v
        } else if (typeof v === 'string') {
          if (v && v[0] !== '[') v = `[${v}]`
          rawArray = JSON.parse(v)
        } else {
          handleError('not array')
        }
        if (fDef.itemValueFieldDef) {
          return rawArray.map(item => fDef.itemValueFieldDef?.valueToField(item))
        } else {
          return rawArray
        }
      case 'moarray': {
        let rawArray: any[] = []
        if (Array.isArray(v)) {
          rawArray = v
        } else if (typeof v === 'string') {
          if (v && v[0] !== '[') v = `[${v}]`
          rawArray = JSON.parse(v)
        } else {
          handleError('not array')
        }
        return rawArray.map(item => objectToMoid(item, fDef.moname))
      }
      case 'map': {
        let newMap = new Map()
        let rawMap
        if (v instanceof Map) {
          rawMap = v
        } else if (typeof v === 'string') {
          rawMap = json.parse(v)
        }
        if (!(rawMap instanceof Map)) return handleError('not map')
        for (const key of Object.keys(v)) {
          const val = (fDef.itemValueFieldDef) ? fDef.itemValueFieldDef.valueToField(v[key]) : v[key]
          newMap.set(key, val)
        }
      }
      default:
        return v
    }
  } catch (ex: any) {
    handleError(ex.message)
  }
}

export const initMoTransport = () => {
  transp.moidToObj = moidToObj
  transp.moToObject = moToObject
  transp.valueToObject = valueToObject
  transp.objectToMo = objectToMo
  transp.objectToMoid = objectToMoid
  transp.valueToField = valueToField
}