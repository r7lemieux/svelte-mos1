declare const MapField: import("svelte").Component<{
    fieldDef: any;
    value: any;
    level?: number;
    onChange: any;
    viewMode?: string;
}, {}, "">;
type MapField = ReturnType<typeof MapField>;
export default MapField;
