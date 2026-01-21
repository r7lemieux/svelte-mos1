// import { moMetaMoMeta } from '../../lib/models/managedObjects/MoMetaMo.js'
// import { moDefMoMeta } from '../../lib/models/managedObjects/MoDefinitionMo.js'
import { registerMoMeta } from '../../lib/services/mo/moManagement.js'
import {Contact} from '../models/Contact.js'
import {registerMoDef} from '../../lib/services/mo/moDefManagement.js'

// import { qqsp1 } from 'svelte-mos'
// import
// {getContactMoMeta} from '$lib/models/common/Contact.js'

let mosRegistered = false
export const registerMos = () => {
  if (!mosRegistered) {
    registerMoMeta(Contact.moMeta)
    // registerMoMeta(moMetaMoMeta)
    // registerMoMeta(moDefMoMeta)
    registerMoDef(Contact.moMeta.moDef)
    // registerMoDef(moMetaMoMeta.moDef)
    // registerMoDef(moDefMoMeta.moDef)
    mosRegistered = true
  }
}
let mosDefsRegistered = false
