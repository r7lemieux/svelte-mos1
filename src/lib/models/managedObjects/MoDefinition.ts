// import { Mo } from './Mo.js'
// import { MoInterface } from './MoInterface.js'
import {FieldDefinition, from} from '../fields/FieldDefinition.js'
import {BaseFieldDefs, buildFieldDef, CommonFieldDefs} from '../fields/CommonFieldDefinition.js'
import {getClosestFieldName} from '../../services/common/util/fieldMatcher.js'
import {toDisplayString} from '../../services/common/util/string.utils.js'
import {ErrorName} from '../../services/common/message/errorName.js'
import {Rezult} from '../../services/common/message/rezult.js'
import {
    DeletePermission,
    type DeletePermissionEnum,
    type MoDefinitionInterface,
} from './MoDefinitionInterface.js'
import {type moFieldParameters} from '../fields/MoFieldDefinition.js'
import type {MoInterface} from './MoInterface.js'
import {objectToMo, objectToMoid} from '../../services/mo/moTransport.implementation.js'
import type {MoFieldDefinition} from '../fields/MoFieldDefinition.js'
import {type objectToMoParameters} from '../../services/mo/moTransport.js'
import type {MoidInterface} from '$lib/models/managedObjects/MoidInterface.js'
import type {FieldDefinitionInterface} from '../fields/FieldDefinition.interface.js'
import {pluralize, singularize} from "inflection";
import type {Difference} from "$lib/services/common/util/mo.utils.js";
import type {RelationDefinition} from './RelationDefinition.js'
// import { defaultMoMeta } from './moMetaInstances.js'
// import type { MoMetaInterface } from './MoMetaInterface.js'
// import { defaultMoMeta } from './MoMeta.js'

export class MoDefinition implements MoDefinitionInterface {
    id: string
    name: string
    dbName: string
    displayName?: string
    pluralName?: string
    singularName?: string
    keyFieldnames: string[][] = []
    fieldDefs = new Map<string, FieldDefinition<any>>()
    gridFieldnames?: string[]
    showFieldnames: string[] = []
    moClass: MoInterface
    hasId = false
    idType: 'number' | 'string' = 'number'
    gdriveFilePath?: string
    gdriveFileId?: string | null
    canCreate = true
    deletePermission: DeletePermissionEnum = DeletePermission.ask
    relations: {[fieldname:string]: RelationDefinition} = {}

    constructor(name: string, moClass?: MoInterface) {
        if (name && !name.match(/[A-Za-z0-9]/)) throw new Rezult(ErrorName.field_invalid, {
            method: 'MoDefinition.extractFieldnamesFromMo',
            name: name
        })
        const pluralName = pluralize(name)
        this.singularName = singularize(name)
        this.name = this.dbName = this.id = pluralName
        this.displayName = toDisplayString(pluralName)
        this.moClass = moClass || {} as MoInterface
        this.showFieldnames = []
        // if (this.name !== 'moDef') this.moMeta = moDefMeta
        this.init()
    }

    /* ------------
     * Construction
     * ------------
     */
    init() {
    }

    static fromProps = (props: any): MoDefinition => {
        // if (!props.name || ! props.moClass) throw new Rezult(ErrorName.missing_param, {class: 'static DefMo', method: 'fromProps', props })
        const moDef = new MoDefinition(props.name, props.moClass)
        Object.assign(moDef, props)
        if (!moDef.id) moDef.id = moDef.name
        if (!props.fieldDefs) {
            if (props.fieldNames) {
                moDef.addFieldDefsFromNames(props.fieldnames)
            } else if (props.moClass) {
                moDef.createFieldDefs()
            }
        }
        return moDef
    }
    // del
    // static MoDefFieldDefs = [
    //   FieldDefinition.from(CommonFieldDefs.name),
    //   FieldDefinition.from(BaseFieldDefs.Array, {name: 'keyFieldNames'}),
    //   FieldDefinition.from(BaseFieldDefs.Object, {name: 'fieldDefs'}),
    // ]moFieldParameters

    /*  ---------
     *  Accessors
     *  ---------
     */
    getDisplayName = () => this.displayName || toDisplayString(this.name)
    getDbName = () => this.dbName || this.name
    getFieldNames = () => Array.from(this.fieldDefs.keys())
    // getMoClass = () => this.moClass || typeof Mo
    getMoClass = () => this.moClass

    /* -----------------
     * Field Definitions
     * -----------------
     */
    createFieldDefs() {
        this.deriveFieldDefsFromMo()
          .forEach(fd => this.initFieldDef(fd))
    }

    initFieldDef(fd: FieldDefinition<any>) {
        if (!this.fieldDefs.has(fd.name)) {
            this.fieldDefs.set(fd.name, fd)
        }
        if (fd.name != 'id') {
            this.showFieldnames.push(fd.name)
        }
    }

    addFieldDef = (fieldDef: FieldDefinition<any>) => {
        this.fieldDefs.set(fieldDef.name, fieldDef)
        return this
    }


    addMoFieldDefFromName(name: string, params?: moFieldParameters): MoFieldDefinition {
        const moFieldDef = CommonFieldDefs.mo.clone() as MoFieldDefinition
        moFieldDef.type = 'mo'
        moFieldDef.name = name
        // moFieldDef.twoWays = !!params?.twoWays
        // moFieldDef.reverseFieldName = params?.reverseFieldName || this.name
        // moFieldDef.moName = params?.moname || name
        this.fieldDefs.set(name, moFieldDef)
        return moFieldDef
    }

    addMoArrayFieldDefFromName(name: string, params?: moFieldParameters): MoFieldDefinition {
        const moFieldDef = this.addMoFieldDefFromName(name, params)
        moFieldDef.type = 'moArray'
        return moFieldDef
    }

    addFieldDefsFromNames = (fieldnames: string[]) => {
        this.deriveFieldDefsFromFieldnames(fieldnames)
          .forEach(fd => this.fieldDefs.set(fd.name, fd))
    }

    deriveFieldDefsFromMo() {
        const fieldnames = this.extractFieldnamesFromMo()
        return this.deriveFieldDefsFromFieldnames(fieldnames)
    }

    deriveFieldDefsFromFieldnames = (fieldnames: string[]) => {
        return fieldnames
          .filter(fn => !fn.startsWith('_'))
          .map(getClosestFieldName)
          .map(buildFieldDef)
          .map((fd, i) => fd.chainSetName(fieldnames[i]))
        // .map((fd, i) => from(fd, {name: fieldnames[i]}))  // Why this. the fieldDef is already clones in buildFieldDef
    }

    extractFieldnamesFromMo() {
        const mo: MoInterface = this.newMo()
        return Object.getOwnPropertyNames(mo).filter(n => typeof mo[n] !== 'function' && n !== 'moMeta' && !n.startsWith('_'))
    }

    getFieldDefs = (params?: any): FieldDefinitionInterface<any>[] => {
        if (!params) return Array.from(this.fieldDefs.values())
        const fieldDefs: FieldDefinitionInterface<any>[] = []
        for (const fd of Array.from(this.fieldDefs.values())) {
            let include = true
            for (const [k, v] of Object.entries(params)) {
                if (fd[k] !== v) {
                    include = false
                }
            }
            if (include) {
                fieldDefs.push(fd)
            }
        }
        return fieldDefs
    }
    /*  -------------
     *  Mo Management
     *  -------------
     */
    // I would prefer Mo and typeof Mo to MoInterface i,
    // but it causes:  ReferenceError: Cannot access 'Mo' before initialization
    // newMo = (): Mo => {
    //   const moClass: typeof Mo = this.moClass || Mo
    //   const mo: Mo = new moClass()
    //   return mo
    // }
    // objToMo = (obj: object, moMeta: MoMetaInterface): Mo => this.newMo().setProps(obj)
    // documentToMo = (doc: any): Mo => {
    //   const mo = this.newMo()
    //   for (const [fname, fDef] of Array.from(this.fieldDefs.entries())) {
    //     mo[fname] = fDef.documentToValue(doc[fname])
    //   }
    //   return mo
    // }
    newMo = (): MoInterface => {
        const moClass = this.moClass || Object
        // @ts-ignore
        return new moClass() as MoInterface
    }

    objToMoid = async (obj: any, params?: objectToMoParameters): Promise<MoidInterface> => await objectToMoid(obj, params)
    objToMo = async (obj: any, params?: objectToMoParameters): Promise<MoInterface> => await objectToMo(obj, params)

    documentToMo = (doc: any): MoInterface => {
        const mo = this.newMo()
        for (const [fname, fDef] of Array.from(this.fieldDefs.entries())) {
            mo[fname] = fDef.documentToValue(doc[fname])
        }
        return mo
    }
    moToObj = (mo: any): any => mo.toObj()
    moToDocument = (mo: MoInterface) => mo.toDocument()

    /* ------
    * Utility
    * -------
    */
    // isSameAs = (moDef: MoDefinitionInterface) => {
    //     if (
    //       this.name !== moDef.name ||
    //       this.dbName !== moDef.dbName ||
    //       this.canCreate !== moDef.canCreate ||
    //       this.deletePermission !== moDef.deletePermission ||
    //       this.displayName !== moDef.displayName ||
    //       this.gdriveFileId !== moDef.gdriveFileId ||
    //       this.gdriveFilePath !== moDef.gdriveFilePath ||
    //       this.hasId !== moDef.hasId ||
    //       this.idType !== moDef.idType ||
    //       this.moClass !== moDef.moClass ||
    //       this.singularName !== moDef.singularName ||
    //       this.pluralName !== moDef.pluralName ||
    //       this.showFieldnames !== moDef.showFieldnames ||
    //       this.keyFieldnames !== moDef.keyFieldnames) {
    //         return false
    //     }
    //     const keys1 = this.fieldDefs.keys().toArray()
    //     const keys2 = moDef.fieldDefs.keys().toArray()
    //     if (keys1.length !== keys2.length) return false
    //     for (let i = 0; i < keys1.length; i++) {
    //         if (keys1[i] !== keys2[i]) return false
    //         if (this.fieldDefs.get(keys1[i]) !== moDef.fieldDefs.get(keys2[i])) return false
    //     }
    //     return true
    // }

    assumeIsSameAs = (moDef: MoDefinitionInterface): Difference | null => {
        if (this.name !== moDef.name) return {name: 'name', o1: this.name, o2: moDef.name}
        if (this.dbName !== moDef.dbName) return {name: 'dbName', o1: this.dbName, o2: moDef.dbName}
        if (this.canCreate !== moDef.canCreate) return {name: 'canCreate', o1: this.canCreate, o2: moDef.canCreate}
        if (this.deletePermission !== moDef.deletePermission) return {name: 'deletePermission', o1: this.deletePermission, o2: moDef.deletePermission}
        if (this.displayName !== moDef.displayName) return {name: 'displayName', o1: this.displayName, o2: moDef.displayName}
        if (this.gdriveFileId !== moDef.gdriveFileId) return {name: 'gdriveFileId', o1: this.gdriveFileId, o2: moDef.gdriveFileId}
        if (this.gdriveFilePath !== moDef.gdriveFilePath) return {name: 'gdriveFilePath', o1: this.gdriveFilePath, o2: moDef.gdriveFilePath}
        if (this.hasId !== moDef.hasId) return {name: 'hasId', o1: this.hasId, o2: moDef.hasId}
        if (this.idType !== moDef.idType) return {name: 'idType', o1: this.idType, o2: moDef.idType}
        if (this.moClass !== moDef.moClass) return {name: 'moClass', o1: this.moClass, o2: moDef.moClass}
        if (this.singularName !== moDef.singularName) return {name: 'singularName', o1: this.singularName, o2: moDef.singularName}
        if (this.pluralName !== moDef.pluralName) return {name: 'pluralName', o1: this.pluralName, o2: moDef.pluralName}
        if (this.showFieldnames !== moDef.showFieldnames) return {name: 'showFieldnames', o1: this.showFieldnames, o2: moDef.showFieldnames}
        if (JSON.stringify(this.keyFieldnames) !== JSON.stringify(moDef.keyFieldnames)) return {name: 'showFieldnames', o1: JSON.stringify(this.showFieldnames), o2: JSON.stringify(moDef.showFieldnames)}
        const keys1 = this.fieldDefs.keys().toArray()
        const keys2 = moDef.fieldDefs.keys().toArray()
        if (JSON.stringify(keys1) !== JSON.stringify(keys2)) return {name: 'fieldDef keys', o1: JSON.stringify(keys1), o2: JSON.stringify(keys2)}
        for (let i = 0; i < keys1.length; i++) {
            if (this.fieldDefs.get(keys1[i]) !== moDef.fieldDefs.get(keys1[i])) return {name: 'fieldDef keys', o1: JSON.stringify(this.fieldDefs.get(keys1[i])), o2: JSON.stringify(moDef.fieldDefs.get(keys1[i]))}
        }
        return null
    }
}

let moDefDef: MoDefinitionInterface
export const initMoDefDef = () => {
// const moDefDef = new MoDefinition('MoDefinition')
    const moDefDef = new MoDefinition('moDef')
    moDefDef.addFieldDef(from(BaseFieldDefs.Id).chainSetName('id'))
    moDefDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('name'))
    moDefDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('dbName'))
    moDefDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('displayName'))
    moDefDef.addFieldDef(from(BaseFieldDefs.Array).chainSetName('keyFieldnames'))
    moDefDef.addFieldDef(from(BaseFieldDefs.Array).chainSetName('gridFieldnames'))
    moDefDef.addFieldDef(from(BaseFieldDefs.NullableBoolean).chainSetName('hasId'))
    moDefDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('idType'))
    moDefDef.addFieldDef(from(BaseFieldDefs.UrlPath).chainSetName('gdriveFilePath'))
    moDefDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('gdriveFileId'))
    const fieldDefsFieldDef = from(BaseFieldDefs.Map).chainSetName('fieldDefs')
    fieldDefsFieldDef.itemValueType = 'object'
    moDefDef.addFieldDef(fieldDefsFieldDef)
    const moClassFieldDef = from(BaseFieldDefs.Name).chainSetName('moClass')
    moClassFieldDef.gridColDef = {
        field: undefined,
        valueGetter: params => params.data.moClass.name
    }
    moClassFieldDef.valueToString = v => {
        if (!v) {
            console.log(`==>MoDefinition.ts:172 v `, v)
        }
        return v.getDisplayName()
    }
    moDefDef.addFieldDef(moClassFieldDef)
// export const moDefMeta: MoMetaInterface = new MoMeta(moDefDef)
    Object.assign(moDefDef, {
        name: 'moDef',
        dbName: 'moDef',
        displayName: 'Mo Definition',
        keyFieldnames: ['moName'],
        gridFieldnames: ['name', 'gdriveFilePath'],
        moClass: typeof MoDefinition,
        hasId: true,
        idType: 'string',
        // dataSource: new CacheDataSource(moDefDef),
        gdriveFilePath: 'system/resources',
        gdriveFileId: null,
        canCreate: false,
    })
// const moDefDefDef = new MoDefinition('moDefDef')
// const moDefDefMeta =  new MoMeta(moDefDefDef)
// moDefDef.moMeta = moDefDefMeta
// moDefMeta.documentToMo  = doc => {
//   const moDef = new MoDefinition('moDef', MoDefinition)
//   const obj = JSON.parse(doc.json)
//   Object.assign(moDef, obj)
//   return moDef
//   //return JSON.parse(doc)
// }
}
setTimeout(initMoDefDef, 0)
// initMoDefDef()
export {moDefDef}



