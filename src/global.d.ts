/// <reference types="@solidjs/start/env" />

declare module 'dom-to-pptx' {
    export function exportToPptx(
        element: HTMLElement, 
        options?: {
            filename?: string;
            slideSize?: string;
            exclude?: string[];
        }
    ): Promise<void>;
    
    // In case the default export is used in some versions:
    const defaultExport: (
        element: HTMLElement, 
        options?: {
            filename?: string;
            slideSize?: string;
            exclude?: string[];
        }
    ) => Promise<void>;
    export default defaultExport;
}
