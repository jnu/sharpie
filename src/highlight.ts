import {_debug} from "./util";

/**
 * Events that Sharpie supports.
 *
 * - "select" is an abstraction over mouse clicks
 * - "deselect" is also an abstraction oer mouse clicks
 * - "hoverIn" is an abstraction over mouseover events
 * - "hoverOut" is an abstraction over mouseout events
 */
export type SharpieEvent = "deselect" | "select" | "hoverIn" | "hoverOut";

/**
 * Map from a sharpie event type to associated handlers.
 */
type EventHandlerRegistry = Map<SharpieEvent, Set<Function>>;

/**
 * Track container elements where selection events can be handled.
 */
const eventHandlerRegistry = new Map<HTMLElement, EventHandlerRegistry>();

/**
 * Get the handlers to execute for the given child based on its container.
 *
 * Might return undefined if no container under watch contains the node, or
 * if the node is under watch but no handlers have been registered for the
 * given event.
 */
function getWatchHandlers(eventType: SharpieEvent, childNode: Node) {
  for (const el of eventHandlerRegistry.keys()) {
    if (el.contains(childNode)) {
      const registry = eventHandlerRegistry.get(el);
      return registry.get(eventType);
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
function resolveHandlersForSelection(eventType: SharpieEvent, selection: Selection) {
  const anchorCBs = getWatchHandlers(eventType, selection.anchorNode);
  if (!anchorCBs) {
    _debug("Selection starts outside of watched container");
    return undefined;
  }

  const focusCBs = getWatchHandlers(eventType, selection.focusNode);
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
function getSharpieOffsetParent(container: Node): HTMLElement | undefined {
  let el = container;
  // TODO(jnu): use more immediate anchor to short-circuit search
  const root = document.body;
  while (el && el !== root) {
    // @ts-ignore
    if (el.dataset && el.dataset.hasOwnProperty("sharpieStart")) {
      return el as HTMLElement;
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
  let el = container;
  while (el) {
    // @ts-ignore
    if (el.dataset && el.dataset.hasOwnProperty("sharpieStart")) {
      return el as HTMLElement;
    }
    // @ts-ignore
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
function selectDelegate(e: MouseEvent) {
  const selection = window.getSelection();

  const selectCallbacks = resolveHandlersForSelection("select", selection);
  if (!selectCallbacks) {
    _debug("Ignoring selection due to overflow");
    return;
  }
  const deselectCallbacks = resolveHandlersForSelection("deselect", selection);

  if (selection.isCollapsed) {
    _debug("Firing deselect callbacks");
    for (const cb of (deselectCallbacks || [])) {
      cb(e);
    }
    return;
  }

  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i);
    if (range.collapsed) {
      _debug("Ignoring collapsed range");
      continue;
    }
    const extent = getSharpieExtent(range);
    for (const cb of selectCallbacks) {
      cb(extent, e);
    }
  }
}

/**
 * Factory for hover event delegate.
 */
function createHoverDelegate(eventType: SharpieEvent) {
  return function _hoverDelegate(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (!target.classList.contains("sharpie-annotation")) {
      return;
    }

    // TODO(jnu): Make this aware of overlaps and return the set of IDs that
    // the mouse is currently over.
    const {sharpieId} = target.dataset;
    if (!sharpieId) {
      _debug("Sharpie ID not set on event target");
      return;
    }
  
    // Don't fire on auto-generated annotations.
    // TODO(jnu): there may be a real use case for handling events on inferred
    // annotations, but for now it's easier just to hide them from the user.
    if (sharpieId.substr(0, 9) === "inferred-") {
      return;
    }

    const parsedId = +sharpieId;
    // Detect NaN from failed integer parsing
    if (parsedId !== parsedId) {
      _debug("Could not parse sharpie ID:", sharpieId);
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

/**
 * Global event handler for processing hover enter events
 */
const hoverInDelegate = createHoverDelegate("hoverIn");

/**
 * Global event handler for processing hover exit events
 */
const hoverOutDelegate = createHoverDelegate("hoverOut");

/**
 * Set up global mouse event handling (idempotent).
 */
let init = false;
function initialize() {
  if (init) {
    return;
  }
  window.addEventListener("mouseup", selectDelegate);
  window.addEventListener("mouseover", hoverInDelegate);
  window.addEventListener("mouseout", hoverOutDelegate);
  init = true;
}

/**
 * Get event handlers of the given type from the registry.
 *
 * Event handler sets are created lazily as requested.
 */
function getEventHandlers(registry: EventHandlerRegistry, eventType: SharpieEvent) {
  if (!registry.has(eventType)) {
    registry.set(eventType, new Set());
  }
  return registry.get(eventType);
}

/**
 * Handle mouse events within the given element.
 */
export function watch(element: HTMLElement) {
  initialize();

  if (!eventHandlerRegistry.has(element)) {
    eventHandlerRegistry.set(element, new Map());
  }

  const registry = eventHandlerRegistry.get(element);

  const ctl = {
    hoverIn: (handler: Function) => {
      getEventHandlers(registry, "hoverIn").add(handler);
      return ctl;
    },
    hoverOut: (handler: Function) => {
      getEventHandlers(registry, "hoverOut").add(handler);
      return ctl;
    },
    select: (handler: Function) => {
      getEventHandlers(registry, "select").add(handler);
      return ctl;
    },
    deselect: (handler: Function) => {
      getEventHandlers(registry, "deselect").add(handler);
      return ctl;
    },
  };

  return ctl;
}

/**
 * Stop watching events on the given element.
 *
 * Additional parameters can be used to scope cleanup to a specific event
 * type and further to a specific handler.
 *
 * Returns a boolean indicating whether cleanup was successful.
 */
export function unwatch(element: HTMLElement, eventType?: SharpieEvent, handler?: Function) {
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

/**
 * Convenience function for clearing current browser selection.
 *
 * Works in all modern browsers (IE 9+).
 *
 * NOTE: This only clears the browser's GUI selection. The use case is for
 * adding a custom annotation to replace the browser's visual selection.
 * Calling this does not fire the "deselect" event.
 */
export function clearSelection() {
  if (window.getSelection) {
    const sel = window.getSelection();
    if (sel.empty) {
      sel.empty();
    } else if (sel.removeAllRanges) {
      sel.removeAllRanges();
    }
  }
}
