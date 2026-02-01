import {Moid} from '../../models/managedObjects/Moid.js'
import {getMoMeta} from './moManagement.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import {ErrorName} from '../common/message/errorName.js'
import {Rezult} from '../common/message/rezult.js'
import type {FieldDefinitionInterface} from '../../models/fields/FieldDefinition.interface.js'
import {type objectToMoParameters, transp} from './moTransport.js'
import type {MoFieldDefinition} from '../../models/fields/MoFieldDefinition.js'
import {isSubclass} from '../common/util/ts.utils.js'
import {browser} from '$app/environment'
import type {MoMetaInterface} from '../../models/managedObjects/MoMetaInterface.js'

export const moidToObj = (mo: MoidInterface) => {
    const obj: any = {}
    obj._moname = mo._moMeta.name
    obj.id = mo.id
    obj.displayName = mo.displayName
    obj._moid = true
    return obj
}

export const moToObject = (mo: MoInterface) => {
    const obj: any = {}
    obj._moname = mo._moMeta.name
    obj.id = mo.id
    obj.displayName = mo.displayName
    for (const fname of Array.from(mo._moMeta.moDef.fieldDefs.keys())) {
        //const fieldDef = this._moMeta.moDef.fieldDefs.get(fname)
        const value = mo[fname]
        obj[fname] = valueToObject(value)
    }
    return obj
}

export const valueToObject = (value: any): any => {
    if (value !== undefined && value !== null) {
        if (value._moMeta && value.id) {
            return moidToObj(value)
        } else if (value instanceof Array) {
            return value.map(v => valueToObject(v))
        } else if (value instanceof Object) {
            const obj = {}
            for (let [k, v] of Object.entries(value)) {
                obj[k] = valueToObject(v)
            }
            return obj
        } else {
            return value
        }
    }
}

export const objectToMo = async (obj: any, params?: objectToMoParameters): Promise<MoInterface> => {
    if (obj._moid) throw new Rezult(ErrorName.field_unsupported)
    return await objectToMoid(obj, params) as MoInterface
}

// delete
// export const objectToMoid0 = (obj: any, params?: objectToMoParameters): MoidInterface => {
//     const moname = params?._moname || params?.mo?._moMeta.name || obj._moname
//     if (params?._moname && params?.mo && params?._moname !== params.mo._moMeta.name) throw new Rezult(ErrorName.mo_mismatch)
//     if (!moname) {
//         throw new Rezult(ErrorName.missing_field, {fieldname: '_moname', method: 'objectToMoid'})
//     }
//     const moMeta = params?.mo?._moMeta || getMoMeta(moname)
//     if (!moMeta) {
//         throw new Rezult(ErrorName.moMeta_notFound, {moname: obj._moname, method: 'objectToMoid'})
//     }
//
//     if (obj._moname) delete obj._moname
//     const id = params?.mo?.id || obj.id
//     if (obj.id && params?.mo?.id && obj.id !== params?.mo?.id) throw new Rezult(ErrorName.id_mismatch)
//     if (obj._moid) {
//         return new Moid(moMeta, id, obj.displayName)
//     } else {
//         const moDef = moMeta.moDef
//         const mo = params?.mo || moDef.newMo()
//         mo.id = id
//         mo.displayName = obj.displayName
//         for (let [fname, fDef] of Array.from(moDef.fieldDefs.entries())) {
//             const value = obj[fname]
//             if (value instanceof Object) {
//                 if (fDef.type === 'mo') {
//                     const moFieldMoname: string = value._moname || fDef.name
//                     if (!moFieldMoname) {
//                         console.log(`==>Mo.ts:objectToMoid: missing moname for mo field`, `${moMeta.name}.${fDef.name}`)
//                         continue
//                     }
//                     value._moname = moFieldMoname
//                     mo[fname] = objectToMoid(value)
//                 } else if (Array.isArray(value)) {
//                     if (fDef.type == 'moArray') {
//                         mo[fname] = value.map(v => objectToMoid(v, {_moname: fDef.moname}))
//                     } else {
//                         if (fDef.itemValueFieldDef) {
//                             mo[fname] = value.map(v => fDef.itemValueFieldDef?.valueToField(v))
//                         }
//                     }
//                 } else {
//                     mo[fname] = fDef.documentToValue(value)
//                 }
//             } else {
//                 mo[fname] = fDef.documentToValue(value)
//             }
//         }
//         return mo
//     }
// }

// export const objectOrStringToMoid = (obj: any, params: objectToMoParameters): MoidInterface => {
//     if (typeof obj === 'string') obj = JSON.parse(obj)
//     const moname = params?._moname || params?.mo?._moMeta.name || obj._moname
//     if (!moname) {
//         throw new Rezult(ErrorName.missing_field, {fieldname: '_moname', method: 'objectToMoid'})
//     }
//     const moMeta = params?.mo?._moMeta || getMoMeta(moname)
//     if (!moMeta) {
//         throw new Rezult(ErrorName.moMeta_notFound, {moname: obj._moname, method: 'objectToMoid'})
//     }
//
//     if (obj._moname) delete obj._moname
//     const id = params?.mo?.id || obj.id
//     if (obj.id && params?.mo?.id && obj.id !== params?.mo?.id) throw new Rezult(ErrorName.id_mismatch)
//
//     if (obj._moid) {
//         return new Moid(moMeta, obj.id, obj.displayName)
//     } else {
//         const moDef = moMeta.moDef
//         const mo = params?.mo || moDef.newMo()
//         mo.id = id
//         mo.displayName = obj.displayName
//         for (let [fname, fDef] of Array.from(moDef.fieldDefs.entries())) {
//             const value = obj[fname]
//             mo[fname] = fDef.valueToField(value)
//         }
//         return mo
//     }
// }

export const idToMoid = async (id: string, moname: string): Promise<MoidInterface> => {
    if (!moname) {
        throw new Rezult(ErrorName.missing_field, {fieldname: '_moname', method: 'idToMoid'})
    }
    if (!id) {
        throw new Rezult(ErrorName.missing_id, {fieldname: '_moname', method: 'idToMoid'})
    }
    const moMeta = getMoMeta(moname)
    if (!moMeta) {
        throw new Rezult(ErrorName.moMeta_notFound, {moname, method: 'idToMoid'})
    }
    const moid = await moMeta.dataSource.getMoid(id)
    // console.log(`==>moTransport.implementation.ts:151 moid`, moid.toShortStr())
    return moid
}

export const objectToMoid = async (obj: any, params?: objectToMoParameters): Promise<MoidInterface> => {
    const moname = params?._moname || params?.mo?._moMeta.name || obj._moname
    if (params?._moname && params?.mo && params?._moname !== params.mo._moMeta.name) throw new Rezult(ErrorName.mo_mismatch)
    if (!moname) {
        throw new Rezult(ErrorName.missing_field, {fieldname: '_moname', method: 'objectToMoid'})
    }
    const moMeta = params?.mo?._moMeta || getMoMeta(moname)
    if (!moMeta) {
        throw new Rezult(ErrorName.moMeta_notFound, {moname: obj._moname, method: 'objectToMoid'})
    }

    if (obj._moname) delete obj._moname
    const id = params?.mo?.id || obj.id
    if (obj.id && params?.mo?.id && obj.id !== params?.mo?.id) throw new Rezult(ErrorName.id_mismatch)
    if (obj._moid || params?._moid) {
        return new Moid(moMeta, id, obj.displayName)
    } else {
        const moDef = moMeta.moDef
        const mo = params?.mo || moDef.newMo()
        mo.id = id
        mo.displayName = obj.displayName
        const fieldDefs = Array.from(moDef.fieldDefs.values()).filter(fd => fd.name !== 'id')
        for (let fDef of fieldDefs) {
            const fname = fDef.name
            if (!params?.mo || Object.hasOwn(obj, fname)) {
                const value = obj[fname]
                mo[fname] = fDef.valueToField ? fDef.valueToField(value, {trusted: params?.trusted}) : await valueToField(moMeta, fDef, value, params)
            }
        }
        // if (mo.supplement) console.log(`==>moTransport.implementation.ts:186  mo`, mo.toShortStr())
        return mo
    }
}

export const valueToField = async (moMeta: MoMetaInterface, fDef: FieldDefinitionInterface<any>, v: any, params?: objectToMoParameters): Promise<any> => {
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
                if (typeof v !== 'boolean') return handleError('not boolean')
                return v
            case 'int':
                if (typeof v !== 'number') return handleError('not number')
                if (!Number.isInteger(v)) return handleError('not integer')
                return v
            case 'float':
                if (typeof v !== 'number') return handleError('not number')
                return v
            case 'date':
                if (v ! instanceof Date) return handleError('not date')
                return v
            case 'mo':
                const mofDef = fDef as MoFieldDefinition
                const relationMeta = moMeta.relations[fDef.name]
                const relationDef = relationMeta?.relationDef
                if (!relationDef) return handleError('no relationDef')
                let moMeta2 = relationMeta.moMeta2
                if (typeof v !== 'object') {
                    if (typeof v === 'string') {  // for edit or creation
                        if (browser) {
                            return v
                        } else {
                            return await idToMoid(v, relationMeta.moMeta2.name)
                        }
                    } else {
                        return handleError('not object, not string')
                    }
                }
                if (v._moname) {
                    // const moFieldMoMeta = getMoMeta(v._moname)
                    // const moFieldMoDef = moMeta.moDef
                    if (!isMoSubclass(v._moname, relationMeta.moMeta2.name))
                        return handleError('not subclass')
                }
                // const moFieldMoname = v._moname || moMeta2.name // in case of subclasses
                return await objectToMoid(v, {_moname: moMeta2.name, _moid: true})
            case 'object':
                if (typeof v !== 'object') return handleError('not object')
                return v
            case 'array':
                if (!Array.isArray(v)) return handleError('not array')
                if (fDef.itemValueFieldDef) {
                    return v.map(async (item) => {
                        if (fDef.itemValueFieldDef?.valueToField) {
                            return fDef.itemValueFieldDef.valueToField(item, {trusted: params?.trusted})
                        } else {
                            return await valueToField(moMeta, fDef, item, params)
                        }
                    })
                } else {
                    return v
                }
            case 'moArray': {
                if (!Array.isArray(v)) return handleError('not array')
                const relationMeta = moMeta.relations[fDef.name]
                return Promise.all(v.map(async (item) => await objectToMoid(item, {_moname: relationMeta.moMeta2.name})))
            }
            case 'map': {
                if (typeof v === 'object') {
                    if (fDef.itemValueFieldDef) {
                        const newMap = new Map()
                        for (let [k, itemVal] of Object.entries(v)) {
                            const fieldValue = await valueToField(moMeta, fDef.itemValueFieldDef, itemVal, params)
                            newMap.set(k, fieldValue)
                        }
                        return newMap
                    } else {
                        return new Map(Object.entries(v))
                    }
                }
            }
                break
            default:
                return v
        }
    } catch (ex: any) {
        console.error(ex)
        handleError(ex.message)
    }
}

export const isMoSubclass = (childMoname: string, parentMoname: string): boolean => {
    if (childMoname === parentMoname) return true
    const parentClass = getMoMeta(parentMoname).moDef.moClass
    const childClass = getMoMeta(childMoname).moDef.moClass
    return isSubclass(parentClass, childClass)
}
// export const valueOrStringToField = (fDef: FieldDefinitionInterface<any>, v: any): any | null => {
//     const handleError = (message: string) => {
//         throw new Rezult(ErrorName.field_invalid, {
//             fieldName: fDef.name,
//             fieldDefType: fDef.type,
//             valueType: typeof v,
//             value: v?.toString(),
//             message
//         }, 'FieldDefinition.valueToField')
//     }
//
//     if (v === undefined) {
//         if (fDef.canBeUndefined) {
//             return undefined
//         } else {
//             handleError('undefined')
//         }
//     } else if (v === null) {
//         if (fDef.canBeNull) {
//             return null
//         } else {
//             handleError('null')
//         }
//     }
//     try {
//         switch (fDef.type) {
//             case 'string':
//                 return v.toString()
//             case 'boolean':
//                 if (typeof v === 'boolean') return v
//                 if (typeof v === 'string') return v && ((['y', 'yes', 't', 'true', 'ok'].indexOf(v.toLowerCase()) !== -1) || v.match(/[\d][\d\ .]*/))
//                 handleError('not boolean')
//             case 'int':
//                 if (typeof v === 'number') return Math.floor(v)
//                 if (typeof v === 'string') return Number.parseInt(v)
//                 handleError('not number')
//             case 'float':
//                 if (typeof v === 'number') return Math.floor(v)
//                 if (typeof v === 'string') return Number.parseFloat(v)
//                 handleError('not number')
//             case 'date':
//                 if (v instanceof Date) return v
//                 if (typeof v === 'string') return new Date(v)
//                 handleError('not date')
//             case 'mo':
//                 let jsonValue: any
//                 if (typeof v == 'object') {
//                     jsonValue = v
//                 } else if (typeof v === 'string') {
//                     jsonValue = JSON.parse(v)
//                 } else {
//                     handleError('not object')
//                 }
//                 const moFieldMoname: string = fDef.moname || v._moname
//                 if (!moFieldMoname) {
//                     handleError('mo without moname')
//                 }
//                 return objectToMoid(jsonValue, {_moname: fDef.moname})
//             case 'object':
//                 if (typeof v === 'object') return v
//                 if (typeof v === 'string') {
//                     return JSON.parse(v)
//                 }
//                 handleError('not object')
//             case 'array':
//                 let rawArray: any[] = []
//                 if (Array.isArray(v)) {
//                     rawArray = v
//                 } else if (typeof v === 'string') {
//                     if (v && v[0] !== '[') v = `[${v}]`
//                     if (fDef.itemValueFieldDef) {
//                         rawArray = v.map(vv => valueToField(fDef.itemValueFieldDef!, vv))  // remove the !
//                     } else {
//                         rawArray = JSON.parse(v)
//                     }
//                 } else {
//                     handleError('not array')
//                 }
//                 if (fDef.itemValueFieldDef) {
//                     return rawArray.map(item => fDef.itemValueFieldDef?.valueToField(item))
//                 } else {
//                     return rawArray
//                 }
//             case 'moArray': {
//                 let rawArray: any[] = []
//                 if (Array.isArray(v)) {
//                     rawArray = v
//                 } else if (typeof v === 'string') {
//                     if (v && v[0] !== '[') v = `[${v}]`
//                     rawArray = JSON.parse(v)
//                 } else {
//                     handleError('not array')
//                 }
//                 return rawArray.map(item => objectToMoid(item, {_moname: fDef.moname}))
//             }
//             case 'map': {
//                 let newMap = new Map()
//                 let rawMap
//                 if (v instanceof Map) {
//                     rawMap = v
//                 } else if (typeof v === 'string') {
//                     rawMap = json.parse(v)
//                 }
//                 if (!(rawMap instanceof Map)) return handleError('not map')
//                 for (const key of Object.keys(v)) {
//                     const val = (fDef.itemValueFieldDef) ? fDef.itemValueFieldDef.valueToField(v[key]) : v[key]
//                     newMap.set(key, val)
//                 }
//             }
//             default:
//                 return v
//         }
//     } catch (ex: any) {
//         handleError(ex.message)
//     }
// }
export const objectToMoidSync = (obj: any, params?: objectToMoParameters): MoidInterface => {
    const moname = params?._moname || params?.mo?._moMeta.name || obj._moname
    if (params?._moname && params?.mo && params?._moname !== params.mo._moMeta.name) throw new Rezult(ErrorName.mo_mismatch)
    if (!moname) {
        throw new Rezult(ErrorName.missing_field, {fieldname: '_moname', method: 'objectToMoid'})
    }
    const moMeta = params?.mo?._moMeta || getMoMeta(moname)
    if (!moMeta) {
        throw new Rezult(ErrorName.moMeta_notFound, {moname: obj._moname, method: 'objectToMoid'})
    }

    if (obj._moname) delete obj._moname
    const id = params?.mo?.id || obj.id
    if (obj.id && params?.mo?.id && obj.id !== params?.mo?.id) throw new Rezult(ErrorName.id_mismatch)
    if (obj._moid) {
        return new Moid(moMeta, id, obj.displayName)
    } else {
        const moDef = moMeta.moDef
        const mo = params?.mo || moDef.newMo()
        mo.id = id
        mo.displayName = obj.displayName
        const fieldDefs = Array.from(moDef.fieldDefs.values()).filter(fd => fd.name !== 'id')
        for (let fDef of fieldDefs) {
            const fname = fDef.name
            if (!params?.mo || Object.hasOwn(obj, fname)) {
                const value = obj[fname]
                mo[fname] = fDef.valueToField ? fDef.valueToField(value, {trusted: params?.trusted}) : valueToFieldSync(moMeta, fDef, value, params)
            }
        }
        return mo
    }
}

export const valueToFieldSync = (moMeta: MoMetaInterface, fDef: FieldDefinitionInterface<any>, v: any, params?: objectToMoParameters): any => {
    const handleError = (message: string) => {
        throw new Rezult(ErrorName.field_invalid, {
            method: 'moTransport.valueToFieldSync',
            mo: moMeta?.name,
            fieldName: fDef.name,
            fieldDefType: fDef.type,
            valueType: typeof v,
            value: v?.toString(),
            message
        }, 'FieldDefinition.valueToFieldSync')
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
                if (typeof v !== 'boolean') return handleError('not boolean')
                return v
            case 'int':
                if (typeof v !== 'number') return handleError('not number')
                if (!Number.isInteger(v)) return handleError('not integer')
                return v
            case 'float':
                if (typeof v !== 'number') return handleError('not number')
                return v
            case 'date':
                if (v ! instanceof Date) return handleError('not date')
                return v
            case 'mo':
                const mofDef = fDef as MoFieldDefinition
                const relationMeta = moMeta.relations[fDef.name]
                const moMeta2 = relationMeta.moMeta2
                if (!relationMeta) return handleError('no relationMeta')
                const relationDef = relationMeta?.relationDef
                if (!relationDef) return handleError('no relationDef')
                if (typeof v !== 'object') {
                    return handleError('not object, not string')
                }
                if (v._moname) {
                    if (!isMoSubclass(v._moname, relationMeta.moMeta2.name))
                        return handleError('not subclass')
                }
                // const moMeta2Name = v._moname || moMeta2.name // in case the moMeta2 can have subclasses
                return objectToMoidSync(v, {_moname: moMeta2.name})
            case 'object':
                if (typeof v !== 'object') return handleError('not object')
                return v
            case 'array':
                if (!Array.isArray(v)) v = [v] //return handleError('not array')
                if (fDef.itemValueFieldDef) {
                    return v.map(item => {
                        if (fDef.itemValueFieldDef?.valueToField) {
                            return fDef.itemValueFieldDef.valueToField(item, {trusted: params?.trusted})
                        } else {
                            return valueToFieldSync(moMeta, fDef, item, params)
                        }
                    })
                } else {
                    return v
                }
            case 'moArray': {
                if (!Array.isArray(v)) v = [v] // return handleError('not array')
                const mofDef = fDef // as MoFieldDefinition
                return v.map((item) => objectToMoidSync(item, {_moname: mofDef['moName']}))
            }
            case 'map': {
                if (typeof v === 'object') {
                    if (fDef.itemValueFieldDef) {
                        const newMap = new Map()
                        for (let [k, itemVal] of Object.entries(v)) {
                            const fieldValue = valueToFieldSync(moMeta, fDef.itemValueFieldDef, itemVal, params)
                            newMap.set(k, fieldValue)
                        }
                        return newMap
                    } else {
                        return new Map(Object.entries(v))
                    }
                }
            }
                break
            default:
                return v
        }
    } catch (ex: any) {
        console.error(ex)
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
    transp.objectToMoidSync = objectToMoidSync
    transp.valueToFieldSync = valueToFieldSync
}
