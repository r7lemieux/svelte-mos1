import {Moid} from '../../../models/managedObjects/Moid.js'
// import {Mo} from '../../../models/managedObjects/Mo.js'
import {getMoDef, getMoMeta} from '../../mo/moManagement.js'
import type {MoidInterface} from '../../../models/managedObjects/MoidInterface.js'
import type {MoInterface} from '../../../models/managedObjects/MoInterface.js'
import {FieldDefinition} from '../../../models/fields/FieldDefinition.js'
import {ErrorName} from '../message/errorName.js'
import {Rezult} from '../message/rezult.js'

export const moidToObj = (mo: Moid) => {
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

export const objectToMo = (obj: any): MoInterface => {
  if (obj._moid) throw new Rezult(ErrorName.field_unsupported)
  return objectToMoid(obj) as MoInterface
}

export const objectToMoid = (obj: any): MoidInterface => {
  if (!obj._moname) {
    throw new Rezult(ErrorName.missing_field, {fieldname: '_moname', method: 'objectToMoid'})
  }
  const moMeta = getMoMeta(obj._moname)
  delete obj._moname
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
        if (value._moname) {
          mo[fname] = objectToMoid(value)
          // FieldDef for an mo
        } else if (fDef.name === 'mo' || fDef.moname) {
          if (!value._moname) value._moname = fDef.name
          mo[fname] = objectToMoid(value)
        } else if (Array.isArray(value)) {
          mo[fname] = value.map(v => objectToMoid(v))
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

FieldDefinition.objectToMo = objectToMo

