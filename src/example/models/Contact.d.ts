import { Mo } from '../managedObjects/Mo.js';
export declare class Contact extends Mo {
    firstName?: string;
    lastName?: string;
    phone?: string;
    phone2?: string;
    businessPhone?: string;
    email?: string;
    email2?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    constructor();
    hydrate: (props: Partial<Contact>) => void;
}
export declare const getContactMoMeta: () => any;
