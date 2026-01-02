import {FieldDefinition} from './FieldDefinition.js'

export class EnumFieldDefinition extends FieldDefinition<any> {
  type = 'enum'
  min: number = 1
  max: number = 1
  validValues: any

  constructor(props: Partial<EnumFieldDefinition> = {}) {
    super()
    this.init(props)
  }

}

