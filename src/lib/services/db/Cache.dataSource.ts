import {DbService} from  './db.service.js'
import type {Mo} from '../../models/managedObjects/Mo.js'
import type {MoDefinition} from '../../models/managedObjects/MoDefinition.js'
import {Rezult} from  '../common/message/rezult.js'
import {ErrorName} from  '../common/message/errorName.js'
import type {DataSourceInterface} from './DataSource.interface.js'
import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'



export class CacheDataSource<M extends MoInterface> implements DataSourceInterface<M> {
  moDef: MoDefinitionInterface
  ds: DataSourceInterface<M>
  records = new Map<string | number, M>()

  constructor(moDef: MoDefinitionInterface, ds: DataSourceInterface<M>) {
    this.moDef = moDef
    this.ds = ds
  }

  getMo = async (id: any): Promise<M | undefined> => {
    if (this.records.has(id)) {
      return this.records.get(id)
    } else {
      const mo = await this.ds.getMo(id)
      if (mo) {
        this.records.set(id, mo)
      }
      return mo
    }
  }
  saveMo = async (mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    return this.ds.saveMo(mo)
      .then(mo => {
        if (mo) {
          this.records.set(mo.id!, mo)
        }
        return mo
      })
  }

  updateMo = async (mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    return this.ds.updateMo(mo)
      .then(mo => {
        if (mo) {
          this.records.set(mo.id!, mo)
        }
        return mo
      })
  }

  addMo = async (mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    return this.ds.addMo(mo)
      .then(mo => {
        if (mo) {
          this.records.set(mo.id!, mo)
        }
        return mo
      })
  }

  getMos = async (): Promise<M[]> => {
    const mos: M[] = await this.ds.getMos()
    if (mos) {
      for (const mo of mos) {
        this.records.set(mo.id!, mo)
      }
    }
    return mos
  }

  saveMos = async (givenMos: M[]): Promise<M[]> => {
    const savedMos: M[] = await this.ds.saveMos(givenMos)
    for (const mo of savedMos) {
      this.records.set(mo.id!, mo)
    }
    return savedMos
  }

  deleteMo = async (id) => {
    await this.ds.deleteMo(id)
    this.records.delete(id)
  }
}

