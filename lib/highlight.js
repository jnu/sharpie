"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const watchList = new Map();
function getWatchHandlers(childNode) {
    for (const el of watchList.keys()) {
        if (el.contains(childNode)) {
            return watchList.get(el);
        }
    }
    return undefined;
}
function resolveHandlers(selection) {
    const anchorCBs = getWatchHandlers(selection.anchorNode);
    if (!anchorCBs) {
        util_1._debug("Selection starts outside of watched container");
        return undefined;
    }
    const focusCBs = getWatchHandlers(selection.focusNode);
    if (!focusCBs) {
        util_1._debug("Selection ends outside of watched container");
        return undefined;
    }
    if (anchorCBs !== focusCBs) {
        util_1._debug("Selection spans multiple watched containers");
        return undefined;
    }
    return anchorCBs;
}
function getSharpieOffsetParent(container) {
    let el = container;
    const root = document.body;
    while (el && el !== root) {
        if (el.dataset && el.dataset.hasOwnProperty("sharpieStart")) {
            return el;
        }
        el = el.parentElement;
    }
    return undefined;
}
function getSharpieSibling(container) {
    let el = container;
    while (el) {
        if (el.dataset && el.dataset.hasOwnProperty("sharpieStart")) {
            return el;
        }
        el = el.previousElementSibling;
    }
    return undefined;
}
function getSharpieOffset(el) {
    const sharpieContainer = getSharpieOffsetParent(el);
    const sharpieSibling = getSharpieSibling(el);
    const rawPos = sharpieSibling ?
        sharpieSibling.dataset.sharpieEnd :
        sharpieContainer.dataset.sharpieStart;
    const rawWarp = sharpieContainer.dataset.sharpieWarp;
    return { pos: +rawPos, warp: rawWarp ? +rawWarp : 1 };
}
function getSharpieExtent(range) {
    const startMeta = getSharpieOffset(range.startContainer);
    const endMeta = getSharpieOffset(range.endContainer);
    const start = startMeta.pos + range.startOffset * startMeta.warp;
    const end = endMeta.pos + range.endOffset * endMeta.warp;
    return [Math.floor(start), Math.ceil(end)];
}
function delegate() {
    const selection = window.getSelection();
    if (selection.isCollapsed) {
        util_1._debug("Ignoring collapsed selection");
        return;
    }
    const callbacks = resolveHandlers(selection);
    if (!callbacks) {
        util_1._debug("Ignoring selection due to overflow");
        return;
    }
    for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i);
        if (range.collapsed) {
            util_1._debug("Ignoring collapsed range");
            continue;
        }
        const extent = getSharpieExtent(range);
        for (const cb of callbacks) {
            cb(extent);
        }
    }
}
let init = false;
function initialize() {
    if (init) {
        return;
    }
    window.addEventListener("mouseup", delegate);
    init = true;
}
function watch(element, handler) {
    initialize();
    if (!watchList.has(element)) {
        watchList.set(element, new Set());
    }
    watchList.get(element).add(handler);
}
exports.watch = watch;
function unwatch(element, handler) {
    if (handler) {
        const list = watchList.get(element);
        if (!list) {
            return false;
        }
        if (!list.has(handler)) {
            return false;
        }
        list.delete(handler);
        return true;
    }
    if (!watchList.has(element)) {
        return false;
    }
    watchList.delete(element);
    return true;
}
exports.unwatch = unwatch;
//# sourceMappingURL=highlight.js.map