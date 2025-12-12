import {ErrorName, type ErrorEnum} from './errorName.js'
import { jsonToDisplayString } from '../util/string.utils.js'
import {RezultStatus, type RezultStatusEnum} from './RezultStatus.js'

export class Rezult extends Error {

  status: RezultStatusEnum = RezultStatus.error
  data: any
  context: string | undefined
  static mode: 'test' | 'app' = 'test'


  constructor( errorName:ErrorEnum = ErrorName.ok, data?:any, context?:string) {
    super(Rezult.toMessage(errorName, data))
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

  static toMessage = (name, data) => {
    let dataStr: string = this.dataToString(data)
    if (data == undefined) {
      dataStr = ''
    } else {
    try {
      dataStr = JSON.stringify(data)}
    catch (err) {
      try {
        dataStr = Rezult.stringifyOneLevel(data)
      }
      catch(err) {
        try {
          dataStr = data.toString()
        } catch (err) {
          dataStr = ' not printable data '
        }
      }
    }
    }

    return `${this.name} ${dataStr}`
  }

  static dataToString = (data:any): string => {
    let dataStr: string
    if (data == undefined) {
      return ''
    } else {
      try {
        return JSON.stringify(data)}
      catch (err) {
        try {
          return Rezult.stringifyOneLevel(data)
        }
        catch(err) {
          try {
            return data.toString()
          } catch (err) {
            return ' not printable data '
          }
        }
      }
    }
  }



  toDisplayString = () => {
    let str = Rezult.dataToString(this.data)
    const dataStr = (str !== undefined)? ': '+str : ''

    return `${this.status} ${this.context || ''}: ${this.name} ${this.message} ${dataStr}}`
  }

  toDetailString = () => {
    const fields: any = {
      status: this.status, data: this.data
    }
    if (this.context) fields['context'] = this.context
    return jsonToDisplayString(fields)
  }

  static stringifyOneLevel = obj => JSON.stringify(obj, function (k, v) { return k && v && typeof v !== "number" ? (Array.isArray(v) ? "[object Array]" : "" + v) : v; });

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
