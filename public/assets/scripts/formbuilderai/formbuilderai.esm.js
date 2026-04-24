/**!
 * Sortable 1.15.6
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

var version = "1.15.6";

function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !! /*@__PURE__*/navigator.userAgent.match(pattern);
  }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

var captureMode = {
  capture: false,
  passive: false
};
function on$1(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}
function off$1(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}
function matches( /**HTMLElement*/el, /**String*/selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));
  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }
  return false;
}
function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}
function closest( /**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;
    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }
      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }
  return null;
}
var R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}
function css(el, prop, val) {
  var style = el && el.style;
  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }
      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }
      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}
function matrix(el, selfOnly) {
  var appliedTransforms = '';
  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, 'transform');
      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */
    } while (!selfOnly && (el = el.parentNode));
  }
  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */
  return matrixFn && new matrixFn(appliedTransforms);
}
function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
      i = 0,
      n = list.length;
    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }
    return list;
  }
  return [];
}
function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}

/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }
  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode;

    // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11
    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect();

          // Set relative to edges of padding box of container
          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */
      } while (container = container.parentNode);
    }
  }
  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
      scaleX = elMatrix && elMatrix.a,
      scaleY = elMatrix && elMatrix.d;
    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }
  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}

/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */
function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
    elSideVal = getRect(el)[elSide];

  /* jshint boss:true */
  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
      visible = void 0;
    {
      visible = elSideVal >= parentSideVal;
    }
    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }
  return false;
}

/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */
function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0,
    i = 0,
    children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }
    i++;
  }
  return null;
}

/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */
function lastChild(el, selector) {
  var last = el.lastElementChild;
  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }
  return last || null;
}

/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */
function index(el, selector) {
  var index = 0;
  if (!el || !el.parentNode) {
    return -1;
  }

  /* jshint boss:true */
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }
  return index;
}

/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */
function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
    offsetTop = 0,
    winScroller = getWindowScrollingElement();
  if (el) {
    do {
      var elMatrix = matrix(el),
        scaleX = elMatrix.a,
        scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }
  return [offsetLeft, offsetTop];
}

/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */
function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }
  return -1;
}
function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;
  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);
      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */
  } while (elem = elem.parentNode);
  return getWindowScrollingElement();
}
function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}
function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}
var _throttleTimeout;
function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
        _this = this;
      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }
      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}
function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}
function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}
function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;
  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}
function getChildContainingRectFromElement(container, options, ghostEl) {
  var rect = {};
  Array.from(container.children).forEach(function (child) {
    var _rect$left, _rect$top, _rect$right, _rect$bottom;
    if (!closest(child, options.draggable, container, false) || child.animated || child === ghostEl) return;
    var childRect = getRect(child);
    rect.left = Math.min((_rect$left = rect.left) !== null && _rect$left !== void 0 ? _rect$left : Infinity, childRect.left);
    rect.top = Math.min((_rect$top = rect.top) !== null && _rect$top !== void 0 ? _rect$top : Infinity, childRect.top);
    rect.right = Math.max((_rect$right = rect.right) !== null && _rect$right !== void 0 ? _rect$right : -Infinity, childRect.right);
    rect.bottom = Math.max((_rect$bottom = rect.bottom) !== null && _rect$bottom !== void 0 ? _rect$bottom : -Infinity, childRect.bottom);
  });
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
var expando = 'Sortable' + new Date().getTime();

function AnimationStateManager() {
  var animationStates = [],
    animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });
        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);

        // If animating: compensate for current animation
        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }
        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }
      var animating = false,
        animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
          target = state.target,
          fromRect = target.fromRect,
          toRect = getRect(target),
          prevFromRect = target.prevFromRect,
          prevToRect = target.prevToRect,
          animatingRect = state.rect,
          targetMatrix = matrix(target, true);
        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }
        target.toRect = toRect;
        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) &&
          // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        }

        // if fromRect != toRect: animate
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;
          if (!time) {
            time = _this.options.animation;
          }
          _this.animate(target, animatingRect, toRect, time);
        }
        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);
      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }
      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, 'transition', '');
        css(target, 'transform', '');
        var elMatrix = matrix(this.el),
          scaleX = elMatrix && elMatrix.a,
          scaleY = elMatrix && elMatrix.d,
          translateX = (currentRect.left - toRect.left) / (scaleX || 1),
          translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        this.forRepaintDummy = repaint(target); // repaint

        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, 'transition', '');
          css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}
function repaint(target) {
  return target.offsetWidth;
}
function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }
    plugins.forEach(function (p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;
    this.eventCanceled = false;
    evt.cancel = function () {
      _this.eventCanceled = true;
    };
    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return;
      // Fire global events if it exists in this sortable
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable: sortable
        }, evt));
      }

      // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;

      // Add default options from plugin
      _extends(defaults, initialized.defaults);
    });
    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);
      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;
      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return;

      // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
    rootEl = _ref.rootEl,
    name = _ref.name,
    targetEl = _ref.targetEl,
    cloneEl = _ref.cloneEl,
    toEl = _ref.toEl,
    fromEl = _ref.fromEl,
    oldIndex = _ref.oldIndex,
    newIndex = _ref.newIndex,
    oldDraggableIndex = _ref.oldDraggableIndex,
    newDraggableIndex = _ref.newDraggableIndex,
    originalEvent = _ref.originalEvent,
    putSortable = _ref.putSortable,
    extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
    options = sortable.options,
    onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  // Support for new CustomEvent feature
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;
  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }
  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

var _excluded = ["evt"];
var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    originalEvent = _ref.evt,
    data = _objectWithoutProperties(_ref, _excluded);
  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};
function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}
var dragEl,
  parentEl,
  ghostEl,
  rootEl,
  nextEl,
  lastDownEl,
  cloneEl,
  cloneHidden,
  oldIndex,
  newIndex,
  oldDraggableIndex,
  newDraggableIndex,
  activeGroup,
  putSortable,
  awaitingDragStarted = false,
  ignoreNextClick = false,
  sortables = [],
  tapEvt,
  touchEvt,
  lastDx,
  lastDy,
  tapDistanceLeft,
  tapDistanceTop,
  moved,
  lastTarget,
  lastDirection,
  pastFirstInvertThresh = false,
  isCircumstantialInvert = false,
  targetMoveDistance,
  // For positioning ghost absolutely
  ghostRelativeParent,
  ghostRelativeParentInitialScroll = [],
  // (left, top)

  _silent = false,
  savedInputChecked = [];

/** @const */
var documentExists = typeof document !== 'undefined',
  PositionGhostAbsolutely = IOS,
  CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
  // This will not pass for IE9, because IE9 DnD only works on anchors
  supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
  supportCssPointerEvents = function () {
    if (!documentExists) return;
    // false when <= IE11
    if (IE11OrLess) {
      return false;
    }
    var el = document.createElement('x');
    el.style.cssText = 'pointer-events:auto';
    return el.style.pointerEvents === 'auto';
  }(),
  _detectDirection = function _detectDirection(el, options) {
    var elCSS = css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
    if (elCSS.display === 'flex') {
      return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
    }
    if (elCSS.display === 'grid') {
      return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
    }
    if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
      var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
      return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
    }
    return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
  },
  _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
    var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
    return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
  },
  /**
   * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
   * @param  {Number} x      X position
   * @param  {Number} y      Y position
   * @return {HTMLElement}   Element of the first found nearest Sortable
   */
  _detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
    var ret;
    sortables.some(function (sortable) {
      var threshold = sortable[expando].options.emptyInsertThreshold;
      if (!threshold || lastChild(sortable)) return;
      var rect = getRect(sortable),
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
      if (insideHorizontally && insideVertically) {
        return ret = sortable;
      }
    });
    return ret;
  },
  _prepareGroup = function _prepareGroup(options) {
    function toFn(value, pull) {
      return function (to, from, dragEl, evt) {
        var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
        if (value == null && (pull || sameGroup)) {
          // Default pull value
          // Default pull and put value if same group
          return true;
        } else if (value == null || value === false) {
          return false;
        } else if (pull && value === 'clone') {
          return value;
        } else if (typeof value === 'function') {
          return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
        } else {
          var otherGroup = (pull ? to : from).options.group.name;
          return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
        }
      };
    }
    var group = {};
    var originalGroup = options.group;
    if (!originalGroup || _typeof(originalGroup) != 'object') {
      originalGroup = {
        name: originalGroup
      };
    }
    group.name = originalGroup.name;
    group.checkPull = toFn(originalGroup.pull, true);
    group.checkPut = toFn(originalGroup.put);
    group.revertClone = originalGroup.revertClone;
    options.group = group;
  },
  _hideGhostForTarget = function _hideGhostForTarget() {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, 'display', 'none');
    }
  },
  _unhideGhostForTarget = function _unhideGhostForTarget() {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, 'display', '');
    }
  };

// #1184 fix - Prevent click event on fallback if dragged but item not changed position
if (documentExists && !ChromeForAndroid) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}
var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
    if (nearest) {
      // Create imitation event
      var event = {};
      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }
      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;
      nearest[expando]._onDragOver(event);
    }
  }
};
var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};

/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */
function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }
  this.el = el; // root element
  this.options = options = _extends({}, options);

  // Export instance
  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    // Disabled on Safari: #1571; Enabled on Safari IOS: #2244
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window && (!Safari || IOS),
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults);

  // Set default options
  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }
  _prepareGroup(options);

  // Bind all private methods
  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  }

  // Setup drag mode
  this.nativeDraggable = options.forceFallback ? false : supportDraggable;
  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  }

  // Bind events
  if (options.supportPointer) {
    on$1(el, 'pointerdown', this._onTapStart);
  } else {
    on$1(el, 'mousedown', this._onTapStart);
    on$1(el, 'touchstart', this._onTapStart);
  }
  if (this.nativeDraggable) {
    on$1(el, 'dragover', this);
    on$1(el, 'dragenter', this);
  }
  sortables.push(this.el);

  // Restore sorting
  options.store && options.store.get && this.sort(options.store.get(this) || []);

  // Add animation state manager
  _extends(this, AnimationStateManager());
}
Sortable.prototype = /** @lends Sortable.prototype */{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart( /** Event|TouchEvent */evt) {
    if (!evt.cancelable) return;
    var _this = this,
      el = this.el,
      options = this.options,
      preventOnFilter = options.preventOnFilter,
      type = evt.type,
      touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
      target = (touch || evt).target,
      originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
      filter = options.filter;
    _saveInputCheckedState(el);

    // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
    if (dragEl) {
      return;
    }
    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    }

    // cancel dnd if original target is content editable
    if (originalTarget.isContentEditable) {
      return;
    }

    // Safari ignores further event handling after mousedown
    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT') {
      return;
    }
    target = closest(target, options.draggable, el, false);
    if (target && target.animated) {
      return;
    }
    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    }

    // Get the index of the dragged element within its parent
    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable);

    // Check filter
    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);
        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });
      if (filter) {
        preventOnFilter && evt.preventDefault();
        return; // cancel dnd
      }
    }
    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    }

    // Prepare `dragstart`
    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart( /** Event */evt, /** Touch */touch, /** HTMLElement */target) {
    var _this = this,
      el = _this.el,
      options = _this.options,
      ownerDocument = el.ownerDocument,
      dragStartFn;
    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';
      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });
        if (Sortable.eventCanceled) {
          _this._onDrop();
          return;
        }
        // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove
        _this._disableDelayedDragEvents();
        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        }

        // Bind the events: dragstart/dragend
        _this._triggerDragStart(evt, touch);

        // Drag start event
        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        });

        // Chosen item
        toggleClass(dragEl, options.chosenClass, true);
      };

      // Disable "draggable"
      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on$1(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on$1(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on$1(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      if (options.supportPointer) {
        on$1(ownerDocument, 'pointerup', _this._onDrop);
        // Native D&D triggers pointercancel
        !this.nativeDraggable && on$1(ownerDocument, 'pointercancel', _this._onDrop);
      } else {
        on$1(ownerDocument, 'mouseup', _this._onDrop);
        on$1(ownerDocument, 'touchend', _this._onDrop);
        on$1(ownerDocument, 'touchcancel', _this._onDrop);
      }

      // Make dragEl draggable (must be before delay for FireFox)
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }
      pluginEvent('delayStart', this, {
        evt: evt
      });

      // Delay is impossible for native DnD in Edge or IE
      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag
        if (options.supportPointer) {
          on$1(ownerDocument, 'pointerup', _this._disableDelayedDrag);
          on$1(ownerDocument, 'pointercancel', _this._disableDelayedDrag);
        } else {
          on$1(ownerDocument, 'mouseup', _this._disableDelayedDrag);
          on$1(ownerDocument, 'touchend', _this._disableDelayedDrag);
          on$1(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        }
        on$1(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on$1(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on$1(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler( /** TouchEvent|PointerEvent **/e) {
    var touch = e.touches ? e.touches[0] : e;
    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);
    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off$1(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off$1(ownerDocument, 'touchend', this._disableDelayedDrag);
    off$1(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off$1(ownerDocument, 'pointerup', this._disableDelayedDrag);
    off$1(ownerDocument, 'pointercancel', this._disableDelayedDrag);
    off$1(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off$1(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off$1(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart( /** Event */evt, /** Touch */touch) {
    touch = touch || evt.pointerType == 'touch' && evt;
    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on$1(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on$1(document, 'touchmove', this._onTouchMove);
      } else {
        on$1(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on$1(dragEl, 'dragend', this);
      on$1(rootEl, 'dragstart', this._onDragStart);
    }
    try {
      if (document.selection) {
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });
      if (this.nativeDraggable) {
        on$1(document, 'dragover', _checkOutsideTargetEl);
      }
      var options = this.options;

      // Apply effect
      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost();

      // Drag start event
      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;
      _hideGhostForTarget();
      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;
      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }
      dragEl.parentNode[expando]._isOutsideThisEl(target);
      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });
            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }
          target = parent; // store last element
        }
        /* jshint boss:true */ while (parent = getParentOrHost(parent));
      }
      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove( /**TouchEvent*/evt) {
    if (tapEvt) {
      var options = this.options,
        fallbackTolerance = options.fallbackTolerance,
        fallbackOffset = options.fallbackOffset,
        touch = evt.touches ? evt.touches[0] : evt,
        ghostMatrix = ghostEl && matrix(ghostEl, true),
        scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
        scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
        relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
        dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
        dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);

      // only set the status to dragging, when we are actually dragging
      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }
        this._onDragStart(evt, true);
      }
      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }
        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, 'webkitTransform', cssMatrix);
        css(ghostEl, 'mozTransform', cssMatrix);
        css(ghostEl, 'msTransform', cssMatrix);
        css(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }
      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
        rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
        options = this.options;

      // Position absolutely
      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;
        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }
        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }
      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, 'transition', '');
      css(ghostEl, 'transform', '');
      css(ghostEl, 'box-sizing', 'border-box');
      css(ghostEl, 'margin', 0);
      css(ghostEl, 'top', rect.top);
      css(ghostEl, 'left', rect.left);
      css(ghostEl, 'width', rect.width);
      css(ghostEl, 'height', rect.height);
      css(ghostEl, 'opacity', '0.8');
      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css(ghostEl, 'zIndex', '100000');
      css(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl);

      // Set transform-origin
      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart( /**Event*/evt, /**boolean*/fallback) {
    var _this = this;
    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }
    pluginEvent('setupClone', this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';
      this._hideClone();
      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }

    // #1143: IFrame support workaround
    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;
      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();
      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true);

    // Set proper drop events
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off$1(document, 'mouseup', _this._onDrop);
      off$1(document, 'touchend', _this._onDrop);
      off$1(document, 'touchcancel', _this._onDrop);
      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }
      on$1(document, 'drop', _this);

      // #1276 fix:
      css(dragEl, 'transform', 'translateZ(0)');
    }
    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on$1(document, 'selectstart', _this);
    moved = true;
    window.getSelection().removeAllRanges();
    if (Safari) {
      css(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver( /**Event*/evt) {
    var el = this.el,
      target = evt.target,
      dragRect,
      targetRect,
      revert,
      options = this.options,
      group = options.group,
      activeSortable = Sortable.active,
      isOwner = activeGroup === group,
      canSort = options.sort,
      fromSortable = putSortable || activeSortable,
      vertical,
      _this = this,
      completedFired = false;
    if (_silent) return;
    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread2({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    }

    // Capture animation state
    function capture() {
      dragOverEvent('dragOverAnimationCapture');
      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }

    // Return invocation when dragEl is inserted (or completed)
    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });
      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }
        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }
        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        }

        // Animation
        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }
        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }

      // Null lastTarget if it is not inside a previously swapped element
      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      }

      // no bubbling and not fallback
      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);

        // Do not detect for empty insert if already inserted
        !insertion && nearestEmptyInsertDetectEvent(evt);
      }
      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    }

    // Call when dragEl has been inserted
    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }
    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }
    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;
    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }
    ignoreNextClick = false;
    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;
      if (revert) {
        parentEl = rootEl; // actualization
        capture();
        this._hideClone();
        dragOverEvent('revert');
        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }
        return completed(true);
      }
      var elLastChild = lastChild(el, options.draggable);
      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // Insert to end of list

        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        }

        // if there is a last element, it is the target
        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }
        if (target) {
          targetRect = getRect(target);
        }
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          if (elLastChild && elLastChild.nextSibling) {
            // the last draggable element is not the last node
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        // Insert to start of list
        var firstChild = getChild(el, 0, options, true);
        if (firstChild === dragEl) {
          return completed(false);
        }
        target = firstChild;
        targetRect = getRect(target);
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
          targetBeforeFirstSwap,
          differentLevel = dragEl.parentNode !== el,
          differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
          side1 = vertical ? 'top' : 'left',
          scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
          scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }
        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;
        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);
          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
        }
        // If dragEl is already beside target: Do not insert
        if (direction === 0 || sibling === target) {
          return completed(false);
        }
        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
          after = false;
        after = direction === 1;
        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }
          _silent = true;
          setTimeout(_unsilent, 30);
          capture();
          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }

          // Undo chrome's scroll adjustment (has no effect on other browsers)
          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }
          parentEl = dragEl.parentNode; // actualization

          // must be done before animation
          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }
          changed();
          return completed(true);
        }
      }
      if (el.contains(dragEl)) {
        return completed(false);
      }
    }
    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off$1(document, 'mousemove', this._onTouchMove);
    off$1(document, 'touchmove', this._onTouchMove);
    off$1(document, 'pointermove', this._onTouchMove);
    off$1(document, 'dragover', nearestEmptyInsertDetectEvent);
    off$1(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off$1(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off$1(ownerDocument, 'mouseup', this._onDrop);
    off$1(ownerDocument, 'touchend', this._onDrop);
    off$1(ownerDocument, 'pointerup', this._onDrop);
    off$1(ownerDocument, 'pointercancel', this._onDrop);
    off$1(ownerDocument, 'touchcancel', this._onDrop);
    off$1(document, 'selectstart', this);
  },
  _onDrop: function _onDrop( /**Event*/evt) {
    var el = this.el,
      options = this.options;

    // Get the index of the dragged element within its parent
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode;

    // Get again after plugin event
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    if (Sortable.eventCanceled) {
      this._nulling();
      return;
    }
    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    _cancelNextTick(this.cloneId);
    _cancelNextTick(this._dragStartId);

    // Unbind events
    if (this.nativeDraggable) {
      off$1(document, 'drop', this);
      off$1(el, 'dragstart', this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();
    if (Safari) {
      css(document.body, 'user-select', '');
    }
    css(dragEl, 'transform', '');
    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }
      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }
      if (dragEl) {
        if (this.nativeDraggable) {
          off$1(dragEl, 'dragend', this);
        }
        _disableDraggable(dragEl);
        dragEl.style['will-change'] = '';

        // Remove classes
        // ghostClass is added in dragStarted
        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass(dragEl, this.options.chosenClass, false);

        // Drag stop event
        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });
        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            // Remove event
            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            });

            // drag from one list and drop into another
            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }
          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }
        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }
          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          });

          // Save sorting
          this.save();
        }
      }
    }
    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent( /**Event*/evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);
        break;
      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;
      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
      el,
      children = this.el.children,
      i = 0,
      n = children.length,
      options = this.options;
    for (; i < n; i++) {
      el = children[i];
      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }
    return order;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {},
      rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];
      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;
    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);
      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }
      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },
  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off$1(el, 'mousedown', this._onTapStart);
    off$1(el, 'touchstart', this._onTapStart);
    off$1(el, 'pointerdown', this._onTapStart);
    if (this.nativeDraggable) {
      off$1(el, 'dragover', this);
      off$1(el, 'dragenter', this);
    }
    // Remove draggable attributes
    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });
    this._onDrop();
    this._disableDelayedDragEvents();
    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, 'display', 'none');
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();
      return;
    }
    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return;

      // show clone at dragEl or original position
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }
      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }
      css(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};
function _globalDragOver( /**Event*/evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }
  evt.cancelable && evt.preventDefault();
}
function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
    sortable = fromEl[expando],
    onMoveFn = sortable.options.onMove,
    retVal;
  // Support for new CustomEvent feature
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }
  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);
  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }
  return retVal;
}
function _disableDraggable(el) {
  el.draggable = false;
}
function _unsilent() {
  _silent = false;
}
function _ghostIsFirst(evt, vertical, sortable) {
  var firstElRect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
  var spacer = 10;
  return vertical ? evt.clientX < childContainingRect.left - spacer || evt.clientY < firstElRect.top && evt.clientX < firstElRect.right : evt.clientY < childContainingRect.top - spacer || evt.clientY < firstElRect.bottom && evt.clientX < firstElRect.left;
}
function _ghostIsLast(evt, vertical, sortable) {
  var lastElRect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
  var spacer = 10;
  return vertical ? evt.clientX > childContainingRect.right + spacer || evt.clientY > lastElRect.bottom && evt.clientX > lastElRect.left : evt.clientY > childContainingRect.bottom + spacer || evt.clientX > lastElRect.right && evt.clientY > lastElRect.top;
}
function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
    targetLength = vertical ? targetRect.height : targetRect.width,
    targetS1 = vertical ? targetRect.top : targetRect.left,
    targetS2 = vertical ? targetRect.bottom : targetRect.right,
    invert = false;
  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }
      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }
  invert = invert || invertSwap;
  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }
  return 0;
}

/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */
function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}

/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */
function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
    i = str.length,
    sum = 0;
  while (i--) {
    sum += str.charCodeAt(i);
  }
  return sum.toString(36);
}
function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;
  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}
function _nextTick(fn) {
  return setTimeout(fn, 0);
}
function _cancelNextTick(id) {
  return clearTimeout(id);
}

// Fixed #973:
if (documentExists) {
  on$1(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
}

// Export utils
Sortable.utils = {
  on: on$1,
  off: off$1,
  css: css,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild,
  expando: expando
};

/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */
Sortable.get = function (element) {
  return element[expando];
};

/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */
Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }
  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }
    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};

/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */
Sortable.create = function (el, options) {
  return new Sortable(el, options);
};

// Export
Sortable.version = version;

var autoScrolls = [],
  scrollEl,
  scrollRootEl,
  scrolling = false,
  lastAutoScrollX,
  lastAutoScrollY,
  touchEvt$1,
  pointerElemChangedInterval;
function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    };

    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }
  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;
      if (this.sortable.nativeDraggable) {
        on$1(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on$1(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on$1(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on$1(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;
      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off$1(document, 'dragover', this._handleAutoScroll);
      } else {
        off$1(document, 'pointermove', this._handleFallbackAutoScroll);
        off$1(document, 'touchmove', this._handleFallbackAutoScroll);
        off$1(document, 'mousemove', this._handleFallbackAutoScroll);
      }
      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;
      var x = (evt.touches ? evt.touches[0] : evt).clientX,
        y = (evt.touches ? evt.touches[0] : evt).clientY,
        elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt;

      // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good
      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);

        // Listener for pointer element change
        var ogElemScroller = getParentAutoScrollElement(elem, true);
        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          // Detect for pointer elem change, emulating native DnD behaviour
          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }
        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}
function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}
function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}
var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
    y = (evt.touches ? evt.touches[0] : evt).clientY,
    sens = options.scrollSensitivity,
    speed = options.scrollSpeed,
    winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
    scrollCustomFn;

  // New scroll root, set scrollEl
  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;
    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }
  var layersOut = 0;
  var currentParent = scrollEl;
  do {
    var el = currentParent,
      rect = getRect(el),
      top = rect.top,
      bottom = rect.bottom,
      left = rect.left,
      right = rect.right,
      width = rect.width,
      height = rect.height,
      canScrollX = void 0,
      canScrollY = void 0,
      scrollWidth = el.scrollWidth,
      scrollHeight = el.scrollHeight,
      elCSS = css(el),
      scrollPosX = el.scrollLeft,
      scrollPosY = el.scrollTop;
    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }
    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }
    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);
      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */
        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely
          }
          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }
          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
    putSortable = _ref.putSortable,
    dragEl = _ref.dragEl,
    activeSortable = _ref.activeSortable,
    dispatchSortableEvent = _ref.dispatchSortableEvent,
    hideGhostForTarget = _ref.hideGhostForTarget,
    unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};
function Revert() {}
Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
      putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();
    if (putSortable) {
      putSortable.captureAnimationState();
    }
    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }
    this.sortable.animateAll();
    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};
_extends(Revert, {
  pluginName: 'revertOnSpill'
});
function Remove() {}
Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
      putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};
_extends(Remove, {
  pluginName: 'removeOnSpill'
});

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

/**
 * marked v15.0.11 - a markdown parser
 * Copyright (c) 2011-2025, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */

/**
 * Gets the original marked default options.
 */
function _getDefaults() {
    return {
        async: false,
        breaks: false,
        extensions: null,
        gfm: true,
        hooks: null,
        pedantic: false,
        renderer: null,
        silent: false,
        tokenizer: null,
        walkTokens: null,
    };
}
let _defaults = _getDefaults();
function changeDefaults(newDefaults) {
    _defaults = newDefaults;
}

const noopTest = { exec: () => null };
function edit(regex, opt = '') {
    let source = typeof regex === 'string' ? regex : regex.source;
    const obj = {
        replace: (name, val) => {
            let valSource = typeof val === 'string' ? val : val.source;
            valSource = valSource.replace(other.caret, '$1');
            source = source.replace(name, valSource);
            return obj;
        },
        getRegex: () => {
            return new RegExp(source, opt);
        },
    };
    return obj;
}
const other = {
    codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
    outputLinkReplace: /\\([\[\]])/g,
    indentCodeCompensation: /^(\s+)(?:```)/,
    beginningSpace: /^\s+/,
    endingHash: /#$/,
    startingSpaceChar: /^ /,
    endingSpaceChar: / $/,
    nonSpaceChar: /[^ ]/,
    newLineCharGlobal: /\n/g,
    tabCharGlobal: /\t/g,
    multipleSpaceGlobal: /\s+/g,
    blankLine: /^[ \t]*$/,
    doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
    blockquoteStart: /^ {0,3}>/,
    blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
    blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
    listReplaceTabs: /^\t+/,
    listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
    listIsTask: /^\[[ xX]\] /,
    listReplaceTask: /^\[[ xX]\] +/,
    anyLine: /\n.*\n/,
    hrefBrackets: /^<(.*)>$/,
    tableDelimiter: /[:|]/,
    tableAlignChars: /^\||\| *$/g,
    tableRowBlankLine: /\n[ \t]*$/,
    tableAlignRight: /^ *-+: *$/,
    tableAlignCenter: /^ *:-+: *$/,
    tableAlignLeft: /^ *:-+ *$/,
    startATag: /^<a /i,
    endATag: /^<\/a>/i,
    startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
    endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
    startAngleBracket: /^</,
    endAngleBracket: />$/,
    pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
    unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
    escapeTest: /[&<>"']/,
    escapeReplace: /[&<>"']/g,
    escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
    unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
    caret: /(^|[^\[])\^/g,
    percentDecode: /%25/g,
    findPipe: /\|/g,
    splitPipe: / \|/,
    slashPipe: /\\\|/g,
    carriageReturn: /\r\n|\r/g,
    spaceLine: /^ +$/gm,
    notSpaceStart: /^\S*/,
    endingNewline: /\n$/,
    listItemRegex: (bull) => new RegExp(`^( {0,3}${bull})((?:[\t ][^\\n]*)?(?:\\n|$))`),
    nextBulletRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`),
    hrRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
    fencesBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`),
    headingBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`),
    htmlBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, 'i'),
};
/**
 * Block-Level Grammar
 */
const newline = /^(?:[ \t]*(?:\n|$))+/;
const blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
const fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
const hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
const heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
const bullet = /(?:[*+-]|\d{1,9}[.)])/;
const lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
const lheading = edit(lheadingCore)
    .replace(/bull/g, bullet) // lists can interrupt
    .replace(/blockCode/g, /(?: {4}| {0,3}\t)/) // indented code blocks can interrupt
    .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/) // fenced code blocks can interrupt
    .replace(/blockquote/g, / {0,3}>/) // blockquote can interrupt
    .replace(/heading/g, / {0,3}#{1,6}/) // ATX heading can interrupt
    .replace(/html/g, / {0,3}<[^\n>]+>\n/) // block html can interrupt
    .replace(/\|table/g, '') // table not in commonmark
    .getRegex();
const lheadingGfm = edit(lheadingCore)
    .replace(/bull/g, bullet) // lists can interrupt
    .replace(/blockCode/g, /(?: {4}| {0,3}\t)/) // indented code blocks can interrupt
    .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/) // fenced code blocks can interrupt
    .replace(/blockquote/g, / {0,3}>/) // blockquote can interrupt
    .replace(/heading/g, / {0,3}#{1,6}/) // ATX heading can interrupt
    .replace(/html/g, / {0,3}<[^\n>]+>\n/) // block html can interrupt
    .replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/) // table can interrupt
    .getRegex();
const _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
const blockText = /^[^\n]+/;
const _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
const def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/)
    .replace('label', _blockLabel)
    .replace('title', /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/)
    .getRegex();
const list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/)
    .replace(/bull/g, bullet)
    .getRegex();
const _tag = 'address|article|aside|base|basefont|blockquote|body|caption'
    + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
    + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
    + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
    + '|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title'
    + '|tr|track|ul';
const _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
const html = edit('^ {0,3}(?:' // optional indentation
    + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
    + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)' // (6)
    + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)' // (7) open tag
    + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)' // (7) closing tag
    + ')', 'i')
    .replace('comment', _comment)
    .replace('tag', _tag)
    .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
    .getRegex();
const paragraph = edit(_paragraph)
    .replace('hr', hr)
    .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
    .replace('|lheading', '') // setext headings don't interrupt commonmark paragraphs
    .replace('|table', '')
    .replace('blockquote', ' {0,3}>')
    .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
    .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
    .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
    .replace('tag', _tag) // pars can be interrupted by type (6) html blocks
    .getRegex();
const blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
    .replace('paragraph', paragraph)
    .getRegex();
/**
 * Normal Block Grammar
 */
const blockNormal = {
    blockquote,
    code: blockCode,
    def,
    fences,
    heading,
    hr,
    html,
    lheading,
    list,
    newline,
    paragraph,
    table: noopTest,
    text: blockText,
};
/**
 * GFM Block Grammar
 */
const gfmTable = edit('^ *([^\\n ].*)\\n' // Header
    + ' {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)' // Align
    + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)') // Cells
    .replace('hr', hr)
    .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
    .replace('blockquote', ' {0,3}>')
    .replace('code', '(?: {4}| {0,3}\t)[^\\n]')
    .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
    .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
    .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
    .replace('tag', _tag) // tables can be interrupted by type (6) html blocks
    .getRegex();
const blockGfm = {
    ...blockNormal,
    lheading: lheadingGfm,
    table: gfmTable,
    paragraph: edit(_paragraph)
        .replace('hr', hr)
        .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
        .replace('|lheading', '') // setext headings don't interrupt commonmark paragraphs
        .replace('table', gfmTable) // interrupt paragraphs with table
        .replace('blockquote', ' {0,3}>')
        .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
        .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
        .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
        .replace('tag', _tag) // pars can be interrupted by type (6) html blocks
        .getRegex(),
};
/**
 * Pedantic grammar (original John Gruber's loose markdown specification)
 */
const blockPedantic = {
    ...blockNormal,
    html: edit('^ *(?:comment *(?:\\n|\\s*$)'
        + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
        .replace('comment', _comment)
        .replace(/tag/g, '(?!(?:'
        + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
        + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
        + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
        .getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest, // fences not supported
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: edit(_paragraph)
        .replace('hr', hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', lheading)
        .replace('|table', '')
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .replace('|tag', '')
        .getRegex(),
};
/**
 * Inline-Level Grammar
 */
const escape$1 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
const inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
const br = /^( {2,}|\\)\n(?!\s*$)/;
const inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
// list of unicode punctuation marks, plus any missing characters from CommonMark spec
const _punctuation = /[\p{P}\p{S}]/u;
const _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
const _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
const punctuation = edit(/^((?![*_])punctSpace)/, 'u')
    .replace(/punctSpace/g, _punctuationOrSpace).getRegex();
// GFM allows ~ inside strong and em for strikethrough
const _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
const _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
const _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
// sequences em should skip over [title](link), `code`, <html>
const blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
const emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
const emStrongLDelim = edit(emStrongLDelimCore, 'u')
    .replace(/punct/g, _punctuation)
    .getRegex();
const emStrongLDelimGfm = edit(emStrongLDelimCore, 'u')
    .replace(/punct/g, _punctuationGfmStrongEm)
    .getRegex();
const emStrongRDelimAstCore = '^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)' // Skip orphan inside strong
    + '|[^*]+(?=[^*])' // Consume to delim
    + '|(?!\\*)punct(\\*+)(?=[\\s]|$)' // (1) #*** can only be a Right Delimiter
    + '|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)' // (2) a***#, a*** can only be a Right Delimiter
    + '|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)' // (3) #***a, ***a can only be Left Delimiter
    + '|[\\s](\\*+)(?!\\*)(?=punct)' // (4) ***# can only be Left Delimiter
    + '|(?!\\*)punct(\\*+)(?!\\*)(?=punct)' // (5) #***# can be either Left or Right Delimiter
    + '|notPunctSpace(\\*+)(?=notPunctSpace)'; // (6) a***a can be either Left or Right Delimiter
const emStrongRDelimAst = edit(emStrongRDelimAstCore, 'gu')
    .replace(/notPunctSpace/g, _notPunctuationOrSpace)
    .replace(/punctSpace/g, _punctuationOrSpace)
    .replace(/punct/g, _punctuation)
    .getRegex();
const emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, 'gu')
    .replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm)
    .replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm)
    .replace(/punct/g, _punctuationGfmStrongEm)
    .getRegex();
// (6) Not allowed for _
const emStrongRDelimUnd = edit('^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)' // Skip orphan inside strong
    + '|[^_]+(?=[^_])' // Consume to delim
    + '|(?!_)punct(_+)(?=[\\s]|$)' // (1) #___ can only be a Right Delimiter
    + '|notPunctSpace(_+)(?!_)(?=punctSpace|$)' // (2) a___#, a___ can only be a Right Delimiter
    + '|(?!_)punctSpace(_+)(?=notPunctSpace)' // (3) #___a, ___a can only be Left Delimiter
    + '|[\\s](_+)(?!_)(?=punct)' // (4) ___# can only be Left Delimiter
    + '|(?!_)punct(_+)(?!_)(?=punct)', 'gu') // (5) #___# can be either Left or Right Delimiter
    .replace(/notPunctSpace/g, _notPunctuationOrSpace)
    .replace(/punctSpace/g, _punctuationOrSpace)
    .replace(/punct/g, _punctuation)
    .getRegex();
const anyPunctuation = edit(/\\(punct)/, 'gu')
    .replace(/punct/g, _punctuation)
    .getRegex();
const autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
    .replace('scheme', /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
    .replace('email', /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/)
    .getRegex();
const _inlineComment = edit(_comment).replace('(?:-->|$)', '-->').getRegex();
const tag = edit('^comment'
    + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>') // CDATA section
    .replace('comment', _inlineComment)
    .replace('attribute', /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/)
    .getRegex();
const _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
const link = edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/)
    .replace('label', _inlineLabel)
    .replace('href', /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/)
    .replace('title', /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/)
    .getRegex();
const reflink = edit(/^!?\[(label)\]\[(ref)\]/)
    .replace('label', _inlineLabel)
    .replace('ref', _blockLabel)
    .getRegex();
const nolink = edit(/^!?\[(ref)\](?:\[\])?/)
    .replace('ref', _blockLabel)
    .getRegex();
const reflinkSearch = edit('reflink|nolink(?!\\()', 'g')
    .replace('reflink', reflink)
    .replace('nolink', nolink)
    .getRegex();
/**
 * Normal Inline Grammar
 */
const inlineNormal = {
    _backpedal: noopTest, // only used for GFM url
    anyPunctuation,
    autolink,
    blockSkip,
    br,
    code: inlineCode,
    del: noopTest,
    emStrongLDelim,
    emStrongRDelimAst,
    emStrongRDelimUnd,
    escape: escape$1,
    link,
    nolink,
    punctuation,
    reflink,
    reflinkSearch,
    tag,
    text: inlineText,
    url: noopTest,
};
/**
 * Pedantic Inline Grammar
 */
const inlinePedantic = {
    ...inlineNormal,
    link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', _inlineLabel)
        .getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', _inlineLabel)
        .getRegex(),
};
/**
 * GFM Inline Grammar
 */
const inlineGfm = {
    ...inlineNormal,
    emStrongRDelimAst: emStrongRDelimAstGfm,
    emStrongLDelim: emStrongLDelimGfm,
    url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, 'i')
        .replace('email', /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/)
        .getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
};
/**
 * GFM + Line Breaks Inline Grammar
 */
const inlineBreaks = {
    ...inlineGfm,
    br: edit(br).replace('{2,}', '*').getRegex(),
    text: edit(inlineGfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex(),
};
/**
 * exports
 */
const block = {
    normal: blockNormal,
    gfm: blockGfm,
    pedantic: blockPedantic,
};
const inline = {
    normal: inlineNormal,
    gfm: inlineGfm,
    breaks: inlineBreaks,
    pedantic: inlinePedantic,
};

/**
 * Helpers
 */
const escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape(html, encode) {
    if (encode) {
        if (other.escapeTest.test(html)) {
            return html.replace(other.escapeReplace, getEscapeReplacement);
        }
    }
    else {
        if (other.escapeTestNoEncode.test(html)) {
            return html.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
        }
    }
    return html;
}
function cleanUrl(href) {
    try {
        href = encodeURI(href).replace(other.percentDecode, '%');
    }
    catch {
        return null;
    }
    return href;
}
function splitCells(tableRow, count) {
    // ensure that every cell-delimiting pipe has a space
    // before it to distinguish it from an escaped pipe
    const row = tableRow.replace(other.findPipe, (match, offset, str) => {
        let escaped = false;
        let curr = offset;
        while (--curr >= 0 && str[curr] === '\\')
            escaped = !escaped;
        if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
        }
        else {
            // add space before unescaped |
            return ' |';
        }
    }), cells = row.split(other.splitPipe);
    let i = 0;
    // First/last cell in a row cannot be empty if it has no leading/trailing pipe
    if (!cells[0].trim()) {
        cells.shift();
    }
    if (cells.length > 0 && !cells.at(-1)?.trim()) {
        cells.pop();
    }
    if (count) {
        if (cells.length > count) {
            cells.splice(count);
        }
        else {
            while (cells.length < count)
                cells.push('');
        }
    }
    for (; i < cells.length; i++) {
        // leading or trailing whitespace is ignored per the gfm spec
        cells[i] = cells[i].trim().replace(other.slashPipe, '|');
    }
    return cells;
}
/**
 * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
 * /c*$/ is vulnerable to REDOS.
 *
 * @param str
 * @param c
 * @param invert Remove suffix of non-c chars instead. Default falsey.
 */
function rtrim(str, c, invert) {
    const l = str.length;
    if (l === 0) {
        return '';
    }
    // Length of suffix matching the invert condition.
    let suffLen = 0;
    // Step left until we fail to match the invert condition.
    while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && true) {
            suffLen++;
        }
        else {
            break;
        }
    }
    return str.slice(0, l - suffLen);
}
function findClosingBracket(str, b) {
    if (str.indexOf(b[1]) === -1) {
        return -1;
    }
    let level = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '\\') {
            i++;
        }
        else if (str[i] === b[0]) {
            level++;
        }
        else if (str[i] === b[1]) {
            level--;
            if (level < 0) {
                return i;
            }
        }
    }
    if (level > 0) {
        return -2;
    }
    return -1;
}

function outputLink(cap, link, raw, lexer, rules) {
    const href = link.href;
    const title = link.title || null;
    const text = cap[1].replace(rules.other.outputLinkReplace, '$1');
    lexer.state.inLink = true;
    const token = {
        type: cap[0].charAt(0) === '!' ? 'image' : 'link',
        raw,
        href,
        title,
        text,
        tokens: lexer.inlineTokens(text),
    };
    lexer.state.inLink = false;
    return token;
}
function indentCodeCompensation(raw, text, rules) {
    const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
    if (matchIndentToCode === null) {
        return text;
    }
    const indentToCode = matchIndentToCode[1];
    return text
        .split('\n')
        .map(node => {
        const matchIndentInNode = node.match(rules.other.beginningSpace);
        if (matchIndentInNode === null) {
            return node;
        }
        const [indentInNode] = matchIndentInNode;
        if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
        }
        return node;
    })
        .join('\n');
}
/**
 * Tokenizer
 */
class _Tokenizer {
    options;
    rules; // set by the lexer
    lexer; // set by the lexer
    constructor(options) {
        this.options = options || _defaults;
    }
    space(src) {
        const cap = this.rules.block.newline.exec(src);
        if (cap && cap[0].length > 0) {
            return {
                type: 'space',
                raw: cap[0],
            };
        }
    }
    code(src) {
        const cap = this.rules.block.code.exec(src);
        if (cap) {
            const text = cap[0].replace(this.rules.other.codeRemoveIndent, '');
            return {
                type: 'code',
                raw: cap[0],
                codeBlockStyle: 'indented',
                text: !this.options.pedantic
                    ? rtrim(text, '\n')
                    : text,
            };
        }
    }
    fences(src) {
        const cap = this.rules.block.fences.exec(src);
        if (cap) {
            const raw = cap[0];
            const text = indentCodeCompensation(raw, cap[3] || '', this.rules);
            return {
                type: 'code',
                raw,
                lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, '$1') : cap[2],
                text,
            };
        }
    }
    heading(src) {
        const cap = this.rules.block.heading.exec(src);
        if (cap) {
            let text = cap[2].trim();
            // remove trailing #s
            if (this.rules.other.endingHash.test(text)) {
                const trimmed = rtrim(text, '#');
                if (this.options.pedantic) {
                    text = trimmed.trim();
                }
                else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) {
                    // CommonMark requires space before trailing #s
                    text = trimmed.trim();
                }
            }
            return {
                type: 'heading',
                raw: cap[0],
                depth: cap[1].length,
                text,
                tokens: this.lexer.inline(text),
            };
        }
    }
    hr(src) {
        const cap = this.rules.block.hr.exec(src);
        if (cap) {
            return {
                type: 'hr',
                raw: rtrim(cap[0], '\n'),
            };
        }
    }
    blockquote(src) {
        const cap = this.rules.block.blockquote.exec(src);
        if (cap) {
            let lines = rtrim(cap[0], '\n').split('\n');
            let raw = '';
            let text = '';
            const tokens = [];
            while (lines.length > 0) {
                let inBlockquote = false;
                const currentLines = [];
                let i;
                for (i = 0; i < lines.length; i++) {
                    // get lines up to a continuation
                    if (this.rules.other.blockquoteStart.test(lines[i])) {
                        currentLines.push(lines[i]);
                        inBlockquote = true;
                    }
                    else if (!inBlockquote) {
                        currentLines.push(lines[i]);
                    }
                    else {
                        break;
                    }
                }
                lines = lines.slice(i);
                const currentRaw = currentLines.join('\n');
                const currentText = currentRaw
                    // precede setext continuation with 4 spaces so it isn't a setext
                    .replace(this.rules.other.blockquoteSetextReplace, '\n    $1')
                    .replace(this.rules.other.blockquoteSetextReplace2, '');
                raw = raw ? `${raw}\n${currentRaw}` : currentRaw;
                text = text ? `${text}\n${currentText}` : currentText;
                // parse blockquote lines as top level tokens
                // merge paragraphs if this is a continuation
                const top = this.lexer.state.top;
                this.lexer.state.top = true;
                this.lexer.blockTokens(currentText, tokens, true);
                this.lexer.state.top = top;
                // if there is no continuation then we are done
                if (lines.length === 0) {
                    break;
                }
                const lastToken = tokens.at(-1);
                if (lastToken?.type === 'code') {
                    // blockquote continuation cannot be preceded by a code block
                    break;
                }
                else if (lastToken?.type === 'blockquote') {
                    // include continuation in nested blockquote
                    const oldToken = lastToken;
                    const newText = oldToken.raw + '\n' + lines.join('\n');
                    const newToken = this.blockquote(newText);
                    tokens[tokens.length - 1] = newToken;
                    raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
                    text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
                    break;
                }
                else if (lastToken?.type === 'list') {
                    // include continuation in nested list
                    const oldToken = lastToken;
                    const newText = oldToken.raw + '\n' + lines.join('\n');
                    const newToken = this.list(newText);
                    tokens[tokens.length - 1] = newToken;
                    raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
                    text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
                    lines = newText.substring(tokens.at(-1).raw.length).split('\n');
                    continue;
                }
            }
            return {
                type: 'blockquote',
                raw,
                tokens,
                text,
            };
        }
    }
    list(src) {
        let cap = this.rules.block.list.exec(src);
        if (cap) {
            let bull = cap[1].trim();
            const isordered = bull.length > 1;
            const list = {
                type: 'list',
                raw: '',
                ordered: isordered,
                start: isordered ? +bull.slice(0, -1) : '',
                loose: false,
                items: [],
            };
            bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
            if (this.options.pedantic) {
                bull = isordered ? bull : '[*+-]';
            }
            // Get next list item
            const itemRegex = this.rules.other.listItemRegex(bull);
            let endsWithBlankLine = false;
            // Check if current bullet point can start a new List Item
            while (src) {
                let endEarly = false;
                let raw = '';
                let itemContents = '';
                if (!(cap = itemRegex.exec(src))) {
                    break;
                }
                if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
                    break;
                }
                raw = cap[0];
                src = src.substring(raw.length);
                let line = cap[2].split('\n', 1)[0].replace(this.rules.other.listReplaceTabs, (t) => ' '.repeat(3 * t.length));
                let nextLine = src.split('\n', 1)[0];
                let blankLine = !line.trim();
                let indent = 0;
                if (this.options.pedantic) {
                    indent = 2;
                    itemContents = line.trimStart();
                }
                else if (blankLine) {
                    indent = cap[1].length + 1;
                }
                else {
                    indent = cap[2].search(this.rules.other.nonSpaceChar); // Find first non-space char
                    indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
                    itemContents = line.slice(indent);
                    indent += cap[1].length;
                }
                if (blankLine && this.rules.other.blankLine.test(nextLine)) { // Items begin with at most one blank line
                    raw += nextLine + '\n';
                    src = src.substring(nextLine.length + 1);
                    endEarly = true;
                }
                if (!endEarly) {
                    const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
                    const hrRegex = this.rules.other.hrRegex(indent);
                    const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
                    const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
                    const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
                    // Check if following lines should be included in List Item
                    while (src) {
                        const rawLine = src.split('\n', 1)[0];
                        let nextLineWithoutTabs;
                        nextLine = rawLine;
                        // Re-align to follow commonmark nesting rules
                        if (this.options.pedantic) {
                            nextLine = nextLine.replace(this.rules.other.listReplaceNesting, '  ');
                            nextLineWithoutTabs = nextLine;
                        }
                        else {
                            nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, '    ');
                        }
                        // End list item if found code fences
                        if (fencesBeginRegex.test(nextLine)) {
                            break;
                        }
                        // End list item if found start of new heading
                        if (headingBeginRegex.test(nextLine)) {
                            break;
                        }
                        // End list item if found start of html block
                        if (htmlBeginRegex.test(nextLine)) {
                            break;
                        }
                        // End list item if found start of new bullet
                        if (nextBulletRegex.test(nextLine)) {
                            break;
                        }
                        // Horizontal rule found
                        if (hrRegex.test(nextLine)) {
                            break;
                        }
                        if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) { // Dedent if possible
                            itemContents += '\n' + nextLineWithoutTabs.slice(indent);
                        }
                        else {
                            // not enough indentation
                            if (blankLine) {
                                break;
                            }
                            // paragraph continuation unless last line was a different block level element
                            if (line.replace(this.rules.other.tabCharGlobal, '    ').search(this.rules.other.nonSpaceChar) >= 4) { // indented code block
                                break;
                            }
                            if (fencesBeginRegex.test(line)) {
                                break;
                            }
                            if (headingBeginRegex.test(line)) {
                                break;
                            }
                            if (hrRegex.test(line)) {
                                break;
                            }
                            itemContents += '\n' + nextLine;
                        }
                        if (!blankLine && !nextLine.trim()) { // Check if current line is blank
                            blankLine = true;
                        }
                        raw += rawLine + '\n';
                        src = src.substring(rawLine.length + 1);
                        line = nextLineWithoutTabs.slice(indent);
                    }
                }
                if (!list.loose) {
                    // If the previous item ended with a blank line, the list is loose
                    if (endsWithBlankLine) {
                        list.loose = true;
                    }
                    else if (this.rules.other.doubleBlankLine.test(raw)) {
                        endsWithBlankLine = true;
                    }
                }
                let istask = null;
                let ischecked;
                // Check for task list items
                if (this.options.gfm) {
                    istask = this.rules.other.listIsTask.exec(itemContents);
                    if (istask) {
                        ischecked = istask[0] !== '[ ] ';
                        itemContents = itemContents.replace(this.rules.other.listReplaceTask, '');
                    }
                }
                list.items.push({
                    type: 'list_item',
                    raw,
                    task: !!istask,
                    checked: ischecked,
                    loose: false,
                    text: itemContents,
                    tokens: [],
                });
                list.raw += raw;
            }
            // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
            const lastItem = list.items.at(-1);
            if (lastItem) {
                lastItem.raw = lastItem.raw.trimEnd();
                lastItem.text = lastItem.text.trimEnd();
            }
            else {
                // not a list since there were no items
                return;
            }
            list.raw = list.raw.trimEnd();
            // Item child tokens handled here at end because we needed to have the final item to trim it first
            for (let i = 0; i < list.items.length; i++) {
                this.lexer.state.top = false;
                list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
                if (!list.loose) {
                    // Check if list should be loose
                    const spacers = list.items[i].tokens.filter(t => t.type === 'space');
                    const hasMultipleLineBreaks = spacers.length > 0 && spacers.some(t => this.rules.other.anyLine.test(t.raw));
                    list.loose = hasMultipleLineBreaks;
                }
            }
            // Set all items to loose if list is loose
            if (list.loose) {
                for (let i = 0; i < list.items.length; i++) {
                    list.items[i].loose = true;
                }
            }
            return list;
        }
    }
    html(src) {
        const cap = this.rules.block.html.exec(src);
        if (cap) {
            const token = {
                type: 'html',
                block: true,
                raw: cap[0],
                pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
                text: cap[0],
            };
            return token;
        }
    }
    def(src) {
        const cap = this.rules.block.def.exec(src);
        if (cap) {
            const tag = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, ' ');
            const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, '$1').replace(this.rules.inline.anyPunctuation, '$1') : '';
            const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, '$1') : cap[3];
            return {
                type: 'def',
                tag,
                raw: cap[0],
                href,
                title,
            };
        }
    }
    table(src) {
        const cap = this.rules.block.table.exec(src);
        if (!cap) {
            return;
        }
        if (!this.rules.other.tableDelimiter.test(cap[2])) {
            // delimiter row must have a pipe (|) or colon (:) otherwise it is a setext heading
            return;
        }
        const headers = splitCells(cap[1]);
        const aligns = cap[2].replace(this.rules.other.tableAlignChars, '').split('|');
        const rows = cap[3]?.trim() ? cap[3].replace(this.rules.other.tableRowBlankLine, '').split('\n') : [];
        const item = {
            type: 'table',
            raw: cap[0],
            header: [],
            align: [],
            rows: [],
        };
        if (headers.length !== aligns.length) {
            // header and align columns must be equal, rows can be different.
            return;
        }
        for (const align of aligns) {
            if (this.rules.other.tableAlignRight.test(align)) {
                item.align.push('right');
            }
            else if (this.rules.other.tableAlignCenter.test(align)) {
                item.align.push('center');
            }
            else if (this.rules.other.tableAlignLeft.test(align)) {
                item.align.push('left');
            }
            else {
                item.align.push(null);
            }
        }
        for (let i = 0; i < headers.length; i++) {
            item.header.push({
                text: headers[i],
                tokens: this.lexer.inline(headers[i]),
                header: true,
                align: item.align[i],
            });
        }
        for (const row of rows) {
            item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
                return {
                    text: cell,
                    tokens: this.lexer.inline(cell),
                    header: false,
                    align: item.align[i],
                };
            }));
        }
        return item;
    }
    lheading(src) {
        const cap = this.rules.block.lheading.exec(src);
        if (cap) {
            return {
                type: 'heading',
                raw: cap[0],
                depth: cap[2].charAt(0) === '=' ? 1 : 2,
                text: cap[1],
                tokens: this.lexer.inline(cap[1]),
            };
        }
    }
    paragraph(src) {
        const cap = this.rules.block.paragraph.exec(src);
        if (cap) {
            const text = cap[1].charAt(cap[1].length - 1) === '\n'
                ? cap[1].slice(0, -1)
                : cap[1];
            return {
                type: 'paragraph',
                raw: cap[0],
                text,
                tokens: this.lexer.inline(text),
            };
        }
    }
    text(src) {
        const cap = this.rules.block.text.exec(src);
        if (cap) {
            return {
                type: 'text',
                raw: cap[0],
                text: cap[0],
                tokens: this.lexer.inline(cap[0]),
            };
        }
    }
    escape(src) {
        const cap = this.rules.inline.escape.exec(src);
        if (cap) {
            return {
                type: 'escape',
                raw: cap[0],
                text: cap[1],
            };
        }
    }
    tag(src) {
        const cap = this.rules.inline.tag.exec(src);
        if (cap) {
            if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) {
                this.lexer.state.inLink = true;
            }
            else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) {
                this.lexer.state.inLink = false;
            }
            if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) {
                this.lexer.state.inRawBlock = true;
            }
            else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) {
                this.lexer.state.inRawBlock = false;
            }
            return {
                type: 'html',
                raw: cap[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: false,
                text: cap[0],
            };
        }
    }
    link(src) {
        const cap = this.rules.inline.link.exec(src);
        if (cap) {
            const trimmedUrl = cap[2].trim();
            if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
                // commonmark requires matching angle brackets
                if (!(this.rules.other.endAngleBracket.test(trimmedUrl))) {
                    return;
                }
                // ending angle bracket cannot be escaped
                const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
                if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
                    return;
                }
            }
            else {
                // find closing parenthesis
                const lastParenIndex = findClosingBracket(cap[2], '()');
                if (lastParenIndex === -2) {
                    // more open parens than closed
                    return;
                }
                if (lastParenIndex > -1) {
                    const start = cap[0].indexOf('!') === 0 ? 5 : 4;
                    const linkLen = start + cap[1].length + lastParenIndex;
                    cap[2] = cap[2].substring(0, lastParenIndex);
                    cap[0] = cap[0].substring(0, linkLen).trim();
                    cap[3] = '';
                }
            }
            let href = cap[2];
            let title = '';
            if (this.options.pedantic) {
                // split pedantic href and title
                const link = this.rules.other.pedanticHrefTitle.exec(href);
                if (link) {
                    href = link[1];
                    title = link[3];
                }
            }
            else {
                title = cap[3] ? cap[3].slice(1, -1) : '';
            }
            href = href.trim();
            if (this.rules.other.startAngleBracket.test(href)) {
                if (this.options.pedantic && !(this.rules.other.endAngleBracket.test(trimmedUrl))) {
                    // pedantic allows starting angle bracket without ending angle bracket
                    href = href.slice(1);
                }
                else {
                    href = href.slice(1, -1);
                }
            }
            return outputLink(cap, {
                href: href ? href.replace(this.rules.inline.anyPunctuation, '$1') : href,
                title: title ? title.replace(this.rules.inline.anyPunctuation, '$1') : title,
            }, cap[0], this.lexer, this.rules);
        }
    }
    reflink(src, links) {
        let cap;
        if ((cap = this.rules.inline.reflink.exec(src))
            || (cap = this.rules.inline.nolink.exec(src))) {
            const linkString = (cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, ' ');
            const link = links[linkString.toLowerCase()];
            if (!link) {
                const text = cap[0].charAt(0);
                return {
                    type: 'text',
                    raw: text,
                    text,
                };
            }
            return outputLink(cap, link, cap[0], this.lexer, this.rules);
        }
    }
    emStrong(src, maskedSrc, prevChar = '') {
        let match = this.rules.inline.emStrongLDelim.exec(src);
        if (!match)
            return;
        // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
        if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric))
            return;
        const nextChar = match[1] || match[2] || '';
        if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
            // unicode Regex counts emoji as 1 char; spread into array for proper count (used multiple times below)
            const lLength = [...match[0]].length - 1;
            let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
            const endReg = match[0][0] === '*' ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
            endReg.lastIndex = 0;
            // Clip maskedSrc to same section of string as src (move to lexer?)
            maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
            while ((match = endReg.exec(maskedSrc)) != null) {
                rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
                if (!rDelim)
                    continue; // skip single * in __abc*abc__
                rLength = [...rDelim].length;
                if (match[3] || match[4]) { // found another Left Delim
                    delimTotal += rLength;
                    continue;
                }
                else if (match[5] || match[6]) { // either Left or Right Delim
                    if (lLength % 3 && !((lLength + rLength) % 3)) {
                        midDelimTotal += rLength;
                        continue; // CommonMark Emphasis Rules 9-10
                    }
                }
                delimTotal -= rLength;
                if (delimTotal > 0)
                    continue; // Haven't found enough closing delimiters
                // Remove extra characters. *a*** -> *a*
                rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
                // char length can be >1 for unicode characters;
                const lastCharLength = [...match[0]][0].length;
                const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
                // Create `em` if smallest delimiter has odd char count. *a***
                if (Math.min(lLength, rLength) % 2) {
                    const text = raw.slice(1, -1);
                    return {
                        type: 'em',
                        raw,
                        text,
                        tokens: this.lexer.inlineTokens(text),
                    };
                }
                // Create 'strong' if smallest delimiter has even char count. **a***
                const text = raw.slice(2, -2);
                return {
                    type: 'strong',
                    raw,
                    text,
                    tokens: this.lexer.inlineTokens(text),
                };
            }
        }
    }
    codespan(src) {
        const cap = this.rules.inline.code.exec(src);
        if (cap) {
            let text = cap[2].replace(this.rules.other.newLineCharGlobal, ' ');
            const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text);
            const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text) && this.rules.other.endingSpaceChar.test(text);
            if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
                text = text.substring(1, text.length - 1);
            }
            return {
                type: 'codespan',
                raw: cap[0],
                text,
            };
        }
    }
    br(src) {
        const cap = this.rules.inline.br.exec(src);
        if (cap) {
            return {
                type: 'br',
                raw: cap[0],
            };
        }
    }
    del(src) {
        const cap = this.rules.inline.del.exec(src);
        if (cap) {
            return {
                type: 'del',
                raw: cap[0],
                text: cap[2],
                tokens: this.lexer.inlineTokens(cap[2]),
            };
        }
    }
    autolink(src) {
        const cap = this.rules.inline.autolink.exec(src);
        if (cap) {
            let text, href;
            if (cap[2] === '@') {
                text = cap[1];
                href = 'mailto:' + text;
            }
            else {
                text = cap[1];
                href = text;
            }
            return {
                type: 'link',
                raw: cap[0],
                text,
                href,
                tokens: [
                    {
                        type: 'text',
                        raw: text,
                        text,
                    },
                ],
            };
        }
    }
    url(src) {
        let cap;
        if (cap = this.rules.inline.url.exec(src)) {
            let text, href;
            if (cap[2] === '@') {
                text = cap[0];
                href = 'mailto:' + text;
            }
            else {
                // do extended autolink path validation
                let prevCapZero;
                do {
                    prevCapZero = cap[0];
                    cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? '';
                } while (prevCapZero !== cap[0]);
                text = cap[0];
                if (cap[1] === 'www.') {
                    href = 'http://' + cap[0];
                }
                else {
                    href = cap[0];
                }
            }
            return {
                type: 'link',
                raw: cap[0],
                text,
                href,
                tokens: [
                    {
                        type: 'text',
                        raw: text,
                        text,
                    },
                ],
            };
        }
    }
    inlineText(src) {
        const cap = this.rules.inline.text.exec(src);
        if (cap) {
            const escaped = this.lexer.state.inRawBlock;
            return {
                type: 'text',
                raw: cap[0],
                text: cap[0],
                escaped,
            };
        }
    }
}

/**
 * Block Lexer
 */
class _Lexer {
    tokens;
    options;
    state;
    tokenizer;
    inlineQueue;
    constructor(options) {
        // TokenList cannot be created in one go
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || _defaults;
        this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        this.tokenizer.lexer = this;
        this.inlineQueue = [];
        this.state = {
            inLink: false,
            inRawBlock: false,
            top: true,
        };
        const rules = {
            other,
            block: block.normal,
            inline: inline.normal,
        };
        if (this.options.pedantic) {
            rules.block = block.pedantic;
            rules.inline = inline.pedantic;
        }
        else if (this.options.gfm) {
            rules.block = block.gfm;
            if (this.options.breaks) {
                rules.inline = inline.breaks;
            }
            else {
                rules.inline = inline.gfm;
            }
        }
        this.tokenizer.rules = rules;
    }
    /**
     * Expose Rules
     */
    static get rules() {
        return {
            block,
            inline,
        };
    }
    /**
     * Static Lex Method
     */
    static lex(src, options) {
        const lexer = new _Lexer(options);
        return lexer.lex(src);
    }
    /**
     * Static Lex Inline Method
     */
    static lexInline(src, options) {
        const lexer = new _Lexer(options);
        return lexer.inlineTokens(src);
    }
    /**
     * Preprocessing
     */
    lex(src) {
        src = src.replace(other.carriageReturn, '\n');
        this.blockTokens(src, this.tokens);
        for (let i = 0; i < this.inlineQueue.length; i++) {
            const next = this.inlineQueue[i];
            this.inlineTokens(next.src, next.tokens);
        }
        this.inlineQueue = [];
        return this.tokens;
    }
    blockTokens(src, tokens = [], lastParagraphClipped = false) {
        if (this.options.pedantic) {
            src = src.replace(other.tabCharGlobal, '    ').replace(other.spaceLine, '');
        }
        while (src) {
            let token;
            if (this.options.extensions?.block?.some((extTokenizer) => {
                if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    return true;
                }
                return false;
            })) {
                continue;
            }
            // newline
            if (token = this.tokenizer.space(src)) {
                src = src.substring(token.raw.length);
                const lastToken = tokens.at(-1);
                if (token.raw.length === 1 && lastToken !== undefined) {
                    // if there's a single \n as a spacer, it's terminating the last line,
                    // so move it there so that we don't get unnecessary paragraph tags
                    lastToken.raw += '\n';
                }
                else {
                    tokens.push(token);
                }
                continue;
            }
            // code
            if (token = this.tokenizer.code(src)) {
                src = src.substring(token.raw.length);
                const lastToken = tokens.at(-1);
                // An indented code block cannot interrupt a paragraph.
                if (lastToken?.type === 'paragraph' || lastToken?.type === 'text') {
                    lastToken.raw += '\n' + token.raw;
                    lastToken.text += '\n' + token.text;
                    this.inlineQueue.at(-1).src = lastToken.text;
                }
                else {
                    tokens.push(token);
                }
                continue;
            }
            // fences
            if (token = this.tokenizer.fences(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // heading
            if (token = this.tokenizer.heading(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // hr
            if (token = this.tokenizer.hr(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // blockquote
            if (token = this.tokenizer.blockquote(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // list
            if (token = this.tokenizer.list(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // html
            if (token = this.tokenizer.html(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // def
            if (token = this.tokenizer.def(src)) {
                src = src.substring(token.raw.length);
                const lastToken = tokens.at(-1);
                if (lastToken?.type === 'paragraph' || lastToken?.type === 'text') {
                    lastToken.raw += '\n' + token.raw;
                    lastToken.text += '\n' + token.raw;
                    this.inlineQueue.at(-1).src = lastToken.text;
                }
                else if (!this.tokens.links[token.tag]) {
                    this.tokens.links[token.tag] = {
                        href: token.href,
                        title: token.title,
                    };
                }
                continue;
            }
            // table (gfm)
            if (token = this.tokenizer.table(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // lheading
            if (token = this.tokenizer.lheading(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // top-level paragraph
            // prevent paragraph consuming extensions by clipping 'src' to extension start
            let cutSrc = src;
            if (this.options.extensions?.startBlock) {
                let startIndex = Infinity;
                const tempSrc = src.slice(1);
                let tempStart;
                this.options.extensions.startBlock.forEach((getStartIndex) => {
                    tempStart = getStartIndex.call({ lexer: this }, tempSrc);
                    if (typeof tempStart === 'number' && tempStart >= 0) {
                        startIndex = Math.min(startIndex, tempStart);
                    }
                });
                if (startIndex < Infinity && startIndex >= 0) {
                    cutSrc = src.substring(0, startIndex + 1);
                }
            }
            if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
                const lastToken = tokens.at(-1);
                if (lastParagraphClipped && lastToken?.type === 'paragraph') {
                    lastToken.raw += '\n' + token.raw;
                    lastToken.text += '\n' + token.text;
                    this.inlineQueue.pop();
                    this.inlineQueue.at(-1).src = lastToken.text;
                }
                else {
                    tokens.push(token);
                }
                lastParagraphClipped = cutSrc.length !== src.length;
                src = src.substring(token.raw.length);
                continue;
            }
            // text
            if (token = this.tokenizer.text(src)) {
                src = src.substring(token.raw.length);
                const lastToken = tokens.at(-1);
                if (lastToken?.type === 'text') {
                    lastToken.raw += '\n' + token.raw;
                    lastToken.text += '\n' + token.text;
                    this.inlineQueue.pop();
                    this.inlineQueue.at(-1).src = lastToken.text;
                }
                else {
                    tokens.push(token);
                }
                continue;
            }
            if (src) {
                const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
                if (this.options.silent) {
                    console.error(errMsg);
                    break;
                }
                else {
                    throw new Error(errMsg);
                }
            }
        }
        this.state.top = true;
        return tokens;
    }
    inline(src, tokens = []) {
        this.inlineQueue.push({ src, tokens });
        return tokens;
    }
    /**
     * Lexing/Compiling
     */
    inlineTokens(src, tokens = []) {
        // String with links masked to avoid interference with em and strong
        let maskedSrc = src;
        let match = null;
        // Mask out reflinks
        if (this.tokens.links) {
            const links = Object.keys(this.tokens.links);
            if (links.length > 0) {
                while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
                    if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                        maskedSrc = maskedSrc.slice(0, match.index)
                            + '[' + 'a'.repeat(match[0].length - 2) + ']'
                            + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
                    }
                }
            }
        }
        // Mask out escaped characters
        while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
        }
        // Mask out other blocks
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '[' + 'a'.repeat(match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }
        let keepPrevChar = false;
        let prevChar = '';
        while (src) {
            if (!keepPrevChar) {
                prevChar = '';
            }
            keepPrevChar = false;
            let token;
            // extensions
            if (this.options.extensions?.inline?.some((extTokenizer) => {
                if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    return true;
                }
                return false;
            })) {
                continue;
            }
            // escape
            if (token = this.tokenizer.escape(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // tag
            if (token = this.tokenizer.tag(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // link
            if (token = this.tokenizer.link(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // reflink, nolink
            if (token = this.tokenizer.reflink(src, this.tokens.links)) {
                src = src.substring(token.raw.length);
                const lastToken = tokens.at(-1);
                if (token.type === 'text' && lastToken?.type === 'text') {
                    lastToken.raw += token.raw;
                    lastToken.text += token.text;
                }
                else {
                    tokens.push(token);
                }
                continue;
            }
            // em & strong
            if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // code
            if (token = this.tokenizer.codespan(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // br
            if (token = this.tokenizer.br(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // del (gfm)
            if (token = this.tokenizer.del(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // autolink
            if (token = this.tokenizer.autolink(src)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // url (gfm)
            if (!this.state.inLink && (token = this.tokenizer.url(src))) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                continue;
            }
            // text
            // prevent inlineText consuming extensions by clipping 'src' to extension start
            let cutSrc = src;
            if (this.options.extensions?.startInline) {
                let startIndex = Infinity;
                const tempSrc = src.slice(1);
                let tempStart;
                this.options.extensions.startInline.forEach((getStartIndex) => {
                    tempStart = getStartIndex.call({ lexer: this }, tempSrc);
                    if (typeof tempStart === 'number' && tempStart >= 0) {
                        startIndex = Math.min(startIndex, tempStart);
                    }
                });
                if (startIndex < Infinity && startIndex >= 0) {
                    cutSrc = src.substring(0, startIndex + 1);
                }
            }
            if (token = this.tokenizer.inlineText(cutSrc)) {
                src = src.substring(token.raw.length);
                if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
                    prevChar = token.raw.slice(-1);
                }
                keepPrevChar = true;
                const lastToken = tokens.at(-1);
                if (lastToken?.type === 'text') {
                    lastToken.raw += token.raw;
                    lastToken.text += token.text;
                }
                else {
                    tokens.push(token);
                }
                continue;
            }
            if (src) {
                const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
                if (this.options.silent) {
                    console.error(errMsg);
                    break;
                }
                else {
                    throw new Error(errMsg);
                }
            }
        }
        return tokens;
    }
}

/**
 * Renderer
 */
class _Renderer {
    options;
    parser; // set by the parser
    constructor(options) {
        this.options = options || _defaults;
    }
    space(token) {
        return '';
    }
    code({ text, lang, escaped }) {
        const langString = (lang || '').match(other.notSpaceStart)?.[0];
        const code = text.replace(other.endingNewline, '') + '\n';
        if (!langString) {
            return '<pre><code>'
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        }
        return '<pre><code class="language-'
            + escape(langString)
            + '">'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
    }
    blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        return `<blockquote>\n${body}</blockquote>\n`;
    }
    html({ text }) {
        return text;
    }
    heading({ tokens, depth }) {
        return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`;
    }
    hr(token) {
        return '<hr>\n';
    }
    list(token) {
        const ordered = token.ordered;
        const start = token.start;
        let body = '';
        for (let j = 0; j < token.items.length; j++) {
            const item = token.items[j];
            body += this.listitem(item);
        }
        const type = ordered ? 'ol' : 'ul';
        const startAttr = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startAttr + '>\n' + body + '</' + type + '>\n';
    }
    listitem(item) {
        let itemBody = '';
        if (item.task) {
            const checkbox = this.checkbox({ checked: !!item.checked });
            if (item.loose) {
                if (item.tokens[0]?.type === 'paragraph') {
                    item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                    if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + escape(item.tokens[0].tokens[0].text);
                        item.tokens[0].tokens[0].escaped = true;
                    }
                }
                else {
                    item.tokens.unshift({
                        type: 'text',
                        raw: checkbox + ' ',
                        text: checkbox + ' ',
                        escaped: true,
                    });
                }
            }
            else {
                itemBody += checkbox + ' ';
            }
        }
        itemBody += this.parser.parse(item.tokens, !!item.loose);
        return `<li>${itemBody}</li>\n`;
    }
    checkbox({ checked }) {
        return '<input '
            + (checked ? 'checked="" ' : '')
            + 'disabled="" type="checkbox">';
    }
    paragraph({ tokens }) {
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
    }
    table(token) {
        let header = '';
        // header
        let cell = '';
        for (let j = 0; j < token.header.length; j++) {
            cell += this.tablecell(token.header[j]);
        }
        header += this.tablerow({ text: cell });
        let body = '';
        for (let j = 0; j < token.rows.length; j++) {
            const row = token.rows[j];
            cell = '';
            for (let k = 0; k < row.length; k++) {
                cell += this.tablecell(row[k]);
            }
            body += this.tablerow({ text: cell });
        }
        if (body)
            body = `<tbody>${body}</tbody>`;
        return '<table>\n'
            + '<thead>\n'
            + header
            + '</thead>\n'
            + body
            + '</table>\n';
    }
    tablerow({ text }) {
        return `<tr>\n${text}</tr>\n`;
    }
    tablecell(token) {
        const content = this.parser.parseInline(token.tokens);
        const type = token.header ? 'th' : 'td';
        const tag = token.align
            ? `<${type} align="${token.align}">`
            : `<${type}>`;
        return tag + content + `</${type}>\n`;
    }
    /**
     * span level renderer
     */
    strong({ tokens }) {
        return `<strong>${this.parser.parseInline(tokens)}</strong>`;
    }
    em({ tokens }) {
        return `<em>${this.parser.parseInline(tokens)}</em>`;
    }
    codespan({ text }) {
        return `<code>${escape(text, true)}</code>`;
    }
    br(token) {
        return '<br>';
    }
    del({ tokens }) {
        return `<del>${this.parser.parseInline(tokens)}</del>`;
    }
    link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const cleanHref = cleanUrl(href);
        if (cleanHref === null) {
            return text;
        }
        href = cleanHref;
        let out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + (escape(title)) + '"';
        }
        out += '>' + text + '</a>';
        return out;
    }
    image({ href, title, text, tokens }) {
        if (tokens) {
            text = this.parser.parseInline(tokens, this.parser.textRenderer);
        }
        const cleanHref = cleanUrl(href);
        if (cleanHref === null) {
            return escape(text);
        }
        href = cleanHref;
        let out = `<img src="${href}" alt="${text}"`;
        if (title) {
            out += ` title="${escape(title)}"`;
        }
        out += '>';
        return out;
    }
    text(token) {
        return 'tokens' in token && token.tokens
            ? this.parser.parseInline(token.tokens)
            : ('escaped' in token && token.escaped ? token.text : escape(token.text));
    }
}

/**
 * TextRenderer
 * returns only the textual part of the token
 */
class _TextRenderer {
    // no need for block level renderers
    strong({ text }) {
        return text;
    }
    em({ text }) {
        return text;
    }
    codespan({ text }) {
        return text;
    }
    del({ text }) {
        return text;
    }
    html({ text }) {
        return text;
    }
    text({ text }) {
        return text;
    }
    link({ text }) {
        return '' + text;
    }
    image({ text }) {
        return '' + text;
    }
    br() {
        return '';
    }
}

/**
 * Parsing & Compiling
 */
class _Parser {
    options;
    renderer;
    textRenderer;
    constructor(options) {
        this.options = options || _defaults;
        this.options.renderer = this.options.renderer || new _Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.renderer.parser = this;
        this.textRenderer = new _TextRenderer();
    }
    /**
     * Static Parse Method
     */
    static parse(tokens, options) {
        const parser = new _Parser(options);
        return parser.parse(tokens);
    }
    /**
     * Static Parse Inline Method
     */
    static parseInline(tokens, options) {
        const parser = new _Parser(options);
        return parser.parseInline(tokens);
    }
    /**
     * Parse Loop
     */
    parse(tokens, top = true) {
        let out = '';
        for (let i = 0; i < tokens.length; i++) {
            const anyToken = tokens[i];
            // Run any renderer extensions
            if (this.options.extensions?.renderers?.[anyToken.type]) {
                const genericToken = anyToken;
                const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
                if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(genericToken.type)) {
                    out += ret || '';
                    continue;
                }
            }
            const token = anyToken;
            switch (token.type) {
                case 'space': {
                    out += this.renderer.space(token);
                    continue;
                }
                case 'hr': {
                    out += this.renderer.hr(token);
                    continue;
                }
                case 'heading': {
                    out += this.renderer.heading(token);
                    continue;
                }
                case 'code': {
                    out += this.renderer.code(token);
                    continue;
                }
                case 'table': {
                    out += this.renderer.table(token);
                    continue;
                }
                case 'blockquote': {
                    out += this.renderer.blockquote(token);
                    continue;
                }
                case 'list': {
                    out += this.renderer.list(token);
                    continue;
                }
                case 'html': {
                    out += this.renderer.html(token);
                    continue;
                }
                case 'paragraph': {
                    out += this.renderer.paragraph(token);
                    continue;
                }
                case 'text': {
                    let textToken = token;
                    let body = this.renderer.text(textToken);
                    while (i + 1 < tokens.length && tokens[i + 1].type === 'text') {
                        textToken = tokens[++i];
                        body += '\n' + this.renderer.text(textToken);
                    }
                    if (top) {
                        out += this.renderer.paragraph({
                            type: 'paragraph',
                            raw: body,
                            text: body,
                            tokens: [{ type: 'text', raw: body, text: body, escaped: true }],
                        });
                    }
                    else {
                        out += body;
                    }
                    continue;
                }
                default: {
                    const errMsg = 'Token with "' + token.type + '" type was not found.';
                    if (this.options.silent) {
                        console.error(errMsg);
                        return '';
                    }
                    else {
                        throw new Error(errMsg);
                    }
                }
            }
        }
        return out;
    }
    /**
     * Parse Inline Tokens
     */
    parseInline(tokens, renderer = this.renderer) {
        let out = '';
        for (let i = 0; i < tokens.length; i++) {
            const anyToken = tokens[i];
            // Run any renderer extensions
            if (this.options.extensions?.renderers?.[anyToken.type]) {
                const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
                if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(anyToken.type)) {
                    out += ret || '';
                    continue;
                }
            }
            const token = anyToken;
            switch (token.type) {
                case 'escape': {
                    out += renderer.text(token);
                    break;
                }
                case 'html': {
                    out += renderer.html(token);
                    break;
                }
                case 'link': {
                    out += renderer.link(token);
                    break;
                }
                case 'image': {
                    out += renderer.image(token);
                    break;
                }
                case 'strong': {
                    out += renderer.strong(token);
                    break;
                }
                case 'em': {
                    out += renderer.em(token);
                    break;
                }
                case 'codespan': {
                    out += renderer.codespan(token);
                    break;
                }
                case 'br': {
                    out += renderer.br(token);
                    break;
                }
                case 'del': {
                    out += renderer.del(token);
                    break;
                }
                case 'text': {
                    out += renderer.text(token);
                    break;
                }
                default: {
                    const errMsg = 'Token with "' + token.type + '" type was not found.';
                    if (this.options.silent) {
                        console.error(errMsg);
                        return '';
                    }
                    else {
                        throw new Error(errMsg);
                    }
                }
            }
        }
        return out;
    }
}

class _Hooks {
    options;
    block;
    constructor(options) {
        this.options = options || _defaults;
    }
    static passThroughHooks = new Set([
        'preprocess',
        'postprocess',
        'processAllTokens',
    ]);
    /**
     * Process markdown before marked
     */
    preprocess(markdown) {
        return markdown;
    }
    /**
     * Process HTML after marked is finished
     */
    postprocess(html) {
        return html;
    }
    /**
     * Process all tokens before walk tokens
     */
    processAllTokens(tokens) {
        return tokens;
    }
    /**
     * Provide function to tokenize markdown
     */
    provideLexer() {
        return this.block ? _Lexer.lex : _Lexer.lexInline;
    }
    /**
     * Provide function to parse tokens
     */
    provideParser() {
        return this.block ? _Parser.parse : _Parser.parseInline;
    }
}

class Marked {
    defaults = _getDefaults();
    options = this.setOptions;
    parse = this.parseMarkdown(true);
    parseInline = this.parseMarkdown(false);
    Parser = _Parser;
    Renderer = _Renderer;
    TextRenderer = _TextRenderer;
    Lexer = _Lexer;
    Tokenizer = _Tokenizer;
    Hooks = _Hooks;
    constructor(...args) {
        this.use(...args);
    }
    /**
     * Run callback for every token
     */
    walkTokens(tokens, callback) {
        let values = [];
        for (const token of tokens) {
            values = values.concat(callback.call(this, token));
            switch (token.type) {
                case 'table': {
                    const tableToken = token;
                    for (const cell of tableToken.header) {
                        values = values.concat(this.walkTokens(cell.tokens, callback));
                    }
                    for (const row of tableToken.rows) {
                        for (const cell of row) {
                            values = values.concat(this.walkTokens(cell.tokens, callback));
                        }
                    }
                    break;
                }
                case 'list': {
                    const listToken = token;
                    values = values.concat(this.walkTokens(listToken.items, callback));
                    break;
                }
                default: {
                    const genericToken = token;
                    if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
                        this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
                            const tokens = genericToken[childTokens].flat(Infinity);
                            values = values.concat(this.walkTokens(tokens, callback));
                        });
                    }
                    else if (genericToken.tokens) {
                        values = values.concat(this.walkTokens(genericToken.tokens, callback));
                    }
                }
            }
        }
        return values;
    }
    use(...args) {
        const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
        args.forEach((pack) => {
            // copy options to new object
            const opts = { ...pack };
            // set async to true if it was set to true before
            opts.async = this.defaults.async || opts.async || false;
            // ==-- Parse "addon" extensions --== //
            if (pack.extensions) {
                pack.extensions.forEach((ext) => {
                    if (!ext.name) {
                        throw new Error('extension name required');
                    }
                    if ('renderer' in ext) { // Renderer extensions
                        const prevRenderer = extensions.renderers[ext.name];
                        if (prevRenderer) {
                            // Replace extension with func to run new extension but fall back if false
                            extensions.renderers[ext.name] = function (...args) {
                                let ret = ext.renderer.apply(this, args);
                                if (ret === false) {
                                    ret = prevRenderer.apply(this, args);
                                }
                                return ret;
                            };
                        }
                        else {
                            extensions.renderers[ext.name] = ext.renderer;
                        }
                    }
                    if ('tokenizer' in ext) { // Tokenizer Extensions
                        if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
                            throw new Error("extension level must be 'block' or 'inline'");
                        }
                        const extLevel = extensions[ext.level];
                        if (extLevel) {
                            extLevel.unshift(ext.tokenizer);
                        }
                        else {
                            extensions[ext.level] = [ext.tokenizer];
                        }
                        if (ext.start) { // Function to check for start of token
                            if (ext.level === 'block') {
                                if (extensions.startBlock) {
                                    extensions.startBlock.push(ext.start);
                                }
                                else {
                                    extensions.startBlock = [ext.start];
                                }
                            }
                            else if (ext.level === 'inline') {
                                if (extensions.startInline) {
                                    extensions.startInline.push(ext.start);
                                }
                                else {
                                    extensions.startInline = [ext.start];
                                }
                            }
                        }
                    }
                    if ('childTokens' in ext && ext.childTokens) { // Child tokens to be visited by walkTokens
                        extensions.childTokens[ext.name] = ext.childTokens;
                    }
                });
                opts.extensions = extensions;
            }
            // ==-- Parse "overwrite" extensions --== //
            if (pack.renderer) {
                const renderer = this.defaults.renderer || new _Renderer(this.defaults);
                for (const prop in pack.renderer) {
                    if (!(prop in renderer)) {
                        throw new Error(`renderer '${prop}' does not exist`);
                    }
                    if (['options', 'parser'].includes(prop)) {
                        // ignore options property
                        continue;
                    }
                    const rendererProp = prop;
                    const rendererFunc = pack.renderer[rendererProp];
                    const prevRenderer = renderer[rendererProp];
                    // Replace renderer with func to run extension, but fall back if false
                    renderer[rendererProp] = (...args) => {
                        let ret = rendererFunc.apply(renderer, args);
                        if (ret === false) {
                            ret = prevRenderer.apply(renderer, args);
                        }
                        return ret || '';
                    };
                }
                opts.renderer = renderer;
            }
            if (pack.tokenizer) {
                const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
                for (const prop in pack.tokenizer) {
                    if (!(prop in tokenizer)) {
                        throw new Error(`tokenizer '${prop}' does not exist`);
                    }
                    if (['options', 'rules', 'lexer'].includes(prop)) {
                        // ignore options, rules, and lexer properties
                        continue;
                    }
                    const tokenizerProp = prop;
                    const tokenizerFunc = pack.tokenizer[tokenizerProp];
                    const prevTokenizer = tokenizer[tokenizerProp];
                    // Replace tokenizer with func to run extension, but fall back if false
                    // @ts-expect-error cannot type tokenizer function dynamically
                    tokenizer[tokenizerProp] = (...args) => {
                        let ret = tokenizerFunc.apply(tokenizer, args);
                        if (ret === false) {
                            ret = prevTokenizer.apply(tokenizer, args);
                        }
                        return ret;
                    };
                }
                opts.tokenizer = tokenizer;
            }
            // ==-- Parse Hooks extensions --== //
            if (pack.hooks) {
                const hooks = this.defaults.hooks || new _Hooks();
                for (const prop in pack.hooks) {
                    if (!(prop in hooks)) {
                        throw new Error(`hook '${prop}' does not exist`);
                    }
                    if (['options', 'block'].includes(prop)) {
                        // ignore options and block properties
                        continue;
                    }
                    const hooksProp = prop;
                    const hooksFunc = pack.hooks[hooksProp];
                    const prevHook = hooks[hooksProp];
                    if (_Hooks.passThroughHooks.has(prop)) {
                        // @ts-expect-error cannot type hook function dynamically
                        hooks[hooksProp] = (arg) => {
                            if (this.defaults.async) {
                                return Promise.resolve(hooksFunc.call(hooks, arg)).then(ret => {
                                    return prevHook.call(hooks, ret);
                                });
                            }
                            const ret = hooksFunc.call(hooks, arg);
                            return prevHook.call(hooks, ret);
                        };
                    }
                    else {
                        // @ts-expect-error cannot type hook function dynamically
                        hooks[hooksProp] = (...args) => {
                            let ret = hooksFunc.apply(hooks, args);
                            if (ret === false) {
                                ret = prevHook.apply(hooks, args);
                            }
                            return ret;
                        };
                    }
                }
                opts.hooks = hooks;
            }
            // ==-- Parse WalkTokens extensions --== //
            if (pack.walkTokens) {
                const walkTokens = this.defaults.walkTokens;
                const packWalktokens = pack.walkTokens;
                opts.walkTokens = function (token) {
                    let values = [];
                    values.push(packWalktokens.call(this, token));
                    if (walkTokens) {
                        values = values.concat(walkTokens.call(this, token));
                    }
                    return values;
                };
            }
            this.defaults = { ...this.defaults, ...opts };
        });
        return this;
    }
    setOptions(opt) {
        this.defaults = { ...this.defaults, ...opt };
        return this;
    }
    lexer(src, options) {
        return _Lexer.lex(src, options ?? this.defaults);
    }
    parser(tokens, options) {
        return _Parser.parse(tokens, options ?? this.defaults);
    }
    parseMarkdown(blockType) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parse = (src, options) => {
            const origOpt = { ...options };
            const opt = { ...this.defaults, ...origOpt };
            const throwError = this.onError(!!opt.silent, !!opt.async);
            // throw error if an extension set async to true but parse was called with async: false
            if (this.defaults.async === true && origOpt.async === false) {
                return throwError(new Error('marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.'));
            }
            // throw error in case of non string input
            if (typeof src === 'undefined' || src === null) {
                return throwError(new Error('marked(): input parameter is undefined or null'));
            }
            if (typeof src !== 'string') {
                return throwError(new Error('marked(): input parameter is of type '
                    + Object.prototype.toString.call(src) + ', string expected'));
            }
            if (opt.hooks) {
                opt.hooks.options = opt;
                opt.hooks.block = blockType;
            }
            const lexer = opt.hooks ? opt.hooks.provideLexer() : (blockType ? _Lexer.lex : _Lexer.lexInline);
            const parser = opt.hooks ? opt.hooks.provideParser() : (blockType ? _Parser.parse : _Parser.parseInline);
            if (opt.async) {
                return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src)
                    .then(src => lexer(src, opt))
                    .then(tokens => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens)
                    .then(tokens => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens)
                    .then(tokens => parser(tokens, opt))
                    .then(html => opt.hooks ? opt.hooks.postprocess(html) : html)
                    .catch(throwError);
            }
            try {
                if (opt.hooks) {
                    src = opt.hooks.preprocess(src);
                }
                let tokens = lexer(src, opt);
                if (opt.hooks) {
                    tokens = opt.hooks.processAllTokens(tokens);
                }
                if (opt.walkTokens) {
                    this.walkTokens(tokens, opt.walkTokens);
                }
                let html = parser(tokens, opt);
                if (opt.hooks) {
                    html = opt.hooks.postprocess(html);
                }
                return html;
            }
            catch (e) {
                return throwError(e);
            }
        };
        return parse;
    }
    onError(silent, async) {
        return (e) => {
            e.message += '\nPlease report this to https://github.com/markedjs/marked.';
            if (silent) {
                const msg = '<p>An error occurred:</p><pre>'
                    + escape(e.message + '', true)
                    + '</pre>';
                if (async) {
                    return Promise.resolve(msg);
                }
                return msg;
            }
            if (async) {
                return Promise.reject(e);
            }
            throw e;
        };
    }
}

const markedInstance = new Marked();
function marked(src, opt) {
    return markedInstance.parse(src, opt);
}
/**
 * Sets the default options.
 *
 * @param options Hash of options
 */
marked.options =
    marked.setOptions = function (options) {
        markedInstance.setOptions(options);
        marked.defaults = markedInstance.defaults;
        changeDefaults(marked.defaults);
        return marked;
    };
/**
 * Gets the original marked default options.
 */
marked.getDefaults = _getDefaults;
marked.defaults = _defaults;
/**
 * Use Extension
 */
marked.use = function (...args) {
    markedInstance.use(...args);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
};
/**
 * Run callback for every token
 */
marked.walkTokens = function (tokens, callback) {
    return markedInstance.walkTokens(tokens, callback);
};
/**
 * Compiles markdown to HTML without enclosing `p` tag.
 *
 * @param src String of markdown source to be compiled
 * @param options Hash of options
 * @return String of compiled HTML
 */
marked.parseInline = markedInstance.parseInline;
/**
 * Expose
 */
marked.Parser = _Parser;
marked.parser = _Parser.parse;
marked.Renderer = _Renderer;
marked.TextRenderer = _TextRenderer;
marked.Lexer = _Lexer;
marked.lexer = _Lexer.lex;
marked.Tokenizer = _Tokenizer;
marked.Hooks = _Hooks;
marked.parse = marked;
marked.options;
marked.setOptions;
marked.use;
marked.walkTokens;
marked.parseInline;
_Parser.parse;
_Lexer.lex;

class Media {
  constructor(opts = {}, builder) {
    const defaults = {
      lang: []
    };
    this.builder = builder;
    this.opts = Object.assign({}, defaults, opts);
  }
  async checkIntent(prompt, provider, tools) {
    //checkMediaGenerationRequest

    let system = 'You are an assistant';
    let context = '';
    let question = `This is the user's request:

${prompt}`;
    let functs, result, argsIntent;
    if (tools.image && provider === 'openai') {
      question += `
Extract some information.
`;
      functs = [{
        name: 'check_request',
        description: 'Check request and extract information.',
        parameters: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the image.'
            },
            num_images: {
              type: 'number',
              description: 'The number of images to generate, only if specified.'
            },
            // width:{
            //     type: 'number', 
            //     description: 'Return image width to generate, only if specified.',
            // },
            // height:{
            //     type: 'number', 
            //     description: 'Return image height to generate, only if specified.',
            // },
            size: {
              type: 'string',
              description: 'Choose specified size: auto, 1024x1024, 1536x1024, 1024x1536'
            },
            quality: {
              type: 'string',
              description: 'Choose: auto, low, medium, high'
            },
            background: {
              type: 'string',
              description: 'Choose: auto, transparent, opaque'
            },
            output_format: {
              type: 'string',
              description: 'Choose: png, jpeg, webp'
            }
          },
          required: []
        }
      }];
      result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      argsIntent = JSON.parse(result);
      return argsIntent;
    }
    if (tools.image) {
      question += `

Check the type of the request:
- Text/Prompt to Image Generation
- Text/Prompt to 2D Illustration Generation
- Text/Prompt to Digital Illustration Generation
- Text/Prompt to Book Cover Generation
- Upscale Image
- Upscale Video
- Minimize Image
- Remove Background of an Image
- Change/Replace Background of an Image
- Erase/Remove Unwanted Objects from Image
- Edit Area in Image
- Generate Variation of an Image
- Describe an image or ask questions about the image
`;
      functs = [{
        name: 'check_request',
        description: 'Check request.',
        parameters: {
          type: 'object',
          properties: {
            text_to_image_generation: {
              type: 'boolean',
              description: 'Check if the request asks to create or generate an image based on the prompt.'
            },
            text_to_2d_illustration_generation: {
              type: 'boolean',
              description: 'Check if the request asks to create or generate a 2D illustration based on the prompt.'
            },
            text_to_digital_illustration_generation: {
              type: 'boolean',
              description: 'Check if the request asks to create or generate a digital illustration based on the prompt.'
            },
            text_to_book_cover_generation: {
              type: 'boolean',
              description: 'Check if the request asks to create or generate a book cover based on the prompt.'
            },
            upscale_image: {
              type: 'boolean',
              description: 'Check if the request asks to upscale or enlarge an image.'
            },
            minimize_image: {
              type: 'boolean',
              description: 'Check if the request asks to minimize (compress) the size of an image.'
            },
            edit_area_in_image: {
              type: 'boolean',
              // description: 'Check if the request asks to edit an area in an image.',
              description: 'Check if the request asks to edit an image.'
            },
            describe_image: {
              type: 'boolean',
              description: 'Check if the request is asking to describe an image or asking questions about the image.'
            }
          },
          required: []
        }
      }];
      result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      argsIntent = JSON.parse(result);
    } else if (tools.video) {
      question += `

Check the type of the request:
- Image to Video Generation (generate a video based on image)
- Prompt/text to Video Generation (generate a video based on prompt)
- Upscale video
- Add sound to video
`;
      functs = [{
        name: 'check_request',
        description: 'Check request.',
        parameters: {
          type: 'object',
          properties: {
            image_to_video_generation: {
              type: 'boolean',
              description: 'Check if the request asked to create or generate a video based on image, not prompt.'
            },
            text_to_video_generation: {
              type: 'boolean',
              description: 'Check if the request asked to create or generate a video based on prompt, not image.'
            }
          },
          required: []
        }
      }];
      result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      argsIntent = JSON.parse(result);
    } else if (tools.audio) {
      question += `

Check the type of the request:
- Prompt/text to Audio Generation (generate sound or audio based on prompt)
- Text to Speech (generate speech from text)
`;
      functs = [{
        name: 'check_request',
        description: 'Check request.',
        parameters: {
          type: 'object',
          properties: {
            text_to_speech: {
              type: 'boolean',
              description: 'heck if the request is asking to generate speech from text.'
            }
          },
          required: []
        }
      }];
      result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      argsIntent = JSON.parse(result);
    }
    if (this.builder.settings.consoleLog) console.log(argsIntent);

    // Extract information from prompt
    return this.extractInfo(argsIntent, provider, prompt);
  }
  async extractInfo(argsIntent, provider, prompt) {
    const defaultModels = this.builder.settings.defaultModels;
    if (argsIntent.text_to_image_generation) {
      const system = 'You are an assistant';
      const models = defaultModels.text_to_image_generation[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      const question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the image.'
            },
            num_images: {
              type: 'number',
              description: 'The number of images to generate, only if specified.'
            },
            width: {
              type: 'number',
              description: 'Return image width to generate, only if specified.'
            },
            height: {
              type: 'number',
              description: 'Return image height to generate, only if specified.'
            },
            aspect_ratio: {
              type: 'string',
              description: 'Return the aspect ration, only if specified. Example: 3:4, 16:9, etc'
            },
            color1_red: {
              type: 'string',
              description: 'Return red part from color1 rgb.'
            },
            color1_green: {
              type: 'string',
              description: 'Return green part from color1 rgb.'
            },
            color1_blue: {
              type: 'string',
              description: 'Return blue part from color1 rgb.'
            },
            color2_red: {
              type: 'string',
              description: 'Return red part from color2 rgb.'
            },
            color2_green: {
              type: 'string',
              description: 'Return green part from color2 rgb.'
            },
            color2_blue: {
              type: 'string',
              description: 'Return blue part from color2 rgb.'
            },
            color3_red: {
              type: 'string',
              description: 'Return red part from color3 rgb.'
            },
            color3_green: {
              type: 'string',
              description: 'Return green part from color3 rgb.'
            },
            color3_blue: {
              type: 'string',
              description: 'Return blue part from color3 rgb.'
            },
            color4_red: {
              type: 'string',
              description: 'Return red part from color4 rgb.'
            },
            color4_green: {
              type: 'string',
              description: 'Return green part from color4 rgb.'
            },
            color4_blue: {
              type: 'string',
              description: 'Return blue part from color4 rgb.'
            },
            color5_red: {
              type: 'string',
              description: 'Return red part from color5 rgb.'
            },
            color5_green: {
              type: 'string',
              description: 'Return green part from color5 rgb.'
            },
            color5_blue: {
              type: 'string',
              description: 'Return blue part from color5 rgb.'
            }
          },
          required: [
            // 'prompt'
          ]
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.image_to_video_generation) {
      const system = 'You are an assistant';
      const models = defaultModels.image_to_video_generation[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      const question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the video.'
            },
            image_url: {
              type: 'string',
              description: 'Return user\'s image reference URL (if JPG or PNG image URL is specified).'
            },
            duration: {
              type: 'number',
              description: 'Return duration of the video to generate.'
            }
          },
          required: [
            // 'image_url'
          ]
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.text_to_video_generation) {
      const system = 'You are an assistant';
      const models = defaultModels.text_to_video_generation[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the video.'
            },
            duration: {
              type: 'number',
              description: 'Return duration of the video to generate. If not explicitely specified, return 5'
            }
          },
          required: [
            // 'prompt'
          ]
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.minimize_image) {
      let system = 'You are an assistant';
      let context = '';
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            image_url: {
              type: 'string',
              description: 'Return user\'s image reference URL (if JPG or PNG image URL is specified).'
            }
          },
          required: ['image_url']
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.upscale_image) {
      const system = 'You are an assistant';
      const models = defaultModels.upscale_image[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            image_url: {
              type: 'string',
              description: 'Return user\'s image reference URL (if JPG or PNG image URL is specified).'
            }
          },
          required: [
            // 'image_url'
          ]
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.describe_image) {
      const system = 'You are an assistant';
      const models = defaultModels.describe_image[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            image_url: {
              type: 'string',
              description: 'Return user\'s image reference URL (if JPG or PNG image URL is specified).'
            },
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the video.'
            }
          },
          required: ['image_url', 'prompt']
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.edit_area_in_image) {
      const system = 'You are an assistant';
      const models = defaultModels.edit_area_in_image[provider];
      let context = '';
      if (models) {
        context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      }
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            image_url: {
              type: 'string',
              description: 'Return user\'s image reference URL (if JPG or PNG image URL is specified).'
            },
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the video.'
            },
            num_images: {
              type: 'number',
              description: 'The number of images to generate.'
            }
          },
          required: [
            // 'image_url'
          ]
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.text_to_2d_illustration_generation) {
      const system = 'You are an assistant';
      const models = defaultModels.text_to_2d_illustration_generation[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the image.'
            },
            style: {
              type: 'string',
              description: 'Return "digital_illustration"'
            },
            style_id: {
              type: 'string',
              description: 'Return specified style_id for generating the image.'
            },
            num_images: {
              type: 'number',
              description: 'The number of images to generate.'
            },
            width: {
              type: 'number',
              description: 'Return image width to generate.'
            },
            height: {
              type: 'number',
              description: 'Return image height to generate.'
            },
            aspect_ratio: {
              type: 'string',
              description: 'Example: 3:4, 16:9, etc'
            },
            color1_red: {
              type: 'string',
              description: 'Return red part from color1 rgb.'
            },
            color1_green: {
              type: 'string',
              description: 'Return green part from color1 rgb.'
            },
            color1_blue: {
              type: 'string',
              description: 'Return blue part from color1 rgb.'
            },
            color2_red: {
              type: 'string',
              description: 'Return red part from color2 rgb.'
            },
            color2_green: {
              type: 'string',
              description: 'Return green part from color2 rgb.'
            },
            color2_blue: {
              type: 'string',
              description: 'Return blue part from color2 rgb.'
            },
            color3_red: {
              type: 'string',
              description: 'Return red part from color3 rgb.'
            },
            color3_green: {
              type: 'string',
              description: 'Return green part from color3 rgb.'
            },
            color3_blue: {
              type: 'string',
              description: 'Return blue part from color3 rgb.'
            },
            color4_red: {
              type: 'string',
              description: 'Return red part from color4 rgb.'
            },
            color4_green: {
              type: 'string',
              description: 'Return green part from color4 rgb.'
            },
            color4_blue: {
              type: 'string',
              description: 'Return blue part from color4 rgb.'
            },
            color5_red: {
              type: 'string',
              description: 'Return red part from color5 rgb.'
            },
            color5_green: {
              type: 'string',
              description: 'Return green part from color5 rgb.'
            },
            color5_blue: {
              type: 'string',
              description: 'Return blue part from color5 rgb.'
            }
          },
          required: [
            // 'prompt'
          ]
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.text_to_digital_illustration_generation) {
      const system = 'You are an assistant';
      const models = defaultModels.text_to_digital_illustration_generation[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the image.'
            },
            style: {
              type: 'string',
              description: 'Return "digital_illustration"'
            },
            style_id: {
              type: 'string',
              description: 'Return specified style_id for generating the image.'
            },
            num_images: {
              type: 'number',
              description: 'The number of images to generate.'
            },
            width: {
              type: 'number',
              description: 'Return image width to generate.'
            },
            height: {
              type: 'number',
              description: 'Return image height to generate.'
            },
            aspect_ratio: {
              type: 'string',
              description: 'Example: 3:4, 16:9, etc'
            },
            color1_red: {
              type: 'string',
              description: 'Return red part from color1 rgb.'
            },
            color1_green: {
              type: 'string',
              description: 'Return green part from color1 rgb.'
            },
            color1_blue: {
              type: 'string',
              description: 'Return blue part from color1 rgb.'
            },
            color2_red: {
              type: 'string',
              description: 'Return red part from color2 rgb.'
            },
            color2_green: {
              type: 'string',
              description: 'Return green part from color2 rgb.'
            },
            color2_blue: {
              type: 'string',
              description: 'Return blue part from color2 rgb.'
            },
            color3_red: {
              type: 'string',
              description: 'Return red part from color3 rgb.'
            },
            color3_green: {
              type: 'string',
              description: 'Return green part from color3 rgb.'
            },
            color3_blue: {
              type: 'string',
              description: 'Return blue part from color3 rgb.'
            },
            color4_red: {
              type: 'string',
              description: 'Return red part from color4 rgb.'
            },
            color4_green: {
              type: 'string',
              description: 'Return green part from color4 rgb.'
            },
            color4_blue: {
              type: 'string',
              description: 'Return blue part from color4 rgb.'
            },
            color5_red: {
              type: 'string',
              description: 'Return red part from color5 rgb.'
            },
            color5_green: {
              type: 'string',
              description: 'Return green part from color5 rgb.'
            },
            color5_blue: {
              type: 'string',
              description: 'Return blue part from color5 rgb.'
            }
          },
          required: [
            // 'prompt'
          ]
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.text_to_book_cover_generation) {
      const system = 'You are an assistant';
      const models = defaultModels.text_to_book_cover_generation[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            prompt: {
              type: 'string',
              description: 'Return user\'s instruction/prompt for generating the image.'
            },
            style: {
              type: 'string',
              description: 'Return "digital_illustration/cover"'
            },
            num_images: {
              type: 'number',
              description: 'The number of images to generate.'
            },
            width: {
              type: 'number',
              description: 'Return image width to generate.'
            },
            height: {
              type: 'number',
              description: 'Return image height to generate.'
            },
            aspect_ratio: {
              type: 'string',
              description: 'Example: 3:4, 16:9, etc'
            },
            color1_red: {
              type: 'string',
              description: 'Return red part from color1 rgb.'
            },
            color1_green: {
              type: 'string',
              description: 'Return green part from color1 rgb.'
            },
            color1_blue: {
              type: 'string',
              description: 'Return blue part from color1 rgb.'
            },
            color2_red: {
              type: 'string',
              description: 'Return red part from color2 rgb.'
            },
            color2_green: {
              type: 'string',
              description: 'Return green part from color2 rgb.'
            },
            color2_blue: {
              type: 'string',
              description: 'Return blue part from color2 rgb.'
            },
            color3_red: {
              type: 'string',
              description: 'Return red part from color3 rgb.'
            },
            color3_green: {
              type: 'string',
              description: 'Return green part from color3 rgb.'
            },
            color3_blue: {
              type: 'string',
              description: 'Return blue part from color3 rgb.'
            },
            color4_red: {
              type: 'string',
              description: 'Return red part from color4 rgb.'
            },
            color4_green: {
              type: 'string',
              description: 'Return green part from color4 rgb.'
            },
            color4_blue: {
              type: 'string',
              description: 'Return blue part from color4 rgb.'
            },
            color5_red: {
              type: 'string',
              description: 'Return red part from color5 rgb.'
            },
            color5_green: {
              type: 'string',
              description: 'Return green part from color5 rgb.'
            },
            color5_blue: {
              type: 'string',
              description: 'Return blue part from color5 rgb.'
            }
          },
          required: [
            // 'prompt'
          ]
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    } else if (argsIntent.text_to_speech) {
      const system = 'You are an assistant';
      const models = defaultModels.text_to_speech[provider];
      const context = `
Thie is the list of models:
- ${models.join('\n- ')}
`;
      let question = `This is user's request:

${prompt}

Check the request and return the details.
    `;
      let functs = [{
        name: 'check_request',
        description: 'Check user request.',
        parameters: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Return the chosen model name from the model list.'
            },
            text: {
              type: 'string',
              description: 'Return text or prompt to convert to speech.'
            },
            voice: {
              type: 'string',
              description: 'Return the voice reference to use.'
            },
            speed: {
              type: 'string',
              description: 'Return the speed.'
            }
          },
          required: ['text']
        }
      }];
      let result = await this.builder.send(question, context, system, '', functs);
      if (!result) {
        return false; //aborted
      }
      let args = JSON.parse(result);
      let combined = {
        ...argsIntent,
        ...args
      };
      return combined;
    }
    return false;
  }
  async checkModel(info) {
    let system = 'You are an assistant';
    let context = '';
    let question = `This is the information:

${info}

Check the information and return the details.
`;
    let functs = [{
      name: 'check_request',
      description: 'Check information.',
      parameters: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            description: 'Return the model name.'
          }
        },
        required: ['model']
      }
    }];
    let result = await this.builder.send(question, context, system, '', functs);
    if (!result) {
      return false; //aborted
    }
    let args = JSON.parse(result);
    return args;
  }
  getDimension(aspect_ratio) {
    let width, height;
    if (aspect_ratio) {
      if (aspect_ratio === '1:1') {
        width = 1024;
        height = 1024;
      } else if (aspect_ratio === '3:2') {
        width = 1216;
        height = 832;
      } else if (aspect_ratio === '4:3') {
        width = 1152;
        height = 896;
      } else if (aspect_ratio === '5:4') {
        width = 1088;
        height = 896;
      } else if (aspect_ratio === '16:9') {
        width = 1344;
        height = 768;
      } else if (aspect_ratio === '21:9') {
        width = 1536;
        height = 640;
      } else if (aspect_ratio === '2:3') {
        width = 832;
        height = 1216;
      } else if (aspect_ratio === '3:4') {
        width = 896;
        height = 1152;
      } else if (aspect_ratio === '4:5') {
        width = 896;
        height = 1088;
      } else if (aspect_ratio === '9:19') {
        width = 768;
        height = 1344;
      } else if (aspect_ratio === '9:21') {
        width = 640;
        height = 1536;
      } else {
        width = 1344;
        height = 768;
      }
    } else {
      width = 1344;
      height = 768;
    }
    return {
      w: width,
      h: height
    };
  }

  /*
  // Example: const endpoint = this.getEndpoint(model, requestId, this.builder.settings.falStatusEndpointList);
  getEndpoint(model, requestId, endpointList) {
      
       // Try to find a matching config (ignoring the default marker '*')
      let config = endpointList.find(item => item.model !== '*' && model && model.includes(item.model));
      
      // If no specific config is found, use the default entry
      if (!config) {
          config = endpointList.find(item => item.model === '*');
      }
       let endpoint = config.endpoint;
       // Replace {REQUEST_ID} with actual requestId
      endpoint = endpoint.replace('{REQUEST_ID}', requestId);
       // Replace {model} with the actual model if needed
       let firstTwoParts = model.split('/').slice(0, 2).join('/');
      console.log(firstTwoParts);
       if (endpoint.includes('{MODEL}')) {
          endpoint = endpoint.replace('{MODEL}', firstTwoParts);
      }
       return endpoint;
  }
  */

  getEndpoint(model, requestId, endpoint) {
    endpoint = endpoint.replace('{REQUEST_ID}', requestId);
    let firstTwoParts = model.split('/').slice(0, 2).join('/');
    endpoint = endpoint.replace('{MODEL}', firstTwoParts);
    return endpoint;
  }
  async waitingResultFal(jsonBody, requestId, resultDiv, hideOutput) {
    let response, result;

    // Pass jsonBody from initial request with added request_id
    jsonBody.request_id = requestId;
    const endpoint = this.getEndpoint(jsonBody.model, requestId, this.builder.settings.falResultEndpoint);
    jsonBody.endpoint = endpoint;
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    response = await fetch(this.builder.settings.getResultUrl_Fal, {
      signal: this.builder.mediaSignal,
      method: 'POST',
      headers,
      body: JSON.stringify(jsonBody)
    });

    // result = await response.json();
    let text = await response.text(); // Read response as text first
    try {
      result = JSON.parse(text); // Attempt to parse JSON
    } catch (e) {
      // throw new Error(text); // If parsing fails, throw raw text as error

      // // Cleanup
      // await fetch(this.builder.settings.cleanup, {
      //     signal: this.builder.mediaSignal,
      //     method: 'POST',
      //     headers,
      //     body: JSON.stringify(jsonBody),
      // });

      return {
        mediaGenerated: false,
        status: 'error',
        message: text
      };
    }

    /*
    if(result.error && result.httpCode) { // && result.httpCode === 400
      
        if(this.builder.settings.consoleLog) console.log(result.error);
         await new Promise((resolve) => setTimeout(resolve, 2000)); // add delay 
        return this.waitingResultFal(jsonBody, requestId, resultDiv, hideOutput);
    }
    */

    // Collect result
    this.builder.output.push(result);
    if (!result.error) {
      const data = result.data;
      let html = '';
      let markdown = '';
      let extension;
      let isImage = false;
      let output = [];
      let output2 = [];
      data.entries && data.entries.forEach(item => {
        extension = item.url.split('.').pop().toLowerCase();
        if (extension === 'mp4') {
          html += `
                        <p class="responsive-video">
                            <video controls>
                                <source src="${item.url}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </p>
                    `;
          markdown += `![](${item.url})`;
        } else if (extension === 'wav' || extension === 'mp3') {
          html += `
                    <p class="responsive-audio">
                        <audio controls>
                            <source src="${item.url}" type="audio/mpeg">
                            Your browser does not support the audio tag.
                        </audio>
                    </p>
                    `;
          markdown += `![](${item.url})`;
        } else {
          html += `
                        <div>
                            <img src="${item.url}" />
                            <div>
                                <a class="link-view" href="${item.url}" target="_blank" rel="noopener noreferrer">${this.out('View')}</a>
                                <a class="link-download" href="${item.url}" download>${this.out('Download')}</a>
                            </div>
                        </div>
                    `;
          markdown += `![](${item.url})`;
          isImage = true;
        }
        output.push(item.url);
        output2.push(item.file_url);
      });
      if (isImage) {
        html = `<div class="image-container">${html}</div>`;
      }
      if (typeof data === 'string') {
        // Describe image result
        html = data;
        markdown = data;
      }
      if (!hideOutput) {
        resultDiv.innerHTML = html;
        this.builder.outputHtml += `<div class="result-container">${html}</div>`;
      } else {
        resultDiv.innerHTML = '';
        resultDiv.remove();
      }

      // // Final Cleanup
      // await fetch(this.builder.settings.cleanup, {
      //     signal: this.builder.mediaSignal,
      //     method: 'POST',
      //     headers,
      //     body: JSON.stringify(jsonBody),
      // });

      // return markdown;
      return {
        mediaGenerated: true,
        status: 'success',
        markdown,
        output,
        output2
      };
    } else {
      // // Cleanup
      // await fetch(this.builder.settings.cleanup, {
      //     signal: this.builder.mediaSignal,
      //     method: 'POST',
      //     headers,
      //     body: JSON.stringify(jsonBody),
      // });

      if (this.builder.settings.consoleLog) console.log(result.error);
      return {
        mediaGenerated: false,
        status: 'error',
        message: result.error //this.out('Request failed.')
      };
    }
  }
  async waitingResultReplicate(jsonBody, requestId, resultDiv, hideOutput) {
    let response, result;

    // Pass jsonBody from initial request with added request_id
    jsonBody.request_id = requestId;
    let endpoint = this.builder.settings.replicateStatusEndpoint;
    endpoint = endpoint.replace('{REQUEST_ID}', requestId);
    jsonBody.endpoint = endpoint;
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    response = await fetch(this.builder.settings.getResultUrl_Replicate, {
      signal: this.builder.mediaSignal,
      method: 'POST',
      headers,
      body: JSON.stringify(jsonBody)
    });

    // result = await response.json();
    let text = await response.text(); // Read response as text first
    try {
      result = JSON.parse(text); // Attempt to parse JSON
    } catch (e) {
      // throw new Error(text); // If parsing fails, throw raw text as error

      // // Cleanup
      // await fetch(this.builder.settings.cleanup, {
      //     signal: this.builder.mediaSignal,
      //     method: 'POST',
      //     headers,
      //     body: JSON.stringify(jsonBody),
      // });

      return {
        mediaGenerated: false,
        status: 'error',
        message: text
      };
    }

    // Collect result
    this.builder.output.push(result);
    if (!result.error) {
      const data = result.data;
      let final = this.renderResult(data, resultDiv, hideOutput);

      // // Final Cleanup
      // await fetch(this.builder.settings.cleanup, {
      //     signal: this.builder.mediaSignal,
      //     method: 'POST',
      //     headers,
      //     body: JSON.stringify(jsonBody),
      // });

      // return markdown;
      return {
        mediaGenerated: true,
        status: 'success',
        markdown: final.markdown,
        output: final.output,
        output2: final.output2
      };
    } else {
      // // Cleanup
      // await fetch(this.builder.settings.cleanup, {
      //     signal: this.builder.mediaSignal,
      //     method: 'POST',
      //     headers,
      //     body: JSON.stringify(jsonBody),
      // });

      if (this.builder.settings.consoleLog) console.log(result.error);
      return {
        mediaGenerated: false,
        status: 'error',
        message: result.error //this.out('Request failed.')
      };
    }
  }
  async waitingReplicate(jsonBody, requestId, resultDiv, hideOutput) {
    let status, response, result;
    let model = jsonBody.model;
    let endpoint = this.builder.settings.replicateStatusEndpoint;
    endpoint = endpoint.replace('{REQUEST_ID}', requestId);
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    let inputCheckStatus = {
      model,
      endpoint,
      request_id: requestId
      // customData: this.builder.settings.customData
    };
    do {
      response = await fetch(this.builder.settings.checkRequestStatusUrl_Replicate, {
        signal: this.builder.mediaSignal,
        method: 'POST',
        headers,
        body: JSON.stringify(inputCheckStatus)
      });
      result = await response.json();
      if (result.ok) {
        status = result.data.status; // status: starting, processing, succeeded, failed, canceled
      }
      if (!status) {
        // // Cleanup
        // await fetch(this.builder.settings.cleanup, {
        //     signal: this.builder.mediaSignal,
        //     method: 'POST',
        //     headers,
        //     body: JSON.stringify(jsonBody),
        // });

        return {
          mediaGenerated: false,
          status: 'error',
          result,
          // for future debugging
          message: result.error || result.data && JSON.stringify(result.data) || this.out('Request failed.')
        };
      }
      if (!(status === 'succeeded' || status === 'failed' || status === 'canceled')) {
        if (this.builder.settings.consoleLog) console.log(status);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
      }
    } while (!(status === 'succeeded' || status === 'failed' || status === 'canceled'));
    if (status === 'succeeded') {
      return await this.waitingResultReplicate(jsonBody, requestId, resultDiv, hideOutput);
    } else {
      // // Cleanup
      // await fetch(this.builder.settings.cleanup, {
      //     signal: this.builder.mediaSignal,
      //     method: 'POST',
      //     headers,
      //     body: JSON.stringify(jsonBody),
      // });

      return {
        mediaGenerated: false,
        status: 'error',
        result,
        // for future debugging
        message: result.data && result.data.error || this.out('Request failed.')
      };
    }
  }
  async waitingFal(jsonBody, requestId, resultDiv, hideOutput) {
    let status, response, result;
    let model = jsonBody.model;
    const endpoint = this.getEndpoint(model, requestId, this.builder.settings.falStatusEndpoint);
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    let inputCheckStatus = {
      model,
      endpoint,
      request_id: requestId
      // customData: this.builder.settings.customData
    };
    do {
      response = await fetch(this.builder.settings.checkRequestStatusUrl_Fal, {
        signal: this.builder.mediaSignal,
        method: 'POST',
        headers,
        body: JSON.stringify(inputCheckStatus)
      });
      result = await response.json();
      if (result.ok && result.status) {
        // From endpoint that uses SDK
        status = result.status;
      } else if (result.data) {
        // From endpoint that uses API
        let data = result.data;
        if (data.image || data.audio || data.audio_file || data.video) {
          status = 'COMPLETED';
        } else if (data.detail && typeof data.detail === 'string' && data.detail.startsWith('Request is still in progress')) {
          //Request is still in progress
          status = 'IN_PROGRESS';
        } else if (data.status && !data.error) {
          status = data.status;
        }
      }
      if (!status) {
        // // Cleanup
        // await fetch(this.builder.settings.cleanup, {
        //     signal: this.builder.mediaSignal,
        //     method: 'POST',
        //     headers,
        //     body: JSON.stringify(jsonBody),
        // });

        return {
          mediaGenerated: false,
          status: 'error',
          result,
          // for future debugging
          message: result.error || result.data && JSON.stringify(result.data) || this.out('Request failed.')
        };
      }

      /*
      status = result.ok ? result.status : null;
           if(!status) {
           // Cleanup
          await fetch(this.builder.settings.cleanup, {
              signal: this.builder.mediaSignal,
              method: 'POST',
              headers,
              body: JSON.stringify(jsonBody),
          });
          
          return {
              mediaGenerated: false,
              status: 'error',
              message: result.error //this.out('Generating video request failed.')
          };
      }
      */
      if (status !== 'COMPLETED') {
        if (this.builder.settings.consoleLog) console.log(status);
        if (this.builder.settings.consoleLog) console.log(result);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
      }
    } while (status !== 'COMPLETED');
    if (status === 'COMPLETED') {
      return await this.waitingResultFal(jsonBody, requestId, resultDiv, hideOutput);
    }
  }
  renderResult(data, resultDiv, hideOutput) {
    let html = '';
    let markdown = '';
    let output = [];
    let output2 = [];
    if (data.entries) {
      let extension;
      let isImage = false;
      data.entries.forEach(item => {
        extension = item.url.split('.').pop().toLowerCase();
        if (extension === 'mp4') {
          html += `
                        <p class="responsive-video">
                            <video controls>
                                <source src="${item.url}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </p>
                    `;
          markdown += `![](${item.url})`;
          output.push(item.url);
          output2.push(item.file_url);
        } else if (extension === 'wav' || extension === 'mp3') {
          html += `
                    <p class="responsive-audio">
                        <audio controls>
                            <source src="${item.url}" type="audio/mpeg">
                            Your browser does not support the audio tag.
                        </audio>
                    </p>
                    `;
          markdown += `![](${item.url})`;
          output.push(item.url);
          output2.push(item.file_url);
        } else {
          html += `
                        <div>
                            <img src="${item.url}" />
                            <div>
                                <a class="link-view" href="${item.url}" target="_blank" rel="noopener noreferrer">${this.out('View')}</a>
                                <a class="link-download" href="${item.url}" download>${this.out('Download')}</a>
                            </div>
                        </div>
                    `;
          markdown += `![](${item.url})`;
          output.push(item.url);
          output2.push(item.file_url);
          isImage = true;
        }
      });
      if (isImage) {
        html = `<div class="image-container">${html}</div>`;
      }
    } else if (typeof data === 'string') {
      html = `
            <p>
            ${data}
            </p>`;
      markdown = data;
    }
    if (!hideOutput) {
      resultDiv.innerHTML = html;
      this.builder.outputHtml += `<div class="result-container">${html}</div>`;
    } else {
      resultDiv.innerHTML = '';
      resultDiv.remove();
    }
    return {
      markdown,
      output,
      output2
    };
  }
  async generateReplicate(args, resultDiv, hideOutput) {
    let input;
    let jsonBody = {};
    const provider = 'replicate';
    if (args.text_to_image_generation) {
      let model = this.validateModel(args.model, provider, 'text_to_image_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let aspect_ratio = args.aspect_ratio || '16:9'; // for Replicate

      let num_images = args.num_images || 1;
      if (num_images > 4) num_images = 4;
      input = {
        prompt,
        aspect_ratio,
        num_outputs: num_images
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.edit_area_in_image) {
      let model = this.validateModel(args.model, provider, 'edit_area_in_image');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let image_url = args.image_url;
      if (!image_url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image reference not found.')
        };
      }
      let provider = 'replicate';
      const inputURLs = await this.builder.upload.getInputURLs(provider, true); // optional: use local upload
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      let uploadedFileUrl = inputURLs[args.image_url]; // args.image_url = field name
      let uploadedMaskUrl = inputURLs[args.image_url + '_mask'];
      if (!uploadedMaskUrl) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image mask not found.')
        };
      }
      input = {
        prompt,
        image: uploadedFileUrl,
        mask: uploadedMaskUrl
        // num_images,
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.text_to_digital_illustration_generation) {
      let model = this.validateModel(args.model, provider, 'text_to_digital_illustration_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let width = args.width || 1280;
      let height = args.height || 768;
      args.num_images || 1;
      input = {
        prompt,
        size: `${width}x${height}`,
        // num_images,
        style: 'digital_illustration'
        // style_id,
        // colors,
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.upscale_image) {
      let model = this.validateModel(args.model, provider, 'upscale_image');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let image_url = args.image_url;
      if (!image_url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image reference not found.')
        };
      }
      let provider = 'replicate';
      const inputURLs = await this.builder.upload.getInputURLs(provider);
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      let uploadedFileUrl = inputURLs[args.image_url];
      if (!uploadedFileUrl) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image not provided.')
        };
      }
      input = {
        image: uploadedFileUrl
        // scale_factor: 2,
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.describe_image) {
      let model = this.validateModel(args.model, provider, 'describe_image');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let image_url = args.image_url;
      if (!image_url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image reference not found.')
        };
      }
      let provider = 'replicate';
      const inputURLs = await this.builder.upload.getInputURLs(provider);
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      let uploadedFileUrl = inputURLs[args.image_url]; // args.image_url = field name

      if (!uploadedFileUrl) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image not provided.')
        };
      }
      input = {
        image: uploadedFileUrl,
        prompt: `${prompt}. No talk. Answer only.`
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.image_to_video_generation) {
      let model = this.validateModel(args.model, provider, 'image_to_video_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt || 'stunning video';
      let duration = args.duration || 5;
      if (duration > 10) duration = 5;
      let provider = 'replicate';
      const inputURLs = await this.builder.upload.getInputURLs(provider);
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      let uploadedFileUrl = inputURLs[args.image_url]; // args.image_url = field name

      if (!uploadedFileUrl) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image reference not found.')
        };
      }
      if (model === 'kwaivgi/kling-v1.6-pro') {
        input = {
          start_image: uploadedFileUrl,
          prompt,
          duration
        };
      }
      if (model === 'kwaivgi/kling-v1.6-standard') {
        input = {
          start_image: uploadedFileUrl,
          prompt,
          duration
        };
      }
      if (model === 'minimax/video-01-live') {
        input = {
          first_frame_image: uploadedFileUrl,
          prompt
        };
      }
      if (model === 'luma/ray') {
        input = {
          start_image_url: uploadedFileUrl,
          prompt
        };
      }
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.text_to_video_generation) {
      let model = this.validateModel(args.model, provider, 'text_to_video_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let duration = args.duration || 5;
      if (duration > 10) duration = 5;
      if (model === 'kwaivgi/kling-v1.6-standard') {
        input = {
          prompt,
          duration
        };
      }
      if (model === 'minimax/video-01') {
        input = {
          prompt
        };
      }
      if (model === 'luma/ray') {
        input = {
          prompt
        };
      }
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.text_to_speech) {
      let model = this.validateModel(args.model, provider, 'text_to_speech');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      if (args.text.length > this.builder.settings.ttsMaxCharacters) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('The text exceeds the allowed limit.')
        };
      }
      input = {
        text: args.text,
        voice: args.voice || 'af_nicole',
        speed: parseFloat(args.speed) || 1
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    }

    // Start generation

    if (jsonBody.model.indexOf(':') !== -1) {
      const parts = jsonBody.model.split(':'); // Split the model into parts
      const version = parts[1];
      jsonBody.version = version;

      // Add endpoint & payload
      let endpoint = this.builder.settings.replicateEndpoint1; // 'https://api.replicate.com/v1/predictions';
      jsonBody.endpoint = endpoint;
      jsonBody.payload = input;
      if (this.builder.settings.consoleLog) console.log('PAYLOAD 1'); // Test using: text to speech
    } else {
      // Add endpoint & payload
      let endpoint = this.builder.settings.replicateEndpoint2; //`https://api.replicate.com/v1/models/${input.model}/predictions`;
      endpoint = endpoint.replace('{MODEL}', jsonBody.model);
      jsonBody.endpoint = endpoint;
      jsonBody.payload = input;
      if (this.builder.settings.consoleLog) console.log('PAYLOAD 2'); // Test using: Local Edit
    }

    // Collect payload
    this.builder.payloads.push(jsonBody);
    if (this.builder.settings.consoleLog) console.log(jsonBody);
    let queue = false; // use this.builder.settings.generateMediaUrl
    if (this.builder.settings.generateMediaUrl_Replicate) queue = true;
    if (queue) {
      // Queue (server is using API request)

      let url = this.builder.settings.generateMediaUrl_Replicate;
      if (!url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Endpoint not configured.')
        };
      }
      let requestId;
      let headers = {
        'Content-Type': 'application/json',
        ...this.builder.settings.headers
      };
      let response = await fetch(url, {
        signal: this.builder.mediaSignal,
        method: 'POST',
        headers,
        body: JSON.stringify(jsonBody)
      });
      let result = await response.json();
      if (result.ok) {
        /*
        {
            "ok": true,
            "data": {
                "detail": "- input.image: Does not match format 'uri'\n",
                "status": 422,
                "title": "Input validation failed",
                "invalid_fields": [
                    {
                        "type": "format",
                        "field": "input.image",
                        "description": "Does not match format 'uri'"
                    }
                ]
            }
        }
         {
            "ok": true,
            "data": {
                "id": "w891q....re2rv1c",
                "model": "fofr\/expression-editor",
                "version": "bf913bc...",
                "input": {
                    "aaa": 0,
                    "blink": 0,
                    "crop_factor": 1.7,
                    "eee": 0,
                    "eyebrow": 0,
                    "image": "https:\/\/...zonaws.com\/ai-uUmx9.jpeg",
                    "output_format": "webp",
                    "output_quality": 95,
                    "pupil_x": 13.46,
                    "pupil_y": 0,
                    "rotate_pitch": 0,
                    "rotate_roll": 0,
                    "rotate_yaw": 0,
                    "sample_ratio": 1,
                    "smile": 1.3,
                    "src_ratio": 1,
                    "wink": 0,
                    "woo": 0
                },
                "logs": "",
                "output": [
                    "https:\/\/replicate.delivery\/xezq...review1.webp"
                ],
                "data_removed": false,
                "error": null,
                "status": "processing",
                "created_at": "2025-01-22T00:20:08.605Z",
                "urls": {
                    "cancel": "https:\/\/api.replicate.com\/v1\/predic.../cancel",
                    "get": "https:\/\/api.replicate.com\/v1\/predi...e2rv1c",
                    "stream": "https:\/\/stream.replicate.com\/v1\/files..t3gsaa"
                }
            }
        }
        */

        requestId = result.data.id;
        if (!requestId) {
          return {
            mediaGenerated: false,
            status: 'error',
            message: result.data && result.data.detail
          };
        }
      } else {
        return {
          mediaGenerated: false,
          status: 'error',
          message: result.error
        };
      }
      const waitingResult = this.waitingReplicate(jsonBody, requestId, resultDiv, hideOutput);
      this.builder.isMediaGenerating = false;
      return waitingResult;
    } else {
      // Non Queue (server is using SDK)

      let url = this.builder.settings.generateMediaUrl;
      if (!url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Endpoint not configured: generateMediaUrl.')
        };
      }
      let headers = {
        'Content-Type': 'application/json',
        ...this.builder.settings.headers
      };
      const response = await fetch(url, {
        signal: this.builder.mediaSignal,
        method: 'POST',
        headers,
        body: JSON.stringify(jsonBody)
      });
      const result = await response.json();
      this.builder.isMediaGenerating = false;
      if (!result.error) {
        const data = result.data;
        let final = this.renderResult(data, resultDiv, hideOutput);

        // return markdown;
        return {
          mediaGenerated: true,
          status: 'success',
          markdown: final.markdown,
          output: final.output,
          output2: final.output2
        };
      } else {
        if (this.builder.settings.consoleLog) console.log(result.error);
        return {
          mediaGenerated: false,
          status: 'error',
          message: result.error //this.out('Request failed.')
        };
      }
    }
  }
  async generateOpenAI(args, resultDiv, hideOutput) {
    let input;
    let jsonBody = {};
    const provider = 'openai';
    let model = this.validateModel(args.model, provider, 'image_generation');
    let prompt = args.prompt;
    if (!prompt) {
      return {
        mediaGenerated: false,
        status: 'error',
        message: this.out('Please input a prompt.')
      };
    }

    /*
    const imageFiles = [];
     let formValues = this.builder.getFormValues();
    if (formValues && Object.keys(formValues).length === 0) {
        // Do Nothing
    } else {
        for (const field of formValues) {
            if (field.value instanceof FileList && field.type === 'multifile') {
                 const files = field.value;
                if (files.length > 0) {
                    for (const file of files) {
                        const base64Data = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const data = e.target.result.split(',')[1];
                                resolve(data);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        });
                        imageFiles.push(base64Data);
                    }
                }
            }
        }
    }
    */

    const formData = new FormData();
    formData.append('customData', this.builder.settings.customData);
    formData.append('model', model);
    formData.append('prompt', prompt);
    let hasFiles = false;
    let formValues = this.builder.getFormValues();
    for (const field of formValues) {
      if (field.value instanceof FileList && field.type === 'multifile') {
        const files = field.value;
        if (files.length > 0) {
          for (const file of files) {
            formData.append('file[]', file);
            hasFiles = true;
          }
        }
      }
      if (field.value instanceof FileList && field.type === 'file') {
        const files = field.value;
        if (files.length > 0) {
          const file = files[0];
          formData.append('file[]', file);
          hasFiles = true;
        }
      }
      if (typeof field.value === 'string' && field.value.indexOf('base64') !== -1) {
        let base64 = field.value.replace(/^data:image\/(png|svg\+xml|jpeg|gif|webp);base64,/, '');
        formData.append('mask', base64);
      }
    }
    let response;

    // console.log(args);

    // return {
    //     mediaGenerated: false,
    //     status: 'error',
    //     message: this.out('STOP..')
    // };

    let size = args.size || 'auto';
    let quality = args.quality || 'auto';
    let n = args.num_images || 1;
    if (hasFiles) {
      /*
      Edit image:
          image
          prompt
          mask
          n
          quality (high, medium, low, auto)
          size (1024x1024, 1536x1024 (landscape), 1024x1536 (portrait), or auto (default value) )
      */

      /*
      if (args.image_variation_generation) {
           formData.append('size', '1024x1024'); // Must be one of 256x256, 512x512, or 1024x1024.
          formData.append('n', n);
           let url = this.builder.settings.generateMediaUrl_OpenAI_CreateImageVariation;
          response = await fetch(url, {
              method: 'POST',
              body: formData,
          });
       } else { // args.image_generation
           formData.append('size', size);
          formData.append('n', n);
          formData.append('quality', quality);
           let url = this.builder.settings.generateMediaUrl_OpenAI_CreateImageEdit;
          response = await fetch(url, {
              method: 'POST',
              body: formData,
          });
      }
      */

      formData.append('size', size);
      formData.append('n', n);
      formData.append('quality', quality);

      // Collect payload
      input = {
        prompt,
        size,
        quality,
        n
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
      jsonBody.payload = input;
      this.builder.payloads.push(jsonBody);
      // ---

      let url = this.builder.settings.generateMediaUrl_OpenAI_CreateImageEdit;
      response = await fetch(url, {
        method: 'POST',
        body: formData
      });
    } else {
      /*
      Create image:
          prompt
          background (transparent, opaque or auto)
          moderation (low, auto)
          n
          output_compression (0-100)
          output_format (webp, jpeg, png)
          quality (high, medium, low, auto)
          size (1024x1024, 1536x1024 (landscape), 1024x1536 (portrait), or auto (default value) )
      */

      let background = args.background || 'auto';
      let output_format = args.output_format || 'png';
      input = {
        prompt,
        background,
        output_format,
        size,
        quality,
        n
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
      jsonBody.payload = input;

      // Collect payload
      this.builder.payloads.push(jsonBody);
      if (this.builder.settings.consoleLog) console.log(jsonBody);

      // console.log(jsonBody);
      // return {
      //     mediaGenerated: false,
      //     status: 'error',
      //     message: this.out('STOP..')
      // };

      const url = this.builder.settings.generateMediaUrl_OpenAI_CreateImage;
      let headers = {
        'Content-Type': 'application/json',
        ...this.builder.settings.headers
      };
      response = await fetch(url, {
        signal: this.builder.mediaSignal,
        method: 'POST',
        headers,
        body: JSON.stringify(jsonBody)
      });
    }
    const result = await response.json();
    if (this.builder.settings.consoleLog) console.log(result);
    this.builder.isMediaGenerating = false;
    const data = result.data;

    // Collect result
    this.builder.output.push(result);
    let final = this.renderResult(data, resultDiv, hideOutput);

    // return markdown;
    return {
      mediaGenerated: true,
      status: 'success',
      markdown: final.markdown,
      output: final.output,
      output2: final.output2
    };
  }
  async generateGoogle(args, resultDiv, hideOutput) {
    let input;
    let jsonBody = {};
    const provider = 'google';
    let model = this.validateModel(args.model, provider, 'edit_area_in_image');
    if (!model) {
      return {
        mediaGenerated: false,
        status: 'error',
        message: this.out('Model not found.')
      };
    }
    let prompt = args.prompt;
    if (!prompt) {
      return {
        mediaGenerated: false,
        status: 'error',
        message: this.out('Please input a prompt.')
      };
    }
    let contents = [];
    contents.push({
      text: prompt
    });

    // contents.push({
    //     parts: [
    //         {
    //             text: prompt
    //         }
    //     ]
    // });
    // contents.parts.push({ inlineData:  ... })

    let formValues = this.builder.getFormValues();
    if (formValues && Object.keys(formValues).length === 0) ; else {
      for (const field of formValues) {
        if (field.value instanceof FileList && field.type === 'multifile') {
          const files = field.value;
          if (files.length > 0) {
            for (const file of files) {
              const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => {
                  const data = e.target.result.split(',')[1];
                  resolve(data);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
              // console.log(base64Data)
              contents.push({
                inlineData: {
                  mimeType: 'image/png',
                  data: base64Data
                }
              });
            }
          }
        }
      }
    }
    input = {
      contents
    };
    jsonBody.model = model;
    jsonBody.customData = this.builder.settings.customData;

    // Add endpoint & payload
    // let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
    // jsonBody.endpoint = endpoint;

    jsonBody.payload = input;

    // Collect payload
    this.builder.payloads.push(jsonBody);
    if (this.builder.settings.consoleLog) console.log(jsonBody);
    const url = this.builder.settings.generateMediaUrl_Google; // Queue
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    const response = await fetch(url, {
      signal: this.builder.mediaSignal,
      method: 'POST',
      headers,
      body: JSON.stringify(jsonBody)
    });
    const result = await response.json();
    if (this.builder.settings.consoleLog) console.log(result);
    this.builder.isMediaGenerating = false;
    const data = result.data;
    let final = this.renderResult(data, resultDiv, hideOutput);

    // return markdown;
    return {
      mediaGenerated: true,
      status: 'success',
      markdown: final.markdown,
      output: final.output,
      output2: final.output2
    };
  }
  async generateFal(args, resultDiv, hideOutput) {
    let provider = 'fal';
    let input;
    let jsonBody = {};
    if (args.text_to_image_generation) {
      let model = this.validateModel(args.model, provider, 'text_to_image_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let width = args.width || 1280;
      let height = args.height || 768;
      let aspect_ratio = args.aspect_ratio; // for Replicate
      let num_images = args.num_images || 1;
      if (num_images > 4) num_images = 4;
      if (aspect_ratio) {
        let {
          w,
          h
        } = this.getDimension(aspect_ratio);
        width = w;
        height = h;
      }

      //---------
      let color1_red = args.color1_red;
      let color1_green = args.color1_green;
      let color1_blue = args.color1_blue;
      let color2_red = args.color2_red;
      let color2_green = args.color2_green;
      let color2_blue = args.color2_blue;
      let color3_red = args.color3_red;
      let color3_green = args.color3_green;
      let color3_blue = args.color3_blue;
      let color4_red = args.color4_red;
      let color4_green = args.color4_green;
      let color4_blue = args.color4_blue;
      let color5_red = args.color5_red;
      let color5_green = args.color5_green;
      let color5_blue = args.color5_blue;
      let colors = [];
      if (color1_red && color1_green && color1_blue && !(color1_red === '0' && color1_green === '0' && color1_blue === '0')) {
        colors.push({
          r: color1_red,
          g: color1_green,
          b: color1_blue
        });
      }
      if (color2_red && color2_green && color2_blue && !(color2_red === '0' && color2_green === '0' && color2_blue === '0')) {
        colors.push({
          r: color2_red,
          g: color2_green,
          b: color2_blue
        });
      }
      if (color3_red && color3_green && color3_blue && !(color3_red === '0' && color3_green === '0' && color3_blue === '0')) {
        colors.push({
          r: color3_red,
          g: color3_green,
          b: color3_blue
        });
      }
      if (color4_red && color4_green && color4_blue && !(color4_red === '0' && color4_green === '0' && color4_blue === '0')) {
        colors.push({
          r: color4_red,
          g: color4_green,
          b: color4_blue
        });
      }
      if (color5_red && color5_green && color5_blue && !(color5_red === '0' && color5_green === '0' && color5_blue === '0')) {
        colors.push({
          r: color5_red,
          g: color5_green,
          b: color5_blue
        });
      }

      // let style = args.style || 'any';
      //---------

      const uploadMultiple = async () => {
        let filesAdded = [];
        let formValues = this.builder.getFormValues();
        for (const field of formValues) {
          if (field.value instanceof FileList && field.type === 'multifile') {
            const files = field.value;
            if (files.length > 0) {
              let index = 0;
              for (const file of files) {
                index++;
                const formData = new FormData();
                formData.append('file', file); // not using file[] since it's for single upload/fetch
                formData.append('customData', this.builder.settings.customData);
                let uploadUrl = this.builder.settings.uploadMediaUrl_Fal;
                const response = await fetch(uploadUrl, {
                  method: 'POST',
                  body: formData
                });
                const result = await response.json();
                if (result.ok) {
                  const uploadedFileUrl = result.url;
                  filesAdded.push(uploadedFileUrl);

                  // for cleanup
                  this.builder.filesUploaded['file_' + index] = uploadedFileUrl;
                }
              }
            }
          }
        }
        return filesAdded;
      };
      let filesAdded = await uploadMultiple();
      input = {
        prompt,
        image_size: {
          width,
          height
        },
        num_images
      };
      if (model.indexOf('gemini') !== -1) {
        input = {
          prompt,
          input_image_urls: filesAdded
        };
      }

      // console.log(input)
      // return {
      //     mediaGenerated: false,
      //     status: 'error',
      //     message: this.out('STOP.') 
      // };

      if (model === 'fal-ai/ideogram/v2a') {
        aspect_ratio = this.getClosestAspectRatio(width, height); // 10:16, 16:10, 9:16, 16:9, 4:3, 3:4, 1:1, 1:3, 3:1, 3:2, 2:3
        input = {
          prompt,
          aspect_ratio,
          num_images
        };
      }

      //---------
      if (model.indexOf('recraft') !== -1) {
        input = {
          prompt,
          image_size: {
            width,
            height
          },
          num_images,
          // style,
          colors
        };
      }
      //---------

      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.edit_area_in_image) {
      let model = this.validateModel(args.model, provider, 'edit_area_in_image');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let image_url = args.image_url;
      if (!image_url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image reference not found.')
        };
      }
      const inputURLs = await this.builder.upload.getInputURLs(provider);
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      let uploadedFileUrl = inputURLs[args.image_url]; // args.image_url = field name
      let uploadedMaskUrl = inputURLs[args.image_url + '_mask'];
      input = {
        image_url: uploadedFileUrl,
        mask_url: uploadedMaskUrl,
        prompt
        // num_images,
      };
      jsonBody.model = model;

      // If no mask, use Gemini Flash
      if (!uploadedMaskUrl) {
        input = {
          image_url: uploadedFileUrl,
          prompt
        };
        let model = this.validateModel(args.model, provider, 'edit_image');
        jsonBody.model = model;
      }
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.text_to_2d_illustration_generation) {
      let model = this.validateModel(args.model, provider, 'text_to_2d_illustration_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let width = args.width || 1280;
      let height = args.height || 768;
      let num_images = args.num_images || 1;
      if (num_images > 4) num_images = 4;
      let style = args.style || 'any';
      let style_id = args.style_id || this.builder.settings._2dIllustrationStyleId;
      let color1_red = args.color1_red;
      let color1_green = args.color1_green;
      let color1_blue = args.color1_blue;
      let color2_red = args.color2_red;
      let color2_green = args.color2_green;
      let color2_blue = args.color2_blue;
      let color3_red = args.color3_red;
      let color3_green = args.color3_green;
      let color3_blue = args.color3_blue;
      let color4_red = args.color4_red;
      let color4_green = args.color4_green;
      let color4_blue = args.color4_blue;
      let color5_red = args.color5_red;
      let color5_green = args.color5_green;
      let color5_blue = args.color5_blue;
      let colors = [];
      if (color1_red && color1_green && color1_blue && !(color1_red === '0' && color1_green === '0' && color1_blue === '0')) {
        colors.push({
          r: color1_red,
          g: color1_green,
          b: color1_blue
        });
      }
      if (color2_red && color2_green && color2_blue && !(color2_red === '0' && color2_green === '0' && color2_blue === '0')) {
        colors.push({
          r: color2_red,
          g: color2_green,
          b: color2_blue
        });
      }
      if (color3_red && color3_green && color3_blue && !(color3_red === '0' && color3_green === '0' && color3_blue === '0')) {
        colors.push({
          r: color3_red,
          g: color3_green,
          b: color3_blue
        });
      }
      if (color4_red && color4_green && color4_blue && !(color4_red === '0' && color4_green === '0' && color4_blue === '0')) {
        colors.push({
          r: color4_red,
          g: color4_green,
          b: color4_blue
        });
      }
      if (color5_red && color5_green && color5_blue && !(color5_red === '0' && color5_green === '0' && color5_blue === '0')) {
        colors.push({
          r: color5_red,
          g: color5_green,
          b: color5_blue
        });
      }
      input = {
        prompt,
        image_size: {
          width,
          height
        },
        num_images,
        style,
        style_id,
        colors
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.text_to_digital_illustration_generation) {
      let model = this.validateModel(args.model, provider, 'text_to_digital_illustration_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let width = args.width || 1280;
      let height = args.height || 768;
      let num_images = args.num_images || 1;
      if (num_images > 4) num_images = 4;
      let style = args.style || 'digital_illustration';
      // let style_id = args.style_id || ''; 

      let color1_red = args.color1_red;
      let color1_green = args.color1_green;
      let color1_blue = args.color1_blue;
      let color2_red = args.color2_red;
      let color2_green = args.color2_green;
      let color2_blue = args.color2_blue;
      let color3_red = args.color3_red;
      let color3_green = args.color3_green;
      let color3_blue = args.color3_blue;
      let color4_red = args.color4_red;
      let color4_green = args.color4_green;
      let color4_blue = args.color4_blue;
      let color5_red = args.color5_red;
      let color5_green = args.color5_green;
      let color5_blue = args.color5_blue;
      let colors = [];
      if (color1_red && color1_green && color1_blue && !(color1_red === '0' && color1_green === '0' && color1_blue === '0')) {
        colors.push({
          r: color1_red,
          g: color1_green,
          b: color1_blue
        });
      }
      if (color2_red && color2_green && color2_blue && !(color2_red === '0' && color2_green === '0' && color2_blue === '0')) {
        colors.push({
          r: color2_red,
          g: color2_green,
          b: color2_blue
        });
      }
      if (color3_red && color3_green && color3_blue && !(color3_red === '0' && color3_green === '0' && color3_blue === '0')) {
        colors.push({
          r: color3_red,
          g: color3_green,
          b: color3_blue
        });
      }
      if (color4_red && color4_green && color4_blue && !(color4_red === '0' && color4_green === '0' && color4_blue === '0')) {
        colors.push({
          r: color4_red,
          g: color4_green,
          b: color4_blue
        });
      }
      if (color5_red && color5_green && color5_blue && !(color5_red === '0' && color5_green === '0' && color5_blue === '0')) {
        colors.push({
          r: color5_red,
          g: color5_green,
          b: color5_blue
        });
      }
      input = {
        prompt,
        image_size: {
          width,
          height
        },
        num_images,
        style,
        // style_id,
        colors
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.text_to_book_cover_generation) {
      let model = this.validateModel(args.model, provider, 'text_to_book_cover_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let width = args.width || 1024;
      let height = args.height || 1365;
      let num_images = args.num_images || 1;
      if (num_images > 4) num_images = 1;
      let style = 'digital_illustration/cover';
      let color1_red = args.color1_red;
      let color1_green = args.color1_green;
      let color1_blue = args.color1_blue;
      let color2_red = args.color2_red;
      let color2_green = args.color2_green;
      let color2_blue = args.color2_blue;
      let color3_red = args.color3_red;
      let color3_green = args.color3_green;
      let color3_blue = args.color3_blue;
      let color4_red = args.color4_red;
      let color4_green = args.color4_green;
      let color4_blue = args.color4_blue;
      let color5_red = args.color5_red;
      let color5_green = args.color5_green;
      let color5_blue = args.color5_blue;
      let colors = [];
      if (color1_red && color1_green && color1_blue && !(color1_red === '0' && color1_green === '0' && color1_blue === '0')) {
        colors.push({
          r: color1_red,
          g: color1_green,
          b: color1_blue
        });
      }
      if (color2_red && color2_green && color2_blue && !(color2_red === '0' && color2_green === '0' && color2_blue === '0')) {
        colors.push({
          r: color2_red,
          g: color2_green,
          b: color2_blue
        });
      }
      if (color3_red && color3_green && color3_blue && !(color3_red === '0' && color3_green === '0' && color3_blue === '0')) {
        colors.push({
          r: color3_red,
          g: color3_green,
          b: color3_blue
        });
      }
      if (color4_red && color4_green && color4_blue && !(color4_red === '0' && color4_green === '0' && color4_blue === '0')) {
        colors.push({
          r: color4_red,
          g: color4_green,
          b: color4_blue
        });
      }
      if (color5_red && color5_green && color5_blue && !(color5_red === '0' && color5_green === '0' && color5_blue === '0')) {
        colors.push({
          r: color5_red,
          g: color5_green,
          b: color5_blue
        });
      }
      input = {
        prompt,
        image_size: {
          width,
          height
        },
        num_images,
        style,
        // style_id,
        colors
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.upscale_image) {
      let model = this.validateModel(args.model, provider, 'upscale_image');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let image_url = args.image_url;
      if (!image_url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image reference not found.')
        };
      }
      const inputURLs = await this.builder.upload.getInputURLs(provider);
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      let uploadedFileUrl = inputURLs[args.image_url];
      if (!uploadedFileUrl) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image not provided.')
        };
      }
      input = {
        image_url: uploadedFileUrl,
        upscale_factor: 2
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.describe_image) {
      let model = this.validateModel(args.model, provider, 'describe_image');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let image_url = args.image_url;
      if (!image_url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image reference not found.')
        };
      }
      const inputURLs = await this.builder.upload.getInputURLs(provider);
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      let uploadedFileUrl = inputURLs[args.image_url]; // args.image_url = field name

      if (!uploadedFileUrl) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image not provided.')
        };
      }
      input = {
        image_url: uploadedFileUrl,
        prompt: `${prompt}. No talk. Answer only.`
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.image_to_video_generation) {
      let model = this.validateModel(args.model, provider, 'image_to_video_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      prompt = args.prompt || 'stunning video';
      let duration = args.duration || 5;
      if (duration > 10) duration = 5;
      const inputURLs = await this.builder.upload.getInputURLs(provider);
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      let uploadedFileUrl = inputURLs[args.image_url]; // args.image_url = field name

      if (!uploadedFileUrl) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Image reference not found.')
        };
      }
      input = {
        prompt,
        image_url: uploadedFileUrl,
        duration,
        aspect_ratio: '16:9' // 9:16, 1:1
      };
      if (model.indexOf('fal-ai/luma-dream-machine') !== -1) {
        delete input.duration;
      }
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.text_to_video_generation) {
      let model = this.validateModel(args.model, provider, 'text_to_video_generation');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      let prompt = args.prompt;
      if (!prompt) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please input a prompt.')
        };
      }
      let duration = args.duration || 5;
      if (duration > 10) duration = 5;
      input = {
        prompt,
        duration,
        aspect_ratio: '16:9' // 9:16, 1:1
      };
      if (model.indexOf('fal-ai/luma-dream-machine') !== -1) {
        delete input.duration;
      }
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    } else if (args.text_to_speech) {
      let model = this.validateModel(args.model, provider, 'text_to_speech');
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Model not found.')
        };
      }
      if (args.text.length > this.builder.settings.ttsMaxCharacters) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('The text exceeds the allowed limit.')
        };
      }

      // // fal-ai/kokoro/american-english
      // input = { 
      //     prompt: args.text,
      //     voice: args.voice || 'af_heart',
      // };

      // fal-ai/elevenlabs/tts/multilingual-v2
      input = {
        text: args.text,
        voice: args.voice || 'Matilda' // River
      };
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
    }

    // Start generation

    // Add endpoint & payload
    let endpoint = `https://queue.fal.run/${jsonBody.model}`;
    jsonBody.endpoint = endpoint;
    jsonBody.payload = input;

    // Collect payload
    this.builder.payloads.push(jsonBody);
    if (this.builder.settings.consoleLog) console.log(jsonBody);

    // Queue
    let url = this.builder.settings.generateMediaUrl_Fal;
    if (!url) {
      return {
        mediaGenerated: false,
        status: 'error',
        message: this.out('Endpoint not configured: generateMediaUrl_Fal.')
      };
    }
    let requestId;
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    let response = await fetch(url, {
      signal: this.builder.mediaSignal,
      method: 'POST',
      headers,
      body: JSON.stringify(jsonBody)
    });
    let result = await response.json();
    if (result.ok) {
      requestId = result.request_id;
    } else {
      return {
        mediaGenerated: false,
        status: 'error',
        message: result.error //this.out('Generating video request failed.')
      };
    }
    const waitingResult = this.waitingFal(jsonBody, requestId, resultDiv, hideOutput);
    this.builder.isMediaGenerating = false;
    return waitingResult;
  }
  validateModel(model, provider, intent) {
    const defaultModels = this.builder.settings.defaultModels;
    const listModels = defaultModels[intent][provider];
    let modelFallback = this.builder.settings.modelFallback;
    if (modelFallback) {
      if (listModels.length === 1) {
        // if only single model defined, must use it
        if (this.builder.settings.consoleLog) console.log('Fixed model: ' + listModels[0]);
        return listModels[0];
      } else if (model && listModels && listModels.includes(model)) {
        // validate model
        if (this.builder.settings.consoleLog) console.log('Model is valid: ' + model);
        return model;
      } else if (listModels.length >= 1) {
        // if model not in the list, use default from the list (first item)
        if (this.builder.settings.consoleLog) console.log('Use default: ' + listModels[0]);
        return listModels[0];
      } else {
        return false;
      }
    } else {
      if (!model) {
        //if  model not specified, use first defined model
        if (this.builder.settings.consoleLog) console.log('Fixed model: ' + listModels[0]);
        return listModels[0];
      } else if (model && listModels && listModels.includes(model)) {
        // validate model
        if (this.builder.settings.consoleLog) console.log('Model is valid: ' + model);
        return model;
      } else {
        return false;
      }
    }
  }
  async generate_GoogleMediaByJSON(prompt, context, resultDiv, hideOutput) {
    this.builder.isMediaGenerating = true;
    this.mediaController = new AbortController();
    this.builder.mediaSignal = this.mediaController.signal;
    let jsonInput;
    if (prompt.trim().startsWith('{')) {
      // a JSON input
      try {
        jsonInput = JSON.parse(prompt);
      } catch (error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Incorrect JSON format.')
        };
      }
    }
    let model = context.trim();
    if (!model) {
      return {
        mediaGenerated: false,
        status: 'error',
        message: this.out('Please provide model information in the context.')
      };
    }
    let jsonBody = {};
    jsonBody.model = model;
    jsonBody.customData = this.builder.settings.customData;

    // Add endpoint & payload
    // let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
    // jsonBody.endpoint = endpoint;

    jsonBody.payload = jsonInput;

    // Collect payload
    this.builder.payloads.push(jsonBody);
    if (this.builder.settings.consoleLog) console.log(jsonBody);

    // return this.generateMediaByJSON(jsonBody, provider, resultDiv, hideOutput);

    const url = this.builder.settings.generateMediaUrl_Google; // Queue
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    const response = await fetch(url, {
      signal: this.builder.mediaSignal,
      method: 'POST',
      headers,
      body: JSON.stringify(jsonBody)
    });
    const result = await response.json();
    if (this.builder.settings.consoleLog) console.log(result);
    const data = result.data;
    let final = this.renderResult(data, resultDiv, hideOutput);

    // return markdown;
    return {
      mediaGenerated: true,
      status: 'success',
      markdown: final.markdown,
      output: final.output,
      output2: final.output2
    };
  }
  async uploadMultiple() {
    let filesAdded = [];
    let formValues = this.builder.getFormValues();
    for (const field of formValues) {
      if (field.value instanceof FileList && field.type === 'multifile') {
        const item = {};
        item.name = field.name;
        item.files = [];
        const files = field.value;
        if (files.length > 0) {
          let index = 0;
          for (const file of files) {
            index++;
            const formData = new FormData();
            formData.append('file', file); // not using file[] since it's for single upload/fetch
            formData.append('customData', this.builder.settings.customData);
            let uploadUrl = this.builder.settings.uploadMediaUrl_Fal;
            const response = await fetch(uploadUrl, {
              method: 'POST',
              body: formData
            });
            const result = await response.json();
            if (result.ok) {
              const uploadedFileUrl = result.url;
              item.files.push(uploadedFileUrl);
              // for cleanup
              this.builder.filesUploaded['file_' + index] = uploadedFileUrl;
            }
          }
        }
        filesAdded.push(item);
      }
    }
    return filesAdded;
  }
  async generate(prompt, context, provider, model, tools, resultDiv, hideOutput) {
    // generateMedia

    provider = provider || this.builder.settings.defaultMediaGenerationProvider;
    if (provider === 'google' && prompt.trim().startsWith('{')) {
      return this.generate_GoogleMediaByJSON(prompt, context, resultDiv, hideOutput);
    }
    this.builder.isMediaGenerating = true;
    this.mediaController = new AbortController();
    this.builder.mediaSignal = this.mediaController.signal;
    let args;

    // Check if prompt is a valid JSON.
    let validJSON = false;
    let jsonInput;
    if (prompt.trim().startsWith('{')) {
      // a JSON input
      try {
        jsonInput = JSON.parse(prompt);
        if (jsonInput && typeof jsonInput === 'object') {
          validJSON = true;
        }
      } catch (error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Incorrect JSON format.')
        };
      }
    }
    if (validJSON) {
      // args = await this.checkModel(context);

      let model = context.trim();
      if (!model) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Please provide model information in the context.')
        };
      }
      let filesAdded = await this.uploadMultiple();
      const replaceValues = (obj, filesAdded) => {
        // Recursive function to traverse the object
        const traverse = current => {
          if (Array.isArray(current)) {
            // If the current value is an array, check if all elements match a name in filesAdded
            const firstElement = current[0];
            const match = filesAdded.find(fileGroup => fileGroup.name === firstElement);
            if (match && current.every(item => item === firstElement)) {
              // Replace the entire array with the matching files
              return match.files;
            } else {
              // Otherwise, process each element individually
              for (let i = 0; i < current.length; i++) {
                current[i] = traverse(current[i]);
              }
            }
          } else if (typeof current === 'object' && current !== null) {
            // If the current value is an object, process each key-value pair
            for (let key in current) {
              current[key] = traverse(current[key]);
            }
          }
          return current;
        };
        // Start traversal from the root object
        return traverse(obj);
      };
      replaceValues(jsonInput, filesAdded);
      // console.log(filesAdded);
      // console.log(jsonInput);
      // return {
      //     mediaGenerated: false,
      //     status: 'aborted',
      //     message: this.out('STOP')
      // };

      // let provider;
      // if(model.startsWith('fal')) {
      //     provider = 'fal';
      // } else {
      //     provider = 'replicate';
      // }
      if (!provider) {
        if (model.startsWith('fal')) {
          provider = 'fal';
        } else {
          provider = 'replicate';
        }
      }
      const isJsonObject = variable => {
        return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
      };
      const inputURLs = await this.builder.upload.getInputURLs(provider); // Replicate: mp4 & mp3 upload local
      if (inputURLs.error) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: inputURLs.error
        };
      }
      Object.keys(jsonInput).forEach(key => {
        Object.keys(inputURLs).forEach(name => {
          if (jsonInput[key] === name) {
            let url = inputURLs[name];
            jsonInput[key] = url;
          }
          if (Array.isArray(jsonInput[key])) {
            for (let n = 0; n < jsonInput[key].length; n++) {
              if (jsonInput[key][n] === name) {
                let url = inputURLs[name];
                jsonInput[key][n] = url;
              }
            }
          }
        });
      });

      /*
      JSON input not always like this:
      {
          "image_url": "IMAGE",
          "image_url2": "IMAGE2",
      }
      but can also like this:
      {
          "input_image_urls": [
              "IMAGE", "IMAGE2"
          ],
      }
      so, check if jsonInput[key] is an array:
      */
      Object.keys(jsonInput).forEach(key => {
        let value = jsonInput[key];
        if (isJsonObject(value)) {
          for (const key in value) {
            // if (value.hasOwnProperty(key)) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
              Object.keys(inputURLs).forEach(name => {
                if (value[key] === name) {
                  let url = inputURLs[name];
                  value[key] = url;
                  if (name === url && !url.startsWith('http')) value[key] = '';
                }
              });
            }
          }
        }
        if (Array.isArray(value)) {
          for (let n = 0; n < value.length; n++) {
            if (isJsonObject(value[n])) {
              for (const key in value[n]) {
                // if (value[n].hasOwnProperty(key)) {
                if (Object.prototype.hasOwnProperty.call(value[n], key)) {
                  Object.keys(inputURLs).forEach(name => {
                    if (value[n][key] === name) {
                      let url = inputURLs[name];
                      value[n][key] = url;
                      if (name === url && !url.startsWith('http')) value[n][key] = '';
                    }
                  });
                }
              }
            }
          }
          // value = ["abc", "def", ""]
          jsonInput[key] = [...value.filter(item => item !== '')]; // remove "" (empty array item)
        }
      });

      // console.log(jsonInput);
      // return {
      //     mediaGenerated: false,
      //     status: 'aborted',
      //     message: this.out('STOP')
      // };

      let jsonBody = {};
      jsonBody.model = model;
      jsonBody.customData = this.builder.settings.customData;
      if (provider === 'replicate' && model.indexOf(':') !== -1) {
        const parts = model.split(':'); // Split the model into parts
        jsonBody.version = parts[1];
      }

      // Start generation

      // New Version (Simplified Endpoint)
      if (provider === 'replicate') {
        if (model.indexOf(':') !== -1) {
          // Add endpoint & payload
          let endpoint = this.builder.settings.replicateEndpoint1; // 'https://api.replicate.com/v1/predictions';
          jsonBody.endpoint = endpoint;
          jsonBody.payload = jsonInput;
          if (this.builder.settings.consoleLog) console.log('JSON PAYLOAD 1'); // Test using: Swap face, Text to Audio - JSON (Replicate)
        } else {
          // Add endpoint & payload
          let endpoint = this.builder.settings.replicateEndpoint2; //`https://api.replicate.com/v1/models/${jsonInput.model}/predictions`;
          endpoint = endpoint.replace('{MODEL}', jsonBody.model);
          jsonBody.endpoint = endpoint;
          jsonBody.payload = jsonInput;
          if (this.builder.settings.consoleLog) console.log('JSON PAYLOAD 2'); // Test using: Local Edit - JSON (Replicate)
        }
      } else if (provider === 'fal') {
        // Add endpoint & payload
        let endpoint = `https://queue.fal.run/${jsonBody.model}`;
        jsonBody.endpoint = endpoint;
        jsonBody.payload = jsonInput;
        if (this.builder.settings.consoleLog) console.log('JSON PAYLOAD');
      }

      // Collect payload
      this.builder.payloads.push(jsonBody);
      if (this.builder.settings.consoleLog) console.log(jsonBody);
      return this.generateMediaByJSON(jsonBody, provider, resultDiv, hideOutput);
    }
    try {
      args = await this.checkIntent(prompt, provider, tools);
      if (this.builder.settings.consoleLog) console.log(args);
      if (!args) {
        return {
          mediaGenerated: false,
          status: 'aborted',
          message: this.out('Request aborted.')
        };
      }

      // alert(provider);
      // return {
      //     mediaGenerated: false,
      //     status: 'aborted',
      //     message: this.out('STOP.')
      // };
      if (!args.minimize_image) {
        if (provider === 'fal') {
          return this.generateFal(args, resultDiv, hideOutput);
        } else if (provider === 'replicate') {
          return this.generateReplicate(args, resultDiv, hideOutput);
        } else if (provider === 'google') {
          return this.generateGoogle(args, resultDiv, hideOutput);
        } else if (provider === 'openai') {
          return this.generateOpenAI(args, resultDiv, hideOutput);
        }
      } else {
        // Minimize Image

        let image_url = args.image_url;
        if (!image_url) {
          return {
            mediaGenerated: false,
            status: 'error',
            message: this.out('Image reference not found.')
          };
        }
        const inputURLs = await this.builder.upload.getInputURLs();
        if (inputURLs.error) {
          return {
            mediaGenerated: false,
            status: 'error',
            message: inputURLs.error
          };
        }
        let uploadedFileUrl = inputURLs[args.image_url] || args.image_url; // args.image_url can already be an url (from previous step output).

        // let inputResult = await this.builder.upload.processMediaInput(image_url); 
        // let uploadedFileUrl = inputResult.url;
        // if(!uploadedFileUrl) {
        //     return {
        //         mediaGenerated: false,
        //         status: 'error',
        //         message: this.out('Image not provided.')
        //     };
        // }

        // let cleanup = true;
        // if(image_url===uploadedFileUrl) {
        //     cleanup = false;
        // }

        let input = {
          image_url: uploadedFileUrl,
          // cleanup,
          customData: this.builder.settings.customData
        };

        // Collect payload
        this.builder.payloads.push(input);
        if (this.builder.settings.consoleLog) console.log(input);
        let headers = {
          'Content-Type': 'application/json',
          ...this.builder.settings.headers
        };
        const response = await fetch(this.builder.settings.minimizeImageUrl, {
          signal: this.builder.mediaSignal,
          method: 'POST',
          headers,
          body: JSON.stringify(input)
        });
        const result = await response.json();

        // Collect result
        this.builder.output.push(result);
        if (!result.error) {
          const url = result.url;
          const html = `
                    <div class="image-container">
                        <div>
                            <img src="${url}" />
                            <div>
                                <a class="link-view" href="${url}" target="_blank" rel="noopener noreferrer">${this.out('View')}</a>
                                <a class="link-download" href="${url}" download>${this.out('Download')}</a>
                            </div>
                        </div>
                    </div>`;
          let markdown = `![](${url})`;
          if (!hideOutput) {
            resultDiv.innerHTML = html;
            this.builder.outputHtml += `<div class="result-container">${html}</div>`;
          } else {
            resultDiv.innerHTML = '';
            resultDiv.remove();
          }
          this.builder.isMediaGenerating = false;

          // return markdown;
          return {
            mediaGenerated: true,
            status: 'success',
            markdown,
            output: [url]
          };
        } else {
          if (this.builder.settings.consoleLog) console.log(result.error);
          this.builder.isMediaGenerating = false;
          return {
            mediaGenerated: false,
            status: 'error',
            message: result.error //this.out('Request failed.')
          };
        }
      }
    } catch (err) {
      if (this.builder.settings.consoleLog) console.log(err);
      this.builder.isMediaGenerating = false;
      if (err.name === 'AbortError') {
        return {
          mediaGenerated: false,
          status: 'aborted',
          message: this.out('Request aborted.')
        };
      }
      return {
        mediaGenerated: false,
        status: 'error',
        message: this.out('Request failed.')
      };
    }
    this.builder.isMediaGenerating = false;
    return {
      mediaGenerated: false,
      status: 'error',
      message: this.out('Request failed.')
    };
  }
  async generateMediaByJSON(input, provider, resultDiv, hideOutput) {
    let url;
    let queue = false;
    if (provider === 'replicate' && this.builder.settings.generateMediaUrl) {
      // non queue
      url = this.builder.settings.generateMediaUrl;
      if (!url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Endpoint not configured: generateMediaUrl.')
        };
      }
    } else if (provider === 'replicate' && this.builder.settings.generateMediaUrl_Replicate) {
      // queue
      url = this.builder.settings.generateMediaUrl_Replicate;
      if (!url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Endpoint not configured: generateMediaUrl_Replicate.')
        };
      }
      queue = true;
    } else if (provider === 'fal') {
      url = this.builder.settings.generateMediaUrl_Fal; // Queue

      if (!url) {
        return {
          mediaGenerated: false,
          status: 'error',
          message: this.out('Endpoint not configured: generateMediaUrl_Fal.')
        };
      }
    }
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    const response = await fetch(url, {
      signal: this.builder.mediaSignal,
      method: 'POST',
      headers,
      body: JSON.stringify(input)
    });
    const result = await response.json();
    this.builder.isMediaGenerating = false;
    if (provider === 'fal') {
      let requestId = result.request_id;
      const waitingResult = this.waitingFal(input, requestId, resultDiv, hideOutput);
      return waitingResult;
    }
    if (!result.error) {
      if (queue) {
        let requestId;
        if (result.ok) {
          requestId = result.data.id;
          if (!requestId) {
            return {
              mediaGenerated: false,
              status: 'error',
              message: result.data && result.data.detail
            };
          }
        } else {
          return {
            mediaGenerated: false,
            status: 'error',
            message: result.error //this.out('Generating video request failed.')
          };
        }
        const waitingResult = this.waitingReplicate(input, requestId, resultDiv, hideOutput);
        return waitingResult;
      } else {
        const data = result.data;
        let final = this.renderResult(data, resultDiv, hideOutput);

        // return markdown;
        return {
          mediaGenerated: true,
          status: 'success',
          markdown: final.markdown,
          output: final.output,
          output2: final.output2
        };
      }
    } else {
      if (this.builder.settings.consoleLog) console.log(result.error);
      return {
        mediaGenerated: false,
        status: 'error',
        message: result.error //this.out('Request failed.') 
      };
    }
  }
  getClosestAspectRatio(width, height) {
    // for Ideogram v2a
    if (height === 0) {
      return '3:2';
    }
    const inputRatio = width / height;
    const candidates = [{
      aspect: '10:16',
      ratio: 10 / 16
    }, {
      aspect: '16:10',
      ratio: 16 / 10
    }, {
      aspect: '9:16',
      ratio: 9 / 16
    }, {
      aspect: '16:9',
      ratio: 16 / 9
    }, {
      aspect: '4:3',
      ratio: 4 / 3
    }, {
      aspect: '3:4',
      ratio: 3 / 4
    }, {
      aspect: '1:1',
      ratio: 1
    }, {
      aspect: '1:3',
      ratio: 1 / 3
    }, {
      aspect: '3:1',
      ratio: 3
    }, {
      aspect: '3:2',
      ratio: 3 / 2
    }, {
      aspect: '2:3',
      ratio: 2 / 3
    }];
    let closest = candidates[0];
    let minDiff = Math.abs(inputRatio - candidates[0].ratio);
    for (let i = 1; i < candidates.length; i++) {
      const diff = Math.abs(inputRatio - candidates[i].ratio);
      if (diff < minDiff) {
        minDiff = diff;
        closest = candidates[i];
      }
    }
    return closest.aspect;
  }
  out(s) {
    if (this.opts.lang) {
      let val = this.opts.lang[s];
      if (val) return val;else {
        return s;
      }
    } else {
      return s;
    }
  }
}

class Upload {
  constructor(opts = {}, builder) {
    const defaults = {
      lang: []
    };
    this.builder = builder;
    this.opts = Object.assign({}, defaults, opts);
  }
  async getInputURLs(provider) {
    let formValues = this.builder.getFormValues();

    // const filesAttached = {};
    const filesAttached = this.builder.filesUploaded;
    // if(!this.builder.singleStep) { // if not single steo, do not re-upload if previously has been uploaded
    //     if (Object.keys(filesAttached).length !== 0) return filesAttached; 
    // }
    // console.log(filesAttached);
    // console.log(Object.keys(filesAttached).length);
    if (Object.keys(filesAttached).length !== 0) return filesAttached; // fixed: no re-upload

    for (const field of formValues) {
      if (field.value instanceof FileList) {
        // Upload File
        // const filename = field.value[0].name;
        // const filetype = field.value[0].type;

        let inputResult = await this.processMediaInput(field.name, provider); // false = not local
        // let newfilename = inputResult.filename;
        let uploadedFileUrl = inputResult.url;
        if (field.name === inputResult.url) uploadedFileUrl = ''; // no file

        filesAttached[field.name] = uploadedFileUrl;
      } else {
        if (field.name.indexOf('_mask') !== -1) {
          // Uplpad Mask
          let result = await this.processMaskInput(field.name, provider);
          if (!result.error) {
            let uploadedMaskUrl = result.url;
            filesAttached[field.name] = uploadedMaskUrl;
          } else {
            return {
              error: result.error
            };
          }
        }
        if (field.name.indexOf('__url') !== -1) {
          let preview;
          if (this.builder.settings.isBuilder) {
            preview = document.querySelector(this.builder.settings.previewSelector);
          } else {
            preview = this.builder.element;
          }
          const input = preview.querySelector(`input[name="${field.name}"]`);
          if (input) {
            const url = input.value;
            // IDEA: this.processUrlInput(url)
            filesAttached[field.name] = url;
          }
        }
      }
    }
    Object.keys(filesAttached).forEach(key => {
      if (key.endsWith('__url')) {
        const baseKey = key.replace('__url', '');
        // if (filesAttached.hasOwnProperty(baseKey)) {
        if (Object.prototype.hasOwnProperty.call(filesAttached, baseKey)) {
          filesAttached[baseKey] = filesAttached[key];
        }
        delete filesAttached[key];
      }
    });
    return filesAttached;
  }
  async processMaskInput(inputName, provider) {
    // const inputName = image_url + '_mask';
    let preview;
    if (this.builder.settings.isBuilder) {
      // preview = this.builder.settings.previewElement;
      if (!this.builder.settings.previewSelector) {
        return {
          error: this.out('previewSelector not set.')
        };
      }
      preview = document.querySelector(this.builder.settings.previewSelector);
    } else {
      preview = this.builder.element;
    }
    const inputMask = preview.querySelector(`input[type="hidden"][name="${inputName}"]`);
    if (!inputMask) return {
      error: this.out('Unable to perform the request.') // must be image_to_image_generation, not edit_area_in_image
    };
    if (inputMask.value === '') {
      return {
        error: this.out('Please brush the area you want to edit.')
      };
    }
    let base64 = inputMask.value.replace(/^data:image\/(png|svg\+xml|jpeg|gif|webp);base64,/, '');
    if (base64 === '') {
      return {
        error: this.out('Please brush over the areas to remove objects before continuing.')
      };
    }

    // Upload base64 images
    let uploadedMaskUrl;
    let id = this.builder.getId();
    let input = {
      image: base64,
      filename: `${inputName}_${id}.png`,
      // inputName + '.png',
      customData: this.builder.settings.customData
    };
    let uploadUrl;
    if (provider === 'replicate') {
      uploadUrl = this.builder.settings.uploadBase64Url;
    } else if (provider === 'fal') {
      uploadUrl = this.builder.settings.uploadBase64Url_Fal;
    } else {
      uploadUrl = this.builder.settings.uploadBase64Url_Fal || this.builder.settings.uploadBase64Url;
    }
    let headers = {
      'Content-Type': 'application/json',
      ...this.builder.settings.headers
    };
    let response = await fetch(uploadUrl, {
      signal: this.builder.mediaSignal,
      method: 'POST',
      headers,
      body: JSON.stringify(input)
    });
    let result = await response.json();
    if (result.ok) {
      uploadedMaskUrl = result.url;
    }
    if (!uploadedMaskUrl) {
      return {
        error: this.out('Upload mask failed.')
      };
    }
    return {
      url: uploadedMaskUrl
    };
  }
  async processMediaInput(image_url, provider) {
    if (!image_url) {
      return false;
    }

    // Upload file
    let fileInput;
    if (!this.isFullUrl(image_url)) {
      // if image_url is not a full url, then it's an input field name
      let fileInputName = image_url;
      fileInput = this.getFileInput(fileInputName) || this.getFileInput(); // Get file input field
    }

    // const fileInput = this.getFileInput();
    let filename = '';
    let uploadedFileUrl;

    // Camera
    if (this.builder.photoBlob[image_url]) {
      let id = this.builder.getId();
      const formData = new FormData();
      formData.append('file', this.builder.photoBlob[image_url], `photo_${id}.jpg`);
      formData.append('customData', this.builder.settings.customData);
      let uploadUrl;
      if (provider === 'replicate') {
        uploadUrl = this.builder.settings.uploadMediaUrl;
      } else if (provider === 'fal') {
        uploadUrl = this.builder.settings.uploadMediaUrl_Fal;
      } else {
        uploadUrl = this.builder.settings.uploadMediaUrl_Fal || this.builder.settings.uploadMediaUrl;
      }
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.ok) {
        uploadedFileUrl = result.url;
        filename = result.filename;
        return {
          filename,
          url: uploadedFileUrl
        };
      } else {
        return {
          error: this.out('Upload file failed.')
        };
      }
    }
    if (fileInput) {
      const file = fileInput.files[0]; // Get the selected file
      if (file) {
        filename = file.name;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('customData', this.builder.settings.customData);
        let uploadUrl;
        /*
        if(localUpload) {
            uploadUrl = this.builder.settings.uploadLocalUrl;
        } else {
            if(provider==='replicate') {
                uploadUrl = this.builder.settings.uploadMediaUrl;
            } else {
                uploadUrl = this.builder.settings.uploadMediaUrl_Fal;
            }
        }
        */
        if (provider === 'replicate') {
          uploadUrl = this.builder.settings.uploadMediaUrl;
        } else if (provider === 'fal') {
          uploadUrl = this.builder.settings.uploadMediaUrl_Fal;
        } else {
          uploadUrl = this.builder.settings.uploadMediaUrl_Fal || this.builder.settings.uploadMediaUrl;
        }
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.ok) {
          uploadedFileUrl = result.url;
          filename = result.filename;
        } else {
          return {
            error: this.out('Upload file failed.')
          };
        }
      } else {
        uploadedFileUrl = image_url;
      }
    } else {
      uploadedFileUrl = image_url;
    }

    // if(this.isFullUrl(uploadedFileUrl)) { 
    //     return {
    //         filename,
    //         url: uploadedFileUrl
    //     };
    // } else {
    //     return false;
    // }
    return {
      filename,
      url: uploadedFileUrl
    };
  }
  getFileInput(inputName) {
    let preview;
    if (this.builder.settings.isBuilder) {
      // preview = this.builder.settings.previewElement;
      if (!this.builder.settings.previewSelector) {
        console.log('previewSelector not set.');
        return null;
      }
      preview = document.querySelector(this.builder.settings.previewSelector);
    } else {
      preview = this.builder.element;
    }
    if (!preview) return null;
    if (inputName) {
      return preview.querySelector(`input[type="file"][name="${inputName}"]`);
    } else {
      return preview.querySelector('input[type="file"]');
    }
  }
  isFullUrl(url) {
    // return url.startsWith("http://") || url.startsWith("https://");
    return url.indexOf('/') !== -1; // '/uploads/example.jpg => is also full url
  }
  out(s) {
    if (this.opts.lang) {
      let val = this.opts.lang[s];
      if (val) return val;else {
        return s;
      }
    } else {
      return s;
    }
  }
}

/* eslint-disable prefer-rest-params */
function eventListener(method, elements, events, fn, options = {}) {
  // Normalize array
  if (elements instanceof HTMLCollection || elements instanceof NodeList) {
    elements = Array.from(elements);
  } else if (!Array.isArray(elements)) {
    elements = [elements];
  }
  if (!Array.isArray(events)) {
    events = [events];
  }
  for (const el of elements) {
    for (const ev of events) {
      el[method](ev, fn, {
        capture: false,
        ...options
      });
    }
  }
  return Array.prototype.slice.call(arguments, 1);
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
const off = eventListener.bind(null, 'removeEventListener');

/**
 * Creates an DOM-Element out of a string (Single element).
 * @param html HTML representing a single element
 * @returns {Element | null} The element.
 */
function createElementFromString(html) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstElementChild;
}

/**
 * Creates a new html element, every element which has
 * a ':ref' attribute will be saved in a object (which will be returned)
 * where the value of ':ref' is the object-key and the value the HTMLElement.
 *
 * It's possible to create a hierarchy if you add a ':obj' attribute. Every
 * sibling will be added to the object which will get the name from the 'data-con' attribute.
 *
 * If you want to create an Array out of multiple elements, you can use the ':arr' attribute,
 * the value defines the key and all elements, which has the same parent and the same 'data-arr' attribute,
 * would be added to it.
 *
 * @param str - The HTML String.
 */

function createFromTemplate(str) {
  // Removes an attribute from a HTMLElement and returns the value.
  const removeAttribute = (el, name) => {
    const value = el.getAttribute(name);
    el.removeAttribute(name);
    return value;
  };

  // Recursive function to resolve template
  const resolve = (element, base = {}) => {
    // Check key and container attribute
    const con = removeAttribute(element, ':obj');
    const key = removeAttribute(element, ':ref');
    const subtree = con ? base[con] = {} : base;

    // Check and save element
    key && (base[key] = element);
    for (const child of Array.from(element.children)) {
      const arr = removeAttribute(child, ':arr');
      const sub = resolve(child, arr ? {} : subtree);
      if (arr) {
        // Check if there is already an array and add element
        (subtree[arr] || (subtree[arr] = [])).push(Object.keys(sub).length ? sub : child);
      }
    }
    return base;
  };
  return resolve(createElementFromString(str));
}

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
function eventPath(evt) {
  let path = evt.path || evt.composedPath && evt.composedPath();
  if (path) {
    return path;
  }
  let el = evt.target.parentElement;
  path = [evt.target, el];
  while (el = el.parentElement) {
    path.push(el);
  }
  path.push(document, window);
  return path;
}

/**
 * Resolves a HTMLElement by query.
 * @param val
 * @returns {null|Document|Element}
 */
function resolveElement(val) {
  if (val instanceof Element) {
    return val;
  } else if (typeof val === 'string') {
    return val.split(/>>/g).reduce((pv, cv, ci, a) => {
      pv = pv.querySelector(cv);
      return ci < a.length - 1 ? pv.shadowRoot : pv;
    }, document);
  }
  return null;
}

/**
 * Creates the ability to change numbers in an input field with the scroll-wheel.
 * @param el
 * @param mapper
 */
function adjustableInputNumbers(el, mapper = v => v) {
  function handleScroll(e) {
    const inc = [0.001, 0.01, 0.1][Number(e.shiftKey || e.ctrlKey * 2)] * (e.deltaY < 0 ? 1 : -1);
    let index = 0;
    let off = el.selectionStart;
    el.value = el.value.replace(/[\d.]+/g, (v, i) => {
      // Check if number is in cursor range and increase it
      if (i <= off && i + v.length >= off) {
        off = i;
        return mapper(Number(v), inc, index);
      }
      index++;
      return v;
    });
    el.focus();
    el.setSelectionRange(off, off);

    // Prevent default and trigger input event
    e.preventDefault();
    el.dispatchEvent(new Event('input'));
  }

  // Bind events
  on(el, 'focus', () => on(window, 'wheel', handleScroll, {
    passive: false
  }));
  on(el, 'blur', () => off(window, 'wheel', handleScroll));
}

var _ = /*#__PURE__*/Object.freeze({
  __proto__: null,
  adjustableInputNumbers: adjustableInputNumbers,
  createElementFromString: createElementFromString,
  createFromTemplate: createFromTemplate,
  eventPath: eventPath,
  off: off,
  on: on,
  resolveElement: resolveElement
});

// Shorthands
const {
  min,
  max,
  floor,
  round
} = Math;

/**
 * Tries to convert a color name to rgb/a hex representation
 * @param name
 * @returns {string | CanvasGradient | CanvasPattern}
 */
function standardizeColor(name) {
  // Since invalid color's will be parsed as black, filter them out
  if (name.toLowerCase() === 'black') {
    return '#000';
  }
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = name;
  return ctx.fillStyle === '#000' ? null : ctx.fillStyle;
}

/**
 * Convert HSV spectrum to RGB.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} Array with rgb values.
 */
function hsvToRgb(h, s, v) {
  h = h / 360 * 6;
  s /= 100;
  v /= 100;
  const i = floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];
  return [r * 255, g * 255, b * 255];
}

/**
 * Convert HSV spectrum to Hex.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {string[]} Hex values
 */
function hsvToHex(h, s, v) {
  return hsvToRgb(h, s, v).map(v => round(v).toString(16).padStart(2, '0'));
}

/**
 * Convert HSV spectrum to CMYK.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} CMYK values
 */
function hsvToCmyk(h, s, v) {
  const rgb = hsvToRgb(h, s, v);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const k = min(1 - r, 1 - g, 1 - b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
  return [c * 100, m * 100, y * 100, k * 100];
}

/**
 * Convert HSV spectrum to HSL.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} HSL values
 */
function hsvToHsl(h, s, v) {
  s /= 100;
  v /= 100;
  const l = (2 - s) * v / 2;
  if (l !== 0) {
    if (l === 1) {
      s = 0;
    } else if (l < 0.5) {
      s = s * v / (l * 2);
    } else {
      s = s * v / (2 - l * 2);
    }
  }
  return [h, s * 100, l * 100];
}

/**
 * Convert RGB to HSV.
 * @param r Red
 * @param g Green
 * @param b Blue
 * @return {number[]} HSV values.
 */
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const minVal = min(r, g, b);
  const maxVal = max(r, g, b);
  const delta = maxVal - minVal;
  let h, s;
  const v = maxVal;
  if (delta === 0) {
    h = s = 0;
  } else {
    s = delta / maxVal;
    const dr = ((maxVal - r) / 6 + delta / 2) / delta;
    const dg = ((maxVal - g) / 6 + delta / 2) / delta;
    const db = ((maxVal - b) / 6 + delta / 2) / delta;
    if (r === maxVal) {
      h = db - dg;
    } else if (g === maxVal) {
      h = 1 / 3 + dr - db;
    } else if (b === maxVal) {
      h = 2 / 3 + dg - dr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return [h * 360, s * 100, v * 100];
}

/**
 * Convert CMYK to HSV.
 * @param c Cyan
 * @param m Magenta
 * @param y Yellow
 * @param k Key (Black)
 * @return {number[]} HSV values.
 */
function cmykToHsv(c, m, y, k) {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;
  const r = (1 - min(1, c * (1 - k) + k)) * 255;
  const g = (1 - min(1, m * (1 - k) + k)) * 255;
  const b = (1 - min(1, y * (1 - k) + k)) * 255;
  return [...rgbToHsv(r, g, b)];
}

/**
 * Convert HSL to HSV.
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @return {number[]} HSV values.
 */
function hslToHsv(h, s, l) {
  s /= 100;
  l /= 100;
  s *= l < 0.5 ? l : 1 - l;
  const ns = 2 * s / (l + s) * 100;
  const v = (l + s) * 100;
  return [h, isNaN(ns) ? 0 : ns, v];
}

/**
 * Convert HEX to HSV.
 * @param hex Hexadecimal string of rgb colors, can have length 3 or 6.
 * @return {number[]} HSV values.
 */
function hexToHsv(hex) {
  return rgbToHsv(...hex.match(/.{2}/g).map(v => parseInt(v, 16)));
}

/**
 * Try's to parse a string which represents a color to a HSV array.
 * Current supported types are cmyk, rgba, hsla and hexadecimal.
 * @param str
 * @return {*}
 */
function parseToHSVA(str) {
  // Check if string is a color-name
  str = str.match(/^[a-zA-Z]+$/) ? standardizeColor(str) : str;

  // Regular expressions to match different types of color represention
  const regex = {
    cmyk: /^cmyk\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)/i,
    rgba: /^rgba?\D+([\d.]+)(%?)\D+([\d.]+)(%?)\D+([\d.]+)(%?)\D*?(([\d.]+)(%?)|$)/i,
    hsla: /^hsla?\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D*?(([\d.]+)(%?)|$)/i,
    hsva: /^hsva?\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D*?(([\d.]+)(%?)|$)/i,
    hexa: /^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i
  };

  /**
   * Takes an Array of any type, convert strings which represents
   * a number to a number an anything else to undefined.
   * @param array
   * @return {*}
   */
  const numarize = array => array.map(v => /^(|\d+)\.\d+|\d+$/.test(v) ? Number(v) : undefined);
  let match;
  invalid: for (const type in regex) {
    // Check if current scheme passed
    if (!(match = regex[type].exec(str))) {
      continue;
    }

    // Try to convert
    switch (type) {
      case 'cmyk':
        {
          const [, c, m, y, k] = numarize(match);
          if (c > 100 || m > 100 || y > 100 || k > 100) {
            break invalid;
          }
          return {
            values: cmykToHsv(c, m, y, k),
            type
          };
        }
      case 'rgba':
        {
          let [, r,, g,, b,,, a] = numarize(match);
          r = match[2] === '%' ? r / 100 * 255 : r;
          g = match[4] === '%' ? g / 100 * 255 : g;
          b = match[6] === '%' ? b / 100 * 255 : b;
          a = match[9] === '%' ? a / 100 : a;
          if (r > 255 || g > 255 || b > 255 || a < 0 || a > 1) {
            break invalid;
          }
          return {
            values: [...rgbToHsv(r, g, b), a],
            a,
            type
          };
        }
      case 'hexa':
        {
          let [, hex] = match;
          if (hex.length === 4 || hex.length === 3) {
            hex = hex.split('').map(v => v + v).join('');
          }
          const raw = hex.substring(0, 6);
          let a = hex.substring(6);

          // Convert 0 - 255 to 0 - 1 for opacity
          a = a ? parseInt(a, 16) / 255 : undefined;
          return {
            values: [...hexToHsv(raw), a],
            a,
            type
          };
        }
      case 'hsla':
        {
          let [, h, s, l,, a] = numarize(match);
          a = match[6] === '%' ? a / 100 : a;
          if (h > 360 || s > 100 || l > 100 || a < 0 || a > 1) {
            break invalid;
          }
          return {
            values: [...hslToHsv(h, s, l), a],
            a,
            type
          };
        }
      case 'hsva':
        {
          let [, h, s, v,, a] = numarize(match);
          a = match[6] === '%' ? a / 100 : a;
          if (h > 360 || s > 100 || v > 100 || a < 0 || a > 1) {
            break invalid;
          }
          return {
            values: [h, s, v, a],
            a,
            type
          };
        }
    }
  }
  return {
    values: null,
    type: null
  };
}

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
function HSVaColor(h = 0, s = 0, v = 0, a = 1) {
  const mapper = (original, next) => (precision = -1) => {
    return next(~precision ? original.map(v => Number(v.toFixed(precision))) : original);
  };
  const that = {
    h,
    s,
    v,
    a,
    toHSVA() {
      const hsva = [that.h, that.s, that.v, that.a];
      hsva.toString = mapper(hsva, arr => `hsva(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
      return hsva;
    },
    toHSLA() {
      const hsla = [...hsvToHsl(that.h, that.s, that.v), that.a];
      hsla.toString = mapper(hsla, arr => `hsla(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
      return hsla;
    },
    toRGBA() {
      const rgba = [...hsvToRgb(that.h, that.s, that.v), that.a];
      rgba.toString = mapper(rgba, arr => `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${that.a})`);
      return rgba;
    },
    toCMYK() {
      const cmyk = hsvToCmyk(that.h, that.s, that.v);
      cmyk.toString = mapper(cmyk, arr => `cmyk(${arr[0]}%, ${arr[1]}%, ${arr[2]}%, ${arr[3]}%)`);
      return cmyk;
    },
    toHEXA() {
      const hex = hsvToHex(that.h, that.s, that.v);

      // Check if alpha channel make sense, convert it to 255 number space, convert
      // To hex and pad it with zeros if needet.
      const alpha = that.a >= 1 ? '' : Number((that.a * 255).toFixed(0)).toString(16).toUpperCase().padStart(2, '0');
      alpha && hex.push(alpha);
      hex.toString = () => `#${hex.join('').toUpperCase()}`;
      return hex;
    },
    clone: () => HSVaColor(that.h, that.s, that.v, that.a)
  };
  return that;
}

const clamp = v => Math.max(Math.min(v, 1), 0);
function Moveable(opt) {
  const that = {
    // Assign default values
    options: Object.assign({
      lock: null,
      onchange: () => 0,
      onstop: () => 0
    }, opt),
    _keyboard(e) {
      const {
        options
      } = that;
      const {
        type,
        key
      } = e;

      // Check to see if the Movable is focused and then move it based on arrow key inputs
      // For improved accessibility
      if (document.activeElement === options.wrapper) {
        const {
          lock
        } = that.options;
        const up = key === 'ArrowUp';
        const right = key === 'ArrowRight';
        const down = key === 'ArrowDown';
        const left = key === 'ArrowLeft';
        if (type === 'keydown' && (up || right || down || left)) {
          let xm = 0;
          let ym = 0;
          if (lock === 'v') {
            xm = up || right ? 1 : -1;
          } else if (lock === 'h') {
            xm = up || right ? -1 : 1;
          } else {
            ym = up ? -1 : down ? 1 : 0;
            xm = left ? -1 : right ? 1 : 0;
          }
          that.update(clamp(that.cache.x + 0.01 * xm), clamp(that.cache.y + 0.01 * ym));
          e.preventDefault();
        } else if (key.startsWith('Arrow')) {
          that.options.onstop();
          e.preventDefault();
        }
      }
    },
    _tapstart(evt) {
      on(document, ['mouseup', 'touchend', 'touchcancel'], that._tapstop);
      on(document, ['mousemove', 'touchmove'], that._tapmove);
      if (evt.cancelable) {
        evt.preventDefault();
      }

      // Trigger
      that._tapmove(evt);
    },
    _tapmove(evt) {
      const {
        options,
        cache
      } = that;
      const {
        lock,
        element,
        wrapper
      } = options;
      const b = wrapper.getBoundingClientRect();
      let x = 0,
        y = 0;
      if (evt) {
        const touch = evt && evt.touches && evt.touches[0];
        x = evt ? (touch || evt).clientX : 0;
        y = evt ? (touch || evt).clientY : 0;

        // Reset to bounds
        if (x < b.left) {
          x = b.left;
        } else if (x > b.left + b.width) {
          x = b.left + b.width;
        }
        if (y < b.top) {
          y = b.top;
        } else if (y > b.top + b.height) {
          y = b.top + b.height;
        }

        // Normalize
        x -= b.left;
        y -= b.top;
      } else if (cache) {
        x = cache.x * b.width;
        y = cache.y * b.height;
      }
      if (lock !== 'h') {
        element.style.left = `calc(${x / b.width * 100}% - ${element.offsetWidth / 2}px)`;
      }
      if (lock !== 'v') {
        element.style.top = `calc(${y / b.height * 100}% - ${element.offsetHeight / 2}px)`;
      }
      that.cache = {
        x: x / b.width,
        y: y / b.height
      };
      const cx = clamp(x / b.width);
      const cy = clamp(y / b.height);
      switch (lock) {
        case 'v':
          return options.onchange(cx);
        case 'h':
          return options.onchange(cy);
        default:
          return options.onchange(cx, cy);
      }
    },
    _tapstop() {
      that.options.onstop();
      off(document, ['mouseup', 'touchend', 'touchcancel'], that._tapstop);
      off(document, ['mousemove', 'touchmove'], that._tapmove);
    },
    trigger() {
      that._tapmove();
    },
    update(x = 0, y = 0) {
      const {
        left,
        top,
        width,
        height
      } = that.options.wrapper.getBoundingClientRect();
      if (that.options.lock === 'h') {
        y = x;
      }
      that._tapmove({
        clientX: left + width * x,
        clientY: top + height * y
      });
    },
    destroy() {
      const {
        options,
        _tapstart,
        _keyboard
      } = that;
      off(document, ['keydown', 'keyup'], _keyboard);
      off([options.wrapper, options.element], 'mousedown', _tapstart);
      off([options.wrapper, options.element], 'touchstart', _tapstart, {
        passive: false
      });
    }
  };

  // Initilize
  const {
    options,
    _tapstart,
    _keyboard
  } = that;
  on([options.wrapper, options.element], 'mousedown', _tapstart);
  on([options.wrapper, options.element], 'touchstart', _tapstart, {
    passive: false
  });
  on(document, ['keydown', 'keyup'], _keyboard);
  return that;
}

function Selectable(opt = {}) {
  opt = Object.assign({
    onchange: () => 0,
    className: '',
    elements: []
  }, opt);
  const onTap = on(opt.elements, 'click', evt => {
    opt.elements.forEach(e => e.classList[evt.target === e ? 'add' : 'remove'](opt.className));
    opt.onchange(evt);

    // Fix for https://github.com/Simonwep/pickr/issues/243
    evt.stopPropagation();
  });
  return {
    destroy: () => off(...onTap)
  };
}

var buildPickr = instance => {
  const {
    components,
    useAsButton,
    inline,
    appClass,
    theme,
    lockOpacity
  } = instance.options;

  // Utils
  const hidden = con => con ? '' : 'style="display:none" hidden';
  const t = str => instance._t(str);
  const root = createFromTemplate(`
      <div :ref="root" class="pickr">

        ${useAsButton ? '' : '<button type="button" :ref="button" class="pcr-button"></button>'}

        <div :ref="app" class="pcr-app ${appClass || ''}" data-theme="${theme}" ${inline ? 'style="position: unset"' : ''} aria-label="${t('ui:dialog')}" role="window">
          <div class="pcr-selection" ${hidden(components.palette)}>
            <div :obj="preview" class="pcr-color-preview" ${hidden(components.preview)}>
              <button type="button" :ref="lastColor" class="pcr-last-color" aria-label="${t('btn:last-color')}"></button>
              <div :ref="currentColor" class="pcr-current-color"></div>
            </div>

            <div :obj="palette" class="pcr-color-palette">
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="palette" class="pcr-palette" tabindex="0" aria-label="${t('aria:palette')}" role="listbox"></div>
            </div>

            <div :obj="hue" class="pcr-color-chooser" ${hidden(components.hue)}>
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="slider" class="pcr-hue pcr-slider" tabindex="0" aria-label="${t('aria:hue')}" role="slider"></div>
            </div>

            <div :obj="opacity" class="pcr-color-opacity" ${hidden(components.opacity)}>
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="slider" class="pcr-opacity pcr-slider" tabindex="0" aria-label="${t('aria:opacity')}" role="slider"></div>
            </div>
          </div>

          <div class="pcr-swatches ${components.palette ? '' : 'pcr-last'}" :ref="swatches"></div>

          <div :obj="interaction" class="pcr-interaction" ${hidden(Object.keys(components.interaction).length)}>
            <input :ref="result" class="pcr-result" type="text" spellcheck="false" ${hidden(components.interaction.input)} aria-label="${t('aria:input')}">

            <input :arr="options" class="pcr-type" data-type="HEXA" value="${lockOpacity ? 'HEX' : 'HEXA'}" type="button" ${hidden(components.interaction.hex)}>
            <input :arr="options" class="pcr-type" data-type="RGBA" value="${lockOpacity ? 'RGB' : 'RGBA'}" type="button" ${hidden(components.interaction.rgba)}>
            <input :arr="options" class="pcr-type" data-type="HSLA" value="${lockOpacity ? 'HSL' : 'HSLA'}" type="button" ${hidden(components.interaction.hsla)}>
            <input :arr="options" class="pcr-type" data-type="HSVA" value="${lockOpacity ? 'HSV' : 'HSVA'}" type="button" ${hidden(components.interaction.hsva)}>
            <input :arr="options" class="pcr-type" data-type="CMYK" value="CMYK" type="button" ${hidden(components.interaction.cmyk)}>

            <input :ref="save" class="pcr-save" value="${t('btn:save')}" type="button" ${hidden(components.interaction.save)} aria-label="${t('aria:btn:save')}">
            <input :ref="cancel" class="pcr-cancel" value="${t('btn:cancel')}" type="button" ${hidden(components.interaction.cancel)} aria-label="${t('aria:btn:cancel')}">
            <input :ref="clear" class="pcr-clear" value="${t('btn:clear')}" type="button" ${hidden(components.interaction.clear)} aria-label="${t('aria:btn:clear')}">
          </div>
        </div>
      </div>
    `);
  const int = root.interaction;

  // Select option which is not hidden
  int.options.find(o => !o.hidden && !o.classList.add('active'));

  // Append method to find currently active option
  int.type = () => int.options.find(e => e.classList.contains('active'));
  return root;
};

/*! NanoPop 2.4.2 MIT | https://github.com/Simonwep/nanopop */
const I = {
  variantFlipOrder: { start: "sme", middle: "mse", end: "ems" },
  positionFlipOrder: { top: "tbrl", right: "rltb", bottom: "btrl", left: "lrbt" },
  position: "bottom",
  margin: 8,
  padding: 0
}, J = (n, i, m) => {
  const {
    container: r,
    arrow: a,
    margin: e,
    padding: l,
    position: V,
    variantFlipOrder: C,
    positionFlipOrder: M
  } = {
    container: document.documentElement.getBoundingClientRect(),
    ...I,
    ...m
  }, { left: F, top: K } = i.style;
  i.style.left = "0", i.style.top = "0";
  const t = n.getBoundingClientRect(), o = i.getBoundingClientRect(), P = {
    t: t.top - o.height - e,
    b: t.bottom + e,
    r: t.right + e,
    l: t.left - o.width - e
  }, R = {
    vs: t.left,
    vm: t.left + t.width / 2 - o.width / 2,
    ve: t.left + t.width - o.width,
    hs: t.top,
    hm: t.bottom - t.height / 2 - o.height / 2,
    he: t.bottom - o.height
  }, [$, E = "middle"] = V.split("-"), L = M[$], j = C[E], { top: y, left: x, bottom: B, right: O } = r;
  for (const c of L) {
    const s = c === "t" || c === "b";
    let p = P[c];
    const [d, g] = s ? ["top", "left"] : ["left", "top"], [u, v] = s ? [o.height, o.width] : [o.width, o.height], [z, T] = s ? [B, O] : [O, B], [H, k] = s ? [y, x] : [x, y];
    if (!(p < H || p + u + l > z))
      for (const b of j) {
        let f = R[(s ? "v" : "h") + b];
        if (!(f < k || f + v + l > T)) {
          if (f -= o[g], p -= o[d], i.style[g] = `${f}px`, i.style[d] = `${p}px`, a) {
            const w = s ? t.width / 2 : t.height / 2, h = v / 2, S = w > h, q = {
              s: S ? h : w,
              m: h,
              e: S ? h : v - w
            }, A = {
              t: u,
              b: 0,
              r: 0,
              l: u
            }, D = f + q[b], G = p + A[c];
            a.style[g] = `${D}px`, a.style[d] = `${G}px`;
          }
          return c + b;
        }
      }
  }
  return i.style.left = F, i.style.top = K, null;
}, Q = (n, i, m) => {
  const r = typeof n == "object" && !(n instanceof HTMLElement) ? n : { reference: n, popper: i, ...m };
  return {
    /**
     * Repositions the current popper.
     * @param options Optional options which get merged with the current ones.
     */
    update(a = r) {
      const { reference: e, popper: l } = Object.assign(r, a);
      if (!l || !e)
        throw new Error("Popper- or reference-element missing.");
      return J(e, l, r);
    }
  };
};

/*! Pickr 1.9.0 MIT | https://github.com/Simonwep/pickr */

class Pickr {
  // Expose pickr utils
  static utils = _;

  // Assign version and export
  // static version = VERSION; // Modified: commented

  // Default strings
  static I18N_DEFAULTS = {
    // Strings visible in the UI
    'ui:dialog': 'color picker dialog',
    'btn:toggle': 'toggle color picker dialog',
    'btn:swatch': 'color swatch',
    'btn:last-color': 'use previous color',
    'btn:save': 'Save',
    'btn:cancel': 'Cancel',
    'btn:clear': 'Clear',
    // Strings used for aria-labels
    'aria:btn:save': 'save and close',
    'aria:btn:cancel': 'cancel and close',
    'aria:btn:clear': 'clear and close',
    'aria:input': 'color input field',
    'aria:palette': 'color selection area',
    'aria:hue': 'hue selection slider',
    'aria:opacity': 'selection slider'
  };

  // Default options
  static DEFAULT_OPTIONS = {
    appClass: null,
    theme: 'classic',
    useAsButton: false,
    padding: 8,
    disabled: false,
    comparison: true,
    closeOnScroll: false,
    outputPrecision: 0,
    lockOpacity: false,
    autoReposition: true,
    container: 'body',
    components: {
      interaction: {}
    },
    i18n: {},
    swatches: null,
    inline: false,
    sliders: null,
    default: '#42445a',
    defaultRepresentation: null,
    position: 'bottom-middle',
    adjustableNumbers: true,
    showAlways: false,
    closeWithKey: 'Escape'
  };

  // Will be used to prevent specific actions during initilization
  _initializingActive = true;

  // If the current color value should be recalculated
  _recalc = true;

  // Positioning engine and DOM-Tree
  _nanopop = null;
  _root = null;

  // Current and last color for comparison
  _color = HSVaColor();
  _lastColor = HSVaColor();
  _swatchColors = [];

  // Animation frame used for setup.
  // Will be cancelled in case of destruction.
  _setupAnimationFrame = null;

  // Evenlistener name: [callbacks]
  _eventListener = {
    init: [],
    save: [],
    hide: [],
    show: [],
    clear: [],
    change: [],
    changestop: [],
    cancel: [],
    swatchselect: []
  };
  constructor(opt) {
    // Assign default values
    this.options = opt = Object.assign({
      ...Pickr.DEFAULT_OPTIONS
    }, opt);
    const {
      swatches,
      components,
      theme,
      sliders,
      lockOpacity,
      padding
    } = opt;
    if (['nano', 'monolith'].includes(theme) && !sliders) {
      opt.sliders = 'h';
    }

    // Check interaction section
    if (!components.interaction) {
      components.interaction = {};
    }

    // Overwrite palette if preview, opacity or hue are true
    const {
      preview,
      opacity,
      hue,
      palette
    } = components;
    components.opacity = !lockOpacity && opacity;
    components.palette = palette || preview || opacity || hue;

    // Initialize picker
    this._preBuild();
    this._buildComponents();
    this._bindEvents();
    this._finalBuild();

    // Append pre-defined swatch colors
    if (swatches && swatches.length) {
      swatches.forEach(color => this.addSwatch(color));
    }

    // Initialize positioning engine
    const {
      button,
      app
    } = this._root;
    this._nanopop = Q(button, app, {
      margin: padding
    });

    // Initialize accessibility
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', this._t('btn:toggle'));

    // Initilization is finish, pickr is visible and ready for usage
    const that = this;
    this._setupAnimationFrame = requestAnimationFrame(function cb() {
      // TODO: Performance issue due to high call-rate?
      if (!app.offsetWidth) {
        return requestAnimationFrame(cb);
      }

      /*
      // Apply default color
      that.setColor(opt.default);
      that._rePositioningPicker();
       // Initialize color representation
      if (opt.defaultRepresentation) {
          that._representation = opt.defaultRepresentation;
          that.setColorRepresentation(that._representation);
      }
       // Show pickr if locked
      if (opt.showAlways) {
          that.show();
      }
       // Initialization is done - pickr is usable, fire init event
      that._initializingActive = false;
      that._emit('init');
      */

      // Modified: fix performance issue
      new Promise(resolve => {
        // Apply default color
        that.setColor(opt.default);
        that._rePositioningPicker();

        // Initialize color representation
        if (opt.defaultRepresentation) {
          that._representation = opt.defaultRepresentation;
          that.setColorRepresentation(that._representation);
        }

        // Show pickr if locked
        if (opt.showAlways) {
          that.show();
        }
        resolve();
      }).then(() => {
        // Once all heavy work is done, perform any finalization here

        // Initialization is done - pickr is usable, fire init event
        that._initializingActive = false;
        that._emit('init');
      });
    });
  }

  // Create instance via method
  static create = options => new Pickr(options);

  // Does only the absolutly basic thing to initialize the components
  _preBuild() {
    const {
      options
    } = this;

    // Resolve elements
    for (const type of ['el', 'container']) {
      options[type] = resolveElement(options[type]);
    }

    // Create element and append it to body to
    // Prevent initialization errors
    this._root = buildPickr(this);

    // Check if a custom button is used
    if (options.useAsButton) {
      this._root.button = options.el; // Replace button with customized button
    }
    options.container.appendChild(this._root.root);
  }
  _finalBuild() {
    const opt = this.options;
    const root = this._root;

    // Remove from body
    opt.container.removeChild(root.root);
    if (opt.inline) {
      const parent = opt.el.parentElement;
      if (opt.el.nextSibling) {
        parent.insertBefore(root.app, opt.el.nextSibling);
      } else {
        parent.appendChild(root.app);
      }
    } else {
      opt.container.appendChild(root.app);
    }

    // Don't replace the the element if a custom button is used
    if (!opt.useAsButton) {
      // Replace element with actual color-picker
      opt.el.parentNode.replaceChild(root.root, opt.el);
    } else if (opt.inline) {
      opt.el.remove();
    }

    // Check if it should be immediatly disabled
    if (opt.disabled) {
      this.disable();
    }

    // Check if color comparison is disabled, if yes - remove transitions so everything keeps smoothly
    if (!opt.comparison) {
      root.button.style.transition = 'none';
      if (!opt.useAsButton) {
        root.preview.lastColor.style.transition = 'none';
      }
    }
    this.hide();
  }
  _buildComponents() {
    // Instance reference
    const inst = this;
    const cs = this.options.components;
    const sliders = (inst.options.sliders || 'v').repeat(2);
    const [so, sh] = sliders.match(/^[vh]+$/g) ? sliders : [];

    // Re-assign if null
    const getColor = () => this._color || (this._color = this._lastColor.clone());
    const components = {
      palette: Moveable({
        element: inst._root.palette.picker,
        wrapper: inst._root.palette.palette,
        onstop: () => inst._emit('changestop', 'slider', inst),
        onchange(x, y) {
          if (!cs.palette) {
            return;
          }
          const color = getColor();
          const {
            _root,
            options
          } = inst;
          const {
            lastColor,
            currentColor
          } = _root.preview;

          // Update the input field only if the user is currently not typing
          if (inst._recalc) {
            // Calculate saturation based on the position
            color.s = x * 100;

            // Calculate the value
            color.v = 100 - y * 100;

            // Prevent falling under zero
            color.v < 0 ? color.v = 0 : 0;
            inst._updateOutput('slider');
          }

          // Set picker and gradient color
          const cssRGBaString = color.toRGBA().toString(0);
          this.element.style.background = cssRGBaString;
          this.wrapper.style.background = `
                        linear-gradient(to top, rgba(0, 0, 0, ${color.a}), transparent),
                        linear-gradient(to left, hsla(${color.h}, 100%, 50%, ${color.a}), rgba(255, 255, 255, ${color.a}))
                    `;

          // Check if color is locked
          if (!options.comparison) {
            _root.button.style.setProperty('--pcr-color', cssRGBaString);

            // If the user changes the color, remove the cleared icon
            _root.button.classList.remove('clear');
          } else if (!options.useAsButton && !inst._lastColor) {
            // Apply color to both the last and current color since the current state is cleared
            lastColor.style.setProperty('--pcr-color', cssRGBaString);
          }

          // Check if there's a swatch which color matches the current one
          const hexa = color.toHEXA().toString();
          for (const {
            el,
            color
          } of inst._swatchColors) {
            el.classList[hexa === color.toHEXA().toString() ? 'add' : 'remove']('pcr-active');
          }

          // Change current color
          currentColor.style.setProperty('--pcr-color', cssRGBaString);
        }
      }),
      hue: Moveable({
        lock: sh === 'v' ? 'h' : 'v',
        element: inst._root.hue.picker,
        wrapper: inst._root.hue.slider,
        onstop: () => inst._emit('changestop', 'slider', inst),
        onchange(v) {
          if (!cs.hue || !cs.palette) {
            return;
          }
          const color = getColor();

          // Calculate hue
          if (inst._recalc) {
            color.h = v * 360;
          }

          // Update color
          this.element.style.backgroundColor = `hsl(${color.h}, 100%, 50%)`;
          components.palette.trigger();
        }
      }),
      opacity: Moveable({
        lock: so === 'v' ? 'h' : 'v',
        element: inst._root.opacity.picker,
        wrapper: inst._root.opacity.slider,
        onstop: () => inst._emit('changestop', 'slider', inst),
        onchange(v) {
          if (!cs.opacity || !cs.palette) {
            return;
          }
          const color = getColor();

          // Calculate opacity
          if (inst._recalc) {
            color.a = Math.round(v * 1e2) / 100;
          }

          // Update color
          this.element.style.background = `rgba(0, 0, 0, ${color.a})`;
          components.palette.trigger();
        }
      }),
      selectable: Selectable({
        elements: inst._root.interaction.options,
        className: 'active',
        onchange(e) {
          inst._representation = e.target.getAttribute('data-type').toUpperCase();
          inst._recalc && inst._updateOutput('swatch');
        }
      })
    };
    this._components = components;
  }
  _bindEvents() {
    const {
      _root,
      options
    } = this;
    const eventBindings = [
    // Clear color
    on(_root.interaction.clear, 'click', () => this._clearColor()),
    // Select last color on click
    on([_root.interaction.cancel, _root.preview.lastColor], 'click', () => {
      this.setHSVA(...(this._lastColor || this._color).toHSVA(), true);
      this._emit('cancel');
    }),
    // Save color
    on(_root.interaction.save, 'click', () => {
      !this.applyColor() && !options.showAlways && this.hide();
    }),
    // User input
    on(_root.interaction.result, ['keyup', 'input'], e => {
      if (e.key === 'Enter') {
        // Modified: only for Enter key
        // Fire listener if initialization is finish and changed color was valid
        if (this.setColor(e.target.value, true) && !this._initializingActive) {
          this._emit('change', this._color, 'input', this);
          this._emit('changestop', 'input', this);
        }
        e.stopImmediatePropagation();
      }
    }),
    // Detect user input and disable auto-recalculation
    on(_root.interaction.result, ['focus', 'blur'], e => {
      if (_root.interaction.result.value === '') return; // Modified: add condition
      this._recalc = e.type === 'blur';
      this._recalc && this._updateOutput(null);
    }),
    // Cancel input detection on color change
    on([_root.palette.palette, _root.palette.picker, _root.hue.slider, _root.hue.picker, _root.opacity.slider, _root.opacity.picker], ['mousedown', 'touchstart'], () => this._recalc = true, {
      passive: true
    })];

    // Provide hiding / showing abilities only if showAlways is false
    if (!options.showAlways) {
      const ck = options.closeWithKey;
      eventBindings.push(
      // Save and hide / show picker
      on(_root.button, 'click', () => this.isOpen() ? this.hide() : this.show()),
      // Close with escape key
      on(document, 'keyup', e => this.isOpen() && (e.key === ck || e.code === ck) && this.hide()),
      // Cancel selecting if the user taps behind the color picker
      on(document, ['touchstart', 'mousedown'], e => {
        if (this.isOpen() && !eventPath(e).some(el => el === _root.app || el === _root.button)) {
          this.hide();
        }
      }, {
        capture: true
      }));
    }

    // Make input adjustable if enabled
    if (options.adjustableNumbers) {
      const ranges = {
        rgba: [255, 255, 255, 1],
        hsva: [360, 100, 100, 1],
        hsla: [360, 100, 100, 1],
        cmyk: [100, 100, 100, 100]
      };
      adjustableInputNumbers(_root.interaction.result, (o, step, index) => {
        const range = ranges[this.getColorRepresentation().toLowerCase()];
        if (range) {
          const max = range[index];

          // Calculate next reasonable number
          const nv = o + (max >= 100 ? step * 1000 : step);

          // Apply range of zero up to max, fix floating-point issues
          return nv <= 0 ? 0 : Number((nv < max ? nv : max).toPrecision(3));
        }
        return o;
      });
    }
    if (options.autoReposition && !options.inline) {
      let timeout = null;
      const that = this;

      // Re-calc position on window resize, scroll and wheel
      eventBindings.push(on(window, ['scroll', 'resize'], () => {
        if (that.isOpen()) {
          if (options.closeOnScroll) {
            that.hide();
          }
          if (timeout === null) {
            timeout = setTimeout(() => timeout = null, 100);

            // Update position on every frame
            requestAnimationFrame(function rs() {
              that._rePositioningPicker();
              timeout !== null && requestAnimationFrame(rs);
            });
          } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => timeout = null, 100);
          }
        }
      }, {
        capture: true
      }));
    }

    // Save bindings
    this._eventBindings = eventBindings;
  }
  _rePositioningPicker() {
    const {
      options
    } = this;

    // No repositioning needed if inline
    if (!options.inline) {
      const success = this._nanopop.update({
        container: document.body.getBoundingClientRect(),
        position: options.position
      });
      if (!success) {
        const el = this._root.app;
        const eb = el.getBoundingClientRect();
        el.style.top = `${(window.innerHeight - eb.height) / 2}px`;
        el.style.left = `${(window.innerWidth - eb.width) / 2}px`;
      }
    }
  }
  _updateOutput(eventSource) {
    const {
      _root,
      _color,
      options
    } = this;

    // Check if component is present
    if (_root.interaction.type()) {
      // Construct function name and call if present
      const method = `to${_root.interaction.type().getAttribute('data-type')}`;
      _root.interaction.result.value = typeof _color[method] === 'function' ? _color[method]().toString(options.outputPrecision) : '';
    }

    // Fire listener if initialization is finish
    if (!this._initializingActive && this._recalc) {
      this._emit('change', _color, eventSource, this);
    }
  }
  _clearColor(silent = false) {
    const {
      _root,
      options
    } = this;

    // Change only the button color if it isn't customized
    if (!options.useAsButton) {
      _root.button.style.setProperty('--pcr-color', 'rgba(0, 0, 0, 0.15)');
    }
    _root.button.classList.add('clear');
    if (!options.showAlways) {
      this.hide();
    }
    this._lastColor = null;
    if (!this._initializingActive && !silent) {
      // Fire listener
      this._emit('save', null);
      this._emit('clear');
    }
  }
  _parseLocalColor(str) {
    const {
      values,
      type,
      a
    } = parseToHSVA(str);
    const {
      lockOpacity
    } = this.options;
    const alphaMakesAChange = a !== undefined && a !== 1;

    // If no opacity is applied, add undefined at the very end which gets
    // Set to 1 in setHSVA
    if (values && values.length === 3) {
      values[3] = undefined;
    }
    return {
      values: !values || lockOpacity && alphaMakesAChange ? null : values,
      type
    };
  }
  _t(key) {
    return this.options.i18n[key] || Pickr.I18N_DEFAULTS[key];
  }
  _emit(event, ...args) {
    this._eventListener[event].forEach(cb => cb(...args, this));
  }
  on(event, cb) {
    this._eventListener[event].push(cb);
    return this;
  }
  off(event, cb) {
    const callBacks = this._eventListener[event] || [];
    const index = callBacks.indexOf(cb);
    if (~index) {
      callBacks.splice(index, 1);
    }
    return this;
  }

  /**
   * Appends a color to the swatch palette
   * @param color
   * @returns {boolean}
   */
  addSwatch(color) {
    const {
      values
    } = this._parseLocalColor(color);
    if (values) {
      const {
        _swatchColors,
        _root
      } = this;
      const color = HSVaColor(...values);

      // Create new swatch HTMLElement
      const el = createElementFromString(`<button type="button" style="--pcr-color: ${color.toRGBA().toString(0)}" aria-label="${this._t('btn:swatch')}"/>`);

      // Append element and save swatch data
      _root.swatches.appendChild(el);
      _swatchColors.push({
        el,
        color
      });

      // Bind event
      this._eventBindings.push(on(el, 'click', () => {
        this.setHSVA(...color.toHSVA(), true);
        this._emit('swatchselect', color);
        this._emit('change', color, 'swatch', this);
      }));
      return true;
    }
    return false;
  }

  /**
   * Removes a swatch color by it's index
   * @param index
   * @returns {boolean}
   */
  removeSwatch(index) {
    const swatchColor = this._swatchColors[index];

    // Check swatch data
    if (swatchColor) {
      const {
        el
      } = swatchColor;

      // Remove HTML child and swatch data
      this._root.swatches.removeChild(el);
      this._swatchColors.splice(index, 1);
      return true;
    }
    return false;
  }
  applyColor(silent = false) {
    const {
      preview,
      button
    } = this._root;

    // Change preview and current color
    const cssRGBaString = this._color.toRGBA().toString(0);
    preview.lastColor.style.setProperty('--pcr-color', cssRGBaString);

    // Change only the button color if it isn't customized
    if (!this.options.useAsButton) {
      button.style.setProperty('--pcr-color', cssRGBaString);
    }

    // User changed the color so remove the clear clas
    button.classList.remove('clear');

    // Save last color
    this._lastColor = this._color.clone();

    // Fire listener
    if (!this._initializingActive && !silent) {
      this._emit('save', this._color);
    }
    return this;
  }

  /**
   * Destroy's all functionalitys
   */
  destroy() {
    // Cancel setup-frame if set
    cancelAnimationFrame(this._setupAnimationFrame);

    // Unbind events
    this._eventBindings.forEach(args => off(...args));

    // Destroy sub-components
    Object.keys(this._components).forEach(key => this._components[key].destroy());
  }

  /**
   * Destroy's all functionalitys and removes
   * the pickr element.
   */
  destroyAndRemove() {
    this.destroy();
    const {
      root,
      app
    } = this._root;

    // Remove element
    if (root.parentElement) {
      root.parentElement.removeChild(root);
    }

    // Remove .pcr-app
    app.parentElement.removeChild(app);

    // There are references to various DOM elements stored in the pickr instance
    // This cleans all of them to avoid detached DOMs
    Object.keys(this).forEach(key => this[key] = null);
  }

  /**
   * Hides the color-picker ui.
   */
  hide() {
    if (this.isOpen()) {
      this._root.app.classList.remove('visible');
      this._emit('hide');
      return true;
    }
    return false;
  }

  /**
   * Shows the color-picker ui.
   */
  show() {
    if (!this.options.disabled && !this.isOpen()) {
      this._root.app.classList.add('visible');
      this._rePositioningPicker();
      this._emit('show', this._color);
      return this;
    }
    return false;
  }

  /**
   * @return {boolean} If the color picker is currently open
   */
  isOpen() {
    return this._root.app.classList.contains('visible');
  }

  /**
   * Set a specific color.
   * @param h Hue
   * @param s Saturation
   * @param v Value
   * @param a Alpha channel (0 - 1)
   * @param silent If the button should not change the color
   * @return boolean if the color has been accepted
   */
  setHSVA(h = 360, s = 0, v = 0, a = 1, silent = false) {
    // Deactivate color calculation
    const recalc = this._recalc; // Save state
    this._recalc = false;

    // Validate input
    if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100 || a < 0 || a > 1) {
      return false;
    }

    // Override current color and re-active color calculation
    this._color = HSVaColor(h, s, v, a);

    // Update slider and palette
    const {
      hue,
      opacity,
      palette
    } = this._components;
    hue.update(h / 360);
    opacity.update(a);
    palette.update(s / 100, 1 - v / 100);

    // Check if call is silent
    if (!silent) {
      this.applyColor();
    }

    // Update output if recalculation is enabled
    if (recalc) {
      this._updateOutput();
    }

    // Restore old state
    this._recalc = recalc;
    return true;
  }

  /**
   * Tries to parse a string which represents a color.
   * Examples: #fff
   *           rgb 10 10 200
   *           hsva 10 20 5 0.5
   * @param string
   * @param silent
   */
  setColor(string, silent = false) {
    // Check if null
    if (string === null) {
      this._clearColor(silent);
      return true;
    }
    const {
      values,
      type
    } = this._parseLocalColor(string);

    // Check if color is ok
    if (values) {
      // Change selected color format
      const utype = type.toUpperCase();
      const {
        options
      } = this._root.interaction;
      const target = options.find(el => el.getAttribute('data-type') === utype);

      // Auto select only if not hidden
      if (target && !target.hidden) {
        for (const el of options) {
          el.classList[el === target ? 'add' : 'remove']('active');
        }
      }

      // Update color (fires 'save' event if silent is 'false')
      if (!this.setHSVA(...values, silent)) {
        return false;
      }

      // Update representation (fires 'change' event)
      return this.setColorRepresentation(utype);
    }
    return false;
  }

  /**
   * Changes the color _representation.
   * Allowed values are HEX, RGB, HSV, HSL and CMYK
   * @param type
   * @returns {boolean} if the selected type was valid.
   */
  setColorRepresentation(type) {
    // Force uppercase to allow a case-sensitiv comparison
    type = type.toUpperCase();

    // Find button with given type and trigger click event
    return !!this._root.interaction.options.find(v => v.getAttribute('data-type').startsWith(type) && !v.click());
  }

  /**
   * Returns the current color representaion. See setColorRepresentation
   * @returns {*}
   */
  getColorRepresentation() {
    return this._representation;
  }

  /**
   * @returns HSVaColor Current HSVaColor object.
   */
  getColor() {
    return this._color;
  }

  /**
   * Returns the currently selected color.
   * @returns {{a, toHSVA, toHEXA, s, v, h, clone, toCMYK, toHSLA, toRGBA}}
   */
  getSelectedColor() {
    return this._lastColor;
  }

  /**
   * @returns The root HTMLElement with all his components.
   */
  getRoot() {
    return this._root;
  }

  /**
   * Disable pickr
   */
  disable() {
    this.hide();
    this.options.disabled = true;
    this._root.button.classList.add('disabled');
    return this;
  }

  /**
   * Enable pickr
   */
  enable() {
    this.options.disabled = false;
    this._root.button.classList.remove('disabled');
    return this;
  }
}

// import '@simonwep/pickr/dist/themes/nano.min.css';
// import Pickr from '@simonwep/pickr';
class ColorPicker {
  constructor(opts = {}, builder) {
    let defaults = {
      onPick: function () {},
      color: '',
      colors: ['#ff9f01', '#f57c00', '#e64918', '#d32f2f', '#5d4038', '#37474f', '#353535', '#fbc02c', '#b0b42a', '#689f39', '#c21f5b', '#7b21a2', '#522da8', '#616161', '#01b8c9', '#009688', '#388d3c', '#0388d0', '#1465c0', '#2f3f9e', '#9e9e9e'],
      renderOn: '',
      animateModal: false,
      elementToAnimate: '',
      stuffPlacement: '#_cbhtml',
      lang: []
    };
    this.builder = builder;
    this.opts = Object.assign(this, defaults, opts);
    let builderStuff = document.querySelector(this.opts.stuffPlacement);
    if (!builderStuff) {
      builderStuff = document.createElement('div');
      builderStuff.id = '_cbhtml';
      builderStuff.className = 'is-ui';
      document.body.appendChild(builderStuff);
    }
    this.builderStuff = builderStuff;
    builderStuff.insertAdjacentHTML('beforeend', `
        <div class="is-pop pop-picker" style="z-index:10003;" tabindex="-1" role="dialog" aria-modal="true" aria-hidden="true">
        
            <input type="text" class="_pop-colpick" />
            <div class="_pop-colpick_container"></div>
        </div>
        `);
    const poppicker = builderStuff.querySelector('.pop-picker');
    poppicker.style.display = 'flex';
    poppicker.style.opacity = 0;
    if (this.opts.colors.length <= 21) poppicker.style.height = '360px'; // 3 lines 
    else if (this.opts.colors.length > 21 && this.opts.colors.length <= 28) poppicker.style.height = '390px'; // 4 lines
    else if (this.opts.colors.length > 28) poppicker.style.height = '420px'; // 5 lines

    const pickr = Pickr.create({
      el: '._pop-colpick',
      theme: 'nano',
      // or 'monolith', or 'nano'
      // inline:true,
      container: '._pop-colpick_container',
      showAlways: true,
      swatches: this.opts.colors,
      useAsButton: true,
      defaultRepresentation: 'RGBA',
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          hex: false,
          rgba: false,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          clear: true,
          save: false
        }
      },
      i18n: {
        'btn:clear': this.out('Clear'),
        'aria:btn:clear': this.out('Clear')
      }
    });
    pickr.on('change', color => {
      if (poppicker.style.display !== 'flex') return;
      let s = color.toRGBA().toString(0);
      if (!this.noCallback) this.opts.onPick(s);
      this.noCallback = false; //just in case
    }).on('clear', () => {
      this.opts.onPick('');
      poppicker.querySelector('.pcr-result').value = ''; //clear
    });
    this.pickr = pickr;
    setTimeout(() => {
      poppicker.style.display = '';
      poppicker.style.opacity = '';
    }, 1);
    /*
    For some reason, the first time pickr is used by calling setColor,
    it always triggers 2x setColor and use it default options.
    So for first time only, we trigger the setColor by calling initPickr().
    */
    // this.initPickr();

    /*
    UPDATE:
    The Pickr.create must use visible container for its first time run.
    This will use its default options. Then, next time we call setColor,
    everything will run ok.
    So we use:
        poppicker.style.display = 'flex';
        poppicker.style.opacity = 0;
    */
  } //constructor

  makeId() {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 2; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    let text2 = '';
    let possible2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) text2 += possible2.charAt(Math.floor(Math.random() * possible2.length));
    return text + text2;
  }
  out(s) {
    if (this.opts.lang) {
      let val = this.opts.lang[s];
      if (val) return val;else {
        return s;
      }
    } else {
      return s;
    }
  }
  open(onPick, color, cancelCallback, btn, overlay = false) {
    if (!btn) {
      const iframes = document.getElementsByTagName('iframe');
      for (let i = 0; i < iframes.length; i++) {
        try {
          let elm = iframes[i].contentDocument.activeElement;
          if (elm.tagName.toLocaleLowerCase() !== 'body') {
            btn = elm;
          }
        } catch (e) {
          // Do Nothing
          // Ignore errors (can happen if cross-origin)
        }
      }
      if (!btn) btn = document.activeElement;
    }
    let popPicker = document.querySelector('.pop-picker');
    this.builder.showPop(popPicker, false, btn, overlay);
    const w = popPicker.offsetWidth;
    const h = popPicker.offsetHeight;
    const newPos = this.getElementPosition(btn);
    let top = newPos.top;
    let left = newPos.left;
    let adjLeft = 0;
    let adjTop = 2;
    if (btn.closest('.is-controlpanel')) {
      adjLeft = 5; // in control panel, buttons are wrapped in group with padding 2px
      adjTop = 7;
    }
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (viewportHeight - (top + adjTop + btn.offsetHeight) > h) {
      // pop bottom
      popPicker.style.top = top + adjTop + btn.offsetHeight + window.pageYOffset + 'px';
    } else {
      // pop top
      popPicker.style.top = top - adjTop - h - 4 + window.pageYOffset + 'px';

      // in case both pop top/bottom don't have enough space for the pop
      if (top < h) {
        popPicker.style.top = (viewportHeight - h) / 2 + window.pageYOffset + 'px';
      }
    }
    if (viewportWidth - left > w) {
      popPicker.style.left = left - adjLeft + 'px';
    } else {
      // pop left
      popPicker.style.left = left + adjLeft - w + btn.offsetWidth + 'px';
    }

    // if opened from inside a module (iframe)
    const iframe = this.findParentIframeOfActiveElement(btn);
    if (iframe) {
      // override if btn is inside an iframe
      let num = parseInt(window.getComputedStyle(iframe, null).getPropertyValue('border-top-width'));
      if (isNaN(num)) num = 0;
      const iframePos = this.getElementPosition(iframe);
      top = top + iframePos.top;
      left = left + iframePos.left;
      if (viewportHeight - (top + adjTop + btn.offsetHeight + num) > h) {
        // pop bottom
        popPicker.style.top = top + adjTop + btn.offsetHeight + num + window.pageYOffset + 'px';
      } else {
        // pop top
        popPicker.style.top = top - adjTop - h + num + window.pageYOffset + 'px';
      }
      if (viewportWidth - left > w) {
        popPicker.style.left = left + 'px';
      } else {
        // pop left
        popPicker.style.left = left - w + btn.offsetWidth + 'px';
      }
      const doc = iframe.contentDocument;
      const handlePopClickOut = e => {
        if (!popPicker.contains(e.target) && !btn.contains(e.target)) {
          // click outside
          // hide
          if (e.target.classList.contains('is-btn-color') && btn.classList.contains('is-btn-color') && e.target !== btn) {
            // other button that also opens color picker
            // Do not hide
            return;
          }
          this.builder.util.hidePop(popPicker);
          doc.removeEventListener('click', handlePopClickOut);
        }
      };
      doc.addEventListener('click', handlePopClickOut);
    }
    if (onPick) {
      this.opts.onPick = onPick;
    }
    if (color === 'transparent' || color === '') {
      this.setColor('', true);
      const poppicker = document.querySelector('.pop-picker');
      poppicker.querySelector('.pcr-result').value = ''; //clear
    } else {
      this.opts.color = color;
      this.setColor(color, true);
    }
    this.noCallback = false;
  }
  openByTab(color) {
    // Rte
    if (color === 'transparent' || color === '') {
      this.pickrRte.setColor('');
      let pickcolor = document.querySelector(this.opts.renderOn);
      pickcolor.querySelector('.pcr-result').value = ''; //clear
    } else {
      this.opts.color = color;
      this.pickrRte.setColor(color);
    }
  }
  setColorRte(color) {
    this.pickrRte.setColor(color);
  }
  setColor(color, noCallback) {
    //, noCallback

    if (noCallback) this.noCallback = true; // will be passed to onChange, since the onChanhe calls onPick(color)
    this.pickr.setColor(color);

    // if(!noCallback) this.opts.onPick(color);
  }
  getElementPosition(element) {
    const top = element.getBoundingClientRect().top;
    const left = element.getBoundingClientRect().left;
    return {
      top,
      left
    };
  }
  findParentIframeOfActiveElement(btn) {
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
      try {
        if (iframes[i].contentDocument === btn.ownerDocument) {
          return iframes[i];
        }
      } catch (e) {
        // Do Nothing
        // Ignore errors (can happen if cross-origin)
      }
    }
    return null; // Active element is not in an iframe or iframe is cross-origin
  }
}

class PromptEditor {
  constructor(element, settings = {}) {
    const defaults = {
      ariaLabel: 'Editable content',
      placeholderText: 'Press "/" to insert a reference.',
      tags: [{
        title: 'Insert tag1',
        name: 'tag1'
      }, {
        title: 'Insert tag2',
        name: 'tag2'
      }, {
        title: 'Insert tag3',
        name: 'tag3'
      }],
      value: ''
    };
    this.settings = Object.assign({}, defaults, settings);
    this.element = element;
    this.init();
  }
  cleanHtml(content) {
    const clone = document.createElement('div');
    clone.style.position = 'fixed'; // Prevent layout shifts
    clone.style.left = '-9999px'; // Move outside the viewport
    document.body.appendChild(clone);
    clone.innerHTML = content;
    const tags = clone.querySelectorAll('span.tag');
    tags.forEach(tag => {
      tag.innerText = `{{${tag.innerText}}}`;
    });
    let text = clone.innerText.trim(); // Get text with correct line breaks
    // text = text.replace(/\u00A0/g, ' ');
    text = text.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ').trim();
    clone.remove();
    return text;
  }
  isHTML(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    // If any child node is an element, consider it HTML
    return Array.from(doc.body.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE);
  }
  textToHTML(text) {
    // return text
    //     .replace(/</g, '&lt;')      
    //     .replace(/>/g, '&gt;')       
    //     .replace(/\n/g, '<br>');      // Replace line breaks with <br>
    return text.replace(/&/g, '&amp;') // escape &
    .replace(/</g, '&lt;') // escape <
    .replace(/>/g, '&gt;') // escape >
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // replace tab with 4 non-breaking spaces
    .replace(/ {2}/g, ' &nbsp;') // preserve consecutive spaces
    .replace(/\n/g, '<br>'); // replace newlines with <br>
  }
  getValue() {
    return this.editor.innerHTML;
  }
  init() {
    const element = this.element;
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-wrapper';
    element.appendChild(wrapper);
    const editor = document.createElement('div');
    editor.className = 'prompt-editor';
    editor.setAttribute('contenteditable', true);
    editor.setAttribute('role', 'textbox');
    editor.setAttribute('ria-multiline', true);
    editor.setAttribute('aria-label', this.settings.ariaLabel);
    wrapper.appendChild(editor);
    this.editor = editor;
    let content = this.settings.value;
    if (!this.isHTML(content) || content.indexOf('{{') !== -1) {
      content = this.textToHTML(content);
      content = content.replace(/{{(.*?)}}/g, '<span class="tag" contentEditable="false" data-name="$1">$1</span>');
    }
    editor.innerHTML = content;
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-text';
    placeholder.innerText = this.settings.placeholderText;
    wrapper.appendChild(placeholder);
    const dropdown = document.createElement('div');
    dropdown.className = 'tag-selector';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-hidden', true);
    element.appendChild(dropdown);
    const renderDropdown = () => {
      dropdown.innerHTML = '';
      this.settings.tags.forEach(item => {
        const button = document.createElement('button');
        button.setAttribute('role', 'option');
        button.setAttribute('tabindex', '-1');
        button.setAttribute('data-tag', item.name);
        button.innerText = item.title;
        dropdown.appendChild(button);
      });
      let dropdownButtons = Array.from(element.querySelectorAll('button')); //get latest
      dropdownButtons.forEach(button => {
        // Handle dropdown button click
        button.addEventListener('click', () => {
          insertTag(button.dataset.tag);
        });
        button.addEventListener('mouseover', () => {
          dropdownButtons.forEach(button => button.classList.remove('selected'));
          button.classList.add('selected');
        });
      });
    };
    renderDropdown();
    this.renderDropdown = renderDropdown;
    let isDropdownVisible = false;

    // Handle dropdown key navigation
    this.handleNavigateDrodown = event => {
      let dropdownButtons = Array.from(element.querySelectorAll('button')); //get latest

      // Only handle arrow keys when the dropdown is open
      if (isDropdownVisible) {
        const currentIndex = dropdownButtons.indexOf(element.querySelector('.tag-selector button.selected'));

        // Arrow Down navigation
        if (event.key === 'ArrowDown') {
          const nextIndex = (currentIndex + 1) % dropdownButtons.length;
          dropdownButtons[currentIndex].classList.remove('selected');
          dropdownButtons[nextIndex].classList.add('selected');

          // Scroll into view
          dropdownButtons[nextIndex].scrollIntoView({
            block: 'nearest'
          });
          event.preventDefault(); // Prevent default scrolling
        }
        // Arrow Up navigation
        else if (event.key === 'ArrowUp') {
          const prevIndex = (currentIndex - 1 + dropdownButtons.length) % dropdownButtons.length;
          dropdownButtons[currentIndex].classList.remove('selected');
          dropdownButtons[prevIndex].classList.add('selected');

          // Scroll into view
          dropdownButtons[prevIndex].scrollIntoView({
            block: 'nearest'
          });
          event.preventDefault(); // Prevent default scrolling
        }
        // Enter or Space to select the tag
        else if (event.key === 'Enter' || event.key === ' ') {
          element.querySelector('.tag-selector button.selected').click(); // Select the tag
          event.preventDefault();
        }
        // Close dropdown with Escape
        else if (event.key === 'Escape') {
          toggleDropdown(false);
          event.preventDefault();
        }
        // Tab to select the tag
        else if (event.key === 'Tab' || event.key === ' ') {
          element.querySelector('.tag-selector button.selected').click(); // Select the tag
          event.preventDefault();
        }
      }
    };

    // Show or hide the dropdown
    const toggleDropdown = show => {
      if (show) {
        let dropdownButtons = Array.from(element.querySelectorAll('button')); //get latest
        if (dropdownButtons.length === 0) return;
      }
      isDropdownVisible = show;
      dropdown.setAttribute('aria-hidden', !show);
      if (show) {
        let dropdownButtons = Array.from(element.querySelectorAll('button')); //get latest

        // Clear any existing selection
        dropdownButtons.forEach(button => button.classList.remove('selected'));
        // Add 'selected' class to the first option
        if (dropdownButtons.length > 0) dropdownButtons[0].classList.add('selected');
        positionDropdown();
        document.addEventListener('keydown', this.handleNavigateDrodown);
        document.addEventListener('click', handleOutsideClick); // Add outside click listener
      } else {
        document.removeEventListener('click', handleOutsideClick); // Remove outside click listener

        document.removeEventListener('keydown', this.handleNavigateDrodown); // Remove outside click listener

        // editor.focus(); // Return focus to editor
      }
    };

    // Function to handle outside clicks
    const handleOutsideClick = event => {
      // Close dropdown only if the click is outside both dropdown and editor
      if (!dropdown.contains(event.target)) {
        toggleDropdown(false);
      }
    };

    // Position the dropdown under the caret
    const positionDropdown = () => {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      dropdown.style.left = `${rect.left + window.scrollX}px`;
      dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    };
    const insertTag = tag => {
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);

      // Create a span element for the tag
      const tagElement = document.createElement('span');
      tagElement.textContent = tag;
      tagElement.setAttribute('contentEditable', false);
      tagElement.setAttribute('data-name', tag);
      tagElement.className = 'tag';
      if (range.collapsed) {
        const caretPosition = range.startOffset;
        const textNode = range.startContainer;
        if (textNode.nodeType === Node.TEXT_NODE && caretPosition > 0) {
          // Deleting the character before the caret (delete "/")
          textNode.deleteData(caretPosition - 1, 1);
        }
      }
      range.deleteContents();
      range.insertNode(tagElement);

      // Move caret after the tag
      range.setStartAfter(tagElement);
      range.setEndAfter(tagElement);
      selection.removeAllRanges();
      selection.addRange(range);
      toggleDropdown(false);
      editor.focus();
      let content = editor.innerHTML;
      content = this.cleanHtml(content);
      if (this.settings.onChange) this.settings.onChange(content);
    };

    // Handle editor input
    editor.addEventListener('input', () => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const textBeforeCaret = range.startContainer.textContent.slice(0, range.startOffset);
      if (textBeforeCaret.endsWith('/')) {
        toggleDropdown(true);
      } else {
        toggleDropdown(false);
      }
    });
    let debounceTimeout;
    editor.addEventListener('keyup', e => {
      // Ignore modifier keys
      const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta'];
      if (ignoredKeys.includes(e.key)) return;
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        let content = editor.innerHTML;
        content = this.cleanHtml(content);
        // const isHidden = dropdown.getAttribute('aria-hidden') === 'true';
        const isHidden = this.dropdownHidden;
        if (isHidden) {
          if (this.settings.onChange) this.settings.onChange(content);
        }
      }, 600);
    });

    // Separate paste event handler to capture CMD/CTRL+V correctly
    editor.addEventListener('paste', () => {
      // Delay to allow paste content to be inserted
      setTimeout(() => {
        let content = editor.innerHTML;
        content = this.cleanHtml(content);
        const isHidden = dropdown.getAttribute('aria-hidden') === 'true';
        if (isHidden && this.settings.onChange) {
          this.settings.onChange(content);
        }
      }, 0);
    });
    editor.addEventListener('paste', event => {
      event.preventDefault(); // Prevent the default paste behavior

      // Get plain text content from the clipboard
      const text = event.clipboardData.getData('text/plain');

      // Use execCommand to insert plain text if preferred (fallback for older browsers)
      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text);
      } else {
        // Fallback: manually insert the plain text at caret
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(text);
        range.deleteContents();
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
    editor.addEventListener('keydown', event => {
      this.dropdownHidden = dropdown.getAttribute('aria-hidden') === 'true';

      // Disable text formatting shortcuts (CMD/CTRL+B, CMD/CTRL+I)
      if ((event.metaKey || event.ctrlKey) && (event.key === 'b' || event.key === 'i' || event.key === 'u')) {
        event.preventDefault(); // Prevent default behavior (e.g., bold, italic, underline)
      }
    });

    // Handle editor keydown
    editor.addEventListener('keydown', event => {
      if (event.key === 'Escape' && isDropdownVisible) {
        toggleDropdown(false);
        event.preventDefault();
      }
    });

    // Handle dropdown key navigation
    dropdown.addEventListener('keydown', event => {
      // const currentIndex = dropdownButtons.indexOf(document.activeElement);
      if (event.key === 'ArrowDown') ; else if (event.key === 'ArrowUp') ; else if (event.key === 'Enter' || event.key === ' ') {
        document.activeElement.click();
        event.preventDefault();
      } else if (event.key === 'Escape') {
        toggleDropdown(false);
        event.preventDefault();
      }
      if (event.metaKey || event.ctrlKey) {
        // Also close on CMD/CTRL key
        toggleDropdown(false);
        event.preventDefault();
      }
    });

    // Function to check if content is empty (ignoring invisible <br> and whitespace)
    function isEditorEmpty() {
      return editor.innerText.trim() === '';
    }

    // Add event listener to handle content change
    editor.addEventListener('input', () => {
      togglePlaceholder();
    });

    // Toggle the visibility of the placeholder
    function togglePlaceholder() {
      if (isEditorEmpty()) {
        placeholder.classList.remove('hidden');
      } else {
        placeholder.classList.add('hidden');
      }
    }

    // Initial check for placeholder visibility
    togglePlaceholder();
  }
}

class ImageMask {
  constructor(element, settings = {}) {
    const defaults = {
      lang: []
      // name: ''
    };
    this.settings = Object.assign({}, defaults, settings);
    this.empty = true;
    this.element = element;
    this.init();
  }
  loadUrl(url) {
    const img = this.element.querySelector('img');
    img.src = url;
    this.loaded();
  }
  loadImage(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = this.element.querySelector('img');
        img.setAttribute('src', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  setImage(src) {
    if (src) {
      const img = this.element.querySelector('img');
      img.src = src;
    }
  }
  clearImage() {
    // const imageMaskContainer = this.element.querySelector('.imagemask-container');
    // imageMaskContainer.style.display = '';
    // const controls = this.element.querySelector('.imagemask-controls');
    // controls.style.display = '';
    this.element.style.display = '';
  }
  out(s) {
    let val = this.settings.lang[s];
    if (val) return val;else {
      return s;
    }
  }
  init() {
    const wrapper = this.element;
    wrapper.className = 'imagemask-wrapper';
    const overlay = document.createElement('div');
    overlay.className = 'imagemask-overlay';
    wrapper.appendChild(overlay);
    const btnClose = document.createElement('button');
    btnClose.className = 'btn-close-imagemask';
    btnClose.title = this.out('Close');
    btnClose.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"  
        stroke-linejoin="round" class="icon-close">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
        </svg>`;
    wrapper.appendChild(btnClose);
    const bodyContent = document.createElement('div');
    bodyContent.className = 'imagemask-body';
    wrapper.appendChild(bodyContent);
    const imageMaskContainer = document.createElement('div');
    imageMaskContainer.className = 'imagemask-container';
    bodyContent.appendChild(imageMaskContainer);
    const controls = document.createElement('div');
    controls.className = 'imagemask-controls';
    bodyContent.appendChild(controls);
    const label = document.createElement('label');
    controls.appendChild(label);
    label.innerHTML = `${this.out('Brush Size')}: 
            <input type="range" class="brush-size" min="5" max="100" value="30">`;
    const brushSizeInput = label.querySelector('.brush-size');
    const btnUndo = document.createElement('button');
    btnUndo.className = 'btn-undobrush';
    btnUndo.title = this.out('Undo');
    btnUndo.innerHTML = `
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
        class="icon-undo">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 14l-4 -4l4 -4"></path>
                <path d="M5 10h11a4 4 0 1 1 0 8h-1"></path>
        </svg>`;
    controls.appendChild(btnUndo);
    const btnRedo = document.createElement('button');
    btnRedo.className = 'btn-redobrush';
    btnRedo.title = this.out('Redo');
    btnRedo.innerHTML = `
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
        class="icon-redo">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15 14l4 -4l-4 -4"></path>
            <path d="M19 10h-11a4 4 0 1 0 0 8h1"></path>
        </svg>`;
    controls.appendChild(btnRedo);
    const btnClear = document.createElement('button');
    btnClear.className = 'btn-clearbrush';
    btnClear.title = this.out('Clear');
    btnClear.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" 
        class="icon-eraser">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" />
            <path d="M18 13.3l-6.3 -6.3" /><
        /svg>`;
    controls.appendChild(btnClear);
    const btnEnlarge = document.createElement('button');
    btnEnlarge.className = 'btn-enlargemask';
    btnClear.title = this.out('Enlarge');
    btnEnlarge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  
        fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" 
        class="icon-maximize">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M16 4l4 0l0 4" /><path d="M14 10l6 -6" />
            <path d="M8 20l-4 0l0 -4" /><path d="M4 20l6 -6" />
            <path d="M16 20l4 0l0 -4" /><path d="M14 14l6 6" />
            <path d="M8 4l-4 0l0 4" /><path d="M4 4l6 6" />
        </svg>`;
    controls.appendChild(btnEnlarge);
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = this.settings.name;
    input.className = 'inp-imagemask';
    input.value = '';
    bodyContent.appendChild(input);

    // ---

    const canvas = document.createElement('canvas');
    canvas.className = 'imagemask';
    const ctx = canvas.getContext('2d', {
      willReadFrequently: true
    });

    // Create the second canvas with actual size (not visible)
    const duplicateCanvas = document.createElement('canvas');
    const dupCtx = duplicateCanvas.getContext('2d', {
      willReadFrequently: true
    });
    const inpImageMask = this.element.querySelector('.inp-imagemask');

    // --- Output with black fill ---
    const createOutput = inputCanvas => {
      const outputCanvas = document.createElement('canvas');
      const outputCtx = outputCanvas.getContext('2d', {
        willReadFrequently: true
      });
      outputCanvas.width = inputCanvas.width;
      outputCanvas.height = inputCanvas.height;
      outputCtx.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
      outputCtx.fillStyle = 'black';
      outputCtx.fillRect(0, 0, inputCanvas.width, inputCanvas.height);

      // Draw inputCanvas onto outputCanvas
      outputCtx.drawImage(inputCanvas, 0, 0);
      const base64Data = outputCanvas.toDataURL('image/png');
      let outputImage = document.querySelector('.imagemask-output');
      if (!outputImage) {
        outputImage = document.createElement('img');
        outputImage.className = 'imagemask-output';
        document.body.appendChild(outputImage);
      }
      outputImage.src = base64Data;
      if (!this.empty) {
        inpImageMask.value = base64Data;
      }
      // console.log(inpImageMask.value);
      // return base64Data;
    };

    // --- Undo Redo ---
    let undoStack = [];
    let redoStack = [];
    const saveState = () => {
      undoStack.push(duplicateCanvas.toDataURL());
      if (undoStack.length > 10) undoStack.shift(); // Limit stack size for memory efficiency
      redoStack = []; // Clear redo stack on new action
    };
    const restoreState = state => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        dupCtx.clearRect(0, 0, duplicateCanvas.width, duplicateCanvas.height);
        dupCtx.drawImage(img, 0, 0, duplicateCanvas.width, duplicateCanvas.height);
        createOutput(duplicateCanvas);
      };
    };
    canvas.addEventListener('mousedown', () => {
      saveState();
    });
    btnUndo.addEventListener('click', e => {
      e.preventDefault();
      if (undoStack.length > 0) {
        redoStack.push(canvas.toDataURL());
        restoreState(undoStack.pop());
      }
    });
    btnRedo.addEventListener('click', e => {
      e.preventDefault();
      if (redoStack.length > 0) {
        undoStack.push(canvas.toDataURL());
        restoreState(redoStack.pop());
      }
    });
    // --- /Undo Redo ---

    const img = document.createElement('img');
    imageMaskContainer.appendChild(img); // image added first, then canvas as overlay
    imageMaskContainer.appendChild(canvas);
    this.loaded = () => {
      imageMaskContainer.style.display = 'flex';
      const controls = document.querySelector('.imagemask-controls');
      controls.style.display = 'flex';
      wrapper.style.display = 'flex';
      scaleCanvas();

      // Clear canvas and stacks (see btnClear click)
      undoStack = [];
      redoStack = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dupCtx.clearRect(0, 0, duplicateCanvas.width, duplicateCanvas.height);
      this.empty = true;
      inpImageMask.value = '';
      try {
        createOutput(duplicateCanvas);
      } catch (e) {
        // Do Nothing
      }
    };
    img.onload = () => {
      this.loaded();
    };
    let savedImageData = null;
    let savedImageData2 = null;
    const scaleCanvas = () => {
      // Save the current content of the canvas as raw pixel data
      if (canvas.width > 0 && canvas.height > 0) {
        savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        savedImageData2 = dupCtx.getImageData(0, 0, duplicateCanvas.width, duplicateCanvas.height);
      }
      const w = img.offsetWidth;
      const h = img.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // second canvas
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;
      duplicateCanvas.width = naturalW * dpr; // Ensure the duplicate canvas matches the original
      duplicateCanvas.height = naturalH * dpr;

      // dupCtx.fillStyle = 'black';
      // dupCtx.fillRect(0, 0, naturalW, naturalH);
      dupCtx.scale(dpr, dpr); // Scale for duplicated canvas
      duplicateCanvas.style.width = `${naturalW}px`;
      duplicateCanvas.style.height = `${naturalH}px`;

      // Redraw saved content proportionally on the resized canvas
      if (savedImageData) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = savedImageData.width;
        tempCanvas.height = savedImageData.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(savedImageData, 0, 0);
        const tempCanvas2 = document.createElement('canvas');
        tempCanvas2.width = savedImageData2.width;
        tempCanvas2.height = savedImageData2.height;
        const tempCtx2 = tempCanvas2.getContext('2d');
        tempCtx2.putImageData(savedImageData2, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0, savedImageData.width, savedImageData.height, 0, 0, canvas.width, canvas.height);
        dupCtx.drawImage(tempCanvas2, 0, 0, savedImageData2.width, savedImageData2.height, 0, 0, duplicateCanvas.width, duplicateCanvas.height);
      }
    };
    let drawing = false;
    let brushSize = parseInt(brushSizeInput.value, 10);
    brushSizeInput.addEventListener('input', e => {
      brushSize = parseInt(e.target.value, 10);
    });
    const getCoordinates = e => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches) {
        const touch = e.touches[0];
        return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    const startDrawing = e => {
      drawing = true;
      draw(e);
    };
    const stopDrawing = () => {
      drawing = false;
      ctx.beginPath(); // Reset path

      this.empty = false;
      createOutput(duplicateCanvas);
    };
    const draw = e => {
      if (!drawing) return;
      const {
        x,
        y
      } = getCoordinates(e);

      // Calculate the scaling factor between the small and large canvas
      const scaleX = duplicateCanvas.width / canvas.width;
      const scaleY = duplicateCanvas.height / canvas.height;

      // Scale the coordinates accordingly
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;

      // Drawing on the smaller canvas (ctx)
      ctx.fillStyle = 'rgb(255, 255, 255)'; // Mask color
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Drawing on the scaled canvas (dupCtx)
      dupCtx.fillStyle = 'rgb(255, 255, 255)'; // Mask color
      dupCtx.beginPath();
      dupCtx.arc(scaledX, scaledY, brushSize / 2 * scaleX, 0, Math.PI * 2);
      dupCtx.fill();
    };
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', e => {
      startDrawing(e);
      e.preventDefault();
    }, {
      passive: false
    });
    canvas.addEventListener('touchend', e => {
      stopDrawing();
      e.preventDefault();
    });
    canvas.addEventListener('touchmove', e => {
      draw(e);
      e.preventDefault();
    }, {
      passive: false
    });
    btnClear.addEventListener('click', e => {
      e.preventDefault();
      saveState();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dupCtx.clearRect(0, 0, duplicateCanvas.width, duplicateCanvas.height);
      this.empty = true;
      inpImageMask.value = '';
      createOutput(duplicateCanvas);
    });
    window.addEventListener('resize', scaleCanvas);

    // Enlarge

    const toggleFullscreen = enable => {
      if (enable) {
        wrapper.setAttribute('aria-modal', 'true');
        wrapper.setAttribute('role', 'dialog');
        wrapper.classList.add('fullscreen');
        overlay.style.display = 'block';
        btnClose.style.display = 'flex';
        btnEnlarge.style.display = 'none';
      } else {
        wrapper.removeAttribute('aria-modal');
        wrapper.removeAttribute('role');
        wrapper.classList.remove('fullscreen');
        overlay.style.display = 'none';
        btnClose.style.display = 'none';
        btnEnlarge.style.display = '';
      }
      scaleCanvas();
    };
    btnEnlarge.addEventListener('click', e => {
      e.preventDefault();
      toggleFullscreen(true);
    });
    btnClose.addEventListener('click', e => {
      e.preventDefault();
      toggleFullscreen(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        toggleFullscreen(false);
      }
    });
  }
}

class FormBuilderAI {
  constructor(settings = {}) {
    const defaults = {
      lang: [],
      headers: {},
      fieldTypes: ['short-text', 'long-text', 'number', 'slider', 'switch', 'select', 'multi-select', 'dropdown', 'file', 'multifile', 'date', 'datetime', 'time', 'phone', 'email', 'url', 'color', 'hidden', 'spacer', 'heading', 'paragraph',
      // 'media',
      'image', 'video', 'audio', 'separator'
      // 'html',
      ],
      useImageMask: true,
      // onChange: (formData)=>{},
      fileUploadText: 'Drag and drop your file here.',
      multiFileUploadText: 'Drag and drop your files here.',
      // formSubmitTestUrl: 'http://localhost:8083/complete', // for form testing purpose (optional)
      model: 'gpt-4o-mini',
      model2: 'gpt-4o-mini',
      language: 'English',
      languageSelection: true,
      sendCommandUrl: '/sendcommand',
      // builderSelector: '.builder',
      // previewSelector: '.preview',
      // designerSelector: '.designer',
      // settingsSelector: '.settings',
      // workflowSelector: '.workflow',
      // templatesSelector: '.templates',
      // onThemeChange: (themeData)=>{},
      consoleLog: false,
      saveResults: false,
      demo: false,
      disableMediaGeneration: false,
      disableMediaGenerationTitle: 'Demo Info',
      disableMediaGenerationMessage: 'This is an online demo and media generation is currently disabled. Get the full version for complete functionality.',
      //'AI media generation is currently disabled, so your request cannot be processed.',
      colors: ['#ff9f01', '#f57c00', '#e64918', '#d32f2f', '#5d4038', '#37474f', '#353535', '#fbc02c', '#b0b42a', '#689f39', '#c21f5b', '#7b21a2', '#522da8', '#616161', '#01b8c9', '#009688', '#388d3c', '#0388d0', '#1465c0', '#2f3f9e', '#9e9e9e'],
      useSubmitButton: true,
      // Makes the returned json has this 'useSubmitButton' property
      submitText: 'Submit',
      resetText: 'Reset',
      isBuilder: true,
      // sendCommandStreamUrl: '/getstream',
      // assistantUrl: '/assistant_command',
      // assistantStreamUrl: '/assistant_stream',
      // searchUrl: '',
      // scrapeUrl: '',

      scrapeLimit: 3,
      scrapeExclude: ['youtube.com', 'reddit.com', 'microsoft.com', 'mozilla.org'],
      // Domains to exclude

      inputCost: 0.15,
      // gpt-4o-mini (per million token)
      outputCost: 0.6,
      _2dIllustrationStyleId: 'bcaa0104-98ef-4cb8-a012-124dad015756',
      // templatesUrl: '/templates.json',
      templateFilters: ['all', 'image', 'video', 'audio', 'text'],
      // 'web', 
      templatesConfig: {
        fal: true,
        openai: true,
        replicate: false,
        web: false
      },
      // templateButtons: {
      //     viewButton: {
      //         text: 'View'
      //     },
      //     useButton:  {
      //         text: 'Clone'
      //     },
      // },

      defaultMediaGenerationProvider: 'fal',
      mediaGenerationProviders: [{
        name: 'Fal',
        value: 'fal'
      }, {
        name: 'OpenAI',
        value: 'openai'
      }
      // {
      //     name: 'Google', // Google Gemini Flash (experimental)
      //     value: 'google'
      // },
      // {
      //     name: 'Replicate',
      //     value: 'replicate'
      // }
      ],
      defaultTextGenerationProvider: 'openai',
      // generationModels: []
      generationModels_OpenAI: [{
        model: 'gpt-4o-mini',
        name: 'GPT-4o-mini'
      }, {
        model: 'gpt-4o',
        name: 'GPT-4o'
      }, {
        model: 'gpt-4.1-nano',
        name: 'GPT-4.1-nano'
      }, {
        model: 'gpt-4.1-mini',
        name: 'GPT-4.1-mini'
      }, {
        model: 'gpt-4.1',
        name: 'GPT-4.1'
      }],
      generationModels_OpenRouter: [{
        model: 'openai/gpt-4o-mini',
        name: 'OpenAI: GPT-4o-mini'
      }, {
        model: 'openai/gpt-4o-2024-11-20',
        name: 'OpenAI: GPT-4o'
      }, {
        model: 'anthropic/claude-3.7-sonnet',
        name: 'Anthropic: Claude 3.7 Sonnet'
      }, {
        model: 'anthropic/claude-3.5-sonnet',
        name: 'Anthropic: Claude 3.5 Sonnet'
      }, {
        model: 'anthropic/claude-3.5-haiku',
        name: 'Anthropic: Claude 3.5 Haiku'
      }, {
        model: 'google/gemini-2.0-flash-lite-001',
        name: 'Google: Gemini 2.0 Flash Lite'
      }, {
        model: 'google/gemini-2.0-flash-001',
        name: 'Google: Gemini 2.0 Flash'
      }, {
        model: 'qwen/qwen-2.5-72b-instruct',
        name: 'Qwen2.5 72B Instruct'
      }, {
        model: 'deepseek/deepseek-r1',
        name: 'DeepSeek: R1'
      }, {
        model: 'meta-llama/llama-4-maverick',
        name: 'Meta: Llama 4 Maverick'
      }, {
        model: 'meta-llama/llama-4-scout',
        name: 'Meta: Llama 4 Scout'
      }, {
        model: 'meta-llama/llama-3.3-70b-instruct',
        name: 'Meta: Llama 3.3 70B Instruct'
      }],
      searchToggle: false,
      // to show Search toggle button (if searching or scraping feature is used)
      // to enable or disable search and scrape feature, use searchUrl & scrapeUrl (if set, it's enabled)
      imageToggle: true,
      videoToggle: false,
      audioToggle: false,
      replicateEndpoint1: 'https://api.replicate.com/v1/predictions',
      // use with version
      replicateEndpoint2: 'https://api.replicate.com/v1/models/{MODEL}/predictions',
      // These configuration only used if the server is using API request (without SDK)
      // A validation to check if endpoint config starts with 'https://queue.fal.run' is needed on the server side.
      falStatusEndpoint: 'https://queue.fal.run/{MODEL}/requests/{REQUEST_ID}/status',
      falResultEndpoint: 'https://queue.fal.run/{MODEL}/requests/{REQUEST_ID}',
      replicateStatusEndpoint: 'https://api.replicate.com/v1/predictions/{REQUEST_ID}',
      /*
      falStatusEndpointList: [
          {
              model: 'fal-ai/flux',
              endpoint: 'https://queue.fal.run/fal-ai/flux/requests/{REQUEST_ID}/status'
          },
          {
              model: 'fal-ai/kokoro',
              endpoint: 'https://queue.fal.run/fal-ai/kokoro/requests/{REQUEST_ID}'
          },
          {
              model: 'fal-ai/kling-video',
              endpoint: 'https://queue.fal.run/fal-ai/kling-video/requests/{REQUEST_ID}/status'
          },
          {
              model: '*',
              endpoint: 'https://queue.fal.run/{MODEL}/requests/{REQUEST_ID}/status'
          }
      ],
      falResultEndpointList: [
          {
              model: 'fal-ai/flux',
              endpoint: 'https://queue.fal.run/fal-ai/flux/requests/{REQUEST_ID}'
          },
          {
              model: 'fal-ai/kling-video',
              endpoint: 'https://queue.fal.run/fal-ai/kling-video/requests/{REQUEST_ID}'
          },
          {
              model: 'fal-ai/kokoro',
              endpoint: 'https://queue.fal.run/fal-ai/kokoro/requests/{REQUEST_ID}'
          },
          {
              model: '*',
              endpoint: 'https://queue.fal.run/{MODEL}/requests/{REQUEST_ID}'
          }
      ],
      */
      modelFallback: false,
      defaultModels: {
        image_generation: {
          openai: ['gpt-image-1']
        },
        // image_variation_generation: {
        //     openai: [
        //         'gpt-image-1'
        //     ]
        // },
        text_to_image_generation: {
          fal: ['fal-ai/flux-1/schnell', 'fal-ai/flux-1/dev', 'fal-ai/flux-pro/v1.1', 'fal-ai/flux-pro/v1.1-ultra', 'fal-ai/recraft-v3', 'fal-ai/recraft-20b', 'fal-ai/ideogram/v2a', 'fal-ai/hidream-i1-fast', 'fal-ai/hidream-i1-dev', 'fal-ai/hidream-i1-full', 'fal-ai/gemini-flash-edit/multi'],
          replicate: ['black-forest-labs/flux-schnell', 'black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra', 'recraft-ai/recraft-v3', 'ideogram-ai/ideogram-v2a'],
          google: ['gemini-2.0-flash-exp-image-generation'],
          openai: ['gpt-image-1']
        },
        image_to_video_generation: {
          fal: ['fal-ai/kling-video/v1.6/standard/image-to-video', 'fal-ai/kling-video/v1.6/pro/image-to-video', 'fal-ai/kling-video/v2.1/standard/image-to-video', 'fal-ai/kling-video/v2.1/pro/image-to-video', 'fal-ai/kling-video/v2.1/master/image-to-video', 'fal-ai/minimax/video-01-live/image-to-video', 'fal-ai/luma-dream-machine/ray-2/image-to-video'],
          replicate: ['kwaivgi/kling-v1.6-standard', 'kwaivgi/kling-v1.6-pro', 'minimax/video-01-live', 'luma/ray']
        },
        text_to_video_generation: {
          fal: ['fal-ai/kling-video/v1.6/standard/text-to-video', 'fal-ai/kling-video/v2.1/master/text-to-video', 'fal-ai/minimax/video-01-live ', 'fal-ai/luma-dream-machine/ray-2'],
          replicate: ['kwaivgi/kling-v1.6-standard', 'minimax/video-01', 'luma/ray']
        },
        upscale_image: {
          fal: ['fal-ai/clarity-upscaler'],
          replicate: ['recraft-ai/recraft-crisp-upscale']
        },
        describe_image: {
          fal: ['fal-ai/any-llm/vision'],
          replicate: [
            // 'daanelson/minigpt-4:e447a8583cffd86ce3b93f9c2cd24f2eae603d99ace6afa94b33a08e94a3cd06'
            // 'lucataco/moondream2:72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31'
            // 'yorickvp/llava-v1.6-vicuna-13b:0603dec596080fa084e26f0ae6d605fc5788ed2b1a0358cd25010619487eae63'

            // 'yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb' // note
          ]
        },
        edit_area_in_image: {
          fal: ['fal-ai/flux-pro/v1/fill'
          // 'fal-ai/flux-lora-fill',
          // 'fal-ai/ideogram/v2/edit',
          ],
          replicate: ['black-forest-labs/flux-fill-pro'
          // 'black-forest-labs/flux-fill-dev',
          ],
          google: ['gemini-2.0-flash-exp-image-generation'],
          openai: ['gpt-image-1']
        },
        edit_image: {
          // will be used if no selection mask (see media.js)
          fal: ['fal-ai/gemini-flash-edit'],
          replicate: [
            // not available
          ],
          openai: ['gpt-image-1']
        },
        text_to_2d_illustration_generation: {
          fal: ['fal-ai/recraft-v3'],
          replicate: [
            // not available
          ]
        },
        text_to_digital_illustration_generation: {
          fal: ['fal-ai/recraft-v3'],
          replicate: ['recraft-ai/recraft-v3']
        },
        text_to_book_cover_generation: {
          fal: ['fal-ai/recraft-v3'],
          replicate: [
            // not available
          ]
        },
        text_to_speech: {
          fal: ['fal-ai/elevenlabs/tts/multilingual-v2'
          // 'fal-ai/kokoro/american-english'
          ],
          replicate: ['jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13']
        }
      },
      ttsMaxCharacters: 3000,
      // characters

      // Default image, video and audio for element
      exampleImageUrl: 'formfiles/ai-V8Khk.jpg',
      exampleVideoUrl: 'formfiles/ai-thhyR.mp4',
      exampleAudioUrl: 'formfiles/ai-3EVMb.wav',
      alwaysVisibleSubmit: true
    };
    this.settings = Object.assign({}, defaults, settings);
    if (this.settings.defaultTextGenerationProvider === 'openai') {
      this.settings.generationModels = this.settings.generationModels_OpenAI;
    } else if (this.settings.defaultTextGenerationProvider === 'openrouter') {
      this.settings.generationModels = this.settings.generationModels_OpenRouter;
    }
    let builderStuff = document.querySelector('#_fbhtml'); // All editing controls will be placed within <div id="_cbhtml">...</div>
    if (!builderStuff) {
      builderStuff = document.createElement('div');
      builderStuff.id = '_fbhtml';
      // builderStuff.style.visibility = 'hidden';
      builderStuff.style.cssText = 'height:0px;float:left;margin-top:-100px;';
      builderStuff.className = 'fb-ui';
      document.body.appendChild(builderStuff);
      builderStuff = document.querySelector('#_fbhtml');
    }
    this.builderStuff = builderStuff;
    this.listeners = {};
    if (window._txt) {
      // if language file is included
      this.settings.lang = window._txt;
    }
    this.steps = [];

    // Extend the onChange function
    let oldOnChange = this.settings.onChange;
    this.settings.onChange = json => {
      // Call the original onChange function if it exists
      if (oldOnChange) {
        oldOnChange.call(this, json);
      }

      // Perform additional logic in view
      this.view(json);
    };

    /*
    // Extend the onInputChange function
    let oldOnInputChange = this.settings.onInputChange;
     this.settings.onInputChange = (json) => {
        // Call the original onChange function if it exists
        if (oldOnInputChange) {
            oldOnInputChange.call(this, json);
        }
         // Perform additional tasks
    };
    */

    // Media
    this.media = new Media({
      lang: this.settings.lang
    }, this);

    // Upload
    this.upload = new Upload({
      lang: this.settings.lang
    }, this);

    // Color Picker
    this.colorPicker = new ColorPicker({
      lang: this.settings.lang,
      colors: this.settings.colors
    }, this);

    // this.element = this.settings.builderElement;
    if (this.settings.builderSelector) this.element = document.querySelector(this.settings.builderSelector);
    // if(this.element) this.element.classList.add('fb-ui');
    this.popupVisible = false;
    this.filesUploaded = {};
  } //constructor

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event].add(callback);
    return this; // Enable chaining
  }
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].delete(callback);
    }
  }
  trigger(eventName, data) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(callback => callback(data));
    }
  }
  renderRadio({
    parentNode,
    name,
    className,
    value,
    text,
    checked = false
  }) {
    const div = document.createElement('label');
    // div.setAttribute('for', `${id}_${index}`);
    div.className = `option-label ${className}`;
    parentNode.appendChild(div);
    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'peer';
    // input.id = `${id}_${index}`;
    input.name = name;
    input.value = value;
    if (checked) {
      input.checked = true;
      input.setAttribute('selected', 'selected');
    } else {
      input.checked = false;
      input.removeAttribute('selected');
    }
    div.appendChild(input);
    const peerSpan = document.createElement('span');
    peerSpan.className = 'peer-span-rounded';
    div.appendChild(peerSpan);
    const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"></path></svg>';
    peerSpan.innerHTML = checkIcon;
    const span = document.createElement('span');
    span.innerText = text;
    div.appendChild(span);
    input.addEventListener('click', () => {
      const jsonText = this.get();
      if (this.settings.onChange) this.settings.onChange(jsonText);
      this.trigger('change', jsonText);
    });
  }
  renderCheckbox({
    parentNode,
    name,
    className,
    value,
    text
  }) {
    if (!parentNode) return;
    if (!text) return;
    let id = this.getId();
    const div = document.createElement('label');
    div.setAttribute('for', `${id}`);
    div.className = 'input-checkbox';
    parentNode.appendChild(div);
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'peer';
    if (className) {
      input.classList.add(className);
    }
    input.id = `${id}`;
    if (name) input.name = name;
    if (value) input.value = value;
    div.appendChild(input);
    const peerSpan = document.createElement('span');
    peerSpan.className = 'peer-span-square';
    div.appendChild(peerSpan);
    const checkIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="4"  stroke-linecap="round"  stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" />
        </svg>`;
    peerSpan.innerHTML = checkIcon;
    const span = document.createElement('span');
    span.innerText = this.out(text);
    div.appendChild(span);
    return input;
  }
  renderAttachFile({
    parentNode,
    id,
    name,
    text
  }) {
    if (!parentNode) return;
    if (!text) return;

    // let id = this.getId();

    // const label = document.createElement('label');
    // label.setAttribute('for', `file_${id}`);
    // label.className = 'field-label';
    // label.innerHTML = text;
    // parentNode.appendChild(label);

    const fileInputWrapper = document.createElement('div');
    fileInputWrapper.className = 'file-input-wrapper';
    fileInputWrapper.setAttribute('aria-label', this.out(this.settings.fileUploadText));
    parentNode.appendChild(fileInputWrapper);
    const fileInput = document.createElement('input');
    fileInput.id = id; //`file_${id}`;
    fileInput.type = 'file';
    fileInput.name = name;
    fileInput.className = 'peer';
    fileInputWrapper.appendChild(fileInput);
    const peerSpan = document.createElement('div');
    peerSpan.className = 'file-drop-area';
    fileInputWrapper.appendChild(peerSpan);
    const dragMessage = document.createElement('div');
    dragMessage.className = 'file-drop-info';
    // dragMessage.id = `drag_message_${id}`;
    dragMessage.innerText = this.out(this.settings.fileUploadText);
    fileInputWrapper.appendChild(dragMessage);
    const fileNameDisplay = document.createElement('div');
    fileNameDisplay.className = 'file-drop-info-highlight';
    // fileNameDisplay.id = `file_name_${id}`;
    fileInputWrapper.appendChild(fileNameDisplay);

    // Handle file selection via click
    fileInputWrapper.addEventListener('click', () => {
      fileInput.click();
      // fileInput.focus();
    });

    // Handle file selection via drag-and-drop
    fileInputWrapper.addEventListener('dragover', event => {
      event.preventDefault(); // makes droppable
      fileInputWrapper.classList.add('drag-over');
    });
    fileInputWrapper.addEventListener('dragleave', () => {
      fileInputWrapper.classList.remove('drag-over');
    });
    fileInputWrapper.addEventListener('drop', event => {
      event.preventDefault();
      fileInputWrapper.classList.remove('drag-over');
      const file = event.dataTransfer.files[0];
      if (file) {
        // Update the file input with the dropped file
        fileInput.files = event.dataTransfer.files;
        handleFile(file);
      }
    });

    // Handle file input selection
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      handleFile(file);
    });
    let selectedFileTypes = [{
      type: 'application/pdf',
      extensions: '.pdf'
    }, {
      type: 'application/json',
      extensions: '.json'
    }, {
      type: 'text/plain',
      extensions: '.txt'
    }, {
      type: 'text/csv',
      extensions: '.csv'
    }, {
      type: 'application/msword',
      extensions: '.doc'
    }, {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extensions: '.docx'
    }, {
      type: 'application/vnd.ms-excel',
      extensions: '.xls'
    }, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extensions: '.xlsx'
    }];
    const acceptTypes = selectedFileTypes.map(fileType => fileType.type).join(',');
    fileInput.setAttribute('accept', acceptTypes);
    const handleFile = async file => {
      if (file) {
        const isValidType = selectedFileTypes.some(fileType => {
          return fileType.type === file.type;
        });
        if (!isValidType) {
          alert(this.out('Invalid file type.'));
          return;
        }

        // Display file name and trigger onUpload event
        // fileNameDisplay.textContent = file.name;

        dragMessage.innerHTML = `
                <span class="loading-icon">
                    <svg class="animate-spin" style="margin: 0;width: 1rem;height: 1rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>`;

        // Trigger onUpload event (you can customize this function)
        // onUpload(file);

        const formData = new FormData();
        formData.append('assistantId', this.settings.assistantId);
        formData.append('file', file);
        formData.append('customData', this.settings.customData);
        let response = await fetch(this.settings.assistantFileUploadUrl, {
          method: 'POST',
          body: formData
        });
        let result = await response.json();
        if (!result.ok) {
          return;
        }
        await this.renderListFiles();
        fileNameDisplay.innerHTML = '';
        dragMessage.innerText = this.out(this.settings.fileUploadText);
      }
    };
  }
  async renderListFiles() {
    if (!this.settings.workflowSelector) {
      if (this.settings.consoleLog) console.log('workflowSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.workflowSelector);
    if (element) {
      let divList = element.querySelector('.knowledge-list');
      if (!divList) {
        divList = document.createElement('div');
        divList.className = 'knowledge-list';
        element.appendChild(divList);
      }
      let headers = {
        'Content-Type': 'application/json',
        ...this.settings.headers
      };
      let reqBody = {
        assistantId: this.settings.assistantId,
        customData: this.settings.customData
      };
      let response = await fetch(this.settings.assistantFilesUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(reqBody)
      });
      let result = await response.json();
      if (!result.ok) {
        return;
      }
      divList.innerHTML = '';
      result.data.forEach(item => {
        // item.file_id
        // item.status
        const divWrapper = document.createElement('div');
        divWrapper.className = 'knowledge-list-item';
        divList.appendChild(divWrapper);
        const div = document.createElement('div');
        div.innerText = item.filename;
        divWrapper.appendChild(div);
        const btnRemove = document.createElement('button');
        btnRemove.className = 'btn-delitem';
        btnRemove.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                `;
        divWrapper.appendChild(btnRemove);
        btnRemove.addEventListener('click', async () => {
          if (btnRemove.querySelector('.loading-icon')) return;
          btnRemove.innerHTML = `
                        <span class="loading-icon">
                            <svg class="animate-spin" style="margin: 0;width: 1rem;height: 1rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                    `;
          divWrapper.style.opacity = 0.5;
          let headers = {
            'Content-Type': 'application/json',
            ...this.settings.headers
          };
          let reqBody = {
            assistantId: this.settings.assistantId,
            fileId: item.file_id,
            customData: this.settings.customData
          };
          let response = await fetch(this.settings.assistantFileDeleteUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(reqBody)
          });
          let result = await response.json();
          if (!result.ok) {
            return;
          }
          divWrapper.remove();
        });
      });

      // Assistane List
      if (this.settings.showAssistantList) {
        let divAssistantList = element.querySelector('.assistant-list');
        if (!divAssistantList) {
          divAssistantList = document.createElement('div');
          divAssistantList.className = 'assistant-list';
          element.appendChild(divAssistantList);
        }
        headers = {
          'Content-Type': 'application/json',
          ...this.settings.headers
        };
        reqBody = {
          customData: this.settings.customData
        };
        response = await fetch('http://localhost:8083/assistant_list', {
          method: 'POST',
          headers,
          body: JSON.stringify(reqBody)
        });
        result = await response.json();
        if (!result.ok) {
          return;
        }
        divAssistantList.innerHTML = '';
        result.data.forEach(item => {
          const divWrapper = document.createElement('div');
          divWrapper.className = 'assistant-list-item';
          divAssistantList.appendChild(divWrapper);
          const div = document.createElement('div');
          div.innerText = item.id;
          if (item.id === this.settings.assistantId) {
            div.classList.add('active');
          }
          divWrapper.appendChild(div);
          const btnRemove = document.createElement('button');
          btnRemove.className = 'btn-delitem';
          btnRemove.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    `;

          // if(item.id !== this.settings.assistantId) {
          divWrapper.appendChild(btnRemove);
          // }

          btnRemove.addEventListener('click', async () => {
            if (btnRemove.querySelector('.loading-icon')) return;
            btnRemove.innerHTML = `
                            <span class="loading-icon">
                                <svg class="animate-spin" style="margin: 0;width: 1rem;height: 1rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        `;
            divWrapper.style.opacity = 0.5;
            let headers = {
              'Content-Type': 'application/json',
              ...this.settings.headers
            };
            let reqBody = {
              assistantId: item.id,
              customData: this.settings.customData
            };
            let response = await fetch('http://localhost:8083/assistant_delete', {
              method: 'POST',
              headers,
              body: JSON.stringify(reqBody)
            });
            let result = await response.json();
            if (!result.ok) {
              return;
            }
            divWrapper.remove();
            if (item.id === this.settings.assistantId) {
              localStorage.removeItem('assistandtid');
            }
          });
        });
      }
    }
  }
  initializeEventListeners(rootElement) {
    const btnAddField = rootElement.querySelector('.btn-addfield');
    const popup = document.querySelector('.popup-fields');
    const fieldsContainer = rootElement.querySelector('.fields-container');
    const btns = popup.querySelectorAll('.btn-selectfield');

    // form-title & form-desc (contentEditable)
    rootElement.querySelectorAll('[contentEditable="true"]').forEach(editableElement => {
      editableElement.addEventListener('paste', e => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        document.execCommand('insertText', false, text);
      });
    });
    let debounceTimeout;
    rootElement.querySelectorAll('[contentEditable="true"]').forEach(editableElement => {
      editableElement.addEventListener('keyup', event => {
        // Ignore key events that don't modify content
        const ignoredKeys = ['Control', 'Meta', 'Alt', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'CapsLock', 'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
        if (event.key && ignoredKeys.includes(event.key)) {
          return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey) {
          // Skip combinations like CMD+A, CTRL+A, etc.
          return;
        }
        // Trigger the input event
        const inputEvent = new Event('input', {
          bubbles: true,
          // Allow the event to bubble up the DOM
          cancelable: true // Allow the event to be cancelable
        });
        editableElement.dispatchEvent(inputEvent);
      });
      // Handle the input event
      editableElement.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
    });

    // Sorting
    new Sortable(fieldsContainer, {
      animation: 150,
      // Smooth animation
      handle: '.fb-handle',
      // Restrict drag action to the handle
      ghostClass: 'sortable-ghost',
      // Class for the dragged item
      chosenClass: 'sortable-chosen',
      // Class when the item is selected
      dragClass: 'sortable-drag',
      // Class for the item being dragged
      onEnd: () => {
        const jsonText = this.get();
        if (this.settings.onChange) this.settings.onChange(jsonText);
        this.trigger('change', jsonText);
      }
    });

    // Function to adjust popup position
    const adjustPopupPosition = () => {
      // Get 'Add Element' button position before popup display
      // to prevent innacuraccy because of scrollbar when popup is displayed
      const buttonRect = btnAddField.getBoundingClientRect();

      // Popup display
      popup.classList.remove('hidden');
      popup.classList.add('block');
      btnAddField.setAttribute('aria-expanded', 'true');
      popup.setAttribute('aria-hidden', 'false');
      this.popupVisible = true;
      popup.classList.remove('small');
      popup.classList.remove('smaller');
      popup.classList.remove('smallest');

      // Adjust position
      const popupHeight = popup.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      if (buttonRect.bottom + (popupHeight + 10) > viewportHeight && buttonRect.top - popupHeight >= 0) {
        // Show popup above the button
        popup.style.top = `${buttonRect.top - popupHeight + scrollY - 17}px`;
        popup.style.left = `${buttonRect.left}px`;
      } else if (buttonRect.bottom + (popupHeight + 10) <= viewportHeight) {
        // Show popup below the button
        popup.style.top = `${buttonRect.bottom + scrollY}px`;
        popup.style.left = `${buttonRect.left}px`;
      } else {
        // Show popup below the button
        popup.style.top = `${buttonRect.bottom + scrollY}px`;
        popup.style.left = `${buttonRect.left}px`;
        popup.classList.add('small');
        if (buttonRect.bottom + 245 > viewportHeight) {
          popup.classList.remove('small');
          popup.classList.remove('smallest');
          popup.classList.add('smaller');
        }
        if (buttonRect.bottom + 178 > viewportHeight) {
          popup.classList.remove('small');
          popup.classList.remove('smaller');
          popup.classList.add('smallest');
        }
      }
    };
    window.addEventListener('resize', () => {
      if (this.popupVisible) adjustPopupPosition();
    });

    // Add field popup
    const showPopup = () => {
      adjustPopupPosition();

      // Focus the first button in the popup for accessibility
      const firstButton = popup.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
    };
    const hidePopup = () => {
      popup.classList.remove('block');
      popup.classList.add('hidden');
      btnAddField.setAttribute('aria-expanded', 'false');
      popup.setAttribute('aria-hidden', 'true');
      this.popupVisible = false;
    };
    const togglePopup = () => {
      // if(this.popupVisible) {
      if (document.activeElement) document.activeElement.blur();
      // }
      this.popupVisible ? hidePopup() : showPopup();
    };
    const handleOutsideClick = event => {
      if (!popup.contains(event.target) && event.target !== btnAddField) {
        hidePopup();
      }
    };
    const handleKeyDown = event => {
      if (event.key === 'Escape' && this.popupVisible) {
        hidePopup();
      }
    };
    const handleFieldTypeClick = event => {
      const fieldType = event.target.closest('button').getAttribute('data-type');
      if (fieldType) {
        let name = this.getId(); // temporary name for newly added field
        addField(fieldType, name);
        const jsonText = this.get();
        if (this.settings.onChange) this.settings.onChange(jsonText);
        this.trigger('change', jsonText);
        hidePopup();
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    // Add field
    const addField = (type, name, title) => {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'field-item';
      fieldDiv.setAttribute('data-type', type);
      fieldDiv.setAttribute('data-name', '');
      let desc = '';
      let icon = '';
      let defaultTitle = this.out('Question..');
      switch (type) {
        case 'short-text':
          desc = this.out('Short Text');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mt-1">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 6l16 0" />
                        <path d="M4 12l10 0" />
                    </svg>
                `;
          break;
        case 'long-text':
          desc = this.out('Long Text');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                `;
          break;
        case 'number':
          desc = this.out('Number');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="size-5" style="transform:scale(0.8)">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                    </svg>
                `;
          break;
        case 'slider':
          desc = this.out('Slider');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M4 12l2 0" /><path d="M10 12l10 0" />
                    </svg>
                `;
          break;
        case 'select':
          desc = this.out('Select');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" />
                    </svg>
                `;
          break;
        case 'multi-select':
          desc = this.out('Multi Select');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path stroke="none" d="M0 0h24v24H0z" /><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /><path d="M11 14l2 2l4 -4" />
                    </svg>
                `;
          break;
        case 'switch':
          desc = this.out('Switch');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M2 6m0 6a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6z" />
                    </svg>
                `;
          break;
        case 'date':
          desc = this.out('Date');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.1"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5" style="transform:scale(1.04)">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" />
                    </svg>
                `;
          defaultTitle = this.out('Date');
          break;
        case 'time':
          desc = this.out('Time');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 1a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" /><path d="M12 7v5l3 3" /><path d="M4 12h1" /><path d="M19 12h1" /><path d="M12 19v1" />
                    </svg>
                `;
          defaultTitle = this.out('Time');
          break;
        case 'datetime':
          desc = this.out('Datetime');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.1"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5" style="transform:scale(1.04)">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" /><path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M15 3v4" /><path d="M7 3v4" /><path d="M3 11h16" /><path d="M18 16.496v1.504l1 1" />
                    </svg>
                `;
          defaultTitle = this.out('Date & Time');
          break;
        case 'color2':
          desc = this.out('Color');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-9 1.732a8 8 0 0 0 4.001 14.928l-.001 -16a8 8 0 0 0 -4 1.072" />
                    </svg>
                `;
          defaultTitle = this.out('Color');
          break;
        case 'color':
          desc = this.out('Color');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" /><path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    </svg>
                `;
          defaultTitle = this.out('Color');
          break;
        case 'file':
          desc = this.out('Upload');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5" style="transform:scale(0.9)">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>
                `;
          defaultTitle = this.out('Attach File');
          break;
        case 'multifile':
          desc = this.out('Multi Upload');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5" style="transform:scale(0.9)">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>
                `;
          defaultTitle = this.out('Attach File');
          break;
        case 'dropdown':
          desc = this.out('Dropdown');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                    </svg>
                `;
          break;
        case 'email':
          desc = this.out('Email');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                `;
          defaultTitle = this.out('Email');
          break;
        case 'phone':
          desc = this.out('Phone');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                `;
          defaultTitle = this.out('Phone');
          break;
        case 'url':
          desc = this.out('URL');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                `;
          defaultTitle = this.out('URL');
          break;
        case 'hidden':
          desc = this.out('Hidden');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                    </svg>
                `;
          break;
        case 'spacer':
          desc = this.out('Spacer');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                    </svg>
                `;
          break;
        case 'separator':
          desc = this.out('Separator');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 12h16" />
                    </svg>
                `;
          break;
        case 'heading':
          desc = this.out('Heading');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 12h10" /><path d="M7 5v14" /><path d="M17 5v14" /><path d="M15 19h4" /><path d="M15 5h4" /><path d="M5 19h4" /><path d="M5 5h4" />
                    </svg>
                `;
          break;
        case 'paragraph':
          desc = this.out('Paragraph');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 4v16" /><path d="M17 4v16" /><path d="M19 4h-9.5a4.5 4.5 0 0 0 0 9h3.5" />
                    </svg>
                `;
          break;
        case 'media':
          desc = this.out('Media');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
                    </svg>
                `;
          break;
        case 'image':
          desc = this.out('Image');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
                    </svg>
                `;
          break;
        case 'video':
          desc = this.out('Video');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.4"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M8 4l0 16" /><path d="M16 4l0 16" /><path d="M4 8l4 0" /><path d="M4 16l4 0" /><path d="M4 12l16 0" /><path d="M16 8l4 0" /><path d="M16 16l4 0" />
                    </svg>
                `;
          break;
        case 'audio':
          desc = this.out('Audio');
          icon = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="size-5 mb-1 mt-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"></path>
                    </svg>
                `;
          break;
        case 'html':
          desc = this.out('HTML');
          icon = `
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 16v-8l2 5l2 -5v8" /><path d="M1 16v-8" /><path d="M5 8v8" /><path d="M1 12h4" /><path d="M7 8h4" /><path d="M9 8v8" /><path d="M20 8v8h3" />
                    </svg>
                `;
          break;
      }
      const fieldTitle = title || defaultTitle;

      /* if(type==='switch') {
           fieldDiv.innerHTML = `
              <div class="relative flex justify-between w-full">
                   <span class="div-field-label">${desc}</span>
                   <div class="div-field-title flex items-center gap-4">
                      ${icon}
                      <span class="inp-field-title" contentEditable="true">${fieldTitle}</span>
                  </div>
                   <div class="flex items-center gap-2">
                      <button class="btn-delfield" aria-label="${this.out('Delete field')}">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                      </button>
                      <div class="fb-handle">
                          <svg class="size-4 text-[#aaa]" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                          </svg>
                      </div>
                  </div>
              </div>
          `;
      } else */
      if (type === 'spacer' || type === 'separator' || type === 'html' || type === 'media' || type === 'image' || type === 'video' || type === 'audio') {
        fieldDiv.innerHTML = `
                    <div class="relative flex justify-between items-center w-full">

                        <span class="div-field-label">${desc}</span>

                        <div class="div-field-title flex items-center gap-4">
                            ${icon}
                            <span class="span-field-title">${desc}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <button class="btn-toggle-settings" aria-label="${this.out('Toggle settings')}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            <button class="btn-delfield" aria-label="${this.out('Delete field')}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <div class="fb-handle">
                                <svg class="size-4 text-[#aaa]" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="field-settings" tabindex="-1" role="dialog" aria-modal="true" aria-hidden="true" style="display:none"></div>
                `;
      } else if (type === 'heading') {
        fieldDiv.innerHTML = `
                    <div class="relative flex justify-between items-center w-full">

                        <span class="div-field-label">${desc}</span>

                        <div class="div-field-title flex items-center gap-4">
                            ${icon}
                            <span class="inp-heading-text" contentEditable="true">${this.out('Heading Text Goes Here')}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <button class="btn-toggle-settings" aria-label="${this.out('Toggle settings')}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            <button class="btn-delfield" aria-label="${this.out('Delete field')}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <div class="fb-handle">
                                <svg class="size-4 text-[#aaa]" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="field-settings" tabindex="-1" role="dialog" aria-modal="true" aria-hidden="true" style="display:none"></div>
                `;
      } else if (type === 'paragraph') {
        fieldDiv.innerHTML = `
                    <div class="relative flex justify-between items-center w-full">

                        <span class="div-field-label">${desc}</span>

                        <div class="div-field-title flex items-center gap-4">
                            ${icon}
                            <span class="inp-paragraph-text" contentEditable="true">${this.out('Paragraph here')}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <button class="btn-toggle-settings" aria-label="${this.out('Toggle settings')}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            <button class="btn-delfield" aria-label="${this.out('Delete field')}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <div class="fb-handle">
                                <svg class="size-4 text-[#aaa]" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="field-settings" tabindex="-1" role="dialog" aria-modal="true" aria-hidden="true" style="display:none"></div>
                `;
      } else {
        fieldDiv.innerHTML = `
                    <div class="relative flex justify-between items-center w-full">

                        <span class="div-field-label">${desc}</span>

                        <div class="div-field-title flex items-center gap-4">
                            ${icon}
                            <span class="inp-field-title" contentEditable="true">${fieldTitle}</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <button class="btn-toggle-settings" aria-label="${this.out('Toggle settings')}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            <button class="btn-delfield" aria-label="${this.out('Delete field')}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <div class="fb-handle">
                                <svg class="size-4 text-[#aaa]" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="field-settings" tabindex="-1" role="dialog" aria-modal="true" aria-hidden="true" style="display:none"></div>
                `;
      }
      fieldsContainer.appendChild(fieldDiv);
      const selectDiv = fieldDiv.querySelector('.field-settings');
      let id = this.getId();
      let chkRequired;
      let html;
      // Required checkbox
      if (type === 'short-text' || type === 'long-text' || type === 'number' || type === 'select' || type === 'dropdown' || type === 'switch' || type === 'date' || type === 'time' || type === 'datetime' || type === 'file' || type === 'multifile' || type === 'email' || type === 'phone' || type === 'url') {
        chkRequired = this.renderCheckbox({
          parentNode: selectDiv,
          className: 'chk-required',
          text: this.out('Required')
        });
      }
      if (type === 'dropdown' || type === 'email' || type === 'phone') {
        if (type === 'dropdown') {
          html = `
                    <div class="field-div mt-3 p-1">
                        <label for="${id}_placeholder_text" class="field-label">${this.out('Placeholder Text')}:</label>
                        <input id="${id}_placeholder_text" type="text" value="${this.out('Select..')}" class="inp-placeholder-text inp-base" />
                    </div>`;
        } else {
          html = `
                    <div class="field-div mt-3 p-1">
                        <label for="${id}_placeholder_text" class="field-label">${this.out('Placeholder Text')}:</label>
                        <input id="${id}_placeholder_text" type="text" value="" class="inp-placeholder-text inp-base" />
                    </div>`;
        }
        this.appendHtml(selectDiv, html);
      }
      if (type === 'short-text' || type === 'number' || type === 'url') {
        html = `
                <div class="field-div mt-3 p-1">
                    <label for="${id}_placeholder_text" class="field-label">${this.out('Placeholder Text')}:</label>
                    <input id="${id}_placeholder_text" type="text" value="" class="inp-placeholder-text inp-base" />
                </div>
                <div class="field-div mt-1 p-1">
                    <label for="${id}_default_value" class="field-label">${this.out('Default Value')}:</label>
                    <input id="${id}_default_value" ${type === 'number' ? 'type="number"' : 'type="text"'} value="" class="inp-default-value inp-base" />
                </div>`;
        this.appendHtml(selectDiv, html);
      }
      if (type === 'long-text') {
        html = `
                <div class="field-div mt-3 p-1">
                    <label for="${id}_placeholder_text" class="field-label">${this.out('Placeholder Text')}:</label>
                    <input id="${id}_placeholder_text" type="text" value="" class="inp-placeholder-text inp-base" />
                </div>
                <div class="field-div p-1">
                    <label for="${id}_default_value" class="field-label">${this.out('Default Value')}:</label>
                    <textarea id="${id}_default_value" value="" class="inp-default-value inp-base"></textarea>
                </div>
                <div class="field-div p-1">
                    <label for="${id}_height" class="field-label">${this.out('Height')}:</label>
                    <input id="${id}_height" type="number" value="" class="inp-textarea-height inp-base" value="120" />
                </div>`;
        this.appendHtml(selectDiv, html);
      }
      if (type === 'switch') {
        html = `
                <div class="field-div mt-3 p-1">
                    <label for="${id}_default_value" class="field-label">${this.out('Value')}:</label>

                    <div class="select-container">
                        <div>
                            <select id="${id}_default_value" class="sel-default-value">
                                <option value="true">${this.out('On')}</option>
                                <option  selected="selected" value="false">${this.out('Off')}</option>
                            </select>
                            <div class="select-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>`;
        this.appendHtml(selectDiv, html);
      }
      if (type === 'color') {
        html = `
                <div class="field-div p-1">
                    <label for="${id}_default_value" class="field-label">${this.out('Default Value')}:</label>
                    <input id="${id}_default_value" type="color" value="" class="inp-default-value input-color" />
                </div>
                `;
        this.appendHtml(selectDiv, html);

        /*
        html = `
        <div class="flex flex-col mb-1">
            <div class="div-field-width">
            </div>
        </div>
        `;
        this.appendHtml(selectDiv, html);
        let chkFullWidth = this.renderCheckbox({
            parentNode: selectDiv.querySelector('.div-field-width'), 
            className: 'chk-fullwidth',
            text: this.out('Full Width')
        });
         chkFullWidth.addEventListener('input', () => {
            const jsonText = this.get();
            if(this.settings.onChange) this.settings.onChange(jsonText);
            this.trigger('change', jsonText);
        });
        */
      }
      if (type === 'hidden') {
        html = `
                <div class="field-div mt-3 p-1">
                    <label for="${id}_default_value" class="field-label">${this.out('Value')}:</label>
                    <input id="${id}_default_value" type="text" value="" class="inp-default-value inp-base" />
                </div>`;
        this.appendHtml(selectDiv, html);
      }
      if (type === 'slider') {
        html = `
                <div class="field-div mt-1 p-1">
                    <label for="${id}_default_value" class="field-label">${this.out('Value')}:</label>
                    <input id="${id}_default_value" type="number" value="50" class="inp-default-value inp-base" />
                </div>`;
        this.appendHtml(selectDiv, html);
      }
      if (type === 'spacer') {
        html = `
                <div class="field-div mt-3 p-1">
                    <label for="${id}_height" class="field-label">${this.out('Height')}:</label>
                    <div class="flex items-center">
                        <input id="${id}_height" type="number" value="20" class="inp-spacer-height inp-base" />&nbsp; px
                    </div>
                </div>`;
        this.appendHtml(selectDiv, html);
        html = `
                    <div class="div-display-output mt-1 mb-1">
                    </div>
                `;
        this.appendHtml(selectDiv, html);
        let chkDisplayInOutput = this.renderCheckbox({
          parentNode: selectDiv.querySelector('.div-display-output'),
          className: 'chk-displayoutput',
          text: this.out('Display in Output')
        });
        chkDisplayInOutput.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      }
      if (type === 'separator') {
        html = `
                <div class="field-div p-1">
                    <label for="${id}_separator_color" class="field-label">${this.out('Color')}:</label>
                    <button title="${this.out('Color')}" class="inp-separator-color is-btn-color"></button>
                </div>`;
        this.appendHtml(selectDiv, html);
        html = `
                    <div class="div-display-output mt-1 mb-1">
                    </div>
                `;
        this.appendHtml(selectDiv, html);
        let chkDisplayInOutput = this.renderCheckbox({
          parentNode: selectDiv.querySelector('.div-display-output'),
          className: 'chk-displayoutput',
          text: this.out('Display in Output')
        });
        chkDisplayInOutput.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      }
      if (type === 'html') {
        html = `
                <div class="field-div mt-3 p-1">
                    <label for="${id}_html" class="field-label">${this.out('HTML')}:</label>
                    <div class="flex items-center justify-center">
                        <textarea 
                            id="${id}_html" 
                            class="inp-html inp-base" ></textarea>
                    </div>
                </div>`;
        this.appendHtml(selectDiv, html);
        html = `
                    <div class="div-display-output mt-1 mb-1">
                    </div>
                `;
        this.appendHtml(selectDiv, html);
        let chkDisplayInOutput = this.renderCheckbox({
          parentNode: selectDiv.querySelector('.div-display-output'),
          className: 'chk-displayoutput',
          text: this.out('Display in Output')
        });
        chkDisplayInOutput.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      }
      if (type === 'heading') {
        html = `
                <div class="field-div mt-3 p-1">
                    <div class="select-container">
                        <div>
                            <select id="${id}_heading" class="inp-heading">
                                <option value="h1">${this.out('Heading 1')}</option>
                                <option selected="selected" value="h2">${this.out('Heading 2')}</option>
                                <option value="h3">${this.out('Heading 3')}</option>
                                <option value="h4">${this.out('Heading 4')}</option>
                                <option value="h5">${this.out('Heading 5')}</option>
                                <option value="h6">${this.out('Heading 6')}</option>
                            </select>
                            <div class="select-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        /*
        <div class="field-div p-1">
            <div class="flex items-center justify-center">
                <p class="inp-heading-text" contentEditable="true">${this.out('Heading Text Goes Here')}</p>
            </div>
        </div>
        */
        this.appendHtml(selectDiv, html);
        html = `
                    <div class="div-display-output mt-1 mb-1">
                    </div>
                `;
        this.appendHtml(selectDiv, html);
        let chkDisplayInOutput = this.renderCheckbox({
          parentNode: selectDiv.querySelector('.div-display-output'),
          className: 'chk-displayoutput',
          text: this.out('Display in Output')
        });
        chkDisplayInOutput.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      }
      if (type === 'paragraph') {
        /*
        html = `
        <div class="field-div mt-3 p-1">
            <div class="flex items-center justify-center">
                <p class="inp-paragraph-text" contentEditable="true">${this.out('Lorem Ipsum is placeholder text used in design and typesetting. It has been the standard for dummy text since the 1500s, when a printer rearranged type to create a specimen book.')}</p>
            </div>
        </div>
        `;
        this.appendHtml(selectDiv, html);
        */
        html = `
                    <div class="div-display-output mt-1 mb-1">
                    </div>
                `;
        this.appendHtml(selectDiv, html);
        let chkDisplayInOutput = this.renderCheckbox({
          parentNode: selectDiv.querySelector('.div-display-output'),
          className: 'chk-displayoutput',
          text: this.out('Display in Output')
        });
        chkDisplayInOutput.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      }
      if (type === 'media') {
        html = `
                <div class="field-div mt-3 p-1">
                    <div class="select-container">
                        <div>
                            <select id="${id}_media" class="inp-media">
                                <option selected="selected" value="img">${this.out('Image')}</option>
                                <option value="video">${this.out('Video')}</option>
                                <option value="audio">${this.out('Audio')}</option>
                            </select>
                            <div class="select-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="field-div mt-3 p-1">
                        <label for="${id}_media_url" class="field-label">${this.out('URL')}:</label>
                        <input id="${id}_media_url" type="text" value="${this.settings.exampleImageUrl ? this.settings.exampleImageUrl : ''}" class="inp-media-url inp-base" />
                    </div>
                </div>
                `;
        this.appendHtml(selectDiv, html);
        html = `
                    <div class="div-display-output mt-1 mb-1">
                    </div>
                `;
        this.appendHtml(selectDiv, html);
        let chkDisplayInOutput = this.renderCheckbox({
          parentNode: selectDiv.querySelector('.div-display-output'),
          className: 'chk-displayoutput',
          text: this.out('Display in Output')
        });
        chkDisplayInOutput.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      }
      if (type === 'image' || type === 'video' || type === 'audio') {
        let exampleUrl;
        if (type === 'image') exampleUrl = this.settings.exampleImageUrl || '';
        if (type === 'video') exampleUrl = this.settings.exampleVideoUrl || '';
        if (type === 'audio') exampleUrl = this.settings.exampleAudioUrl || '';
        html = `
                <div class="field-div mt-1 p-1">
                    <label for="${id}_media_url" class="field-label">${this.out('URL')}:</label>
                    <input id="${id}_media_url" type="text" value="${exampleUrl}" class="inp-media-url inp-base" />
                </div>
                `;
        this.appendHtml(selectDiv, html);
        html = `
                    <div class="div-display-output mt-1 mb-1">
                    </div>
                `;
        this.appendHtml(selectDiv, html);
        let chkDisplayInOutput = this.renderCheckbox({
          parentNode: selectDiv.querySelector('.div-display-output'),
          className: 'chk-displayoutput',
          text: this.out('Display in Output')
        });
        chkDisplayInOutput.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      }
      let fileOptsContainer, inpFileSource;
      switch (type) {
        case 'short-text':
          break;
        case 'long-text':
          break;
        case 'number':
          break;
        case 'slider':
          html = `
                <div class="field-div mt-1 p-1">
                    <label for="${id}_min_value" class="field-label">${this.out('Min Value')}:</label>
                    <input id="${id}_min_value" type="number" value="0" class="inp-min-value inp-base" />
                </div>
                <div class="field-div mt-1 p-1">
                    <label for="${id}_max_value" class="field-label">${this.out('Max Value')}:</label>
                    <input id="${id}_max_value" type="number" value="100" class="inp-max-value inp-base" />
                </div>
                <div class="field-div mt-1 p-1">
                    <label for="${id}_step" class="field-label">${this.out('Step')}:</label>
                    <input id="${id}_step" type="number" value="1" class="inp-step inp-base" />
                </div>
                `;
          this.appendHtml(selectDiv, html);
          break;
        case 'select':
        /* falls through */
        case 'multi-select':
        /* falls through */
        case 'dropdown':
          {
            let otherText = this.out('Other (describe):');
            if (type === 'dropdown') otherText = this.out('Other (describe)');
            html = `
                    <div class="options-container-label" style="">
                        <div class="field-label">${this.out('Value')}:</div>
                        <div class="field-label" >${this.out('Display Text')}:</div>
                    </div>

                    <div class="options-container ${type === 'multi-select' || type === 'select' ? 'mt-4' : ''}"></div>

                    <button class="btn-addoption">
                        ${this.out('Add Option')}
                    </button>

                    <div class="select-item mb-1">
                        <input class="inp-other-option" value="${otherText}" />
                    
                        <button class="btn-other">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        </button>
                    </div>
                    
                    
                    `;
            this.appendHtml(selectDiv, html);
            const optionsContainer = selectDiv.querySelector('.options-container');
            const btnAddOption = selectDiv.querySelector('.btn-addoption');
            this.addSelectItem(optionsContainer, name, true); // initial=true (no need to trigger onChange)
            this.addSelectItem(optionsContainer, name, true); // initial=true

            btnAddOption.addEventListener('click', () => {
              this.addSelectItem(optionsContainer, name, false);
            });

            // Sorting
            new Sortable(optionsContainer, {
              animation: 150,
              // Smooth animation
              handle: '.fb-handle',
              // Restrict drag action to the handle
              ghostClass: 'sortable-ghost',
              // Class for the dragged item
              chosenClass: 'sortable-chosen',
              // Class when the item is selected
              dragClass: 'sortable-drag',
              // Class for the item being dragged
              onEnd: () => {
                const jsonText = this.get();
                if (this.settings.onChange) this.settings.onChange(jsonText);
                this.trigger('change', jsonText);
              }
            });
            const inputOther = selectDiv.querySelector('.inp-other-option');
            let debounceTimeout;
            inputOther.addEventListener('input', () => {
              clearTimeout(debounceTimeout);
              debounceTimeout = setTimeout(() => {
                const jsonText = this.get();
                if (this.settings.onChange) this.settings.onChange(jsonText);
                this.trigger('change', jsonText);
              }, 300);
            });
            const btnOther = selectDiv.querySelector('.btn-other');
            btnOther.addEventListener('click', () => {
              btnOther.classList.toggle('active');
              if (btnOther.classList.contains('active')) {
                btnOther.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        `;
              } else {
                btnOther.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        `;
              }
              const jsonText = this.get();
              if (this.settings.onChange) this.settings.onChange(jsonText);
              this.trigger('change', jsonText);
            });
          }
          break;
        case 'switch':
          break;
        case 'date':
          this.appendHtml(selectDiv, html);
          break;
        case 'time':
          this.appendHtml(selectDiv, html);
          break;
        case 'datetime':
          this.appendHtml(selectDiv, html);
          break;
        case 'color':
          // this.appendHtml(selectDiv, html);

          break;
        case 'file':
          {
            // Allowed File Types
            html = `
                    <div class="flex flex-col mt-3">
                        <div class="field-label-normal ml-1">
                            ${this.out('Allowed File Types')}:
                        </div>
                        <div class="file-options-container flex flex-col">
                        </div>
                    </div>
                    `;
            this.appendHtml(selectDiv, html);
            fileOptsContainer = selectDiv.querySelector('.file-options-container');
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'images',
              text: this.out('Images')
            });
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'videos',
              text: this.out('Videos')
            });
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'audio',
              text: this.out('Audio')
            });
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'documents',
              text: this.out('Documents')
            });
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'others',
              text: this.out('Others (zip & rar)')
            });

            // Source
            html = `
                <div class="flex flex-col mt-3">
                    <label for="file_source_${id}" class="field-label-normal ml-1 mb-1">${this.out('Source')}:</label>
                    <div class="select-container">
                        <div>
                            <select id="file_source_${id}" class="inp-filesource">
                                <option selected="selected" value="local">${this.out('Local File')}</option>
                                <option value="camera">${this.out('Camera')}</option>
                                <option value="local_and_camera">${this.out('Local File & Camera')}</option>
                            </select>
                            <div class="select-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>`;
            this.appendHtml(selectDiv, html);
            inpFileSource = selectDiv.querySelector('.inp-filesource');
            inpFileSource.addEventListener('change', () => {
              const jsonText = this.get();
              if (this.settings.onChange) this.settings.onChange(jsonText);
              this.trigger('change', jsonText);
            });

            // Expanded Preview
            html = `
                    <div class="flex flex-col mt-1">
                        <div class="large-image-preview">
                        </div>
                    </div>
                    `;
            this.appendHtml(selectDiv, html);
            let chkLargerImagePreview = this.renderCheckbox({
              parentNode: selectDiv.querySelector('.large-image-preview'),
              className: 'chk-largepreview',
              text: this.out('Expanded Preview')
            });
            chkLargerImagePreview.addEventListener('input', () => {
              const jsonText = this.get();
              if (this.settings.onChange) this.settings.onChange(jsonText);
              this.trigger('change', jsonText);
            });

            // Enable Image Mask
            if (this.settings.useImageMask) {
              html = `
                    <div class="flex flex-col mt-1">
                        <div class="file-image-mask">
                        </div>
                    </div>
                    `;
              this.appendHtml(selectDiv, html);
              let chkImageMask = this.renderCheckbox({
                parentNode: selectDiv.querySelector('.file-image-mask'),
                className: 'chk-imagemask',
                text: this.out('Enable Image Mask')
              });
              chkImageMask.addEventListener('input', () => {
                const jsonText = this.get();
                if (this.settings.onChange) this.settings.onChange(jsonText);
                this.trigger('change', jsonText);
              });
            }

            // Input URL checkbox
            html = `
                    <div class="file-input-url mt-1 mb-1">
                    </div>
                `;
            this.appendHtml(selectDiv, html);
            let chkInputURL = this.renderCheckbox({
              parentNode: selectDiv.querySelector('.file-input-url'),
              className: 'chk-inputurl',
              text: this.out('Enable URL Input')
            });
            chkInputURL.addEventListener('input', () => {
              const jsonText = this.get();
              if (this.settings.onChange) this.settings.onChange(jsonText);
              this.trigger('change', jsonText);
              if (chkInputURL.checked) {
                selectDiv.querySelector('.inp-placeholder-text').parentNode.style.display = '';
                selectDiv.querySelector('.inp-default-value').parentNode.style.display = '';
              } else {
                selectDiv.querySelector('.inp-placeholder-text').parentNode.style.display = 'none';
                selectDiv.querySelector('.inp-default-value').parentNode.style.display = 'none';
              }
            });

            // Placeholder Text & Default Value

            html = `
                <div class="field-div mt-1 p-1">
                    <label for="${id}_placeholder_text" class="field-label">${this.out('Placeholder Text')}:</label>
                    <input id="${id}_placeholder_text" type="text" value="${this.out('Enter URL.')}" class="inp-placeholder-text inp-base" />
                </div>
                <div class="field-div p-1">
                    <label for="${id}_default_value" class="field-label">${this.out('Default Value')}:</label>
                    <input id="${id}_default_value" ${type === 'number' ? 'type="number"' : 'type="text"'} value="" class="inp-default-value inp-base" />
                </div>`;
            this.appendHtml(selectDiv, html);
            break;
          }
        case 'multifile':
          {
            // Allowed File Types
            html = `
                <div class="flex flex-col mt-3">
                    <div class="field-label-normal ml-1">
                        ${this.out('Allowed File Types')}:
                    </div>
                    <div class="file-options-container flex flex-col">
                    </div>
                </div>
                `;
            this.appendHtml(selectDiv, html);
            fileOptsContainer = selectDiv.querySelector('.file-options-container');
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'images',
              text: this.out('Images')
            });
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'videos',
              text: this.out('Videos')
            });
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'audio',
              text: this.out('Audio')
            });
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'documents',
              text: this.out('Documents')
            });
            this.renderCheckbox({
              parentNode: fileOptsContainer,
              name: 'file-category',
              value: 'others',
              text: this.out('Others (zip & rar)')
            });
            break;
          }
      }
      const toggleButton = fieldDiv.querySelector('.btn-toggle-settings');
      const settingsDiv = fieldDiv.querySelector('.field-settings');
      if (toggleButton) {
        toggleButton.addEventListener('click', () => {
          if (settingsDiv.classList.contains('expanded')) {
            // Hide
            // Set the height explicitly to allow for transition
            settingsDiv.style.height = `${settingsDiv.scrollHeight}px`;

            // Trigger reflow (forces the browser to recognize the current height)
            requestAnimationFrame(() => {
              settingsDiv.style.height = '0'; // Start collapsing
            });
            settingsDiv.classList.remove('expanded');
            toggleButton.classList.remove('expanded');
            document.activeElement.blur();
            settingsDiv.setAttribute('aria-hidden', true);

            // After the collapse animation ends, set display to none
            settingsDiv.addEventListener('transitionend', () => {
              settingsDiv.style.display = 'none'; // Hide the element from the layout and focus navigation
              settingsDiv.style.height = ''; // Clean up the inline height style
            }, {
              once: true
            });
          } else {
            // Show
            settingsDiv.style.display = ''; // Make sure it's visible before expanding
            settingsDiv.style.height = '0'; // Start with height 0 to trigger the animation

            // Trigger reflow (forces the browser to recognize the current height)
            requestAnimationFrame(() => {
              settingsDiv.style.height = `${settingsDiv.scrollHeight}px`; // Expand to full content height
            });
            settingsDiv.classList.add('expanded');
            toggleButton.classList.add('expanded');
            settingsDiv.setAttribute('aria-hidden', false);

            // After the animation ends, reset height to auto
            settingsDiv.addEventListener('transitionend', () => {
              settingsDiv.style.height = 'auto'; // Reset height to auto
            }, {
              once: true
            });
          }
        });
        if (type !== 'heading' && type !== 'paragraph' && type !== 'spacer' && type !== 'separator' && type !== 'hidden' && type !== 'html' && type !== 'media' && type !== 'image' && type !== 'video' && type !== 'audio') {
          html = `
                    <div class="field-div mt-1 p-1">
                        <label for="${id}_field_info" class="field-label">${this.out('Field Note')}:</label>
                        <input id="${id}_field_info" type="text" value="" class="inp-field-note inp-base" />
                    </div>`;
          this.appendHtml(selectDiv, html);
        }
      }
      const deleteButton = fieldDiv.querySelector('.btn-delfield');
      deleteButton.addEventListener('click', event => {
        fieldDiv.remove();
        const jsonText = this.get();
        if (this.settings.onChange) this.settings.onChange(jsonText);
        this.trigger('change', jsonText);
        hidePopup();
        event.preventDefault();
        event.stopImmediatePropagation();
      });
      const inpFieldTitle = fieldDiv.querySelector('.inp-field-title');
      if (inpFieldTitle) inpFieldTitle.addEventListener('paste', e => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        document.execCommand('insertText', false, text);
      });
      let debounceTimeout;
      if (inpFieldTitle) inpFieldTitle.addEventListener('keyup', event => {
        // Ignore key events that don't modify content
        const ignoredKeys = ['Control', 'Meta', 'Alt', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'CapsLock', 'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
        if (event.key && ignoredKeys.includes(event.key)) {
          return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey) {
          // Skip combinations like CMD+A, CTRL+A, etc.
          return;
        }
        // Trigger the input event
        const inputEvent = new Event('input', {
          bubbles: true,
          // Allow the event to bubble up the DOM
          cancelable: true // Allow the event to be cancelable
        });
        inpFieldTitle.dispatchEvent(inputEvent);
      });
      // Handle the input event
      if (inpFieldTitle) inpFieldTitle.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          fieldDiv.setAttribute('data-name', this.textToId(inpFieldTitle.innerText));
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpPlaceholderText = fieldDiv.querySelector('.inp-placeholder-text');
      if (inpPlaceholderText) {
        inpPlaceholderText.addEventListener('input', () => {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            const jsonText = this.get();
            if (this.settings.onChange) this.settings.onChange(jsonText);
            this.trigger('change', jsonText);
          }, 300);
        });
        if (inpPlaceholderText.closest('[data-type="dropdown"]')) {
          inpPlaceholderText.addEventListener('focus', () => {
            const checkedInput = fieldDiv.querySelector('.rdo-selected input:checked');
            if (checkedInput) {
              const inps = fieldDiv.querySelectorAll('.rdo-selected input');
              inps.forEach(inp => {
                inp.checked = false; // clear seleceted
              });
              const jsonText = this.get();
              if (this.settings.onChange) this.settings.onChange(jsonText);
              this.trigger('change', jsonText);
            }
          });
        }
      }
      const inpSpacerHeight = fieldDiv.querySelector('.inp-spacer-height');
      if (inpSpacerHeight) inpSpacerHeight.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpHtml = fieldDiv.querySelector('.inp-html');
      if (inpHtml) inpHtml.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpHeading = fieldDiv.querySelector('.inp-heading');
      if (inpHeading) inpHeading.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpHeadingText = fieldDiv.querySelector('.inp-heading-text');
      if (inpHeadingText) inpHeadingText.addEventListener('paste', e => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        document.execCommand('insertText', false, text);
      });
      // let debounceTimeout;
      if (inpHeadingText) inpHeadingText.addEventListener('keyup', event => {
        // Ignore key events that don't modify content
        const ignoredKeys = ['Control', 'Meta', 'Alt', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'CapsLock', 'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
        if (event.key && ignoredKeys.includes(event.key)) {
          return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey) {
          // Skip combinations like CMD+A, CTRL+A, etc.
          return;
        }
        // Trigger the input event
        const inputEvent = new Event('input', {
          bubbles: true,
          // Allow the event to bubble up the DOM
          cancelable: true // Allow the event to be cancelable
        });
        inpHeadingText.dispatchEvent(inputEvent);
      });
      if (inpHeadingText) inpHeadingText.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default behavior
          // document.execCommand('insertHTML', false, '<br>'); // Insert a line break instead
        }
      });
      // Handle the input event
      if (inpHeadingText) inpHeadingText.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpParagraphText = fieldDiv.querySelector('.inp-paragraph-text');
      if (inpParagraphText) inpParagraphText.addEventListener('paste', e => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        document.execCommand('insertText', false, text);
      });
      // let debounceTimeout;
      if (inpParagraphText) inpParagraphText.addEventListener('keyup', event => {
        // Ignore key events that don't modify content
        const ignoredKeys = ['Control', 'Meta', 'Alt', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'CapsLock', 'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
        if (event.key && ignoredKeys.includes(event.key)) {
          return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey) {
          // Skip combinations like CMD+A, CTRL+A, etc.
          return;
        }
        // Trigger the input event
        const inputEvent = new Event('input', {
          bubbles: true,
          // Allow the event to bubble up the DOM
          cancelable: true // Allow the event to be cancelable
        });
        inpParagraphText.dispatchEvent(inputEvent);
      });
      if (inpParagraphText) inpParagraphText.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default behavior
          document.execCommand('insertHTML', false, '<br>'); // Insert a line break instead
          /*
          // Alternative without using execCommand:
          
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          const range = selection.getRangeAt(0);
          
          // Create and insert the <br>
          const br = document.createElement("br");
          range.insertNode(br);
          
          // Move the caret after the <br>
          range.setStartAfter(br);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          */
        }
      });
      // Handle the input event
      if (inpParagraphText) inpParagraphText.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });

      // Media
      const inpMedia = fieldDiv.querySelector('.inp-media');
      if (inpMedia) inpMedia.addEventListener('change', () => {
        const jsonText = this.get();
        if (this.settings.onChange) this.settings.onChange(jsonText);
        this.trigger('change', jsonText);
      });
      const inpMediaUrl = fieldDiv.querySelector('.inp-media-url');
      if (inpMediaUrl) inpMediaUrl.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      let btnColors = fieldDiv.querySelectorAll('.is-btn-color');
      btnColors.forEach(btn => {
        btn.addEventListener('click', () => {
          this.colorPicker.open(color => {
            btn.style.backgroundColor = color; // preview

            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
              const jsonText = this.get();
              if (this.settings.onChange) this.settings.onChange(jsonText);
              this.trigger('change', jsonText);
            }, 300);
          }, btn.style.backgroundColor, () => {
            btn.removeAttribute('data-focus');
            btn.focus();
          });
          btn.setAttribute('data-focus', true);
        });
      });
      const inpFieldNote = fieldDiv.querySelector('.inp-field-note');
      if (inpFieldNote) inpFieldNote.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpDefaultValue = fieldDiv.querySelector('.inp-default-value');
      if (inpDefaultValue) inpDefaultValue.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const selDefaultValue = fieldDiv.querySelector('.sel-default-value');
      if (selDefaultValue) selDefaultValue.addEventListener('change', () => {
        const jsonText = this.get();
        if (this.settings.onChange) this.settings.onChange(jsonText);
        this.trigger('change', jsonText);
      });
      const inpMinValue = fieldDiv.querySelector('.inp-min-value');
      if (inpMinValue) inpMinValue.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpMaxValue = fieldDiv.querySelector('.inp-max-value');
      if (inpMaxValue) inpMaxValue.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpStep = fieldDiv.querySelector('.inp-step');
      if (inpStep) inpStep.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpSeparatorColor = fieldDiv.querySelector('.inp-separator-color');
      if (inpSeparatorColor) inpSeparatorColor.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      const inpTextareaHeight = fieldDiv.querySelector('.inp-textarea-height');
      if (inpTextareaHeight) inpTextareaHeight.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        }, 300);
      });
      if (chkRequired) chkRequired.addEventListener('input', () => {
        const jsonText = this.get();
        if (this.settings.onChange) this.settings.onChange(jsonText);
        this.trigger('change', jsonText);
      });
      const checkboxes = fieldDiv.querySelectorAll('input[name="file-category"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      });
    };
    this.addField = addField;

    // Add event listeners
    btnAddField.addEventListener('click', togglePopup);
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    btns.forEach(btn => {
      btn.addEventListener('click', handleFieldTypeClick);
    });

    // Clean up event listeners on destroy
    this.cleanupBuilder = () => {
      btnAddField.removeEventListener('click', togglePopup);
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      popup.removeEventListener('click', handleFieldTypeClick);
      btns.forEach(btn => {
        btn.removeEventListener('click', handleFieldTypeClick);
      });
    };
  }
  addSelectItem(optionsContainer, fieldName, initial) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'select-item';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = `Option ${optionsContainer.children.length + 1}`;
    input.className = 'inp-option';
    let debounceTimeout; // Variable to hold the debounce timeout
    input.addEventListener('input', () => {
      // Debounce onChange handler
      clearTimeout(debounceTimeout); // Clear the previous timeout
      debounceTimeout = setTimeout(() => {
        const jsonText = this.get();
        if (this.settings.onChange) this.settings.onChange(jsonText);
        this.trigger('change', jsonText);
      }, 300); // Adjust the delay (in milliseconds) as needed
    });
    const btnRemove = document.createElement('button');
    btnRemove.className = 'remove-option py-3 pl-3 pr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-builder-primary-color';
    btnRemove.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        `;
    btnRemove.addEventListener('click', event => {
      itemDiv.remove();
      const jsonText = this.get();
      if (this.settings.onChange) this.settings.onChange(jsonText);
      this.trigger('change', jsonText);
      event.preventDefault();
      event.stopImmediatePropagation();
    });
    itemDiv.appendChild(input);

    // Display Text
    const inputText = document.createElement('input');
    inputText.type = 'text';
    // inputText.value = `Option ${optionsContainer.children.length + 1}`;
    inputText.className = 'inp-option-text';
    let debounceTimeout2; // Variable to hold the debounce timeout
    inputText.addEventListener('input', () => {
      // Debounce onChange handler
      clearTimeout(debounceTimeout2); // Clear the previous timeout
      debounceTimeout2 = setTimeout(() => {
        const jsonText = this.get();
        if (this.settings.onChange) this.settings.onChange(jsonText);
        this.trigger('change', jsonText);
      }, 300); // Adjust the delay (in milliseconds) as needed
    });
    itemDiv.appendChild(inputText);
    // /Display Text

    const controlWrap = document.createElement('div');
    controlWrap.className = 'flex flex-row';
    itemDiv.appendChild(controlWrap);
    this.renderRadio({
      parentNode: controlWrap,
      name: fieldName,
      className: 'rdo-selected',
      value: '',
      text: ''
    });
    controlWrap.appendChild(btnRemove);
    const btnHandle = document.createElement('div');
    btnHandle.className = 'fb-handle w-[40px] h-[40px] flex items-center justify-center';
    btnHandle.innerHTML = `
            <svg class="size-4 text-[#aaa]" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            </svg>
        `;
    controlWrap.appendChild(btnHandle);
    optionsContainer.appendChild(itemDiv);

    // initial=true (no need to trigger onChange)
    if (!initial) {
      const jsonText = this.get();
      if (this.settings.onChange) this.settings.onChange(jsonText);
      this.trigger('change', jsonText);
    }
  }
  addResultTool() {
    const resultElement = document.querySelector(this.settings.resultSelector);
    if (!resultElement) return;

    // Check
    let html = resultElement.innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove non text elements
    const tool = doc.querySelector('.result-tool');
    if (tool) {
      tool.remove();
    }
    const links = doc.querySelectorAll('.link-view, .link-download, video, audio');
    links.forEach(item => {
      item.remove();
    });
    let hideCopy = false;
    const text = doc.body.innerText.trim();
    if (text === '') {
      hideCopy = true;
    }
    //---

    const divResultTools = document.createElement('div');
    divResultTools.className = 'result-tool';
    resultElement.appendChild(divResultTools);
    // resultElement.insertAdjacentElement('afterend', divResultTools);

    // Copy
    const btnCopyResult = document.createElement('button');
    btnCopyResult.className = 'btn-result-tool';
    btnCopyResult.innerHTML = `
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
        </svg>
        <span>${this.out('Copy')}</span>
        `;
    if (!hideCopy) divResultTools.appendChild(btnCopyResult);

    // Clear
    const btnClearResult = document.createElement('button');
    btnClearResult.className = 'btn-result-tool';
    btnClearResult.innerHTML = `
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
        <span>${this.out('Clear')}</span>
        `;
    divResultTools.appendChild(btnClearResult);
    btnCopyResult && btnCopyResult.addEventListener('click', e => {
      e.preventDefault();
      const clone = resultElement.cloneNode(true);
      const tool = clone.querySelector('.result-tool');
      if (tool) {
        tool.remove();
      }
      const links = clone.querySelectorAll('.link-view, .link-download');
      links.forEach(item => {
        item.remove();
      });
      // Temporarily append the clone to the DOM to compute layout
      clone.style.position = 'fixed'; // Prevent layout shifts
      clone.style.left = '-9999px'; // Move outside the viewport
      document.body.appendChild(clone);
      const text = clone.innerText.trim(); // Get text with correct line breaks
      document.body.removeChild(clone); // Clean up
      navigator.clipboard.writeText(text); // Copy

      btnCopyResult.innerHTML = `
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path stroke="none" d="M0 0h24v24H0z" /><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /><path d="M11 14l2 2l4 -4" />
            </svg>
            <span>${this.out('Copied')}</span>
            `;
      setTimeout(() => {
        btnCopyResult.innerHTML = `
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                </svg>
                <span>${this.out('Copy')}</span>
                `;
      }, 600);
    });
    btnClearResult.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('_results');
      localStorage.removeItem('_results_html');
      resultElement.innerHTML = '';
    });
  }
  getScrollableParent(element) {
    while (element.parentElement) {
      const style = window.getComputedStyle(element.parentElement);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && element.parentElement.scrollHeight > element.parentElement.clientHeight) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
    return null; // No scrollable parent found
  }
  stickyElement(divField) {
    if (!this.settings.alwaysVisibleSubmit) return;
    const scrollableParent = this.getScrollableParent(divField);

    // Remove existing listener if it exists.
    if (this._scrollListener) {
      if (scrollableParent) {
        scrollableParent.removeEventListener('scroll', this._scrollListener);
      } else {
        window.removeEventListener('scroll', this._scrollListener);
      }
      window.removeEventListener('resize', this._resizeListener);
    }

    // divField.style.position = '';

    let originalTopPos;
    const updateOriginalTopPos = () => {
      divField.style.position = '';
      if (scrollableParent) {
        originalTopPos = divField.offsetTop + divField.offsetHeight - scrollableParent.offsetTop;
      } else {
        originalTopPos = divField.offsetTop + divField.offsetHeight;
      }
    };
    const buttonVisibilityCheck = () => {
      if (!scrollableParent) {
        let n = window.innerHeight + window.scrollY;
        if (n > originalTopPos) {
          divField.style.position = '';
          divField.style.top = '';
        } else {
          const topPosition = window.innerHeight - divField.offsetHeight;
          divField.style.position = 'fixed';
          divField.style.top = `${topPosition}px`;
        }
      } else {
        let n = scrollableParent.offsetHeight + scrollableParent.scrollTop;

        // console.log(originalTopPos, n)
        if (n > originalTopPos) {
          divField.style.position = '';
          divField.style.top = '';
        } else {
          const topPosition = window.innerHeight - divField.offsetHeight;
          divField.style.position = 'fixed';
          divField.style.top = `${topPosition}px`;
        }
      }
      if (divField.parentNode.offsetWidth !== 0) {
        divField.style.width = `${divField.parentNode.offsetWidth}px`;
      }
    };

    // Store the reference so we can remove it next time.
    this._scrollListener = buttonVisibilityCheck;
    // this._resizeListener = () => {
    //     setTimeout(()=>{
    //         updateOriginalTopPos();
    //         buttonVisibilityCheck();
    //     },1000);
    // };
    let resizeTimeout;
    this._resizeListener = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        let lastTop = null;
        const waitForStableLayout = () => {
          const currentTop = divField.offsetTop;
          if (currentTop === lastTop) {
            updateOriginalTopPos();
            buttonVisibilityCheck();
          } else {
            lastTop = currentTop;
            requestAnimationFrame(waitForStableLayout);
          }
        };
        waitForStableLayout();
      }, 200); // debounce delay
    };
    updateOriginalTopPos(); //initial
    buttonVisibilityCheck(); //initial

    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', buttonVisibilityCheck);
    } else {
      window.addEventListener('scroll', buttonVisibilityCheck);
    }
    window.addEventListener('resize', this._resizeListener);
  }
  view(jsonText) {
    if (!jsonText) return;
    let json;
    try {
      json = JSON.parse(jsonText);
    } catch (e) {
      console.log('Invalid JSON Form.');
      return;
    }

    // let json;
    // if(!jsonText) json = {};
    // else {
    //     try{
    //         json = JSON.parse(jsonText);
    //     } catch(e) {
    //         json = {};
    //     }
    // }

    this.json = json;

    // Store the event listener function so we can reference it later
    this.inputListener = () => {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        const json = this.getFormValues();
        if (this.settings.onInputChange) this.settings.onInputChange(json);
      }, 300);
    };
    this.changeListener = () => {
      const json = this.getFormValues();
      if (this.settings.onInputChange) this.settings.onInputChange(json);
    };
    let preview;
    if (this.settings.isBuilder) {
      if (!this.settings.previewSelector) {
        if (this.settings.consoleLog) console.log('previewSelector not set.');
        return;
      }
      preview = document.querySelector(this.settings.previewSelector);
    } else {
      preview = this.element;
    }
    if (preview) {
      preview.classList.remove('hidden');
      preview.classList.add('formview-container');
      preview.classList.add('fb-ui');

      // preview.classList.add('mini');

      preview.innerHTML = '';
      const hideHeader = json.hideHeader || false;
      if (!hideHeader) {
        const header = document.createElement('div');
        header.className = 'form-header';
        preview.appendChild(header);
        const h1 = document.createElement('h1');
        h1.className = 'form-title';
        h1.innerText = json.title || this.out('Your Form Title Here');
        header.appendChild(h1);
        const tagline = document.createElement('p');
        tagline.className = 'form-desc';
        tagline.innerText = json.description || this.out('Your Description Here');
        header.appendChild(tagline);
      }
      let form;
      if (this.settings.isBuilder) {
        form = document.createElement('form');
      } else {
        form = document.createElement('div'); // FormViewer default
      }
      form.className = 'form-wrapper';
      form.style.flexFlow = 'wrap';
      preview.appendChild(form);
      let idx = 1;
      if (json.elements) json.elements.forEach(field => {
        if (field.type === 'spacer') {
          const div = document.createElement('div');
          div.className = 'form-spacer';
          if (field.spacerHeight && !isNaN(parseFloat(field.spacerHeight))) {
            div.style.height = field.spacerHeight + 'px';
          }
          if (!field.displayInOutput) form.appendChild(div);
          return;
        }
        if (field.type === 'separator') {
          const hr = document.createElement('hr');
          hr.style.borderTopColor = field.color;
          if (!field.displayInOutput) form.appendChild(hr);
          return;
        }
        if (field.type === 'html') {
          if (field.html) {
            const div = document.createElement('div');
            div.innerHTML = field.html;
            if (!field.displayInOutput) form.appendChild(div);
          }
          return;
        }
        if (field.type === 'heading') {
          const heading = document.createElement(field.heading || 'h2');
          heading.innerHTML = field.headingText || this.out('Your Heading Here!');
          if (!field.displayInOutput) form.appendChild(heading);
          return;
        }
        if (field.type === 'paragraph') {
          const paragraph = document.createElement('p');
          paragraph.innerHTML = field.paragraphText || this.out('Your paragraph content here!');
          if (!field.displayInOutput) form.appendChild(paragraph);
          return;
        }
        if (field.type === 'media') {
          if (field.tag === 'video') {
            const video = document.createElement('video');
            video.style.width = '100%';
            video.style.height = 'auto';
            video.controls = true;
            var source = document.createElement('source');
            source.src = field.url;
            source.type = 'video/mp4';
            video.appendChild(source);

            // video.innerHTML = "Your browser does not support the video element.";

            if (!field.displayInOutput) form.appendChild(video);
          } else if (field.tag === 'audio') {
            const audio = document.createElement('audio');
            audio.controls = true;
            let source = document.createElement('source');
            source.src = field.url;
            source.type = 'audio/mp3';
            audio.appendChild(source);

            // audio.innerHTML = "Your browser does not support the audio element.";

            if (!field.displayInOutput) form.appendChild(audio);
          } else if (field.tag === 'img') {
            const image = document.createElement('img');
            image.src = field.url;
            image.setAttribute('alt', this.out('Output Image'));
            if (!field.displayInOutput) form.appendChild(image);
          }
          return;
        }
        if (field.type === 'image') {
          const image = document.createElement('img');
          image.src = field.url;
          image.setAttribute('alt', this.out('Output Image'));
          if (!field.displayInOutput) form.appendChild(image);
          return;
        }
        if (field.type === 'video') {
          const video = document.createElement('video');
          video.style.width = '100%';
          video.style.height = 'auto';
          video.controls = true;
          let source = document.createElement('source');
          source.src = field.url;
          source.type = 'video/mp4';
          video.appendChild(source);

          // video.innerHTML = "Your browser does not support the video element.";

          if (!field.displayInOutput) form.appendChild(video);
          return;
        }
        if (field.type === 'audio') {
          const audio = document.createElement('audio');
          audio.controls = true;
          let source = document.createElement('source');
          source.src = field.url;
          source.type = 'audio/mp3';
          audio.appendChild(source);

          // audio.innerHTML = "Your browser does not support the audio element.";

          if (!field.displayInOutput) form.appendChild(audio);
          return;
        }
        const divField = document.createElement('div');
        divField.className = 'form-field';
        if (field.type === 'hidden') divField.className = 'hidden';
        if (!field.displayInOutput) {
          form.appendChild(divField);
        }
        if (field.type === 'color') {
          divField.classList.add('field-color');
        }
        const type = field.type;
        let fieldName = field.name;

        // prevent same name 'question'
        let elm = form.querySelector(`[name="${fieldName}"]`);
        if (elm) {
          idx++;
          fieldName = fieldName + '_' + idx; // 'question2', 'question3', ...
        }
        if (type === 'short-text') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `short_text_label_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `short_text_label_${id}`;
          input.type = 'text';
          input.name = fieldName;
          input.value = field.value || '';
          input.className = 'inp-base';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('input', this.inputListener);
        }
        if (type === 'long-text') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `long_text_label_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('textarea');
          input.id = `long_text_label_${id}`;
          input.name = fieldName;
          input.value = field.value || '';
          input.className = 'inp-base';
          input.style.height = field.height + 'px';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('input', this.inputListener);
        }
        if (type === 'number') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `number_label_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `number_label_${id}`;
          input.type = 'number';
          input.name = fieldName;
          input.value = field.value || '';
          input.className = 'inp-base';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('input', this.inputListener);
        }
        if (type === 'slider') {
          divField.classList.add('input-slider');
          let id = this.getId();

          /*
          let html = `<div class="slider-container">
              <div class="values">
                  <span>0</span>
                  <span>100</span>
              </div>
              <input type="range" min="0" max="100" value="50" oninput="updateValue(this.value)">
              <div class="current-value" id="sliderValue">50</div>
          </div>`;
          */

          const label = document.createElement('label');
          label.setAttribute('for', `number_label_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const div = document.createElement('div');
          div.className = 'slider-container';
          divField.appendChild(div);
          const divInner = document.createElement('div');
          divInner.className = 'slider-values';
          div.appendChild(divInner);
          const span1 = document.createElement('span');
          divInner.appendChild(span1);
          span1.innerText = field.minValue;
          const span2 = document.createElement('span');
          divInner.appendChild(span2);
          span2.innerText = field.maxValue;
          const input = document.createElement('input');
          input.id = `number_label_${id}`;
          input.type = 'range';
          input.name = fieldName;
          input.setAttribute('min', field.minValue);
          input.setAttribute('max', field.maxValue);
          input.setAttribute('step', field.step);

          /*
          // const hasDecimal = (num) => {
          //     return num % 1 !== 0;
          // };
          // if(hasDecimal(field.value) || hasDecimal(field.minValue) || hasDecimal(field.maxValue)) {
          //     input.setAttribute('step', 0.1);
          // }
          const getDecimalPlaces = (num) => {
              const str = num.toString();
              return str.includes('.') ? str.split('.')[1].length : 0;
          };
          const decimals = Math.max(
              getDecimalPlaces(field.value),
              getDecimalPlaces(field.minValue),
              getDecimalPlaces(field.maxValue)
          );
          if (decimals === 1) {
              input.setAttribute('step', '0.1');
          } else if (decimals >= 2) {
              input.setAttribute('step', '0.01');
          }
          */

          input.setAttribute('value', field.value || 0);

          // input.className = 'inp-base';
          // input.placeholder = field.placeholder;
          // if(field.isRequired) input.setAttribute('required','required');
          div.appendChild(input);
          const divValue = document.createElement('div');
          divValue.className = 'current-value';
          div.appendChild(divValue);
          div.querySelector('.current-value').textContent = field.value || 0;
          input.addEventListener('input', () => {
            div.querySelector('.current-value').textContent = input.value;
          });
        }
        if (type === 'select') {
          let id = this.getId();
          const divLabel = document.createElement('div');
          divLabel.id = `radio_group_label_${id}`;
          divLabel.className = 'field-label-normal';
          divLabel.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(divLabel);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const group = document.createElement('div');
          group.setAttribute('aria-labelledby', `radio_group_label_${id}`);
          group.setAttribute('role', 'group');
          group.className = 'div-options';
          divField.appendChild(group);
          if (field.choices) {
            field.choices.forEach((choice, index) => {
              let displayText = choice;
              if (field.choicesText) {
                displayText = field.choicesText[index] || choice;
              }
              const div = document.createElement('label');
              div.setAttribute('for', `${id}_${index}`);
              div.className = 'option-label';
              group.appendChild(div);
              const input = document.createElement('input');
              input.type = 'radio';
              input.className = 'peer';
              input.id = `${id}_${index}`;
              input.name = fieldName;
              input.value = choice;
              div.appendChild(input);
              if (index === field.selected) {
                input.checked = true;
              }
              const peerSpan = document.createElement('span');
              peerSpan.className = 'peer-span-rounded';
              div.appendChild(peerSpan);
              const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"></path></svg>';
              peerSpan.innerHTML = checkIcon;
              if (index === 0) {
                if (field.isRequired) input.setAttribute('required', 'required');
              }
              const span = document.createElement('span');
              span.innerText = displayText; //choice;
              div.appendChild(span);
              input.addEventListener('change', this.changeListener);
            });
          }
          if (field.showOtherItem) {
            const div = document.createElement('label');
            div.setAttribute('for', id + '_other');
            div.className = 'option-label';
            group.appendChild(div);
            const input = document.createElement('input');
            input.type = 'radio';
            input.className = 'peer';
            input.id = id + '_other';
            input.name = fieldName;
            input.value = 'other';
            div.appendChild(input);
            const peerSpan = document.createElement('span');
            peerSpan.className = 'peer-span-rounded';
            div.appendChild(peerSpan);
            const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"></path></svg>';
            peerSpan.innerHTML = checkIcon;
            const span = document.createElement('span');
            span.innerText = field.otherText;
            div.appendChild(span);
            const divOther = document.createElement('div');
            divField.appendChild(divOther);
            const inputOther = document.createElement('input');
            inputOther.type = 'text';
            inputOther.name = fieldName + '_other';
            inputOther.className = 'inp-base';
            divOther.appendChild(inputOther);
            input.addEventListener('change', this.changeListener);
            inputOther.addEventListener('input', this.inputListener);
          }
        }
        if (type === 'multi-select') {
          let id = this.getId();
          const divLabel = document.createElement('div');
          divLabel.id = `checkbox_group_label_${id}`;
          divLabel.className = 'field-label-normal';
          divLabel.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(divLabel);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const group = document.createElement('div');
          group.setAttribute('aria-labelledby', `checkbox_group_label_${id}`);
          group.setAttribute('role', 'group');
          group.className = 'div-options';
          divField.appendChild(group);
          if (field.choices) {
            field.choices.forEach((choice, index) => {
              let displayText = choice;
              if (field.choicesText) {
                displayText = field.choicesText[index] || choice;
              }
              const div = document.createElement('label');
              div.setAttribute('for', `${id}_${index}`);
              div.className = 'option-label';
              group.appendChild(div);
              const input = document.createElement('input');
              input.type = 'checkbox';
              input.className = 'peer';
              input.id = `${id}_${index}`;
              input.name = fieldName + '[]'; // array field
              input.value = choice;
              div.appendChild(input);
              const peerSpan = document.createElement('span');
              peerSpan.className = 'peer-span-square';
              div.appendChild(peerSpan);
              const checkIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="4"  stroke-linecap="round"  stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" />
                            </svg>`;
              peerSpan.innerHTML = checkIcon;
              const span = document.createElement('span');
              span.innerText = displayText; //choice;
              div.appendChild(span);
              input.addEventListener('change', this.changeListener);
            });
          }
          if (field.showOtherItem) {
            const div = document.createElement('label');
            div.setAttribute('for', id + '_other');
            div.className = 'option-label';
            group.appendChild(div);
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'peer';
            input.id = id + '_other';
            input.name = fieldName;
            input.value = 'other';
            div.appendChild(input);
            const peerSpan = document.createElement('span');
            peerSpan.className = 'peer-span-square';
            div.appendChild(peerSpan);
            const checkIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="4"  stroke-linecap="round"  stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" />
                        </svg>`;
            peerSpan.innerHTML = checkIcon;
            const span = document.createElement('span');
            span.innerText = field.otherText;
            div.appendChild(span);
            const divOther = document.createElement('div');
            divField.appendChild(divOther);
            const inputOther = document.createElement('input');
            inputOther.type = 'text';
            inputOther.name = fieldName + '_other';
            inputOther.className = 'inp-base';
            divOther.appendChild(inputOther);
            input.addEventListener('change', this.changeListener);
            inputOther.addEventListener('input', this.inputListener);
          }
        }
        if (type === 'switch') {
          let id = this.getId();
          const label = document.createElement('label');
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          label.id = `switch_${id}`;
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const switchElm = document.createElement('div');
          // switchElm.id = `switch_${id}`;
          switchElm.className = 'switch';
          switchElm.tabIndex = 0;
          switchElm.role = 'switch';
          switchElm.setAttribute('aria-labelledby', `switch_${id}`);
          switchElm.setAttribute('aria-checked', 'false');
          switchElm.setAttribute('data-checked', 'false');
          divField.appendChild(switchElm);
          const switchThumb = document.createElement('div');
          switchThumb.className = 'switch-thumb';
          switchElm.appendChild(switchThumb);
          const hiddenInput = document.createElement('input');
          hiddenInput.id = `switch_${id}`;
          hiddenInput.type = 'text';
          hiddenInput.name = fieldName;
          hiddenInput.style.cssText = 'opacity:0.01;width:1px;height:1px;position:absolute;bottom:0px;left:25px;';
          // hiddenInput.value = field.value;
          hiddenInput.setAttribute('tabindex', '-1'); // Prevent tab navigation
          if (field.isRequired) {
            hiddenInput.setAttribute('required', 'required');
            hiddenInput.setCustomValidity(this.out('Please toggle this switch to proceed.'));
          }
          // divField.appendChild(hiddenInput);
          switchElm.appendChild(hiddenInput);
          if (field.value === 'true') {
            switchElm.setAttribute('aria-checked', 'true');
            switchElm.setAttribute('data-checked', 'true');
            hiddenInput.value = 'true';
            if (field.isRequired) hiddenInput.setCustomValidity('');
          } else {
            switchElm.setAttribute('aria-checked', 'false');
            switchElm.setAttribute('data-checked', 'false');
            hiddenInput.value = 'false';
            if (field.isRequired) hiddenInput.setCustomValidity(this.out('Please toggle this switch to proceed.'));
          }
          label.addEventListener('click', () => {
            switchElm.focus();
          });
          const toggleSwitch = () => {
            const isChecked = switchElm.getAttribute('aria-checked') === 'true';
            switchElm.setAttribute('aria-checked', !isChecked);
            switchElm.setAttribute('data-checked', !isChecked);
            // hiddenInput.value = !isChecked; // Update the hidden input value
            if (!isChecked) {
              hiddenInput.value = 'true';
              if (field.isRequired) hiddenInput.setCustomValidity('');
            } else {
              hiddenInput.value = 'false';
              if (field.isRequired) hiddenInput.setCustomValidity(this.out('Please toggle this switch to proceed.'));
            }

            // Trigger onChange
            const json = this.getFormValues();
            if (this.settings.onInputChange) this.settings.onInputChange(json);
          };
          switchElm.addEventListener('keydown', event => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault();
              toggleSwitch();
            }
          });
          switchElm.addEventListener('click', () => {
            toggleSwitch();
          });
        }
        if (type === 'dropdown') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `dropdown_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const dropdownContainer = document.createElement('div');
          dropdownContainer.className = 'relative';
          divField.appendChild(dropdownContainer);
          const div = document.createElement('div');
          div.className = 'relative inline-block';
          dropdownContainer.appendChild(div);
          const selectInput = document.createElement('select');
          selectInput.id = `dropdown_${id}`;
          selectInput.name = fieldName;
          if (field.isRequired) selectInput.setAttribute('required', 'required');
          div.appendChild(selectInput);
          const optionText = document.createElement('option');
          optionText.setAttribute('selected', 'selected');
          optionText.setAttribute('disabled', 'disabled');
          optionText.value = '';
          optionText.innerText = field.placeholder;
          selectInput.appendChild(optionText);
          if (field.choices) {
            field.choices.forEach((choice, index) => {
              let displayText = choice;
              if (field.choicesText) {
                displayText = field.choicesText[index] || choice;
              }
              const option = document.createElement('option');
              option.value = choice;
              option.innerText = displayText; //choice;
              selectInput.appendChild(option);
              if (index === field.selected) {
                optionText.remove();
                option.setAttribute('selected', 'selected');
              }
            });
          }
          if (field.showOtherItem) {
            const option = document.createElement('option');
            option.value = 'other'; //field.otherText; 
            option.innerText = field.otherText;
            selectInput.appendChild(option);
          }
          const selectArrow = document.createElement('div');
          selectArrow.className = 'select-arrow';
          div.appendChild(selectArrow);
          this.appendHtml(selectArrow, `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        `);
          const inputOther = document.createElement('input');
          inputOther.type = 'text';
          inputOther.id = `input_other_${id}`;
          inputOther.name = fieldName + '_other';
          inputOther.className = 'input-other hidden inp-base';
          divField.appendChild(inputOther);
          const dropdown = divField.querySelector(`#dropdown_${id}`);
          const otherInput = divField.querySelector(`#input_other_${id}`);
          dropdown.addEventListener('change', () => {
            if (dropdown.value === 'other') {
              otherInput.classList.remove('hidden');
              otherInput.focus();
            } else {
              otherInput.classList.add('hidden');
            }

            // Trigger onChange
            const json = this.getFormValues();
            if (this.settings.onInputChange) this.settings.onInputChange(json);
          });
          inputOther.addEventListener('input', this.inputListener);
        }
        if (type === 'date') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `date_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `date_${id}`;
          input.type = 'date';
          input.name = fieldName;
          input.className = 'inp-base';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('change', this.changeListener);
        }
        if (type === 'time') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `time_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `time_${id}`;
          input.type = 'time';
          input.name = fieldName;
          input.className = 'inp-base';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('change', this.changeListener);
        }
        if (type === 'datetime') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `datetime_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `datetime_${id}`;
          input.type = 'datetime-local';
          input.name = fieldName;
          input.className = 'inp-base';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('change', this.changeListener);
        }
        if (type === 'color') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `color_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `color_${id}`;
          input.type = 'color';
          input.name = fieldName;
          input.value = field.value || '';
          input.className = 'input-color';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('input', this.inputListener);
        }
        if (type === 'file' || type === 'multifile') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `file_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const fileInputWrapper = document.createElement('div');
          fileInputWrapper.className = 'file-input-wrapper';
          if (type === 'file') fileInputWrapper.setAttribute('aria-label', this.out(this.settings.fileUploadText));
          if (type === 'multifile') fileInputWrapper.setAttribute('aria-label', this.out(this.settings.multiFileUploadText));
          divField.appendChild(fileInputWrapper);
          const input = document.createElement('input');
          input.id = `input_url_label_${id}`;
          input.type = 'text';
          input.name = fieldName + '__url';
          input.value = field.value || '';
          input.className = 'inp-base input-file-url';
          input.placeholder = field.placeholder || this.out('Enter URL.');
          divField.appendChild(input);
          input.addEventListener('input', () => {
            const btnRemove = divField.querySelector('.btn-clearfile');
            if (btnRemove) btnRemove.click();
            this.inputListener();
            if (input.value !== '') {
              if (field.isRequired) fileInput.removeAttribute('required');
            } else {
              if (field.isRequired) fileInput.setAttribute('required', 'required');
            }
            handleUrl(input.value);
          });
          if (field.useURL) {
            input.style.display = '';
          } else {
            input.style.display = 'none';
          }
          const fileInput = document.createElement('input');
          fileInput.id = `file_${id}`;
          fileInput.type = 'file';
          if (type === 'multifile') fileInput.multiple = true;
          fileInput.name = fieldName;
          if (field.isRequired) fileInput.setAttribute('required', 'required');
          fileInput.className = 'peer';
          fileInputWrapper.appendChild(fileInput);
          const peerSpan = document.createElement('div');
          peerSpan.className = 'file-drop-area';
          fileInputWrapper.appendChild(peerSpan);
          const divControls = document.createElement('div');
          divControls.className = 'file-controls';
          divControls.id = `drag_message_${id}`;
          fileInputWrapper.appendChild(divControls);
          let message;
          if (!field.source || field.source && field.source === 'local' || field.source && field.source === 'local_and_camera') {
            message = document.createElement('div');
            message.className = 'file-drop-info';
            if (type === 'file') message.innerHTML = this.out(this.settings.fileUploadText);
            if (type === 'multifile') message.innerHTML = this.out(this.settings.multiFileUploadText);
            divControls.appendChild(message);
          }
          let btnSelectFile;
          if (!field.source || field.source && field.source === 'local' || field.source && field.source === 'local_and_camera') {
            btnSelectFile = document.createElement('button');
            btnSelectFile.className = 'btn-selectfile';
            btnSelectFile.innerHTML = `
                        <svg style="fill:none" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon-folder-open"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                        </svg>
                        ${this.out('Select File')}
                        `;
            divControls.appendChild(btnSelectFile);
          }
          let btnTakePhoto;
          if (field.source && field.source === 'camera' || field.source && field.source === 'local_and_camera') {
            btnTakePhoto = document.createElement('button');
            btnTakePhoto.className = 'btn-takephoto';
            btnTakePhoto.innerHTML = `
                        <svg style="fill:none" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon-camera">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                        </svg>
                        ${this.out('Take Photo')}
                        `;
            divControls.appendChild(btnTakePhoto);
          }
          const filePreviewContainer = document.createElement('div');
          filePreviewContainer.className = 'file-preview-container';
          fileInputWrapper.appendChild(filePreviewContainer);
          const fileNameDisplay = document.createElement('div');
          fileNameDisplay.className = 'file-drop-info-highlight';
          fileNameDisplay.id = `file_name_${id}`;
          fileInputWrapper.appendChild(fileNameDisplay);

          /*
          // Handle file selection via click
          fileInputWrapper.addEventListener('click', () => {
              fileInput.click();
              // fileInput.focus();
          });
          */
          if (btnSelectFile) btnSelectFile.addEventListener('click', e => {
            e.preventDefault();
            fileInput.click();
          });
          fileInputWrapper.classList.add('disabledrop');
          if (!field.source || field.source && field.source === 'local' || field.source && field.source === 'local_and_camera') {
            fileInputWrapper.classList.remove('disabledrop');

            // Handle file selection via drag-and-drop
            fileInputWrapper.addEventListener('dragover', event => {
              event.preventDefault(); // makes droppable
              fileInputWrapper.classList.add('drag-over');
            });
            fileInputWrapper.addEventListener('dragleave', () => {
              fileInputWrapper.classList.remove('drag-over');
            });
            if (type === 'file') {
              fileInputWrapper.addEventListener('drop', event => {
                event.preventDefault();
                fileInputWrapper.classList.remove('drag-over');
                const file = event.dataTransfer.files[0];
                if (file) {
                  // Update the file input with the dropped file
                  fileInput.files = event.dataTransfer.files;
                  handleFile(file);
                }
              });
            } else if (type === 'multifile') {
              fileInputWrapper.addEventListener('drop', event => {
                event.preventDefault();
                fileInputWrapper.classList.remove('drag-over');
                filePreviewContainer.innerHTML = ''; //clear

                const files = event.dataTransfer.files;
                if (files.length > 0) {
                  fileInput.files = files; // Update input with all dropped files
                  Array.from(files).forEach(file => {
                    handleMultipleFile(file); // Process each file
                  });
                }
              });
            }
          }

          // Handle file input selection
          if (type === 'file') {
            fileInput.addEventListener('change', () => {
              const file = fileInput.files[0];
              if (!file) return;
              handleFile(file);
            });
          } else if (type === 'multifile') {
            fileInput.addEventListener('change', () => {
              filePreviewContainer.innerHTML = ''; //clear

              const files = fileInput.files;
              Array.from(files).forEach(file => {
                if (!file) return;
                handleMultipleFile(file);
              });
            });
          }
          const allowedFileTypes = {
            images: [{
              type: 'image/jpeg',
              extensions: '.jpg, .jpeg'
            }, {
              type: 'image/png',
              extensions: '.png'
            }, {
              type: 'image/gif',
              extensions: '.gif'
            }, {
              type: 'image/webp',
              extensions: '.webp'
            }],
            videos: [{
              type: 'video/mp4',
              extensions: '.mp4'
            }, {
              type: 'video/webm',
              extensions: '.webm'
            }, {
              type: 'video/ogg',
              extensions: '.ogg'
            }, {
              type: 'video/quicktime',
              extensions: '.mov'
            }],
            audio: [{
              type: 'audio/mpeg',
              extensions: '.mp3'
            }, {
              type: 'audio/wav',
              extensions: '.wav'
            }],
            documents: [{
              type: 'application/pdf',
              extensions: '.pdf'
            }, {
              type: 'application/json',
              extensions: '.json'
            }, {
              type: 'text/plain',
              extensions: '.txt'
            }, {
              type: 'text/csv',
              extensions: '.csv'
            }, {
              type: 'application/msword',
              extensions: '.doc'
            }, {
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              extensions: '.docx'
            }, {
              type: 'application/vnd.ms-excel',
              extensions: '.xls'
            }, {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              extensions: '.xlsx'
            }],
            others: [{
              type: 'application/zip',
              extensions: '.zip'
            }, {
              type: 'application/x-rar-compressed',
              extensions: '.rar'
            }]
          };
          let selectedFileTypes = [];
          const selectedCategories = field.allowedFileTypes || ['images', 'videos', 'audio', 'documents', 'others'];
          selectedCategories.forEach(category => {
            switch (category) {
              case 'images':
                selectedFileTypes = selectedFileTypes.concat(allowedFileTypes.images);
                break;
              case 'videos':
                selectedFileTypes = selectedFileTypes.concat(allowedFileTypes.videos);
                break;
              case 'audio':
                selectedFileTypes = selectedFileTypes.concat(allowedFileTypes.audio);
                break;
              case 'documents':
                selectedFileTypes = selectedFileTypes.concat(allowedFileTypes.documents);
                break;
              case 'others':
                selectedFileTypes = selectedFileTypes.concat(allowedFileTypes.others);
                break;
            }
          });
          const acceptTypes = selectedFileTypes.map(fileType => fileType.type).join(',');
          fileInput.setAttribute('accept', acceptTypes);

          // Image Mask
          let objImageMask;
          if (field.useImageMask) {
            divField.classList.add('image-mask');
            const wrapper = document.createElement('div');
            divField.appendChild(wrapper);
            objImageMask = new ImageMask(wrapper, {
              lang: this.settings.lang,
              name: fieldName + '_mask'
            });
          }
          if (field.largePreview) {
            divField.classList.add('large-preview');
          }

          // Remove the image preview
          const removeImagePreview = () => {
            const imgPreview = fileInputWrapper.querySelector('.img-preview');
            if (imgPreview) {
              imgPreview.remove();
              if (field.useImageMask) {
                objImageMask.clearImage();
              }
            }
          };

          // Camera

          let html = `
                        <div class="div-livevideo">
                            <video class="livevideo" autoplay playsinline style="display:none"></video>
                            <canvas class="photo-captured" style="display:none"></canvas>
                            ${!field.source || field.source && field.source === 'local' || field.source && field.source === 'local_and_camera' ? `<button class="btn-selectfile2" title="${this.out('Select File')}" style="display:none">
                                    <svg style="fill:none" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon-folder-open"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            ` : ''}
                            <button class="btn-takephoto2" title="${this.out('Take Photo')}" style="display:none">
                                <svg style="fill:none" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon-camera">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                </svg>
                            </button>

                            <button class="btn-capturephoto" title="${this.out('Capture')}" style="display:none">
                                <svg style="fill:none" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon-camera">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                </svg>
                            </button>
                            <button type="button" class="btn-clearphoto" title="${this.out('Clear')}" style="display: none;">
                                <svg style="fill:none" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon-eraser">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" /><path d="M18 13.3l-6.3 -6.3" />
                                </svg>
                            </button>
                            <button type="button" class="btn-stopcamera" title="${this.out('Close')}" style="display: none;">
                                <svg style="fill:none" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon-close">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    `;
          this.appendHtml(fileInputWrapper, html);
          const video = divField.querySelector('.livevideo');
          const canvas = divField.querySelector('.photo-captured');
          const btnSelectFile2 = divField.querySelector('.btn-selectfile2');
          const btnTakePhoto2 = divField.querySelector('.btn-takephoto2');
          const btnCapturePhoto = divField.querySelector('.btn-capturephoto');
          const btnClearPhoto = divField.querySelector('.btn-clearphoto');
          const btnStopCamera = divField.querySelector('.btn-stopcamera');
          this.photoBlob = {};
          let videoStream;
          if (btnSelectFile2) btnSelectFile2.addEventListener('click', e => {
            e.preventDefault();
            btnSelectFile.click();
          });

          // Start Camera 
          const startCamera = async () => {
            const btnRemove = divField.querySelector('.btn-clearfile');
            if (btnRemove) btnRemove.click();
            try {
              videoStream = await navigator.mediaDevices.getUserMedia({
                video: true
              });
              video.srcObject = videoStream;
            } catch (error) {
              alert('Unable to access the camera.');
              video.style.display = 'none';
              btnCapturePhoto.style.display = 'none';
              btnStopCamera.style.display = 'none';
              divControls.style.display = 'none';
              fileNameDisplay.style.display = 'none';
            }
            setTimeout(() => {
              btnTakePhoto2.style.display = 'none';
              canvas.style.display = 'none';
              video.style.display = '';
              btnCapturePhoto.style.display = '';
              btnClearPhoto.style.display = 'none';
              if (btnSelectFile2) btnSelectFile2.style.display = 'none';
              btnTakePhoto2.style.display = 'none';
              btnStopCamera.style.display = '';
              divControls.style.display = 'none';
              fileNameDisplay.style.display = 'none';
            }, 100);
          };
          if (btnTakePhoto) btnTakePhoto.addEventListener('click', async e => {
            e.preventDefault();
            startCamera();
          });
          btnTakePhoto2.addEventListener('click', async e => {
            e.preventDefault();
            startCamera();
          });

          // Stop Camera
          btnStopCamera.addEventListener('click', () => {
            if (videoStream) {
              videoStream.getTracks().forEach(track => track.stop());
            }
            video.style.display = 'none';
            btnCapturePhoto.style.display = 'none';
            btnStopCamera.style.display = 'none';
            btnTakePhoto2.style.display = 'none';
            divControls.style.display = '';
            fileNameDisplay.style.display = '';
          });

          // Capture Photo
          btnCapturePhoto.addEventListener('click', e => {
            e.preventDefault();
            canvas.style.display = '';
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            // video.srcObject.getTracks().forEach(track => track.stop());
            videoStream.getTracks().forEach(track => track.stop());
            video.style.display = 'none';
            btnCapturePhoto.style.display = 'none';
            btnClearPhoto.style.display = '';
            if (btnSelectFile2) btnSelectFile2.style.display = '';
            btnTakePhoto2.style.display = '';
            btnStopCamera.style.display = 'none';
            canvas.toBlob(blob => {
              this.photoBlob[fieldName] = blob;
              fileInput.removeAttribute('required');
            }, 'image/jpeg');
            btnTakePhoto2.style.display = '';
            if (field.useImageMask) {
              const src = canvas.toDataURL('image/jpeg');
              objImageMask.setImage(src);
            }
          });

          // Clear Photo
          const clearPhoto = () => {
            this.photoBlob[fieldName] = null;
            canvas.style.display = 'none';
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

            // fileInput.value = ''; // Clear file input selection
            // fileInput.setAttribute('required', 'required'); // Reinstate required attribute
            if (input.value !== '') {
              if (field.isRequired) fileInput.removeAttribute('required');
            } else {
              if (field.isRequired) fileInput.setAttribute('required', 'required');
            }
            btnClearPhoto.style.display = 'none';
            if (btnSelectFile2) btnSelectFile2.style.display = 'none';
            btnTakePhoto2.style.display = 'none';
            divControls.style.display = '';
            fileNameDisplay.style.display = '';
          };
          btnClearPhoto.addEventListener('click', () => {
            clearPhoto();
          });
          const handleUrl = (url, initial) => {
            const extension = `.${url.split('.').pop().toLowerCase()}`;
            const isValidType = selectedFileTypes.some(fileType => fileType.extensions.split(', ').includes(extension));
            if (!isValidType) {
              // alert(this.out('Invalid file type.'));
              return;
            }
            let isImage = allowedFileTypes.images.some(fileType => fileType.extensions.split(', ').includes(extension));
            if (field.useImageMask) {
              if (!isImage) {
                // alert(this.out('Invalid file type.'));
                return;
              }
              objImageMask.loadUrl(url);
            }
            clearPhoto();
            fileNameDisplay.innerHTML = '';
            const div = document.createElement('div');
            // div.innerText = file.name;
            fileNameDisplay.appendChild(div);
            const btnRemove = document.createElement('button');
            btnRemove.className = 'btn-clearfile';
            btnRemove.innerHTML = `
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.4"  stroke-linecap="round"  stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" /><path d="M18 13.3l-6.3 -6.3" />
                            </svg>
                        `;
            fileNameDisplay.appendChild(btnRemove);
            btnRemove.addEventListener('click', e => {
              const divField = btnRemove.closest('.form-field');
              let imgPreview = divField.querySelector('.img-preview');
              if (imgPreview) imgPreview.remove();
              input.value = '';
              fileInput.value = '';
              fileNameDisplay.innerHTML = '';
              message.innerText = this.out(this.settings.fileUploadText);
              if (field.useImageMask) {
                objImageMask.clearImage();
              }
              const divSticky = document.querySelector('.formview-container .submit-container');
              if (divSticky) {
                setTimeout(() => {
                  this.stickyElement(divSticky);
                }, 1000);
              }
              e.preventDefault();
              e.stopImmediatePropagation();
            });

            // Check if the file is an image
            if (isImage) {
              let imgPreview = fileInputWrapper.querySelector('.formview-container .img-preview');

              // Create the image element if it doesn't exist
              if (!imgPreview) {
                imgPreview = document.createElement('img');
                imgPreview.className = 'img-preview';
                fileInputWrapper.appendChild(imgPreview);
              }
              imgPreview.src = url; // Set the image source
            } else {
              removeImagePreview();
            }

            // Trigger onChange
            if (!initial) {
              const json = this.getFormValues();
              if (this.settings.onInputChange) this.settings.onInputChange(json);
            }
            const divSticky = document.querySelector('.formview-container .submit-container');
            if (divSticky) {
              setTimeout(() => {
                this.stickyElement(divSticky);
              }, 1000);
            }
          };
          if (field.value) handleUrl(field.value, true);

          // Display file name and trigger onUpload event
          const handleFile = file => {
            if (file) {
              const isValidType = selectedFileTypes.some(fileType => {
                return fileType.type === file.type;
              });
              if (!isValidType) {
                alert(this.out('Invalid file type.'));
                // removeImagePreview();
                return;
              }
              if (field.useImageMask) {
                const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!imageTypes.includes(file.type)) {
                  alert(this.out('Invalid file type.'));
                  return;
                }
                objImageMask.loadImage(file);
              }
              clearPhoto();
              input.value = ''; // clear file input url

              // fileNameDisplay.innerHTML = file.name;
              fileNameDisplay.innerHTML = '';
              const div = document.createElement('div');
              div.innerText = file.name;
              fileNameDisplay.appendChild(div);
              const btnRemove = document.createElement('button');
              btnRemove.className = 'btn-clearfile';
              btnRemove.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            `;
              fileNameDisplay.appendChild(btnRemove);
              btnRemove.addEventListener('click', e => {
                const divField = btnRemove.closest('.form-field');
                let imgPreview = divField.querySelector('.img-preview');
                if (imgPreview) imgPreview.remove();

                // input.value = '';

                fileInput.value = '';
                fileNameDisplay.innerHTML = '';
                message.innerText = this.out(this.settings.fileUploadText);
                if (field.useImageMask) {
                  objImageMask.clearImage();
                }
                const divSticky = document.querySelector('.formview-container .submit-container');
                if (divSticky) {
                  setTimeout(() => {
                    this.stickyElement(divSticky);
                  }, 1000);
                }
                e.preventDefault();
                e.stopImmediatePropagation();
              });

              // Check if the file is an image
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                  let imgPreview = fileInputWrapper.querySelector('.formview-container .img-preview');

                  // Create the image element if it doesn't exist
                  if (!imgPreview) {
                    imgPreview = document.createElement('img');
                    imgPreview.className = 'img-preview';
                    fileInputWrapper.appendChild(imgPreview);
                  }
                  imgPreview.src = e.target.result; // Set the image source
                };
                reader.readAsDataURL(file); // Read the file as a data URL
              } else {
                removeImagePreview();
              }

              // Custom logic for ZIP files
              // if (file.type === 'application/zip') {
              // }

              // Trigger onUpload event (you can customize this function)
              // onUpload(file);

              // Trigger onChange
              const json = this.getFormValues();
              if (this.settings.onInputChange) this.settings.onInputChange(json);
              const divSticky = document.querySelector('.formview-container .submit-container');
              if (divSticky) {
                setTimeout(() => {
                  this.stickyElement(divSticky);
                }, 1000);
              }
            }
          };

          // Display file name and trigger onUpload event
          const handleMultipleFile = file => {
            if (file) {
              selectedFileTypes = selectedFileTypes.concat(allowedFileTypes.images);
              const isValidType = selectedFileTypes.some(fileType => {
                return fileType.type === file.type;
              });
              if (!isValidType) {
                alert(this.out('Invalid file type.'));
                // removeImagePreview();
                return;
              }
              const divImagePreview = document.createElement('div');
              divImagePreview.className = 'image-item';
              filePreviewContainer.appendChild(divImagePreview);
              const divInfo = document.createElement('div');
              divInfo.className = 'file-drop-info-highlight';
              divImagePreview.appendChild(divInfo);
              const div = document.createElement('div');
              div.innerText = file.name;
              divInfo.appendChild(div);
              const btnRemove = document.createElement('button');
              btnRemove.className = 'btn-clearfile';
              btnRemove.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            `;
              divInfo.appendChild(btnRemove);
              btnRemove.addEventListener('click', e => {
                const div = btnRemove.closest('.image-item');
                if (div) div.remove();
                const removeFile = fileToRemove => {
                  const dt = new DataTransfer();
                  const files = fileInput.files;
                  Array.from(files).forEach(file => {
                    if (file !== fileToRemove) {
                      dt.items.add(file); // re-add all files except the removed one
                    }
                  });
                  fileInput.files = dt.files; // update input
                };
                removeFile(file);
                const divSticky = document.querySelector('.formview-container .submit-container');
                if (divSticky) {
                  setTimeout(() => {
                    this.stickyElement(divSticky);
                  }, 1000);
                }
                e.preventDefault();
                e.stopImmediatePropagation();
              });
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                  let imgPreview = document.createElement('img');
                  imgPreview.className = 'img-preview';
                  divImagePreview.appendChild(imgPreview);
                  imgPreview.src = e.target.result; // Set the image source
                };
                reader.readAsDataURL(file); // Read the file as a data URL
              }

              // Trigger onChange
              const json = this.getFormValues();
              if (this.settings.onInputChange) this.settings.onInputChange(json);
              const divSticky = document.querySelector('.formview-container .submit-container');
              if (divSticky) {
                setTimeout(() => {
                  this.stickyElement(divSticky);
                }, 1000);
              }
            }
          };
        }
        if (type === 'email') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `email_label_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `email_label_${id}`;
          input.type = 'email';
          input.name = fieldName;
          input.className = 'inp-base';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('input', this.inputListener);
        }
        if (type === 'phone') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `phone_label_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `phone_label_${id}`;
          input.type = 'tel';
          input.name = fieldName;
          input.className = 'inp-base';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('input', this.inputListener);
        }
        if (type === 'url') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `url_label_${id}`);
          label.className = 'field-label';
          label.innerHTML = field.title + (field.isRequired ? ' <span class="text-red-500">*</span>' : '');
          divField.appendChild(label);
          if (field.fieldNote) {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
          }
          const input = document.createElement('input');
          input.id = `url_label_${id}`;
          input.type = 'url';
          input.name = fieldName;
          input.value = field.value || '';
          input.className = 'inp-base';
          input.placeholder = field.placeholder;
          if (field.isRequired) input.setAttribute('required', 'required');
          divField.appendChild(input);
          input.addEventListener('input', this.inputListener);
        }
        if (type === 'hidden') {
          let id = this.getId();
          const label = document.createElement('label');
          label.setAttribute('for', `hidden_label_${id}`);
          label.className = 'field-label hidden';
          label.innerText = field.title;
          divField.appendChild(label);
          const input = document.createElement('input');
          input.id = `hidden_label_${id}`;
          input.type = 'hidden';
          input.name = fieldName;
          input.value = field.value; // hidden value
          divField.appendChild(input);
        }

        /*
        if(field.fieldNote && type!=='slider') {
            const info = document.createElement('div');
            info.className = 'field-note';
            info.innerHTML = field.fieldNote;
            divField.appendChild(info);
            
            divField.classList.remove('field-color'); // for color field
        }
        */
      });
      if (this.settings.isBuilder) {
        const divField = document.createElement('div');
        divField.className = 'submit-container';
        form.appendChild(divField);
        let hideReset = true;
        if ('hideReset' in json) hideReset = json.hideReset;
        if (!hideReset) {
          const btnReset = document.createElement('button');
          btnReset.className = 'btn-resetform';
          const resetText = json.resetText || this.settings.resetText;
          btnReset.innerText = resetText;
          divField.appendChild(btnReset);
          btnReset.addEventListener('click', e => {
            e.preventDefault();
            const form = btnReset.closest('form');
            if (form) {
              form.reset();
              const btns = form.querySelectorAll('.btn-clearfile');
              btns.forEach(btn => {
                btn.click();
              });
              const sliders = form.querySelectorAll('.slider-container');
              sliders.forEach(slider => {
                const inputSlider = slider.querySelector('input');
                slider.querySelector('.current-value').textContent = inputSlider.value;
              });
            }
          });
          const fullWidthButton = json.fullWidthButton || false;
          if (fullWidthButton) {
            btnReset.classList.add('w-full');
          }
        }
        const btnSubmit = document.createElement('button');
        btnSubmit.className = 'btn-submitform';
        const buttonText = json.submitText || this.settings.submitText;
        btnSubmit.innerText = buttonText;
        divField.appendChild(btnSubmit);
        const fullWidthButton = json.fullWidthButton || false;
        if (fullWidthButton) {
          btnSubmit.classList.add('w-full');
        }
        if (this.settings.alwaysVisibleSubmit) divField.classList.add('always-visible');
        this.stickyElement(divField);

        /*
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent form submission
        
            const form = event.target; // The form element
            const formData = new FormData(form); // Collect form data
        
            const values = {};
            formData.forEach((value, key) => {
                if (values[key]) {
                    // If the key already exists (e.g., for checkboxes), append the value
                    values[key] = Array.isArray(values[key]) ? [...values[key], value] : [values[key], value];
                } else {
                    values[key] = value;
                }
            });
        
            if(this.settings.consoleLog) console.log(values);
             if(this.settings.formSubmitTestUrl) {
                fetch(this.settings.formSubmitTestUrl, {
                    method: 'POST',
                    body: formData,
                })
                    .then(response=>response.json())
                    .then(response=>{
                        if(this.settings.consoleLog) console.log(response);
                    });
            }
        });
        */

        // if(this.steps.length===0) 
        form.addEventListener('submit', async e => {
          e.preventDefault();
          if (this.steps && this.steps.length > 0) {
            this.process();
          }
        });
      } else {
        //---- Honeypot to protect forms ----
        let hidTitle = 'Reference Code:';
        let hidName = 'reference_code';
        let hidClassName = 'reference_code';
        const divField = document.createElement('div');
        divField.className = 'form-field ';
        divField.classList.add(hidClassName);
        form.appendChild(divField);
        let id = this.getId();
        const label = document.createElement('label');
        label.setAttribute('for', `short_text_label_${id}`);
        label.className = 'field-label';
        label.innerHTML = hidTitle;
        divField.appendChild(label);
        const input = document.createElement('input');
        input.id = `short_text_label_${id}`;
        input.type = 'text';
        input.name = hidName;
        input.autocomplete = 'off';
        input.setAttribute('aria-hidden', 'true');
        input.className = 'inp-base';
        divField.appendChild(input);
        //----

        //---- Container for Captcha ----
        if (this.settings.captchaContainer) {
          const captchaContainerClassName = this.settings.captchaContainerClassName;
          const divCaptcha = document.createElement('div');
          divCaptcha.className = 'captcha-container';
          if (captchaContainerClassName) divCaptcha.classList.add(captchaContainerClassName);
          form.appendChild(divCaptcha);
        }
        //----

        if (json.useSubmitButton) {
          const divField = document.createElement('div');
          divField.className = 'submit-container';
          form.appendChild(divField);
          let hideReset = true;
          if ('hideReset' in json) hideReset = json.hideReset;
          if (!hideReset) {
            const btnReset = document.createElement('button');
            btnReset.className = 'btn-resetform';
            const resetText = json.resetText || this.settings.resetText;
            btnReset.innerText = resetText;
            divField.appendChild(btnReset);
            btnReset.addEventListener('click', e => {
              e.preventDefault();
              const form = btnReset.closest('form');
              if (form) {
                form.reset();
                const btns = form.querySelectorAll('.btn-clearfile');
                btns.forEach(btn => {
                  btn.click();
                });
                const sliders = form.querySelectorAll('.slider-container');
                sliders.forEach(slider => {
                  const inputSlider = slider.querySelector('input');
                  slider.querySelector('.current-value').textContent = inputSlider.value;
                });
              }
            });
            const fullWidthButton = json.fullWidthButton || false;
            if (fullWidthButton) {
              btnReset.classList.add('w-full');
            }
          }
          const btnSubmit = document.createElement('button');
          btnSubmit.className = 'btn-submitform';
          const buttonText = json.submitText;
          btnSubmit.innerText = buttonText;
          divField.appendChild(btnSubmit);
          const fullWidthButton = json.fullWidthButton || false;
          if (fullWidthButton) {
            btnSubmit.classList.add('w-full');
          }
          if (this.settings.alwaysVisibleSubmit) divField.classList.add('always-visible');
          this.stickyElement(divField);
          btnSubmit.addEventListener('click', async e => {
            this.trigger('submit', e);
          });
          const formCustom = form.closest('form');
          if (formCustom) {
            formCustom.addEventListener('submit', async e => {
              if (this.steps && this.steps.length > 0) {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.process();
              }
            });
          } else {
            // Most likely not executed since the form must have <form> tag
            btnSubmit.addEventListener('click', async e => {
              if (this.steps && this.steps.length > 0) {
                e.preventDefault();
                this.process();
              }
            });
          }
        }
      }

      // Load results
      let resultElement, resultDiv;
      if (this.settings.resultSelector) {
        resultElement = document.querySelector(this.settings.resultSelector);
        resultElement.classList.add('result-wrapper');
        resultElement.innerHTML = '';
        resultDiv = document.createElement('div');
        resultDiv.classList.add('result-container');
        resultElement.appendChild(resultDiv);
      }
      if (json.elements && resultElement) json.elements.forEach(field => {
        if (!field.displayInOutput) return;
        if (field.type === 'spacer') {
          const div = document.createElement('div');
          div.className = 'form-spacer';
          if (field.spacerHeight && !isNaN(parseFloat(field.spacerHeight))) {
            div.style.height = field.spacerHeight + 'px';
          }
          resultDiv.appendChild(div);
          return;
        }
        if (field.type === 'separator') {
          const hr = document.createElement('hr');
          hr.style.borderTopColor = field.color;
          resultDiv.appendChild(hr);
          return;
        }
        if (field.type === 'html') {
          if (field.html) {
            const div = document.createElement('div');
            div.innerHTML = field.html;
            resultDiv.appendChild(div);
          }
          return;
        }
        if (field.type === 'heading') {
          const heading = document.createElement(field.heading || 'h2');
          heading.innerHTML = field.headingText || this.out('Your Heading Here!');
          resultDiv.appendChild(heading);
          return;
        }
        if (field.type === 'paragraph') {
          const paragraph = document.createElement('p');
          paragraph.innerHTML = field.paragraphText || this.out('Your paragraph content here!');
          resultDiv.appendChild(paragraph);
          return;
        }
        if (field.type === 'media') {
          if (field.tag === 'video') {
            const video = document.createElement('video');
            video.style.width = '100%';
            video.style.height = 'auto';
            video.controls = true;
            var source = document.createElement('source');
            source.src = field.url;
            source.type = 'video/mp4';
            video.appendChild(source);

            // video.innerHTML = "Your browser does not support the video element.";

            resultDiv.appendChild(video);
          } else if (field.tag === 'audio') {
            const audio = document.createElement('audio');
            audio.controls = true;
            let source = document.createElement('source');
            source.src = field.url;
            source.type = 'audio/mp3';
            audio.appendChild(source);

            // audio.innerHTML = "Your browser does not support the audio element.";

            resultDiv.appendChild(audio);
          } else if (field.tag === 'img') {
            const image = document.createElement('img');
            image.src = field.url;
            image.setAttribute('alt', this.out('Output Image'));
            resultDiv.appendChild(image);
          }
          return;
        }
        if (field.type === 'image') {
          const image = document.createElement('img');
          image.src = field.url;
          image.setAttribute('alt', this.out('Output Image'));
          resultDiv.appendChild(image);
          return;
        }
        if (field.type === 'video') {
          const video = document.createElement('video');
          video.style.width = '100%';
          video.style.height = 'auto';
          video.controls = true;
          let source = document.createElement('source');
          source.src = field.url;
          source.type = 'video/mp4';
          video.appendChild(source);

          // video.innerHTML = "Your browser does not support the video element.";

          resultDiv.appendChild(video);
          return;
        }
        if (field.type === 'audio') {
          const audio = document.createElement('audio');
          audio.controls = true;
          let source = document.createElement('source');
          source.src = field.url;
          source.type = 'audio/mp3';
          audio.appendChild(source);

          // audio.innerHTML = "Your browser does not support the audio element.";

          resultDiv.appendChild(audio);
          return;
        }
      });
    }

    // Load results
    if (this.settings.resultSelector) {
      const resultElement = document.querySelector(this.settings.resultSelector);
      resultElement.classList.add('result-wrapper');
    }
    if (this.settings.saveResults && this.settings.resultSelector) {
      if (localStorage.getItem('_results')) {
        try {
          this.previousResults = JSON.parse(localStorage.getItem('_results'));
          let s = localStorage.getItem('_results_html');
          const resultElement = document.querySelector(this.settings.resultSelector);
          resultElement.innerHTML = s;
          this.addResultTool();

          // setTimeout(()=>{
          //     if(this.settings.resultSelector) {
          //         const resultElement = document.querySelector(this.settings.resultSelector);
          //         if(resultElement) resultElement.style.height = `${resultElement.offsetHeight}px`; // prevent scroll change on re-run
          //     }
          // },3000);

          let links = resultElement.querySelectorAll('.link-download');
          links.forEach(link => {
            link.addEventListener('click', async e => {
              e.preventDefault();
              const url = e.target.href;
              try {
                // Fetch the image as a blob
                const response = await fetch(url, {
                  mode: 'cors'
                });
                if (!response.ok) throw new Error('Failed to fetch the image.');
                const blob = await response.blob();

                // Extract the original filename from the URL
                const filename = url.substring(url.lastIndexOf('/') + 1);

                // Create a temporary download link
                const tempLink = document.createElement('a');
                tempLink.href = URL.createObjectURL(blob);
                tempLink.download = filename; // Use the extracted filename
                tempLink.click();

                // Revoke the blob URL after download
                URL.revokeObjectURL(tempLink.href);
              } catch (error) {
                console.error('Error downloading the image:', error);
              }
            });
          });
        } catch (e) {
          // Do Nothing
        }
      }
    }
    const divSticky = document.querySelector('.formview-container .submit-container');
    if (divSticky) {
      setTimeout(() => {
        this.stickyElement(divSticky);
      }, 1000);
    }
  }
  async search(query) {
    let headers = {
      'Content-Type': 'application/json',
      ...this.settings.headers
    };
    try {
      const response = await fetch(this.settings.searchUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          customData: this.settings.customData
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();

      /*
      let organicResults;
      if(result.organic_results) { // SerpAPI, SecrhAPI, ScrapingDog
          organicResults = (result && result.organic_results ? result.organic_results.map(item => ({
              title: item.title,
              link: item.link,
              snippet: item.snippet
          })) : []) || [];
      } else if(result.organic) { // WebScrapingAPI
          organicResults = (result && result.organic ? result.organic.map(item => ({
              title: item.title,
              link: item.link,
              snippet: item.description
          })) : []) || [];
      }
      return organicResults;
      */

      const organicResultsKey = result.organic_results ? 'organic_results' : 'organic';
      return (result[organicResultsKey] || []).map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet || item.description
      }));
    } catch (error) {
      console.error('Error in search:', error.message || error);
      return [];
    }
  }
  async scrapeUrls(urls) {
    // const urls = ["example.com"]; 

    if (urls.length === 0) return {
      data: '',
      urls: [],
      failed: []
    };
    if (this.settings.consoleLog) console.log(urls);
    let headers = {
      'Content-Type': 'application/json',
      ...this.settings.headers
    };
    const response = await fetch(this.settings.scrapeUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        urls,
        customData: this.settings.customData
      })
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    let refs = '';
    const data = await response.json();
    if (this.settings.consoleLog) console.log(data);
    if (data.error) {
      if (this.settings.consoleLog) console.log(data.error);
      return {
        data: '',
        urls: [],
        failed: []
      };
    }
    let scrapedURLs = [];
    let failedURLs = [];
    if (this.settings.scrapeProvider === 'firecrawl') {
      // SearchAPI

      data.forEach(result => {
        if (result.success) {
          const title = result.metadata.title;
          const markdown = result.markdown;
          const url = result.metadata.url;
          scrapedURLs.push(url);
          refs += `


    ## ${title}

    Source: ${url}
                    
    ${markdown}


    ----------------


    `;
        } else {
          let url = result.url;
          if (url) {
            // If some succeed and some failed, the failed format will be like this:
            const url = result.url;
            failedURLs.push(url);
          } else {
            // if all failed, the format will be like this:
            // const title = result.url.title;
            // const markdown = result.url.snippet;
            url = result.url.link;
            failedURLs.push(url);
          }
        }
      });
    }
    if (this.settings.scrapeProvider === 'scrapingbee') {
      // ScrapingBee

      for (let i = 0; i < data.length; i++) {
        let url = urls[i];
        scrapedURLs.push(url);
        let markdown = data[i];
        refs += `
    
    
## ${url}
                
${markdown}


----------------


`;
      }

      /*
      data.forEach(result=>{
           if(result.success) {
               const title = result.url.title;
              const markdown = result.url.snippet;
              const url = result.url.link;
              scrapedURLs.push(url);
                   refs += `
        ## ${title}
      Source: ${url}
              
      ${markdown}
        ----------------
        `;
           } else {
              const title = result.url.title;
              const markdown = result.url.snippet;
              const url = result.url.link;
              failedURLs.push(url);
          }
      });
        // for(let i=0;i<data.length;i++) {
      //     let url = urls[i];
      //     scrapedURLs.push(url);
      //     refs = data[i];
      // }
      */
    }
    refs = `These are the information from the URLs:

${refs}
`;
    return {
      data: refs,
      urls: scrapedURLs,
      failed: failedURLs
    };
  }
  async checkPrompt(prompt) {
    let system = 'You are an assistant';
    let context = `This is user's request:

${prompt}        
        `;
    let question = `
Check if the request requires checking certain URLs. If so, returns the URLs.  
Also check if the request requires search to find answers by searching on the web to get the current relevant information.      
`;
    let functs = [{
      name: 'check_request',
      description: 'Check user request.',
      parameters: {
        type: 'object',
        properties: {
          needscrape: {
            type: 'boolean',
            description: 'Check the if request requires search on the web or not.'
          },
          url: {
            type: 'string',
            description: 'If request need to check certail URL, return the URL.'
          },
          url2: {
            type: 'string',
            description: 'If the request needs to check a certail URL, return the URL.'
          },
          url3: {
            type: 'string',
            description: 'If the request needs to check a certail URL, return the URL.'
          },
          url4: {
            type: 'string',
            description: 'If the request needs to check a certail URL, return the URL.'
          },
          url5: {
            type: 'string',
            description: 'If the request needs to check a certail URL, return the URL.'
          },
          url6: {
            type: 'string',
            description: 'If the request needs to check a certail URL, return the URL.'
          },
          url7: {
            type: 'string',
            description: 'If the request needs to check a certail URL, return the URL.'
          },
          url8: {
            type: 'string',
            description: 'If the request needs to check a certail URL, return the URL.'
          },
          needsearch: {
            type: 'boolean',
            description: 'Check the if request requires search on the web or not.'
          }
        },
        required: ['needsearch', 'needscrape']
      }
    }];
    let result = await this.send(question, context, system, '', functs);
    if (!result) {
      return false; //aborted
    }
    let args = JSON.parse(result);
    return args;
  }
  async getRelevantInfo(prompt, context, resultDiv) {
    // only called if search=true

    if (!this.settings.searchUrl && !this.settings.scrapeUrl) return {
      data: '',
      urls: [],
      failed: []
    };
    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status'); // Optionally style it
    resultDiv.appendChild(statusDiv);
    let newContext = '';
    let args = await this.checkPrompt(`${context}

${prompt}`);
    if (this.settings.consoleLog) console.log(args);
    // return {
    //     data: '',
    //     urls: [],
    //     failed: []
    // };

    let scrapedURLs = [];
    let failedURLs = [];
    if (args.url && args.needscrape && this.settings.scrapeUrl) {
      // console.log('scrape');
      // console.log(args);
      // return {
      //     data: '',
      //     urls: [],
      //     failed: []
      // };

      // Show status
      let p = document.createElement('p');
      p.innerHTML = this.out('Fetching data from the web...');
      statusDiv.appendChild(p);
      let urls = [];
      if (args.url) urls.push(args.url);
      if (args.url2) urls.push(args.url2);
      if (args.url3) urls.push(args.url3);
      if (args.url4) urls.push(args.url4);
      if (args.url5) urls.push(args.url5);
      if (args.url6) urls.push(args.url6);
      if (args.url7) urls.push(args.url7);
      if (args.url8) urls.push(args.url8);
      let result = await this.scrapeUrls(urls);
      newContext += result.data;
      scrapedURLs = result.urls;
      failedURLs = result.failed;
    } else if (this.settings.searchUrl && this.settings.scrapeUrl) {
      // console.log('search');
      // console.log(args);
      // return {
      //     data: '',
      //     urls: [],
      //     failed: []
      // };

      // Show status
      let p = document.createElement('p');
      p.innerHTML = this.out('Searching the web..');
      statusDiv.appendChild(p);
      let results = await this.search(prompt);

      // Exclude
      const exclude = this.settings.scrapeExclude; // Domains to exclude
      let filteredUrls = results.filter(item => {
        // Extract domain from the link
        let domain = new URL(item.link).hostname;
        // Check if the domain includes any of the exclude domains
        return !exclude.some(excludedDomain => domain.includes(excludedDomain));
      });

      // Limit
      const scrapeLimit = this.settings.scrapeLimit;
      const urlsToProcess = filteredUrls.slice(0, scrapeLimit); // Limit processing to the first 3 URLs

      // Scraping

      statusDiv.innerHTML = '';

      // Show status
      p = document.createElement('p');
      p.innerHTML = this.out('Getting more information...');
      statusDiv.appendChild(p);
      let urls = [];
      for (let i = 0; i < urlsToProcess.length; i++) {
        urls.push(results[i].link);
      }
      let result = await this.scrapeUrls(urls);

      // const urls = results.map(item => item.link); // Extract array of URLs
      // const urlsToProcess = urls.slice(0, 6); // Limit processing to the first 6 URLs

      // let result = await this.scrapeUrls(urlsToProcess);
      newContext += result.data;
      scrapedURLs = result.urls;
      failedURLs = result.failed;
    }

    /*
    if(args.needsearch && this.settings.searchUrl && this.settings.scrapeUrl) { // searcing is followed with scraping
     } else if(args.needscrape && this.settings.scrapeUrl) {
     }
    */

    return {
      data: newContext,
      urls: scrapedURLs,
      failed: failedURLs
    };
  }
  showDemoInfo(s) {
    if (!this.settings.resultSelector) {
      if (this.settings.consoleLog) console.log('resultSelector not set.');
      return;
    }
    const resultElement = document.querySelector(this.settings.resultSelector);
    resultElement.innerHTML = '';

    // Create a new div to contain the result of this request
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result-container');
    resultElement.appendChild(resultDiv);
    resultDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 20" width="27" height="20" fill="currentColor">
            <circle cx="15" cy="15" r="10">
                <animate attributeName="cy" dur="0.6s" values="15;5;15" repeatCount="indefinite"></animate>
            </circle>
            <circle cx="60" cy="15" r="10">
                <animate attributeName="cy" begin="0.2s" dur="0.6s" values="15;5;15" repeatCount="indefinite"></animate>
            </circle>
            <circle cx="105" cy="15" r="10">
                <animate attributeName="cy" begin="0.4s" dur="0.6s" values="15;5;15" repeatCount="indefinite"></animate>
            </circle>
        </svg>
        `;
    let preview;
    if (this.settings.isBuilder) {
      if (!this.settings.previewSelector) {
        if (this.settings.consoleLog) console.log('previewSelector not set.');
        return;
      }
      preview = document.querySelector(this.settings.previewSelector);
    } else {
      preview = this.element;
    }
    let btnSubmit = preview.querySelector('.btn-submitform');
    let buttonText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `&nbsp;
            <span class="loading-icon" style="width:60px;display:flex;align-items:center;justify-content:center">
                <svg class="animate-spin" style="margin: 0;width: 1.25rem;height: 1.25rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </span>
            &nbsp;
        `;
    setTimeout(() => {
      resultDiv.innerHTML = s;
      btnSubmit.innerHTML = buttonText;
    }, 400);
  }
  async process(stepIndex) {
    this.trigger('generate');
    this.payloads = [];
    this.output = [];
    this.mediaGenerated = [];
    this.needCleanup = false;
    this.outputHtml = '';

    // this.filesUploaded = {}; // clear (see: getInputURLs)

    if (!this.settings.resultSelector) {
      if (this.settings.consoleLog) console.log('resultSelector not set.');
      return;
    }
    const resultElement = document.querySelector(this.settings.resultSelector);
    if (!resultElement) {
      console.log('resultElement not found.');
      return;
    }
    let useMediaGeneration = false;
    let useSearch = false;
    this.steps.forEach(step => {
      if (step.prompt.trim().startsWith('{')) {
        // a JSON input
        useMediaGeneration = true;
      }
      if (step.tools && (step.tools.image || step.tools.video || step.tools.audio)) {
        useMediaGeneration = true;
      }
      if (step.tools && step.tools.search) {
        useSearch = true;
      }
    });
    let message;
    if (useMediaGeneration) {
      /*
      if(this.settings.demo) {
          message = `
              <div class="form-info">
                  <h3>Demo Info</h3> 
                  <p>
                  <b>This is an online demo, so AI media generation (images, videos, and audio) and the vision capability are currently disabled. In the full version, you’ll have access to all media generation features and the vision capability!</b>
                  </p>
              </div>`;
           this.showDemoInfo(message);
          return;
      } 
      */
      if (this.settings.disableMediaGeneration) {
        message = `
                <div class="form-info">
                    <h3>${this.out(this.settings.disableMediaGenerationTitle)}</h3> 
                    <p>
                        <b>${this.out(this.settings.disableMediaGenerationMessage)}</b>
                    </p>
                </div>`;
        this.showDemoInfo(message);
        return;
      }
    }
    if (!this.settings.scrapeUrl && useSearch) {
      if (this.settings.demo) {
        message = `
                <div class="form-info">
                    <h3>Demo Info</h3> 
                    <p>
                    <b>This is an online demo, so web searching and scraping features are currently disabled. In the full version, you’ll have access to all these features!</b>
                    </p>
                </div>`;
      } else {
        message = `
                    <div class="form-info">
                        <p>
                            <b>Web searching and scraping are currently disabled, so your request cannot be processed.</b>
                        </p>
                    </div>`;
      }
      this.showDemoInfo(message);
      return;
    }
    let preview;
    if (this.settings.isBuilder) {
      if (!this.settings.previewSelector) {
        if (this.settings.consoleLog) console.log('previewSelector not set.');
        return;
      }
      preview = document.querySelector(this.settings.previewSelector);
    } else {
      preview = this.element;
    }
    let btnSubmit = preview.querySelector('.btn-submitform');
    let buttonText = btnSubmit.innerHTML;
    this.tokenInput = 0;
    this.tokenOutput = 0;
    let singleStep = false;
    if (stepIndex !== undefined && stepIndex !== null) {
      singleStep = true;
    }
    this.singleStep = singleStep; // see upload.js
    if (!singleStep) {
      // see upload.js (getInputURLs)
      this.filesUploaded = {}; // Reset, only when not in single step mode. For single step, use previous.
    }
    if (this.isNormal && !singleStep) {
      if (this.isMediaGenerating) {
        alert(this.out('The media generation process cannot be aborted.'));
        return;
      }
      this.abort();
      // this.mediaAbort();

      btnSubmit.innerHTML = buttonText;
      btnSubmit.removeAttribute('disabled');
      this.isGenerating = false;
      // console.log('Normal Run is running. Aborted by Normal Run button.');
      return;
    }
    if (this.isNormal && singleStep) {
      // console.log('Normal Run is running. Single Run button is clicked. Do not proceed.');
      return;
    }
    if (this.isSingle && !singleStep) {
      // console.log('Single Run is running. Normal Run button is clicked. Do not proceed.');
      return;
    }
    if (this.isSingle && singleStep) {
      // console.log('Single Run is running. Single Run button is clicked. Do not proceed.');
      return;
    }
    this.isNormal = false;
    this.isSingle = false;
    if (!singleStep) {
      btnSubmit.innerHTML = `
                <span class="loading-icon">
                    <svg class="animate-spin" style="margin: 0;margin-right: 0.6rem;width: 1.25rem;height: 1.25rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
                ${this.out('Abort')}
            `;
      this.isNormal = true;
    } else {
      btnSubmit.innerHTML = `
                <span class="loading-icon">
                    <svg class="animate-spin" style="margin: 0;margin-right: 0.6rem;width: 1rem;height: 1rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
            `;
      this.isSingle = true;
    }
    this.isGenerating = true;
    let safeInput = (userInput, prompt) => {
      // if(!userInput) {
      //     // userInput can be undefined, for example, during run step when a file input is emptu.
      //     return '';
      // }
      if (userInput === undefined) return '';
      if (!isNaN(userInput)) return userInput; // if a number (eg. rgb value)
      let result = userInput;
      if (prompt && prompt.trim().startsWith('{')) {
        // a JSON
        result = JSON.stringify(userInput).slice(1, -1); // Escape input safely & remove the first and last quote
        // result = result.replace(/"/g, '\\"');
      }
      return result;
    };
    resultElement.innerHTML = '';

    // let requests = [...this.steps];
    let requests = JSON.parse(JSON.stringify(this.steps));
    let formValues = this.getFormValues();
    if (!formValues) return;
    if (formValues && Object.keys(formValues).length === 0) ; else {
      // Replace tags with base64 image if provider is google
      for (const item of requests) {
        let output = item.prompt;
        const provider = item.provider;
        if (provider === 'google') {
          // for json request
          for (const field of formValues) {
            if (field.value instanceof FileList) {
              const files = field.value;
              /*
              if (files.length > 1) { // TODO: REVIEW
                  let s='';
                  for (const file of files) {
                      const base64Data = await new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                              const data = e.target.result.split(',')[1];
                              resolve(data);
                          };
                          reader.onerror = reject;
                          reader.readAsDataURL(file);
                      });
              
                      if (s == '') {
                          s += `"${base64Data}"`;
                      } else {
                          s += `,"${base64Data}"`;
                      }
                  }
                  s=`[${s}]`;
                  output = output.replaceAll(`{{${field.name}}}`, s);
                  output = output.replaceAll(`{{${field.name.toUpperCase()}}}`, s);
              }
              */
              if (files.length > 0) {
                const file = field.value[0];
                if (!file) continue;
                const base64Data = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = e => {
                    const data = e.target.result.split(',')[1];
                    resolve(data);
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
                // console.log(base64Data)
                output = output.replaceAll(`{{${field.name}}}`, base64Data);
                output = output.replaceAll(`{{${field.name.toUpperCase()}}}`, base64Data);
              }
            }
          }
        }
        item.prompt = output;
      }

      // Replace form field tags in Prompt with values
      requests.forEach(item => {
        /*
        const parser = new DOMParser();
        const doc = parser.parseFromString(item.prompt, 'text/html');
        const tags = doc.querySelectorAll('span.tag');
         formValues.forEach(field => {
            tags.forEach(tag=>{
                const name = tag.getAttribute('data-name').toLowerCase();
                 if(name === field.name) {
                    if (field.value instanceof FileList) {
                        // const filename = field.value[0].name;
                        // const filetype = field.value[0].type;
                        tag.innerText = `${field.name}`;
                    } else if(field.value) {
                        tag.innerText = safeInput(field.value, item.prompt);
                    } else {
                        tag.innerText = field.name;
                    }
                }
            });
        });
         let output = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        */
        let output = item.prompt;
        formValues.forEach(field => {
          // if(!field.value) field.value = '';
          if (field.value === undefined) field.value = '';
          if (typeof field.value === 'object' && Array.isArray(field.value)) {
            // checkboxes
            const str = field.value.join(', ');
            output = output.replaceAll(`{{${field.name}}}`, str);
            output = output.replaceAll(`{{${field.name.toUpperCase()}}}`, str);
          } else if (field.value instanceof FileList || typeof field.value === 'string' && field.value.indexOf('base64') !== -1) {
            output = output.replaceAll(`{{${field.name}}}`, field.name);
            output = output.replaceAll(`{{${field.name.toUpperCase()}}}`, field.name);
          } else {
            output = output.replaceAll(`{{${field.name}}}`, safeInput(field.value, item.prompt)); // also replace normal {{tags}}
            output = output.replaceAll(`{{${field.name.toUpperCase()}}}`, safeInput(field.value, item.prompt));
          }
        });
        item.prompt = output;
      });

      // Replace form field tags in Context with values
      requests.forEach(item => {
        /*
        const parser = new DOMParser();
        const doc = parser.parseFromString(item.context, 'text/html');
        const tags = doc.querySelectorAll('span.tag');
         formValues.forEach(field => {
            tags.forEach(tag=>{
                const name = tag.getAttribute('data-name').toLowerCase();
                 if(name === field.name) {
                    if (field.value instanceof FileList) {
                        // const filename = field.value[0].name;
                        // const filetype = field.value[0].type;
                        tag.innerText = `${field.name}`;
                    } else if(field.value) {
                        tag.innerText = field.value;
                    } else {
                        tag.innerText = field.name;
                    }
                }
            });
        });
         let output = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        */
        let output = item.context;
        formValues.forEach(field => {
          if (!field.value) field.value = '';
          if (typeof field.value === 'object' && Array.isArray(field.value)) {
            // checkboxes
            const str = field.value.join(', ');
            output = output.replaceAll(`{{${field.name}}}`, str);
            output = output.replaceAll(`{{${field.name.toUpperCase()}}}`, str);
          } else if (field.value instanceof FileList || typeof field.value === 'string' && field.value.indexOf('base64') !== -1) {
            output = output.replaceAll(`{{${field.name}}}`, field.name);
            output = output.replaceAll(`{{${field.name.toUpperCase()}}}`, field.name);
          } else {
            output = output.replaceAll(`{{${field.name}}}`, safeInput(field.value, item.prompt)); // also replace normal {{tags}}
            output = output.replaceAll(`{{${field.name.toUpperCase()}}}`, safeInput(field.value, item.prompt));
          }
        });
        item.context = output;
      });
    }
    const handleRequest = async (prompt, context, provider, model, system, functs, tools, hideOutput) => {
      // Create a new div to contain the result of this request
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('result-container');
      resultElement.appendChild(resultDiv);
      resultDiv.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 20" width="27" height="20" fill="currentColor">
                <circle cx="15" cy="15" r="10">
                    <animate attributeName="cy" dur="0.6s" values="15;5;15" repeatCount="indefinite"></animate>
                </circle>
                <circle cx="60" cy="15" r="10">
                    <animate attributeName="cy" begin="0.2s" dur="0.6s" values="15;5;15" repeatCount="indefinite"></animate>
                </circle>
                <circle cx="105" cy="15" r="10">
                    <animate attributeName="cy" begin="0.4s" dur="0.6s" values="15;5;15" repeatCount="indefinite"></animate>
                </circle>
            </svg>
            `;

      // Check if prompt is a valid JSON.
      let validJSON = false;
      let jsonInput;
      if (prompt.trim().startsWith('{')) {
        // a JSON input
        try {
          jsonInput = JSON.parse(prompt);
          if (jsonInput && typeof jsonInput === 'object') {
            validJSON = true;
          }
        } catch (error) {
          resultDiv.innerHTML = `<p>${this.out('Incorrect JSON format.')}</p>`;
          return false;
        }
      }

      // Disable (Abort) button
      if (tools && (tools.image || tools.video || tools.audio) || validJSON) {
        if (!singleStep) {
          btnSubmit.innerHTML = `&nbsp;
                        <span class="loading-icon" style="width:60px;display:flex;align-items:center;justify-content:center">
                            <svg class="animate-spin" style="margin: 0;width: 1.25rem;height: 1.25rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        &nbsp;
                    `;
          btnSubmit.setAttribute('disabled', '');
        }
      }

      // Variable for typing effect
      let currentText = '';
      let currentHtml = '';

      // Searching & Scraping
      let info;
      if (tools && tools.search) {
        info = await this.getRelevantInfo(prompt, context, resultDiv);
        if (info.data !== '') context += `
Use the following information to answer the request:

${info.data}
`;
      }

      // Generating Media (Image, Video, Audio)
      if (tools && (tools.image || tools.video || tools.audio) || validJSON) {
        const mediaResult = await this.media.generate(prompt, context, provider, model, tools, resultDiv, hideOutput);
        this.needCleanup = true;
        if (this.settings.consoleLog) console.log(mediaResult);
        /*
        generate(() returns this format:
         {
            mediaGenerated: true/false,
            status: 'success'/'error',
            markdown, // for display
            output // array list of generated media
        }
        */

        if (mediaResult.mediaGenerated) {
          // return mediaResult.markdown;
          return {
            media: mediaResult.output,
            media2: mediaResult.output2,
            markdown: mediaResult.markdown
          };
        } else {
          resultDiv.innerHTML = `<p>${mediaResult.message}</p>`;
          return false; //stop loop (next step) if current step has error (~ aborted)
        }

        /*
        const isJsonObject = (variable) => {
            return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
        };
         if(isJsonObject(mediaResult)) { // contains details (eg. error message)
            if(!mediaResult.mediaGenerated) {
                resultDiv.innerHTML = `<p>${mediaResult.message}</p>`;
                 return false; //stop loop (next step) if current step has error (~ aborted)
            }
        } else if(mediaResult) { // contains result (string) for push to this.previousResults
            return mediaResult;
        } else {
            // Do Nothing (Continue)
        }
        */
      }

      // Request to OpenAI

      // If knowledge files exixts, use Assistants
      if (this.settings.assistantId) {
        // Prioritize Stream
        if (this.settings.assistantStreamUrl) {
          await this.assistantStream(prompt, context, system, functs, async chunk => {
            if (chunk && typeof chunk === 'object') ; else {
              // Append the chunk immediately to the container
              currentText += chunk;

              // Convert to HTML using `marked` and update container
              if (!hideOutput) {
                const htmlContent = marked.parse(currentText);
                resultDiv.innerHTML = htmlContent;
                currentHtml += htmlContent;
              } /* else {
                  resultDiv.innerHTML = '';
                  resultDiv.remove();
                } */

              // Simulate typing effect delay
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          });

          // Wait until all text has been fully rendered
          await new Promise(resolve => {
            const interval = setInterval(() => {
              if (resultDiv.innerHTML === marked.parse(currentText)) {
                clearInterval(interval);
                resolve();
              }
            }, 10);
          });
          if (hideOutput) {
            resultDiv.innerHTML = '';
            resultDiv.remove();
          }
          this.outputHtml += `<div class="result-container">${currentHtml}</div>`;
        } else if (this.settings.assistantUrl) {
          let result = await this.assistant(prompt, context, system, functs);
          if (!result) {
            return false; //aborted
          }
          currentText = result;
          if (!hideOutput) {
            const htmlContent = marked.parse(result);
            resultDiv.innerHTML = htmlContent;
            this.outputHtml += `<div class="result-container">${htmlContent}</div>`;
          } else {
            resultDiv.innerHTML = '';
            resultDiv.remove();
          }
        }
      } else {
        if (this.settings.sendCommandStreamUrl) {
          // Initialize variables
          let rawText = ''; // Holds the full, unprocessed text received from the server
          let rawHtml = '';
          let displayedText = ''; // Tracks the portion of text currently visible to the user

          // Function to simulate typing effect for a given chunk
          const simulateTypingEffect = async chunk => {
            let index = 0; // Tracks the position in the chunk

            while (index < chunk.length) {
              // Reveal one character at a time
              displayedText = rawText.slice(0, displayedText.length + 1);
              index++;

              // Convert to HTML using `marked` and update container
              if (!hideOutput) {
                const htmlContent = marked.parse(displayedText); // Parse the fully accumulated text
                resultDiv.innerHTML = htmlContent;
                rawHtml = htmlContent;
              } /* else {
                  resultDiv.innerHTML = '';
                  resultDiv.remove();
                } */

              // Simulate typing effect delay
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          };
          await this.sendStream(prompt, context, system, model, functs, async chunk => {
            /*
            // Append the chunk immediately to the container
            currentText += chunk;
                             // Convert to HTML using `marked` and update container
            if(!hideOutput) {
                const htmlContent = marked.parse(currentText);
                resultDiv.innerHTML = htmlContent;
            } else {
                resultDiv.innerHTML = '';
                resultDiv.remove();
            }
                             // Simulate typing effect delay
            await new Promise((resolve) => setTimeout(resolve, 50));
            */
            currentText += chunk;

            // Append the incoming chunk to the raw text buffer
            rawText += chunk;

            // Simulate typing effect for the new chunk
            await simulateTypingEffect(chunk);
          });

          // Wait until all text is displayed before reading `rawHtml`
          await new Promise(resolve => {
            const interval = setInterval(() => {
              if (displayedText.length === rawText.length) {
                clearInterval(interval);
                resolve();
              }
            }, 10);
          });
          if (hideOutput) {
            resultDiv.innerHTML = '';
            resultDiv.remove();
          }
          this.outputHtml += `<div class="result-container">${rawHtml}</div>`;
        } else {
          // this.settings.sendCommandUrl

          let result = await this.send(prompt, context, system, model, functs);
          if (!result) {
            return false; //aborted
          }
          currentText = result;
          if (!hideOutput) {
            const htmlContent = marked.parse(result);
            resultDiv.innerHTML = htmlContent;
            this.outputHtml += `<div class="result-container">${htmlContent}</div>`;
          } else {
            resultDiv.innerHTML = '';
            resultDiv.remove();
          }
        }
      }

      // Scraping Information
      if (!hideOutput) {
        let sources = '';
        const maxLength = 75; // Maximum length for the link text
        info && info.urls.forEach(url => {
          let linkText = url;
          if (linkText.length > maxLength) {
            linkText = linkText.slice(0, maxLength) + '...';
          }
          sources += `<div><a class="source_url" href="${url}">${linkText}</url></div>`;
        });
        info && info.failed.forEach(url => {
          let linkText = url;
          if (linkText.length > maxLength) {
            linkText = linkText.slice(0, maxLength) + '...';
          }
          sources += `<div><a class="source_url" style="opacity:0.5" href="${url}">${linkText}</url></div>`;
        });
        if (sources !== '') {
          const sourcesDiv = document.createElement('div');
          sourcesDiv.classList.add('result-container'); // Optionally style it
          resultElement.appendChild(sourcesDiv);
          sourcesDiv.innerHTML = sources;
        }
      }

      // Collect payload
      this.payloads.push({
        prompt,
        context
      });

      // Collect result
      this.output.push(currentText);

      /*
      const cleaning = (s) => {
          let startMarker = '```svg';
          let endMarker = '```';
               if (s.startsWith(startMarker) && s.endsWith(endMarker)) {
              let content = s.slice(startMarker.length, -endMarker.length).trim();
              return (content); // Outputs: ....bla bla ..
          } else {
              return s;
          }
      };
      const svgString = cleaning(currentText);
      const svgRegex = /^<svg[\s\S]*<\/svg>$/;
      const isValidSVG = svgRegex.test(svgString);
      if(isValidSVG) {
          const svgViewer = document.createElement('div');
          svgViewer.classList.add('result-container'); 
          svgViewer.innerHTML = svgString;
          resultElement.appendChild(svgViewer);
      }
          */

      // Return the final processed result
      // return currentText;

      return {
        media: [],
        markdown: currentText
      };
    };
    const handleRequestQueue = async requests => {
      this.previousResults = []; // Store results of each step
      this.outputHtml = '';
      for (let i = 0; i < requests.length; i++) {
        if (!this.isGenerating) {
          return; //aborted
        }
        let {
          prompt,
          context,
          provider,
          model,
          system,
          functs,
          tools,
          hideOutput
        } = requests[i];
        provider = provider || '';
        context = context || '';
        system = system || 'You are an assistant';
        functs = functs || [];

        // ----------- Replace tags in Prompt -----------

        /*
        let parser = new DOMParser();
        let doc = parser.parseFromString(prompt, 'text/html');
        let tags = doc.querySelectorAll('span.tag');
         // Replace content of <span data-name="OUTPUT_STEP_X">..</span> with actual previous results
        this.previousResults.forEach((result, index) => {
            // const placeholder = `{{output${index + 1}}}`;
            const placeholder = `output_step_${index + 1}`;
            
            tags.forEach(tag=>{
                const name = tag.getAttribute('data-name').toLowerCase();
                if(name === placeholder) {
                    tag.innerText = result;
                }
            });
        });
         let output = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        */
        let output = prompt;

        // Replace placeholders like {{output_step_1}}, {{output_step_2}} with actual previous results
        this.previousResults.forEach((result, index) => {
          const placeholder = `{{output_step_${index + 1}}}`;
          output = output.replace(new RegExp(placeholder, 'g'), safeInput(result, prompt));
          output = output.replace(new RegExp(placeholder.toUpperCase(), 'g'), safeInput(result, prompt));
        });

        // prompt = this.stripHtmlWithLineBreaks(output);
        prompt = output;
        prompt = prompt.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ').trim();
        if (this.settings.consoleLog) console.log(prompt); // check prompt
        // -----------------------------------------------

        // ----------- Replace tags in Context -----------

        /*
        parser = new DOMParser();
        doc = parser.parseFromString(context, 'text/html');
        tags = doc.querySelectorAll('span.tag');
         // Replace content of <span data-name="OUTPUT_STEP_X">..</span> with actual previous results
        this.previousResults.forEach((result, index) => {
            // const placeholder = `{{output${index + 1}}}`;
            const placeholder = `output_step_${index + 1}`;
            
            tags.forEach(tag=>{
                const name = tag.getAttribute('data-name').toLowerCase();
                if(name === placeholder) {
                    tag.innerText = result;
                }
            });
        });
         output = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        */
        output = context;

        // Replace placeholders like {{output_step_1}}, {{output_step_2}} with actual previous results
        this.previousResults.forEach((result, index) => {
          const placeholder = `{{output_step_${index + 1}}}`;
          output = output.replace(new RegExp(placeholder, 'g'), safeInput(result, prompt));
          output = output.replace(new RegExp(placeholder.toUpperCase(), 'g'), safeInput(result, prompt));
        });

        // context = this.stripHtmlWithLineBreaks(output);
        context = output;
        context = context.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ').trim();

        // if(this.settings.consoleLog) console.log(context); // check context
        // -----------------------------------------------

        // Get the result for the current step
        let result = await handleRequest(prompt, context, provider, model, system, functs, tools, hideOutput);
        if (!result) {
          break;
        }
        /*
        result = {
            media: [],
            markdown: '...'
        }
        */

        this.mediaGenerated.push(...result.media);

        // Store the result to use in the next step
        // this.previousResults.push(result.markdown);
        if (result.media && result.media.length === 1) {
          // result.media2 contains remote url result from Fal or Replicate
          // result.media contains saved result (local or AWS)
          // For workflow steps, use result.media2. For display, use result.media.
          let url1 = result.media[0];
          let url2 = result.media2 && result.media2.length === 1 && result.media2[0];
          this.previousResults.push(url2 || url1);
          if (hideOutput) {
            // Output mask needs to be deleted if the step has hideOutput=true
            this.filesUploaded[`output_step_${i}`] = url1;
          }
        } else {
          this.previousResults.push(result.markdown);
        }
      }
    };

    // Process all requests sequentially
    if (!singleStep) {
      await handleRequestQueue(requests);
    }
    if (singleStep) {
      if (stepIndex === 0) this.previousResults = [];
      const doStep = async (requests, stepIndex) => {
        if (!this.isGenerating) {
          return; //aborted
        }
        let {
          prompt,
          context,
          provider,
          model,
          system,
          functs,
          tools,
          hideOutput
        } = requests[stepIndex];
        context = context || '';
        system = system || 'You are an assistant';
        functs = functs || [];

        // ----------- Replace tags in Prompt -----------

        /*
        let parser = new DOMParser();
        let doc = parser.parseFromString(prompt, 'text/html');
        let tags = doc.querySelectorAll('span.tag');
         // Replace content of <span data-name="OUTPUT_STEP_X">..</span> with actual previous results
        this.previousResults && this.previousResults.forEach((result, index) => {
            // const placeholder = `{{output${index + 1}}}`;
            const placeholder = `output_step_${index + 1}`;
            
            tags.forEach(tag=>{
                const name = tag.getAttribute('data-name').toLowerCase();
                if(name === placeholder) {
                    tag.innerText = result;
                }
            });
        });
         let output = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        */
        let output = prompt;

        // Replace placeholders like {{output_step_1}}, {{output_step_2}} with actual previous results
        this.previousResults && this.previousResults.forEach((result, index) => {
          const placeholder = `{{output_step_${index + 1}}}`;
          output = output.replace(new RegExp(placeholder, 'g'), result);
          output = output.replace(new RegExp(placeholder.toUpperCase(), 'g'), result);
        });

        // prompt = this.stripHtmlWithLineBreaks(output);
        prompt = output;
        prompt = prompt.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ').trim();
        if (this.settings.consoleLog) console.log(prompt); // check prompt
        // -----------------------------------------------

        // ----------- Replace tags in Context -----------

        /*
        parser = new DOMParser();
        doc = parser.parseFromString(context, 'text/html');
        tags = doc.querySelectorAll('span.tag');
         // Replace content of <span data-name="OUTPUT_STEP_X">..</span> with actual previous results
        this.previousResults && this.previousResults.forEach((result, index) => {
            // const placeholder = `{{output${index + 1}}}`;
            const placeholder = `output_step_${index + 1}`;
            
            tags.forEach(tag=>{
                const name = tag.getAttribute('data-name').toLowerCase();
                if(name === placeholder) {
                    tag.innerText = result;
                }
            });
        });
         output = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        */
        output = context;

        // Replace placeholders like {{output_step_1}}, {{output_step_2}} with actual previous results
        this.previousResults && this.previousResults.forEach((result, index) => {
          const placeholder = `{{output_step_${index + 1}}}`;
          output = output.replace(new RegExp(placeholder, 'g'), result);
          output = output.replace(new RegExp(placeholder.toUpperCase(), 'g'), result);
        });

        // context = this.stripHtmlWithLineBreaks(output);
        context = output;
        context = context.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ').trim();
        if (this.settings.consoleLog) console.log(context); // check context
        // -----------------------------------------------

        // Get the result for the current step
        let result = await handleRequest(prompt, context, provider, model, system, functs, tools, hideOutput);
        if (!result) {
          return;
        }
        /*
        result = {
            media: [],
            markdown: '...'
        }
        */

        this.mediaGenerated.push(...result.media);

        // Store the result to use in the next step
        // this.previousResults.push(result);
        if (!this.previousResults) return;
        // this.previousResults[stepIndex] = result.markdown;
        if (result.media && result.media.length === 1) {
          // result.media2 contains remote url result from Fal or Replicate
          // result.media contains saved result (local or AWS)
          // For workflow steps, use result.media2. For display, use result.media.
          let url1 = result.media[0];
          let url2 = result.media2 && result.media2.length === 1 && result.media2[0];
          this.previousResults[stepIndex] = url2 || url1;
          if (hideOutput) {
            // Output mask needs to be deleted if the step has hideOutput=true
            this.filesUploaded[`output_step_${stepIndex}`] = url1;
          }
        } else {
          this.previousResults[stepIndex] = result.markdown;
        }
      };
      await doStep(requests, stepIndex);

      // console.log(this.previousResults);
    }
    btnSubmit.innerHTML = buttonText;
    btnSubmit.removeAttribute('disabled');
    this.isGenerating = false;
    const cost = this.calculateCost();
    if (this.settings.onUsage) this.settings.onUsage(cost);
    this.trigger('usage', cost);
    this.isNormal = false;
    this.isSingle = false;
    const extractPreview = (htmlString, maxLength = 100) => {
      const div = document.createElement('div');
      div.innerHTML = htmlString;

      // Check for embedded content like video, image, or audio
      if (div.querySelector('video')) {
        return 'Video';
      } else if (div.querySelector('img')) {
        return 'Image';
      } else if (div.querySelector('audio')) {
        return 'Audio';
      }

      // Get the text content and trim whitespace
      const text = div.textContent.trim();

      // Return the first part of the text up to maxLength
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Final Cleanup
    const isEmpty = Object.keys(this.filesUploaded).length === 0 && this.filesUploaded.constructor === Object;
    if (this.needCleanup && !isEmpty) {
      if (this.settings.consoleLog) {
        console.log('Cleanup');
        console.log(this.filesUploaded);
      }
      let headers = {
        'Content-Type': 'application/json',
        ...this.settings.headers
      };
      await fetch(this.settings.cleanup, {
        method: 'POST',
        headers,
        body: JSON.stringify(this.filesUploaded)
      });
    }

    // Cleanup this.mediaGenerated to exclude deleted files (that are not displayed in html)
    let html = this.outputHtml; //resultElement.innerHTML;
    this.mediaGenerated = this.mediaGenerated.filter(url => html.indexOf(url) !== -1);
    this.trigger('resultReady', {
      previewText: extractPreview(html),
      markdown: this.previousResults,
      html: html,
      media: this.mediaGenerated,
      // return the collected generated media from all steps
      input: this.payloads,
      output: this.output
    });

    // Save results
    if (this.settings.saveResults) {
      localStorage.setItem('_results', JSON.stringify(this.previousResults));
      localStorage.setItem('_results_html', html);

      // setTimeout(()=>{
      //     if(this.settings.resultSelector) {
      //         const resultElement = document.querySelector(this.settings.resultSelector);
      //         if(resultElement) resultElement.style.height = `${resultElement.offsetHeight}px`; // prevent scroll change on re-run
      //     }
      // },3000);
    }
    this.addResultTool();
    let links = resultElement.querySelectorAll('.link-download');
    links.forEach(link => {
      link.addEventListener('click', async e => {
        e.preventDefault();
        const url = e.target.href;
        try {
          // Fetch the image as a blob
          const response = await fetch(url, {
            mode: 'cors'
          });
          if (!response.ok) throw new Error('Failed to fetch the image.');
          const blob = await response.blob();

          // Extract the original filename from the URL
          const filename = url.substring(url.lastIndexOf('/') + 1);

          // Create a temporary download link
          const tempLink = document.createElement('a');
          tempLink.href = URL.createObjectURL(blob);
          tempLink.download = filename; // Use the extracted filename
          tempLink.click();

          // Revoke the blob URL after download
          URL.revokeObjectURL(tempLink.href);
        } catch (error) {
          console.error('Error downloading the image:', error);
        }
      });
    });

    // const scrollableParent = this.getScrollableParent(resultElement);
    // if(scrollableParent) {
    //     resultElement.style.height = `${scrollableParent.offsetHeight/2}px`;
    //     scrollableParent.scrollTo({ top: preview.offsetHeight, behavior: 'smooth' });
    // }
  }
  calculateCost() {
    const inputCost = this.settings.inputCost / 1000000;
    const outputCost = this.settings.outputCost / 1000000;
    const inputCostTotal = this.tokenInput * inputCost;
    const outputCostTotal = this.tokenOutput * outputCost;
    const totalCost = inputCostTotal + outputCostTotal;
    return totalCost; //.toFixed(10); 
  }
  /*
  stripHtmlWithLineBreaks(input) {
      if(!input) return '';
      // Replace block-level tags with line breaks
      input = input.replace(/<\/?(p|br|div|h[1-6]|li|ul|ol|blockquote|pre)[^>]*>/gi, '\n');
  
      // Replace multiple consecutive line breaks with a single line break
      input = input.replace(/\n\s*\n/g, '\n');
  
      // Strip all remaining HTML tags
      input = input.replace(/<[^>]+>/g, '');
  
      // Trim leading and trailing whitespace and return
      return input.trim();
  }
  */
  render() {
    // const element = this.element;
    const element = document.querySelector(this.settings.builderSelector);
    if (!element.querySelector('.fields-container')) {
      let id = this.getId();
      let htmlFieldTypes = '';
      const fieldTypes = this.settings.fieldTypes;
      fieldTypes.forEach(item => {
        if (item === 'short-text') {
          htmlFieldTypes += `
                        <button data-type="short-text" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 6l16 0" />
                                <path d="M4 12l10 0" />
                            </svg>
                            ${this.out('Short Text')}
                        </button>
                    `;
        }
        if (item === 'long-text') {
          htmlFieldTypes += `
                        <button data-type="long-text" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mb-1 mt-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                            </svg>
                            ${this.out('Long Text')}
                        </button>
                    `;
        }
        if (item === 'number') {
          htmlFieldTypes += `
                        <button data-type="number" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="size-5 mb-1 mt-1" style="transform:scale(0.8)">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                            </svg>
                            ${this.out('Number')}
                        </button>
                    `;
        }
        if (item === 'slider') {
          htmlFieldTypes += `
                        <button data-type="slider" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="mb-1 mt-1" style="width:21px;height:21px">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                <path d="M4 12l2 0" /><path d="M10 12l10 0" />
                            </svg>
                            ${this.out('Slider')}
                        </button>
                    `;
        }
        if (item === 'switch') {
          htmlFieldTypes += `
                        <button data-type="switch" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M2 6m0 6a6 6 0 0 1 6 -6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6z" />
                            </svg>
                            ${this.out('Switch')}
                        </button>
                    `;
        }
        if (item === 'select') {
          htmlFieldTypes += `
                        <button data-type="select" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" />
                            </svg>
                            ${this.out('Select')}
                        </button>
                    `;
        }
        if (item === 'multi-select') {
          htmlFieldTypes += `
                        <button data-type="multi-select" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path stroke="none" d="M0 0h24v24H0z" /><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /><path d="M11 14l2 2l4 -4" />
                            </svg>
                            ${this.out('Multi Select')}
                        </button>
                    `;
        }
        if (item === 'date') {
          htmlFieldTypes += `
                        <button data-type="date" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.1"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1" style="transform:scale(1.04)">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" />
                            </svg>
                            ${this.out('Date')}
                        </button>
                    `;
        }
        if (item === 'time') {
          htmlFieldTypes += `
                        <button data-type="time" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 1a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z" /><path d="M12 7v5l3 3" /><path d="M4 12h1" /><path d="M19 12h1" /><path d="M12 19v1" />
                            </svg>
                            ${this.out('Time')}
                        </button>
                    `;
        }
        if (item === 'datetime') {
          htmlFieldTypes += `
                        <button data-type="datetime" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.1"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1" style="transform:scale(1.04)">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" /><path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M15 3v4" /><path d="M7 3v4" /><path d="M3 11h16" /><path d="M18 16.496v1.504l1 1" />
                            </svg>
                            ${this.out('Datetime')}
                        </button>
                    `;
        }
        if (item === 'color2') {
          htmlFieldTypes += `
                        <button data-type="color" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-9 1.732a8 8 0 0 0 4.001 14.928l-.001 -16a8 8 0 0 0 -4 1.072" />
                            </svg>
                            ${this.out('Color')}
                        </button>
                    `;
        }
        if (item === 'color') {
          htmlFieldTypes += `
                        <button data-type="color" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" /><path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                            </svg>
                            ${this.out('Color')}
                        </button>
                    `;
        }
        if (item === 'file') {
          htmlFieldTypes += `
                        <button data-type="file" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                            ${this.out('Upload')}
                        </button>
                    `;
        }
        if (item === 'multifile') {
          htmlFieldTypes += `
                        <button data-type="multifile" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                            ${this.out('Multi Upload')}
                        </button>
                    `;
        }
        if (item === 'dropdown') {
          htmlFieldTypes += `
                        <button data-type="dropdown" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mb-1 mt-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                            </svg>
                            ${this.out('Dropdown')}
                        </button>
                    `;
        }
        if (item === 'email') {
          htmlFieldTypes += `
                        <button data-type="email" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.4" stroke="currentColor" class="size-5 mb-1 mt-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            ${this.out('Email')}
                        </button>

                    `;
        }
        if (item === 'phone') {
          htmlFieldTypes += `
                        <button data-type="phone" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>
                            ${this.out('Phone')}
                        </button>
                    `;
        }
        if (item === 'url') {
          htmlFieldTypes += `
                        <button data-type="url" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                            </svg>
                            ${this.out('URL')}
                        </button>
                    `;
        }
        if (item === 'hidden') {
          htmlFieldTypes += `
                        <button data-type="hidden" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                            </svg>
                            ${this.out('Hidden')}
                        </button>
                    `;
        }
        if (item === 'spacer') {
          htmlFieldTypes += `
                        <button data-type="spacer" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 10v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1 -1v-3" />
                            </svg>
                            ${this.out('Spacer')}
                        </button>
                    `;
        }
        if (item === 'separator') {
          htmlFieldTypes += `
                        <button data-type="separator" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 12h16" />
                            </svg>
                            ${this.out('Separator')}
                        </button>
                    `;
        }
        if (item === 'html') {
          htmlFieldTypes += `
                        <button data-type="html" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 16v-8l2 5l2 -5v8" /><path d="M1 16v-8" /><path d="M5 8v8" /><path d="M1 12h4" /><path d="M7 8h4" /><path d="M9 8v8" /><path d="M20 8v8h3" />
                            </svg>
                            ${this.out('HTML')}
                        </button>
                    `;
        }
        if (item === 'heading') {
          htmlFieldTypes += `
                        <button data-type="heading" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 12h10" /><path d="M7 5v14" /><path d="M17 5v14" /><path d="M15 19h4" /><path d="M15 5h4" /><path d="M5 19h4" /><path d="M5 5h4" />
                            </svg>
                            ${this.out('Heading')}
                        </button>
                    `;
        }
        if (item === 'paragraph') {
          htmlFieldTypes += `
                        <button data-type="paragraph" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1" style="transform:scale(0.9)">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 4v16" /><path d="M17 4v16" /><path d="M19 4h-9.5a4.5 4.5 0 0 0 0 9h3.5" />
                            </svg>
                            ${this.out('Paragraph')}
                        </button>
                    `;
        }
        if (item === 'media') {
          htmlFieldTypes += `
                        <button data-type="media" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.7"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
                            </svg>
                            ${this.out('Media')}
                        </button>
                    `;
        }
        if (item === 'image') {
          htmlFieldTypes += `
                        <button data-type="image" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.7"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
                            </svg>
                            ${this.out('Image')}
                        </button>
                    `;
        }
        if (item === 'video') {
          htmlFieldTypes += `
                        <button data-type="video" class="btn-selectfield">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.4"  stroke-linecap="round"  stroke-linejoin="round"  class="size-5 mb-1 mt-1">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M8 4l0 16" /><path d="M16 4l0 16" /><path d="M4 8l4 0" /><path d="M4 16l4 0" /><path d="M4 12l16 0" /><path d="M16 8l4 0" /><path d="M16 16l4 0" />
                            </svg>
                            ${this.out('Video')}
                        </button>
                    `;
        }
        if (item === 'audio') {
          htmlFieldTypes += `
                        <button data-type="audio" class="btn-selectfield">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" class="size-5 mb-1 mt-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"></path>
                            </svg>
                            ${this.out('Audio')}
                        </button>
                    `;
        }
      });
      const html = `
                <div class="form-header">
                    <h1 class="form-title"><span contentEditable="true"></span></h1>
                    <p class="form-desc"><span contentEditable="true"></span></p>
                </div>
            
                <div class="fields-container"></div>

                <button class="btn-addfield" aria-expanded="false" aria-controls="fieldTypePopup_${id}">
                    
                    <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    <span>${this.out('Add Element')}</span>

                </button>

                ${this.settings.demo ? `
                    <p class="demo-info">
                        <b>License Info:</b> a developer license is required to use the library.
                    </p>
                ` : ''}

            `;

      // Render popup
      const builderStuffHtml = `
            <div id="fieldTypePopup_${id}" class="popup-fields hidden" role="dialog" aria-hidden="true" aria-label="${this.out('Add Element')}">
                <div class="flex flex-wrap">
                    ${htmlFieldTypes}
                </div>
            </div>
            `;
      let builderStuff = document.querySelector('#_fbhtml');
      builderStuff.insertAdjacentHTML('afterbegin', builderStuffHtml);
      const div = document.createElement('div');
      // div.classList.add('formbuilder-container');
      div.classList.add('flex');
      div.classList.add('flex-col');
      div.insertAdjacentHTML('afterbegin', html);
      element.appendChild(div);
      this.initializeEventListeners(element);
    }
  }
  hideTemplates() {
    let formTemplatesContainer = document.querySelector('.formtemplates-container');
    if (formTemplatesContainer) formTemplatesContainer.classList.add('hidden');
  }
  async loadTemplates() {
    if (!this.settings.templatesUrl) {
      console.log(this.out('Template URL is not set.'));
      return;
    }
    let element = document.querySelector(this.settings.templatesSelector);
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('formtemplates-container');
      element.classList.add('fb-ui');
      const response = await fetch(this.settings.templatesUrl, {
        method: 'GET'
      });
      let result = await response.json();
      let templates = result.data;
      element.innerHTML = '';
      let templatesReady = templates.filter(item => {
        const supports = item.supports || [];

        // Always include apps with no dependencies
        if (supports.length === 0) return true;
        const {
          fal,
          replicate,
          web,
          openai,
          google
        } = this.settings.templatesConfig;

        // Web feature check
        if (!web && supports.includes('web')) return false;

        // Google feature check
        if (!google && supports.includes('google')) return false;

        // OpenAI feature check
        if (!openai && supports.includes('openai')) return false;

        // Fal & Replicate:

        // Both features disabled
        if (!fal && !replicate) {
          return !(supports.includes('fal') || supports.includes('replicate'));
        }

        // Only FAL disabled
        if (!fal && supports.includes('fal')) {
          return supports.includes('replicate');
        }

        // Only Replicate disabled
        if (!replicate && supports.includes('replicate')) {
          return supports.includes('fal');
        }
        return true;
      });
      templates = templatesReady;

      // filters
      const categories = this.settings.templateFilters; // ['all', 'image', 'video', 'audio', 'web', 'text'],
      const apps = {
        all: {
          desc: this.out('All')
        },
        image: {
          desc: this.out('Image')
        },
        video: {
          desc: this.out('Video')
        },
        audio: {
          desc: this.out('Audio')
        },
        web: {
          desc: this.out('Web')
        },
        text: {
          desc: this.out('Text')
        }
      };
      const divFilter = document.createElement('div');
      divFilter.className = 'app-filters';
      element.appendChild(divFilter);
      const divList = document.createElement('ul');
      divList.className = 'app-list';
      element.appendChild(divList);
      const selectCategory = selectedCategory => {
        const filteredTemplates = templates.filter(template => {
          return selectedCategory === 'all' || template.categories.includes(selectedCategory);
        });
        this.renderList(filteredTemplates, divList);
      };

      // Render category buttons
      categories.forEach(selectedCategory => {
        const button = document.createElement('button');
        button.textContent = apps[selectedCategory].desc;
        button.setAttribute('data-value', selectedCategory);
        if (selectedCategory === 'all') {
          button.classList.add('active');
        }
        button.addEventListener('click', () => {
          const btns = divFilter.querySelectorAll('button');
          btns.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          selectCategory(selectedCategory);
        });
        divFilter.appendChild(button);
      });
      selectCategory('all');
    }
  }

  // Render templates
  renderList(filteredData, divList) {
    divList.innerHTML = '';
    filteredData.forEach(item => {
      if (item.name) {
        const li = document.createElement('li');
        divList.appendChild(li);
        const link = document.createElement('a');
        link.setAttribute('href', '#');
        let path = this.settings.assetsFolder;
        let thumbnail = item.form.thumbnail;
        let thumbnailHtml = '';
        if (path && thumbnail) {
          let filePath = path + thumbnail;
          thumbnailHtml = `<img class="thumbnail" src="${filePath}" alt="${item.name}" />`;
          if (item.form.thumbnailFit) {
            thumbnailHtml = `<img class="thumbnail" style="object-fit:${item.form.thumbnailFit}" src="${filePath}" alt="${item.name}" />`;
          }
        }
        const divButtons = document.createElement('div');
        divButtons.className = 'div-template-buttons';
        let view = false;
        let use = false;
        if (this.settings.templateButtons && this.settings.templateButtons.viewButton && this.settings.templateButtons.viewButton.text) {
          const btnView = document.createElement('button');
          btnView.className = 'btn-template-view';
          btnView.innerText = this.out(this.settings.templateButtons.viewButton.text);
          divButtons.appendChild(btnView);
          btnView.addEventListener('click', e => {
            e.preventDefault();
            if (this.isGenerating) {
              alert(this.out('Please wait until generation is complete.'));
              return;
            }
            if (this.settings.onSelectTemplate) this.settings.onSelectTemplate(item);
            this.trigger('templateView', item);
          });
          view = true;
        }
        if (this.settings.templateButtons && this.settings.templateButtons.useButton && this.settings.templateButtons.useButton.text) {
          const btnUse = document.createElement('button');
          btnUse.className = 'btn-template-use';
          btnUse.innerText = this.out(this.settings.templateButtons.useButton.text);
          divButtons.appendChild(btnUse);
          btnUse.addEventListener('click', e => {
            e.preventDefault();
            if (this.settings.onSelectTemplate) this.settings.onSelectTemplate(item);
            this.trigger('templateUse', item);
          });
          use = true;
        }
        link.innerHTML = `
                    ${thumbnailHtml}
                    <div class="card-text">
                        <div class="title">${item.name}</div>
                        <div class="description">${item.form.description}</div>
                        ${item.info ? ` <div class="info mt-1">${item.info}</div>` : ''}
                    </div>
                `;
        if (view || use) {
          link.querySelector('.card-text').appendChild(divButtons);
          link.classList.remove('cursor-pointer');
          link.classList.add('cursor-default');
        } else {
          link.classList.add('cursor-pointer');
          link.classList.remove('cursor-default');
        }
        li.appendChild(link);
        if (!(view || use)) link.addEventListener('click', e => {
          e.preventDefault();
          if (this.isGenerating) {
            alert(this.out('Please wait until generation is complete.'));
            return;
          }
          if (this.settings.onSelectTemplate) this.settings.onSelectTemplate(item);
          this.trigger('templateSelect', item);
        });
      }
    });
  }
  hideWorkflow() {
    let formWorkflowContainer = document.querySelector('.formworkflow-container');
    if (formWorkflowContainer) formWorkflowContainer.classList.add('hidden');
  }
  loadWorkflow(jsonText) {
    if (!jsonText) return;
    const element = document.querySelector(this.settings.workflowSelector);
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('formworkflow-container');
      element.classList.add('fb-ui');
      if (!element.querySelector('.btn-addstep')) {
        let div = document.createElement('div');
        div.className = 'inner-container';
        element.appendChild(div);
        const header = document.createElement('div');
        header.className = 'flex flex-col gap-1 mb-4';
        div.appendChild(header);
        const title = document.createElement('div');
        title.className = 'workflow-title';
        title.innerText = this.out('Workflow');
        header.appendChild(title);
        const tagline = document.createElement('div');
        tagline.className = 'workflow-tagline';
        tagline.innerText = this.out('Automate Your Form Processing with AI.');
        header.appendChild(tagline);
        const flowWrap = document.createElement('div');
        flowWrap.className = 'steps-container';
        div.appendChild(flowWrap);
        const btnAddStep = document.createElement('button');
        btnAddStep.className = 'btn-addstep';
        btnAddStep.innerHTML = `
                <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                </svg>
                <span>${this.out('Add Step')}</span>
                `;
        div.appendChild(btnAddStep);

        // Assistants API
        if (this.settings.assistantId) {
          this.showKnowledgeUpload();
        }
        btnAddStep.addEventListener('click', () => {
          const step = {
            prompt: '',
            context: ''
          };
          addStep(step, this.steps.length);

          // Update
          this.steps.push(step);
          let workflow = {
            steps: this.steps
          };

          // this.loadWorkflow(JSON.stringify(workflow)); // reload workflow

          const workflowData = JSON.stringify(workflow);
          if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
          this.trigger('workflowChange', workflowData);

          // Refresh prompt editors
          this.refreshPromptEditors();

          // Update labels
          const labels = flowWrap.querySelectorAll('.step-label label');
          labels.forEach((label, index) => {
            label.innerText = `${index + 1}/${this.steps.length}`;
          });
        });
      }
      const flowWrap = element.querySelector('.steps-container');
      flowWrap.innerHTML = '';

      // Sorting
      new Sortable(flowWrap, {
        animation: 150,
        // Smooth animation
        handle: '.fb-handle',
        // Restrict drag action to the handle
        ghostClass: 'sortable-ghost',
        // Class for the dragged item
        chosenClass: 'sortable-chosen',
        // Class when the item is selected
        dragClass: 'sortable-drag',
        // Class for the item being dragged
        onStart: () => {
          Array.from(flowWrap.children).forEach((item, index) => {
            item.setAttribute('data-index', index);
          });
        },
        onEnd: () => {
          const newOrder = Array.from(flowWrap.children).map(item => parseInt(item.getAttribute('data-index'), 10));
          // Reorder the steps array based on the new order
          this.steps = newOrder.map(index => this.steps[index]);
          let workflow = {
            steps: this.steps
          };
          const workflowData = JSON.stringify(workflow);
          this.loadWorkflow(workflowData);
          if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
          this.trigger('workflowChange', workflowData);
        }
      });
      const json = JSON.parse(jsonText);
      const steps = json.steps;
      this.promptEditors = [];
      this.contextEditors = [];
      const addStep = (step, index) => {
        const stepNum = index + 1;
        const div = document.createElement('div');
        div.className = 'step-container flex flex-col gap-1';
        flowWrap.appendChild(div);
        const textarea = document.createElement('div');
        div.appendChild(textarea);
        const textarea2 = document.createElement('div');
        textarea2.className = 'hidden';
        div.appendChild(textarea2);
        const divMore = document.createElement('div');
        divMore.className = 'hidden p-4';
        div.appendChild(divMore);

        // Provider Setting (for Media Generation)
        const divProviderSetting = document.createElement('div');
        divProviderSetting.className = 'div-provider-setting';
        divProviderSetting.style.marginBottom = '12px';
        divMore.appendChild(divProviderSetting);
        const divSelectLabel = document.createElement('label');
        divSelectLabel.innerText = this.out('Media Generation Provider') + ':';
        divSelectLabel.setAttribute('for', 'select_provider_' + stepNum);
        divSelectLabel.className = 'block mb-1';
        divProviderSetting.appendChild(divSelectLabel);
        const divSelectContainer = document.createElement('div');
        divSelectContainer.className = 'select-container';
        const divInner = document.createElement('div');
        divSelectContainer.appendChild(divInner);
        divProviderSetting.appendChild(divSelectContainer);
        const selectProvider = document.createElement('select');
        selectProvider.className = 'inp-provider';
        selectProvider.id = 'select_provider_' + stepNum;
        divInner.appendChild(selectProvider);
        const divSelectArrow = document.createElement('div');
        divSelectArrow.className = 'select-arrow';
        divSelectArrow.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
        divInner.appendChild(divSelectArrow);

        // Model Setting (for Text Generation)
        const divModelSetting = document.createElement('div');
        divModelSetting.className = 'div-model-setting';
        divMore.appendChild(divModelSetting);
        const divSelectLabel2 = document.createElement('label');
        divSelectLabel2.innerText = this.out('Text Generation Model') + ':';
        divSelectLabel2.setAttribute('for', 'select_provider_' + stepNum);
        divSelectLabel2.className = 'block mb-1';
        divModelSetting.appendChild(divSelectLabel2);
        const divSelectContainer2 = document.createElement('div');
        divSelectContainer2.className = 'select-container';
        const divInner2 = document.createElement('div');
        divSelectContainer2.appendChild(divInner2);
        divModelSetting.appendChild(divSelectContainer2);
        const selectModel = document.createElement('select');
        selectModel.className = 'inp-model';
        selectModel.id = 'select_model_' + stepNum;
        divInner2.appendChild(selectModel);
        const models = this.settings.generationModels;
        let option = document.createElement('option');
        option.setAttribute('value', ''), option.innerText = this.out('Default');
        selectModel.appendChild(option);
        models.forEach(item => {
          const option = document.createElement('option');
          option.setAttribute('value', item.model), option.innerText = item.name;
          selectModel.appendChild(option);
        });
        // option = document.createElement('option');
        // option.setAttribute('value', 'other'),
        // option.innerText = this.out('Other (specify)');
        // selectModel.appendChild(option);

        const divSelectArrow2 = document.createElement('div');
        divSelectArrow2.className = 'select-arrow';
        divSelectArrow2.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
        divInner2.appendChild(divSelectArrow2);

        // ---

        let optionDefault = document.createElement('option');
        optionDefault.setAttribute('value', ''), optionDefault.innerText = this.out('Default');
        selectProvider.appendChild(optionDefault);
        this.settings.mediaGenerationProviders.forEach(item => {
          let optionText = document.createElement('option');
          optionText.value = item.value;
          optionText.innerText = item.name;
          selectProvider.appendChild(optionText);
        });
        const tags = [];
        const jsonText = this.get();
        const json = JSON.parse(jsonText);
        const elements = json.elements;
        elements.forEach(item => {
          if (item.name === '') return;
          let title = item.title;
          title = title.replace(/:/g, '');
          tags.push({
            title,
            name: item.name.toUpperCase()
          });
          if (item.useImageMask) {
            tags.push({
              title: title + ' Mask',
              name: item.name.toUpperCase() + '_MASK'
            });
          }
          if (item.type === 'color') {
            tags.push({
              title: title + ' Red',
              name: item.name.toUpperCase() + '_RED'
            });
            tags.push({
              title: title + ' Green',
              name: item.name.toUpperCase() + '_GREEN'
            });
            tags.push({
              title: title + ' Blue',
              name: item.name.toUpperCase() + '_BLUE'
            });
          }
        });
        for (let i = 1; i < stepNum; i++) {
          tags.push({
            title: `Output from step ${i}`,
            name: `OUTPUT_STEP_${i}`
          });
        }
        const labelWrap = document.createElement('div');
        labelWrap.className = 'step-label flex flex-row justify-between items-center';
        div.appendChild(labelWrap);
        const infos = document.createElement('div');
        infos.className = 'flex flex-row gap-2 items-center';
        labelWrap.appendChild(infos);
        const label = document.createElement('label');
        label.innerText = `${stepNum}/${steps.length}`; //this.out('Step') + ' ' + stepNum + ':';
        infos.appendChild(label);
        const btnPrompt = document.createElement('button');
        btnPrompt.setAttribute('aria-label', this.out('Prompt'));
        btnPrompt.setAttribute('title', this.out('Prompt'));
        btnPrompt.className = 'btn-tab-prompt active';
        btnPrompt.innerText = this.out('Prompt');
        infos.appendChild(btnPrompt);
        const btnContext = document.createElement('button');
        btnContext.setAttribute('aria-label', this.out('Context'));
        btnContext.setAttribute('title', this.out('Context'));
        btnContext.className = 'btn-tab-context';
        btnContext.innerText = this.out('Context');
        infos.appendChild(btnContext);
        const btnMore = document.createElement('button');
        btnMore.setAttribute('aria-label', this.out('Settings'));
        btnMore.setAttribute('title', this.out('Settings'));
        btnMore.className = 'btn-tab-more';
        // btnMore.innerText = this.out('provider');
        btnMore.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                </svg>`;
        infos.appendChild(btnMore);
        if (step.prompt.trim().startsWith('{')) {
          // a JSON input
          btnPrompt.innerText = this.out('JSON');
          btnContext.innerText = this.out('model');
        }
        let height = 0;
        btnPrompt.addEventListener('click', () => {
          if (!textarea.classList.contains('hidden')) return;
          textarea.classList.remove('hidden');
          textarea2.classList.add('hidden');
          divMore.classList.add('hidden');
          btnPrompt.classList.add('active');
          btnContext.classList.remove('active');
          btnMore.classList.remove('active');
        });
        btnContext.addEventListener('click', () => {
          if (!textarea2.classList.contains('hidden')) return;
          height = textarea.offsetHeight || height;
          textarea2.style.height = `${height}px`;
          textarea.classList.add('hidden');
          textarea2.classList.remove('hidden');
          divMore.classList.add('hidden');
          btnPrompt.classList.remove('active');
          btnContext.classList.add('active');
          btnMore.classList.remove('active');
        });
        btnMore.addEventListener('click', () => {
          if (!divMore.classList.contains('hidden')) return;
          height = textarea.offsetHeight || height;
          divMore.style.height = `${height}px`;
          divMore.style.minHeight = '165px';
          textarea.classList.add('hidden');
          textarea2.classList.add('hidden');
          divMore.classList.remove('hidden');
          btnPrompt.classList.remove('active');
          btnContext.classList.remove('active');
          btnMore.classList.add('active');
        });
        let btnToggleSearch, btnToggleImage, btnToggleVideo, btnToggleAudio;
        if (this.settings.searchToggle) {
          btnToggleSearch = document.createElement('button');
          btnToggleSearch.setAttribute('aria-label', this.out('Enable Web Search'));
          btnToggleSearch.setAttribute('title', this.out('Enable Web Search'));
          btnToggleSearch.className = 'btn-toggle-tool';
          btnToggleSearch.setAttribute('data-value', 'search');
          btnToggleSearch.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    `;
          // <span>${this.out('Search')}</span>
          infos.appendChild(btnToggleSearch);
        }
        if (this.settings.imageToggle) {
          btnToggleImage = document.createElement('button');
          btnToggleImage.setAttribute('aria-label', this.out('Enable Vision & Image Generation'));
          btnToggleImage.setAttribute('title', this.out('Enable Vision & Image Generation'));
          btnToggleImage.className = 'btn-toggle-tool';
          btnToggleImage.setAttribute('data-value', 'image');
          btnToggleImage.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    `;
          infos.appendChild(btnToggleImage);
        }
        if (this.settings.videoToggle) {
          btnToggleVideo = document.createElement('button');
          btnToggleVideo.setAttribute('aria-label', this.out('Enable Video Generation'));
          btnToggleVideo.setAttribute('title', this.out('Enable Video Generation'));
          btnToggleVideo.className = 'btn-toggle-tool';
          btnToggleVideo.setAttribute('data-value', 'video');
          btnToggleVideo.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                    </svg>
                    `;
          infos.appendChild(btnToggleVideo);
        }
        if (this.settings.audioToggle) {
          btnToggleAudio = document.createElement('button');
          btnToggleAudio.setAttribute('aria-label', this.out('Enable Audio Generation'));
          btnToggleAudio.setAttribute('title', this.out('Enable Audio Generation'));
          btnToggleAudio.className = 'btn-toggle-tool';
          btnToggleAudio.setAttribute('data-value', 'audio');
          btnToggleAudio.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                    `;
          infos.appendChild(btnToggleAudio);
        }
        if (step.prompt.trim().startsWith('{')) {
          // a JSON input
          if (btnToggleSearch) btnToggleSearch.style.display = 'none';
          if (btnToggleImage) btnToggleImage.style.display = 'none';
          if (btnToggleVideo) btnToggleVideo.style.display = 'none';
          if (btnToggleAudio) btnToggleAudio.style.display = 'none';
          // btnMore.style.display = '';

          // divProviderSetting.style.display = '';
          // divModelSetting.style.display = 'none';
        } else {
          if (btnToggleSearch) btnToggleSearch.style.display = '';
          if (btnToggleImage) btnToggleImage.style.display = '';
          if (btnToggleVideo) btnToggleVideo.style.display = '';
          if (btnToggleAudio) btnToggleAudio.style.display = '';
          // btnMore.style.display = 'none';

          // divProviderSetting.style.display = 'none';
          // divModelSetting.style.display = '';
        }

        // set
        const btns = infos.querySelectorAll('.btn-toggle-tool');
        btns.forEach(btn => {
          btn.classList.remove('active');
        });
        let search = step.tools && step.tools.search;
        if (search && btnToggleSearch) {
          btnToggleSearch.classList.add('active');
        }
        let image = step.tools && step.tools.image;
        if (image && btnToggleImage) {
          btnToggleImage.classList.add('active');
        }
        let video = step.tools && step.tools.video;
        if (video && btnToggleVideo) {
          btnToggleVideo.classList.add('active');
        }
        let audio = step.tools && step.tools.audio;
        if (audio && btnToggleAudio) {
          btnToggleAudio.classList.add('active');
        }
        btns.forEach(btn => {
          btn.addEventListener('click', () => {
            btns.forEach(other => {
              if (other !== btn) other.classList.remove('active');
            });
            btn.classList.toggle('active');
            const toolName = btn.getAttribute('data-value');

            // Update workflow
            let child = btnRemoveStep.closest('.step-container');
            let index = getIndex(child);
            let steps = JSON.parse(JSON.stringify(this.steps));
            if (toolName === 'search') {
              steps.forEach((step, idx) => {
                if (index === idx) {
                  if (!step.tools) step.tools = {};
                  step.tools.search = false;
                  step.tools.image = false;
                  step.tools.video = false;
                  step.tools.audio = false;
                  step.tools.search = btn.classList.contains('active');
                }
              });
            }
            if (toolName === 'image') {
              steps.forEach((step, idx) => {
                if (index === idx) {
                  if (!step.tools) step.tools = {};
                  step.tools.search = false;
                  step.tools.image = false;
                  step.tools.video = false;
                  step.tools.audio = false;
                  step.tools.image = btn.classList.contains('active');
                }
              });
            }
            if (toolName === 'video') {
              steps.forEach((step, idx) => {
                if (index === idx) {
                  if (!step.tools) step.tools = {};
                  step.tools.search = false;
                  step.tools.image = false;
                  step.tools.video = false;
                  step.tools.audio = false;
                  step.tools.video = btn.classList.contains('active');
                }
              });
            }
            if (toolName === 'audio') {
              steps.forEach((step, idx) => {
                if (index === idx) {
                  if (!step.tools) step.tools = {};
                  step.tools.search = false;
                  step.tools.image = false;
                  step.tools.video = false;
                  step.tools.audio = false;
                  step.tools.audio = btn.classList.contains('active');
                }
              });
            }
            const workflow = {
              steps
            };
            this.steps = steps; //new

            if (this.settings.consoleLog) console.log(workflow); // check workflow

            const workflowData = JSON.stringify(workflow);
            if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
            this.trigger('workflowChange', workflowData);

            // Hide Context tab for media generation
            /*
            const promptTab = div.querySelector('.btn-tab-prompt');
            const contextTab = div.querySelector('.btn-tab-context');
            if(btnToggleImage.classList.contains('active') ||
            btnToggleVideo.classList.contains('active') ||
            btnToggleAudio.classList.contains('active')) {
                promptTab.click();
                contextTab.style.display = 'none';
            } else {
                contextTab.style.display = '';
            }
            */
          });
        });

        // const btnSystem = document.createElement('button');
        // btnSystem.setAttribute('aria-label', this.out('Context'));
        // btnSystem.className = 'btn-tab-system underline';
        // btnSystem.innerText = this.out('system');
        // infos.appendChild(btnSystem);

        const controls = document.createElement('div');
        controls.className = 'flex flex-row';
        labelWrap.appendChild(controls);
        const btnRemoveStep = document.createElement('button');
        btnRemoveStep.setAttribute('aria-label', this.out('Remove Step'));
        btnRemoveStep.setAttribute('title', this.out('Remove Step'));
        btnRemoveStep.className = 'btn-delstep w-[36px] h-[23px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-builder-primary-color';
        btnRemoveStep.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                `;
        controls.appendChild(btnRemoveStep);
        const btnToggleOutput = document.createElement('button');
        btnToggleOutput.setAttribute('aria-label', this.out('Toggle Output'));
        btnToggleOutput.setAttribute('title', this.out('Toggle Output'));
        btnToggleOutput.className = 'btn-toggleoutput w-[36px] h-[23px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-builder-primary-color';
        btnToggleOutput.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                `;
        controls.appendChild(btnToggleOutput);
        const btnRunStep = document.createElement('button');
        btnRunStep.setAttribute('aria-label', this.out('Run Step'));
        btnRunStep.setAttribute('title', this.out('Run Step'));
        btnRunStep.className = 'btn-runstep w-[36px] h-[23px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-builder-primary-color';
        btnRunStep.innerHTML = `
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="size-4">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" />
                </svg>
                `;
        controls.appendChild(btnRunStep);
        const btnHandle = document.createElement('div');
        btnHandle.className = 'fb-handle';
        btnHandle.style = 'height:40px;width:20px;display:flex;align-items:center;justify-content:center;opacity: 0.45;cursor: move;';
        btnHandle.innerHTML = `
                    <svg class="size-4 text-[#aaa]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                    </svg>
                `;
        controls.appendChild(btnHandle);
        const getIndex = child => {
          return Array.prototype.indexOf.call(child.parentNode.children, child);
        };
        let hideOutput = step.hideOutput;
        if (hideOutput) {
          btnToggleOutput.classList.add('hide-output');
          btnToggleOutput.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    `;
        } else {
          btnToggleOutput.classList.remove('hide-output');
          btnToggleOutput.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    `;
        }
        btnToggleOutput.addEventListener('click', () => {
          btnToggleOutput.classList.toggle('hide-output');
          if (btnToggleOutput.classList.contains('hide-output')) {
            btnToggleOutput.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        `;
          } else {
            btnToggleOutput.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        `;
          }

          // Update workflow
          let child = btnToggleOutput.closest('.step-container');
          let index = getIndex(child);
          let steps = JSON.parse(JSON.stringify(this.steps));
          steps.forEach((step, idx) => {
            if (index === idx) {
              step.hideOutput = btnToggleOutput.classList.contains('hide-output');
            }
          });
          const workflow = {
            steps
          };
          this.steps = steps; //new

          if (this.settings.consoleLog) console.log(workflow); // check workflow

          const workflowData = JSON.stringify(workflow);
          if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
          this.trigger('workflowChange', workflowData);
        });

        /*
        btnRemoveStep.addEventListener('click', ()=>{
             let child = btnRemoveStep.closest('.step-container');
            let index = getIndex(child);
             this.steps.splice(index, 1); 
            // this.promptEditors[index].destroy();
            this.promptEditors.splice(index, 1); 
            // this.contextEditors[index].destroy();
            this.contextEditors.splice(index, 1); 
             let workflow = {
                steps: this.steps
            };
             btnRemoveStep.closest('.step-container').remove();
               // this.loadWorkflow(JSON.stringify(workflow)); // reload workflow
             const workflowData = JSON.stringify(workflow);
             this.loadWorkflow(workflowData);
             if(this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
            this.trigger('workflowChange', workflowData);
             // Refresh prompt editors
            this.refreshPromptEditors();
            
            // Update labels
            const labels = flowWrap.querySelectorAll('.step-label label');
            labels.forEach((label,index)=>{
                label.innerText = `${index+1}/${this.steps.length}`;
            });
        });
        */
        btnRemoveStep.addEventListener('click', event => {
          let child = btnRemoveStep.closest('.step-container');
          let index = getIndex(child);
          this.steps.splice(index, 1);
          let workflow = {
            steps: this.steps
          };
          const workflowData = JSON.stringify(workflow);
          this.loadWorkflow(workflowData);
          if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
          this.trigger('workflowChange', workflowData);
          event.preventDefault();
          event.stopImmediatePropagation();
        });
        btnRunStep.addEventListener('click', () => {
          let child = btnRemoveStep.closest('.step-container');
          let index = getIndex(child);
          this.process(index);
        });
        let prompt = step.prompt;
        let context = step.context || '';
        let isHTML = this.isHTML(prompt);
        if (!isHTML) {
          // if prompt is not HTML formatted (eg. from prompt templates  which use {{tagname}} )

          prompt = this.textToHTML(prompt);
          elements.forEach(item => {
            // let title = item.title;
            // title = title.replace(/:/g, '');
            const name = item.name;
            let s = `<span class="tag" contentEditable="false" data-name="${name.toUpperCase()}">${name.toUpperCase()}</span>`;
            prompt = prompt.replaceAll(`{{${name}}}`, s);
            prompt = prompt.replaceAll(`{{${name.toUpperCase()}}}`, s);
          });
          prompt = prompt.replace(/{{(\w+)}}/g, (match, p1) => {
            return `<span class="tag" contentEditable="false" data-name="${p1}">${p1}</span>`;
          });
          for (let i = 1; i <= steps.length; i++) {
            let s = `<span class="tag" contentEditable="false" data-name="OUTPUT_STEP_${i}">OUTPUT_STEP_${i}</span>`;
            prompt = prompt.replaceAll(`{{output_step_${i}}}`, s);
            prompt = prompt.replaceAll(`{{OUTPUT_STEP_${i}}}`, s);
          }
        }
        const obj = new PromptEditor(textarea, {
          ariaLabel: this.out('Step') + ' ' + stepNum,
          placeholderText: this.out('Press "/" to insert a reference.'),
          tags,
          value: prompt,
          onChange: content => {
            if (content.trim().startsWith('{')) {
              // a JSON input
              btnPrompt.innerText = this.out('JSON');
              btnContext.innerText = this.out('model');
            } else {
              btnPrompt.innerText = this.out('Prompt');
              btnContext.innerText = this.out('Context');
            }
            if (content.trim().startsWith('{')) {
              // a JSON input
              if (btnToggleSearch) btnToggleSearch.style.display = 'none';
              if (btnToggleImage) btnToggleImage.style.display = 'none';
              if (btnToggleVideo) btnToggleVideo.style.display = 'none';
              if (btnToggleAudio) btnToggleAudio.style.display = 'none';
              // btnMore.style.display = '';

              // divProviderSetting.style.display = '';
              // divModelSetting.style.display = 'none';
            } else {
              if (btnToggleSearch) btnToggleSearch.style.display = '';
              if (btnToggleImage) btnToggleImage.style.display = '';
              if (btnToggleVideo) btnToggleVideo.style.display = '';
              if (btnToggleAudio) btnToggleAudio.style.display = '';
              // btnMore.style.display = 'none';

              // divProviderSetting.style.display = 'none';
              // divModelSetting.style.display = '';
            }
            let steps = JSON.parse(JSON.stringify(this.steps));
            steps.forEach((step, idx) => {
              if (index === idx) {
                step.prompt = content;
                step.provider = selectProvider.value;
                step.model = selectModel.value;
                // if(isJSON) {
                //     step.provider = selectProvider.value;
                //     delete step.model;
                // } else {
                //     step.model = selectModel.value;
                //     delete step.provider;
                // }
              }
            });
            const workflow = {
              steps
            };
            this.steps = steps; //new

            if (this.settings.consoleLog) console.log(workflow); // check workflow

            const workflowData = JSON.stringify(workflow);
            if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
            this.trigger('workflowChange', workflowData);
          }
        });
        this.promptEditors.push(obj);
        const obj2 = new PromptEditor(textarea2, {
          ariaLabel: this.out('Step') + ' ' + stepNum,
          placeholderText: this.out('Press "/" to insert a reference.'),
          tags,
          value: context,
          onChange: content => {
            let steps = JSON.parse(JSON.stringify(this.steps));
            steps.forEach((step, idx) => {
              if (index === idx) {
                step.context = content;
              }
            });
            const workflow = {
              steps
            };
            this.steps = steps; //new

            // if(this.settings.consoleLog) console.log(workflow); // check workflow

            const workflowData = JSON.stringify(workflow);
            if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
            this.trigger('workflowChange', workflowData);
          }
        });
        this.contextEditors.push(obj2);
        selectProvider.addEventListener('change', () => {
          let steps = JSON.parse(JSON.stringify(this.steps));
          steps.forEach((step, idx) => {
            if (index === idx) {
              step.provider = selectProvider.value;
            }
          });
          const workflow = {
            steps
          };
          this.steps = steps; //new

          // if(this.settings.consoleLog) console.log(workflow); // check workflow

          const workflowData = JSON.stringify(workflow);
          if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
          this.trigger('workflowChange', workflowData);
        });
        if (step.provider) selectProvider.value = step.provider;
        selectModel.addEventListener('change', () => {
          let steps = JSON.parse(JSON.stringify(this.steps));
          steps.forEach((step, idx) => {
            if (index === idx) {
              step.model = selectModel.value;
            }
          });
          const workflow = {
            steps
          };
          this.steps = steps; //new

          if (this.settings.consoleLog) console.log(workflow); // check workflow

          const workflowData = JSON.stringify(workflow);
          if (this.settings.onWorkflowChange) this.settings.onWorkflowChange(workflowData);
          this.trigger('workflowChange', workflowData);
        });
        if (step.model) {
          const exists = Array.from(selectModel.options).some(option => option.value === step.model);
          if (!exists) {
            option = document.createElement('option');
            option.setAttribute('value', step.model), option.innerText = step.model;
            selectModel.appendChild(option);
            selectModel.value = step.model;
          }
          selectModel.value = step.model;
        }
      };
      steps.forEach((step, index) => {
        if (!Object.prototype.hasOwnProperty.call(step, 'context')) {
          step.context = '';
        }
        addStep(step, index);
      });
      this.steps = steps;
    } else {
      const json = JSON.parse(jsonText);
      const steps = json.steps;
      steps.forEach(step => {
        if (!Object.prototype.hasOwnProperty.call(step, 'context')) {
          step.context = '';
        }
      });
      this.steps = steps;
    }
  }
  showKnowledgeUpload() {
    if (!this.settings.workflowSelector) {
      if (this.settings.consoleLog) console.log('workflowSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.workflowSelector);
    if (element) {
      const exist = element.querySelector('.knowledge-title');
      if (!exist) {
        let div = document.createElement('div');
        div.className = 'inner-container';
        element.appendChild(div);
        let divHeader = document.createElement('div');
        divHeader.className = 'flex flex-col gap-1';
        div.appendChild(divHeader);
        const title = document.createElement('div');
        title.className = 'knowledge-title';
        title.innerText = this.out('Knowledge Base');
        divHeader.appendChild(title);
        const tagline = document.createElement('div');
        tagline.className = 'knowledge-tagline';
        tagline.innerText = this.out('Add documents to personalize AI responses.');
        divHeader.appendChild(tagline);
        this.renderAttachFile({
          parentNode: div,
          id: 'knowledge_file',
          name: 'knowledge_file',
          text: 'Knowledge Base'
        });
        this.renderListFiles();
      }
    }
  }
  isHTML(str) {
    // Create a temporary DOM element
    const div = document.createElement('div');
    div.innerHTML = str.trim();

    // Check if the parsed content has any child nodes or elements
    return div.children.length > 0 || div.childNodes.length > 1 || div.innerHTML !== str.trim();
  }
  textToHTML(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'); // Replace line breaks with <br>
  }
  getWorkflow() {
    const workflow = {
      steps: this.steps
    };
    const workflowData = JSON.stringify(workflow);
    return workflowData;
  }
  getWorkflow_bak() {
    if (!this.settings.workflowSelector) {
      if (this.settings.consoleLog) console.log('workflowSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.workflowSelector);
    if (!element) return;
    let steps = [];
    const elms = element.querySelectorAll('[data-name]');
    elms.forEach(elm => {
      let json = {
        prompt: elm.value
      };
      steps.push(json);
    });
    const workflow = {
      steps
    };
    const workflowText = JSON.stringify(workflow);
    return workflowText;
  }
  async send(question, context, system, model, functs) {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    let temperature = 0.6;
    let topP = 0.9;
    let num = 1;
    if (!functs) functs = [];
    model = model || this.settings.model;
    if (functs.length > 0) {
      model = this.settings.model2;
    }
    const messages = {
      question,
      context,
      system,
      functs,
      temperature,
      topP,
      num,
      model,
      customData: this.settings.customData
    };
    try {
      let headers = {
        'Content-Type': 'application/json',
        ...this.settings.headers
      };
      const response = await fetch(this.settings.sendCommandUrl, {
        signal: this.signal,
        // Abort
        method: 'POST',
        headers,
        body: JSON.stringify(messages)
      });
      let data = await response.json();
      if (data.error) {
        console.log('Error:\n' + data.error);
        return false;
      }
      if (data.answer.usage) {
        this.tokenInput += data.answer.usage.prompt_tokens;
        this.tokenOutput += data.answer.usage.completion_tokens;
      }
      if (functs.length === 0) {
        let answer;
        data.answer.choices.forEach(item => {
          answer = item.message.content;
        });
        return answer;
      } else {
        return data.answer;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // Do Nothing
        if (this.settings.consoleLog) console.log('Request aborted by user.');
      } else {
        // CORS or code errors goes here
        console.error('Error:', error);
      }
      return false;
    }
  }
  async sendStream(question, context, system, model, functs, onData) {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    let temperature = 0.6;
    let topP = 0.9;
    let num = 1;
    if (!functs) functs = [];
    model = model || this.settings.model;
    const messages = {
      question,
      context,
      system,
      functs,
      temperature,
      topP,
      num,
      model,
      customData: this.settings.customData
    };
    try {
      let headers = {
        'Content-Type': 'application/json',
        ...this.settings.headers
      };
      const response = await fetch(this.settings.sendCommandStreamUrl, {
        signal: this.signal,
        // Abort
        method: 'POST',
        headers,
        body: JSON.stringify(messages)
      });
      if (!response.ok) {
        console.error('Error:', response.statusText);
        return false;
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = ''; // Accumulate partial chunks here

      let done = false;
      while (!done) {
        const {
          done: isDone,
          value
        } = await reader.read();
        done = isDone;
        if (done) break;

        // Decode the current chunk
        const chunk = decoder.decode(value, {
          stream: true
        });
        buffer += chunk; // Accumulate chunks into buffer

        // Split the buffer into lines and process each line
        const lines = buffer.split('\n');
        buffer = ''; // Clear buffer temporarily for reaccumulation

        let tokenInput = 0;
        let tokenOutput = 0;
        for (const line of lines) {
          if (line.trim() === '') continue; // Skip empty lines
          if (line.startsWith('data:')) {
            const payload = line.slice(5).trim(); // Remove 'data:' prefix
            if (payload === '[DONE]') {
              if (this.settings.consoleLog) console.log('Stream completed.');
              break;
            }
            try {
              const json = JSON.parse(payload); // Parse valid JSON
              if (json.usage) {
                tokenInput = json.usage.prompt_tokens;
                tokenOutput = json.usage.completion_tokens;
              }
              if (json.choices && json.choices[0].delta && json.choices[0].delta.content) {
                const text = json.choices[0].delta.content;
                if (onData) onData(text); // Forward the content
              }
            } catch (error) {
              // Reaccumulate incomplete JSON for next loop iteration
              buffer += line + '\n';
            }
          }
        }
        this.tokenInput += tokenInput;
        this.tokenOutput += tokenOutput;
      }
      return true; // Indicate successful completion
    } catch (error) {
      if (error.name === 'AbortError') {
        if (this.settings.consoleLog) console.log('Request aborted by user.');
      } else {
        console.error('Error:', error);
      }
      return false;
    }
  }
  async assistant(question, context, system, functs) {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    let temperature = 0.6;
    let topP = 0.9;
    let num = 1;
    if (!functs) functs = [];
    let model = this.settings.model;
    if (functs.length > 0) {
      model = this.settings.model2;
    }
    const messages = {
      assistantId: this.settings.assistantId,
      question,
      context,
      system,
      functs,
      temperature,
      topP,
      num,
      model,
      customData: this.settings.customData
    };
    try {
      let headers = {
        'Content-Type': 'application/json',
        ...this.settings.headers
      };
      const response = await fetch(this.settings.assistantUrl, {
        signal: this.signal,
        // Abort
        method: 'POST',
        headers,
        body: JSON.stringify(messages)
      });
      let result = await response.json();
      if (result.error) {
        console.log('Error:\n' + result.error);
        return false;
      }
      if (result.usage) {
        this.tokenInput += result.usage.prompt_tokens;
        this.tokenOutput += result.usage.completion_tokens;
      }
      return result.answer.content[0].text.value;

      // if(functs.length===0) {
      //     let answer;
      //     data.answer.choices.forEach(item=>{
      //         answer = item.message.content;
      //     });
      //     return answer;
      // } else {
      //     return data.answer;
      // }
    } catch (error) {
      if (error.name === 'AbortError') {
        // Do Nothing
        if (this.settings.consoleLog) console.log('Request aborted by user.');
      } else {
        // CORS or code errors goes here
        console.error('Error:', error);
      }
      return false;
    }
  }
  async assistantStream(question, context, system, functs, onData) {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    let temperature = 0.6;
    let topP = 0.9;
    let num = 1;
    if (!functs) functs = [];
    const messages = {
      assistantId: this.settings.assistantId,
      question,
      context,
      system,
      functs,
      temperature,
      topP,
      num,
      model: this.settings.model,
      customData: this.settings.customData
    };
    try {
      let headers = {
        'Content-Type': 'application/json',
        ...this.settings.headers
      };
      const response = await fetch(this.settings.assistantStreamUrl, {
        signal: this.signal,
        // Abort
        method: 'POST',
        headers,
        body: JSON.stringify(messages)
      });
      if (!response.ok) {
        console.error('Error:', response.statusText);
        return false;
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = ''; // Accumulate partial chunks here

      let done = false;
      while (!done) {
        const {
          done: isDone,
          value
        } = await reader.read();
        done = isDone;
        if (done) break;

        // Decode the current chunk
        const chunk = decoder.decode(value, {
          stream: true
        });
        buffer += chunk; // Accumulate chunks into buffer

        // Split the buffer into lines and process each line
        const lines = buffer.split('\n');
        buffer = ''; // Clear buffer temporarily for reaccumulation

        for (const line of lines) {
          if (line.trim() === '') continue; // Skip empty lines
          if (line.startsWith('data:')) {
            const payload = line.slice(5).trim(); // Remove 'data:' prefix
            if (payload === '[DONE]') {
              if (this.settings.consoleLog) console.log('Stream completed.');
              // break;
            }
            try {
              const json = JSON.parse(payload); // Parse valid JSON
              if (json.choices && json.choices[0].delta && json.choices[0].delta.content) {
                const text = json.choices[0].delta.content;
                if (onData) onData(text); // Forward the content
              }
            } catch (error) {
              // Reaccumulate incomplete JSON for next loop iteration
              buffer += line + '\n';
            }
          } else {
            const usage = JSON.parse(line);
            this.tokenInput += usage.prompt_tokens;
            this.tokenOutput += usage.completion_tokens;
            break;
          }
        }
      }
      return true; // Indicate successful completion
    } catch (error) {
      if (error.name === 'AbortError') {
        if (this.settings.consoleLog) console.log('Request aborted by user.');
      } else {
        console.error('Error:', error);
      }
      return false;
    }
  }
  hideBuilder() {
    const formBuilderContainer = document.querySelector('.formbuilder-container');
    if (formBuilderContainer) formBuilderContainer.classList.add('hidden');
  }
  hideGenerator() {
    const formGeneratorContainer = document.querySelector('.formgenerator-container');
    if (formGeneratorContainer) formGeneratorContainer.classList.add('hidden');
  }
  hideViewer() {
    if (!this.settings.previewSelector) return;
    const preview = document.querySelector(this.settings.previewSelector);
    if (preview) preview.classList.add('hidden');
  }
  showSettings() {
    if (!this.settings.settingsSelector) {
      if (this.settings.consoleLog) console.log('settingsSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.settingsSelector);
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('formsettings-container');
      element.classList.add('fb-ui');
      if (!element.querySelector('.inp-submit-text')) {
        let id = this.getId();
        let div = document.createElement('div');
        div.className = 'inner-container';
        element.appendChild(div);
        let divTitle = document.createElement('div');
        divTitle.className = 'settings-title';
        divTitle.innerText = this.out('Settings');
        div.appendChild(divTitle);

        // Submit
        let fieldDiv = document.createElement('div');
        fieldDiv.className = 'field-div';
        div.appendChild(fieldDiv);
        let label = document.createElement('label');
        label.setAttribute('for', `submit_text_${id}`);
        label.className = 'field-label';
        label.innerText = this.out('Submit Button Text:');
        fieldDiv.appendChild(label);
        let input = document.createElement('input');
        input.id = `submit_text_${id}`;
        input.type = 'text';
        input.className = 'inp-submit-text inp-base';
        fieldDiv.appendChild(input);
        input.value = this.json && this.json.submitText || this.settings.submitText;
        let debounceTimeout;
        input.addEventListener('input', () => {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            const jsonText = this.get();
            if (this.settings.onChange) this.settings.onChange(jsonText);
            this.trigger('change', jsonText);
          }, 300);
        });

        // Reset
        fieldDiv = document.createElement('div');
        fieldDiv.className = 'field-div';
        div.appendChild(fieldDiv);
        label = document.createElement('label');
        label.setAttribute('for', `reset_text_${id}`);
        label.className = 'field-label';
        label.innerText = this.out('Reset Button Text:');
        fieldDiv.appendChild(label);
        const inputReset = document.createElement('input');
        inputReset.id = `reset_text_${id}`;
        inputReset.type = 'text';
        inputReset.className = 'inp-reset-text inp-base';
        fieldDiv.appendChild(inputReset);
        inputReset.value = this.json && this.json.resetText || this.settings.resetText;
        let debounceTimeout2;
        inputReset.addEventListener('input', () => {
          clearTimeout(debounceTimeout2);
          debounceTimeout2 = setTimeout(() => {
            const jsonText = this.get();
            if (this.settings.onChange) this.settings.onChange(jsonText);
            this.trigger('change', jsonText);
          }, 300);
        });

        // Hide Reset
        const checkboxReset = this.renderCheckbox({
          parentNode: div,
          name: 'hidereset',
          text: this.out('Hide Reset Button')
        });

        // checkboxReset.checked = (this.json && this.json.hideReset) || false;
        if (this.json && 'hideReset' in this.json) {
          checkboxReset.checked = this.json.hideReset;
        } else {
          checkboxReset.checked = true;
        }
        checkboxReset.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });

        // Full Width
        const checkboxFullWidth = this.renderCheckbox({
          parentNode: div,
          name: 'fullwidthbutton',
          text: this.out('Full Width Button')
        });
        checkboxFullWidth.checked = this.json && this.json.fullWidthButton || false;
        checkboxFullWidth.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });

        // Hide Header
        const checkbox = this.renderCheckbox({
          parentNode: div,
          name: 'hideheader',
          text: this.out('Hide Header')
        });
        checkbox.checked = this.json && this.json.hideHeader || false;
        checkbox.addEventListener('input', () => {
          const jsonText = this.get();
          if (this.settings.onChange) this.settings.onChange(jsonText);
          this.trigger('change', jsonText);
        });
      } else {
        const input = element.querySelector('.inp-submit-text');
        input.value = this.json && this.json.submitText || this.settings.submitText;
        const checkbox = element.querySelector('input[name="hideheader"]');
        checkbox.checked = this.json && this.json.hideHeader || false;
        const inputReset = element.querySelector('.inp-reset-text');
        inputReset.value = this.json && this.json.resetText || this.settings.resetText;
        const checkboxReset = element.querySelector('input[name="hidereset"]');

        // checkboxReset.checked = (this.json && this.json.hideReset) || false;
        if (this.json && 'hideReset' in this.json) {
          checkboxReset.checked = this.json.hideReset;
        } else {
          checkboxReset.checked = true;
        }
        const checkboxFullWidth = element.querySelector('input[name="fullwidthbutton"]');
        checkboxFullWidth.checked = this.json && this.json.fullWidthButton || false;
      }
    }
  }
  hideSettings() {
    if (!this.settings.settingsSelector) {
      if (this.settings.consoleLog) console.log('settingsSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.settingsSelector);
    if (element) element.classList.add('hidden');
  }
  showDesigner() {
    if (!this.settings.designerSelector) {
      if (this.settings.consoleLog) console.log('designerSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.designerSelector);
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('formdesigner-container');
      element.classList.add('fb-ui');
      if (!element.querySelector('.btn-theme-reset')) {
        let id = this.getId();
        const html = `
                    <div class="inner-container">

                        <div class="settings-title">
                            ${this.out('Design')}
                        </div>

                        <div class="inner-header">
                            <span>${this.out('General')}:</span>

                            <button class="btn-theme-reset">${this.out('Reset')}</button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Default Text Color')}:
                            </div>
                            <button title="${this.out('Text Color')}" class="inp-text-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Primary Color')}:
                            </div>
                            <button title="${this.out('Primary Color')}" class="inp-primary-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Form Title Color')}:
                            </div>
                            <button title="${this.out('Form Title Color')}" class="inp-form-title-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Form Description Color')}:
                            </div>
                            <button title="${this.out('Form Description Color')}" class="inp-form-desc-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Label Color')}:
                            </div>
                            <button title="${this.out('Label Color')}" class="inp-label-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Label Font Size')}:
                            </div>
                            <div class="flex items-center">
                            <input id="${id}_label_font_size" type="number" value="1" class="inp-label-font-size width-setting mr-2" />&nbsp; %
                            </div>
                        </div>

                        <div class="items-group">
                            ${this.out('Input')}:
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Bg Color')}:
                            </div>
                            <button title="${this.out('Bg Color')}" class="inp-input-bg-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Text Color')}:
                            </div>
                            <button title="${this.out('Text Color')}" class="inp-input-text-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Input Font Size')}:
                            </div>
                            <div class="flex items-center">
                            <input id="${id}_input_font_size" type="number" value="1" class="inp-input-font-size width-setting mr-2" />&nbsp; %
                            </div>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Border Color')}:
                            </div>
                            <button title="${this.out('Border Color')}" class="inp-input-border-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Border Width')}:
                            </div>
                            <input id="${id}_input_border_width" type="number" value="1" class="inp-input-border-width width-setting" />
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Focused Border Width')}:
                            </div>
                            <input id="${id}_input_focused_border_width" type="number" value="1" class="inp-input-focused-border-width width-setting" />
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Placeholder Text Color')}:
                            </div>
                            <button title="${this.out('Placeholder Text Color')}" class="inp-input-placeholder-color is-btn-color"></button>
                        </div>

                        <div class="items-group">
                            ${this.out('Choice (Checkbox & Radio Button)')}:
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Border Color')}:
                            </div>
                            <button title="${this.out('Border Color')}" class="inp-choice-border-color is-btn-color"></button>
                        </div>

                        <div class="items-group">
                            ${this.out('Switch')}:
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Bg Color')}:
                            </div>
                            <button title="${this.out('Bg Color')}" class="inp-switch-bg-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Knob Color')}:
                            </div>
                            <button title="${this.out('Knob Color')}" class="inp-switch-knob-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Focus Offset Color')}:
                            </div>
                            <button title="${this.out('Focus Offset Color')}" class="inp-switch-focus-offset-color is-btn-color"></button>
                        </div>

                        <div class="items-group">
                            ${this.out('Upload')}:
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('Border Color')}:
                            </div>
                            <button title="${this.out('Border Color')}" class="inp-dropfile-border-color is-btn-color"></button>
                        </div>

                        <div class="item-setting">
                            <div>
                                ${this.out('File Drop Hover Color')}:
                            </div>
                            <button title="${this.out('File Drop Hover Color')}" class="inp-dropfile-hover-color is-btn-color"></button>
                        </div>

                        <div class="div-use-button flex flex-wrap gap-6">

                            <div class="items-group">
                                ${this.out('Submit Button')}:
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Bg Color')}:
                                </div>
                                <button title="${this.out('Bg Color')}" class="inp-button-bg-color is-btn-color"></button>
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Hover Bg Color')}:
                                </div>
                                <button title="${this.out('Hover Bg Color')}" class="inp-button-hover-bg-color is-btn-color"></button>
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Text Color')}:
                                </div>
                                <button title="${this.out('Text Color')}" class="inp-button-text-color is-btn-color"></button>
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Hover Text Color')}:
                                </div>
                                <button title="${this.out('Hover Text Color')}" class="inp-button-hover-text-color is-btn-color"></button>
                            </div>

                            <div class="item-setting">
                                <div>
                                    ${this.out('Border Width')}:
                                </div>
                                <input id="${id}_input_button_border_width" type="number" value="0" class="inp-button-border-width width-setting" />
                            </div>

                            <div class="item-setting">
                                <div>
                                    ${this.out('Border Color')}:
                                </div>
                                <button title="${this.out('Border Color')}" class="inp-button-border-color is-btn-color"></button>
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Hover Border Color')}:
                                </div>
                                <button title="${this.out('Hover Border Color')}" class="inp-button-hover-border-color is-btn-color"></button>
                            </div>

                        </div>

                        <div class="div-use-button flex flex-wrap gap-6">

                            <div class="items-group">
                                ${this.out('Reset Button')}:
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Bg Color')}:
                                </div>
                                <button title="${this.out('Bg Color')}" class="inp-reset-bg-color is-btn-color"></button>
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Hover Bg Color')}:
                                </div>
                                <button title="${this.out('Hover Bg Color')}" class="inp-reset-hover-bg-color is-btn-color"></button>
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Text Color')}:
                                </div>
                                <button title="${this.out('Text Color')}" class="inp-reset-text-color is-btn-color"></button>
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Hover Text Color')}:
                                </div>
                                <button title="${this.out('Hover Text Color')}" class="inp-reset-hover-text-color is-btn-color"></button>
                            </div>

                            <div class="item-setting">
                                <div>
                                    ${this.out('Border Width')}:
                                </div>
                                <input id="${id}_input_reset_border_width" type="number" value="0" class="inp-reset-border-width width-setting" />
                            </div>

                            <div class="item-setting">
                                <div>
                                    ${this.out('Border Color')}:
                                </div>
                                <button title="${this.out('Border Color')}" class="inp-reset-border-color is-btn-color"></button>
                            </div>
                        
                            <div class="item-setting">
                                <div>
                                    ${this.out('Hover Border Color')}:
                                </div>
                                <button title="${this.out('Hover Border Color')}" class="inp-reset-hover-border-color is-btn-color"></button>
                            </div>

                        </div>

                    </div>
                `;
        element.insertAdjacentHTML('afterbegin', html);
        let debounceTimeout;
        let btnColors = element.querySelectorAll('.is-btn-color');
        btnColors.forEach(btn => {
          btn.addEventListener('click', () => {
            this.colorPicker.open(color => {
              btn.style.backgroundColor = color; // preview

              clearTimeout(debounceTimeout);
              debounceTimeout = setTimeout(() => {
                const themeData = this.getTheme();
                if (this.settings.onThemeChange) this.settings.onThemeChange(themeData);
                this.trigger('themeChange', themeData);
              }, 300);
            }, btn.style.backgroundColor, () => {
              btn.removeAttribute('data-focus');
              btn.focus();
            });
            btn.setAttribute('data-focus', true);
          });
        });
        const inpLabelFontSize = element.querySelector('.inp-label-font-size');
        inpLabelFontSize.addEventListener('input', () => {
          const themeData = this.getTheme();
          if (this.settings.onThemeChange) this.settings.onThemeChange(themeData);
          this.trigger('themeChange', themeData);
        });
        const inpInputFontSize = element.querySelector('.inp-input-font-size');
        inpInputFontSize.addEventListener('input', () => {
          const themeData = this.getTheme();
          if (this.settings.onThemeChange) this.settings.onThemeChange(themeData);
          this.trigger('themeChange', themeData);
        });
        const inpBorderWidth = element.querySelector('.inp-input-border-width');
        inpBorderWidth.addEventListener('input', () => {
          const themeData = this.getTheme();
          if (this.settings.onThemeChange) this.settings.onThemeChange(themeData);
          this.trigger('themeChange', themeData);
        });
        const inpFocusedBorderWidth = element.querySelector('.inp-input-focused-border-width');
        inpFocusedBorderWidth.addEventListener('input', () => {
          const themeData = this.getTheme();
          if (this.settings.onThemeChange) this.settings.onThemeChange(themeData);
          this.trigger('themeChange', themeData);
        });
        const inpButtonBorderWidth = element.querySelector('.inp-button-border-width');
        inpButtonBorderWidth.addEventListener('input', () => {
          const themeData = this.getTheme();
          if (this.settings.onThemeChange) this.settings.onThemeChange(themeData);
          this.trigger('themeChange', themeData);
        });
        const btnReset = element.querySelector('.btn-theme-reset');
        btnReset.addEventListener('click', () => {
          /*
          const jsonInitialTheme = {
              "cssVariables": {
                  "--form-text-color": "#3c3c3c",
                  "--form-primary-color": "#3b82f6",
                  "--form-title-color": "#3c3c3c",
                  "--form-desc-color": "#6b7280",
                  "--form-label-color": "#111",
                  "--form-input-border-color": "rgb(194 194 194)",
                  "--form-primary-border-width": "1px",
                  "--form-secondary-border-width": "2px",
                  "--form-input-background-color": "#ffffff30",
                  "--form-input-text-color": "#3c3c3c",
                  "--form-input-placeholder-color": "#9ca3af",
                  "--form-choice-border-color": "rgb(194 194 194)",
                  "--form-switch-background-color": "#ccc",
                  "--form-switch-knob-color": "#fff",
                  "--form-switch-focus-offset-color": "#fff",
                  "--form-dropfile-hover-color": "rgba(0, 0, 0, 0.03)"
              }
          };
          */
          const jsonInitialTheme = {};
          this.setTheme(jsonInitialTheme);
          const themeData = this.getTheme();
          if (this.settings.onThemeChange) this.settings.onThemeChange(themeData);
          this.trigger('themeChange', themeData);
        });
      }
    }
    if (this.themeData) {
      this.setTheme(this.themeData);
    }
  }
  setTheme(jsonText, elm) {
    let json;
    if (!jsonText) json = {};else {
      try {
        json = JSON.parse(jsonText);
      } catch (e) {
        json = {};
      }
    }
    this.themeData = jsonText;
    let element;
    if (this.settings.designerSelector) {
      element = document.querySelector(this.settings.designerSelector);
    }
    const cssVariables = json.cssVariables;
    let inp, val;
    let root = document.documentElement;
    if (elm) root = elm;
    val = cssVariables && cssVariables['--form-text-color'] || ''; // get
    root.style.setProperty('--form-text-color', val); // apply
    if (element) inp = element.querySelector('.inp-text-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-primary-color'] || '#3b82f6';
    root.style.setProperty('--form-primary-color', val);
    if (element) inp = element.querySelector('.inp-primary-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-title-color'] || '';
    root.style.setProperty('--form-title-color', val);
    if (element) inp = element.querySelector('.inp-form-title-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-desc-color'] || '';
    root.style.setProperty('--form-desc-color', val);
    if (element) inp = element.querySelector('.inp-form-desc-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-label-color'] || '';
    root.style.setProperty('--form-label-color', val);
    if (element) inp = element.querySelector('.inp-label-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-label-font-size'] || '';
    root.style.setProperty('--form-label-font-size', val);
    if (element) inp = element.querySelector('.inp-label-font-size');
    val = parseFloat(val);
    if (isNaN(val)) val = 1;
    if (inp) inp.value = val * 100;
    val = cssVariables && cssVariables['--form-input-font-size'] || '';
    root.style.setProperty('--form-input-font-size', val);
    if (element) inp = element.querySelector('.inp-input-font-size');
    val = parseFloat(val);
    if (isNaN(val)) val = 1;
    if (inp) inp.value = val * 100;
    val = cssVariables && cssVariables['--form-input-border-color'] || '';
    root.style.setProperty('--form-input-border-color', val);
    if (element) inp = element.querySelector('.inp-input-border-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-primary-border-width'] || '1px';
    root.style.setProperty('--form-primary-border-width', val);
    if (element) inp = element.querySelector('.inp-input-border-width');
    val = parseInt(val);
    if (isNaN(val)) val = 1;
    if (inp) inp.value = val;
    val = cssVariables && cssVariables['--form-secondary-border-width'] || '2px';
    root.style.setProperty('--form-secondary-border-width', val);
    if (element) inp = element.querySelector('.inp-input-focused-border-width');
    val = parseInt(val);
    if (isNaN(val)) val = 2;
    if (inp) inp.value = val;
    val = cssVariables && cssVariables['--form-input-background-color'] || '';
    root.style.setProperty('--form-input-background-color', val);
    if (element) inp = element.querySelector('.inp-input-bg-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-input-text-color'] || '';
    root.style.setProperty('--form-input-text-color', val);
    if (element) inp = element.querySelector('.inp-input-text-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-input-placeholder-color'] || '';
    root.style.setProperty('--form-input-placeholder-color', val);
    if (element) inp = element.querySelector('.inp-input-placeholder-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-choice-border-color'] || '';
    root.style.setProperty('--form-choice-border-color', val);
    if (element) inp = element.querySelector('.inp-choice-border-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-switch-background-color'] || '';
    root.style.setProperty('--form-switch-background-color', val);
    if (element) inp = element.querySelector('.inp-switch-bg-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-switch-knob-color'] || '';
    root.style.setProperty('--form-switch-knob-color', val);
    if (element) inp = element.querySelector('.inp-switch-knob-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-switch-focus-offset-color'] || '';
    root.style.setProperty('--form-switch-focus-offset-color', val);
    if (element) inp = element.querySelector('.inp-switch-focus-offset-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-dropfile-border-color'] || 'rgb(194 194 194)';
    root.style.setProperty('--form-dropfile-border-color', val);
    if (element) inp = element.querySelector('.inp-dropfile-border-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-dropfile-hover-color'] || '';
    root.style.setProperty('--form-dropfile-hover-color', val);
    if (element) inp = element.querySelector('.inp-dropfile-hover-color');
    if (inp) inp.style.backgroundColor = val;

    // Button
    val = cssVariables && cssVariables['--form-button-background-color'] || '';
    root.style.setProperty('--form-button-background-color', val);
    if (element) inp = element.querySelector('.inp-button-bg-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-button-hover-background-color'] || '';
    root.style.setProperty('--form-button-hover-background-color', val);
    if (element) inp = element.querySelector('.inp-button-hover-bg-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-button-text-color'] || '';
    root.style.setProperty('--form-button-text-color', val);
    if (element) inp = element.querySelector('.inp-button-text-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-button-hover-text-color'] || '';
    root.style.setProperty('--form-button-hover-text-color', val);
    if (element) inp = element.querySelector('.inp-button-hover-text-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-button-border-width'] || '1px';
    root.style.setProperty('--form-button-border-width', val);
    if (element) inp = element.querySelector('.inp-button-border-width');
    val = parseInt(val);
    if (isNaN(val)) val = 2;
    if (inp) inp.value = val;
    val = cssVariables && cssVariables['--form-button-border-color'] || '';
    root.style.setProperty('--form-button-border-color', val);
    if (element) inp = element.querySelector('.inp-button-border-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-button-hover-border-color'] || '';
    root.style.setProperty('--form-button-hover-border-color', val);
    if (element) inp = element.querySelector('.inp-reset-hover-border-color');
    if (inp) inp.style.backgroundColor = val;

    // Reset
    val = cssVariables && cssVariables['--form-reset-background-color'] || '';
    root.style.setProperty('--form-reset-background-color', val);
    if (element) inp = element.querySelector('.inp-reset-bg-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-reset-hover-background-color'] || '';
    root.style.setProperty('--form-reset-hover-background-color', val);
    if (element) inp = element.querySelector('.inp-reset-hover-bg-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-reset-text-color'] || '';
    root.style.setProperty('--form-reset-text-color', val);
    if (element) inp = element.querySelector('.inp-reset-text-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-reset-hover-text-color'] || '';
    root.style.setProperty('--form-reset-hover-text-color', val);
    if (element) inp = element.querySelector('.inp-reset-hover-text-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-reset-border-width'] || '1px';
    root.style.setProperty('--form-reset-border-width', val);
    if (element) inp = element.querySelector('.inp-reset-border-width');
    val = parseInt(val);
    if (isNaN(val)) val = 2;
    if (inp) inp.value = val;
    val = cssVariables && cssVariables['--form-reset-border-color'] || '';
    root.style.setProperty('--form-reset-border-color', val);
    if (element) inp = element.querySelector('.inp-reset-border-color');
    if (inp) inp.style.backgroundColor = val;
    val = cssVariables && cssVariables['--form-reset-hover-border-color'] || '';
    root.style.setProperty('--form-reset-hover-border-color', val);
    if (element) inp = element.querySelector('.inp-reset-hover-border-color');
    if (inp) inp.style.backgroundColor = val;
  }
  getTheme(elm) {
    if (!this.settings.designerSelector) {
      if (this.settings.consoleLog) console.log('designerSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.designerSelector);
    let json = {
      cssVariables: {}
    };
    let inp, val;
    let root = document.documentElement;
    if (elm) root = elm;
    inp = element.querySelector('.inp-text-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-text-color'] = val; // save
    root.style.setProperty('--form-text-color', val); // apply

    inp = element.querySelector('.inp-primary-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-primary-color'] = val;
    root.style.setProperty('--form-primary-color', val);
    inp = element.querySelector('.inp-form-title-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-title-color'] = val;
    root.style.setProperty('--form-title-color', val);
    inp = element.querySelector('.inp-form-desc-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-desc-color'] = val;
    root.style.setProperty('--form-desc-color', val);
    inp = element.querySelector('.inp-label-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-label-color'] = val;
    root.style.setProperty('--form-label-color', val);
    inp = element.querySelector('.inp-label-font-size');
    if (inp.value !== '') {
      val = parseInt(inp.value) / 100 + 'rem';
    } else {
      val = '';
    }
    json.cssVariables['--form-label-font-size'] = val;
    root.style.setProperty('--form-label-font-size', val);
    inp = element.querySelector('.inp-input-font-size');
    if (inp.value !== '') {
      val = parseInt(inp.value) / 100 + 'rem';
    } else {
      val = '';
    }
    json.cssVariables['--form-input-font-size'] = val;
    root.style.setProperty('--form-input-font-size', val);
    inp = element.querySelector('.inp-input-border-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-input-border-color'] = val;
    root.style.setProperty('--form-input-border-color', val);
    inp = element.querySelector('.inp-input-border-width');
    val = inp.value + 'px';
    json.cssVariables['--form-primary-border-width'] = val;
    root.style.setProperty('--form-primary-border-width', val);
    inp = element.querySelector('.inp-input-focused-border-width');
    val = inp.value + 'px';
    json.cssVariables['--form-secondary-border-width'] = val;
    root.style.setProperty('--form-secondary-border-width', val);
    inp = element.querySelector('.inp-input-bg-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-input-background-color'] = val;
    root.style.setProperty('--form-input-background-color', val);
    inp = element.querySelector('.inp-input-text-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-input-text-color'] = val;
    root.style.setProperty('--form-input-text-color', val);
    inp = element.querySelector('.inp-input-placeholder-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-input-placeholder-color'] = val;
    root.style.setProperty('--form-input-placeholder-color', val);
    inp = element.querySelector('.inp-choice-border-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-choice-border-color'] = val;
    root.style.setProperty('--form-choice-border-color', val);
    inp = element.querySelector('.inp-switch-bg-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-switch-background-color'] = val;
    root.style.setProperty('--form-switch-background-color', val);
    inp = element.querySelector('.inp-switch-knob-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-switch-knob-color'] = val;
    root.style.setProperty('--form-switch-knob-color', val);
    inp = element.querySelector('.inp-switch-focus-offset-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-switch-focus-offset-color'] = val;
    root.style.setProperty('--form-switch-focus-offset-color', val);
    inp = element.querySelector('.inp-dropfile-border-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-dropfile-border-color'] = val;
    root.style.setProperty('--form-dropfile-border-color', val);
    inp = element.querySelector('.inp-dropfile-hover-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-dropfile-hover-color'] = val;
    root.style.setProperty('--form-dropfile-hover-color', val);

    // Button
    inp = element.querySelector('.inp-button-bg-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-button-background-color'] = val;
    root.style.setProperty('--form-button-background-color', val);
    inp = element.querySelector('.inp-button-hover-bg-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-button-hover-background-color'] = val;
    root.style.setProperty('--form-button-hover-background-color', val);
    inp = element.querySelector('.inp-button-text-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-button-text-color'] = val;
    root.style.setProperty('--form-button-text-color', val);
    inp = element.querySelector('.inp-button-hover-text-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-button-hover-text-color'] = val;
    root.style.setProperty('--form-button-hover-text-color', val);
    inp = element.querySelector('.inp-button-border-width');
    val = inp.value + 'px';
    json.cssVariables['--form-button-border-width'] = val;
    root.style.setProperty('--form-button-border-width', val);
    inp = element.querySelector('.inp-button-border-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-button-border-color'] = val;
    root.style.setProperty('--form-button-border-color', val);
    inp = element.querySelector('.inp-button-hover-border-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-button-hover-border-color'] = val;
    root.style.setProperty('--form-button-hover-border-color', val);

    // Reset
    inp = element.querySelector('.inp-reset-bg-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-reset-background-color'] = val;
    root.style.setProperty('--form-reset-background-color', val);
    inp = element.querySelector('.inp-reset-hover-bg-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-reset-hover-background-color'] = val;
    root.style.setProperty('--form-reset-hover-background-color', val);
    inp = element.querySelector('.inp-reset-text-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-reset-text-color'] = val;
    root.style.setProperty('--form-reset-text-color', val);
    inp = element.querySelector('.inp-reset-hover-text-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-reset-hover-text-color'] = val;
    root.style.setProperty('--form-reset-hover-text-color', val);
    inp = element.querySelector('.inp-reset-border-width');
    val = inp.value + 'px';
    json.cssVariables['--form-reset-border-width'] = val;
    root.style.setProperty('--form-reset-border-width', val);
    inp = element.querySelector('.inp-reset-border-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-reset-border-color'] = val;
    root.style.setProperty('--form-reset-border-color', val);
    inp = element.querySelector('.inp-reset-hover-border-color');
    val = inp.style.backgroundColor;
    json.cssVariables['--form-reset-hover-border-color'] = val;
    root.style.setProperty('--form-reset-hover-border-color', val);
    const themeData = JSON.stringify(json);
    this.themeData = themeData;
    return themeData;
  }
  hideDesigner() {
    const formDesignerContainer = document.querySelector('.formdesigner-container');
    if (formDesignerContainer) formDesignerContainer.classList.add('hidden');
  }

  // isLimited() {
  //     return true;
  // }

  showGenerator() {
    if (!this.settings.generatorSelector) {
      if (this.settings.consoleLog) console.log('generatorSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.generatorSelector);
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('formgenerator-container');
      element.classList.add('fb-ui');
      if (!element.querySelector('.btn-generate-form')) {
        let id = this.getId();

        // Predefined list of ISO 639-1 language codes
        const identifiers = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'zh', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'he', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ny', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'];
        const locale = 'en-US'; // Define the locale for which you want to get the display names

        let languages = [];
        identifiers.forEach(identifier => {
          const name = new Intl.DisplayNames([locale], {
            type: 'language'
          }).of(identifier);
          languages.push({
            id: identifier,
            name: name
          });
        });
        let htmlLanguages = '';
        languages.map(item => htmlLanguages += `<option value="${item.name}"${item.name === this.settings.language ? ' selected' : ''}>
                        ${item.name}
                    </option>`);
        const html = `
                    <div class="inner-container">
                    
                        <div class="settings-title">
                            ${this.out('Generate Form')}
                        </div>

                        <div class="field-div">
                            <label 
                                for="inpPrompt_${id}" 
                                class="field-label">
                                ${this.out('What kind of form would you like to create?')}
                            </label>

                            <textarea 
                                id="inpPrompt_${id}" 
                                class="inp-base" 
                                required="required"></textarea>
                        </div>
                        
                        <div class="field-div${this.settings.languageSelection ? '' : ' hidden'}">
                            <label htmlFor="inpLanguage_${id}" class="field-label">${this.out('Language')}:</label>
                            <div class="relative">
                                <select id="inpLanguage_${id}" aria-label="${this.out('Select language')}" 
                                    class="inp-base">
                                    ${htmlLanguages}
                                </select>
                                <div class="select-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button class="btn-generate-form">
                        ${this.out('Generate')}
                    </button>

                    ${this.settings.demo ? `
                        <p class="demo-info">
                            <b>License Info:</b> a developer license is required to use the library.
                        </p>
                    ` : ''}
                `;
        element.insertAdjacentHTML('afterbegin', html);
        const btnGenerate = element.querySelector('.btn-generate-form');
        btnGenerate.addEventListener('click', async () => {
          const inputPrompt = element.querySelector(`#inpPrompt_${id}`);
          let prompt = inputPrompt.value;
          if (!prompt) {
            inputPrompt.focus();
            return;
          }
          if (this.isGenerating) {
            this.abort();
            this.isGenerating = false;
            btnGenerate.innerHTML = this.out('Generate');
            return;
          }
          this.isGenerating = true;
          btnGenerate.innerHTML = `
                    <span class="loading-icon">
                                <svg class="animate-spin" style="margin:0;margin-right: 0.5rem;width: 1.25rem;height: 1.25rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span> ${this.out('Abort')}`;
          const inputLanguage = element.querySelector(`#inpLanguage_${id}`);
          let language = inputLanguage.value;
          let config = {
            prompt,
            language
          };
          const result = await this.generate(config);
          if (!result) {
            btnGenerate.innerHTML = this.out('Generate');
            return; //aborted
          }

          // const json = JSON.parse(result); // result is already JSON format

          if (this.settings.onGenerate) this.settings.onGenerate(result);
          this.trigger('formGenerate', result);
          this.isGenerating = false;
          btnGenerate.innerHTML = this.out('Generate');
        });
      }
    }
  }
  async generate(config) {
    const prompt = config.prompt;
    const language = config.language || this.settings.language || 'English';
    this.settings.model = config.model || this.settings.model || 'gpt-4o-mini';
    let question = prompt;
    let system = 'You are an assistant';
    let context = `This is example form configuration:

 {
    "title": "Define Your Product Value Proposition",
    "description": "Help us understand your product's unique value to refine your value proposition.",
    "elements": [
        {
            "title": "What is your product name?",
            "name": "product_name",
            "type": "short-text",
            "isRequired": true,
            "placeholder": ""
        },
        {
            "title": "What does your product do?",
            "name": "product_description",
            "type": "long-text",
            "isRequired": true,
            "placeholder": "Briefly describe what your product does."
        },
        {
            "title": "What customer problem does your product solve?",
            "name": "customer_problem",
            "type": "long-text",
            "isRequired": true,
            "placeholder": "Describe the key issue your product addresses."
        },
        {
            "title": "What is your unique value proposition?",
            "name": "unique_value_proposition",
            "type": "long-text",
            "isRequired": true,
            "placeholder": "Explain what sets your product apart from others."
        },
        {
            "title": "Who are your key competitors?",
            "name": "key_competitors",
            "type": "long-text",
            "isRequired": false,
            "placeholder": "List competitors or alternative solutions."
        },
        {
            "title": "What benefits does your product offer?",
            "name": "product_benefits",
            "type": "multi-select",
            "choices": [
                "Convenience (e.g., saves time, simplifies tasks)",
                "Cost-effectiveness (e.g., reduces expenses, offers savings)",
                "Quality improvement (e.g., better than existing solutions)",
                "Access (e.g., makes something more available)",
                "User experience (e.g., intuitive and easy to use)"
            ],
            "showOtherItem": true,
            "otherText": "Other (describe):"
        },
        {
            "title": "Who is your target audience?",
            "name": "target_audience",
            "type": "dropdown",
            "isRequired": true,
            "placeholder": "Select...",
            "choices": [
                "Teens (13-18 years old)",
                "Young Adults (19-30 years old)",
                "Adults (31-50 years old)",
                "Seniors (51+ years old)",
                "Businesses/Organizations"
            ],
            "showOtherItem": true,
            "otherText": "Other (describe)"
        },
        {
            "title": "What metrics define success for your product?",
            "name": "success_metrics",
            "type": "long-text",
            "isRequired": false,
            "placeholder": "E.g., sales volume, user adoption, satisfaction scores."
        },
        {
            "title": "What is your product's pricing model?",
            "name": "pricing_model",
            "type": "select",
            "isRequired": true,
            "choices": [
                "Free",
                "Freemium",
                "Subscription",
                "One-time purchase",
                "Pay-per-use"
            ],
            "showOtherItem": true,
            "otherText": "Other (describe):"
        }
    ]
}
    
You will generate form for gathering data like this based on the instruction. The form inputs should gather enough information to be useful for analysis and insight generation.
For ease of use, maximize the usage of "select", "multi-select", and "switch" input types, not just "long-text" (it's easy to check/switch than to write).
Option for 'Other' must use:

    "showOtherItem": true

and "otherText" must exists regardles "showOtherItem" is true or false.

Write in ${language}.

Now talk. Answer only.
`;
    let functs = [];
    let result = await this.send(question, context, system, '', functs);
    if (!result) {
      return false; //aborted
    }
    if (this.settings.consoleLog) console.log(result);
    const cleaning = s => {
      let startMarker = '```json';
      let endMarker = '```';
      if (s.startsWith(startMarker) && s.endsWith(endMarker)) {
        let content = s.slice(startMarker.length, -endMarker.length).trim();
        return content; // Outputs: ....bla bla ..
      } else {
        return s;
      }
    };
    result = cleaning(result);
    let json;
    try {
      json = JSON.parse(result);
    } catch (e) {
      // Do Nothing
    }
    if (!json) {
      let functs = [{
        name: 'form_generator',
        description: 'Generate a form in JSON format.',
        parameters: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              description: 'Count the number of fields in the form.'
            },
            form: {
              type: 'string',
              description: 'The form in JSON format.'
            }
          },
          required: ['count', 'form']
        }
      }];
      context = '';
      question = `This is my form in JSON format:
            
${result}
            `;
      let response = await this.send(question, context, system, '', functs);
      if (!response) {
        return false; //aborted
      }
      let args = JSON.parse(response);
      if (this.settings.consoleLog) {
        console.log('Parse the Form:');
        console.log(args);
      }
      result = args.form;
    }
    return result;
  }
  abort() {
    if (this.controller) {
      this.controller.abort();
    }
  }
  mediaAbort() {
    if (this.mediaController) {
      this.mediaController.abort();
    }
  }

  /*
  set(jsonText) {
      let json;
      if(!jsonText) json = {};
      else {
          try{
              json = JSON.parse(jsonText);
          } catch(e) {
              json = {};
          }
      }
     
      this.json = json;
      this.formElements = json.elements;
  }
  */

  load(jsonText) {
    let json;
    if (!jsonText) json = {};else {
      try {
        json = JSON.parse(jsonText);
      } catch (e) {
        json = {};
      }
    }

    // this.json = json;
    this.formElements = json.elements;
    this.view(jsonText); // this also has: this.json = json;

    this.showDesigner();
    this.showSettings();
    this.showGenerator();
    if (!this.settings.builderSelector) {
      if (this.settings.consoleLog) console.log('builderSelector not set.');
      return;
    }
    const element = document.querySelector(this.settings.builderSelector);
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('formbuilder-container');
      element.classList.add('fb-ui');
      this.render();
      const formTitle = element.querySelector('.form-title > span');
      formTitle.innerText = json.title || this.out('Your Form Title Here');
      const formDesc = element.querySelector('.form-desc > span');
      formDesc.innerText = json.description || this.out('Your Description Here');
      const fieldsContainer = element.querySelector('.fields-container');
      fieldsContainer.innerHTML = '';
      if (json.elements) json.elements.forEach((field, index) => {
        this.addField(field.type, field.name);
        const fieldsContainer = element.querySelector('.fields-container');
        const item = fieldsContainer.children[index];

        // input file
        const fileOptionContainer = item.querySelectorAll('.file-options-container [type="checkbox"]');
        fileOptionContainer.forEach(chk => {
          if (field.allowedFileTypes && field.allowedFileTypes.includes(chk.value)) {
            chk.checked = true;
          }
        });
        const inpFieldTitle = item.querySelector('.inp-field-title');
        // inpFieldTitle.value = field.title;
        if (inpFieldTitle) inpFieldTitle.innerText = field.title;
        const chkRequired = item.querySelector('.chk-required');
        if (chkRequired) chkRequired.checked = field.isRequired;
        const chkImageMask = item.querySelector('.chk-imagemask');
        if (chkImageMask) chkImageMask.checked = field.useImageMask;
        const chkDisplayInOutput = item.querySelector('.chk-displayoutput');
        if (chkDisplayInOutput) chkDisplayInOutput.checked = field.displayInOutput;
        const chkInputURL = item.querySelector('.chk-inputurl');
        if (chkInputURL) {
          chkInputURL.checked = field.useURL;
          if (chkInputURL.checked) {
            item.querySelector('.inp-placeholder-text').parentNode.style.display = '';
            item.querySelector('.inp-default-value').parentNode.style.display = '';
          } else {
            item.querySelector('.inp-placeholder-text').parentNode.style.display = 'none';
            item.querySelector('.inp-default-value').parentNode.style.display = 'none';
          }
        }
        const chkLargePreview = item.querySelector('.chk-largepreview');
        if (chkLargePreview) chkLargePreview.checked = field.largePreview;
        const inpFileSource = item.querySelector('.inp-filesource');
        if (inpFileSource) inpFileSource.value = field.source || 'local';
        const inpPlaceholderText = item.querySelector('.inp-placeholder-text');
        if (inpPlaceholderText) inpPlaceholderText.value = field.placeholder || '';
        const inpDefaultValue = item.querySelector('.inp-default-value');
        if (inpDefaultValue) inpDefaultValue.value = field.value || '';
        const selDefaultValue = item.querySelector('.sel-default-value');
        if (selDefaultValue) selDefaultValue.value = field.value || 'false';
        const inpMinValue = item.querySelector('.inp-min-value');
        if (inpMinValue) inpMinValue.value = field.minValue || '';
        const inpMaxValue = item.querySelector('.inp-max-value');
        if (inpMaxValue) inpMaxValue.value = field.maxValue || '';
        const inpStep = item.querySelector('.inp-step');
        if (inpStep) inpStep.value = field.step || '';
        const inpSeparatorColor = item.querySelector('.inp-separator-color');
        if (inpSeparatorColor) inpSeparatorColor.style.backgroundColor = field.color || '';
        const inpFieldNote = item.querySelector('.inp-field-note');
        if (inpFieldNote) inpFieldNote.value = field.fieldNote || '';
        const inpTextareaHeight = item.querySelector('.inp-textarea-height');
        if (inpTextareaHeight) inpTextareaHeight.value = field.height || '';
        const inpSpacerHeight = item.querySelector('.inp-spacer-height');
        if (inpSpacerHeight) inpSpacerHeight.value = field.spacerHeight || '20';
        const inpHtml = item.querySelector('.inp-html');
        if (inpHtml) inpHtml.value = field.html || '';
        const inpHeading = item.querySelector('.inp-heading');
        if (inpHeading) inpHeading.value = field.heading || 'h2';
        const inpHeadingText = item.querySelector('.inp-heading-text');
        if (inpHeadingText) inpHeadingText.innerHTML = field.headingText || 'h2';
        const inpParagraphText = item.querySelector('.inp-paragraph-text');
        if (inpParagraphText) inpParagraphText.innerHTML = field.paragraphText || 'h2';
        const inpMedia = item.querySelector('.inp-media');
        if (inpMedia) inpMedia.value = field.tag || 'img';
        const inpMediaUrl = item.querySelector('.inp-media-url');
        if (inpMediaUrl) inpMediaUrl.value = field.url || '';
        item.setAttribute('data-name', field.name);
        const optionsContainer = item.querySelector('.options-container');
        if (optionsContainer) {
          if (field.choices) {
            // const btnAddOption = item.querySelector('.btn-addoption');
            let add = field.choices.length - optionsContainer.children.length;
            if (add > 0) {
              for (let n = 1; n <= add; n++) {
                // btnAddOption.click();
                this.addSelectItem(optionsContainer, field.name, true);
              }
            }
            field.choices.forEach((choice, choiceIndex) => {
              const option = optionsContainer.children[choiceIndex];
              const inpOption = option.querySelector('.inp-option');
              inpOption.value = choice;
              const inpOptionText = option.querySelector('.inp-option-text');
              if (field.choicesText) inpOptionText.value = field.choicesText[choiceIndex] || '';
              if (choiceIndex === field.selected) {
                const rdoSelected = option.querySelector('.rdo-selected input');
                rdoSelected.checked = true;
              }
            });
          }
          const inpOtherOption = item.querySelector('.inp-other-option');
          const btnOther = item.querySelector('.btn-other');
          if (field.showOtherItem) {
            btnOther.classList.add('active');
            btnOther.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        `;
          } else {
            btnOther.classList.remove('active');
            btnOther.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        `;
          }
          inpOtherOption.value = field.otherText || this.out('Other (describe)');
        }
      });
    }
  }
  textToId(text) {
    return text.toLowerCase() // Convert text to lowercase
    .replace(/[^a-z0-9\s]/g, '') // Remove all non-alphanumeric and non-space characters
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Collapse multiple underscores into one
    .replace(/^_|_$/g, ''); // Remove leading or trailing underscores
  }
  getJSON() {
    const jsonText = this.get();
    const form = JSON.parse(jsonText);
    let workflow = {
      steps: this.steps
    };
    const formTitle = this.element.querySelector('.form-title > span');
    let title = formTitle.innerText.trim();
    let template = {
      description: title,
      form,
      workflow
    };
    return template;
  }
  get() {
    if (this.element) {
      let elements = [];
      const fieldsContainer = this.element.querySelector('.fields-container');
      if (!fieldsContainer) {
        console.log('Form is not loaded.');
        return;
      }
      Array.from(fieldsContainer.children).forEach(item => {
        let jsonElm = {};
        const inpFieldTitle = item.querySelector('.inp-field-title');

        // jsonElm.title = inpFieldTitle.value;
        jsonElm.title = inpFieldTitle && inpFieldTitle.innerText || '';
        jsonElm.name = item.getAttribute('data-name') || this.textToId(jsonElm.title);
        jsonElm.type = item.getAttribute('data-type');
        const chkRequired = item.querySelector('.chk-required');
        const inpPlaceholderText = item.querySelector('.inp-placeholder-text');
        const inpDefaultValue = item.querySelector('.inp-default-value');
        const selDefaultValue = item.querySelector('.sel-default-value');
        const inpMinValue = item.querySelector('.inp-min-value');
        const inpMaxValue = item.querySelector('.inp-max-value');
        const inpStep = item.querySelector('.inp-step');
        const inpTextareaHeight = item.querySelector('.inp-textarea-height');
        const chkImageMask = item.querySelector('.chk-imagemask');
        const chkDisplayInOutput = item.querySelector('.chk-displayoutput');
        const chkInputURL = item.querySelector('.chk-inputurl');
        const chkLargePreview = item.querySelector('.chk-largepreview');
        const inpFileSource = item.querySelector('.inp-filesource');
        const inpSpacerHeight = item.querySelector('.inp-spacer-height');
        if (inpSpacerHeight) {
          jsonElm.spacerHeight = inpSpacerHeight.value;
        }
        const inpHtml = item.querySelector('.inp-html');
        if (inpHtml) {
          jsonElm.html = inpHtml.value;
        }
        const inpHeading = item.querySelector('.inp-heading');
        if (inpHeading) {
          jsonElm.heading = inpHeading.value;
        }
        const inpHeadingText = item.querySelector('.inp-heading-text');
        if (inpHeadingText) {
          jsonElm.headingText = inpHeadingText.innerHTML;
        }
        const inpParagraphText = item.querySelector('.inp-paragraph-text');
        if (inpParagraphText) {
          jsonElm.paragraphText = inpParagraphText.innerHTML;
        }
        const inpMedia = item.querySelector('.inp-media');
        if (inpMedia) {
          jsonElm.tag = inpMedia.value;
        }
        const inpMediaUrl = item.querySelector('.inp-media-url');
        if (inpMediaUrl) {
          jsonElm.url = inpMediaUrl.value;
        }
        const inpFieldNote = item.querySelector('.inp-field-note');
        if (inpFieldNote) {
          jsonElm.fieldNote = inpFieldNote.value;
        }
        const inpSeparatorColor = item.querySelector('.inp-separator-color');
        if (inpSeparatorColor) {
          jsonElm.color = inpSeparatorColor.style.backgroundColor;
        }
        if (chkRequired) {
          jsonElm.isRequired = chkRequired.checked;
        }
        if (chkImageMask) {
          jsonElm.useImageMask = chkImageMask.checked;
        }
        if (chkDisplayInOutput) {
          jsonElm.displayInOutput = chkDisplayInOutput.checked;
        }
        if (chkInputURL) {
          jsonElm.useURL = chkInputURL.checked;
        }
        if (chkLargePreview) {
          jsonElm.largePreview = chkLargePreview.checked;
        }
        if (inpFileSource) {
          jsonElm.source = inpFileSource.value;
        }
        if (inpPlaceholderText) {
          jsonElm.placeholder = inpPlaceholderText.value;
        }
        if (inpDefaultValue) {
          jsonElm.value = inpDefaultValue.value;
        }
        if (selDefaultValue) {
          jsonElm.value = selDefaultValue.value;
        }
        if (inpMinValue) {
          jsonElm.minValue = inpMinValue.value;
        }
        if (inpMaxValue) {
          jsonElm.maxValue = inpMaxValue.value;
        }
        if (inpStep) {
          jsonElm.step = inpStep.value;
        }
        if (inpTextareaHeight) {
          jsonElm.height = inpTextareaHeight.value;
        }
        const optionsContainer = item.querySelector('.options-container');
        if (optionsContainer) {
          let choices = [];
          let choicesText = [];
          Array.from(optionsContainer.children).forEach(option => {
            const inpOption = option.querySelector('.inp-option');
            choices.push(inpOption.value);
            const inpOptionText = option.querySelector('.inp-option-text');
            choicesText.push(inpOptionText.value);
          });
          jsonElm.choices = choices;
          jsonElm.choicesText = choicesText;
          const btnOther = item.querySelector('.btn-other');
          if (btnOther && btnOther.classList.contains('active')) {
            jsonElm.showOtherItem = true;
            const inpOtherOption = item.querySelector('.inp-other-option');
            if (inpOtherOption) {
              jsonElm.otherText = inpOtherOption.value;
            }
          }
          const radios = optionsContainer.querySelectorAll('input[type="radio"]');
          const selectedIndex = Array.from(radios).findIndex(radio => radio.checked);
          jsonElm.selected = selectedIndex;
        }
        const selectedCategories = Array.from(item.querySelectorAll('input[name="file-category"]:checked')).map(input => input.value);
        if (selectedCategories && selectedCategories.length > 0) {
          jsonElm.allowedFileTypes = selectedCategories;
        }
        elements.push(jsonElm);
      });
      this.formElements = elements;
      const formTitle = this.element.querySelector('.form-title > span');
      let title = formTitle.innerText.trim();
      const formDesc = this.element.querySelector('.form-desc > span');
      let description = formDesc.innerText.trim();
      let json = {
        title,
        description,
        elements
        //     useSubmitButton,
        //     submitText,
        //     hideHeader
      };
      let settingsElement;
      if (this.settings.settingsSelector) {
        settingsElement = document.querySelector(this.settings.settingsSelector);
      }
      let text, hide, resetText, hideReset, fullWidthButton;
      if (settingsElement) {
        // Submit
        const inpSubmitText = settingsElement.querySelector('.inp-submit-text');
        if (inpSubmitText) text = inpSubmitText.value;
        const checkbox = settingsElement.querySelector('input[name="hideheader"]');
        if (checkbox) hide = checkbox.checked;
        json.submitText = text;

        // Reset
        const inpResetText = settingsElement.querySelector('.inp-reset-text');
        if (inpResetText) resetText = inpResetText.value;
        const checkboxReset = settingsElement.querySelector('input[name="hidereset"]');
        if (checkboxReset) hideReset = checkboxReset.checked;
        const checkboxFullWidth = settingsElement.querySelector('input[name="fullwidthbutton"]');
        if (checkboxFullWidth) fullWidthButton = checkboxFullWidth.checked;
        json.resetText = resetText;
        json.hideReset = hideReset;
        json.fullWidthButton = fullWidthButton;
        json.hideHeader = hide;
      } else {
        json.submitText = this.json.submitText || this.settings.submitText;
        json.hideHeader = this.json.hideHeader || false;
        json.resetText = this.json.resetText || this.settings.resetText;
        json.hideReset = this.json.hideReset || false;
        json.fullWidthButton = this.json.fullWidthButton || false;
      }
      json.useSubmitButton = this.settings.useSubmitButton;
      if (this.json.provider) json.provider = this.json.provider; // Persists direct specify of provider

      // Refresh prompt editors
      this.refreshPromptEditors();
      const jsonText = JSON.stringify(json);
      return jsonText;
    } else {
      let settingsElement;
      if (this.settings.settingsSelector) {
        settingsElement = document.querySelector(this.settings.settingsSelector);
      }
      let text, hide, resetText, hideReset, fullWidthButton;
      if (settingsElement) {
        // Submit
        const inpSubmitText = settingsElement.querySelector('.inp-submit-text');
        if (inpSubmitText) text = inpSubmitText.value;
        const checkbox = settingsElement.querySelector('input[name="hideheader"]');
        if (checkbox) hide = checkbox.checked;
        this.json.submitText = text;

        // Reset
        const inpResetText = settingsElement.querySelector('.inp-reset-text');
        if (inpResetText) resetText = inpResetText.value;
        const checkboxReset = settingsElement.querySelector('input[name="hidereset"]');
        if (checkboxReset) hideReset = checkboxReset.checked;
        const checkboxFullWidth = settingsElement.querySelector('input[name="fullwidthbutton"]');
        if (checkboxFullWidth) fullWidthButton = checkboxFullWidth.checked;
        this.json.resetText = resetText;
        this.json.hideReset = hideReset;
        this.json.fullWidthButton = fullWidthButton;
        this.json.hideHeader = hide;
      }
      const jsonText = JSON.stringify(this.json);
      return jsonText;
    }
  }
  refreshPromptEditors() {
    if (!this.settings.workflowSelector) return;
    const workflowElement = document.querySelector(this.settings.workflowSelector);
    if (!workflowElement) return;
    let elements = this.formElements;
    if (this.steps.length > 0) {
      this.promptEditors.forEach((obj, index) => {
        let tags = [];
        elements.forEach(item => {
          if (item.name === '') return;
          let title = item.title;
          title = title.replace(/:/g, '');
          tags.push({
            title,
            name: item.name.toUpperCase()
          });
          if (item.useImageMask) {
            tags.push({
              title: title + ' Mask',
              name: item.name.toUpperCase() + '_MASK'
            });
          }
          if (item.type === 'color') {
            tags.push({
              title: title + ' Red',
              name: item.name.toUpperCase() + '_RED'
            });
            tags.push({
              title: title + ' Green',
              name: item.name.toUpperCase() + '_GREEN'
            });
            tags.push({
              title: title + ' Blue',
              name: item.name.toUpperCase() + '_BLUE'
            });
          }
        });
        const stepNum = index + 1;
        for (let i = 1; i < stepNum; i++) {
          tags.push({
            title: `Output from step ${i}`,
            name: `OUTPUT_STEP_${i}`
          });
        }

        // re-render tags dropdown
        obj.settings.tags = tags;
        obj.renderDropdown();
      });
      this.contextEditors.forEach((obj, index) => {
        let tags = [];
        elements.forEach(item => {
          if (item.name === '') return;
          let title = item.title;
          title = title.replace(/:/g, '');
          tags.push({
            title,
            name: item.name.toUpperCase()
          });
          if (item.useImageMask) {
            tags.push({
              title: title + ' Mask',
              name: item.name.toUpperCase() + '_MASK'
            });
          }
          if (item.type === 'color') {
            tags.push({
              title: title + ' Red',
              name: item.name.toUpperCase() + '_RED'
            });
            tags.push({
              title: title + ' Green',
              name: item.name.toUpperCase() + '_GREEN'
            });
            tags.push({
              title: title + ' Blue',
              name: item.name.toUpperCase() + '_BLUE'
            });
          }
        });
        const stepNum = index + 1;
        for (let i = 1; i < stepNum; i++) {
          tags.push({
            title: `Output from step ${i}`,
            name: `OUTPUT_STEP_${i}`
          });
        }

        // re-render tags dropdown
        obj.settings.tags = tags;
        obj.renderDropdown();
      });
    }
  }
  getFileInput(inputName) {
    let preview;
    if (this.settings.isBuilder) {
      if (!this.settings.previewSelector) {
        if (this.settings.consoleLog) console.log('previewSelector not set.');
        return;
      }
      preview = document.querySelector(this.settings.previewSelector);
    } else {
      preview = this.element;
    }
    if (!preview) return null;
    if (inputName) {
      return preview.querySelector(`input[type="file"][name="${inputName}"]`);
    } else {
      return preview.querySelector('input[type="file"]');
    }
  }

  // getFormValues is only used in process
  getFormValues() {
    if (!this.settings.previewSelector) {
      if (this.settings.consoleLog) console.log('previewSelector not set.');
      return [];
    }
    const preview = document.querySelector(this.settings.previewSelector);
    if (!preview) return [];
    const inputs = preview.querySelectorAll('[name]');
    if (inputs.length === 0) {
      // alert('No form elements found.');
      return {};
    }
    const values = {};
    inputs.forEach(input => {
      let {
        name,
        type,
        value,
        checked,
        files
      } = input;
      if (type === 'checkbox') {
        // If it's a checkbox, handle multiple checked values

        name = name.replace('[]', ''); // remove [] from name for process() usage.

        if (checked) {
          values[name] = values[name] || [];
          if (value === 'other') {
            const inputOther = preview.querySelector(`[name="${name + '_other'}"]`);
            value = inputOther.value;
          }
          values[name].push(value);
        }
      } else if (type === 'radio') {
        // If it's a radio button, only one can be selected at a time
        if (checked) {
          if (value === 'other') {
            const inputOther = preview.querySelector(`[name="${name + '_other'}"]`);
            value = inputOther.value;
          }
          values[name] = value;
        }
      } else if (type === 'select-one') {
        if (value === 'other') {
          const inputOther = preview.querySelector(`[name="${name + '_other'}"]`);
          value = inputOther.value;
        }
        values[name] = value;
      } else if (type === 'file') {
        // For file inputs, we store the FileList
        // if (files.length > 0) {
        //     values[name] = files;
        // }
        values[name] = files;
      } else if (type === 'select-multiple') {
        // Handle multi-select dropdowns
        const selectedOptions = Array.from(input.selectedOptions);
        values[name] = selectedOptions.map(option => option.value);
      } else if (type === 'color') {
        values[name] = value;
        const color = this.hexToRgb(value);
        values[name + '_red'] = color.red;
        values[name + '_green'] = color.green;
        values[name + '_blue'] = color.blue;
      } else {
        // For text inputs, textareas, etc.
        values[name] = value;
      }
    });
    let formValues = [];
    let args = JSON.parse(this.get());
    args.elements.forEach(item => {
      let questions = item.title;
      let name = item.name;
      let type = item.type;
      if (name === '') return; // for spacer, etc

      let value = values[name];
      let field = {
        questions,
        name,
        value,
        type
      };
      formValues.push(field);
      let name_url = name + '__url';
      value = values[name_url];
      if (value) {
        field = {
          questions,
          name: name_url,
          value
        };
        formValues.push(field);
      }

      // masking
      if (item.useImageMask) {
        name = name + '_mask';
        value = values[name];
        field = {
          questions,
          name,
          value
        };
        formValues.push(field);
      }

      // rgb color
      let name_red = name + '_red';
      value = values[name_red];
      if (value !== undefined) {
        field = {
          questions,
          name: name_red,
          value
        };
        formValues.push(field);
      }
      let name_green = name + '_green';
      value = values[name_green];
      if (value !== undefined) {
        field = {
          questions,
          name: name_green,
          value
        };
        formValues.push(field);
      }
      let name_blue = name + '_blue';
      value = values[name_blue];
      if (value !== undefined) {
        field = {
          questions,
          name: name_blue,
          value
        };
        formValues.push(field);
      }
    });
    if (this.settings.consoleLog) console.log(formValues);
    return formValues;
  }
  hexToRgb(hex) {
    const cleaned = hex.replace('#', '');
    const bigint = parseInt(cleaned, 16);
    const r = bigint >> 16 & 255;
    const g = bigint >> 8 & 255;
    const b = bigint & 255;
    return {
      red: r,
      green: g,
      blue: b
    };
  }
  getId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  appendHtml(element, html) {
    if (element && html) {
      element.insertAdjacentHTML('beforeend', html);
    }
  }
  clearAllEventListener(pop) {
    for (let i = 0; i < 10; i++) {
      pop.removeEventListener('keydown', this.handlePopKeyDown);
      document.removeEventListener('mousedown', this.handlePopClickOut);
      document.removeEventListener('touchstart', this.handlePopClickOut, {
        passive: false
      });
    }
  }
  showPop(pop, cancelCallback, btn) {
    // Hide other pops
    let elms = document.querySelectorAll('.is-pop.active');
    elms.forEach(otherPop => {
      // do not close parent/caller pop
      let close = true;
      if (otherPop.contains(btn)) close = false;
      if (otherPop !== pop && close) {
        otherPop.style.display = '';
        otherPop.classList.remove('active');
        otherPop.setAttribute('aria-hidden', true);
      }
    });

    // this.clearAllEventListener(pop); 

    pop.style.display = 'flex';
    pop.classList.add('active');
    pop.setAttribute('aria-hidden', false);

    // this.setupTabKeys(pop);

    pop.focus({
      preventScroll: true
    });
    this.handlePopClickOut = e => {
      if (!pop.contains(e.target) && !btn.contains(e.target)) {
        // click outside

        // hide
        this.hidePop(pop);
        if (cancelCallback) cancelCallback();
        if (btn) btn.focus();
      }
    };
    this.handlePopKeyDown = e => {
      if (e.keyCode === 27) {
        // escape key
        // hide
        this.hidePop(pop);
        if (cancelCallback) cancelCallback();
        if (btn) btn.focus();
      }
    };
    pop.addEventListener('keydown', this.handlePopKeyDown);
    document.addEventListener('mousedown', this.handlePopClickOut);
    document.addEventListener('touchstart', this.handlePopClickOut, {
      passive: false
    });
  }
  hidePop(pop) {
    pop.style.display = '';
    pop.classList.remove('active');
    document.activeElement.blur();
    pop.setAttribute('aria-hidden', true);

    // Clean up event listeners
    if (this.handlePopClickOut) {
      document.removeEventListener('mousedown', this.handlePopClickOut);
      document.removeEventListener('touchstart', this.handlePopClickOut, {
        passive: false
      });
      this.handlePopClickOut = null; // Clean up reference
    }
    if (this.handlePopKeyDown) {
      pop.removeEventListener('keydown', this.handlePopKeyDown);
      this.handlePopKeyDown = null; // Clean up reference
    }
  }
  cleanup() {
    if (!this.settings.previewSelector) return;
    const preview = document.querySelector(this.settings.previewSelector);
    if (preview) {
      let inputs = preview.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="tel"], input[type="url"], textarea');
      inputs.forEach(input => {
        input.removeEventListener('input', this.inputListener);
      });
      inputs = preview.querySelectorAll('input[type="date"], input[type="radio"], input[type="checkbox"]');
      inputs.forEach(input => {
        input.removeEventListener('change', this.changeListener);
      });

      // file, switch, dropdown

      // Clear any remaining debounce timeouts
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = null; // Nullify the timeout reference to ensure it is cleared
      }
    }
  }
  destroy() {
    // Remove existing listener if it exists.
    try {
      if (this._scrollListener) {
        let preview;
        if (this.settings.isBuilder) {
          preview = document.querySelector(this.settings.previewSelector);
        } else {
          preview = this.element;
        }
        const divSubmitContainer = preview.querySelector('.submit-container');
        const scrollableParent = this.getScrollableParent(divSubmitContainer);
        if (scrollableParent) {
          scrollableParent.removeEventListener('scroll', this._scrollListener);
        } else {
          window.removeEventListener('scroll', this._scrollListener);
        }
        window.removeEventListener('resize', this._scrollListener);
      }
    } catch (e) {
      // Do Nothing
    }
    if (this.settings.builderSelector) {
      const builderElement = document.querySelector(this.settings.builderSelector);
      if (builderElement) {
        // this.cleanupBuilder();
        builderElement.innerHTML = '';
        builderElement.classList.remove('formbuilder-container');
        builderElement.classList.remove('fb-ui');
      }
    }
    if (this.settings.designerSelector) {
      const designerElement = document.querySelector(this.settings.designerSelector);
      if (designerElement) {
        designerElement.innerHTML = '';
        designerElement.classList.remove('formdesigner-container');
        designerElement.classList.remove('fb-ui');
      }
    }
    if (this.settings.settingsSelector) {
      const settingsElement = document.querySelector(this.settings.settingsSelector);
      if (settingsElement) {
        settingsElement.innerHTML = '';
        settingsElement.classList.remove('formsettings-container');
        settingsElement.classList.remove('fb-ui');
      }
    }
    if (this.settings.generatorSelector) {
      const generatorElement = document.querySelector(this.settings.generatorSelector);
      if (generatorElement) {
        generatorElement.innerHTML = '';
        generatorElement.classList.remove('formgenerator-container');
        generatorElement.classList.remove('fb-ui');
      }
    }
    if (this.settings.workflowSelector) {
      const workflowElement = document.querySelector(this.settings.workflowSelector);
      if (workflowElement) {
        workflowElement.innerHTML = '';
        workflowElement.classList.remove('formworkflow-container');
        workflowElement.classList.remove('fb-ui');
      }
    }
    if (this.settings.previewSelector) {
      const previewElement = document.querySelector(this.settings.previewSelector);
      if (previewElement) {
        this.cleanup();
        previewElement.innerHTML = '';
        previewElement.classList.remove('formview-container');
        previewElement.classList.remove('fb-ui');
      }
    }
    if (this.settings.resultSelector) {
      const resultElement = document.querySelector(this.settings.resultSelector);
      if (resultElement) {
        resultElement.innerHTML = '';
        resultElement.classList.remove('result-container');
        resultElement.classList.remove('fb-ui');
      }
    }
    if (this.settings.templatesSelector) {
      let templatesElement = document.querySelector(this.settings.templatesSelector);
      if (templatesElement) {
        templatesElement.innerHTML = '';
        templatesElement.classList.remove('templates-container');
        templatesElement.classList.remove('fb-ui');
      }
    }

    // Remove all listeners
    for (const event in this.listeners) {
      this.listeners[event].clear();
    }
    this.listeners = {};
    let builderStuff = document.querySelector('#_fbhtml');
    if (builderStuff) builderStuff.remove();
  }
  out(s) {
    let val = this.settings.lang[s];
    if (val) return val;else {
      return s;
    }
  }
  log(s) {
    console.log(s);
  }
}

export { FormBuilderAI as default };
