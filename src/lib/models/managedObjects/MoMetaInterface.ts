import type { MoInterface } from './MoInterface.js'
import type { DataSourceInterface } from '../../services/db/DataSource.interface.js'
import type { MoDefinitionInterface } from './MoDefinitionInterface.js'
import type {MoidInterface} from './MoidInterface.js'
import {Rezult} from '../../services/common/message/rezult.js'
import {ErrorName} from '../../services/common/message/errorName.js'
import type {RelationDefinition} from "$lib/models/managedObjects/RelationDefinition.js";

export interface MoMetaInterface {
	name: string
	dbName: string
	moDef: MoDefinitionInterface
	dataSource: DataSourceInterface<MoInterface>
	relationDefs: RelationDefinition[]
	relationDefsByFieldname: {[fieldName: string]: RelationDefinition}
	newMo: () => MoInterface
	objToMoid: (any, MoInterface?) => Promise<MoidInterface>
	objToMo: (any, MoInterface?) => Promise<MoInterface>
	documentToMo: (any) => MoInterface
	init: () => void
	setName: (name?: string) => MoMetaInterface
	getDisplayName: () => string
	moToObj: (mo: MoInterface) => any
	moToDocument: (mo: MoInterface) => any
	toDocument: () => string
	moToMoid: (mo: MoInterface) => MoidInterface
	moidToMo: (moid: MoidInterface) => Promise<MoInterface>

	/*  ---------
	 *  Accessors
	 *  ---------
	 */
}
