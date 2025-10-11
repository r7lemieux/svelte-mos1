import type { MoInterface } from './MoInterface.js';
import type { FieldDefinitionInterface } from '../fields/FieldDefinition.interface.js';
import type { MoMetaInterface } from './MoMetaInterface.js';

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

	/* -----------------
	 * Field Definitions
	 * -----------------
	 */
	initFieldDefs: () => void
	addFieldDefsFromNames: (fieldnames: string[]) => void
	deriveFieldDefsFromMo: () => FieldDefinitionInterface<any>[]
	deriveFieldDefsFromFieldnames: (fieldnames: string[]) => FieldDefinitionInterface<any>[]
	extractFieldnamesFromMo: () => string[]

	/*  --
	 *  Mo
	 *  --
	 */
	newMo: (moMeta?: MoMetaInterface) => MoInterface
	objToMo: (obj: object) => MoInterface
	moToObj: (mo: MoInterface) => object
	moToDocument: (mo: MoInterface) => any
	documentToMo: (doc: any) => MoInterface
	// toDocument: () => any
}
