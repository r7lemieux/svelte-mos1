import {getMoMeta, moDefs, moMetas} from "$lib/services/mo/moManagement.js";
import type {MoDefinitionInterface} from "$lib/models/managedObjects/MoDefinitionInterface.js";
import type {MoFieldDefinition} from "$lib/models/fields/MoFieldDefinition.js";
import {ErrorName} from "$lib/services/common/message/errorName.js";
import {Rezult} from "$lib/services/common/message/rezult.js";
import {pluralize} from "inflection";
import {getClosestName, levenshteinRank} from "$lib/services/common/util/fieldMatcher.js";

export const validateAllReferences = () => {
    for (const moDef of Object.values(moDefs)) {
        const moDefName = moDef.name
        for (const fieldDef of moDef.getFieldDefs()) {
            if (fieldDef.type === 'mo' || fieldDef.type === 'moArray') {
                const moFieldDef = fieldDef as MoFieldDefinition
                const moFieldDefName = moFieldDef.name
                const moname = moFieldDef.moName
                const reverseMoMeta = getMoMeta(moname)
                if (!reverseMoMeta) throw new Rezult(ErrorName.moMeta_notFound, {moDefName, moFieldDefName, moname}, 'connectAllReferences')
                if (moFieldDef.twoWays) {
                    const reverseMoDef = reverseMoMeta.moDef
                    const reverseMoDefName = reverseMoDef.name
                    const reverseFieldName = moFieldDef.reverseFieldName
                    if (reverseFieldName) {
                        const reverseFieldDef = reverseMoDef.fieldDefs.get(reverseFieldName)
                        if (!reverseFieldDef) throw new Rezult(ErrorName.missing_reverse_field, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                        if (reverseFieldDef.type !== 'mo' && reverseFieldDef.type !== 'moArray') throw new Rezult(ErrorName.field_invalid, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName, reverseFieldDefType: reverseFieldDef.type}, 'connectAllReferences')
                        const reverseMoFieldDef = reverseFieldDef as MoFieldDefinition
                        if (reverseMoFieldDef.reverseFieldName !== moFieldDef.name) throw new Rezult(ErrorName.mismatch_fieldnames, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                        if (moFieldDef.max > 1 && moFieldDef.type !== 'moArray') throw new Rezult(ErrorName.field_def_not_array, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                        if (reverseMoFieldDef.max > 1 && reverseFieldDef.type !== 'moArray') throw new Rezult(ErrorName.field_def_not_array, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                    }
                }
            }
        }
    }
}

export const connectAllReferences = () => {
    for (const moDef of Object.values(moDefs)) {
        const moDefName = moDef.name
        for (const fieldDef of moDef.getFieldDefs()) {
            if (fieldDef.type === 'mo' || fieldDef.type === 'moArray') {
                const moFieldDef = fieldDef as MoFieldDefinition
                const moFieldDefName = moFieldDef.name
                const moname = moFieldDef.moName
                const reverseMoMeta = getMoMeta(moname)
                if (moFieldDef.twoWays) {
                    const reverseMoDef = reverseMoMeta.moDef
                    const reverseMoDefName = reverseMoDef.name
                    let reverseFieldName = moFieldDef.reverseFieldName
                    if (reverseFieldName) {
                        const reverseFieldDef = reverseMoDef.fieldDefs.get(reverseFieldName)
                        if (!reverseFieldDef) throw new Rezult(ErrorName.missing_reverse_field, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                        if (reverseFieldDef.type !== 'mo' && reverseFieldDef.type !== 'moArray') throw new Rezult(ErrorName.field_invalid, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName, reverseFieldDefType: reverseFieldDef.type}, 'connectAllReferences')
                        const reverseMoFieldDef = reverseFieldDef as MoFieldDefinition
                        if (reverseMoFieldDef.reverseFieldName !== moFieldDef.name) throw new Rezult(ErrorName.mismatch_fieldnames, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                        if (moFieldDef.max > 1 && moFieldDef.type !== 'moArray') throw new Rezult(ErrorName.field_def_not_array, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                        if (reverseMoFieldDef.max > 1 && reverseFieldDef.type !== 'moArray') throw new Rezult(ErrorName.field_def_not_array, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                    } else {
                        reverseFieldName = moFieldDef.name
                        const reverseFieldDef = reverseMoDef.fieldDefs.get(reverseFieldName)
                        if (!reverseFieldDef) reverseFieldName = pluralize(moFieldDefName)
                        if (!reverseFieldDef) {
                            const bestMatch = getClosestName(moFieldDef.name, reverseMoDef.fieldDefs.keys().toArray())
                            if (bestMatch.rank < 55) throw new Rezult(ErrorName.field_unknown, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                            const bestMatchReverseFieldDef = reverseMoDef.fieldDefs.get(bestMatch.name)
                            if (bestMatchReverseFieldDef?.type !== 'mo' && bestMatchReverseFieldDef?.type !== 'moArray') {
                                throw new Rezult(ErrorName.field_unknown, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, 'connectAllReferences')
                            }
                            if (bestMatch.rank < 70) console.log(`==>moReferenceBuilder:67 connectAllReferences bestMatch for ${moFieldDef.name}`, {moDefName, moFieldDefName, moname, reverseMoDefName, reverseFieldName}, bestMatch)
                            moFieldDef.reverseFieldName = bestMatch.name
                        }
                    }
                }
            }
        }
    }
}