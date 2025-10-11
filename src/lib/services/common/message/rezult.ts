import {ErrorName, type ErrorEnum} from './errorName.js'
import { jsonToDisplayString } from '../util/string.utils.js'

export type RezultStatus = 'message' | 'error'

export class Rezult extends Error {

  status: RezultStatus = 'error'
  data: any
  context: string | undefined
  static mode: 'test' | 'app' = 'test'


  constructor( errorName:ErrorEnum = ErrorName.ok, data?:any, context?:string) {
    super()
    this.setName(errorName)
    this.data = data
    this.context = context
    // if (errorName != ErrorName.ok)
    //   console.trace(`==>rezult.ts:19 `, this.toString())
  }

  setName = (errorName: ErrorEnum) => {
    this.name = ErrorName[errorName]
  }

  toObj = () => {
    const obj:any = {
      name: this.name,
      status: this.status,
    }
    if (this.context) obj.context = this.context
    if (this.data) obj.data = this.data
    return obj
  }

  serialize = () => JSON.stringify(this.toObj())
  toString = () => this.toDisplayString()

  toDisplayString = () => {
    let data = this.data
    try {
      data = JSON.stringify(this.data)}
    catch (err) {
      try {
        data = this.stringifyOneLevel(this.data)
      }
      catch(err) {
        try {
          data = this.data.toString()
        } catch (err) {
          data = this.data
        }
      }
    }

    return `${this.status} ${this.context || ''} ${this.name} ${this.message} ${data?JSON.stringify(data):''}`
  }

  toDetailString = () => jsonToDisplayString({
    status: this.status, data: this.data, context: this.context
  })

  stringifyOneLevel = obj => JSON.stringify(obj, function (k, v) { return k && v && typeof v !== "number" ? (Array.isArray(v) ? "[object Array]" : "" + v) : v; });

  print = (str: string) => {
    this.context = str
    // if (!process.env.testing) {
    //   console.log(this.toString())
    // }
  }

  static build = (err, data?:any, context?:any): Rezult => {
    if (err && err instanceof Rezult) return err
    const rezult = new Rezult(ErrorName.type5_error)
    console.trace(`==>rezult.ts:78 rezult`, rezult)
    if (data) rezult.data = data
    if (context) rezult.context = context
    if (err && err.message) {
      rezult.data = {...rezult.data, err: err.message}
      // {message: err.message}
    }
    return rezult
  }
}

export const OK = new Rezult(ErrorName.ok)
