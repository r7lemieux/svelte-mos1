import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { Mo } from '../../../models/managedObjects/Mo.js';
import { type MoMetaInterface } from '../../../models/managedObjects/MoMetaInterface.js';
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const Mos: $$__sveltets_2_IsomorphicComponent<{
    mos?: Mo[];
    moMeta: MoMetaInterface;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type Mos = InstanceType<typeof Mos>;
export default Mos;
