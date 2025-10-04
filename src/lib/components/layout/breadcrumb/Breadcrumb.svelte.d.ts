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
declare const Breadcrumb: $$__sveltets_2_IsomorphicComponent<{
    nodes?: {
        id: any;
        name: string;
    }[];
    nodeSelected: (id: number) => Promise<boolean>;
    addChild?: (id: number, name: string, replace?: boolean) => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {
    addChild: (id: number, name: string, replace?: boolean) => void;
}, string>;
type Breadcrumb = InstanceType<typeof Breadcrumb>;
export default Breadcrumb;
