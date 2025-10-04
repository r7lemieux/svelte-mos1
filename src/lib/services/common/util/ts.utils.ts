
export const bindFunctions = (obj, props=obj) => {
  for (const prop of Object.values(props)) {
    if (typeof(prop) == 'function') {
      prop.bind(obj)
    }
  }
}

export const copyOwnProperties = (source, target, topTarget=target) => {
  const sourcePropNames = Object.getOwnPropertyNames(source)
  for (let n=0; n < sourcePropNames.length; n++) {
    const propname = sourcePropNames[n]
    const value = source[propname]
    if (typeof value === 'object' && value.constructor.name !== 'RegExp') {
      target[propname] = Object.create(source[propname])
      copyOwnProperties(source[propname], target[propname], topTarget)
    } else {
      target[propname] = source[propname]
    }
  }
  bindFunctions(topTarget, target)
}