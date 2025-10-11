import type {MoInterface} from '../../models/managedObjects/MoInterface.js'
import type {MoDefinitionInterface} from '../../models/managedObjects/MoDefinitionInterface.js'
import {Rezult} from '../common/message/rezult.js'
import {ErrorName} from '../common/message/errorName.js'
import type {DataSourceInterface} from './DataSource.interface.js'


export class HeapDataSource<M extends MoInterface> implements DataSourceInterface<M> {
  moDef: MoDefinitionInterface
  records: {[key:string]: M} = {}
  keyname = 'id'

  constructor(moDef: MoDefinitionInterface) {
    this.moDef = moDef
  }

  getMo = async (key: any): Promise<M> => {
      return this.records[key]
  }
  saveMo = async (mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    this.records[mo[this.keyname!]] = mo
    return mo
  }

  updateMo = async (mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    this.records[mo[this.keyname!]] = mo
    return mo
  }

  addMo = async (mo) => {
    if (!mo) throw new Rezult(ErrorName.missing_param)
    this.records[mo[this.keyname!]] = mo
    return mo
  }

  getMos = async (): Promise<M[]> => {
    return Object.values(this.records)
  }

  saveMos = async (givenMos: M[]): Promise<M[]> => {
    for (const mo of givenMos) {
      this.records[mo[this.keyname!]] = mo
    }
    return givenMos
  }

  deleteMo = async (id) => {
    delete this.records[id]
  }
}

