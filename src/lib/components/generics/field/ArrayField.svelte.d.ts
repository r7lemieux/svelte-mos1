import type { MoViewMode } from '../../../constants/ui.js';
import type { FieldDefinition } from '../../../models/fields/FieldDefinition.js';
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
declare const ArrayField: $$__sveltets_2_IsomorphicComponent<{
    fieldDef: FieldDefinition<any>;
    value: any;
    viewMode: MoViewMode;
    onChange: any;
    level?: number;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type ArrayField = InstanceType<typeof ArrayField>;
export default ArrayField;
