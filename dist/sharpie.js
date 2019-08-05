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

/***/ "./node_modules/ancestors/index.js":
/*!*****************************************!*\
  !*** ./node_modules/ancestors/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = parents

function parents(node, filter) {
  var out = []

  filter = filter || noop

  do {
    out.push(node)
    node = node.parentNode
  } while(node && node.tagName && filter(node))

  return out.slice(1)
}

function noop(n) {
  return true
}


/***/ }),

/***/ "./node_modules/dom-seek/index.js":
/*!****************************************!*\
  !*** ./node_modules/dom-seek/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib */ "./node_modules/dom-seek/lib/index.js")['default'];


/***/ }),

/***/ "./node_modules/dom-seek/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/dom-seek/lib/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports['default'] = seek;

var _ancestors = __webpack_require__(/*! ancestors */ "./node_modules/ancestors/index.js");

var _ancestors2 = _interopRequireDefault(_ancestors);

var _indexOf = __webpack_require__(/*! index-of */ "./node_modules/index-of/index.js");

var _indexOf2 = _interopRequireDefault(_indexOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.';
var E_WHERE = 'Argument 2 of seek must be a number or a Text Node.';

var SHOW_TEXT = 4;
var TEXT_NODE = 3;

function seek(iter, where) {
  if (iter.whatToShow !== SHOW_TEXT) {
    throw new Error(E_SHOW);
  }

  var count = 0;
  var node = iter.referenceNode;
  var predicates = null;

  if (isNumber(where)) {
    predicates = {
      forward: function forward() {
        return count < where;
      },
      backward: function backward() {
        return count > where;
      }
    };
  } else if (isText(where)) {
    var forward = before(node, where) ? function () {
      return false;
    } : function () {
      return node !== where;
    };
    var backward = function backward() {
      return node != where || !iter.pointerBeforeReferenceNode;
    };
    predicates = { forward: forward, backward: backward };
  } else {
    throw new Error(E_WHERE);
  }

  while (predicates.forward() && (node = iter.nextNode()) !== null) {
    count += node.nodeValue.length;
  }

  while (predicates.backward() && (node = iter.previousNode()) !== null) {
    count -= node.nodeValue.length;
  }

  return count;
}

function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

function isText(node) {
  return node.nodeType === TEXT_NODE;
}

function before(ref, node) {
  if (ref === node) return false;

  var common = null;
  var left = [ref].concat((0, _ancestors2['default'])(ref)).reverse();
  var right = [node].concat((0, _ancestors2['default'])(node)).reverse();

  while (left[0] === right[0]) {
    common = left.shift();
    right.shift();
  }

  left = left[0];
  right = right[0];

  var l = (0, _indexOf2['default'])(common.childNodes, left);
  var r = (0, _indexOf2['default'])(common.childNodes, right);

  return l > r;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzZWVrIiwiRV9TSE9XIiwiRV9XSEVSRSIsIlNIT1dfVEVYVCIsIlRFWFRfTk9ERSIsIml0ZXIiLCJ3aGVyZSIsIndoYXRUb1Nob3ciLCJFcnJvciIsImNvdW50Iiwibm9kZSIsInJlZmVyZW5jZU5vZGUiLCJwcmVkaWNhdGVzIiwiaXNOdW1iZXIiLCJmb3J3YXJkIiwiYmFja3dhcmQiLCJpc1RleHQiLCJiZWZvcmUiLCJwb2ludGVyQmVmb3JlUmVmZXJlbmNlTm9kZSIsIm5leHROb2RlIiwibm9kZVZhbHVlIiwibGVuZ3RoIiwicHJldmlvdXNOb2RlIiwibiIsImlzTmFOIiwicGFyc2VJbnQiLCJpc0Zpbml0ZSIsIm5vZGVUeXBlIiwicmVmIiwiY29tbW9uIiwibGVmdCIsImNvbmNhdCIsInJldmVyc2UiLCJyaWdodCIsInNoaWZ0IiwibCIsImNoaWxkTm9kZXMiLCJyIl0sIm1hcHBpbmdzIjoiOzs7cUJBVXdCQSxJOztBQVZ4Qjs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQyxTQUFTLDBEQUFmO0FBQ0EsSUFBTUMsVUFBVSxxREFBaEI7O0FBRUEsSUFBTUMsWUFBWSxDQUFsQjtBQUNBLElBQU1DLFlBQVksQ0FBbEI7O0FBR2UsU0FBU0osSUFBVCxDQUFjSyxJQUFkLEVBQW9CQyxLQUFwQixFQUEyQjtBQUN4QyxNQUFJRCxLQUFLRSxVQUFMLEtBQW9CSixTQUF4QixFQUFtQztBQUNqQyxVQUFNLElBQUlLLEtBQUosQ0FBVVAsTUFBVixDQUFOO0FBQ0Q7O0FBRUQsTUFBSVEsUUFBUSxDQUFaO0FBQ0EsTUFBSUMsT0FBT0wsS0FBS00sYUFBaEI7QUFDQSxNQUFJQyxhQUFhLElBQWpCOztBQUVBLE1BQUlDLFNBQVNQLEtBQVQsQ0FBSixFQUFxQjtBQUNuQk0saUJBQWE7QUFDWEUsZUFBUztBQUFBLGVBQU1MLFFBQVFILEtBQWQ7QUFBQSxPQURFO0FBRVhTLGdCQUFVO0FBQUEsZUFBTU4sUUFBUUgsS0FBZDtBQUFBO0FBRkMsS0FBYjtBQUlELEdBTEQsTUFLTyxJQUFJVSxPQUFPVixLQUFQLENBQUosRUFBbUI7QUFDeEIsUUFBSVEsVUFBVUcsT0FBT1AsSUFBUCxFQUFhSixLQUFiLElBQXNCO0FBQUEsYUFBTSxLQUFOO0FBQUEsS0FBdEIsR0FBb0M7QUFBQSxhQUFNSSxTQUFTSixLQUFmO0FBQUEsS0FBbEQ7QUFDQSxRQUFJUyxXQUFXLFNBQVhBLFFBQVc7QUFBQSxhQUFNTCxRQUFRSixLQUFSLElBQWlCLENBQUNELEtBQUthLDBCQUE3QjtBQUFBLEtBQWY7QUFDQU4saUJBQWEsRUFBQ0UsZ0JBQUQsRUFBVUMsa0JBQVYsRUFBYjtBQUNELEdBSk0sTUFJQTtBQUNMLFVBQU0sSUFBSVAsS0FBSixDQUFVTixPQUFWLENBQU47QUFDRDs7QUFFRCxTQUFPVSxXQUFXRSxPQUFYLE1BQXdCLENBQUNKLE9BQU9MLEtBQUtjLFFBQUwsRUFBUixNQUE2QixJQUE1RCxFQUFrRTtBQUNoRVYsYUFBU0MsS0FBS1UsU0FBTCxDQUFlQyxNQUF4QjtBQUNEOztBQUVELFNBQU9ULFdBQVdHLFFBQVgsTUFBeUIsQ0FBQ0wsT0FBT0wsS0FBS2lCLFlBQUwsRUFBUixNQUFpQyxJQUFqRSxFQUF1RTtBQUNyRWIsYUFBU0MsS0FBS1UsU0FBTCxDQUFlQyxNQUF4QjtBQUNEOztBQUVELFNBQU9aLEtBQVA7QUFDRDs7QUFHRCxTQUFTSSxRQUFULENBQWtCVSxDQUFsQixFQUFxQjtBQUNuQixTQUFPLENBQUNDLE1BQU1DLFNBQVNGLENBQVQsQ0FBTixDQUFELElBQXVCRyxTQUFTSCxDQUFULENBQTlCO0FBQ0Q7O0FBR0QsU0FBU1AsTUFBVCxDQUFnQk4sSUFBaEIsRUFBc0I7QUFDcEIsU0FBT0EsS0FBS2lCLFFBQUwsS0FBa0J2QixTQUF6QjtBQUNEOztBQUdELFNBQVNhLE1BQVQsQ0FBZ0JXLEdBQWhCLEVBQXFCbEIsSUFBckIsRUFBMkI7QUFDekIsTUFBSWtCLFFBQVFsQixJQUFaLEVBQWtCLE9BQU8sS0FBUDs7QUFFbEIsTUFBSW1CLFNBQVMsSUFBYjtBQUNBLE1BQUlDLE9BQU8sQ0FBQ0YsR0FBRCxFQUFNRyxNQUFOLENBQWEsNEJBQVVILEdBQVYsQ0FBYixFQUE2QkksT0FBN0IsRUFBWDtBQUNBLE1BQUlDLFFBQVEsQ0FBQ3ZCLElBQUQsRUFBT3FCLE1BQVAsQ0FBYyw0QkFBVXJCLElBQVYsQ0FBZCxFQUErQnNCLE9BQS9CLEVBQVo7O0FBRUEsU0FBT0YsS0FBSyxDQUFMLE1BQVlHLE1BQU0sQ0FBTixDQUFuQixFQUE2QjtBQUMzQkosYUFBU0MsS0FBS0ksS0FBTCxFQUFUO0FBQ0FELFVBQU1DLEtBQU47QUFDRDs7QUFFREosU0FBT0EsS0FBSyxDQUFMLENBQVA7QUFDQUcsVUFBUUEsTUFBTSxDQUFOLENBQVI7O0FBRUEsTUFBSUUsSUFBSSwwQkFBUU4sT0FBT08sVUFBZixFQUEyQk4sSUFBM0IsQ0FBUjtBQUNBLE1BQUlPLElBQUksMEJBQVFSLE9BQU9PLFVBQWYsRUFBMkJILEtBQTNCLENBQVI7O0FBRUEsU0FBT0UsSUFBSUUsQ0FBWDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFuY2VzdG9ycyBmcm9tICdhbmNlc3RvcnMnXG5pbXBvcnQgaW5kZXhPZiBmcm9tICdpbmRleC1vZidcblxuY29uc3QgRV9TSE9XID0gJ0FyZ3VtZW50IDEgb2Ygc2VlayBtdXN0IHVzZSBmaWx0ZXIgTm9kZUZpbHRlci5TSE9XX1RFWFQuJ1xuY29uc3QgRV9XSEVSRSA9ICdBcmd1bWVudCAyIG9mIHNlZWsgbXVzdCBiZSBhIG51bWJlciBvciBhIFRleHQgTm9kZS4nXG5cbmNvbnN0IFNIT1dfVEVYVCA9IDRcbmNvbnN0IFRFWFRfTk9ERSA9IDNcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZWVrKGl0ZXIsIHdoZXJlKSB7XG4gIGlmIChpdGVyLndoYXRUb1Nob3cgIT09IFNIT1dfVEVYVCkge1xuICAgIHRocm93IG5ldyBFcnJvcihFX1NIT1cpXG4gIH1cblxuICBsZXQgY291bnQgPSAwXG4gIGxldCBub2RlID0gaXRlci5yZWZlcmVuY2VOb2RlXG4gIGxldCBwcmVkaWNhdGVzID0gbnVsbFxuXG4gIGlmIChpc051bWJlcih3aGVyZSkpIHtcbiAgICBwcmVkaWNhdGVzID0ge1xuICAgICAgZm9yd2FyZDogKCkgPT4gY291bnQgPCB3aGVyZSxcbiAgICAgIGJhY2t3YXJkOiAoKSA9PiBjb3VudCA+IHdoZXJlLFxuICAgIH1cbiAgfSBlbHNlIGlmIChpc1RleHQod2hlcmUpKSB7XG4gICAgbGV0IGZvcndhcmQgPSBiZWZvcmUobm9kZSwgd2hlcmUpID8gKCkgPT4gZmFsc2UgOiAoKSA9PiBub2RlICE9PSB3aGVyZVxuICAgIGxldCBiYWNrd2FyZCA9ICgpID0+IG5vZGUgIT0gd2hlcmUgfHwgIWl0ZXIucG9pbnRlckJlZm9yZVJlZmVyZW5jZU5vZGVcbiAgICBwcmVkaWNhdGVzID0ge2ZvcndhcmQsIGJhY2t3YXJkfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihFX1dIRVJFKVxuICB9XG5cbiAgd2hpbGUgKHByZWRpY2F0ZXMuZm9yd2FyZCgpICYmIChub2RlID0gaXRlci5uZXh0Tm9kZSgpKSAhPT0gbnVsbCkge1xuICAgIGNvdW50ICs9IG5vZGUubm9kZVZhbHVlLmxlbmd0aFxuICB9XG5cbiAgd2hpbGUgKHByZWRpY2F0ZXMuYmFja3dhcmQoKSAmJiAobm9kZSA9IGl0ZXIucHJldmlvdXNOb2RlKCkpICE9PSBudWxsKSB7XG4gICAgY291bnQgLT0gbm9kZS5ub2RlVmFsdWUubGVuZ3RoXG4gIH1cblxuICByZXR1cm4gY291bnRcbn1cblxuXG5mdW5jdGlvbiBpc051bWJlcihuKSB7XG4gIHJldHVybiAhaXNOYU4ocGFyc2VJbnQobikpICYmIGlzRmluaXRlKG4pXG59XG5cblxuZnVuY3Rpb24gaXNUZXh0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IFRFWFRfTk9ERVxufVxuXG5cbmZ1bmN0aW9uIGJlZm9yZShyZWYsIG5vZGUpIHtcbiAgaWYgKHJlZiA9PT0gbm9kZSkgcmV0dXJuIGZhbHNlXG5cbiAgbGV0IGNvbW1vbiA9IG51bGxcbiAgbGV0IGxlZnQgPSBbcmVmXS5jb25jYXQoYW5jZXN0b3JzKHJlZikpLnJldmVyc2UoKVxuICBsZXQgcmlnaHQgPSBbbm9kZV0uY29uY2F0KGFuY2VzdG9ycyhub2RlKSkucmV2ZXJzZSgpXG5cbiAgd2hpbGUgKGxlZnRbMF0gPT09IHJpZ2h0WzBdKSB7XG4gICAgY29tbW9uID0gbGVmdC5zaGlmdCgpXG4gICAgcmlnaHQuc2hpZnQoKVxuICB9XG5cbiAgbGVmdCA9IGxlZnRbMF1cbiAgcmlnaHQgPSByaWdodFswXVxuXG4gIGxldCBsID0gaW5kZXhPZihjb21tb24uY2hpbGROb2RlcywgbGVmdClcbiAgbGV0IHIgPSBpbmRleE9mKGNvbW1vbi5jaGlsZE5vZGVzLCByaWdodClcblxuICByZXR1cm4gbCA+IHJcbn1cbiJdfQ==

/***/ }),

/***/ "./node_modules/get-document/index.js":
/*!********************************************!*\
  !*** ./node_modules/get-document/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * Module exports.
 */

module.exports = getDocument;

// defined by w3c
var DOCUMENT_NODE = 9;

/**
 * Returns `true` if `w` is a Document object, or `false` otherwise.
 *
 * @param {?} d - Document object, maybe
 * @return {Boolean}
 * @private
 */

function isDocument (d) {
  return d && d.nodeType === DOCUMENT_NODE;
}

/**
 * Returns the `document` object associated with the given `node`, which may be
 * a DOM element, the Window object, a Selection, a Range. Basically any DOM
 * object that references the Document in some way, this function will find it.
 *
 * @param {Mixed} node - DOM node, selection, or range in which to find the `document` object
 * @return {Document} the `document` object associated with `node`
 * @public
 */

function getDocument(node) {
  if (isDocument(node)) {
    return node;

  } else if (isDocument(node.ownerDocument)) {
    return node.ownerDocument;

  } else if (isDocument(node.document)) {
    return node.document;

  } else if (node.parentNode) {
    return getDocument(node.parentNode);

  // Range support
  } else if (node.commonAncestorContainer) {
    return getDocument(node.commonAncestorContainer);

  } else if (node.startContainer) {
    return getDocument(node.startContainer);

  // Selection support
  } else if (node.anchorNode) {
    return getDocument(node.anchorNode);
  }
}


/***/ }),

/***/ "./node_modules/index-of/index.js":
/*!****************************************!*\
  !*** ./node_modules/index-of/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * index-of <https://github.com/jonschlinkert/index-of>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */



module.exports = function indexOf(arr, ele, start) {
  start = start || 0;
  var idx = -1;

  if (arr == null) return idx;
  var len = arr.length;
  var i = start < 0
    ? (len + start)
    : start;

  if (i >= arr.length) {
    return -1;
  }

  while (i < len) {
    if (arr[i] === ele) {
      return i;
    }
    i++;
  }

  return -1;
};


/***/ }),

/***/ "./node_modules/simple-xpath-position/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/simple-xpath-position/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/xpath */ "./node_modules/simple-xpath-position/lib/xpath.js")


/***/ }),

/***/ "./node_modules/simple-xpath-position/lib/dom-exception.js":
/*!*****************************************************************!*\
  !*** ./node_modules/simple-xpath-position/lib/dom-exception.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMException = function DOMException(message, name) {
  _classCallCheck(this, DOMException);

  this.message = message;
  this.name = name;
  this.stack = new Error().stack;
};

exports["default"] = DOMException;


DOMException.prototype = new Error();

DOMException.prototype.toString = function () {
  return this.name + ": " + this.message;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb20tZXhjZXB0aW9uLmpzIl0sIm5hbWVzIjpbIkRPTUV4Y2VwdGlvbiIsIm1lc3NhZ2UiLCJuYW1lIiwic3RhY2siLCJFcnJvciIsInByb3RvdHlwZSIsInRvU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBcUJBLFksR0FDbkIsc0JBQVlDLE9BQVosRUFBcUJDLElBQXJCLEVBQTJCO0FBQUE7O0FBQ3pCLE9BQUtELE9BQUwsR0FBZUEsT0FBZjtBQUNBLE9BQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtDLEtBQUwsR0FBYyxJQUFJQyxLQUFKLEVBQUQsQ0FBY0QsS0FBM0I7QUFDRCxDOztxQkFMa0JILFk7OztBQVFyQkEsYUFBYUssU0FBYixHQUF5QixJQUFJRCxLQUFKLEVBQXpCOztBQUVBSixhQUFhSyxTQUFiLENBQXVCQyxRQUF2QixHQUFrQyxZQUFZO0FBQzVDLFNBQVUsS0FBS0osSUFBZixVQUF3QixLQUFLRCxPQUE3QjtBQUNELENBRkQiLCJmaWxlIjoiZG9tLWV4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIG5hbWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrXG4gIH1cbn1cblxuRE9NRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpXG5cbkRPTUV4Y2VwdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBgJHt0aGlzLm5hbWV9OiAke3RoaXMubWVzc2FnZX1gXG59XG4iXX0=

/***/ }),

/***/ "./node_modules/simple-xpath-position/lib/xpath.js":
/*!*********************************************************!*\
  !*** ./node_modules/simple-xpath-position/lib/xpath.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.fromNode = fromNode;
exports.toNode = toNode;

var _getDocument = __webpack_require__(/*! get-document */ "./node_modules/get-document/index.js");

var _getDocument2 = _interopRequireDefault(_getDocument);

var _domException = __webpack_require__(/*! ./dom-exception */ "./node_modules/simple-xpath-position/lib/dom-exception.js");

var _domException2 = _interopRequireDefault(_domException);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// https://developer.mozilla.org/en-US/docs/XPathResult
var FIRST_ORDERED_NODE_TYPE = 9;

// Default namespace for XHTML documents
var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

/**
 * Compute an XPath expression for the given node.
 *
 * If the optional parameter `root` is supplied, the computed XPath expression
 * will be relative to it. Otherwise, the root element is the root of the
 * document to which `node` belongs.
 *
 * @param {Node} node The node for which to compute an XPath expression.
 * @param {Node} [root] The root context for the XPath expression.
 * @returns {string}
 */
function fromNode(node) {
  var root = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  if (node === undefined) {
    throw new Error('missing required parameter "node"');
  }

  root = root || (0, _getDocument2['default'])(node);

  var path = '/';
  while (node !== root) {
    if (!node) {
      var message = 'The supplied node is not contained by the root node.';
      var name = 'InvalidNodeTypeError';
      throw new _domException2['default'](message, name);
    }
    path = '/' + nodeName(node) + '[' + nodePosition(node) + ']' + path;
    node = node.parentNode;
  }
  return path.replace(/\/$/, '');
}

/**
 * Find a node using an XPath relative to the given root node.
 *
 * The XPath expressions are evaluated relative to the Node argument `root`.
 *
 * If the optional parameter `resolver` is supplied, it will be used to resolve
 * any namespaces within the XPath.
 *
 * @param {string} path An XPath String to evaluate.
 * @param {Node} root The root context for the XPath expression.
 * @returns {Node|null} The first matching Node or null if none is found.
 */
function toNode(path, root) {
  var resolver = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (path === undefined) {
    throw new Error('missing required parameter "path"');
  }
  if (root === undefined) {
    throw new Error('missing required parameter "root"');
  }

  // Make the path relative to the root, if not the document.
  var document = (0, _getDocument2['default'])(root);
  if (root !== document) path = path.replace(/^\//, './');

  // Make a default resolver.
  var documentElement = document.documentElement;
  if (resolver === null && documentElement.lookupNamespaceURI) {
    (function () {
      var defaultNS = documentElement.lookupNamespaceURI(null) || HTML_NAMESPACE;
      resolver = function resolver(prefix) {
        var ns = { '_default_': defaultNS };
        return ns[prefix] || documentElement.lookupNamespaceURI(prefix);
      };
    })();
  }

  return resolve(path, root, resolver);
}

// Get the XPath node name.
function nodeName(node) {
  switch (node.nodeName) {
    case '#text':
      return 'text()';
    case '#comment':
      return 'comment()';
    case '#cdata-section':
      return 'cdata-section()';
    default:
      return node.nodeName.toLowerCase();
  }
}

// Get the ordinal position of this node among its siblings of the same name.
function nodePosition(node) {
  var name = node.nodeName;
  var position = 1;
  while (node = node.previousSibling) {
    if (node.nodeName === name) position += 1;
  }
  return position;
}

// Find a single node with XPath `path`
function resolve(path, root, resolver) {
  try {
    // Add a default value to each path part lacking a prefix.
    var nspath = path.replace(/\/(?!\.)([^\/:\(]+)(?=\/|$)/g, '/_default_:$1');
    return platformResolve(nspath, root, resolver);
  } catch (err) {
    return fallbackResolve(path, root);
  }
}

// Find a single node with XPath `path` using the simple, built-in evaluator.
function fallbackResolve(path, root) {
  var steps = path.split("/");
  var node = root;
  while (node) {
    var step = steps.shift();
    if (step === undefined) break;
    if (step === '.') continue;

    var _step$split = step.split(/[\[\]]/);

    var name = _step$split[0];
    var position = _step$split[1];

    name = name.replace('_default_:', '');
    position = position ? parseInt(position) : 1;
    node = findChild(node, name, position);
  }
  return node;
}

// Find a single node with XPath `path` using `document.evaluate`.
function platformResolve(path, root, resolver) {
  var document = (0, _getDocument2['default'])(root);
  var r = document.evaluate(path, root, resolver, FIRST_ORDERED_NODE_TYPE, null);
  return r.singleNodeValue;
}

// Find the child of the given node by name and ordinal position.
function findChild(node, name, position) {
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (nodeName(node) === name && --position === 0) break;
  }
  return node;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy94cGF0aC5qcyJdLCJuYW1lcyI6WyJmcm9tTm9kZSIsInRvTm9kZSIsIkZJUlNUX09SREVSRURfTk9ERV9UWVBFIiwiSFRNTF9OQU1FU1BBQ0UiLCJub2RlIiwicm9vdCIsInVuZGVmaW5lZCIsIkVycm9yIiwicGF0aCIsIm1lc3NhZ2UiLCJuYW1lIiwibm9kZU5hbWUiLCJub2RlUG9zaXRpb24iLCJwYXJlbnROb2RlIiwicmVwbGFjZSIsInJlc29sdmVyIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJsb29rdXBOYW1lc3BhY2VVUkkiLCJkZWZhdWx0TlMiLCJwcmVmaXgiLCJucyIsInJlc29sdmUiLCJ0b0xvd2VyQ2FzZSIsInBvc2l0aW9uIiwicHJldmlvdXNTaWJsaW5nIiwibnNwYXRoIiwicGxhdGZvcm1SZXNvbHZlIiwiZXJyIiwiZmFsbGJhY2tSZXNvbHZlIiwic3RlcHMiLCJzcGxpdCIsInN0ZXAiLCJzaGlmdCIsInBhcnNlSW50IiwiZmluZENoaWxkIiwiciIsImV2YWx1YXRlIiwic2luZ2xlTm9kZVZhbHVlIiwiZmlyc3RDaGlsZCIsIm5leHRTaWJsaW5nIl0sIm1hcHBpbmdzIjoiOzs7UUFzQmdCQSxRLEdBQUFBLFE7UUFpQ0FDLE0sR0FBQUEsTTs7QUF2RGhCOzs7O0FBRUE7Ozs7OztBQUVBO0FBQ0EsSUFBTUMsMEJBQTBCLENBQWhDOztBQUVBO0FBQ0EsSUFBTUMsaUJBQWlCLDhCQUF2Qjs7QUFHQTs7Ozs7Ozs7Ozs7QUFXTyxTQUFTSCxRQUFULENBQWtCSSxJQUFsQixFQUFxQztBQUFBLE1BQWJDLElBQWEseURBQU4sSUFBTTs7QUFDMUMsTUFBSUQsU0FBU0UsU0FBYixFQUF3QjtBQUN0QixVQUFNLElBQUlDLEtBQUosQ0FBVSxtQ0FBVixDQUFOO0FBQ0Q7O0FBRURGLFNBQU9BLFFBQVEsOEJBQVlELElBQVosQ0FBZjs7QUFFQSxNQUFJSSxPQUFPLEdBQVg7QUFDQSxTQUFPSixTQUFTQyxJQUFoQixFQUFzQjtBQUNw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bnQgZnJvbSAnZ2V0LWRvY3VtZW50J1xuXG5pbXBvcnQgRE9NRXhjZXB0aW9uIGZyb20gJy4vZG9tLWV4Y2VwdGlvbidcblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9YUGF0aFJlc3VsdFxuY29uc3QgRklSU1RfT1JERVJFRF9OT0RFX1RZUEUgPSA5XG5cbi8vIERlZmF1bHQgbmFtZXNwYWNlIGZvciBYSFRNTCBkb2N1bWVudHNcbmNvbnN0IEhUTUxfTkFNRVNQQUNFID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnXG5cblxuLyoqXG4gKiBDb21wdXRlIGFuIFhQYXRoIGV4cHJlc3Npb24gZm9yIHRoZSBnaXZlbiBub2RlLlxuICpcbiAqIElmIHRoZSBvcHRpb25hbCBwYXJhbWV0ZXIgYHJvb3RgIGlzIHN1cHBsaWVkLCB0aGUgY29tcHV0ZWQgWFBhdGggZXhwcmVzc2lvblxuICogd2lsbCBiZSByZWxhdGl2ZSB0byBpdC4gT3RoZXJ3aXNlLCB0aGUgcm9vdCBlbGVtZW50IGlzIHRoZSByb290IG9mIHRoZVxuICogZG9jdW1lbnQgdG8gd2hpY2ggYG5vZGVgIGJlbG9uZ3MuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIFRoZSBub2RlIGZvciB3aGljaCB0byBjb21wdXRlIGFuIFhQYXRoIGV4cHJlc3Npb24uXG4gKiBAcGFyYW0ge05vZGV9IFtyb290XSBUaGUgcm9vdCBjb250ZXh0IGZvciB0aGUgWFBhdGggZXhwcmVzc2lvbi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tTm9kZShub2RlLCByb290ID0gbnVsbCkge1xuICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nIHJlcXVpcmVkIHBhcmFtZXRlciBcIm5vZGVcIicpXG4gIH1cblxuICByb290ID0gcm9vdCB8fCBnZXREb2N1bWVudChub2RlKVxuXG4gIGxldCBwYXRoID0gJy8nXG4gIHdoaWxlIChub2RlICE9PSByb290KSB7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICBsZXQgbWVzc2FnZSA9ICdUaGUgc3VwcGxpZWQgbm9kZSBpcyBub3QgY29udGFpbmVkIGJ5IHRoZSByb290IG5vZGUuJ1xuICAgICAgbGV0IG5hbWUgPSAnSW52YWxpZE5vZGVUeXBlRXJyb3InXG4gICAgICB0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKG1lc3NhZ2UsIG5hbWUpXG4gICAgfVxuICAgIHBhdGggPSBgLyR7bm9kZU5hbWUobm9kZSl9WyR7bm9kZVBvc2l0aW9uKG5vZGUpfV0ke3BhdGh9YFxuICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGVcbiAgfVxuICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXC8kLywgJycpXG59XG5cblxuLyoqXG4gKiBGaW5kIGEgbm9kZSB1c2luZyBhbiBYUGF0aCByZWxhdGl2ZSB0byB0aGUgZ2l2ZW4gcm9vdCBub2RlLlxuICpcbiAqIFRoZSBYUGF0aCBleHByZXNzaW9ucyBhcmUgZXZhbHVhdGVkIHJlbGF0aXZlIHRvIHRoZSBOb2RlIGFyZ3VtZW50IGByb290YC5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgcGFyYW1ldGVyIGByZXNvbHZlcmAgaXMgc3VwcGxpZWQsIGl0IHdpbGwgYmUgdXNlZCB0byByZXNvbHZlXG4gKiBhbnkgbmFtZXNwYWNlcyB3aXRoaW4gdGhlIFhQYXRoLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIEFuIFhQYXRoIFN0cmluZyB0byBldmFsdWF0ZS5cbiAqIEBwYXJhbSB7Tm9kZX0gcm9vdCBUaGUgcm9vdCBjb250ZXh0IGZvciB0aGUgWFBhdGggZXhwcmVzc2lvbi5cbiAqIEByZXR1cm5zIHtOb2RlfG51bGx9IFRoZSBmaXJzdCBtYXRjaGluZyBOb2RlIG9yIG51bGwgaWYgbm9uZSBpcyBmb3VuZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvTm9kZShwYXRoLCByb290LCByZXNvbHZlciA9IG51bGwpIHtcbiAgaWYgKHBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbWlzc2luZyByZXF1aXJlZCBwYXJhbWV0ZXIgXCJwYXRoXCInKVxuICB9XG4gIGlmIChyb290ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVyIFwicm9vdFwiJylcbiAgfVxuXG4gIC8vIE1ha2UgdGhlIHBhdGggcmVsYXRpdmUgdG8gdGhlIHJvb3QsIGlmIG5vdCB0aGUgZG9jdW1lbnQuXG4gIGxldCBkb2N1bWVudCA9IGdldERvY3VtZW50KHJvb3QpXG4gIGlmIChyb290ICE9PSBkb2N1bWVudCkgcGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcLy8sICcuLycpXG5cbiAgLy8gTWFrZSBhIGRlZmF1bHQgcmVzb2x2ZXIuXG4gIGxldCBkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbiAgaWYgKHJlc29sdmVyID09PSBudWxsICYmIGRvY3VtZW50RWxlbWVudC5sb29rdXBOYW1lc3BhY2VVUkkpIHtcbiAgICBsZXQgZGVmYXVsdE5TID0gZG9jdW1lbnRFbGVtZW50Lmxvb2t1cE5hbWVzcGFjZVVSSShudWxsKSB8fCBIVE1MX05BTUVTUEFDRVxuICAgIHJlc29sdmVyID0gKHByZWZpeCkgPT4ge1xuICAgICAgbGV0IG5zID0geydfZGVmYXVsdF8nOiBkZWZhdWx0TlN9XG4gICAgICByZXR1cm4gbnNbcHJlZml4XSB8fCBkb2N1bWVudEVsZW1lbnQubG9va3VwTmFtZXNwYWNlVVJJKHByZWZpeClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzb2x2ZShwYXRoLCByb290LCByZXNvbHZlcilcbn1cblxuXG4vLyBHZXQgdGhlIFhQYXRoIG5vZGUgbmFtZS5cbmZ1bmN0aW9uIG5vZGVOYW1lKG5vZGUpIHtcbiAgc3dpdGNoIChub2RlLm5vZGVOYW1lKSB7XG4gIGNhc2UgJyN0ZXh0JzogcmV0dXJuICd0ZXh0KCknXG4gIGNhc2UgJyNjb21tZW50JzogcmV0dXJuICdjb21tZW50KCknXG4gIGNhc2UgJyNjZGF0YS1zZWN0aW9uJzogcmV0dXJuICdjZGF0YS1zZWN0aW9uKCknXG4gIGRlZmF1bHQ6IHJldHVybiBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxufVxuXG5cbi8vIEdldCB0aGUgb3JkaW5hbCBwb3NpdGlvbiBvZiB0aGlzIG5vZGUgYW1vbmcgaXRzIHNpYmxpbmdzIG9mIHRoZSBzYW1lIG5hbWUuXG5mdW5jdGlvbiBub2RlUG9zaXRpb24obm9kZSkge1xuICBsZXQgbmFtZSA9IG5vZGUubm9kZU5hbWVcbiAgbGV0IHBvc2l0aW9uID0gMVxuICB3aGlsZSAoKG5vZGUgPSBub2RlLnByZXZpb3VzU2libGluZykpIHtcbiAgICBpZiAobm9kZS5ub2RlTmFtZSA9PT0gbmFtZSkgcG9zaXRpb24gKz0gMVxuICB9XG4gIHJldHVybiBwb3NpdGlvblxufVxuXG5cbi8vIEZpbmQgYSBzaW5nbGUgbm9kZSB3aXRoIFhQYXRoIGBwYXRoYFxuZnVuY3Rpb24gcmVzb2x2ZShwYXRoLCByb290LCByZXNvbHZlcikge1xuICB0cnkge1xuICAgIC8vIEFkZCBhIGRlZmF1bHQgdmFsdWUgdG8gZWFjaCBwYXRoIHBhcnQgbGFja2luZyBhIHByZWZpeC5cbiAgICBsZXQgbnNwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8oPyFcXC4pKFteXFwvOlxcKF0rKSg/PVxcL3wkKS9nLCAnL19kZWZhdWx0XzokMScpXG4gICAgcmV0dXJuIHBsYXRmb3JtUmVzb2x2ZShuc3BhdGgsIHJvb3QsIHJlc29sdmVyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZmFsbGJhY2tSZXNvbHZlKHBhdGgsIHJvb3QpXG4gIH1cbn1cblxuXG4vLyBGaW5kIGEgc2luZ2xlIG5vZGUgd2l0aCBYUGF0aCBgcGF0aGAgdXNpbmcgdGhlIHNpbXBsZSwgYnVpbHQtaW4gZXZhbHVhdG9yLlxuZnVuY3Rpb24gZmFsbGJhY2tSZXNvbHZlKHBhdGgsIHJvb3QpIHtcbiAgbGV0IHN0ZXBzID0gcGF0aC5zcGxpdChcIi9cIilcbiAgbGV0IG5vZGUgPSByb290XG4gIHdoaWxlIChub2RlKSB7XG4gICAgbGV0IHN0ZXAgPSBzdGVwcy5zaGlmdCgpXG4gICAgaWYgKHN0ZXAgPT09IHVuZGVmaW5lZCkgYnJlYWtcbiAgICBpZiAoc3RlcCA9PT0gJy4nKSBjb250aW51ZVxuICAgIGxldCBbbmFtZSwgcG9zaXRpb25dID0gc3RlcC5zcGxpdCgvW1xcW1xcXV0vKVxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoJ19kZWZhdWx0XzonLCAnJylcbiAgICBwb3NpdGlvbiA9IHBvc2l0aW9uID8gcGFyc2VJbnQocG9zaXRpb24pIDogMVxuICAgIG5vZGUgPSBmaW5kQ2hpbGQobm9kZSwgbmFtZSwgcG9zaXRpb24pXG4gIH1cbiAgcmV0dXJuIG5vZGVcbn1cblxuXG4vLyBGaW5kIGEgc2luZ2xlIG5vZGUgd2l0aCBYUGF0aCBgcGF0aGAgdXNpbmcgYGRvY3VtZW50LmV2YWx1YXRlYC5cbmZ1bmN0aW9uIHBsYXRmb3JtUmVzb2x2ZShwYXRoLCByb290LCByZXNvbHZlcikge1xuICBsZXQgZG9jdW1lbnQgPSBnZXREb2N1bWVudChyb290KVxuICBsZXQgciA9IGRvY3VtZW50LmV2YWx1YXRlKHBhdGgsIHJvb3QsIHJlc29sdmVyLCBGSVJTVF9PUkRFUkVEX05PREVfVFlQRSwgbnVsbClcbiAgcmV0dXJuIHIuc2luZ2xlTm9kZVZhbHVlXG59XG5cblxuLy8gRmluZCB0aGUgY2hpbGQgb2YgdGhlIGdpdmVuIG5vZGUgYnkgbmFtZSBhbmQgb3JkaW5hbCBwb3NpdGlvbi5cbmZ1bmN0aW9uIGZpbmRDaGlsZChub2RlLCBuYW1lLCBwb3NpdGlvbikge1xuICBmb3IgKG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQgOyBub2RlIDsgbm9kZSA9IG5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICBpZiAobm9kZU5hbWUobm9kZSkgPT09IG5hbWUgJiYgLS1wb3NpdGlvbiA9PT0gMCkgYnJlYWtcbiAgfVxuICByZXR1cm4gbm9kZVxufVxuIl19

/***/ }),

/***/ "./node_modules/xpath-range/index.js":
/*!*******************************************!*\
  !*** ./node_modules/xpath-range/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/range */ "./node_modules/xpath-range/lib/range.js")


/***/ }),

/***/ "./node_modules/xpath-range/lib/range.js":
/*!***********************************************!*\
  !*** ./node_modules/xpath-range/lib/range.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.fromRange = fromRange;
exports.toRange = toRange;

var _getDocument = __webpack_require__(/*! get-document */ "./node_modules/get-document/index.js");

var _getDocument2 = _interopRequireDefault(_getDocument);

var _domSeek = __webpack_require__(/*! dom-seek */ "./node_modules/dom-seek/index.js");

var _domSeek2 = _interopRequireDefault(_domSeek);

var _simpleXpathPosition = __webpack_require__(/*! simple-xpath-position */ "./node_modules/simple-xpath-position/index.js");

var xpath = _interopRequireWildcard(_simpleXpathPosition);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var SHOW_TEXT = 4;

/**
 * Convert a `Range` to a pair of XPath expressions and offsets.
 *
 * If the optional parameter `root` is supplied, the computed XPath expressions
 * will be relative to it.
 *
 * @param {Range} range The Range to convert.
 * @param {Node} [root] The root context for the XPath expressions.
 * @returns {{start, startOffset, end, endOffset}}
 */
function fromRange(range, root) {
  var sc = range.startContainer;
  var so = range.startOffset;
  var ec = range.endContainer;
  var eo = range.endOffset;

  var start = xpath.fromNode(sc, root);
  var end = xpath.fromNode(ec, root);

  return {
    start: start,
    end: end,
    startOffset: so,
    endOffset: eo
  };
}

/**
 * Construct a `Range` from the given XPath expressions and offsets.
 *
 * If the optional parameter `root` is supplied, the XPath expressions are
 * evaluated as relative to it.
 *
 * @param {string} startPath An XPath expression for the start container.
 * @param {Number} startOffset The textual offset within the start container.
 * @param {string} endPath An XPath expression for the end container.
 * @param {Number} endOffset The textual offset within the end container.
 * @param {Node} [root] The root context for the XPath expressions.
 * @returns Range
 */
function toRange(startPath, startOffset, endPath, endOffset, root) {
  var document = (0, _getDocument2['default'])(root);

  var sc = xpath.toNode(startPath, root);
  if (sc === null) throw notFound('start');

  var si = document.createNodeIterator(sc, SHOW_TEXT);
  var so = startOffset - (0, _domSeek2['default'])(si, startOffset);

  sc = si.referenceNode;
  if (!si.pointerBeforeReferenceNode) {
    if (so > 0) throw indexSize('start');
    so += sc.length;
  }

  var ec = xpath.toNode(endPath, root);
  if (ec === null) throw notFound('end');

  var ei = document.createNodeIterator(ec, SHOW_TEXT);
  var eo = endOffset - (0, _domSeek2['default'])(ei, endOffset);

  ec = ei.referenceNode;
  if (!ei.pointerBeforeReferenceNode) {
    if (eo > 0) throw indexSize('end');
    eo += ec.length;
  }

  var range = document.createRange();
  range.setStart(sc, so);
  range.setEnd(ec, eo);

  return range;

  function notFound(which) {
    var error = new Error('The ' + which + ' node was not found.');
    error.name = 'NotFoundError';
    return error;
  }

  function indexSize(which) {
    var error = new Error('There is no text at the requested ' + which + ' offset.');
    error.name = 'IndexSizeError';
    return error;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yYW5nZS5qcyJdLCJuYW1lcyI6WyJmcm9tUmFuZ2UiLCJ0b1JhbmdlIiwieHBhdGgiLCJTSE9XX1RFWFQiLCJyYW5nZSIsInJvb3QiLCJzYyIsInN0YXJ0Q29udGFpbmVyIiwic28iLCJzdGFydE9mZnNldCIsImVjIiwiZW5kQ29udGFpbmVyIiwiZW8iLCJlbmRPZmZzZXQiLCJzdGFydCIsImZyb21Ob2RlIiwiZW5kIiwic3RhcnRQYXRoIiwiZW5kUGF0aCIsImRvY3VtZW50IiwidG9Ob2RlIiwibm90Rm91bmQiLCJzaSIsImNyZWF0ZU5vZGVJdGVyYXRvciIsInJlZmVyZW5jZU5vZGUiLCJwb2ludGVyQmVmb3JlUmVmZXJlbmNlTm9kZSIsImluZGV4U2l6ZSIsImxlbmd0aCIsImVpIiwiY3JlYXRlUmFuZ2UiLCJzZXRTdGFydCIsInNldEVuZCIsIndoaWNoIiwiZXJyb3IiLCJFcnJvciIsIm5hbWUiXSwibWFwcGluZ3MiOiI7OztRQWlCZ0JBLFMsR0FBQUEsUztRQStCQUMsTyxHQUFBQSxPOztBQWhEaEI7Ozs7QUFDQTs7OztBQUNBOztJQUFZQyxLOzs7Ozs7QUFFWixJQUFNQyxZQUFZLENBQWxCOztBQUdBOzs7Ozs7Ozs7O0FBVU8sU0FBU0gsU0FBVCxDQUFtQkksS0FBbkIsRUFBMEJDLElBQTFCLEVBQWdDO0FBQ3JDLE1BQUlDLEtBQUtGLE1BQU1HLGNBQWY7QUFDQSxNQUFJQyxLQUFLSixNQUFNSyxXQUFmO0FBQ0EsTUFBSUMsS0FBS04sTUFBTU8sWUFBZjtBQUNBLE1BQUlDLEtBQUtSLE1BQU1TLFNBQWY7O0FBRUEsTUFBSUMsUUFBUVosTUFBTWEsUUFBTixDQUFlVCxFQUFmLEVBQW1CRCxJQUFuQixDQUFaO0FBQ0EsTUFBSVcsTUFBTWQsTUFBTWEsUUFBTixDQUFlTCxFQUFmLEVBQW1CTCxJQUFuQixDQUFWOztBQUVBLFNBQU87QUFDTFMsV0FBT0EsS0FERjtBQUVMRSxTQUFLQSxHQUZBO0FBR0xQLGlCQUFhRCxFQUhSO0FBSUxLLGVBQVdEO0FBSk4sR0FBUDtBQU1EOztBQUdEOzs7Ozs7Ozs7Ozs7O0FBYU8sU0FBU1gsT0FBVCxDQUFpQmdCLFNBQWpCLEVBQTRCUixXQUE1QixFQUF5Q1MsT0FBekMsRUFBa0RMLFNBQWxELEVBQTZEUixJQUE3RCxFQUFtRTtBQUN4RSxNQUFJYyxXQUFXLDhCQUFZZCxJQUFaLENBQWY7O0FBRUEsTUFBSUMsS0FBS0osTUFBTWtCLE1BQU4sQ0FBYUgsU0FBYixFQUF3QlosSUFBeEIsQ0FBVDtBQUNBLE1BQUlDLE9BQU8sSUFBWCxFQUFpQixNQUFNZSxTQUFTLE9BQVQsQ0FBTjs7QUFFakIsTUFBSUMsS0FBS0gsU0FBU0ksa0JBQVQsQ0FBNEJqQixFQUE1QixFQUFnQ0gsU0FBaEMsQ0FBVDtBQUNBLE1BQUlLLEtBQUtDLGNBQWMsMEJBQUthLEVBQUwsRUFBU2IsV0FBVCxDQUF2Qjs7QUFFQUgsT0FBS2dCLEdBQUdFLGFBQVI7QUFDQSxNQUFJLENBQUNGLEdBQUdHLDBCQUFSLEVBQW9DO0FBQ2xDLFFBQUlqQixLQUFLLENBQVQsRUFBWSxNQUFNa0IsVUFBVSxPQUFWLENBQU47QUFDWmxCLFVBQU1GLEdBQUdxQixNQUFUO0FBQ0Q7O0FBRUQsTUFBSWpCLEtBQUtSLE1BQU1rQixNQUFOLENBQWFGLE9BQWIsRUFBc0JiLElBQXRCLENBQVQ7QUFDQSxNQUFJSyxPQUFPLElBQVgsRUFBaUIsTUFBTVcsU0FBUyxLQUFULENBQU47O0FBRWpCLE1BQUlPLEtBQUtULFNBQVNJLGtCQUFULENBQTRCYixFQUE1QixFQUFnQ1AsU0FBaEMsQ0FBVDtBQUNBLE1BQUlTLEtBQUtDLFlBQVksMEJBQUtlLEVBQUwsRUFBU2YsU0FBVCxDQUFyQjs7QUFFQUgsT0FBS2tCLEdBQUdKLGFBQVI7QUFDQSxNQUFJLENBQUNJLEdBQUdILDBCQUFSLEVBQW9DO0FBQ2xDLFFBQUliLEtBQUssQ0FBVCxFQUFZLE1BQU1jLFVBQVUsS0FBVixDQUFOO0FBQ1pkLFVBQU1GLEdBQUdpQixNQUFUO0FBQ0Q7O0FBRUQsTUFBSXZCLFFBQVFlLFNBQVNVLFdBQVQsRUFBWjtBQUNBekIsUUFBTTBCLFFBQU4sQ0FBZXhCLEVBQWYsRUFBbUJFLEVBQW5CO0FBQ0FKLFFBQU0yQixNQUFOLENBQWFyQixFQUFiLEVBQWlCRSxFQUFqQjs7QUFFQSxTQUFPUixLQUFQOztBQUVBLFdBQVNpQixRQUFULENBQWtCVyxLQUFsQixFQUF5QjtBQUN2QixRQUFJQyxRQUFRLElBQUlDLEtBQUosVUFBaUJGLEtBQWpCLDBCQUFaO0FBQ0FDLFVBQU1FLElBQU4sR0FBYSxlQUFiO0FBQ0EsV0FBT0YsS0FBUDtBQUNEOztBQUVELFdBQVNQLFNBQVQsQ0FBbUJNLEtBQW5CLEVBQTBCO0FBQ3hCLFFBQUlDLFFBQVEsSUFBSUMsS0FBSix3Q0FBK0NGLEtBQS9DLGNBQVo7QUFDQUMsVUFBTUUsSUFBTixHQUFhLGdCQUFiO0FBQ0EsV0FBT0YsS0FBUDtBQUNEO0FBQ0YiLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2V0RG9jdW1lbnQgZnJvbSAnZ2V0LWRvY3VtZW50J1xuaW1wb3J0IHNlZWsgZnJvbSAnZG9tLXNlZWsnXG5pbXBvcnQgKiBhcyB4cGF0aCBmcm9tICdzaW1wbGUteHBhdGgtcG9zaXRpb24nXG5cbmNvbnN0IFNIT1dfVEVYVCA9IDRcblxuXG4vKipcbiAqIENvbnZlcnQgYSBgUmFuZ2VgIHRvIGEgcGFpciBvZiBYUGF0aCBleHByZXNzaW9ucyBhbmQgb2Zmc2V0cy5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgcGFyYW1ldGVyIGByb290YCBpcyBzdXBwbGllZCwgdGhlIGNvbXB1dGVkIFhQYXRoIGV4cHJlc3Npb25zXG4gKiB3aWxsIGJlIHJlbGF0aXZlIHRvIGl0LlxuICpcbiAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlIFRoZSBSYW5nZSB0byBjb252ZXJ0LlxuICogQHBhcmFtIHtOb2RlfSBbcm9vdF0gVGhlIHJvb3QgY29udGV4dCBmb3IgdGhlIFhQYXRoIGV4cHJlc3Npb25zLlxuICogQHJldHVybnMge3tzdGFydCwgc3RhcnRPZmZzZXQsIGVuZCwgZW5kT2Zmc2V0fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21SYW5nZShyYW5nZSwgcm9vdCkge1xuICBsZXQgc2MgPSByYW5nZS5zdGFydENvbnRhaW5lclxuICBsZXQgc28gPSByYW5nZS5zdGFydE9mZnNldFxuICBsZXQgZWMgPSByYW5nZS5lbmRDb250YWluZXJcbiAgbGV0IGVvID0gcmFuZ2UuZW5kT2Zmc2V0XG5cbiAgbGV0IHN0YXJ0ID0geHBhdGguZnJvbU5vZGUoc2MsIHJvb3QpXG4gIGxldCBlbmQgPSB4cGF0aC5mcm9tTm9kZShlYywgcm9vdClcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IGVuZCxcbiAgICBzdGFydE9mZnNldDogc28sXG4gICAgZW5kT2Zmc2V0OiBlbyxcbiAgfVxufVxuXG5cbi8qKlxuICogQ29uc3RydWN0IGEgYFJhbmdlYCBmcm9tIHRoZSBnaXZlbiBYUGF0aCBleHByZXNzaW9ucyBhbmQgb2Zmc2V0cy5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgcGFyYW1ldGVyIGByb290YCBpcyBzdXBwbGllZCwgdGhlIFhQYXRoIGV4cHJlc3Npb25zIGFyZVxuICogZXZhbHVhdGVkIGFzIHJlbGF0aXZlIHRvIGl0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdGFydFBhdGggQW4gWFBhdGggZXhwcmVzc2lvbiBmb3IgdGhlIHN0YXJ0IGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydE9mZnNldCBUaGUgdGV4dHVhbCBvZmZzZXQgd2l0aGluIHRoZSBzdGFydCBjb250YWluZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gZW5kUGF0aCBBbiBYUGF0aCBleHByZXNzaW9uIGZvciB0aGUgZW5kIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBlbmRPZmZzZXQgVGhlIHRleHR1YWwgb2Zmc2V0IHdpdGhpbiB0aGUgZW5kIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7Tm9kZX0gW3Jvb3RdIFRoZSByb290IGNvbnRleHQgZm9yIHRoZSBYUGF0aCBleHByZXNzaW9ucy5cbiAqIEByZXR1cm5zIFJhbmdlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1JhbmdlKHN0YXJ0UGF0aCwgc3RhcnRPZmZzZXQsIGVuZFBhdGgsIGVuZE9mZnNldCwgcm9vdCkge1xuICBsZXQgZG9jdW1lbnQgPSBnZXREb2N1bWVudChyb290KVxuXG4gIGxldCBzYyA9IHhwYXRoLnRvTm9kZShzdGFydFBhdGgsIHJvb3QpXG4gIGlmIChzYyA9PT0gbnVsbCkgdGhyb3cgbm90Rm91bmQoJ3N0YXJ0JylcblxuICBsZXQgc2kgPSBkb2N1bWVudC5jcmVhdGVOb2RlSXRlcmF0b3Ioc2MsIFNIT1dfVEVYVClcbiAgbGV0IHNvID0gc3RhcnRPZmZzZXQgLSBzZWVrKHNpLCBzdGFydE9mZnNldClcblxuICBzYyA9IHNpLnJlZmVyZW5jZU5vZGVcbiAgaWYgKCFzaS5wb2ludGVyQmVmb3JlUmVmZXJlbmNlTm9kZSkge1xuICAgIGlmIChzbyA+IDApIHRocm93IGluZGV4U2l6ZSgnc3RhcnQnKVxuICAgIHNvICs9IHNjLmxlbmd0aFxuICB9XG5cbiAgbGV0IGVjID0geHBhdGgudG9Ob2RlKGVuZFBhdGgsIHJvb3QpXG4gIGlmIChlYyA9PT0gbnVsbCkgdGhyb3cgbm90Rm91bmQoJ2VuZCcpXG5cbiAgbGV0IGVpID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKGVjLCBTSE9XX1RFWFQpXG4gIGxldCBlbyA9IGVuZE9mZnNldCAtIHNlZWsoZWksIGVuZE9mZnNldClcblxuICBlYyA9IGVpLnJlZmVyZW5jZU5vZGVcbiAgaWYgKCFlaS5wb2ludGVyQmVmb3JlUmVmZXJlbmNlTm9kZSkge1xuICAgIGlmIChlbyA+IDApIHRocm93IGluZGV4U2l6ZSgnZW5kJylcbiAgICBlbyArPSBlYy5sZW5ndGhcbiAgfVxuXG4gIGxldCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKClcbiAgcmFuZ2Uuc2V0U3RhcnQoc2MsIHNvKVxuICByYW5nZS5zZXRFbmQoZWMsIGVvKVxuXG4gIHJldHVybiByYW5nZVxuXG4gIGZ1bmN0aW9uIG5vdEZvdW5kKHdoaWNoKSB7XG4gICAgbGV0IGVycm9yID0gbmV3IEVycm9yKGBUaGUgJHt3aGljaH0gbm9kZSB3YXMgbm90IGZvdW5kLmApXG4gICAgZXJyb3IubmFtZSA9ICdOb3RGb3VuZEVycm9yJ1xuICAgIHJldHVybiBlcnJvclxuICB9XG5cbiAgZnVuY3Rpb24gaW5kZXhTaXplKHdoaWNoKSB7XG4gICAgbGV0IGVycm9yID0gbmV3IEVycm9yKGBUaGVyZSBpcyBubyB0ZXh0IGF0IHRoZSByZXF1ZXN0ZWQgJHt3aGljaH0gb2Zmc2V0LmApXG4gICAgZXJyb3IubmFtZSA9ICdJbmRleFNpemVFcnJvcidcbiAgICByZXR1cm4gZXJyb3JcbiAgfVxufVxuIl19

/***/ }),

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

var xpr = __webpack_require__(/*! xpath-range */ "./node_modules/xpath-range/index.js");

var watchList = new Map();

function getWatchHandlers(childNode) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = watchList.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var el = _step.value;

      if (el.contains(childNode)) {
        return watchList.get(el);
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

function resolveHandlers(selection) {
  var anchorCBs = getWatchHandlers(selection.anchorNode);

  if (!anchorCBs) {
    util_1._debug("Selection starts outside of watched container");

    return undefined;
  }

  var focusCBs = getWatchHandlers(selection.focusNode);

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

function delegate() {
  var selection = window.getSelection();

  if (selection.isCollapsed) {
    util_1._debug("Ignoring collapsed selection");

    return;
  }

  var callbacks = resolveHandlers(selection);

  if (!callbacks) {
    util_1._debug("Ignoring selection due to overflow");

    return;
  }

  for (var i = 0; i < selection.rangeCount; i++) {
    var range = selection.getRangeAt(i);

    if (range.collapsed) {
      util_1._debug("Ignoring collapsed range");

      continue;
    }

    var extent = getSharpieExtent(range);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = callbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var cb = _step2.value;
        cb(extent);
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
  }
}

var init = false;

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
    var list = watchList.get(element);

    if (!list) {
      return false;
    }

    if (!list.has(handler)) {
      return false;
    }

    list["delete"](handler);
    return true;
  }

  if (!watchList.has(element)) {
    return false;
  }

  watchList["delete"](element);
  return true;
}

exports.unwatch = unwatch;

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

function createParagraphAnnotation(start, end) {
  return {
    start: start,
    end: end,
    type: "markup",
    meta: {
      htmlTagName: "p",
      htmlClassName: "auto-para-break"
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

function inferParagraphBreaks(text) {
  var annotations = [];
  var breakPattern = /\n/g;
  var lastPoint = 0;
  var br = null;

  while ((br = breakPattern.exec(text)) !== null) {
    annotations.push(createParagraphAnnotation(lastPoint, br.index));
    lastPoint = br.index;
  }

  annotations.push(createParagraphAnnotation(lastPoint, text.length));
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

function openTag(annotation, annotationId, part) {
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

  var cls = ["sharpie-annotation", "sharpie-type-".concat(annotation.type)];

  if (annotation.meta && annotation.meta.htmlClassName) {
    cls.push(annotation.meta.htmlClassName);
  }

  attrs.push(["class", cls.join(" ")]);
  var metaDataId = getMetaDataId(annotationId, part);
  var attrString = attrs.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return "".concat(k, "=\"").concat(v, "\"");
  }).join(" ");
  return "<".concat(tagName, " ").concat(metaDataId).concat(attrString ? " " + attrString : "", ">");
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
  opts = util_1.defaults(opts, {
    autoParagraph: true
  });
  var inferred = [];

  if (opts.autoParagraph) {
    util_1._debug("Generating HTML paragraph break annotations");

    inferred = inferParagraphBreaks(text);
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
      output += openTag(_atn, ids.get(_atn), opening.part);
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

  return writeMetaData(output, nodeMetaCache);
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