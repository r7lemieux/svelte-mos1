import {moDefs} from '../../services/mo/moDefManagement.js'
import {Rezult} from '../../services/common/message/rezult.js'
import {ErrorName} from '../../services/common/message/errorName.js'
import type {MoMetaInterface} from './MoMetaInterface.js'
import {getMoMeta} from '../../services/mo/moManagement.js'
import type {RelationMetaInterface} from './RelationMetaInterface.js'
import type {RelationDefinitionInterface} from './RelationDefinitionInterface.js'

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
    const reverseRelDef = new RelationMeta(this.moMeta2.name, this.moMeta1.name, this.relationDef)
    reverseRelDef.reverse = this
    this.reverse = reverseRelDef
    return reverseRelDef
}
register = () => {
    RelationMetas[this.moMeta1.name] = RelationMetas[this.moMeta1.name] || {}
    RelationMetas[this.moMeta1.name][this.moMeta1[this.relationDef.fieldDef1.name]] = this
    return this
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

export const RelationMetas: {[moname:string]:{[fieldname:string] : RelationMeta}} = {}
export const getRelationMetas = () => Object.values(RelationMetas).map(o => Object.values(o)).flat()

export const initRelationMetas = () => {
    initDefaultRelationMetas()
    createReverses()
    linkMoMetas()
}

const initDefaultRelationMetas = () => Object.keys(moDefs).forEach(n => RelationMetas[n] = {})

const createReverses = () => {
    for (const relMeta of getRelationMetas()) {
        if (relMeta.relationDef.fieldDef2) {
            if (!relMeta.reverse) {
                const reverse = relMeta.createReverse()
                reverse.register()
            }
        }
    }
}

const linkMoMetas = () => {
    for (const [moname, relMetas] of Object.entries(RelationMetas) ) {
        const moMeta = getMoMeta(moname)
        moMeta.relations = relMetas
    }
}


