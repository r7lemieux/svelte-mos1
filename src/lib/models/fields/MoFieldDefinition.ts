import {FieldDefinition, from} from './FieldDefinition.js'
import {BaseFieldDefs} from './CommonFieldDefinition.js'

// export const BaseFieldDefs: { [name: string]: FieldDefinition<any> } = {

export const MoFieldDefinition: FieldDefinition<any> = from(BaseFieldDefs.Object)
MoFieldDefinition.type = 'MO'
MoFieldDefinition.gridColDef = {
    type: 'object'
  }
