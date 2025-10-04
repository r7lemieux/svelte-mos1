import {ErrorName} from '../../services/common/message/errorName.js'
import {Rezult} from '../../services/common/message/rezult.js'

export type validator = keyof ValidationService

declare interface IValidationOptions {
  nullable?: boolean,
}

declare interface IIntValidationOptions extends IValidationOptions {
  min?: number,
  max?: number,
}

export class ValidationService {

  key = (str: any, len = 40): Rezult | null => {
    const valid = str && typeof str == 'string' && str.match(new RegExp('^[a-zA-Z][a-zA-Z_\\d]{1,' + (len - 1) + '}$'))
    if (!valid) {
      return new Rezult(ErrorName.db_invalid_key, {key: str})
    }
    return null
  }

  intRegex = new RegExp(/^[0-9]{0,10}$/)
  maxInt           = 2 ** 31 - 1

  int = (options: IIntValidationOptions = {}) => {

    const min: number = options.min || 0
    const max: number = options.max || this.maxInt

    const validateMinMax = (value: number): Rezult | null => {
      if (value < min) {
        return new Rezult(ErrorName.field_invalid_numberTooSmall, {value: value, min: min})
      }
      if (max && value > max) {
        return new Rezult(ErrorName.field_invalid_numberTooLarge, {value: value, max: max})
      }
      return null
    }

    return {
      parse: (str: string): number | null => {
        if (options.nullable && (str === undefined || str === null)) {
          return null
        }
        if (!this.intRegex.test(str)) {
          throw new Rezult(ErrorName.field_invalid_number, {str: str})
        }
        const value                = parseInt(str)
        const rezult = validateMinMax(value)
        if (rezult) {
          throw rezult
        }
        return value
      },

      validate: (value: any) => {
        if (options.nullable && (value === undefined || value === null)) {
          return null
        }
        if (!Number.isSafeInteger(value)) {
          return new Rezult(ErrorName.field_invalid_number, {value: value})
        }
        return validateMinMax(value)
      },

      validateString: (str: string) => {
        if (options.nullable && (str === undefined || str === null)) {
          return null
        }
        if (!this.intRegex.test(str)) {
          return new Rezult(ErrorName.field_invalid_number, {value: str})
        }
        const value = parseInt(str)
        return validateMinMax(value)
      },
    }
  }

  idRegex = new RegExp(/^[1-9][0-9]{0,9}$/)

  id = (options: IValidationOptions = {}) => {
    return {
      parse: (str: string): number | null => {
        if (options.nullable && (str === undefined || str === null)) {
          return null
        }
        if (!this.idRegex.test(str)) {
          throw new Rezult(ErrorName.field_invalid_number, {str: str})
        }
        const value = parseInt(str)
        if (value > this.maxInt) {
          throw new Rezult(ErrorName.field_invalid_numberTooLarge, {str: str})
        }
        return value
      },

      validate: (value: number): Rezult | null => {
        if (options.nullable && (value === undefined || value === null)) {
          return null
        }
        if (!Number.isSafeInteger(value)) {
          return new Rezult(ErrorName.field_invalid_number, {value: value})
        }
        if (value < 0) {
          return new Rezult(ErrorName.field_invalid_numberTooSmall, {value: value, min: 0})
        }
        if (value > this.maxInt) {
          return new Rezult(ErrorName.field_invalid_numberTooLarge, {value: value, max: this.maxInt})
        }
        return null
      },

      validateString: (str: string): Rezult | null => {
        if (options.nullable && (str === undefined || str === null)) {
          return null
        }
        if (!this.idRegex.test(str)) {
          return new Rezult(ErrorName.field_invalid_number, {str: str})
        }
        const value = parseInt(str)
        if (value > this.maxInt) {
          return new Rezult(ErrorName.field_invalid_numberTooLarge, {str: str})
        }
        return null
      },
    }
  }

  idValidator = this.id()

  validateEmail = (value: any): Rezult | null => {
    const re = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(value)) {
      return new Rezult(ErrorName.field_invalid_email, {value: value})
    }
    return null
  }

  email = {
    validate      : this.validateEmail,
    validateString: this.validateEmail,
    parse         : str => {
      const rezult = this.validateEmail(str)
      if (rezult) {
        return rezult
      }
      return str
    },
  }

  ok = () => { // options: IValidationOptions = {}) => {
    return {
      validate: (value: number): Rezult | null => {
        return null
      },

      validateString: (str: string): Rezult | null => {
        return null
      },
    }
  }

  buildText = (regexStr: string, minlen?: number, maxlen?: number) => {
    return {
      parse: value => value,
      validate: (value: any): Rezult | null => {
        let fullRegexStr = regexStr
        if (minlen) {
          fullRegexStr = `^${regexStr}{${minlen}${maxlen ? ',' + maxlen : ''}}$`
        }
        const regex = new RegExp(fullRegexStr)
        if (!regex.test(value)) {
          return new Rezult(ErrorName.field_invalid, {value: value})
        }
        return null
      },
    }
  }

  name = {
      parse: value => value,
      validate: (value: any): Rezult | null => {
        const regex = new RegExp(/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' \-]{2,40}$/)
        if (!regex.test(value)) {
          return new Rezult(ErrorName.field_invalid, {value: value, format:{min:2, max:40, first:'character', content:['character','space','-']}})
        }
        return null
      },
  }

  text = (minlen?: number, maxlen?: number) => {
    return this.buildText('[\\w]', minlen, maxlen)
  }

  // dbname = this.buildText('[\\w]', 3, 20)

  password = this.buildText('[\\w-_!@#$%^&*]*', 8, 20)

}

export const validationService: ValidationService = new ValidationService()
