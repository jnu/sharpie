"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const BLOCK_TAGS = new Set([
    "address",
    "article",
    "aside",
    "blockquote",
    "details",
    "dialog",
    "dd",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "header",
    "hgroup",
    "hr",
    "li",
    "main",
    "nav",
    "ol",
    "p",
    "pre",
    "section",
    "table",
    "ul",
]);
function sortOpenings(a, b) {
    const aType = a.annotation.type;
    const bType = b.annotation.type;
    const aTag = a.tagName.toLowerCase();
    const bTag = b.tagName.toLowerCase();
    if (aTag === "p") {
        return -1;
    }
    else if (bTag === "p") {
        return 1;
    }
    if (aType !== bType) {
        if (aType === "highlight") {
            return 1;
        }
        else if (bType === "highlight") {
            return -1;
        }
    }
    if (BLOCK_TAGS.has(aTag)) {
        return -1;
    }
    else if (BLOCK_TAGS.has(bTag)) {
        return 1;
    }
    return -1;
}
function sortAnnotations(a, b) {
    if (a.start === b.start) {
        return a.end < b.end ? 1 : -1;
    }
    return a.start < b.start ? -1 : 1;
}
function createParagraphAnnotation(start, end) {
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
const STYLE_TO_CSS = {
    "font": "font-family",
    "fontSize": "font-size",
    "color": "color",
    "bgColor": "background-color",
    "opacity": "opacity",
};
function createStyleString(style) {
    const styles = Object.keys(style).map((key) => {
        const value = style[key];
        const cssKey = STYLE_TO_CSS[key] || key;
        return `${cssKey}: ${value}`;
    });
    if (!styles.length) {
        return "";
    }
    return styles.join("; ") + ";";
}
function inferParagraphBreaks(text) {
    const annotations = [];
    const breakPattern = /\n/g;
    let lastPoint = 0;
    let br = null;
    while ((br = breakPattern.exec(text)) !== null) {
        annotations.push(createParagraphAnnotation(lastPoint, br.index));
        lastPoint = br.index;
    }
    annotations.push(createParagraphAnnotation(lastPoint, text.length));
    return annotations;
}
function getTagName(annotation, defaultTag = "span") {
    if (annotation.meta && annotation.meta.htmlTagName) {
        return annotation.meta.htmlTagName.toLowerCase();
    }
    return defaultTag.toLowerCase();
}
function getFormatObject(annotation) {
    const overrides = annotation.format;
    switch (annotation.type) {
        case "redaction":
            return Object.assign({ "white-space": "pre-wrap", "word-break": "break-word" }, overrides);
        default:
            return Object.assign({}, overrides);
    }
}
function openTag(annotation, annotationId, part) {
    const tagName = getTagName(annotation);
    const attrs = [];
    const format = getFormatObject(annotation);
    if (format) {
        const styleString = createStyleString(format);
        if (styleString) {
            attrs.push(["style", createStyleString(format)]);
        }
    }
    if (annotation.meta && annotation.meta.id) {
        attrs.push(["id", annotation.meta.id]);
    }
    const cls = ["sharpie-annotation", `sharpie-type-${annotation.type}`];
    if (annotation.meta && annotation.meta.htmlClassName) {
        cls.push(annotation.meta.htmlClassName);
    }
    attrs.push(["class", cls.join(" ")]);
    const metaDataId = getMetaDataId(annotationId, part);
    const attrString = attrs.map(([k, v]) => `${k}="${v}"`).join(" ");
    return `<${tagName} ${metaDataId}${attrString ? " " + attrString : ""}>`;
}
function closeTag(annotation, defaultTag) {
    const tagName = getTagName(annotation, defaultTag);
    return `</${tagName}>`;
}
function createPaddedOutputBuffer(text, width, paddingChar) {
    text = text || "";
    const textLength = text.length;
    const length = Math.max(textLength, width);
    const delta = width - textLength;
    const lWidth = delta >> 1;
    const rWidth = delta - lWidth;
    const buf = new Array(length);
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
function canContain(ancestor, child) {
    const ancestorTag = getTagName(ancestor);
    const childTag = getTagName(child);
    if (BLOCK_TAGS.has(childTag) && !BLOCK_TAGS.has(ancestorTag)) {
        util_1._debug("Forcing inline reopen:", ancestorTag, "cannot contain", childTag);
        return false;
    }
    if (child.type === "redaction" && ancestor.type === "highlight") {
        util_1._debug("Forcing highlight reopen: containing redaction");
        return false;
    }
    return true;
}
function getMetaDataId(annotationId, part) {
    return `__metadata_${annotationId}_${part}__`;
}
function writeMetaData(text, meta) {
    for (const [id, data] of meta) {
        const attrs = [
            `data-sharpie-start="${data.start}"`,
            `data-sharpie-end="${data.end}"`,
            `data-sharpie-warp="${data.warp}"`,
            `data-sharpie-id="${data.id}"`,
        ].join(" ");
        const preamble = text.substring(0, data.outputOffsetPos);
        const postamble = text.substring(data.outputOffsetPos).replace(id, attrs);
        text = preamble + postamble;
    }
    return text;
}
function renderToString(text, annotations, opts) {
    if (text === null || text === undefined) {
        util_1._debug("Input missing, bailing out of render");
        return "";
    }
    opts = util_1.defaults(opts, { autoParagraph: true });
    let inferred = [];
    if (opts.autoParagraph) {
        util_1._debug("Generating HTML paragraph break annotations");
        inferred = inferParagraphBreaks(text);
    }
    const ids = new WeakMap();
    const warpMap = new WeakMap();
    annotations.forEach((atn, i) => ids.set(atn, `${i}`));
    inferred.forEach((atn, i) => ids.set(atn, `inferred-${i}`));
    const sorted = [...annotations, ...inferred].sort(sortAnnotations);
    const openOrderStack = [];
    const endOrderStack = [];
    const reopen = [];
    const openRedactions = [];
    const nodeMetaCache = new Map();
    let output = "";
    for (let pointer = 0; pointer <= text.length; pointer++) {
        while (endOrderStack.length > 0 && endOrderStack[0].end === pointer) {
            const endTag = endOrderStack[0];
            while (openOrderStack.length > 0) {
                const openedAfter = openOrderStack.shift();
                output += closeTag(openedAfter.annotation);
                nodeMetaCache.get(getMetaDataId(openedAfter.id, openedAfter.part)).end = pointer;
                let i = 0;
                while (i < endOrderStack.length) {
                    const candidate = endOrderStack[i];
                    if (candidate.end > pointer) {
                        break;
                    }
                    if (candidate === openedAfter.annotation) {
                        endOrderStack.splice(i, 1);
                    }
                    else {
                        i++;
                    }
                }
                if (endTag === openedAfter.annotation) {
                    break;
                }
                if (openedAfter.annotation.end > pointer) {
                    reopen.unshift({
                        annotation: openedAfter.annotation,
                        id: openedAfter.id,
                        part: openedAfter.part + 1,
                        start: pointer,
                        end: -1,
                        outputOffsetPos: -1,
                        warp: -1,
                    });
                }
            }
        }
        const openingQueue = [];
        while (sorted.length > 0 && sorted[0].start === pointer) {
            const atn = sorted.shift();
            if (atn.end <= atn.start) {
                util_1._debug("Ignoring invalid annotation range", atn.start, atn.end);
                continue;
            }
            const tagName = getTagName(atn);
            let invalidContainerIndex = -1;
            for (let i = openOrderStack.length - 1; i >= 0; i--) {
                if (!canContain(openOrderStack[i].annotation, atn)) {
                    invalidContainerIndex = i;
                    break;
                }
            }
            for (let i = 0; i <= invalidContainerIndex; i++) {
                const openedBefore = openOrderStack.shift();
                output += closeTag(openedBefore.annotation);
                nodeMetaCache.get(getMetaDataId(openedBefore.id, openedBefore.part)).end = pointer;
                reopen.unshift({
                    annotation: openedBefore.annotation,
                    id: openedBefore.id,
                    part: openedBefore.part + 1,
                    start: pointer,
                    end: -1,
                    outputOffsetPos: -1,
                    warp: -1,
                });
                i++;
            }
            let warp = 1;
            let redaction;
            if (atn.type === "redaction") {
                const annotationExtent = atn.end - atn.start;
                const extent = atn.extent ?
                    atn.extent :
                    Math.max(annotationExtent, (atn.content || "").length);
                redaction = {
                    redaction: atn,
                    output: createPaddedOutputBuffer(atn.content, extent, "&nbsp;"),
                    extent,
                    cursor: 0,
                };
                warp = annotationExtent / extent;
            }
            warpMap.set(atn, warp);
            openingQueue.push({
                annotation: atn,
                tagName,
                redaction,
                part: 0,
            });
        }
        while (reopen.length > 0) {
            const node = reopen.shift();
            openingQueue.push({
                annotation: node.annotation,
                tagName: getTagName(node.annotation),
                part: node.part,
            });
        }
        openingQueue.sort(sortOpenings);
        while (openingQueue.length > 0) {
            const opening = openingQueue.shift();
            const atn = opening.annotation;
            if (opening.part === 0) {
                util_1.sortedInsert(endOrderStack, atn, a => a.end);
                if (opening.redaction) {
                    openRedactions.unshift(opening.redaction);
                }
            }
            const opened = {
                annotation: atn,
                id: ids.get(atn),
                part: opening.part,
                start: pointer,
                end: -1,
                warp: warpMap.get(atn),
                outputOffsetPos: output.length,
            };
            output += openTag(atn, ids.get(atn), opening.part);
            const metaDataId = getMetaDataId(opened.id, opened.part);
            if (nodeMetaCache.has(metaDataId)) {
                util_1._error("Overwriting node metadata", metaDataId);
            }
            nodeMetaCache.set(metaDataId, opened);
            openOrderStack.unshift(opened);
        }
        while (openRedactions.length && openRedactions[0].redaction.end === pointer) {
            openRedactions.shift();
        }
        for (let i = 0; i < openRedactions.length; i++) {
            const atn = openRedactions[i];
            let cursor = atn.cursor;
            const pct = (1 + pointer - atn.redaction.start) / (atn.redaction.end - atn.redaction.start);
            const rawPos = pct * atn.extent;
            atn.cursor = Math.floor(rawPos);
            const needsWrite = i === 0 && atn.cursor > cursor;
            while (needsWrite && cursor < atn.cursor) {
                output += atn.output[cursor++];
            }
        }
        if (openRedactions.length === 0) {
            output += text[pointer] || "";
        }
    }
    return writeMetaData(output, nodeMetaCache);
}
exports.renderToString = renderToString;
function render(container, text, annotations) {
    const start = Date.now();
    const html = renderToString(text, annotations);
    util_1._debug("Rendered in", Date.now() - start, "ms");
    container.innerHTML = html;
}
exports.render = render;
//# sourceMappingURL=html.js.map