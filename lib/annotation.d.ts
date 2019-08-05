export interface Extent {
    start: number;
    end: number;
}
export interface MetaAttributes {
    id?: string;
    htmlTagName?: string;
    htmlClassName?: string;
}
export interface StyleAttributes {
    font?: string;
    fontSize?: string;
    color?: string;
    bgColor?: string;
    opacity?: number;
}
export interface Attributed {
    format?: StyleAttributes;
    meta?: MetaAttributes;
}
export interface Redaction extends Extent, Attributed {
    type: "redaction";
    content?: string;
    extent?: number;
}
export interface Highlight extends Extent, Attributed {
    type: "highlight";
    comment?: string;
    backgroundColor?: string;
    color?: string;
    opacity?: number;
}
export interface Note extends Extent, Attributed {
    type: "note";
    comment: string;
}
export interface Markup extends Extent, Attributed {
    type: "markup";
}
export declare type Annotation = Redaction | Highlight | Note | Markup;
