import type {Rezult} from '../../services/common/message/rezult.js'
import type {ColDef} from 'ag-grid-community'
import type {InputTypes} from '../../services/common/util/dom.utils.js'
import type {hydrateFieldParameters} from './FieldDefinition.js'


// Singleton
export interface FieldDefinitionInterface<T> {
  name: string
  type: string
  key?: string
  displayName?: string,
  moname?: string,
  // columnName?: string
  regex?: RegExp
  regexFlag?: string
  minLen: number
  maxLen: number
  parse: (v:string) => T | null
  stringToValue: (s:string) => T | null
  valueToString: (v:any) => string
  valueToField?: (v:any, params?:hydrateFieldParameters) => any
  documentToValue: (d:any) => any
  valueToDocument: (v:any) => any
  validateValue: (v:T) => Rezult
  validateString: (s:string) => Rezult
  canBeNull: boolean
  canBeUndefined: boolean
  // cellStyle?: CellStyle | CellStyleFunc
  // minWidth?: number
  // showInGrid?: boolean
  // cellRenderer?: ((params: any) => string) | string
  // cellRendererParams?: any
  gridColDef?: ColDef
  itemValueType?: string
  itemValueFieldDef?: FieldDefinitionInterface<any>
  inputType: InputTypes
  init: (props: any) => void
  validate: () => void
  clone: () => FieldDefinitionInterface<T>
  setName: (name: string) => FieldDefinitionInterface<T>
  gridToString: (gridFields: []) => string
  getDisplayName: () => string
  getColumnName: () => string
  getDescription: () => string
  buildColDef: (index?: number) => ColDef
}
