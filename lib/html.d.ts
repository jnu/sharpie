import { Annotation } from "./annotation";
export interface RenderOpts {
    autoParagraph?: boolean;
}
export declare function renderToString(text: string, annotations: Annotation[], opts?: RenderOpts): string;
export declare function render(container: HTMLElement, text: string, annotations: Annotation[]): void;
