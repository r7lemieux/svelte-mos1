import type { MoViewMode } from '../../../constants/ui.js';
export declare const computeHeight: () => number;
export type InputTypes = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';
export declare const sizeLabels: () => void;
export declare const setHeightToParent: (selector: any) => void;
export declare function extractViewMode(page: any): MoViewMode;
export declare const getDocumentHeight: () => number;
