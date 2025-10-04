import {Mo} from '../managedObjects/Mo.js'
import {MoDefinition} from '../managedObjects/MoDefinition.js'
// import { newMoMetaFromMoDef } from '../managedObjects/moMetaInstances.js'
import {MoMeta} from '../managedObjects/MoMeta.js'

export class Contact extends Mo {
  firstName?: string
  lastName?: string
  phone?: string
  phone2?: string
  businessPhone?: string
  email?: string
  email2?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string

  constructor() {
    super(contactMoMeta)
  }

  hydrate = (props: Partial<Contact>) => {
    Object.assign(this, props)
  }
}

const contactMoDef = MoDefinition.fromProps({
  hasId: false,
  name: 'contacts',
  id: 'contacts',
  keyFieldnames: ['phone', 'email'],
  gridFieldnames: ['firstName', 'lastName', 'phone'],
})
contactMoDef.initFieldDefs()
let contactMoMeta
export const getContactMoMeta = () => {
  if (!contactMoMeta) contactMoMeta = new MoMeta(contactMoDef)
  return contactMoMeta
}
contactMoDef.moClass = Contact
