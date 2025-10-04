// =====
// Types
// =====
export type AnyMap = {[key: string]: unknown}
export type StrMap = {[key: string]: string}
export type StsMap = {[key: string]: string | string[] }
export type ChoMap = {[key: string]: {[key:string]: string}}

// ====
// Maps
// ====
export const buildDbKeys = (validMap: AnyMap): string[] => Object.keys(validMap).map(key => key[0])

export const buildDbKeyMap = (validMap: AnyMap): StrMap => {
  const keyMap: StrMap = {}
  for (const key of Object.keys(validMap)) {
    const k = key[0]
    keyMap[k] = key
  }
  return keyMap
}

// =================
// Map of Primitives
// =================
export const primitivesToDb = (values: AnyMap): AnyMap => {
  const dbValues: AnyMap = {}
  for (const [key, val] of Object.entries(values)) {
    dbValues[key[0]] = (val !== undefined) ? val : null
  }
  return dbValues
}

export const dbToPrimitiveMap = (dbValues: AnyMap, keyMap: StrMap): AnyMap => {
  const values: AnyMap = {}
  for (const [k, val] of Object.entries(dbValues)) {
    const key = keyMap[k]
    values[key] = val
  }
  return values
}

export const dbToPrimitiveMapWithDefaults = (dbChoices: AnyMap, defaultValues: AnyMap): AnyMap => {
  const keyMap = buildDbKeyMap(defaultValues)
  return dbToPrimitiveMap(dbChoices, keyMap)
}

// ==============
// Map of Choices
// ==============

export const buildDbChoiceMaps = (validChoices: StsMap): ChoMap => {
  const valueMaps: ChoMap = {}
  for (const [key, choices] of Object.entries(validChoices)) {
    const k = key[0]
    valueMaps[k] = {}
    if (typeof choices === 'string') {
      valueMaps[k][choices.toString()[0]] = choices
    } else {
      for (const choice of choices) {
        valueMaps[k][choice.toString()[0]] = choice
      }
    }
  }
  return valueMaps
}

export const choicesToDb = (choices: StsMap|StsMap): string => Object
  .entries(choices)
  .map(([key, val]) => (val?.toString()[0] !== undefined)? key[0] + val.toString()[0] : '')
  .join('')

export const dbToChoices = (dbChoices: string, keyMap: StrMap, choiceMaps: ChoMap): StsMap => {
  const choices: StsMap = {}
  for (let i=0; i<dbChoices.length; i += 2) {
    const k = dbChoices[i]
    const v = dbChoices[i+1]
    const key = keyMap[k]
    const val = choiceMaps[k][v]
    choices[key] = val
  }
  return choices
}

export const dbToChoicesWithValidChoices = (dbChoices: string, validChoices: StsMap): StsMap => {
  const keyMap: StrMap = buildDbKeyMap(validChoices)
  const valueMaps: ChoMap = buildDbChoiceMaps(validChoices)
  return dbToChoices(dbChoices, keyMap, valueMaps)
}

