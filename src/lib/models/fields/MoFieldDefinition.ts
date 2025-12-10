import { FieldDefinition } from './FieldDefinition.js'
import type { MoMetaInterface } from '../managedObjects/MoMetaInterface.js'
import { getDefaultMoMeta } from '../managedObjects/moMetaInstances.js'
import {CommonFieldDefs} from '$lib/models/fields/CommonFieldDefinition.js'
import type {DeletePermissionEnum} from '$lib/models/managedObjects/MoDefinitionInterface.js'

export class MoFieldDefinition extends FieldDefinition<any> {
  moName: string
  type = 'mo'
  deleteCascade?: DeleteCascadeEnum
  deleteLastPermission?: DeletePermissionEnum
  twoWays?: boolean

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
  no: 'no',
  go: 'go',
  reparent: 'reparent',
  default: 'default'
} as const
export type DeleteCascadeEnum = (typeof DeleteCascade)[keyof typeof DeleteCascade]

export interface moFieldParameters {
  moname?: string
  deleteCascade?: DeleteCascadeEnum
  twoWays?: boolean
}
export interface moArrayFieldParameters {
  moname?: string
  deleteLastPermission?: DeletePermissionEnum
  twoWays?: boolean
}
