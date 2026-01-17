import type {MoDefinitionInterface} from './MoDefinitionInterface.js'
import type {FieldDefinitionInterface} from '../fields/FieldDefinition.interface.js'

export interface RelationDefinitionInterface {
    moDefinition1: MoDefinitionInterface
    moDefinition2: MoDefinitionInterface
    fieldDef1: FieldDefinitionInterface<any>
    fieldDef2?: FieldDefinitionInterface<any>
    min1: number
    min2: number
    max1: number
    max2: number
    deleteCascade1: DeleteCascadeEnum
    deleteCascade2: DeleteCascadeEnum
    reverse?: RelationDefinitionInterface

    createReverse: () => RelationDefinitionInterface
    register: ()=> RelationDefinitionInterface
    setup: () => RelationDefinitionInterface
}

export const DeleteCascade = {
    noDelete: 'noDelete',
    keep: 'keep',
    cascade: 'cascade',
    reparent: 'reparent',
} as const
export type DeleteCascadeEnum = (typeof DeleteCascade)[keyof typeof DeleteCascade]
