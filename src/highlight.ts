import {_debug} from "./util";
const xpr = require("xpath-range");

/**
 * Track container elements where selection events can be handled.
 */
const watchList = new Set<HTMLElement>();

/**
 * Get the parent container for a selection.
 *
 * Might return undefined if no container under watch contains the node.
 */
function getWatchedParent(childNode: Node): HTMLElement | undefined {
  for (const el of watchList) {
    if (el.contains(childNode)) {
      return el;
    }
  }
  return undefined;
}

/**
 * Get the container under watch that contains the selection.
 *
 * TODO(jnu): currently selections that overflow a single watched parent in
 * any way will be ignored entirely. These edge cases could be handled in
 * other ways in the future.
 */
function resolveContainer(selection: Selection): HTMLElement | undefined {
  const anchorParent = getWatchedParent(selection.anchorNode);
  if (!anchorParent) {
    _debug("Selection starts outside of watched container");
    return undefined;
  }

  const focusParent = getWatchedParent(selection.focusNode);
  if (!focusParent) {
    _debug("Selection ends outside of watched container");
    return undefined;
  }

  if (anchorParent !== focusParent) {
    _debug("Selection spans multiple watched containers");
    return undefined;
  }

  return anchorParent;
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

  const container = resolveContainer(selection);
  if (!container) {
    _debug("Ignoring selection due to overflow");
    return;
  }

  _debug(selection, container);
  _debug(xpr.fromRange(selection.getRangeAt(0), container));
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
export function watch(element: HTMLElement) {
  initialize();
  watchList.add(element);
}

/**
 * Stop watching selection events on the given element.
 */
export function unwatch(element: HTMLElement) {
  watchList.delete(element);
}
