import {moDefs} from '../../services/mo/moDefManagement.js'
import {Rezult} from '../../services/common/message/rezult.js'
import {ErrorName} from '../../services/common/message/errorName.js'
import type {MoMetaInterface} from './MoMetaInterface.js'
import {getMoMeta} from '../../services/mo/moManagement.js'
import type {RelationMetaInterface} from './RelationMetaInterface.js'
import {DeleteCascade, type DeleteCascadeEnum, type RelationDefinitionInterface} from './RelationDefinitionInterface.js'
import {RelationDefinition, RelationDefs} from './RelationDefinition.js'
import {pluralize, singularize} from 'inflection'
import type {MoDefinitionInterface} from './MoDefinitionInterface.js'

export class RelationMeta implements RelationMetaInterface {
    moMeta1: MoMetaInterface
    moMeta2: MoMetaInterface
    relationDef: RelationDefinitionInterface
    reverse?: RelationMetaInterface

    constructor(moname1: string, moname2: string, relationDefinition: RelationDefinitionInterface, params?: Partial<RelationMetaInterface>) {
        this.moMeta1 = getMoMeta(moname1)
        if (!this.moMeta1) throw new Rezult(ErrorName.missing_moDefinition, {moname1}, 'RelationMeta')
        this.moMeta2 = getMoMeta(moname2)
        if (!this.moMeta2) throw new Rezult(ErrorName.missing_moDefinition, {moname2}, 'RelationMeta')
        this.relationDef = relationDefinition
        if (params) {
            Object.assign(this, params)
        }
    }

    createReverse = () => {
        const reverseRelMeta = new RelationMeta(this.moMeta2.name, this.moMeta1.name, this.relationDef.reverse!)
        reverseRelMeta.reverse = this
        this.reverse = reverseRelMeta
        return reverseRelMeta
    }
    register = () => {
        RelationMetas[this.moMeta1.name] = RelationMetas[this.moMeta1.name] || {}
        RelationMetas[this.moMeta1.name][this.relationDef.fieldDef1.name] = this
        return this
    }
    initRelationMetas = () => {
        createReverses()
        linkMoMetas()
    }
    setup = () => {
        this.register()
        if (this.relationDef.fieldDef2) {
            this.createReverse()
                .register()
        }
        return this
    }
}

export const RelationMetas: {
    [moname: string]: {
        [fieldname: string]: RelationMeta
    }
} = {}
export const getRelationMetas = () => Object.values(RelationMetas).map(o => Object.values(o)).flat()

export const initRelationMetas = () => {
    createReverses()
    linkMoMetas()
}

export const initDefaultRelationMetas = () => Object.keys(moDefs).forEach(n => RelationMetas[n] = {})

const createReverses = () => {
    // console.log(`==>RelationMeta.ts:66  RelationMetas`, Object.keys(getRelationMetas()))
    for (const relMeta of getRelationMetas()) {
        // console.log(`==>RelationMeta.ts:68  relMeta`, relMeta.moMeta1.name, relMeta.moMeta2.name)
        if (relMeta.relationDef.fieldDef2) {
            // console.log(`==>RelationMeta.ts:70  relMeta.relationDef.fieldDef2`, relMeta.relationDef.fieldDef2)
            if (!relMeta.reverse) {
                // console.log(`==>RelationMeta.ts:72  relMeta.relationDef.fieldDef2`, relMeta.relationDef.fieldDef2)
                const reverse = relMeta.createReverse()
                reverse.register()
            }
        }
    }
}

const linkMoMetas = () => {
    console.log(`==>RelationMeta.ts:89`)
    for (const [moname, relMetas] of Object.entries(RelationMetas)) {
        const moMeta = getMoMeta(moname)
        moMeta.relations = relMetas
    }

}

export const addRelation = (moMeta1: MoMetaInterface, moMeta2: MoMetaInterface, params: {
    fieldname1?: string,
    fieldname2?: string,
    min1?: number,
    max1?: number,
    min2?: number,
    max2?: number,
    deleteCascade1?: DeleteCascadeEnum,
    deleteCascade2?: DeleteCascadeEnum
} = {
    min1: 0,
    max1: Number.MAX_SAFE_INTEGER,
    min2: 0,
    max2: Number.MAX_SAFE_INTEGER,
    deleteCascade1: DeleteCascade.keep,
    deleteCascade2: DeleteCascade.keep
}): RelationMeta => {
    let fieldname1 = params.fieldname1 || (params.max1 === 1) ? singularize(moMeta2.name) : pluralize(moMeta2.name)
    let fieldname2 = params.fieldname2 || (params.max2 === 1) ? singularize(moMeta1.name) : pluralize(moMeta1.name)
    const relDef = new RelationDefinition(
        moMeta1.moDef.name,
        fieldname1,
        moMeta2.moDef.name,
        fieldname2,
        params)
        .register()
    if (fieldname2) {
        relDef.createReverse()
            .register()
    }
    const relMeta = new RelationMeta(
        moMeta1.name,
        moMeta2.name,
        relDef)
        .register()
    if (fieldname2) {
        relMeta.createReverse()
            .register()
    }
    // console.log(`==>RelationMeta.ts:103 relMeta ${moMeta1.name}.${fieldname1}, ${moMeta2.name}.${fieldname2}`)
    return relMeta
}
