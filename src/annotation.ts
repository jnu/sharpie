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
  /**
   * Optional setting of how wide the redaction should appear in the text. By
   * default this is the difference between the end and the start positions.
   */
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

export type Annotation = Redaction | Highlight | Note | Markup;
