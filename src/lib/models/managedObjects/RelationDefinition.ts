import type {MoMetaInterface} from "./MoMetaInterface.js";
import {ErrorName} from "../../services/common/message/errorName.js";
import {Rezult} from "../../services/common/message/rezult.js";
import {DeleteCascade, type DeleteCascadeEnum} from "$lib/models/fields/MoFieldDefinition.js";
import type {FieldDefinitionInterface} from "../fields/FieldDefinition.interface.js";
import {getMoMeta} from "$lib/services/mo/moManagement.js";

export class RelationDefinition {
    moMeta1: MoMetaInterface
    moMeta2: MoMetaInterface
    fieldDef1: FieldDefinitionInterface<any>
    fieldDef2?: FieldDefinitionInterface<any>
    min1: number = 1
    min2: number = 1
    max1: number = 1
    max2: number = 1
    deleteCascade1: DeleteCascadeEnum = DeleteCascade.keep
    deleteCascade2: DeleteCascadeEnum = DeleteCascade.keep

    constructor(moname1: string, fieldname1: string, moname2: string, fieldname2: string = '', params?: Partial<RelationDefinition>) {
        this.moMeta1 = getMoMeta(moname1)
        if (!this.moMeta1) throw new Rezult(ErrorName.missing_moMeta, {moname1}, 'RelationDefinition')
        const fieldDef1 = this.moMeta1.moDef.fieldDefs.get(fieldname1)
        if (!fieldDef1) throw new Rezult(ErrorName.missing_fieldDef, {moname1, fieldname1}, 'RelationDefinition')
        this.fieldDef1 = fieldDef1

        this.moMeta2 = getMoMeta(moname2)
        if (!this.moMeta2) throw new Rezult(ErrorName.missing_moMeta, {moname2}, 'RelationDefinition')
        if (fieldname2) {
            const fieldDef2 = this.moMeta2.moDef.fieldDefs.get(fieldname2)
            if (!fieldDef2) throw new Rezult(ErrorName.missing_fieldDef, {moname2, fieldname2}, 'RelationDefinition')
            this.fieldDef2 = fieldDef2
        }
        if (params) {
            Object.assign(this, params)
        }
    }

    createReverses = () => {}
    register = () => RelationDefs.push(this)
}

export const RelationDefs: RelationDefinition[] = []

export const initRelationDefinitions = () => {
    for (const relDef of RelationDefs) {
        relDef.moMeta1.relationDefs.push(relDef)
        relDef.moMeta1.relationDefsByFieldname[relDef.fieldDef1.name] = relDef


    }
}