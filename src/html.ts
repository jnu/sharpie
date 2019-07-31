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
 *
 * The input object should include standard StyleAttributes keys, but any
 * additional keys will be treated as literal CSS keys.
 */
function createStyleString(style: StyleAttributes) {
  const styles = Object.keys(style).map((key: keyof StyleAttributes) => {
    const value = style[key];
    if (!STYLE_TO_CSS.hasOwnProperty(key)) {
      _debug("Unknown style key", key);
    }
    const cssKey = STYLE_TO_CSS[key] || key;
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
 * Get an object used to generated styles.
 *
 * A default object is defined for each type, which the annotation itself may
 * override when it is defined.
 */
function getFormatObject(annotation: Annotation): Object | undefined {
  const overrides = annotation.format;
  switch (annotation.type) {
    case "markup":
      return overrides;
    case "redaction":
      const fmt = defaults(overrides, {
        bgColor: "black",
        color: "white",
      });
      return {...fmt,
        "white-space": "pre-wrap",
        "word-break": "break-word",
      };
    case "highlight":
      return defaults(overrides, {
        bgColor: "#fffa129c",
      });
    default:
      return undefined;
  }
}

/**
 * Generate opening tag string for the annotation.
 */
function openTag(annotation: Annotation, annotationId: string, position: number, warp: number): string {
  const tagName = getTagName(annotation);
  const attrs: Array<[string, string]> = [];

  // Inline styles
  const format = getFormatObject(annotation);
  if (format) {
    attrs.push(["style", createStyleString(format)]);
  }

  // ID attribute
  if (annotation.meta && annotation.meta.id) {
    attrs.push(["id", annotation.meta.id]);
  }

  // className string
  const cls = ["sharpie-annotation", `sharpie-type-${annotation.type}`];
  if (annotationId) {
    cls.push(`sharpie-id-${annotationId}`);
  }
  if (annotation.meta && annotation.meta.htmlClassName) {
    cls.push(annotation.meta.htmlClassName);
  }
  attrs.push(["class", cls.join(" ")]);

  // Data attributes
  attrs.push(["data-sharpie-position", `${position}`]);
  attrs.push(["data-sharpie-warp", `${warp}`]);

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
 * Create a buffer of the given text string of the given length.
 *
 * Each character within the text string will occupy a slot in the buffer. The
 * space character is used to pad before and after the text string until the
 * buffer is of the length specified by `width`.
 *
 * Some behavior of this function may be unexpected:
 *
 * 1) If text is greater than the designated width, it is returned directly.
 * 2) The padding character is treated as a single character regardless of
 *    its literal string length in JavaScript. This is so that HTML markup
 *    can be passed; the screen representation should still be a single
 *    character of text regardless.
 */
function createPaddedOutputBuffer(text: string | undefined, width: number, paddingChar: string) {
  text = text || "";
  const textLength = text.length;

  const length = Math.max(textLength, width);
  const delta = width - textLength;
  const lWidth = delta >> 1;
  const rWidth = delta - lWidth;

  const buf = new Array<string>(length);

  let cursor = 0;
  for (let i = 0; i < lWidth; i++) {
    buf[cursor++] = paddingChar;
  }

  for (let i = 0; i < textLength; i++) {
    buf[cursor++] = text[i];
  }

  for (let i = 0; i < rWidth; i++) {
    buf[cursor++] = paddingChar;
  }

  return buf;
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
  const warpMap = new WeakMap<Annotation, number>();
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
  // Stack of open redactions and their state.
  const openRedactions = [] as Array<{
    redaction: Redaction;
    output: string[];
    extent: number;
    cursor: number;
  }>;

  // Generated output string (HTML)
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
        // NOTE: there may be annotations processed at this step that end at
        // the same position and should not be reopened.
        if (openedAfter.end > pointer) {
          reopen.unshift(openedAfter);
        }
      }
    }

    // Open any new tags at this position. Note that <= is used so that the
    // overlapping tags that need reopening are processed here.
    while (sorted.length > 0 && sorted[0].start === pointer) {
      const atn = sorted.shift();
      sortedInsert(endOrderStack, atn, a => a.end);
      openOrderStack.unshift(atn);
      // Warp represents the number of characters in the real text are
      // represented by one character of output text in this range. It's added
      // so libraries operating on annotated text can compute positions
      // correctly despite annotation that may have altered the surface text.
      let warp = 1;
      // Store this redaction if not currently redacting, or if this one goes
      // longer. The last / longest redaction takes precedence on overlaps.
      if (atn.type === "redaction") {
        const space = "&nbsp;";
        // Choose the effective redaction width by taking the explicitly
        // defined extent if there is one, or the max of the annotation span
        // and the redaction content length if not.
        const annotationExtent = atn.end - atn.start;
        const extent = atn.extent ?
          atn.extent :
          Math.max(annotationExtent, (atn.content || "").length);
        openRedactions.push({
          redaction: atn,
          output: createPaddedOutputBuffer(atn.content, extent, space),
          extent,
          cursor: 0,
        });
        // Compute warp factor: redactions can alter screen text length
        warp = annotationExtent / extent;
      }
      // Save metadata
      warpMap.set(atn, warp);
      // Write open tag
      output += openTag(atn, ids.getId(atn), pointer, warp);
    }

    // Reopen overlapping tags
    while (reopen.length > 0) {
      const atn = reopen.shift();
      output += openTag(atn, ids.getId(atn), pointer, warpMap.get(atn));
      openOrderStack.unshift(atn);
      // NB: No need to add this annotation to any of the other stacks, since
      // it was only ever popped from open-order.
    }

    // Clean up closing redactions
    while (openRedactions.length && openRedactions[0].redaction.end === pointer) {
      openRedactions.shift();
    }

    // Process open redaction annotations.
    for (let i = 0; i < openRedactions.length; i++) {
      const atn = openRedactions[i];

      // Calculate the new cursor position within this annotation
      let cursor = atn.cursor;
      const pct = (1 + pointer - atn.redaction.start) / (atn.redaction.end - atn.redaction.start);
      const rawPos = pct * atn.extent;
      atn.cursor = Math.floor(rawPos);
      // Only write the top-most redaction, and only when the cursor moved.
      const needsWrite = i === 0 && atn.cursor > cursor;

      // Write anything between the old cursor and the new cursor position.
      // This lets us write redactions with content longer than the span it
      // is technically redacting.
      while (needsWrite && cursor < atn.cursor) {
        output += atn.output[cursor++];
      }
    }

    // If the underlying text is not actively being  redacted, write it.
    if (openRedactions.length === 0) {
      output += text[pointer] || "";
    }
  }

  // Ta-da!
  return output;
}

/**
 * Render annotated text as plain HTML into the given DOM container.
 */
export function render(container: HTMLElement, text: string, annotations: Annotation[]) {
  const start = Date.now();
  const html = renderToString(text, annotations);
  _debug("Rendered in", Date.now() - start, "ms");
  container.innerHTML = html;
}
