(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sharpie"] = factory();
	else
		root["Sharpie"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/highlight.ts":
/*!**************************!*\
  !*** ./src/highlight.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");

var eventHandlerRegistry = new Map();

function getWatchHandlers(eventType, childNode) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = eventHandlerRegistry.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var el = _step.value;

      if (el.contains(childNode)) {
        var registry = eventHandlerRegistry.get(el);
        return registry.get(eventType);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return undefined;
}

function resolveHandlersForSelection(eventType, selection) {
  var anchorCBs = getWatchHandlers(eventType, selection.anchorNode);

  if (!anchorCBs) {
    util_1._debug("Selection starts outside of watched container");

    return undefined;
  }

  var focusCBs = getWatchHandlers(eventType, selection.focusNode);

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
  var el = container;
  var root = document.body;

  while (el && el !== root) {
    if (el.dataset && el.dataset.hasOwnProperty("sharpieStart")) {
      return el;
    }

    el = el.parentElement;
  }

  return undefined;
}

function getSharpieSibling(container) {
  var el = container;

  while (el) {
    if (el.dataset && el.dataset.hasOwnProperty("sharpieStart")) {
      return el;
    }

    el = el.previousElementSibling;
  }

  return undefined;
}

function getSharpieOffset(el) {
  var sharpieContainer = getSharpieOffsetParent(el);
  var sharpieSibling = getSharpieSibling(el);
  var rawPos = sharpieSibling ? sharpieSibling.dataset.sharpieEnd : sharpieContainer.dataset.sharpieStart;
  var rawWarp = sharpieContainer.dataset.sharpieWarp;
  return {
    pos: +rawPos,
    warp: rawWarp ? +rawWarp : 1
  };
}

function getSharpieExtent(range) {
  var startMeta = getSharpieOffset(range.startContainer);
  var endMeta = getSharpieOffset(range.endContainer);
  var start = startMeta.pos + range.startOffset * startMeta.warp;
  var end = endMeta.pos + range.endOffset * endMeta.warp;
  return [Math.floor(start), Math.ceil(end)];
}

function selectDelegate(e) {
  var selection = window.getSelection();
  var selectCallbacks = resolveHandlersForSelection("select", selection);

  if (!selectCallbacks) {
    util_1._debug("Ignoring selection due to overflow");

    return;
  }

  var deselectCallbacks = resolveHandlersForSelection("deselect", selection);

  if (selection.isCollapsed) {
    util_1._debug("Firing deselect callbacks");

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (deselectCallbacks || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var cb = _step2.value;
        cb(e);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return;
  }

  for (var i = 0; i < selection.rangeCount; i++) {
    var range = selection.getRangeAt(i);

    if (range.collapsed) {
      util_1._debug("Ignoring collapsed range");

      continue;
    }

    var extent = getSharpieExtent(range);
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = selectCallbacks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _cb = _step3.value;

        _cb(extent, e);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }
}

function createHoverDelegate(eventType) {
  return function _hoverDelegate(e) {
    var target = e.target;

    if (!target.classList.contains("sharpie-annotation")) {
      return;
    }

    var sharpieId = target.dataset.sharpieId;

    if (!sharpieId) {
      util_1._debug("Sharpie ID not set on event target");

      return;
    }

    if (sharpieId.substr(0, 9) === "inferred-") {
      return;
    }

    var parsedId = +sharpieId;

    if (parsedId !== parsedId) {
      util_1._debug("Could not parse sharpie ID:", sharpieId);

      return;
    }

    var callbacks = getWatchHandlers(eventType, target);

    if (!callbacks) {
      return;
    }

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = callbacks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var cb = _step4.value;
        cb(parsedId, e);
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  };
}

var hoverInDelegate = createHoverDelegate("hoverIn");
var hoverOutDelegate = createHoverDelegate("hoverOut");
var init = false;

function initialize() {
  if (init) {
    return;
  }

  window.addEventListener("mouseup", selectDelegate);
  window.addEventListener("mouseover", hoverInDelegate);
  window.addEventListener("mouseout", hoverOutDelegate);
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

  var registry = eventHandlerRegistry.get(element);
  var ctl = {
    hoverIn: function hoverIn(handler) {
      getEventHandlers(registry, "hoverIn").add(handler);
      return ctl;
    },
    hoverOut: function hoverOut(handler) {
      getEventHandlers(registry, "hoverOut").add(handler);
      return ctl;
    },
    select: function select(handler) {
      getEventHandlers(registry, "select").add(handler);
      return ctl;
    },
    deselect: function deselect(handler) {
      getEventHandlers(registry, "deselect").add(handler);
      return ctl;
    }
  };
  return ctl;
}

exports.watch = watch;

function unwatch(element, eventType, handler) {
  var registry = eventHandlerRegistry.get(element);

  if (!registry) {
    return false;
  }

  if (handler) {
    var handlers = registry.get(eventType);

    if (!handlers) {
      return false;
    }

    var hasHandlerToDrop = handlers.has(handler);
    handlers["delete"](handler);
    return hasHandlerToDrop;
  }

  if (eventType) {
    var hasHandlersToDrop = registry.has(eventType);
    registry["delete"](eventType);
    return hasHandlersToDrop;
  }

  eventHandlerRegistry["delete"](element);
  return true;
}

exports.unwatch = unwatch;

function clearSelection() {
  if (window.getSelection) {
    var sel = window.getSelection();

    if (sel.empty) {
      sel.empty();
    } else if (sel.removeAllRanges) {
      sel.removeAllRanges();
    }
  }
}

exports.clearSelection = clearSelection;

/***/ }),

/***/ "./src/html.ts":
/*!*********************!*\
  !*** ./src/html.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");

var BLOCK_TAGS = new Set(["address", "article", "aside", "blockquote", "details", "dialog", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "table", "ul"]);

function sortOpenings(a, b) {
  var aType = a.annotation.type;
  var bType = b.annotation.type;
  var aTag = a.tagName.toLowerCase();
  var bTag = b.tagName.toLowerCase();

  if (aTag === "p") {
    return -1;
  } else if (bTag === "p") {
    return 1;
  }

  if (aType !== bType) {
    if (aType === "highlight") {
      return 1;
    } else if (bType === "highlight") {
      return -1;
    }
  }

  if (BLOCK_TAGS.has(aTag)) {
    return -1;
  } else if (BLOCK_TAGS.has(bTag)) {
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

function createParagraphAnnotation(start, end, withClass) {
  return {
    start: start,
    end: end,
    type: "markup",
    meta: {
      htmlTagName: "p",
      htmlClassName: withClass ? "auto-para-break" : undefined
    }
  };
}

var STYLE_TO_CSS = {
  "font": "font-family",
  "fontSize": "font-size",
  "color": "color",
  "bgColor": "background-color",
  "opacity": "opacity"
};

function createStyleString(style) {
  var styles = Object.keys(style).map(function (key) {
    var value = style[key];
    var cssKey = STYLE_TO_CSS[key] || key;
    return "".concat(cssKey, ": ").concat(value);
  });

  if (!styles.length) {
    return "";
  }

  return styles.join("; ") + ";";
}

function inferParagraphBreaks(text, opts) {
  var annotations = [];
  var breakPattern = /\n/g;
  var lastPoint = 0;
  var br = null;

  while ((br = breakPattern.exec(text)) !== null) {
    annotations.push(createParagraphAnnotation(lastPoint, br.index, !opts.simpleHTML));
    lastPoint = br.index;
  }

  annotations.push(createParagraphAnnotation(lastPoint, text.length, !opts.simpleHTML));
  return annotations;
}

function getTagName(annotation) {
  var defaultTag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "span";

  if (annotation.meta && annotation.meta.htmlTagName) {
    return annotation.meta.htmlTagName.toLowerCase();
  }

  return defaultTag.toLowerCase();
}

function getFormatObject(annotation) {
  var overrides = annotation.format;

  switch (annotation.type) {
    case "redaction":
      return Object.assign({
        "white-space": "pre-wrap",
        "word-break": "break-word"
      }, overrides);

    default:
      return Object.assign({}, overrides);
  }
}

function openTag(annotation, annotationId, part, opts) {
  var tagName = getTagName(annotation);
  var attrs = [];
  var format = getFormatObject(annotation);

  if (format) {
    var styleString = createStyleString(format);

    if (styleString) {
      attrs.push(["style", createStyleString(format)]);
    }
  }

  if (annotation.meta && annotation.meta.id) {
    attrs.push(["id", annotation.meta.id]);
  }

  var cls = opts.simpleHTML ? [] : ["sharpie-annotation", "sharpie-type-".concat(annotation.type)];

  if (annotation.meta && annotation.meta.htmlClassName) {
    cls.push(annotation.meta.htmlClassName);
  }

  if (cls.length) {
    attrs.push(["class", cls.join(" ")]);
  }

  var metaDataId = opts.simpleHTML ? "" : " ".concat(getMetaDataId(annotationId, part));
  var attrString = attrs.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return "".concat(k, "=\"").concat(v, "\"");
  }).join(" ");
  var attrStringNice = attrString ? " ".concat(attrString) : "";
  return "<".concat(tagName).concat(metaDataId).concat(attrStringNice, ">");
}

function closeTag(annotation, defaultTag) {
  var tagName = getTagName(annotation, defaultTag);
  return "</".concat(tagName, ">");
}

function createPaddedOutputBuffer(text, width, paddingChar) {
  text = text || "";
  var textLength = text.length;
  var length = Math.max(textLength, width);
  var delta = width - textLength;
  var lWidth = delta >> 1;
  var rWidth = delta - lWidth;
  var buf = new Array(length);
  var cursor = 0;

  for (var i = 0; i < lWidth; i++) {
    buf[cursor++] = paddingChar;
  }

  for (var _i2 = 0; _i2 < textLength; _i2++) {
    buf[cursor++] = text[_i2];
  }

  for (var _i3 = 0; _i3 < rWidth; _i3++) {
    buf[cursor++] = paddingChar;
  }

  return buf;
}

function canContain(ancestor, child) {
  var ancestorTag = getTagName(ancestor);
  var childTag = getTagName(child);

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
  return "__metadata_".concat(annotationId, "_").concat(part, "__");
}

function writeMetaData(text, meta) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = meta[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          id = _step$value[0],
          data = _step$value[1];

      var attrs = ["data-sharpie-start=\"".concat(data.start, "\""), "data-sharpie-end=\"".concat(data.end, "\""), "data-sharpie-warp=\"".concat(data.warp, "\""), "data-sharpie-id=\"".concat(data.id, "\"")].join(" ");
      var preamble = text.substring(0, data.outputOffsetPos);
      var postamble = text.substring(data.outputOffsetPos).replace(id, attrs);
      text = preamble + postamble;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return text;
}

function renderToString(text, annotations, opts) {
  if (text === null || text === undefined) {
    util_1._debug("Input missing, bailing out of render");

    return "";
  }

  opts = util_1.defaults(opts, {
    autoParagraph: true,
    simpleHTML: false
  });
  var inferred = [];

  if (opts.autoParagraph) {
    util_1._debug("Generating HTML paragraph break annotations");

    inferred = inferParagraphBreaks(text, opts);
  }

  var ids = new WeakMap();
  var warpMap = new WeakMap();
  annotations.forEach(function (atn, i) {
    return ids.set(atn, "".concat(i));
  });
  inferred.forEach(function (atn, i) {
    return ids.set(atn, "inferred-".concat(i));
  });
  var sorted = [].concat(_toConsumableArray(annotations), _toConsumableArray(inferred)).sort(sortAnnotations);
  var openOrderStack = [];
  var endOrderStack = [];
  var reopen = [];
  var openRedactions = [];
  var nodeMetaCache = new Map();
  var output = "";

  for (var pointer = 0; pointer <= text.length; pointer++) {
    while (endOrderStack.length > 0 && endOrderStack[0].end === pointer) {
      var endTag = endOrderStack[0];

      while (openOrderStack.length > 0) {
        var openedAfter = openOrderStack.shift();
        output += closeTag(openedAfter.annotation);
        nodeMetaCache.get(getMetaDataId(openedAfter.id, openedAfter.part)).end = pointer;
        var i = 0;

        while (i < endOrderStack.length) {
          var candidate = endOrderStack[i];

          if (candidate.end > pointer) {
            break;
          }

          if (candidate === openedAfter.annotation) {
            endOrderStack.splice(i, 1);
          } else {
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
            warp: -1
          });
        }
      }
    }

    var openingQueue = [];

    while (sorted.length > 0 && sorted[0].start === pointer) {
      var atn = sorted.shift();

      if (atn.end <= atn.start) {
        util_1._debug("Ignoring invalid annotation range", atn.start, atn.end);

        continue;
      }

      var tagName = getTagName(atn);
      var invalidContainerIndex = -1;

      for (var _i4 = openOrderStack.length - 1; _i4 >= 0; _i4--) {
        if (!canContain(openOrderStack[_i4].annotation, atn)) {
          invalidContainerIndex = _i4;
          break;
        }
      }

      for (var _i5 = 0; _i5 <= invalidContainerIndex; _i5++) {
        var openedBefore = openOrderStack.shift();
        output += closeTag(openedBefore.annotation);
        nodeMetaCache.get(getMetaDataId(openedBefore.id, openedBefore.part)).end = pointer;
        reopen.unshift({
          annotation: openedBefore.annotation,
          id: openedBefore.id,
          part: openedBefore.part + 1,
          start: pointer,
          end: -1,
          outputOffsetPos: -1,
          warp: -1
        });
        _i5++;
      }

      var warp = 1;
      var redaction = void 0;

      if (atn.type === "redaction") {
        var annotationExtent = atn.end - atn.start;
        var extent = atn.extent ? atn.extent : Math.max(annotationExtent, (atn.content || "").length);
        redaction = {
          redaction: atn,
          output: createPaddedOutputBuffer(atn.content, extent, "&nbsp;"),
          extent: extent,
          cursor: 0
        };
        warp = annotationExtent / extent;
      }

      warpMap.set(atn, warp);
      openingQueue.push({
        annotation: atn,
        tagName: tagName,
        redaction: redaction,
        part: 0
      });
    }

    while (reopen.length > 0) {
      var node = reopen.shift();
      openingQueue.push({
        annotation: node.annotation,
        tagName: getTagName(node.annotation),
        part: node.part
      });
    }

    openingQueue.sort(sortOpenings);

    while (openingQueue.length > 0) {
      var opening = openingQueue.shift();
      var _atn = opening.annotation;

      if (opening.part === 0) {
        util_1.sortedInsert(endOrderStack, _atn, function (a) {
          return a.end;
        });

        if (opening.redaction) {
          openRedactions.unshift(opening.redaction);
        }
      }

      var opened = {
        annotation: _atn,
        id: ids.get(_atn),
        part: opening.part,
        start: pointer,
        end: -1,
        warp: warpMap.get(_atn),
        outputOffsetPos: output.length
      };
      output += openTag(_atn, ids.get(_atn), opening.part, opts);
      var metaDataId = getMetaDataId(opened.id, opened.part);

      if (nodeMetaCache.has(metaDataId)) {
        util_1._error("Overwriting node metadata", metaDataId);
      }

      nodeMetaCache.set(metaDataId, opened);
      openOrderStack.unshift(opened);
    }

    while (openRedactions.length && openRedactions[0].redaction.end === pointer) {
      openRedactions.shift();
    }

    for (var _i6 = 0; _i6 < openRedactions.length; _i6++) {
      var _atn2 = openRedactions[_i6];
      var cursor = _atn2.cursor;
      var pct = (1 + pointer - _atn2.redaction.start) / (_atn2.redaction.end - _atn2.redaction.start);
      var rawPos = pct * _atn2.extent;
      _atn2.cursor = Math.floor(rawPos);
      var needsWrite = _i6 === 0 && _atn2.cursor > cursor;

      while (needsWrite && cursor < _atn2.cursor) {
        output += _atn2.output[cursor++];
      }
    }

    if (openRedactions.length === 0) {
      output += text[pointer] || "";
    }
  }

  var finalOutput = opts.simpleHTML ? output : writeMetaData(output, nodeMetaCache);
  return finalOutput;
}

exports.renderToString = renderToString;

function render(container, text, annotations) {
  var start = Date.now();
  var html = renderToString(text, annotations);

  util_1._debug("Rendered in", Date.now() - start, "ms");

  container.innerHTML = html;
}

exports.render = render;

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var highlight_1 = __webpack_require__(/*! ./highlight */ "./src/highlight.ts");

exports.clearSelection = highlight_1.clearSelection;
exports.watch = highlight_1.watch;
exports.unwatch = highlight_1.unwatch;

var html_1 = __webpack_require__(/*! ./html */ "./src/html.ts");

exports.renderHTML = html_1.render;
exports.renderToString = html_1.renderToString;

/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports._debug = function () {
  if (true) {
    var _console;

    (_console = console).debug.apply(_console, arguments);
  }
};

exports._error = function () {
  if (true) {
    var _console2;

    (_console2 = console).error.apply(_console2, arguments);
  }
};

exports.defaults = function (o, d) {
  if (!o) {
    return Object.assign({}, d);
  }

  return Object.assign({}, d, o);
};

exports.identity = function (x) {
  return x;
};

exports.sortedInsert = function (A, x) {
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : exports.identity;
  var val = key(x);

  if (A.length === 0) {
    A.push(x);
    return;
  }

  var low = 0;
  var high = A.length;

  while (high - low > 1) {
    var mid = low + (high - low >> 1);
    var cmp = key(A[mid]);

    if (val < cmp) {
      high = mid;
    } else {
      low = mid;
    }
  }

  var index = val <= key(A[low]) ? low : high;
  A.splice(index, 0, x);
};

/***/ })

/******/ });
});
//# sourceMappingURL=sharpie.js.map