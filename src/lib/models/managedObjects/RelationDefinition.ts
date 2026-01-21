import type {MoDefinitionInterface} from "./MoDefinitionInterface.js";
import {ErrorName} from "../../services/common/message/errorName.js";
import {Rezult} from "../../services/common/message/rezult.js";
import type {FieldDefinitionInterface} from "../fields/FieldDefinition.interface.js";
import {DeleteCascade, type DeleteCascadeEnum, type RelationDefinitionInterface} from './RelationDefinitionInterface.js'
import {moDefs, getMoDef} from '../../services/mo/moDefManagement.js'
import {MoFieldDefinition} from '../fields/MoFieldDefinition.js'

export class RelationDefinition implements RelationDefinitionInterface  {
    moDefinition1: MoDefinitionInterface
    moDefinition2: MoDefinitionInterface
    fieldDef1: FieldDefinitionInterface<any>
    fieldDef2?: FieldDefinitionInterface<any>
    min1: number = 1
    min2: number = 1
    max1: number = 1
    max2: number = 1
    deleteCascade1: DeleteCascadeEnum = DeleteCascade.keep
    deleteCascade2: DeleteCascadeEnum = DeleteCascade.keep
    reverse?: RelationDefinitionInterface

    constructor(moname1: string, fieldname1: string, moname2: string, fieldname2: string = '', params?: Partial<RelationDefinition>) {
        this.moDefinition1 = getMoDef(moname1)
        if (!this.moDefinition1) throw new Rezult(ErrorName.missing_moDefinition, {moname1}, 'RelationDefinition')
        const fieldDef1 = this.moDefinition1.fieldDefs.get(fieldname1)
        if (!fieldDef1) throw new Rezult(ErrorName.missing_fieldDef, {moname1, fieldname1}, 'RelationDefinition')
        this.fieldDef1 = fieldDef1

        this.moDefinition2 = getMoDef(moname2)
        if (!this.moDefinition2) throw new Rezult(ErrorName.missing_moDefinition, {moname2}, 'RelationDefinition')
        if (fieldname2) {
            const fieldDef2 = this.moDefinition2.fieldDefs.get(fieldname2)
            if (!fieldDef2) throw new Rezult(ErrorName.missing_fieldDef, {moname2, fieldname2}, 'RelationDefinition')
            this.fieldDef2 = fieldDef2
        }
        if (params) {
            Object.assign(this, params)
        }
    }

    createReverse = () => {
        if (!this.fieldDef2) throw new Rezult(ErrorName.missing_fieldDef, {moname1: this.fieldDef1})
        const reverseRelDef = new RelationDefinition(this.moDefinition2.name, this.fieldDef2.name, this.moDefinition1.name, this.fieldDef1.name)
        reverseRelDef.min1 = this.min2
        reverseRelDef.max1 = this.max2
        reverseRelDef.min2 = this.min1
        reverseRelDef.max2 = this.max1
        reverseRelDef.deleteCascade1 = this.deleteCascade2
        reverseRelDef.deleteCascade2 = this.deleteCascade1
        reverseRelDef.reverse = this
        this.reverse = reverseRelDef
        return reverseRelDef
    }
    register = () => {
        RelationDefs[this.moDefinition1.name] = RelationDefs[this.moDefinition1.name] || {}
        RelationDefs[this.moDefinition1.name][this.fieldDef1.name] = this
        return this
    }
    setup = () => {
        this.register()
            if (this.fieldDef2) {
                this.createReverse()
                    .register()
            }
            return this
    }
}

export const RelationDefs: {[moDefname:string]:{[fieldname:string] : RelationDefinition}} = {}
export const getRelationDefs = () => Object.values(RelationDefs).map(o => Object.values(o)).flat()

export const initRelationDefs = () => {
    initDefaultRelationDefs()
    createReverses()
    linkMoDefs()
    linkFieldDefs()
}

const initDefaultRelationDefs = () => Object.keys(moDefs).forEach(n => RelationDefs[n] = {})

const createReverses = () => {
    for (const relDef of getRelationDefs()) {
        if (relDef.fieldDef2) {
            if (!relDef.reverse) {
                const reverse = relDef.createReverse()
                reverse.register()
            }
        }
    }
}

const linkMoDefs = () => {
    for (const [moDefName, relDefs] of Object.entries(RelationDefs) ) {
        const moDef = getMoDef(moDefName)
        moDef.relations = relDefs
    }
}

const linkFieldDefs = () => {
    for (const relDef of getRelationDefs()) {
        const fieldDef = relDef.moDefinition1.fieldDefs.get(relDef.fieldDef1.name)
        if (!fieldDef) throw new Rezult(ErrorName.missing_fieldDef, {mo1: relDef.moDefinition1.name, field1: relDef.fieldDef1.name, mo2: relDef.moDefinition2.name, field2: relDef.fieldDef2?.name})
        if (fieldDef.type !== 'mo') throw new Rezult(ErrorName.fieldDef_wrong_type, {mo1: relDef.moDefinition1.name, field1: relDef.fieldDef1.name, mo2: relDef.moDefinition2.name, field2: relDef.fieldDef2?.name})
        if (!(fieldDef instanceof MoFieldDefinition)) throw new Rezult(ErrorName.fieldDef_wrong_class, {mo1: relDef.moDefinition1.name, field1: relDef.fieldDef1.name, mo2: relDef.moDefinition2.name, field2: relDef.fieldDef2?.name})
        fieldDef.relation = relDef
    }
}
