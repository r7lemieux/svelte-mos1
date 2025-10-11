import { Mo } from './Mo.js'
import { from } from '../fields/FieldDefinition.js'
import { BaseFieldDefs } from '../fields/CommonFieldDefinition.js'
import type { MoDefinitionInterface } from './MoDefinitionInterface.js'
import type { MoMetaInterface } from './MoMetaInterface.js'
import { MoMeta } from './MoMeta.js'
import { moDefDef, MoDefinition } from './MoDefinition.js'
import { HeapDataSource } from '../../services/db/Heap.dataSource.js'
import type {FieldDefinitionInterface} from '../fields/FieldDefinition.interface.js'
import type {MoInterface} from './MoInterface.js'

export class MoDefinitionMo extends Mo implements MoDefinitionInterface {
  id: string
  name: string
  dbName: string
  displayName?: string
  keyFieldnames: string[][] = []
  fieldDefs: Map<string, FieldDefinitionInterface<any>> = new Map()
  gridFieldnames?: string[]
  showFieldnames: string[]
  moClass: any
  hasId: boolean = true
  idType: 'number' | 'string' = 'string'
  gdriveFilePath?: string = ''
  gdriveFileId?: string | null = null
  canCreate: boolean = false
  init = () => {}
  addFieldDef = (fd: FieldDefinitionInterface<any>) => {}
  getDisplayName: () => string = () => ''
  getDbName: () => string = () => ''
  getFieldNames: () => string[] = ()=> []
  getMoClass: () => any = () => null
  initFieldDefs: () => void = () => {}
  addFieldDefsFromNames: (fieldnames: string[]) => void = (fn: string[]) => {}
  deriveFieldDefsFromMo: () => FieldDefinitionInterface<any>[] = () => []
  deriveFieldDefsFromFieldnames: (fieldnames: string[]) => FieldDefinitionInterface<any>[] = (fd:string[]) => []
  extractFieldnamesFromMo: () => string[] = () => []
  newMo: (moMeta?: MoMetaInterface) => MoInterface = () => new Mo()
  objToMo: (obj: object) => MoInterface = (o: object)=> new Mo()
  moToObj: (mo: MoInterface) => object = (mo: MoInterface) => { return {}}
  moToDocument: (mo: MoInterface) => any = (mo: MoInterface) => {}
  documentToMo: (doc: any) => MoInterface = () => new Mo()

  moDef: MoDefinitionInterface
  constructor(moDef: MoDefinitionInterface) {
    super(moDefMoMeta)
    this.moDef = moDef
    this.id = this.name = this.dbName = moDef.name
    this.getDisplayName = this.moDef.getDisplayName
    this.showFieldnames = Array.from(moDef.fieldDefs.keys())
    Object.assign(this, this.moDef)
  }
  // getDisplayName = () => this.moDef.getDisplayName()
}
export const moDefMoDef = new MoDefinition('moDef')
moDefMoDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('name'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.Id).chainSetName('id'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('name'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('dbName'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('displayName'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.Array).chainSetName('keyFieldnames'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.Array).chainSetName('gridFieldnames'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.NullableBoolean).chainSetName('hasId'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('idType'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.UrlPath).chainSetName('gdriveFilePath'))
moDefMoDef.addFieldDef(from(BaseFieldDefs.Name).chainSetName('gdriveFileId'))
const moClassFieldDef = from(BaseFieldDefs.Name).chainSetName('moClass')
const fieldDefsFieldDef = from(BaseFieldDefs.Map).chainSetName('fieldDefs')
// fieldDefsFieldDef.mapValueType = 'object'
moDefMoDef.addFieldDef(fieldDefsFieldDef)
moClassFieldDef.gridColDef = {
  field: undefined,
  valueGetter: params => params.data.moClass.name
}
moClassFieldDef.valueToString = v => {
  if (!v) {
    console.log(`==>MoDefinition.ts:172 v `, v)
  }
  v => v.name
}
moDefMoDef.addFieldDef(moClassFieldDef)
// export const moDefMeta: MoMetaInterface = new MoMeta(moDefDef)
Object.assign(moDefMoDef, {
  name: 'moDef',
  dbName: 'moDef',
  displayName: 'Mo Definition',
  keyFieldnames: ['moName'],
  gridFieldnames: ['name', 'gdriveFilePath'],
  moClass: MoDefinitionMo,
  hasId: true,
  idType: 'string',
  gdriveFilePath: 'system/resources/modefs',
  gdriveFileId: null,
  canCreate: false,
})

export const moDefMoMeta: MoMetaInterface = new MoMeta(moDefMoDef)

moDefMoMeta.documentToMo  = doc => {
  const moDefMo = new MoDefinitionMo(moDefMoDef)
  const obj = JSON.parse(doc.json)
  Object.assign(moDefMo, obj)
  return moDefMo
}

moDefMoMeta.dataSource = new HeapDataSource<MoInterface>(moDefMoDef)
moDefMoMeta.name = 'moDefMoMeta'
