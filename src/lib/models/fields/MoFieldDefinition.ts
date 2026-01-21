import {FieldDefinition} from './FieldDefinition.js'
import {type DeletePermissionEnum} from '$lib/models/managedObjects/MoDefinitionInterface.js'
import type {DeleteCascadeEnum, RelationDefinitionInterface} from '../managedObjects/RelationDefinitionInterface.js'

export class MoFieldDefinition extends FieldDefinition<any> {
  type = 'mo'
  relation: RelationDefinitionInterface = {} as RelationDefinitionInterface
  gridColDef = {
    type: 'object'
  }

  constructor(moName: string, props: Partial<FieldDefinition<any>> = {}) {
    super(props)
  }

  chainSetMoName = (moName: string) => {
    return this
  }

  deriveMoItemDef = () => {
    const moFieldDef = this.clone() as MoFieldDefinition
    moFieldDef.type = 'mo'
    return moFieldDef
  }

}

export interface moFieldParameters {
  moname?: string
  reverseFieldName?: string
  deleteCascade?: DeleteCascadeEnum
  twoWays?: boolean
}

export interface moArrayFieldParameters {
  moname?: string
  min?: number
  max?: number
  deletePermission: DeletePermissionEnum
  twoWays?: boolean
}
