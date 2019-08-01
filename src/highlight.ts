import {_debug} from "./util";
const xpr = require("xpath-range");

/**
 * Track container elements where selection events can be handled.
 */
const watchList = new Map<HTMLElement, Set<Function>>();

/**
 * Get the handlers to execute for the given child based on its container.
 *
 * Might return undefined if no container under watch contains the node.
 */
function getWatchHandlers(childNode: Node) {
  for (const el of watchList.keys()) {
    if (el.contains(childNode)) {
      return watchList.get(el);
    }
  }
  return undefined;
}

/**
 * Get the handlers to execute for the given watched container.
 *
 * TODO(jnu): currently selections that overflow a single watched parent in
 * any way will be ignored entirely. These edge cases could be handled in
 * other ways in the future.
 */
function resolveHandlers(selection: Selection) {
  const anchorCBs = getWatchHandlers(selection.anchorNode);
  if (!anchorCBs) {
    _debug("Selection starts outside of watched container");
    return undefined;
  }

  const focusCBs = getWatchHandlers(selection.focusNode);
  if (!focusCBs) {
    _debug("Selection ends outside of watched container");
    return undefined;
  }

  if (anchorCBs !== focusCBs) {
    _debug("Selection spans multiple watched containers");
    return undefined;
  }

  return anchorCBs;
}

/**
 * Get the most immediate Sharpie parent container.
 */
function getSharpieOffsetParent(container: Node) {
  let el = container.parentElement;
  const root = el.getRootNode();
  while (el && el !== root) {
    if (el.dataset && el.dataset.hasOwnProperty("sharpieStart")) {
      return el;
    }
    el = el.parentElement;
  }

  return undefined;
}

/**
 * Get the nearest preceding Sharpie element.
 */
function getSharpieSibling(container: Node): HTMLElement | undefined {
  // @ts-ignore
  let el = container.previousElementSibling;
  while (el) {
    // @ts-ignore
    if (el.dataset && el.dataset.hasOwnProperty("sharpieStart")) {
      return el;
    }
    el = el.previousElementSibling;
  }
  return undefined;
}

/**
 * Get offset of the given node.
 *
 * Uses contextual hints from surrounding elements.
 */
function getSharpieOffset(el: Node) {
  const sharpieContainer = getSharpieOffsetParent(el);
  const sharpieSibling = getSharpieSibling(el);
  const rawPos = sharpieSibling ?
    sharpieSibling.dataset.sharpieEnd :
    sharpieContainer.dataset.sharpieStart;
  const rawWarp = sharpieContainer.dataset.sharpieWarp;

  return {pos: +rawPos, warp: rawWarp ? +rawWarp : 1};
}

/**
 * Translate the given selection range to positions within the raw text.
 *
 * This function takes into account different annotations that may shrink or
 * stretch the underlying character count in various ways.
 */
function getSharpieExtent(range: Range) {
  const startMeta = getSharpieOffset(range.startContainer);
  const endMeta = getSharpieOffset(range.endContainer);
  const start = startMeta.pos + range.startOffset * startMeta.warp;
  const end = endMeta.pos + range.endOffset * endMeta.warp;
  return [Math.floor(start), Math.ceil(end)];
}

/**
 * Global event handler that processes selections on mouse events.
 */
function delegate() {
  const selection = window.getSelection();

  if (selection.isCollapsed) {
    _debug("Ignoring collapsed selection");
    return;
  }

  const callbacks = resolveHandlers(selection);
  if (!callbacks) {
    _debug("Ignoring selection due to overflow");
    return;
  }

  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i);
    const extent = getSharpieExtent(range);
    for (const cb of callbacks) {
      cb(extent);
    }
  }
}

/**
 * Set up global selection event handling (idempotent).
 */
let init = false;
function initialize() {
  if (init) {
    return;
  }
  window.addEventListener("mouseup", delegate);
  init = true;
}

/**
 * Handle text selections within the given element.
 */
export function watch(element: HTMLElement, handler: Function) {
  initialize();
  if (!watchList.has(element)) {
    watchList.set(element, new Set());
  }
  watchList.get(element).add(handler);
}

/**
 * Stop watching selection events on the given element.
 *
 * Pass a handler explicitly to only remove the specified callback.
 *
 * Returns a boolean indicating whether cleanup was successful.
 */
export function unwatch(element: HTMLElement, handler?: Function) {
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
