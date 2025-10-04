import type {Rezult} from '../../services/common/message/rezult.js'
import type {ColDef} from 'ag-grid-community'
import type {InputTypes} from  '../../services/common/util/dom.utils.js'


// Singleton
export interface FieldDefinitionInterface<T> {
  name: string
  type: string
  key?: string
  displayName?: string
  // columnName?: string
  regex?: RegExp
  regexFlag?: string
  minLen: number
  maxLen: number
  parse: (string) => T | null
  valueToString: (any) => string
  documentToValue: (any) => any
  valueToDocument: (any) => any
  validateValue: (T) => Rezult
  validateString: (string) => Rezult
  canBeNull: boolean
  canBeUndefined: boolean
  // cellStyle?: CellStyle | CellStyleFunc
  // minWidth?: number
  // showInGrid?: boolean
  // cellRenderer?: ((params: any) => string) | string
  // cellRendererParams?: any
  gridColDef?: ColDef
  mapValueType?: string

  inputType: InputTypes
  init: (props: any) => void
  validate: () => void
  clone: () => FieldDefinitionInterface<T>
  chainSetName: (name: string) => FieldDefinitionInterface<T>
  gridToString: (gridFields: []) => string
  getDisplayName: () => string
  getColumnName: () => string
  getDescription: () => string
  buildColDef: () => ColDef
}