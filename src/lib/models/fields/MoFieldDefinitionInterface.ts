import {FieldDefinition} from './FieldDefinition.js'
import {type DeletePermissionEnum} from '../managedObjects/MoDefinitionInterface.js'
import type {DeleteCascadeEnum, RelationDefinitionInterface} from '../managedObjects/RelationDefinitionInterface.js'
import {MoFieldDefinition} from './MoFieldDefinition.js'
import type {FieldDefinitionInterface} from './FieldDefinition.interface.js'

export interface MoFieldDefinitionInterface extends FieldDefinitionInterface<any> {
    type: 'mo' | 'moArray'
    relation: RelationDefinitionInterface

    setRelation: (relation: RelationDefinitionInterface) => MoFieldDefinitionInterface
}
