import {Rezult} from '../common/message/rezult.js'
import {ErrorName} from '../common/message/errorName.js'
import type {DataSourceInterface, DeleteResult} from './DataSource.interface.js'
import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'

export class CacheDataSource<M extends MoInterface> implements DataSourceInterface<M> {
  moDef: MoDefinitionInterface
  ds: DataSourceInterface<M>
  records = new Map<string | number, M>()

  constructor(moDef: MoDefinitionInterface, ds: DataSourceInterface<M>) {
    this.moDef = moDef
    this.ds = ds
  }

  getMo = async (id: any): Promise<M> => {
    if (this.records.has(id)) {
      const record = this.records.get(id)
      if (!record) throw new Rezult(ErrorName.db_notFound)
      return record
    } else {
      const mo = await this.ds.getMo(id)
      if (mo) {
        this.records.set(id, mo)
      }
      return mo
    }
  }

  getMoid = async (id: any): Promise<MoidInterface> => {
    if (this.records.has(id)) {
      const record = this.records.get(id)
      if (!record) throw new Rezult(ErrorName.db_notFound)
      return record.toMoid()
    } else {
      return await this.ds.getMoid(id)
    }
  }

  saveMo = async (mo: M) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    return this.ds.saveMo(mo)
      .then(mo => {
        if (mo) {
          this.records.set(mo.id!, mo)
        }
        return mo
      })
  }

  updateMo = async (mo: M) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    return this.ds.updateMo(mo)
      .then(mo => {
        if (mo) {
          this.records.set(mo.id!, mo)
        }
        return mo
      })
  }

  addMo = async (mo: M) => {
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

  getMoids = async (): Promise<MoidInterface[]> => {
    return await this.ds.getMoids()
  }

  saveMos = async (givenMos: M[]): Promise<M[]> => {
    const savedMos: M[] = await this.ds.saveMos(givenMos)
    for (const mo of savedMos) {
      this.records.set(mo.id!, mo)
    }
    return savedMos
  }

  deleteMo = async (id: string | number): Promise<DeleteResult> => {
    try {
      const mo: M = await this.ds.getMo(id)
      if (!mo) return { errors: [new Rezult(ErrorName.db_notFound)] }
      await this.ds.deleteMo(id)
      this.records.delete(id)
      return {deleted: [mo]}
    } catch (error) {
      const rezult = Rezult.fromObj(error)
      return {errors: [rezult]}
    }
  }
}

