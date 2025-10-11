import type { MoInterface } from './MoInterface.js'
import type { DataSourceInterface } from '../../services/db/DataSource.interface.js'
import type { MoDefinitionInterface } from './MoDefinitionInterface.js'

export interface MoMetaInterface {
	name: string
	dbName: string
	moDef: MoDefinitionInterface
	dataSource: DataSourceInterface<MoInterface>
	newMo: () => MoInterface
	objToMo: (any) => MoInterface
	documentToMo: (any) => MoInterface
	init: () => void
	setName: (name?: string) => void
	getDisplayName: () => string
	moToObj: (mo: MoInterface) => any
	moToDocument: (mo: MoInterface) => any
	toDocument: () => string

	/*  ---------
	 *  Accessors
	 *  ---------
	 */
}
