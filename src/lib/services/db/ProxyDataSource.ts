import type {DataSourceInterface, DeleteMoParams, DeleteResult} from './DataSource.interface.js'
import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {MoidInterface} from '../../models/managedObjects/MoidInterface.js'

export class ProxyDataSource<M extends MoInterface> implements DataSourceInterface<MoInterface> {
  next: DataSourceInterface<M>
  target: any

  constructor(next, target) {
    this.next = next
    this.target = target
  }

  getMo = async (id: any): Promise<M> => {
    return this.next.getMo(id)
  }
  getMoid = async (id: any): Promise<MoidInterface> => {
    return this.next.getMoid(id)
  }
  saveMo = async (mo: MoInterface) => {
    return this.next.saveMo(mo as M)
  }

  updateMo = async (mo: MoInterface) => {
    return this.next.updateMo(mo as M)  }

  addMo = async (mo: MoInterface) => {
    return this.next.addMo(mo as M)  }

  getMos = async (): Promise<M[]> => {
    return this.next.getMos()
  }

  getMoids = async (): Promise<MoidInterface[]> => {
    return this.next.getMoids()
  }

  saveMos = async (givenMos: MoInterface[]): Promise<M[]> => {
    return this.next.saveMos(givenMos as M[]) as Promise<M[]>
  }

  deleteMo = async (id: number | string, params?: DeleteMoParams): Promise<DeleteResult> => {
    return this.next.deleteMo(id, params)
  }
}

