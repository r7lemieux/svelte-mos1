import { FieldDefinition } from './FieldDefinition.js'
import type { MoMetaInterface } from '../managedObjects/MoMetaInterface.js'
import { getDefaultMoMeta } from '../managedObjects/moMetaInstances.js'
import {CommonFieldDefs} from '$lib/models/fields/CommonFieldDefinition.js'

export class MoFieldDefinition extends FieldDefinition<any> {
  moName: string
  type = 'mo'
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
