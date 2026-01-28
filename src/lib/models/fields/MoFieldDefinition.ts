import {FieldDefinition} from './FieldDefinition.js'
import type {RelationDefinitionInterface} from '../managedObjects/RelationDefinitionInterface.js'
import type {FieldDefinitionInterface} from './FieldDefinition.interface.js'
import {copyOwnProperties} from '../../services/common/util/ts.utils.js'
import type {RelationDefinition} from '../managedObjects/RelationDefinition.js'
import type {MoFieldDefinitionInterface} from './MoFieldDefinitionInterface.js'

export class MoFieldDefinition extends FieldDefinition<any> implements MoFieldDefinitionInterface {
    type: 'mo' | 'moArray' = 'mo'
    relation: RelationDefinitionInterface = {} as RelationDefinitionInterface

    constructor(name: string, props: Partial<FieldDefinition<any>> = {}) {
        super(props)
        this.name = name
    }

    setRelation = (relation: RelationDefinitionInterface) => {
        this.relation = relation
        if (relation.max1 > 1) {
            this.type = 'moArray'
            this.gridColDef = {
                cellRenderer: params => {
                    if (params.value) {
                        const arr = params.value as Array<any>
                        return arr.join(', ')
                    }
                    return ''
                }
            }
        } else {
            this.type = 'mo'
            this.gridColDef = {
                cellRenderer: params => {
                    return params.value?.getDisplayName()
                }
            }
        }
        return this
    }

    // static from = (fieldDef0: FieldDefinition<any>, relation: RelationDefinition, props: Partial<FieldDefinitionInterface<any>> = {}): FieldDefinition<any> => {
    //     // const newFieldDef: FieldDefinition<any> = fieldDef0.constructor(props)
    //     let newFieldDef = new MoFieldDefinition(relation, props)
    //     copyOwnProperties(fieldDef0, newFieldDef)
    //     copyOwnProperties(props, newFieldDef)
    //     return newFieldDef
    // }
}

export const fromMoField = MoFieldDefinition.from