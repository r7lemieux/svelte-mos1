import {DbService} from  './db.service.js'
import type {Mo} from '../../models/managedObjects/Mo.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'

import type {MoDefinition} from '../../models/managedObjects/MoDefinition.js'
import {Rezult} from  '../common/message/rezult.js'
import {ErrorName} from  '../common/message/errorName.js'
import type {DataSourceInterface} from './DataSource.interface.js'

export class NoDataSource<M extends MoInterface> implements DataSourceInterface<M> {
  moDef: MoDefinitionInterface
  records = new Map<string | number, M>()
  db: DbService = new DbService()

  constructor(moDef: MoDefinitionInterface) {
    this.moDef = moDef
  }

    // getMo = async (key: any): Promise<M | undefined> => {
    getMo = async (id: any): Promise<M | undefined> => {
    return Promise.reject(new Rezult(ErrorName.not_implemented_in_default))
    if (this.records.has(id)) {
      return this.records.get(id)
    } else {
      const mo = await this.db.getMo(this.moDef.dbName, id) as M
      if (mo) {
        this.records.set(id, mo)
      }
      return mo
    }
  }
  saveMo = async (mo:M): Promise<M> => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    return (this.db.saveMo(mo) as Promise<M>)
      .then((mo: M)=> {
        if (mo) {
          this.records.set(mo.id!, mo)
        }
        return mo
      })
  }

  updateMo = async (mo: M):Promise<M> => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    return (this.db.updateMo(mo) as Promise<M>)
      .then(mo => {
        if (mo) {
          this.records.set(mo.id!, mo)
        }
        return mo
      })
  }

  addMo = async (mo: M): Promise<M> => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    return (this.db.addMo(mo) as Promise<M>)
      .then(mo => {
        if (mo) {
          this.records.set(mo.id!, mo)
        }
        return mo
      })
  }

  getMos = async (): Promise<M[]> => {
    const mos: M[] = await this.db.getMos(this.moDef.dbName) as M[]
    if (mos) {
      for (const mo of mos) {
        this.records.set(mo.id!, mo)
      }
    }
    return mos
  }

  saveMos = async (givenMos: Mo[]): Promise<M[]> => {
    const savedMos: M[] = await this.db.saveMos(givenMos) as M[]
    for (const mo of savedMos) {
      this.records.set(mo.id!, mo)
    }
    return savedMos
  }

  deleteMo = async (id) => {
    await this.db.deleteMo(id)
    this.records.delete(id)
  }
}

