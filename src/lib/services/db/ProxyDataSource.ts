import {DbService} from  './db.service.js'
import type {Mo} from '../../models/managedObjects/Mo.js'
import type {DataSourceInterface} from './DataSource.interface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'

export class ProxyDataSource<M extends MoInterface> implements DataSourceInterface<M> {
  next: DataSourceInterface<M>
  target: any

  constructor(next, target) {
    this.next = next
    this.target = target
  }

  getMo = async (id: any): Promise<M | undefined> => {
    return this.next.getMo(id)
  }
  saveMo = async (mo) => {
    return this.next.saveMo(mo)
  }

  updateMo = async (mo) => {
    return this.next.updateMo(mo)
  }

  addMo = async (mo) => {
    return this.next.addMo(mo)
  }

  getMos = async (): Promise<M[]> => {
    return this.next.getMos()
  }

  saveMos = async (givenMos: M[]): Promise<M[]> => {
    return this.next.saveMos(givenMos)
  }
  deleteMo = async (id) => {
    return this.next.deleteMo(id)
  }
}

