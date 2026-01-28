import type {MoidInterface} from '../../../models/managedObjects/MoidInterface.js'
import type {MoInterface} from '../../../models/managedObjects/MoInterface.js'
import {ErrorName} from '../message/errorName.js'
import {Rezult} from '../message/rezult.js'

export const bindFunctions = (obj: any, props: any =obj) => {
  for (const prop of Object.values(props)) {
    if (typeof(prop) == 'function') {
      prop.bind(obj)
    }
  }
}


export const copyOwnProperties = (source, target, topTarget = target) => {
    const doCopyOwnProperties = (source, target, topTarget = target, count) => {
        count++
        if (count > 5) {
            console.trace(count)
            throw new Rezult(ErrorName.recursive_loop, {count}, 'copyOwnProperties')
        }
        const sourcePropNames = Object.getOwnPropertyNames(source)
        for (let n = 0; n < sourcePropNames.length; n++) {
            const propname = sourcePropNames[n]
            const value = source[propname]
            if (typeof value === 'object' && value.constructor.name !== 'RegExp' && !propname.startsWith('_')) {
                target[propname] = Object.create(source[propname])
                copyOwnProperties(source[propname], target[propname], topTarget)
            } else {
                target[propname] = source[propname]
            }
        }
        bindFunctions(topTarget, target)
    }
    let count = 1
}

export const isSubclass = (subClass: any, superClass: any): boolean => {
  // Check if SuperClass.prototype is present in the prototype chain of SubClass.prototype
  if (superClass == subClass) return true
  return superClass.prototype.isPrototypeOf(subClass.prototype);
}



