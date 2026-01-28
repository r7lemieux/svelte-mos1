import {MoDefinition} from '../managedObjects/MoDefinition.js'
import {Mo} from '../managedObjects/Mo.js'
import {type FieldDefinition, from} from './FieldDefinition.js'
import { BaseFieldDefs, CommonFieldDefs } from './CommonFieldDefinition.js'
import type { MoMetaInterface } from '../managedObjects/MoMetaInterface.js'
// import { MoMetaInterface } from '../managedObjects/MoMetaInterface.js'
// import { MoMetaInterface } from '../managedObjects/MoMetaInterface'

export class FieldDefinitionMo<Type> extends Mo {

  // type = 'string'
  // name = ''
  // description?: string
  // example?: string
  // displayName: string | undefined
  // regex?: RegExp
  // regexFlag?: string
  // minLen = 0
  // maxLen = 256
  // key?: string // database or column name
  // gridColDef: ColDef = {}
  // inputType: InputTypes = 'text'

  fieldDef: FieldDefinition<any>

  constructor(fieldDefinition: FieldDefinition<any>) {
    super({} as MoMetaInterface)
    // super(fieldDefinitionMoMeta)
    this.fieldDef = fieldDefinition
  }

  hydrate1() {
    const fieldnames = Object.getOwnPropertyNames(this)
      .filter(fn => fn !== 'fieldDef')
    for (const fieldname of fieldnames) {
      this[fieldname] = this.fieldDef[fieldname]
    }
  }

  // hydrate0() {
  //   this.type = this.fieldDef.type
  //   this.name = this.fieldDef.name
  //   this.description = this.fieldDef.description
  //   this.example = this.fieldDef.example
  //   this.displayName = this.fieldDef.displayName
  //   this.regex = this.fieldDef.regex
  //   this.regexFlag = this.fieldDef.regexFlag
  //   this.minLen = this.fieldDef.minLen
  //   this.maxLen = this.fieldDef.maxLen
  //   this.key = this.fieldDef.key
  //   this.gridColDef = this.fieldDef.gridColDef
  //   this.inputType = this.fieldDef.inputType
  // }
  //

}

export const fieldDefinitionMoDef = new MoDefinition('FieldDefinition')
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Name).setName('name'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Name).setName('type'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Name).setName('description'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Name).setName('displayName'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Text).setName('example'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Text).setName('regex'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Name).setName('regexFlag'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Integer).setName('minLen'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Integer).setName('maxLen'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Name).setName('key'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Name).setName('inputType'))
fieldDefinitionMoDef.addFieldDef(from(BaseFieldDefs.Name).setName('gridColDef'))

// const fieldDefinitionMoMeta = new MoMeta(fieldDefinitionMoDef)

Object.assign(fieldDefinitionMoDef, {
  name: 'meta',
  dbName: 'MoDefinition',
  displayName: 'Meta',
  keyFieldnames: ['moName'],
  gridFieldnames: ['name', 'moClass', 'gdriveFilename'],
  moClass: MoDefinition,
  hasId: true,
  idType: 'string',
  dataSource: null,
  gdriveFilePath: 'system/resources',
  gdriveFileId: null,
  newMo: () => new FieldDefinitionMo(CommonFieldDefs.name)
})
