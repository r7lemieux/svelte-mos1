import type {FieldDefinitionInterface} from '../fields/FieldDefinition.interface.js'
import type {MoMetaInterface} from './MoMetaInterface.js'
import type {RelationDefinitionInterface} from './RelationDefinitionInterface.js'

export interface RelationMetaInterface {
    moMeta1: MoMetaInterface
    moMeta2: MoMetaInterface
    relationDef: RelationDefinitionInterface
    reverse?: RelationMetaInterface

    createReverse: () => RelationMetaInterface
    register: ()=> RelationMetaInterface
    setup: () => RelationMetaInterface
}

