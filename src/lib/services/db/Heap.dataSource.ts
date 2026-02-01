import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'
import {Rezult} from '../common/message/rezult.js'
import {ErrorName} from '../common/message/errorName.js'
import type {DataSourceInterface, DeleteMoParams, DeleteResult, SaveMoParams} from './DataSource.interface.js'
import {type MoFieldDefinition} from '../../models/fields/MoFieldDefinition.js'
import type {ID, MoidInterface} from '../../models/managedObjects/MoidInterface.js'
import {RelationMetas} from '../../models/managedObjects/RelationMeta.js'
import {DeleteCascade} from '../../models/managedObjects/RelationDefinitionInterface.js'


export class HeapDataSource<M extends MoInterface> implements DataSourceInterface<M> {
    moDef: MoDefinitionInterface
    records: {
        [key: string]: M
    } = {}
    keyname = 'id'

    nextId: number = 0

    constructor(moDef: MoDefinitionInterface) {
        this.moDef = moDef
        this.nextId = 1
    }

    getMo = async (key: any): Promise<M> => {
        return this.records[key].cloneMo() as M
    }

    getMoid = async (key: any): Promise<MoidInterface> => {
        return this.records[key]?.toMoid().cloneMo()
    }

    removeReferenceFromArrayRelation(mos: MoidInterface[], removedMo: MoidInterface | null): MoidInterface[] {
        if (removedMo) {
            const removeIndex = mos.findIndex(m => m.id === removedMo.id)
            if (removeIndex > -1) {
                delete mos[removeIndex]
            }
        }
        return mos
    }

    addReferenceToArrayRelation(mos: MoidInterface[], addedMo: MoidInterface | null): MoidInterface[] {
        if (addedMo) {
            const existingIndex = mos.findIndex(m => m.id === addedMo.id)
            if (existingIndex !== -1) {
                mos[existingIndex] = addedMo
            } else {
                mos.push(addedMo)
            }
        }
        return mos
    }

    findRemovedMos(oldMos: MoidInterface[] | null, newMos: MoidInterface[] | null): MoidInterface[] {
        oldMos = oldMos || []
        newMos = newMos || []
        return oldMos.filter(oldMo => !newMos.find(newMo => newMo.isSameAs(oldMo)))
    }

    findAddedMos(oldMos: MoidInterface[] | null, newMos: MoidInterface[] | null): MoidInterface[] {
        oldMos = oldMos || []
        newMos = newMos || []
        return newMos.filter(newMo => !oldMos.find(oldMo => newMo.isSameAs(oldMo)))
    }

    saveMo = async (mo: M, params?: SaveMoParams) => {
        // console.log(`==>Heap.dataSource.ts:saveMo mo.id`, mo.id, this.nextId)
        if (!mo) throw new Rezult(ErrorName.missing_param)
        const oldMo1 = this.records[mo.id]
        const newMo1 = mo
        const newMoid1 = mo.toMoid()
        const moMeta1 = newMo1._moMeta
        const moname1 = moMeta1.name
        if (!params?.skipRelations) {
            const relations = RelationMetas[moname1]
            // console.log(`==>Heap.dataSource.js:32  relations`, relations)
            const twoWaysRelations = Object.values(relations).filter(rel => !!rel.reverse)

            for (const relation of twoWaysRelations) {
                const relationDef = relation.relationDef
                const fieldDef1 = relationDef.fieldDef1
                const fieldDef2 = relationDef.fieldDef2!
                const fieldname1 = fieldDef1.name
                const fieldname2 = fieldDef2!.name

                if (relationDef.max1 === 1) {
                    const oldMo2id: ID = oldMo1[fieldname1].id
                    const newMo2id: ID = newMo1[fieldname1].id
                    if (!newMo2id && relationDef.min1 > 0 && relationDef.min2 === 0) {
                        //todo handle creation of min1:min1 or min1:min-n
                        throw new Rezult(ErrorName.missing_value, {moDef: this.moDef?.name, id: mo.id, displayName: mo.displayName, fieldname1}, 'HeapDataSource.saveMo missing value for relation min')
                    }
                    if (newMo2id) {
                        const oldMo2 = await relation.moMeta2.dataSource.getMo(oldMo2id)
                        const newMo2 = await relation.moMeta2.dataSource.getMo(newMo2id)
                        if (!oldMo2 && !params?.datafill) throw new Rezult(ErrorName.missing_reverse_mo, {moDef: this.moDef?.name, oldMo2id, fieldname1, newMo2id, fieldname2}, 'HeapDataSource.saveMo missing oldMo2')
                        if (!newMo2 && !params?.datafill) throw new Rezult(ErrorName.missing_reverse_mo, {moDef: this.moDef?.name, oldMo2id, fieldname1, newMo2id, fieldname2}, 'HeapDataSource.saveMo missing newMo2')
                        if (relationDef.max2 === 1) {
                            if (oldMo2id === newMo2id) continue // No change to this relation to record
                            oldMo2[fieldname2] = undefined
                            newMo2[fieldname2] = newMoid1
                        } else {
                            const oldMos2: MoidInterface[] = oldMo2[fieldname2]
                            const newMos2: MoidInterface[] = newMo2[fieldname2]
                            if (oldMo2) {
                                this.removeReferenceFromArrayRelation(oldMos2, oldMo1)
                            }
                            if (newMo2) {
                                this.addReferenceToArrayRelation(newMos2, newMoid1)
                            }
                            if (!newMo2 && !params?.datafill) throw new Rezult(ErrorName.missing_reverse_mo, {moDef: this.moDef?.name, oldMo2id, fieldname1, newMo2id, fieldname2}, 'HeapDataSource.saveMo missing newMo2')
                        }
                        oldMo2?._moMeta.dataSource.saveMo(oldMo2)
                        newMo2?._moMeta.dataSource.saveMo(newMo2)
                    }
                } else {
                    const oldMos2: MoidInterface[] = oldMo1[fieldname2]
                    const newMos2: MoidInterface[] = newMo1[fieldname2]
                    const delMoid2s = this.findRemovedMos(oldMos2, newMos2)
                    const addMoid2s = this.findAddedMos(oldMos2, newMos2)
                    if (relationDef.max2 === 1) {
                        for (const delMoid2 of delMoid2s) {
                            const delMo2 = await relation.moMeta2.dataSource.getMo(delMoid2)
                            delMo2[fieldname2] = undefined
                            await delMo2._moMeta.dataSource.saveMo(delMo2)
                        }
                        for (const addMoid2 of addMoid2s) {
                            const addMo2 = await relation.moMeta2.dataSource.getMo(addMoid2)
                            addMo2[fieldname2] = newMoid1
                            await addMo2._moMeta.dataSource.saveMo(addMo2)

                        }
                    } else {
                        for (const delMoid2 of delMoid2s) {
                            const delMo2 = await relation.moMeta2.dataSource.getMo(delMoid2)
                            this.removeReferenceFromArrayRelation(delMo2[fieldname2], newMoid1)
                            await delMo2._moMeta.dataSource.saveMo(delMo2)

                        }
                        for (const addMoid2 of addMoid2s) {
                            const addMo2 = await relation.moMeta2.dataSource.getMo(addMoid2)
                            this.removeReferenceFromArrayRelation(addMo2[fieldname2], newMoid1)
                            await addMo2._moMeta.dataSource.saveMo(addMo2)
                        }

                    }
                }
            }
        }
        this.records[newMo1[this.keyname!]] = newMo1
        return Promise.resolve(this.records[mo[this.keyname!]])
    }

    updateMo = async (mo: M) => {
        return this.saveMo(mo)
    }

    addMo = async (mo: M) => {
        if (!mo) throw new Rezult(ErrorName.missing_param)
        mo[this.keyname] = this.nextId
        this.nextId = this.nextId + 1
        this.records[mo[this.keyname]] = mo
        return mo
    }

    getMos = async (): Promise<M[]> => {
        return Object.values(this.records)
    }

    getMoids = async (): Promise<MoidInterface[]> => {
        return Object.values(this.records).map(mo => mo.toMoid())
    }

    saveMos = async (givenMos: M[]): Promise<M[]> => {
        for (const mo of givenMos) {
            this.records[mo[this.keyname!]] = mo
        }
        return givenMos
    }

    deleteMo = async (id: number | string, params: DeleteMoParams = {pendingDeletes: [], pendingUpdates: []}): Promise<DeleteResult> => {
        const mo: M = this.records[id]
        const moStr = mo.toShortStr()
        if (params.pendingDeletes.includes(moStr)) return Promise.resolve({})
        params.pendingDeletes.push(mo.toShortStr())

        const moFieldDefs = this.moDef.getFieldDefs({type: 'mo'}) as MoFieldDefinition[]
        const moArrayFieldDefs = this.moDef.getFieldDefs({type: 'moArray'}) as MoFieldDefinition[]

        // no Delete
        const noDeleteMoFields = moFieldDefs.filter(fd => fd.relation.deleteCascade1 === DeleteCascade.noDelete && !!mo[fd.name])
        const noDeleteMoArrayFields = moArrayFieldDefs.filter(fd => fd.relation.deleteCascade1 === DeleteCascade.noDelete && !!mo[fd.name])
        const noDeleteMos = {}
        for (const fd of noDeleteMoFields) noDeleteMos[fd.name] = (mo[fd.name] as MoidInterface).toMoid()
        for (const fd of noDeleteMoArrayFields) noDeleteMos[fd.name] = (mo[fd.name].map((dmf: MoidInterface) => dmf.toMoid()))
        if (Object.keys(noDeleteMos).length > 0) {
            throw new Rezult(ErrorName.parent_instance_delete_not_allowed, {mo: this.moDef.name, id, noDeleteMos})
        }

        // Cascade
        const cascadeMoFields = moFieldDefs.filter(fd => fd.relation.deleteCascade1 === DeleteCascade.cascade && !!mo[fd.name])
        const cascadeMoArrayFields = moArrayFieldDefs.filter(fd => fd.relation.deleteCascade1 === DeleteCascade.cascade && !!mo[fd.name])
        let depMoToDelete: MoidInterface[] = []
        for (const fd of cascadeMoFields) depMoToDelete.push((mo[fd.name] as MoidInterface).toMoid())
        for (const fd of cascadeMoArrayFields) depMoToDelete.push(...(mo[fd.name].map((dmf: MoidInterface) => dmf.toMoid())))
        depMoToDelete = depMoToDelete.filter(m => !params.pendingDeletes.includes(m.toShortStr()))
        depMoToDelete.forEach(m => params.pendingDeletes.push(m.toShortStr()))

        const results: DeleteResult = {deleted: [], errors: []}
        return Promise.allSettled(depMoToDelete.map(dmo => dmo._moMeta.dataSource.deleteMo(dmo.id, params)))
            .then(settled => {
                for (let i = 0; i < depMoToDelete.length; i++) {
                    const res = settled[i]
                    const dmo: MoidInterface = depMoToDelete[i]
                    if (res.status === 'fulfilled') {
                        results.deleted?.push(dmo.toMoid().toObj())
                    } else {
                        const rezult = (res.reason.context) ? res.reason : new Rezult(ErrorName.server_error)
                        rezult.data = rezult.data || {}
                        rezult.data.moname = dmo._moMeta.name
                        rezult.data.id = dmo.id
                        rezult.data.displayName = dmo.getDisplayName()
                        results.errors?.push(rezult)
                    }
                }
                return results
            })
            .then((results) => {
                results.deleted?.push(mo.toMoid().toObj())
                delete this.records[id]
                // const rezultName = results.errors? ErrorName.db_error : ErrorName.ok
                // const rezult = new Rezult(rezultName, results)
                return results
            })
            .then( async (results: DeleteResult) => {
                const twoWayRelations = Object.values(mo._moMeta.relations).filter(rel => rel.relationDef.fieldDef2)
                //const depMoToUpdate: Promise<MoInterface>[] = twoWayRelations.map(rel => mo[rel.relationDef.fieldDef1.name])
                const depMoToUpdate: Promise<MoInterface>[] = twoWayRelations.map(rel => {
                    const relDef = rel.relationDef
                    let mosToUpdate: MoidInterface[] = (relDef.max1 > 1) ? mo[relDef.fieldDef1.name] : [mo[relDef.fieldDef1.name]]
                    mosToUpdate = mosToUpdate.filter(m => !params.pendingUpdates.includes(m.toShortStr() + '_' + moStr))
                    mosToUpdate.forEach(m => {
                        params.pendingUpdates.push(moStr + '_' + m.toShortStr())
                        params.pendingUpdates.push(m.toShortStr() + '_' + moStr)
                    })
                    return mosToUpdate.map( async(m) => {
                        return rel.moMeta2.dataSource.getMo(m.id)
                            .then(async(mo2: MoInterface): Promise<MoInterface> => {
                                const fieldname2 = relDef.fieldDef2!.name
                                if (relDef.max2 > 1) {
                                    const field2Value: MoidInterface[] = mo2[fieldname2]
                                    const index = field2Value.findIndex(m => m.id === mo2.id)
                                    field2Value.splice(index, 1)
                                } else {
                                    mo2[fieldname2] = undefined
                                }
                                return rel.moMeta2.dataSource.saveMo(mo2, {pending: params.pendingUpdates})
                            })
                    })
                }).flat(3)
                return Promise.allSettled(depMoToUpdate)
                    .then(settled => {
                        for (let i = 0; i < settled.length; i++) {
                            const res = settled[i]
                            if (res.status === 'fulfilled') {
                                results.updated?.push(res.value.toMoid().toObj())
                            } else {
                                const rezult = (res.reason.context) ? res.reason : new Rezult(ErrorName.server_error, {
                                    moname: mo._moMeta.name,
                                    id: mo.id,
                                    displayName: mo.getDisplayName(),
                                    reason: res.reason.toString(),
                                    message: res.reason.message,
                                }, 'delete update dependent ' + res.reason.context)
                                results.errors?.push(rezult)
                            }
                        }
                        return results
                    })
            })
    }
}

