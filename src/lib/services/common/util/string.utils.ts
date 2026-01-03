import pluralize from 'pluralize'

const toCamelCase = (str0: string): string => {
  if (!str0) return ''
  let camel = str0[0].toLowerCase()
  for (let i = 1; i < str0.length; i++) {
    const pchar = str0[i - 1]
    const char = str0[i]
    if (char.match(/[A-Za-z0-9]/)) {
      if (char.match(/[A-Z]/) || pchar.match(/![A-Z]/)) {
        camel += char
      } else {
        camel += char.toLowerCase()
      }
    }
  }
  return camel
}
export const toWords = (str0: string): string[] => {
  const words: string[] = []
  if (!str0) return words
  let word = str0[0]
  for (let i = 1; i < str0.length; i++) {
    const pchar = str0[i - 1]
    const char = str0[i]
    if (char.match(/[A-Z]/)) {
      if (pchar.match(/[^A-Z]/)) {
        words.push(word)
        word = char
      } else {
        word += char
      }
    } else {
      word += char
    }
  }
  if (word) words.push(word)
  return words
}
export const toDisplayString = (str0: string): string => {
  if (!str0) return ''
  const str1 = toWords(str0).join(' ')
  return str1[0].toUpperCase() + str1.slice(1)
}
    export const toDisplayString0 = (str0: string): string => {
  if (!str0) return ''
  let str = str0[0].toUpperCase()
  for (let i = 1; i < str0.length; i++) {
    const pchar = str0[i - 1]
    const char = str0[i]
    if (char.match(/[A-Z]/)) {
      if (pchar.match(/[^A-Z]/)) {
        str += ' ' + char
      } else {
        str += char
      }
    } else {
      str += char
    }
  }
  return str
}

const alphaRegex = new RegExp(/[A-Za-z]/)
export const alphaFromStr = (str: string): string => {
  let alpha = ''
  if (str) {
    let i = str.length
    while (i--) {
      if (alphaRegex.test(str[i])) {
        alpha = alpha + str[i]
      }
    }
  }
  return alpha
}

export const jsonToDisplayString = (json: any): string => {
  if (!json) return ''
  if (typeof json === 'string') return json
  return Object.entries(json)
    .map(([k,v]) => {
      if (typeof v === 'object') {
        return jsonToDisplayString(v)
      } else {
        return `${k}: ${v}`
      }
    })
    .join(', ')
}
export const objectReplacer = (k: any, v: any): any => {
  console.log(`==>string.utils.ts:90  k`, k)
  console.log(`==>string.utils.ts:90  v`, v)
  if (v && typeof v === 'object') {
    if (v.getDisplayName) return v.getDisplayName()
    return v.displayName || v.name || v.constructor?.name || v.toString()
  } else {
    return v
  }
}
export const objectToString = (o: any): any => {
  if (o && typeof o === 'object') {
    if (o.getDisplayName) return o.getDisplayName()
    return o.displayName || o.name || o.constructor?.name || o.toString()
  } else {
    return o
  }
}
export const singular = (str: string) => {
  if (str.endsWith('s')) return str.slice(0,str.length -1 )
  return str
}
export const plural = pluralize