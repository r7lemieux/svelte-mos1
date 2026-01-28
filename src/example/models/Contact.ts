import {Mo} from '../../lib/models/managedObjects/Mo.js'
import {MoDefinition} from '../../lib/models/managedObjects/MoDefinition.js'
// import { newMoMetaFromMoDef } from '../../lib/models/managedObjects/moMetaInstances.js'
import {MoMeta} from '../../lib/models/managedObjects/MoMeta.js'
import type {MoMetaInterface} from '../../lib/models/managedObjects/MoMetaInterface.js'
import {contactData} from './contact.data.js'

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

  static moMeta: MoMetaInterface = new MoMeta(MoDefinition.fromProps({
      hasId: false,
      name: 'contacts',
      pluralName: 'contects',
      id: 'contact',
      // moClass: Contact,
      keyFieldnames: ['phone', 'email'],
      gridFieldnames: ['firstName', 'lastName', 'phone'],
    })
  )

  static {
    const moDef = Contact.moMeta.moDef
    moDef.moClass = Contact
    moDef.createFieldDefs()
    // moDef.showFieldNames = moDef.fieldDefs.values().map(fd => fd.name).filter(name => name !== 'id')
  }

  constructor() {
    super(Contact.moMeta)
  }

  hydrate = async (props: Partial<Contact>) => {
    Object.assign(this, props)
    return Promise.resolve(this)
  }
  hydrateUntrusted = async (props: Partial<Contact>) => {
    Object.assign(this, props)
    return Promise.resolve(this)
  }
  getDisplayName = () => `${this.firstName} ${this.lastName}`

}


contactData.forEach((data: any) => {
  const contact = new Contact()
  contact.hydrate(data)
  contact._moMeta.dataSource.addMo(contact)
})
