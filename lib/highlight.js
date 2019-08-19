"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const eventHandlerRegistry = new Map();
function getWatchHandlers(eventType, childNode) {
    for (const el of eventHandlerRegistry.keys()) {
        if (el.contains(childNode)) {
            const registry = eventHandlerRegistry.get(el);
            return registry.get(eventType);
        }
    }
    return undefined;
}
function resolveHandlersForSelection(eventType, selection) {
    const anchorCBs = getWatchHandlers(eventType, selection.anchorNode);
    if (!anchorCBs) {
        util_1._debug("Selection starts outside of watched container");
        return undefined;
    }
    const focusCBs = getWatchHandlers(eventType, selection.focusNode);
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
function selectDelegate(e) {
    const selection = window.getSelection();
    const selectCallbacks = resolveHandlersForSelection("select", selection);
    if (!selectCallbacks) {
        util_1._debug("Ignoring selection due to overflow");
        return;
    }
    const deselectCallbacks = resolveHandlersForSelection("deselect", selection);
    if (selection.isCollapsed) {
        util_1._debug("Firing deselect callbacks");
        for (const cb of (deselectCallbacks || [])) {
            cb(e);
        }
        return;
    }
    for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i);
        if (range.collapsed) {
            util_1._debug("Ignoring collapsed range");
            continue;
        }
        const extent = getSharpieExtent(range);
        for (const cb of selectCallbacks) {
            cb(extent, e);
        }
    }
}
function createMousePointDelegate(eventType) {
    return function _hoverDelegate(e) {
        const target = e.target;
        if (!target.classList.contains("sharpie-annotation")) {
            return;
        }
        const { sharpieId } = target.dataset;
        if (!sharpieId) {
            util_1._debug("Sharpie ID not set on event target");
            return;
        }
        if (sharpieId.substr(0, 9) === "inferred-") {
            return;
        }
        const parsedId = +sharpieId;
        if (parsedId !== parsedId) {
            util_1._debug("Could not parse sharpie ID:", sharpieId);
            return;
        }
        const callbacks = getWatchHandlers(eventType, target);
        if (!callbacks) {
            return;
        }
        for (const cb of callbacks) {
            cb(parsedId, e);
        }
    };
}
const hoverInDelegate = createMousePointDelegate("hoverIn");
const hoverOutDelegate = createMousePointDelegate("hoverOut");
const clickDelegate = createMousePointDelegate("click");
let init = false;
function initialize() {
    if (init) {
        return;
    }
    window.addEventListener("mouseup", selectDelegate);
    window.addEventListener("mouseover", hoverInDelegate);
    window.addEventListener("mouseout", hoverOutDelegate);
    window.addEventListener("click", clickDelegate);
    init = true;
}
function getEventHandlers(registry, eventType) {
    if (!registry.has(eventType)) {
        registry.set(eventType, new Set());
    }
    return registry.get(eventType);
}
function watch(element) {
    initialize();
    if (!eventHandlerRegistry.has(element)) {
        eventHandlerRegistry.set(element, new Map());
    }
    const registry = eventHandlerRegistry.get(element);
    const ctl = {
        click: (handler) => {
            getEventHandlers(registry, "click").add(handler);
            return ctl;
        },
        hoverIn: (handler) => {
            getEventHandlers(registry, "hoverIn").add(handler);
            return ctl;
        },
        hoverOut: (handler) => {
            getEventHandlers(registry, "hoverOut").add(handler);
            return ctl;
        },
        select: (handler) => {
            getEventHandlers(registry, "select").add(handler);
            return ctl;
        },
        deselect: (handler) => {
            getEventHandlers(registry, "deselect").add(handler);
            return ctl;
        },
    };
    return ctl;
}
exports.watch = watch;
function unwatch(element, eventType, handler) {
    const registry = eventHandlerRegistry.get(element);
    if (!registry) {
        return false;
    }
    if (handler) {
        const handlers = registry.get(eventType);
        if (!handlers) {
            return false;
        }
        const hasHandlerToDrop = handlers.has(handler);
        handlers.delete(handler);
        return hasHandlerToDrop;
    }
    if (eventType) {
        const hasHandlersToDrop = registry.has(eventType);
        registry.delete(eventType);
        return hasHandlersToDrop;
    }
    eventHandlerRegistry.delete(element);
    return true;
}
exports.unwatch = unwatch;
function clearSelection() {
    if (window.getSelection) {
        const sel = window.getSelection();
        if (sel.empty) {
            sel.empty();
        }
        else if (sel.removeAllRanges) {
            sel.removeAllRanges();
        }
    }
}
exports.clearSelection = clearSelection;
function findFirstLeaf(el) {
    let it = el;
    while (it.firstChild) {
        it = it.firstChild;
    }
    return it;
}
function findLastLeaf(el) {
    let it = el;
    while (it.lastChild) {
        it = it.lastChild;
    }
    return it;
}
function snapUserSelection(container, sharpieId) {
    const selector = `[data-sharpie-id='${sharpieId}']`;
    const els = container.querySelectorAll(selector);
    const firstEl = els[0];
    const lastEl = els[els.length - 1];
    const firstNode = findFirstLeaf(firstEl);
    const lastNode = findLastLeaf(lastEl);
    const newRange = document.createRange();
    newRange.setStart(firstNode, 0);
    newRange.setEnd(lastNode, lastNode.textContent.length);
    const userSelect = window.getSelection();
    userSelect.removeAllRanges();
    userSelect.addRange(newRange);
}
exports.snapUserSelection = snapUserSelection;
//# sourceMappingURL=highlight.js.map