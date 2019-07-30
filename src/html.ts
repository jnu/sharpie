import {Annotation, Markup, Redaction, StyleAttributes} from "./annotation";
import {defaults, _debug, sortedInsert} from "./util";
import {IDAllocator} from "./id_allocator";

interface RenderOpts {
  autoParagraph?: boolean;
}

/**
 * Put annotations in a reasonable order for processing.
 */
function sortAnnotations(a: Annotation, b: Annotation): number {
  if (a.start === b.start) {
    // Sort the element that will end first after (i.e., inside)
    return a.end < b.end ? 1 : -1;
  }
  return a.start < b.start ? -1 : 1;
}

/**
 * Create a dummy annotation representing an HTML paragraph span.
 */
function createParagraphAnnotation(start: number, end: number): Markup {
  return {
    start,
    end,
    type: "markup",
    meta: {
      htmlTagName: "p",
      htmlClassName: "auto-para-break",
    },
  };
}

/**
 * Map from Sharpie format property names to their CSS equivalents.
 */
const STYLE_TO_CSS = {
  "font": "font-family",
  "fontSize": "font-size",
  "color": "color",
  "bgColor": "background-color",
  "opacity": "opacity",
};

/**
 * Convert the Sharpie format options to CSS.
 */
function createStyleString(style: StyleAttributes) {
  const styles = Object.keys(style).map((key: keyof StyleAttributes) => {
    const value = style[key];
    const cssKey = STYLE_TO_CSS[key];
    if (!cssKey) {
      throw new Error(`Unknown style ${key}`);
    }
    return `${cssKey}: ${value}`;
  });

  if (!styles.length) {
    return "";
  }

  return styles.join("; ") + ";";
}

/**
 * Add paragraph break annotations to a piece of text.
 */
function inferParagraphBreaks(text: string): Markup[] {
  const annotations: Markup[] = [];
  const breakPattern = /\n/g;
  let lastPoint = 0;

  // Add paragraph annotations wherever there's a newline
  let br: RegExpExecArray | null = null;
  while ((br = breakPattern.exec(text)) !== null) {
    annotations.push(createParagraphAnnotation(lastPoint, br.index));
    lastPoint = br.index;
  }

  // Push at least one annotation that closes at the end of the text.
  annotations.push(createParagraphAnnotation(lastPoint, text.length));

  return annotations;
}

/**
 * Get the HTML tag name to use for the given annotation.
 */
function getTagName(annotation: Annotation, defaultTag: string = "span") {
  if (annotation.meta && annotation.meta.htmlTagName) {
    return annotation.meta.htmlTagName;
  }
  return defaultTag;
}

/**
 * Generate opening tag string for the annotation.
 */
function openTag(annotation: Annotation, annotationId?: string, defaultTag?: string): string {
  const tagName = getTagName(annotation, defaultTag);
  const attrs: Array<[string, string]> = [];
  if (annotation.format) {
    attrs.push(["style", createStyleString(annotation.format)]);
  }

  if (annotation.meta && annotation.meta.id) {
    attrs.push(["id", annotation.meta.id]);
  }

  const cls = ["sharpie-annotation"];
  if (annotationId) {
    cls.push(`sharpie-id-${annotationId}`);
  }
  if (annotation.meta && annotation.meta.htmlClassName) {
    cls.push(annotation.meta.htmlClassName);
  }
  attrs.push(["class", cls.join(" ")]);

  const attrString = attrs.map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<${tagName}${attrString ? " " + attrString : ""}>`;
}

/**
 * Generate closing tag string for the annotation.
 */
function closeTag(annotation: Annotation, defaultTag?: string): string {
  const tagName = getTagName(annotation, defaultTag);
  return `</${tagName}>`;
}

/**
 * Render the given text into a string of HTML.
 */
export function renderToString(text: string, annotations: Annotation[], opts?: RenderOpts): string {
  opts = defaults(opts, {autoParagraph: true});

  if (opts.autoParagraph) {
    _debug("Generating HTML paragraph break annotations");
    annotations = [...annotations, ...inferParagraphBreaks(text)];
  }

  const ids = new IDAllocator<Annotation>();
  // Queue for annotations to apply
  const sorted = annotations.sort(sortAnnotations);
  // Stack of annotations that have been opened
  const openOrderStack: Annotation[] = [];
  // Annotations stack ordered by end position. This is used to detect
  // annotations that have overlapping extents. When the extents overlap, close
  // and reopen the tags to generate valid HTML.
  const endOrderStack: Annotation[] = [];
  // Stack of overlapping tags that need to be reopened.
  const reopen: Annotation[] = [];
  // Stack of redaction annotations that are currently being applied.
  const redactionStack: Redaction[] = [];

  let output = "";

  for (let pointer = 0; pointer <= text.length; pointer++) {
    // Write any tags that are closing at this position
    while (endOrderStack.length > 0 && endOrderStack[0].end === pointer) {
      const endTag = endOrderStack.shift();
      // Write closing tags for every tag that overlaps this one
      while (openOrderStack.length > 0) {
        const openedAfter = openOrderStack.shift();
        output += closeTag(openedAfter);
        // Break out of the loop when the real tag to close is found.
        if (openedAfter === endTag) {
          break;
        }
        // Reopen any tags that continue beyond this one
        reopen.unshift(openedAfter);
      }
    }

    // Open any new tags at this position. Note that <= is used so that the
    // overlapping tags that need reopening are processed here.
    while (sorted.length > 0 && sorted[0].start === pointer) {
      const atn = sorted.shift();
      output += openTag(atn, ids.getId(atn));
      sortedInsert(endOrderStack, atn, a => a.end);
      openOrderStack.unshift(atn);
    }

    // Reopen overlapping tags
    while (reopen.length > 0) {
      const atn = reopen.shift();
      output += openTag(atn, ids.getId(atn));
      openOrderStack.unshift(atn);
      // NB: Don't add the tag to the end order stack because it was never
      // popped from there.
    }

    // Write the character at this position, or the redaction that should
    // replace the character.
    output += text[pointer] || "";
  }

  return output;
}

/**
 * Render annotated text as plain HTML into the given DOM container.
 */
export function render(container: HTMLElement, text: string, annotations: Annotation[]) {
  const html = renderToString(text, annotations);
  container.innerHTML = html;
}
