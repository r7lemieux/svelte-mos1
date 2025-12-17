import type { MoInterface } from './MoInterface.js';
import type { FieldDefinitionInterface } from '../fields/FieldDefinition.interface.js';
import type { MoMetaInterface } from './MoMetaInterface.js';
import type {MoidInterface} from './MoidInterface.js'
import type { MoFieldDefinition } from '../fields/MoFieldDefinition.js'
import type {objectToMoParameters} from '../../services/mo/moTransport.js'
import {  type moFieldParameters} from '../fields/MoFieldDefinition.js'

export interface MoDefinitionInterface {
	id: string
	name: string
	dbName: string //todo remove
	displayName?: string
	fieldDefs: Map<string, FieldDefinitionInterface<any>>
	keyFieldnames: string[][]
	gridFieldnames?: string[]
	showFieldnames: string[]
	moClass: any
	hasId: boolean
	idType: 'number' | 'string'
	gdriveFilePath?: string
	gdriveFileId?: string | null
	canCreate: boolean

	init: () => void
	addFieldDef: (fieldDef: FieldDefinitionInterface<any>) => void
	/*  ---------
	 *  Accessors
	 *  ---------
	 */
	getDisplayName: () => string
	getDbName: () => string
	getFieldNames: () => string[]
	getMoClass: () => any
	getFieldDefs: (params?: any) => FieldDefinitionInterface<any>[]

	/* -----------------
	 * Field Definitions
	 * -----------------
	 */
	createFieldDefs: () => void
  initFieldDef: (fd: FieldDefinitionInterface<any>) => void
	addFieldDefsFromNames: (fieldnames: string[]) => void
  addMoFieldDefFromName: (name: string, params?: moFieldParameters) => MoFieldDefinition
  addMoArrayFieldDefFromName: (name: string, params?: moFieldParameters) => MoFieldDefinition
	// deriveMoItemDefFromMoArrayDef: (moArryDef: MoFieldDefinition) => MoFieldDefinition
	deriveFieldDefsFromMo: () => FieldDefinitionInterface<any>[]
	deriveFieldDefsFromFieldnames: (fieldnames: string[]) => FieldDefinitionInterface<any>[]
	extractFieldnamesFromMo: () => string[]
	/*  --
	 *  Mo
	 *  --
	 */
	newMo: (moMeta?: MoMetaInterface) => MoInterface
	objToMoid: (obj: object, params?: objectToMoParameters) => MoidInterface
	objToMo: (obj: object,  params?: objectToMoParameters) => MoInterface
	moToObj: (mo: MoidInterface) => object
	moToDocument: (mo: MoInterface) => any
	documentToMo: (doc: any) => MoInterface
	// toDocument: () => any

	deletePermission: DeletePermissionEnum
}

export const DeletePermission = {
	no: 'no',
	go: 'go',
	ask: 'ask',
} as const
export type DeletePermissionEnum = (typeof DeletePermission)[keyof typeof DeletePermission]

