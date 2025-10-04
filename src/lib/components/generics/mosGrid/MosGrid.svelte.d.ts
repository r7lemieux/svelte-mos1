import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { MoListModel } from '../../../models/managedObjects/MoList.model.js';
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
declare const MosGrid: $$__sveltets_2_IsomorphicComponent<{
    height?: string;
    gridId?: string;
    model?: MoListModel | null;
    modelReady?: (listModel: MoListModel) => boolean;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {
    modelReady: (listModel: MoListModel) => boolean;
}, string>;
type MosGrid = InstanceType<typeof MosGrid>;
export default MosGrid;
