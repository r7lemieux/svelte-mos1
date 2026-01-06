import {FieldDefinition} from './FieldDefinition.js'
import {type DeletePermissionEnum} from '$lib/models/managedObjects/MoDefinitionInterface.js'

export class MoFieldDefinition extends FieldDefinition<any> {
  type = 'mo'
  moName: string
  reverseFieldName?: string
  deleteCascade?: DeleteCascadeEnum
  min: number = 1
  max: number = 1
  compositePart: boolean = false
  twoWays: boolean = false

  gridColDef = {
    type: 'object'
  }

  constructor(moName: string, props: Partial<FieldDefinition<any>> = {}) {
    super(props)
    this.moName = moName
  }

  chainSetMoName = (moName: string) => {
    this.moName = moName
    return this
  }

  deriveMoItemDef = () => {
    const moFieldDef = this.clone() as MoFieldDefinition
    moFieldDef.type = 'mo'
    return moFieldDef
  }
}
export const DeleteCascade = {
  noDelete: 'noDelete',
  keep: 'keep',
  cascade: 'cascade',
  reparent: 'reparent',
} as const
export type DeleteCascadeEnum = (typeof DeleteCascade)[keyof typeof DeleteCascade]

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
