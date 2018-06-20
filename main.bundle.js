webpackJsonp(["main"],{

/***/ "../../../node_modules/hammerjs/hammer.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return Hammer;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<home></home>"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'app';
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("./src/app/app.component.html"),
            styles: [__webpack_require__("./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__profesores_tab_tab_module__ = __webpack_require__("./src/app/profesores/tab/tab.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_hammerjs__ = __webpack_require__("../../../node_modules/hammerjs/hammer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__profesores_home_home_component__ = __webpack_require__("./src/app/profesores/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__profesores_profile_profile_component__ = __webpack_require__("./src/app/profesores/profile/profile.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__profesores_education_education_component__ = __webpack_require__("./src/app/profesores/education/education.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__profesores_biography_biography_component__ = __webpack_require__("./src/app/profesores/biography/biography.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__profesores_articles_articles_component__ = __webpack_require__("./src/app/profesores/articles/articles.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__profesores_books_books_component__ = __webpack_require__("./src/app/profesores/books/books.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__profesores_book_char_book_char_component__ = __webpack_require__("./src/app/profesores/book-char/book-char.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__profesores_confe_paper_confe_paper_component__ = __webpack_require__("./src/app/profesores/confe-paper/confe-paper.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__profesores_projects_projects_component__ = __webpack_require__("./src/app/profesores/projects/projects.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__profesores_services_services_component__ = __webpack_require__("./src/app/profesores/services/services.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__profesores_compartido_services_service_service__ = __webpack_require__("./src/app/profesores/compartido/services/service.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






//import { FormsModule } from '@angular/forms';
//import {MatInputModule} from '@angular/material/input';
//import {MatTabsModule} from '@angular/material/tabs';












var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["G" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_7__profesores_home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_8__profesores_profile_profile_component__["a" /* ProfileComponent */],
                __WEBPACK_IMPORTED_MODULE_9__profesores_education_education_component__["a" /* EducationComponent */],
                __WEBPACK_IMPORTED_MODULE_10__profesores_biography_biography_component__["a" /* BiographyComponent */],
                __WEBPACK_IMPORTED_MODULE_11__profesores_articles_articles_component__["a" /* ArticlesComponent */],
                __WEBPACK_IMPORTED_MODULE_12__profesores_books_books_component__["a" /* BooksComponent */],
                __WEBPACK_IMPORTED_MODULE_13__profesores_book_char_book_char_component__["a" /* BookCharComponent */],
                __WEBPACK_IMPORTED_MODULE_14__profesores_confe_paper_confe_paper_component__["a" /* ConfePaperComponent */],
                __WEBPACK_IMPORTED_MODULE_15__profesores_projects_projects_component__["a" /* ProjectsComponent */],
                __WEBPACK_IMPORTED_MODULE_16__profesores_services_services_component__["a" /* ServicesComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_3__profesores_tab_tab_module__["a" /* TabModule */]
                //  MatTabsModule,
                //  MatInputModule
                //  FormsModule
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_17__profesores_compartido_services_service_service__["a" /* ServiceService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/profesores/articles/articles.component.css":
/***/ (function(module, exports) {

module.exports = ".publicacion    {\r\n    border-bottom: solid 1px dimgrey;\r\n    width: 95%;\r\n    height: auto;\r\n    margin-top: 20px;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 50px;\r\n  }\r\n  \r\n  .componente{\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    width: 90%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-bottom: 20px; \r\n    margin-left: 20px;   \r\n    background: white;\r\n  }\r\n  \r\n  .fondo {\r\n        \r\n    width: 80%;\r\n    height: auto;  \r\n    margin-top: 10px;\r\n    background: white;\r\n    \r\n}\r\n  \r\n  label{\r\n    font-size: 20px;\r\n    display: inline-block;\r\n    width: 80px;\r\n  }\r\n  \r\n  output{\r\n    text-align: justify;\r\n    display: inline-block;\r\n    font-size: 20px;\r\n    margin-left: 120px;\r\n  }\r\n  \r\n  p{\r\n    font-style: italic;\r\n    text-align: justify;\r\n    font-size: 18px;\r\n    margin-right: 25px;\r\n    margin-left: 100px;\r\n    margin-top: 0px;\r\n  }\r\n  \r\n  h2{\r\n  margin-top: 0;\r\n  margin-bottom: 7px;\r\n  margin-left: 12px;\r\n}\r\n  \r\n  h3{\r\n  font-size: 22px;\r\n  text-transform: capitalize;\r\n}\r\n  \r\n  h1{\r\n\r\n  margin-left: 24px;\r\n  margin-bottom: 5px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/profesores/articles/articles.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fondo\">\n\n<h1>Articles</h1>\n\n<div class=\"componente\">\n  \n\n<ul>\n  <li class=\"publicacion\" *ngFor=\"let a of articulos\">\n      \n        <h3>{{a.titulo}}</h3>\n      \n      <label for=\"fechaPublicacion\">Publication: </label>\n      <output type=\"text\" name=\"fechaPublicacion\" id=\"fechaPublicacion\" value=\"{{a.fechaPublicacion}}\"></output>\n      <br>\n      <label for=\"revista\">Journal: </label>\n      <output type=\"text\" name=\"revista\" id=\"revista\" value=\"{{a.revista}}\"></output>\n      <br>\n      <label for=\"temas\">Topics: </label>\n      <output type=\"text\" name=\"temas\" id=\"temas\" value=\"{{getTemas(a)}}\"></output>\n      <br>\n      <label for=\"autores\">Authors: </label>\n      <p>\n              {{getAutores(a)}}\n          </p>\n\n        </li>\n        \n</ul>\n</div>\n\n</div>\n"

/***/ }),

/***/ "./src/app/profesores/articles/articles.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArticlesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compartido_clases_articulo__ = __webpack_require__("./src/app/profesores/compartido/clases/articulo.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ArticlesComponent = /** @class */ (function () {
    function ArticlesComponent() {
    }
    ArticlesComponent.prototype.ngOnInit = function () {
        this.getArticulos();
    };
    ArticlesComponent.prototype.getArticulos = function () {
        this.articulos = [];
        for (var i = 0; i < this.profesor.productos.length; i++) {
            if (this.profesor.productos[i] instanceof __WEBPACK_IMPORTED_MODULE_2__compartido_clases_articulo__["a" /* Articulo */]) {
                this.articulos.push(this.profesor.productos[i]);
            }
        }
    };
    ArticlesComponent.prototype.getTemas = function (p) {
        var t = "";
        for (var i = 0; i < p.temas.length; i++) {
            if (i > 0 && i < (p.temas.length) && t != "") {
                t = t + ",";
            }
            t = t + p.temas[i];
        }
        return t;
    };
    ArticlesComponent.prototype.getAutores = function (p) {
        var t = "";
        for (var i = 0; i < p.coautores.length; i++) {
            t = t + p.coautores[i] + ", ";
        }
        return t;
    };
    ArticlesComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], ArticlesComponent.prototype, "profesor", void 0);
    ArticlesComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'articles',
            template: __webpack_require__("./src/app/profesores/articles/articles.component.html"),
            styles: [__webpack_require__("./src/app/profesores/articles/articles.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ArticlesComponent);
    return ArticlesComponent;
}());



/***/ }),

/***/ "./src/app/profesores/biography/biography.component.css":
/***/ (function(module, exports) {

module.exports = ".imagen{\r\n    \r\n    width: 40%;\r\n    \r\n    \r\n    float: left;\r\n    margin-top: 0;\r\n\r\n}\r\n\r\n.informacion{\r\n    margin-top: 0;\r\n    width: auto;\r\n    height: auto;   \r\n    \r\n    \r\n    \r\n}\r\n\r\n.study{\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    width: 95%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 4    0px;   \r\n    border-bottom: solid 1px dimgrey;  \r\n}\r\n\r\n.bio{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    width: 95%;\r\n    font-size: 23px;\r\n    margin-top: 0;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 20px;\r\n    background: snow;\r\n    \r\n}\r\n\r\n.studies{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    width: 95%;\r\n\r\n    margin-top: 0;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 20px;\r\n    background: snow;\r\n    \r\n\r\n}\r\n\r\n.awards{\r\n\r\n        border: solid 1px dimgrey;\r\n        -webkit-box-shadow: 4px 8px gray;\r\n                box-shadow: 4px 8px gray;\r\n        margin-left: 15px;\r\n        margin-bottom: 25px;\r\n        background: snow;\r\n        width: 23%;\r\n        height: auto;\r\n        float: left;\r\n    \r\n         \r\n        \r\n    }\r\n\r\n.li{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    background: snow;\r\n    text-align: justify;   \r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n    padding: 10px;\r\n}\r\n\r\n.amarillo{\r\n    border: solid yellow;\r\n    width: 100%;\r\n    height: 20px;\r\n    display: inline-table;\r\n}\r\n\r\nimg{\r\n    \r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    margin-top: 0;\r\n    margin-right: 100px;\r\n    vertical-align: top;\r\n    \r\n}\r\n\r\nbody{\r\n    margin-top: 5px;\r\n    \r\n    background: transparent;\r\n}\r\n\r\n.perfil{\r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    border-radius: 30%;\r\n    vertical-align: top;\r\n    margin-left: 10px;\r\n}\r\n\r\n.istar{\r\n    width: 25%;\r\n    display: table-cell;    \r\n    vertical-align: middle;\r\n}\r\n\r\n.datos{\r\n\r\n    width: auto;\r\n    height: auto;\r\n\r\n}\r\n\r\n.info{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    background: snow;\r\n    width: 95%;\r\n    height: auto;\r\n    \r\n}\r\n\r\n.miembro{\r\n        \r\n    width: 75%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n    cursor:  progress;\r\n}\r\n\r\n.primaryA{\r\n    font-style: italic;\r\n    margin-left: 0;\r\n}\r\n\r\n.blanco{\r\nwidth: 20%;\r\n}\r\n\r\n.titulo{\r\n    \r\n    width: 100%;\r\n    height: auto;\r\n    display: table-cell;    \r\n    text-align: right;    \r\n}\r\n\r\n.url{\r\n    margin-left: 45%;\r\n    \r\n}\r\n\r\n.cv{\r\n    margin-left: 30px;\r\n    font-style: italic;\r\n}\r\n\r\n.h3t{\r\n    margin-top: 10px;\r\n    margin-left: 0;\r\n    \r\n    border-bottom:solid  gray ;\r\n}\r\n\r\n#contenedor {\r\n    \r\n    width: 73%;\r\n    height: auto;  \r\n    margin: 0 auto;\r\n    float: left;\r\n    background: white;\r\n    \r\n    }\r\n\r\n#cabecera {\r\n    background: navy;\r\n    \r\n    height: auto;\r\n    width: 100%;\r\n    display: inline-table;\r\n    }\r\n\r\n#lzquierda  {\r\n    \r\n\r\n    float: left;\r\n   \r\n    height: auto;\r\n    width: 35%;\r\n    \r\n    \r\n    }\r\n\r\n#Derecha  {\r\n        \r\n        display: -webkit-box;\r\n        \r\n        display: -ms-flexbox;\r\n        \r\n        display: flex;\r\n        -webkit-box-pack: center;\r\n            -ms-flex-pack: center;\r\n                justify-content: center;\r\n        width: 100%;\r\n        \r\n        \r\n    }\r\n\r\n#Centro  {\r\n    \r\n        margin-top: 10px;\r\n        display: table;\r\n        \r\n        height: auto;\r\n        width: 100%;\r\n        display: inline-table;\r\n        \r\n        }\r\n\r\n#principalCentro  {\r\n        background: transparent;\r\n        width: 100%;\r\n\r\n    }\r\n\r\n#equipo  {\r\n\r\n        background: #fff;\r\n        display: table;\r\n        \r\n        display: table-cell;\r\n        height: auto;\r\n        width: 15%;\r\n        margin-top: 50px;\r\n        margin-left: 10px;\r\n        }\r\n\r\n#pie  {\r\n    background: white;\r\n    \r\n    width: 100%;\r\n    height: auto;\r\n    }\r\n\r\n/*---------------------------------------------MODAL*/\r\n\r\np{\r\n    text-align: justify;\r\n    margin-right: 25px;\r\n    margin-left: 25px;\r\n    \r\n}\r\n\r\n.cabecera_text{\r\n    vertical-align: text-bottom;\r\n    color: mintcream;\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-right: 15px;\r\n}\r\n\r\nh2,h4{\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-left: 40px;\r\n}\r\n\r\nh1{\r\n\r\n    margin-left: 24px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\nlabel{\r\n  font-size: 20px;\r\n  display: inline-block;\r\n  width: 80px;\r\n}\r\n\r\noutput{\r\n  text-align: justify;\r\n  display: inline-block;\r\n  font-size: 20px;\r\n  margin-left: 30px;\r\n}\r\n\r\nh3{\r\nfont-size: 22px;\r\ntext-transform: capitalize;\r\n}"

/***/ }),

/***/ "./src/app/profesores/biography/biography.component.html":
/***/ (function(module, exports) {

module.exports = "<body>\n \n    <!-- Contenedor para toda la página -->\n     \n   <div id=\"contenedor\">\n    \n     \n   <div id=\"principalCentro\">\n        \n    \n        <div class=\"informacion\">\n\n            <div class=\"datos\">\n\n                <h1>{{profesor.nombre}}</h1>\n                <h2>Biography</h2>\n                                     \n            </div>\n\n        </div>\n\n\n        <div id=\"Centro\">\n            \n          <div id=\"Derecha\">\n                  \n                    <div class=\"bio\">\n                        \n                        <p>{{profesor.extracto}}</p>\n                    </div>\n\n          </div>\n\n        </div>\n        \n\n\n    </div>\n\n\n    <div id=\"principalCentro\">\n        \n      \n        <h2>Studies</h2>\n    <div class=\"studies\">\n    <ul>\n          <li class=\"study\" *ngFor=\"let e of profesor.educacion\">\n              \n            <h3>{{e.institucion}} </h3>\n              <output  type=\"text\" name=\"institution\" id=\"institution\" value=\"{{e.titulacion}}\"></output>\n              <br>\n              <output  type=\"text\" name=\"disciplia\" id=\"disciplia\" value=\"{{e.disciplia}}\"></output>\n              <br>\n              <output  type=\"text\" name=\"periodo\" id=\"periodo\" >Inicio: {{e.anoInicio}}  &nbsp;&nbsp; Fin: {{e.anoFin}}</output>\n            <br>\n            <br>                    \n              \n                   \n          </li>\n    </ul>\n\n    </div>\n\n    </div>\n\n\n\n    \n  </div>\n\n\n \n  <div  class=\"awards\">\n    <h2>Awards</h2>\n    <ul >\n        <li  *ngFor=\"let a of profesor.awards\">\n\n                    {{a.description}}.\n                    \n                    <output type=\"text\" class=\"primaryA\" name=\"year\" id=\"year\">({{a.year}})</output>\n                    <br>\n                    <br>\n            \n          </li> \n    </ul>\n\n</div>\n    \n\n    <!-- Capa para el pie de página -->\n     \n   <div id=\"pie\">   \n\n\n    </div>\n\n    "

/***/ }),

/***/ "./src/app/profesores/biography/biography.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BiographyComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BiographyComponent = /** @class */ (function () {
    function BiographyComponent() {
    }
    BiographyComponent.prototype.ngOnInit = function () {
        //  this.iniciar();
    };
    BiographyComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], BiographyComponent.prototype, "profesor", void 0);
    BiographyComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'biography',
            template: __webpack_require__("./src/app/profesores/biography/biography.component.html"),
            styles: [__webpack_require__("./src/app/profesores/biography/biography.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], BiographyComponent);
    return BiographyComponent;
}());



/***/ }),

/***/ "./src/app/profesores/book-char/book-char.component.css":
/***/ (function(module, exports) {

module.exports = ".publicacion    {\r\n  border-bottom: solid 1px dimgrey;\r\n  width: 95%;\r\n  height: auto;\r\n  margin-top: 20px;\r\n  margin-left: 10px;\r\n  margin-right: 10px;\r\n  margin-bottom: 50px;\r\n}\r\n\r\n.componente{\r\n  border: solid 1px dimgrey;\r\n  -webkit-box-shadow: 4px 8px gray;\r\n          box-shadow: 4px 8px gray;\r\n  width: 90%;\r\n  height: auto;\r\n  margin-top: 10px;\r\n  margin-left:  20px;\r\n  margin-bottom: 20px;    \r\n  background: white;\r\n}\r\n\r\nlabel{\r\n  font-size: 20px;\r\n  display: inline-block;\r\n  width: 80px;\r\n}\r\n\r\noutput{\r\n  text-align: justify;\r\n  display: inline-block;\r\n  font-size: 20px;\r\n  margin-left: 120px;\r\n}\r\n\r\np{\r\n  font-style: italic;\r\n  text-align: justify;\r\n  font-size: 18px;\r\n  margin-right: 25px;\r\n  margin-left: 100px;\r\n  margin-top: 0px;\r\n}\r\n\r\nh2{\r\nmargin-top: 0;\r\nmargin-bottom: 7px;\r\nmargin-left: 12px;\r\n}\r\n\r\nh3{\r\nfont-size: 22px;\r\ntext-transform: capitalize;\r\n}\r\n\r\nh1{\r\n\r\n  margin-left: 24px;\r\n  margin-bottom: 5px;\r\n}\r\n\r\n.fondo {\r\n        \r\n  width: 80%;\r\n  height: auto;  \r\n  margin-top: 10px;\r\n  background: white;\r\n  \r\n}\r\n"

/***/ }),

/***/ "./src/app/profesores/book-char/book-char.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fondo\">\n\n<h1>Book Chapters</h1>\n\n<div class=\"componente\">\n  \n\n    <ul>\n         <li class=\"publicacion\" *ngFor=\"let c of capitulos\">\n\n            <h3>{{c.titulo}}</h3>\n            \n            <label for=\"fechaPublicacion\">Publication: </label>\n            <output type=\"text\" name=\"fechaPublicacion\" id=\"fechaPublicacion\" value=\"{{c.fechaPublicacion}}\"></output>\n            <br>\n            <label for=\"libro\">Book: </label>\n            <output type=\"text\" name=\"libro\" id=\"libro\" value=\"{{c.libro}}\"></output>\n            <br>\n            <br>\n            <label for=\"temas\">Topics: </label>\n            <output type=\"text\" name=\"temmas\" id=\"temas\" value=\"{{getTemas(c)}}\"></output>\n            <br>\n            <br>\n            <label for=\"temas\">Authors: </label>\n            <p>\n                {{getAutores(c)}}\n            </p>\n\n        </li>    \n\n    </ul>\n\n</div>\n\n</div>"

/***/ }),

/***/ "./src/app/profesores/book-char/book-char.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BookCharComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compartido_clases_capitulo__ = __webpack_require__("./src/app/profesores/compartido/clases/capitulo.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BookCharComponent = /** @class */ (function () {
    function BookCharComponent() {
    }
    BookCharComponent.prototype.ngOnInit = function () {
        this.getCapitulos();
    };
    BookCharComponent.prototype.getCapitulos = function () {
        this.capitulos = [];
        for (var i = 0; i < this.profesor.productos.length; i++) {
            if (this.profesor.productos[i] instanceof __WEBPACK_IMPORTED_MODULE_2__compartido_clases_capitulo__["a" /* Capitulo */]) {
                this.capitulos.push(this.profesor.productos[i]);
            }
        }
    };
    BookCharComponent.prototype.getTemas = function (p) {
        var t = "";
        for (var i = 0; i < p.temas.length; i++) {
            if (i > 0 && i < (p.temas.length) && t != "") {
                t = t + ",";
            }
            t = t + p.temas[i];
        }
        return t;
    };
    BookCharComponent.prototype.getAutores = function (p) {
        var t = "";
        for (var i = 0; i < p.coautores.length; i++) {
            t = t + p.coautores[i] + ", ";
        }
        return t;
    };
    BookCharComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], BookCharComponent.prototype, "profesor", void 0);
    BookCharComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'book-char',
            template: __webpack_require__("./src/app/profesores/book-char/book-char.component.html"),
            styles: [__webpack_require__("./src/app/profesores/book-char/book-char.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], BookCharComponent);
    return BookCharComponent;
}());



/***/ }),

/***/ "./src/app/profesores/books/books.component.css":
/***/ (function(module, exports) {

module.exports = ".publicacion    {\r\n  border-bottom: solid 1px dimgrey;\r\n  width: 95%;\r\n  height: auto;\r\n  margin-top: 20px;\r\n  margin-left: 10px;\r\n  margin-right: 10px;\r\n  margin-bottom: 50px;\r\n}\r\n\r\n.componente{\r\n  border: solid 1px dimgrey;\r\n  -webkit-box-shadow: 4px 8px gray;\r\n          box-shadow: 4px 8px gray;\r\n  width: 90%;\r\n  height: auto;\r\n  margin-top: 10px;\r\n  margin-left: 20px;\r\n  margin-bottom: 20px;    \r\n  background: white;\r\n}\r\n\r\nlabel{\r\n  font-size: 20px;\r\n  display: inline-block;\r\n  width: 80px;\r\n}\r\n\r\noutput{\r\n  text-align: justify;\r\n  display: inline-block;\r\n  font-size: 20px;\r\n  margin-left: 120px;\r\n}\r\n\r\np{\r\n  font-style: italic;\r\n  text-align: justify;\r\n  font-size: 18px;\r\n  margin-right: 25px;\r\n  margin-left: 100px;\r\n  margin-top: 0px;\r\n}\r\n\r\nh2{\r\nmargin-top: 0;\r\nmargin-bottom: 7px;\r\nmargin-left: 12px;\r\n}\r\n\r\nh3{\r\nfont-size: 22px;\r\ntext-transform: capitalize;\r\n}\r\n\r\nh1{\r\n\r\n  margin-left: 24px;\r\n  margin-bottom: 5px;\r\n}\r\n\r\n.fondo {\r\n        \r\n  width: 80%;\r\n  height: auto;  \r\n  margin-top: 10px;\r\n  background: white;\r\n  \r\n}\r\n"

/***/ }),

/***/ "./src/app/profesores/books/books.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fondo\">\n<h1>Books</h1>\n\n<div class=\"componente\">\n\n  <ul>\n      <li class=\"publicacion\" *ngFor=\"let l of libros\">\n         \n          <h3>{{l.titulo}}</h3>\n         \n          <label for=\"fechaPublicacion\">Publication: </label>\n          <output type=\"text\" name=\"fechaPublicacion\" id=\"fechaPublicacion\" value=\"{{l.fechaPublicacion}}\"></output>\n          <br>\n          <label for=\"editorial\">Editorial: </label>\n          <output type=\"text\" name=\"editorial\" id=\"editorial\" value=\"{{l.editorial}}\"></output>\n          <br>\n          <label for=\"isbn\">ISBN: </label>\n          <output type=\"text\" name=\"isbn\" id=\"isbn\" value=\"{{l.isbn}}\"></output>\n          \n        </li>\n  </ul>\n</div>\n\n</div>"

/***/ }),

/***/ "./src/app/profesores/books/books.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BooksComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compartido_clases_libro__ = __webpack_require__("./src/app/profesores/compartido/clases/libro.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BooksComponent = /** @class */ (function () {
    function BooksComponent() {
    }
    BooksComponent.prototype.ngOnInit = function () {
        this.getLibros();
    };
    BooksComponent.prototype.getLibros = function () {
        this.libros = [];
        for (var i = 0; i < this.profesor.productos.length; i++) {
            if (this.profesor.productos[i] instanceof __WEBPACK_IMPORTED_MODULE_2__compartido_clases_libro__["a" /* Libro */]) {
                this.libros.push(this.profesor.productos[i]);
            }
        }
    };
    BooksComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], BooksComponent.prototype, "profesor", void 0);
    BooksComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'books',
            template: __webpack_require__("./src/app/profesores/books/books.component.html"),
            styles: [__webpack_require__("./src/app/profesores/books/books.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], BooksComponent);
    return BooksComponent;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/articulo.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Articulo; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__producto__ = __webpack_require__("./src/app/profesores/compartido/clases/producto.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Articulo = /** @class */ (function (_super) {
    __extends(Articulo, _super);
    function Articulo() {
        return _super.call(this) || this;
    }
    return Articulo;
}(__WEBPACK_IMPORTED_MODULE_0__producto__["a" /* Producto */]));



/***/ }),

/***/ "./src/app/profesores/compartido/clases/award.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Award; });
var Award = /** @class */ (function () {
    function Award() {
    }
    return Award;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/capitulo.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Capitulo; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__producto__ = __webpack_require__("./src/app/profesores/compartido/clases/producto.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Capitulo = /** @class */ (function (_super) {
    __extends(Capitulo, _super);
    function Capitulo() {
        return _super.call(this) || this;
    }
    return Capitulo;
}(__WEBPACK_IMPORTED_MODULE_0__producto__["a" /* Producto */]));



/***/ }),

/***/ "./src/app/profesores/compartido/clases/educacion.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Educacion; });
var Educacion = /** @class */ (function () {
    function Educacion() {
    }
    Educacion.prototype.contructor = function () {
        this.anexos = [];
    };
    return Educacion;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/evento.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Evento; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__producto__ = __webpack_require__("./src/app/profesores/compartido/clases/producto.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Evento = /** @class */ (function (_super) {
    __extends(Evento, _super);
    function Evento() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Evento.prototype.contructor = function () {
        this.productos = [];
    };
    return Evento;
}(__WEBPACK_IMPORTED_MODULE_0__producto__["a" /* Producto */]));



/***/ }),

/***/ "./src/app/profesores/compartido/clases/info-contact.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoContact; });
var InfoContact = /** @class */ (function () {
    function InfoContact() {
    }
    return InfoContact;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/interest.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Interest; });
var Interest = /** @class */ (function () {
    function Interest() {
    }
    return Interest;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/libro.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Libro; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__producto__ = __webpack_require__("./src/app/profesores/compartido/clases/producto.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Libro = /** @class */ (function (_super) {
    __extends(Libro, _super);
    function Libro() {
        return _super.call(this) || this;
    }
    return Libro;
}(__WEBPACK_IMPORTED_MODULE_0__producto__["a" /* Producto */]));



/***/ }),

/***/ "./src/app/profesores/compartido/clases/new.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return New; });
var New = /** @class */ (function () {
    function New() {
    }
    return New;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/producto.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Producto; });
var Producto = /** @class */ (function () {
    function Producto() {
        this.palabrasClae = [];
        this.temas = [];
        this.coautores = [];
    }
    return Producto;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/profesor.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Profesor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__puesto__ = __webpack_require__("./src/app/profesores/compartido/clases/puesto.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__info_contact__ = __webpack_require__("./src/app/profesores/compartido/clases/info-contact.ts");


var Profesor = /** @class */ (function () {
    function Profesor() {
    }
    Profesor.prototype.contructor = function () {
        this.educacion = [];
        this.news = [];
        this.awards = [];
        this.interests = [];
        this.scientifics = [];
        this.students = [];
        this.teachings = [];
        this.puesto = new __WEBPACK_IMPORTED_MODULE_0__puesto__["a" /* Puesto */]();
        this.infoContact = new __WEBPACK_IMPORTED_MODULE_1__info_contact__["a" /* InfoContact */]();
    };
    return Profesor;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/proyecto.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Proyecto; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__producto__ = __webpack_require__("./src/app/profesores/compartido/clases/producto.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Proyecto = /** @class */ (function (_super) {
    __extends(Proyecto, _super);
    function Proyecto() {
        return _super.call(this) || this;
    }
    return Proyecto;
}(__WEBPACK_IMPORTED_MODULE_0__producto__["a" /* Producto */]));



/***/ }),

/***/ "./src/app/profesores/compartido/clases/puesto.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Puesto; });
var Puesto = /** @class */ (function () {
    function Puesto() {
    }
    return Puesto;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/scientific-service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScientificService; });
var ScientificService = /** @class */ (function () {
    function ScientificService() {
    }
    return ScientificService;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/student.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Student; });
var Student = /** @class */ (function () {
    function Student() {
    }
    return Student;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/clases/teaching.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Teaching; });
var Teaching = /** @class */ (function () {
    function Teaching() {
    }
    return Teaching;
}());



/***/ }),

/***/ "./src/app/profesores/compartido/services/service.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServiceService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__clases_puesto__ = __webpack_require__("./src/app/profesores/compartido/clases/puesto.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__clases_educacion__ = __webpack_require__("./src/app/profesores/compartido/clases/educacion.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__clases_articulo__ = __webpack_require__("./src/app/profesores/compartido/clases/articulo.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__clases_libro__ = __webpack_require__("./src/app/profesores/compartido/clases/libro.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__clases_evento__ = __webpack_require__("./src/app/profesores/compartido/clases/evento.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__clases_capitulo__ = __webpack_require__("./src/app/profesores/compartido/clases/capitulo.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__clases_proyecto__ = __webpack_require__("./src/app/profesores/compartido/clases/proyecto.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__clases_info_contact__ = __webpack_require__("./src/app/profesores/compartido/clases/info-contact.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__clases_new__ = __webpack_require__("./src/app/profesores/compartido/clases/new.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__clases_award__ = __webpack_require__("./src/app/profesores/compartido/clases/award.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__clases_interest__ = __webpack_require__("./src/app/profesores/compartido/clases/interest.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__ = __webpack_require__("./src/app/profesores/compartido/clases/scientific-service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__clases_student__ = __webpack_require__("./src/app/profesores/compartido/clases/student.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__clases_teaching__ = __webpack_require__("./src/app/profesores/compartido/clases/teaching.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
















var ServiceService = /** @class */ (function () {
    function ServiceService() {
        this.iniciar();
    }
    ServiceService.prototype.iniciar = function () {
        this.profesor = new __WEBPACK_IMPORTED_MODULE_1__clases_profesor__["a" /* Profesor */]();
        this.infoContact = new __WEBPACK_IMPORTED_MODULE_9__clases_info_contact__["a" /* InfoContact */]();
        this.profesor.educacion = [];
        this.profesor.productos = [];
        this.profesor.nombre = "Alexandra Pomares Quimbaya";
        //this.profesor.apellidos="Pomares";
        this.profesor.titular = "Associate Professor at Pontificia Universidad Javeriana";
        this.profesor.primaryArea = "Data Analysis";
        this.infoContact.email = "pomares@javeriana.edu.co";
        this.infoContact.address = "Bogotá, Colombia, Avenue 7 No. 40 - 62";
        this.infoContact.office = "Building José Gabriel Maldonado, S.J., Floor 2";
        this.infoContact.officePhone = 3208320;
        this.infoContact.extension = 5338;
        this.profesor.infoContact = this.infoContact;
        this.profesor.puesto = new __WEBPACK_IMPORTED_MODULE_2__clases_puesto__["a" /* Puesto */]();
        this.profesor.puesto.cargo = "Director Of The Research Group";
        this.educacion = new __WEBPACK_IMPORTED_MODULE_3__clases_educacion__["a" /* Educacion */]();
        this.educacion.institucion = "Institut national polytechnique de Grenoble";
        this.educacion.titulacion = "Doctor (PhD)";
        this.educacion.disciplia = "Informatique";
        this.educacion.anoInicio = 2007;
        this.educacion.anoFin = 2010;
        this.profesor.educacion.push(this.educacion);
        this.educacion = new __WEBPACK_IMPORTED_MODULE_3__clases_educacion__["a" /* Educacion */]();
        this.educacion.institucion = "Universidad de los Andes";
        this.educacion.titulacion = "Docteur (PhD)";
        this.educacion.disciplia = "Systems Engineering";
        this.educacion.anoInicio = 2007;
        this.educacion.anoFin = 2010;
        this.profesor.educacion.push(this.educacion);
        this.educacion = new __WEBPACK_IMPORTED_MODULE_3__clases_educacion__["a" /* Educacion */]();
        this.educacion.institucion = "Universidad de los Andes";
        this.educacion.titulacion = "Maestría (MsC)";
        this.educacion.disciplia = "Ingeniería de Sistemas y Computación";
        this.educacion.anoInicio = 2003;
        this.educacion.anoFin = 2016;
        this.profesor.educacion.push(this.educacion);
        this.profesor.pais = "Colombia";
        this.profesor.codigoPostal = "110231";
        this.profesor.extracto = "Alexandra Pomares is Associate Professor at Pontificia Universidad Javeriana. She received her Ph.D. in Engineering from Universidad de los Andes, Bogotá, Colombia and her Ph.D in Informatics from Université de Grenoble, France.     Alexandra has an extensive experience on data integration and data analysis. She is currently working on the design and development of solutions for information analysis in sectors with high volumen of narrative texts.";
        this.profesor.urlFoto = "http://ingenieria.javeriana.edu.co/image/journal/article?img_id=9513898&t=1523890018754";
        this.addArticulos();
        this.addCapitulos();
        this.addEventos();
        this.addLibros();
        this.addProyectos();
        this.addNews();
        this.addAwards();
        this.addInterests();
        this.addScientifics();
        this.addStudents();
        this.addTeaching();
    };
    ServiceService.prototype.addArticulos = function () {
        this.articulo = new __WEBPACK_IMPORTED_MODULE_4__clases_articulo__["a" /* Articulo */]();
        this.articulo.titulo = "A systematic review of serious games in medical education: quality of evidence and pedagogical strategy";
        this.articulo.fechaPublicacion = "2018,2,13";
        this.articulo.palabrasClae.push("Video games");
        this.articulo.palabrasClae.push("medical education");
        this.articulo.palabrasClae.push("evidence-based practice");
        this.articulo.palabrasClae.push("comparative effectiveness research");
        this.articulo.palabrasClae.push("review");
        this.articulo.temas.push("Ingeniería de Sistemas y Comunicaciones");
        this.articulo.coautores.push(this.profesor.nombre);
        this.articulo.coautores.push("Iouri Gorbanev Fedorenchik");
        this.articulo.coautores.push("Sandra Milena Agudelo Londoño");
        this.articulo.coautores.push("Rafael A. Gonzalez");
        this.articulo.coautores.push("Iris Viviana Delgadillo Esguerra");
        this.articulo.coautores.push("Oscar Mauricio Muñoz Velandia");
        this.articulo.coautores.push("Francisco José Yepes Luján");
        this.articulo.revista = "Medical Education Online";
        this.articulo.volumen = 23;
        this.articulo.idioma = "Inglés";
        this.articulo.url = "https://www.tandfonline.com/doi/abs/10.1080/10872981.2018.1438718";
        this.articulo.doi = "10.1080/10872981.2018.1438718";
        this.profesor.productos.push(this.articulo);
        this.articulo = new __WEBPACK_IMPORTED_MODULE_4__clases_articulo__["a" /* Articulo */]();
        this.articulo.titulo = "Concept Attribute Labeling and Context-Aware Named Entity Recognition in Electronic Health Records";
        this.articulo.fechaPublicacion = "2018,1,13";
        this.articulo.palabrasClae.push("Concept Attribute Labeling");
        this.articulo.palabrasClae.push("Electronic Health Records");
        this.articulo.palabrasClae.push("Named Entity Recognition");
        this.articulo.palabrasClae.push("Text Mining");
        this.articulo.temas.push("Ingeniería de Sistemas y Comunicaciones");
        this.articulo.coautores.push(this.profesor.nombre);
        this.articulo.coautores.push("Rafael Andrés González Rivera");
        this.articulo.coautores.push("Oscar Mauricio Muñoz Velandia");
        this.articulo.coautores.push("Angel Alberto Garcia Peña");
        this.articulo.coautores.push("Julian Camilo Daza Rodriguez");
        this.articulo.coautores.push("Alejandro Sierra Múnera");
        this.articulo.coautores.push("Cyril Labbé");
        this.articulo.revista = "International Journal of Reliable and Quality E-Healthcare (IJRQEH)";
        this.articulo.volumen = 7;
        this.articulo.idioma = "Inglés";
        this.articulo.url = "https://www.igi-global.com/article/concept-attribute-labeling-and-context-aware-named-entity-recognition-in-electronic-health-records/190642";
        this.articulo.doi = "10.4018/IJRQEH.2018010101";
        this.profesor.productos.push(this.articulo);
        this.articulo = new __WEBPACK_IMPORTED_MODULE_4__clases_articulo__["a" /* Articulo */]();
        this.articulo.titulo = "A Strategy for Prioritizing Electronic Medical Records Using Structured Analysis and Natural Language Processing";
        this.articulo.fechaPublicacion = "22/01/2018";
        this.articulo.palabrasClae.push("electronic medical records");
        this.articulo.palabrasClae.push("natural language processing");
        this.articulo.palabrasClae.push("narrative text");
        this.articulo.coautores.push(this.profesor.nombre);
        this.articulo.coautores.push("Rafael A. Gonzalez");
        this.articulo.coautores.push("Oscar Mauricio Muñoz Velandia");
        this.articulo.coautores.push("Ricardo Bohorquez Rodriguez");
        this.articulo.coautores.push("Olga Milena Garcia Morales");
        this.articulo.temas.push("Ingeniería de Sistemas y Comunicaciones");
        this.articulo.revista = "Ingenieria Y Universidad";
        this.articulo.volumen = 22;
        this.articulo.idioma = "Inglés";
        this.articulo.url = "http://revistas.javeriana.edu.co/index.php/iyu/article/view/17809";
        this.articulo.doi = "dx.doi.org/10.11144/Javeriana.iyu22-1.spem";
        this.profesor.productos.push(this.articulo);
    };
    ServiceService.prototype.addCapitulos = function () {
        this.capitulo = new __WEBPACK_IMPORTED_MODULE_7__clases_capitulo__["a" /* Capitulo */]();
        this.capitulo.titulo = "ICT for Enabling the Quality Evaluation of Health Care Services: A Case Study in a General Hospital";
        this.capitulo.fechaPublicacion = "19/10/2016";
        this.capitulo.palabrasClae.push("");
        this.capitulo.palabrasClae.push("");
        this.capitulo.palabrasClae.push("");
        this.capitulo.temas.push("Ingeniería de Sistemas y Comunicaciones");
        this.capitulo.coautores.push(this.profesor.nombre);
        this.capitulo.coautores.push("Rafael A. Gonzalez");
        this.capitulo.coautores.push("Alejandro Sierra Múnera");
        this.capitulo.coautores.push("Oscar Mauricio MUÑOZ VELANDIA");
        this.capitulo.coautores.push("Angel Alberto Garcia Peña");
        this.capitulo.coautores.push("olga milena garcia morales");
        this.capitulo.coautores.push("Ricardo BOHORQUEZ RODRIGUEZ");
        this.capitulo.libro = "Design, Development, and Integration of Reliable Electronic Healthcare Platforms";
        this.capitulo.lugar = "IGI Global";
        this.profesor.productos.push(this.capitulo);
        this.capitulo = new __WEBPACK_IMPORTED_MODULE_7__clases_capitulo__["a" /* Capitulo */]();
        this.capitulo.titulo = "A Review of Existing Applications and Techniques for Narrative Text Analysis in Electronic Medical Records";
        this.capitulo.fechaPublicacion = "19/10/2016";
        this.capitulo.temas.push("Ingeniería de Sistemas y Comunicaciones");
        this.capitulo.coautores.push(this.profesor.nombre);
        this.capitulo.coautores.push("Rafael A. Gonzalez");
        this.capitulo.coautores.push("Oscar Mauricio MUÑOZ VELANDIA");
        this.capitulo.coautores.push("Ricardo BOHORQUEZ RODRIGUEZ");
        this.capitulo.coautores.push("olga milena garcia morales");
        this.capitulo.coautores.push("Darío Londoño Trujillo");
        this.capitulo.libro = "Encyclopedia of E-Health and Telemedicine";
        this.capitulo.lugar = "IGI Global";
        this.profesor.productos.push(this.capitulo);
    };
    ServiceService.prototype.addEventos = function () {
        this.evento = new __WEBPACK_IMPORTED_MODULE_6__clases_evento__["a" /* Evento */]();
        this.evento.nombre = "20th International Conference on Enterprise Information SystemsAt: Funchal";
        this.evento.tipoEvento = "Congreso";
        this.evento.ambito = "Internacional",
            this.evento.ciudad = "Portugal";
        this.evento.fechaInicio = new Date("2018-03-21");
        this.evento.fechaFin = new Date("2018-03-24");
        this.evento.resumen = "";
        //this.evento.productos=
        this.evento.url = " http://www.iceis.org/";
        this.profesor.productos.push(this.evento);
        this.evento = new __WEBPACK_IMPORTED_MODULE_6__clases_evento__["a" /* Evento */]();
        this.evento.nombre = "9th International Conference on Knowledge Management and Information Sharing";
        this.evento.tipoEvento = "Congreso";
        this.evento.ambito = "Internacional",
            this.evento.ciudad = "Funchal";
        this.evento.fechaInicio = new Date("2017-11-01");
        this.evento.fechaFin = new Date("2017,11,3");
        this.evento.resumen = "";
        //this.evento.productos=
        this.evento.url = "http://www.kmis.ic3k.org/";
        this.profesor.productos.push(this.evento);
    };
    ServiceService.prototype.addLibros = function () {
        this.libro = new __WEBPACK_IMPORTED_MODULE_5__clases_libro__["a" /* Libro */]();
        this.libro.titulo = "ASHYI Plataforma basada en agentes para la planificación dinámica, inteligente y adaptativa de actividades aplicada a la educación personalizada";
        this.libro.fechaPublicacion = "12/6/2015";
        //this.libro.palabrasClae.push("");
        this.libro.temas.push("");
        this.libro.temas.push("");
        this.libro.coautores.push(this.profesor.nombre);
        this.libro.coautores.push("Angela Carrillo Ramos");
        this.libro.coautores.push("Mery Yolima Uribe Rios");
        this.libro.coautores.push("LUISA FERNANDA BARRERA LEÓN");
        this.libro.coautores.push("Jaime Andrés Pavlich Mariscal");
        this.libro.coautores.push("Julio Ernesto CARREÑO VARGAS");
        this.libro.coautores.push("Monica Ilanda Brijaldo Rodríguez");
        this.libro.coautores.push("Martha Leonor Sabogal Modera");
        this.libro.editorial = "Editorial Pontificia Universidad Javeriana";
        this.libro.isbn = "978-958-716-827-3";
        this.profesor.productos.push(this.libro);
    };
    ServiceService.prototype.addProyectos = function () {
        this.proyecto = new __WEBPACK_IMPORTED_MODULE_8__clases_proyecto__["a" /* Proyecto */]();
        this.proyecto.titulo = "System of analysis of indicators of adherence to clinical practice guidelines";
        this.proyecto.fechaPublicacion = "May 2014";
        //this.proyecto.temas.push("");
        //this.proyecto.temas.push("");
        this.proyecto.coautores.push(this.profesor.nombre);
        this.proyecto.tipo = "Computational";
        this.proyecto.fechaInicio = "May 2014";
        this.proyecto.fechaFin = null;
        this.proyecto.resumen = "Las  Guías de Práctica Clínica (GPC) han ganado gran aceptación dado que permiten sintetizar grandes volúmenes de información en un formato conveniente para ser usado por quienes participan en la toma de decisiones en salud.";
        this.proyecto.codigo = 6152;
        this.profesor.productos.push(this.proyecto);
    };
    ServiceService.prototype.addNews = function () {
        this.profesor.news = [];
        this.new = new __WEBPACK_IMPORTED_MODULE_10__clases_new__["a" /* New */]();
        this.new.tittle = "Closing Diploma Business Intelligence 2018 -1";
        this.new.description = "Closing Diploma Business Intelligence 2018 -1. (06/06/2018)";
        this.new.url = "http://news.mit.edu/2017/computer-system-predicts-products-chemical-reactions-0627";
        this.new.date = new Date();
        this.profesor.news.push(this.new);
        this.new = new __WEBPACK_IMPORTED_MODULE_10__clases_new__["a" /* New */]();
        this.new.tittle = "Citizen Data Course";
        this.new.description = "Citizen Data Course April 2018";
        this.new.url = "http://news.mit.edu/2017/computer-system-predicts-products-chemical-reactions-0627";
        this.new.date = new Date();
        this.profesor.news.push(this.new);
    };
    ServiceService.prototype.addAwards = function () {
        this.profesor.awards = [];
        this.award = new __WEBPACK_IMPORTED_MODULE_11__clases_award__["a" /* Award */]();
        this.award.description = "Nomination Prize Merit Order Vicente Pizano Restrepo";
        this.award.year = 2017;
        this.profesor.awards.push(this.award);
    };
    ServiceService.prototype.addInterests = function () {
        this.profesor.interests = [];
        this.interest = new __WEBPACK_IMPORTED_MODULE_12__clases_interest__["a" /* Interest */]();
        this.interest.area = "Data Mining";
        this.interest.topics = [];
        this.interest.topics.push("Data Anonymization");
        this.profesor.interests.push(this.interest);
        this.interest = new __WEBPACK_IMPORTED_MODULE_12__clases_interest__["a" /* Interest */]();
        this.interest.area = "Data Analysis";
        this.interest.topics = [];
        this.interest.topics.push("Electronic Health Records Analysis");
        this.interest.topics.push("Social Network Analysis");
        this.profesor.interests.push(this.interest);
    };
    ServiceService.prototype.addScientifics = function () {
        this.profesor.scientifics = [];
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator, Centaries Data";
        this.scientific.type = "Conference";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "International";
        this.scientific.year = 2017;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator, Journal Computer Technology Management";
        this.scientific.type = "Conference";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "International";
        this.scientific.year = 2014;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator, International Journal of Information Technologies and Systems Approach (IJITSA)";
        this.scientific.type = "Project";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "International";
        this.scientific.year = 2014;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator, Journal Engineering and Competitiveness";
        this.scientific.type = "Project";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "National";
        this.scientific.year = 2013;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator, Conference SIB";
        this.scientific.type = "Conference";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "International";
        this.scientific.year = 2012;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator, International Journal of Technology and Human Interaction (IJTHI)";
        this.scientific.type = "Project";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "International";
        this.scientific.year = 2011;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator";
        this.scientific.type = "Project";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "National";
        this.scientific.year = 2011;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator";
        this.scientific.type = "Project";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "National";
        this.scientific.year = 2010;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator";
        this.scientific.type = "Project";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "National";
        this.scientific.year = 2009;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
        this.scientific = new __WEBPACK_IMPORTED_MODULE_13__clases_scientific_service__["a" /* ScientificService */]();
        this.scientific.tittle = "Project Evaluator";
        this.scientific.type = "Project";
        this.scientific.country = "Colombia";
        this.scientific.ambit = "National";
        this.scientific.year = 2008;
        this.scientific.entity = "Colciencias";
        this.profesor.scientifics.push(this.scientific);
    };
    ServiceService.prototype.addStudents = function () {
        this.profesor.students = [];
        this.student = new __WEBPACK_IMPORTED_MODULE_14__clases_student__["a" /* Student */]();
        this.student.name = "William Enrique Parra Alba";
        this.student.dateStart = "Janury 2016";
        this.student.dateEnd = "December 2016";
        this.student.state = "expected";
        this.student.topic = "MODELO Y SISTEMA DE ANÁLISIS, GENERACIÓN Y ENTREGA DE INFORMACIÓN, PARA APOYAR LA TOMA DE DECISIONES A PARTIR DE DATOS OBTENIDOS DE PACIENTES REMOTOS DE LA TERCERA EDAD CON NEUMONÍA ADQUIRIDA EN LA COMUNIDAD (NAC)";
        this.profesor.students.push(this.student);
        this.student = new __WEBPACK_IMPORTED_MODULE_14__clases_student__["a" /* Student */]();
        this.student.name = "Daniel Alejandro Calambás, Jaime Andrés Mendoza";
        this.student.dateStart = "January 2016";
        this.student.dateEnd = "December 2016";
        this.student.state = "expected";
        this.student.topic = "Real Time Social Data Mining Framework para la Extracción de Información de Publicaciones de Facebook";
        this.profesor.students.push(this.student);
        this.student = new __WEBPACK_IMPORTED_MODULE_14__clases_student__["a" /* Student */]();
        this.student.name = "Wilson Alzate Calderón";
        this.student.dateStart = "Janury 2014";
        this.student.dateEnd = "Janury 2015";
        this.student.state = "expected";
        this.student.topic = "FRAMEWORK DE PRE-PROCESAMIENTO DE DATOS EN MINERIA DE TEXTO BASADO EN TECNOLOGIAS DE BIG DATA";
        this.profesor.students.push(this.student);
    };
    ServiceService.prototype.addTeaching = function () {
        this.profesor.teachings = [];
        this.teaching = new __WEBPACK_IMPORTED_MODULE_15__clases_teaching__["a" /* Teaching */]();
        this.teaching.name = "Data Management";
        this.teaching.description = "Data management is the practice of organizing and maintaining data processes to meet the needs of the continuous life cycle of information. The emphasis on data management began with the electronic age of data processing, but data management methods have roots in accounting, statistics, logistics planning and other disciplines that predate the emergence of corporate computing in the mid-20th century.";
        this.teaching.yearStart = 2017;
        this.teaching.yearEnd = 2018;
        this.profesor.teachings.push(this.teaching);
        this.teaching = new __WEBPACK_IMPORTED_MODULE_15__clases_teaching__["a" /* Teaching */]();
        this.teaching.name = "Analytical Methods and Applications";
        this.teaching.description = "Data analysis is a process of inspecting, cleansing, transforming, and modeling data with the goal of discovering useful information, informing conclusions, and supporting decision-making. Data analysis has multiple facets and approaches, encompassing diverse techniques under a variety of names, while being used in different business, science, and social science domains.";
        this.teaching.yearStart = 2011;
        this.teaching.yearEnd = 2018;
        this.profesor.teachings.push(this.teaching);
        this.teaching = new __WEBPACK_IMPORTED_MODULE_15__clases_teaching__["a" /* Teaching */]();
        this.teaching.name = "Data Mining";
        this.teaching.description = "It is the process of extracting significant information from large databases, information that reveals business intelligence, through hidden factors, trends and correlations to allow the user to make predictions that solve business problems by providing a competitive advantage.";
        this.teaching.yearStart = 2011;
        this.teaching.yearEnd = 2018;
        this.profesor.teachings.push(this.teaching);
        this.teaching = new __WEBPACK_IMPORTED_MODULE_15__clases_teaching__["a" /* Teaching */]();
        this.teaching.name = "Information Systems";
        this.teaching.description = "Information system, an integrated set of components for collecting, storing, and processing data and for providing information, knowledge, and digital products. Business firms and other organizations rely on information systems to carry out and manage their operations, interact with their customers and suppliers, and compete in the marketplace.";
        this.teaching.yearStart = 2011;
        this.teaching.yearEnd = 2018;
        this.profesor.teachings.push(this.teaching);
    };
    ServiceService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], ServiceService);
    return ServiceService;
}());



/***/ }),

/***/ "./src/app/profesores/confe-paper/confe-paper.component.css":
/***/ (function(module, exports) {

module.exports = ".publicacion    {\r\n  border-bottom: solid 1px dimgrey;\r\n  width: 95%;\r\n  height: auto;\r\n  margin-top: 20px;\r\n  margin-left: 10px;\r\n  margin-right: 10px;\r\n  margin-bottom: 50px;\r\n}\r\n\r\n.componente{\r\n  border: solid 1px dimgrey;\r\n  -webkit-box-shadow: 4px 8px gray;\r\n          box-shadow: 4px 8px gray;\r\n  width: 90%;\r\n  height: auto;\r\n  margin-top: 10px;\r\n  margin-left: 20px;\r\n  margin-bottom: 20px;    \r\n  background: white;\r\n}\r\n\r\nlabel{\r\n  font-size: 20px;\r\n  display: inline-block;\r\n  width: 80px;\r\n}\r\n\r\noutput{\r\n  text-align: justify;\r\n  display: inline-block;\r\n  font-size: 20px;\r\n  margin-left: 120px;\r\n}\r\n\r\np{\r\n  font-style: italic;\r\n  text-align: justify;\r\n  font-size: 18px;\r\n  margin-right: 25px;\r\n  margin-left: 100px;\r\n  margin-top: 0px;\r\n}\r\n\r\nh2{\r\nmargin-top: 0;\r\nmargin-bottom: 7px;\r\nmargin-left: 12px;\r\n}\r\n\r\nh3{\r\nfont-size: 22px;\r\ntext-transform: capitalize;\r\n}\r\n\r\nh1{\r\n\r\n  margin-left: 24px;\r\n  margin-bottom: 5px;\r\n}\r\n\r\n.fondo {\r\n        \r\n  width: 80%;\r\n  height: auto;  \r\n  margin-top: 10px;\r\n  background: white;\r\n  \r\n}\r\n"

/***/ }),

/***/ "./src/app/profesores/confe-paper/confe-paper.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fondo\">\n\n<h1>Conference Papers</h1>\n<div class=\"componente\">\n  \n\n        <ul>\n                <li class=\"publicacion\" *ngFor=\"let e of eventos\">\n                        \n                        <h3>{{e.nombre}}</h3>\n\n                        <label for=\"tipoEvento\">Type:  </label>\n                        <output type=\"text\" name=\"tipoEvento\" id=\"tipoEvento\" value=\"{{e.tipoEvento}}\"></output>\n                        <br>\n                        <label for=\"ciudad\">City: </label>\n                        <output type=\"text\" name=\"ciudad\" id=\"ciudad\" value=\"{{e.ciudad}}\"></output>\n                <br>\n                <br>\n                </li>\n        </ul>\n</div>\n\n</div>"

/***/ }),

/***/ "./src/app/profesores/confe-paper/confe-paper.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfePaperComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compartido_clases_evento__ = __webpack_require__("./src/app/profesores/compartido/clases/evento.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ConfePaperComponent = /** @class */ (function () {
    function ConfePaperComponent() {
    }
    ConfePaperComponent.prototype.ngOnInit = function () {
        this.getEventos();
    };
    ConfePaperComponent.prototype.getEventos = function () {
        this.eventos = [];
        for (var i = 0; i < this.profesor.productos.length; i++) {
            if (this.profesor.productos[i] instanceof __WEBPACK_IMPORTED_MODULE_2__compartido_clases_evento__["a" /* Evento */]) {
                this.eventos.push(this.profesor.productos[i]);
            }
        }
    };
    ConfePaperComponent.prototype.getTemas = function (p) {
        var t = "";
        for (var i = 0; i < p.temas.length; i++) {
            if (i > 0 && i < (p.temas.length) && t != "") {
                t = t + ",";
            }
            t = t + p.temas[i];
        }
        return t;
    };
    ConfePaperComponent.prototype.getAutores = function (p) {
        var t = "";
        for (var i = 0; i < p.coautores.length; i++) {
            t = t + p.coautores[i] + ", ";
        }
        t = t + this.profesor.nombre;
        return t;
    };
    ConfePaperComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], ConfePaperComponent.prototype, "profesor", void 0);
    ConfePaperComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'confe-paper',
            template: __webpack_require__("./src/app/profesores/confe-paper/confe-paper.component.html"),
            styles: [__webpack_require__("./src/app/profesores/confe-paper/confe-paper.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ConfePaperComponent);
    return ConfePaperComponent;
}());



/***/ }),

/***/ "./src/app/profesores/education/education.component.css":
/***/ (function(module, exports) {

module.exports = ".imagen{\r\n    \r\n    width: 40%;\r\n    \r\n    \r\n    float: left;\r\n    margin-top: 0;\r\n\r\n}\r\n\r\n.informacion{\r\n    margin-top: 0;\r\n    width: auto;\r\n    height: auto;   \r\n    \r\n    \r\n    \r\n}\r\n\r\n.study{\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    width: 95%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 4    0px;   \r\n    border-bottom: solid 1px dimgrey;  \r\n}\r\n\r\n.bio{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    width: 95%;\r\n    font-size: 23px;\r\n    margin-top: 0;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 20px;\r\n    background: snow;\r\n    \r\n\r\n}\r\n\r\n.interest{\r\n\r\n    \r\n    float: left;\r\n    width: 23%;\r\n    height: 100%;\r\n    margin-top: 10px;\r\n\r\n    margin-bottom: 20px;\r\n    \r\n}\r\n\r\n.li{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    background: snow;\r\n    text-align: justify;   \r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n    padding: 10px;\r\n}\r\n\r\n.amarillo{\r\n    border: solid yellow;\r\n    width: 100%;\r\n    height: 20px;\r\n    display: inline-table;\r\n}\r\n\r\nimg{\r\n    \r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    margin-top: 0;\r\n    margin-right: 100px;\r\n    vertical-align: top;\r\n    \r\n}\r\n\r\nbody{\r\n    margin-top: 5px;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    \r\n    background: transparent;\r\n    width: 80%;\r\n    \r\n}\r\n\r\n.perfil{\r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    border-radius: 30%;\r\n    vertical-align: top;\r\n    margin-left: 10px;\r\n}\r\n\r\n.istar{\r\n    width: 25%;\r\n    display: table-cell;    \r\n    vertical-align: middle;\r\n}\r\n\r\n.datos{\r\n\r\n    width: auto;\r\n    height: auto;\r\n\r\n}\r\n\r\n.info{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    background: snow;\r\n    width: 95%;\r\n    height: auto;\r\n    \r\n}\r\n\r\n.miembro{\r\n        \r\n    width: 75%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n    cursor:  progress;\r\n}\r\n\r\n.primaryA{\r\n    font-style: italic;\r\n    margin-left: 30px;\r\n}\r\n\r\n.blanco{\r\nwidth: 20%;\r\n}\r\n\r\n.titulo{\r\n    \r\n    width: 100%;\r\n    height: auto;\r\n    display: table-cell;    \r\n    text-align: right;    \r\n}\r\n\r\n.url{\r\n    margin-left: 45%;\r\n    \r\n}\r\n\r\n.cv{\r\n    margin-left: 30px;\r\n    font-style: italic;\r\n}\r\n\r\n.h3t{\r\n    margin-top: 10px;\r\n    margin-left: 0;\r\n    \r\n    border-bottom:solid  gray ;\r\n}\r\n\r\n#contenedor {\r\n    \r\n    width: 90%;\r\n    height: auto;  \r\n    \r\n    margin-top: 20px;\r\n    margin-left: 20px;\r\n    background: white;\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    \r\n    }\r\n\r\n.fondo {\r\n        \r\n        width: 80%;\r\n        height: auto;  \r\n        margin-top: 10px;\r\n        background: white;\r\n        \r\n    }\r\n\r\n#cabecera {\r\n    background: navy;\r\n    \r\n    height: auto;\r\n    width: 100%;\r\n    display: inline-table;\r\n    }\r\n\r\n#lzquierda  {\r\n    \r\n\r\n    float: left;\r\n   \r\n    height: auto;\r\n    width: 35%;\r\n    \r\n    \r\n    }\r\n\r\n#Derecha  {\r\n        \r\n        display: -webkit-box;\r\n        \r\n        display: -ms-flexbox;\r\n        \r\n        display: flex;\r\n        -webkit-box-pack: center;\r\n            -ms-flex-pack: center;\r\n                justify-content: center;\r\n        width: 100%;\r\n        \r\n        \r\n    }\r\n\r\n#Centro  {\r\n    \r\n        margin-top: 10px;\r\n        display: table;\r\n        \r\n        height: auto;\r\n        width: 100%;\r\n        display: inline-table;\r\n        \r\n        }\r\n\r\n#principalCentro  {\r\n        background: transparent;\r\n        width: 100%;\r\n        -webkit-box-pack: center;\r\n            -ms-flex-pack: center;\r\n                justify-content: center;\r\n\r\n    }\r\n\r\n#equipo  {\r\n\r\n        background: #fff;\r\n        display: table;\r\n        \r\n        display: table-cell;\r\n        height: auto;\r\n        width: 15%;\r\n        margin-top: 50px;\r\n        margin-left: 10px;\r\n        }\r\n\r\n#pie  {\r\n    background: white;\r\n    \r\n    width: 100%;\r\n    height: auto;\r\n    }\r\n\r\n/*---------------------------------------------MODAL*/\r\n\r\np{\r\n    text-align: justify;\r\n    margin-right: 25px;\r\n    margin-left: 25px;\r\n    \r\n}\r\n\r\n.cabecera_text{\r\n    vertical-align: text-bottom;\r\n    color: mintcream;\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-right: 15px;\r\n}\r\n\r\nh2,h4{\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-left: 24px;\r\n}\r\n\r\noutput{\r\n    margin-left: 30px;\r\n}\r\n\r\nh1{\r\n\r\n    margin-left: 24px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\nlabel{\r\n    font-size: 20px;\r\n    display: inline-block;\r\n    width: 80px;\r\n  }\r\n\r\noutput{\r\n    text-align: justify;\r\n    display: inline-block;\r\n    font-size: 20px;\r\n    margin-left: 30px;\r\n  }\r\n\r\np{\r\n    font-style: italic;\r\n    text-align: justify;\r\n    font-size: 18px;\r\n    margin-right: 25px;\r\n    margin-left: 100px;\r\n    margin-top: 0px;\r\n  }\r\n\r\nh3{\r\n    font-size: 22px;\r\n    text-transform: capitalize;\r\n    margin-bottom: 0;\r\n    }"

/***/ }),

/***/ "./src/app/profesores/education/education.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fondo\">\n \n  <!-- Contenedor para toda la página -->\n  <h1>Teaching</h1>\n\n <div id=\"contenedor\">\n  \n\n      \n      \n    <ul>\n        <li class=\"study\" *ngFor=\"let t of profesor.teachings\">\n            \n          <h3>{{t.name}} </h3>\n          <output class=\"primaryA\"  type=\"text\" name=\"year\" id=\"year\" >from {{t.yearStart}} to {{t.yearEnd}}</output>\n          <br>\n          <br>\n            <output  type=\"text\" name=\"description\" id=\"description\" value=\"{{t.description}}\"></output>\n            <br>\n            <br>\n                          \n        </li>\n      </ul>\n  \n\n</div>\n\n\n\n\n\n<h1>Students</h1>\n\n<div id=\"contenedor\">\n\n\n      \n   \n    <ul>\n      <li class=\"study\" *ngFor=\"let s of profesor.students\">\n          \n        <h3>{{s.name}} </h3>\n          <output  type=\"text\" name=\"text\" id=\"text\" >Thesis topic: {{s.topic}}. ({{s.state}}) </output>\n          <br>\n          <output class=\"primaryA\" type=\"text\" name=\"time\" id=\"time\" > {{s.dateStart}} - {{s.dateEnd}} </output>    \n          <br>\n          <br> \n      </li>\n    </ul>\n\n\n</div>\n\n  \n\n\n\n</div>"

/***/ }),

/***/ "./src/app/profesores/education/education.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EducationComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var EducationComponent = /** @class */ (function () {
    function EducationComponent() {
    }
    EducationComponent.prototype.ngOnInit = function () {
        //  this.iniciar();
    };
    EducationComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], EducationComponent.prototype, "profesor", void 0);
    EducationComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'education',
            template: __webpack_require__("./src/app/profesores/education/education.component.html"),
            styles: [__webpack_require__("./src/app/profesores/education/education.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], EducationComponent);
    return EducationComponent;
}());



/***/ }),

/***/ "./src/app/profesores/home/home.component.css":
/***/ (function(module, exports) {

module.exports = "\r\n\t\t\t* {\r\n\t\t\t\tmargin:0px;\r\n                padding:0px;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t#header {\r\n\t\t\t\tmargin:auto;\r\n\t\t\t\twidth: 100%;\r\n                font-family:Arial, Helvetica, sans-serif;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\tul, ol {\r\n                list-style:none;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t.nav > li {\r\n                float:left;\r\n                width: 20%;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t.nav li a {\r\n                \r\n                font-size: 20px;\r\n                font-family: calibri, helvetica, sans-serif;\r\n\t\t\t\tbackground-color:#FFE900\t;\r\n\t\t\t\tcolor:navy;\r\n                text-decoration:none;\r\n                text-align: center;\r\n\t\t\t\tpadding:10px 15px;\r\n\t\t\t\tdisplay:block;\r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t.nav li a:hover {\r\n                background-color: navy;\r\n                color: white;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t.nav li ul {\r\n\t\t\t\tdisplay:none;\r\n\t\t\t\tposition:absolute;\r\n                min-width:140px;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t.nav li:hover > ul {\r\n                display:block;\r\n                width: 15%;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t.nav li ul li {\r\n                position:relative;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t.nav li ul li ul {\r\n\t\t\t\tright:-140px;\r\n                top:0px;\r\n                \r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t/*----------------------------------------------------*/\r\n\t\t\t\r\n\t\t\t/* Style the tab */\r\n\t\t\t\r\n\t\t\t.tab {\r\n    overflow: hidden;\r\n    border: 1px solid #ccc;\r\n    background-color: #f1f1f1;\r\n}\r\n\t\t\t\r\n\t\t\t/* Style the buttons that are used to open the tab content */\r\n\t\t\t\r\n\t\t\t.tab button {\r\n    background-color: inherit;\r\n    float: left;\r\n    border: none;\r\n    outline: none;\r\n    cursor: pointer;\r\n    padding: 14px 16px;\r\n    -webkit-transition: 0.3s;\r\n    transition: 0.3s;\r\n}\r\n\t\t\t\r\n\t\t\t/* Change background color of buttons on hover */\r\n\t\t\t\r\n\t\t\t.tab button:hover {\r\n    background-color: #ddd;\r\n}\r\n\t\t\t\r\n\t\t\t/* Create an active/current tablink class */\r\n\t\t\t\r\n\t\t\t.tab button.active {\r\n    background-color: #ccc;\r\n}\r\n\t\t\t\r\n\t\t\t/* Style the tab content */\r\n\t\t\t\r\n\t\t\t.tabcontent {\r\n    display: none;\r\n    padding: 6px 12px;\r\n    border: 1px solid #ccc;\r\n    border-top: none;\r\n}\r\n\t\t\t\r\n\t\t\t/*-----------------------------------------------------------------XD*/\r\n\t\t\t\r\n\t\t\t.imagen{\r\n    \r\n    width: 40%;\r\n    display: table-cell;\r\n\r\n}\r\n\t\t\t\r\n\t\t\t.informacion{\r\n    \r\n    width: 60%;\r\n    height: auto;\r\n    display: table-cell;\r\n  \r\n  \r\n}\r\n\t\t\t\r\n\t\t\t.publicaciones    {\r\n    \r\n    width: 95%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;     \r\n}\r\n\t\t\t\r\n\t\t\t.extracto{\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    width: 95%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 20px;\r\n}\r\n\t\t\t\r\n\t\t\t.amarillo{\r\n    border: solid yellow;\r\n    width: 100%;\r\n    height: 20px;\r\n    display: inline-table;\r\n}\r\n\t\t\t\r\n\t\t\timg{\r\n    \r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    \r\n    vertical-align: top;\r\n    \r\n}\r\n\t\t\t\r\n\t\t\t.perfil{\r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    border-radius: 30%;\r\n    vertical-align: top;\r\n    margin-left: 10px;\r\n}\r\n\t\t\t\r\n\t\t\t.istar{\r\n    width: 35%;\r\n    -ms-flex-line-pack: justify;\r\n        align-content: space-between;\r\n    float: right;\r\n    \r\n    background: white;\r\n    -o-object-fit: cover;\r\n       object-fit: cover;\r\n}\r\n\t\t\t\r\n\t\t\t.logo{\r\n    width: 30%;\r\n    height: 110px;\r\n    display: table-cell;    \r\n    float: left;\r\n    padding: 20px;\r\n\r\n    \r\n}\r\n\t\t\t\r\n\t\t\t.datos{\r\n    vertical-align: middle;\r\n    \r\n    width: 95%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n}\r\n\t\t\t\r\n\t\t\t.miembro{\r\n    \r\n    border: solid 1px green;\r\n    width: 75%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n    cursor:  progress;\r\n}\r\n\t\t\t\r\n\t\t\t.cargo{\r\n    font-style: italic;\r\n}\r\n\t\t\t\r\n\t\t\t.blanco{\r\nwidth: 20%;\r\n}\r\n\t\t\t\r\n\t\t\t.titulo{\r\n    background-color: white;\r\n    width: 35%;\r\n    height: auto;\r\n    float: right; \r\n    text-align: right;    \r\n\r\n}\r\n\t\t\t\r\n\t\t\t#contenedor {\r\n    width: 75%;\r\n    height: auto;  \r\n    margin: 0 auto;\r\n    background: transparent;\r\n    \r\n    }\r\n\t\t\t\r\n\t\t\t#cabecera {\r\n\r\n    background: linear-gradient(100deg, white, navy);\r\n\r\n    \r\n    height: auto;\r\n    width: 100%;\r\n    display: inline-table;\r\n    }\r\n\t\t\t\r\n\t\t\t#principalIzquierda  {\r\n    \r\n    display: table;\r\n    background: solid blue;\r\n    display: table-cell;\r\n    height: auto;\r\n    width: 30%;\r\n    \r\n    }\r\n\t\t\t\r\n\t\t\t#principalDerecha  {\r\n        background: #fff;\r\n        display: table;\r\n        background: solid aqua;\r\n        display: table-cell;\r\n        height: 2%;\r\n        width: 30%;\r\n        }\r\n\t\t\t\r\n\t\t\t#equipo  {\r\n\r\n        background: #fff;\r\n        display: table;\r\n        border: solid 1px dimgrey;\r\n        display: table-cell;\r\n        height: auto;\r\n        width: 15%;\r\n        margin-top: 50px;\r\n        margin-left: 10px;\r\n        }\r\n\t\t\t\r\n\t\t\t#pie  {\r\n    background: white;\r\n    \r\n    width: 100%;\r\n    height: auto;\r\n    }\r\n\t\t\t\r\n\t\t\t/*---------------------------------------------MODAL*/\r\n\t\t\t\r\n\t\t\tp{\r\n    text-align: justify;\r\n    margin-right: 25px;\r\n    margin-left: 25px;\r\n    \r\n}\r\n\t\t\t\r\n\t\t\t.cabecera_text{\r\n    vertical-align: text-bottom;\r\n    color: navy;\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-right: 15px;\r\n}\r\n\t\t\t\r\n\t\t\th2,h4{\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    \r\n}"

/***/ }),

/***/ "./src/app/profesores/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "\n\n<div id=\"contenedor\">\n    \n  <!-- Capa destinada al header -->\n   \n <div id=\"cabecera\">\n  <div class=\"logo\">\n      <img src=\"http://pegasus.javeriana.edu.co/static/puj_horizontal.png\">\n  </div>\n  \n  <div class=\"istar\">\n      \n        <img src=\"https://sophia.javeriana.edu.co/istar/sites/default/files/imagenesIstar/Imagen1.jpg\">\n      \n  </div>\n\n      <div class=\"titulo\">\n      <h1 class=\"cabecera_text\">Grupo de Investigación</h1>\n      <h3 class=\"cabecera_text\">Departamento de Ingeniería de Sistemas</h3>\n      </div>\n\n\n\n  </div>  \n\n   \n  \n  \n  <!-- Capa de contenidos, columnas, etc. -->\n   \n <div id=\"principalIzquierda\">\n\n  <div class=\"tab\">\n        <ul class=\"nav nav-tabs\">\n            <li class=\"active\"><a href=\"#\" (click)=\"openCity($event, 'Profile')\">PROFILE  </a></li>\n            <li class=\"dropdown\">\n              <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">PUBLICATIONS\n              <span class=\"caret\"></span></a>\n              <ul class=\"dropdown-menu\">\n                <li><a class=\"p\" href=\"#\" (click)=\"openCity($event, 'Articles')\" >Articles</a></li>\n                <li><a href=\"#\" (click)=\"openCity($event, 'Books')\" >Books</a></li>\n                <li><a href=\"#\" (click)=\"openCity($event, 'BookChapters')\" >Book Chapters</a></li>\n                <li><a href=\"#\" (click)=\"openCity($event, 'CPapers')\" >Conference Papers</a></li>\n                <li><a href=\"#\" (click)=\"openCity($event, 'Projects')\" >Projects</a></li> \n              </ul>\n            </li>\n            <li><a href=\"#\" (click)=\"openCity($event, 'Service')\" >SCIENTIFIC SERVICE</a></li>\n            <li><a href=\"#\" (click)=\"openCity($event, 'Education')\" >EDUCATION</a></li>\n            <li><a href=\"#\" (click)=\"openCity($event, 'BIO')\" >BIO</a></li>\n          </ul>\n  </div>\n\n\n<!-- Tab content -->\n\n<div id=\"Profile\" class=\"tabcontent\">\n  <profile [profesor]=\"profesor\" ></profile>\n</div>\n\n<div id=\"Articles\" class=\"tabcontent\">\n  <articles [profesor]=\"profesor\"></articles>\n</div>\n\n<div id=\"Books\" class=\"tabcontent\">\n    <books [profesor]=\"profesor\"></books>\n</div>\n\n<div id=\"BookChapters\" class=\"tabcontent\">\n    <book-char [profesor]=\"profesor\"></book-char>\n</div>\n\n<div id=\"CPapers\" class=\"tabcontent\">\n    <confe-paper [profesor]=\"profesor\"></confe-paper>\n</div>\n\n<div id=\"Projects\" class=\"tabcontent\">\n    <projects [profesor]=\"profesor\"></projects>\n</div>\n\n<div id=\"Service\" class=\"tabcontent\">\n  <services [profesor]=\"profesor\"   ></services>\n</div>\n\n<div id=\"Education\" class=\"tabcontent\">\n  <education [profesor]=\"profesor\" ></education>\n</div>\n\n<div id=\"BIO\" class=\"tabcontent\">\n  <biography [profesor]=\"profesor\" ></biography>\n</div>\n\n\n</div>\n  \n</div>\n\n \n  \n\n  <!-- Capa para el pie de página -->\n   \n <div id=\"pie\">   \n\n\n  </div>\n  \n\n\n  \n"

/***/ }),

/***/ "./src/app/profesores/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_services_service_service__ = __webpack_require__("./src/app/profesores/compartido/services/service.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomeComponent = /** @class */ (function () {
    function HomeComponent(service) {
        this.service = service;
        this.showProfile = false;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.profesor = new __WEBPACK_IMPORTED_MODULE_2__compartido_clases_profesor__["a" /* Profesor */]();
        this.profesor = this.service.profesor;
        this.openCity(null, 'Profile');
    };
    HomeComponent.prototype.openCity = function (evt, cityName) {
        // Declare all variables
        var i, tabcontent, tablinks;
        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(cityName).style.display = "block";
        //evt.currentTarget.className += " active";
    };
    HomeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'home',
            template: __webpack_require__("./src/app/profesores/home/home.component.html"),
            styles: [__webpack_require__("./src/app/profesores/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__compartido_services_service_service__["a" /* ServiceService */]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/profesores/profile/profile.component.css":
/***/ (function(module, exports) {

module.exports = ".imagen{\r\n    \r\n    width: 40%;\r\n    \r\n    float: left;\r\n    margin-top: 0;\r\n\r\n}\r\n\r\n.informacion{\r\n    \r\n    width: 54%;\r\n    height: auto;\r\n    float: left;\r\n    \r\n\r\n  \r\n}\r\n\r\n.publicaciones    {\r\n    \r\n    width: 95%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;     \r\n}\r\n\r\n.extracto{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    width: 100%;\r\n    font-size: 23px;\r\n    margin-top: 30px;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 20px;\r\n    background: snow;\r\n    margin-top: 0;\r\n\r\n\r\n}\r\n\r\n.news{\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    \r\n    float: left;\r\n    width: 30%;\r\n    height: 180px;\r\n    margin-top: 10px;\r\n    background: snow;\r\n    margin-bottom: 20px;\r\n    margin-left: 20px;\r\n    \r\n    \r\n}\r\n\r\n.amarillo{\r\n    border: solid yellow;\r\n    width: 100%;\r\n    height: 20px;\r\n    display: inline-table;\r\n}\r\n\r\nimg{\r\n    \r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    margin-top: 0;\r\n    margin-right: 100px;\r\n    vertical-align: top;\r\n    \r\n}\r\n\r\nbody{\r\n    margin-top: 5px;\r\n    -webkit-box-pack:center;\r\n        -ms-flex-pack:center;\r\n            justify-content:center;\r\n    background: white;\r\n}\r\n\r\n.perfil{\r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    border-radius: 30%;\r\n    vertical-align: top;\r\n    margin-left: 10px;\r\n}\r\n\r\n.istar{\r\n    width: 25%;\r\n    display: table-cell;    \r\n    vertical-align: middle;\r\n}\r\n\r\n.datos{\r\n    vertical-align: middle;\r\n    \r\n    width: auto;\r\n    height: auto;\r\n    float: left;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.info{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    margin-left: 15px;\r\n    margin-bottom: 25px;\r\n    background: snow;\r\n    width: 25%;\r\n    height: auto;\r\n    float: left;\r\n\r\n     \r\n    \r\n}\r\n\r\n.miembro{\r\n    \r\n    \r\n    width: 75%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n    cursor:  progress;\r\n}\r\n\r\n.primaryA{\r\n    font-style: italic;\r\n}\r\n\r\n.blanco{\r\nwidth: 20%;\r\n}\r\n\r\n.titulo{\r\n    \r\n    width: 100%;\r\n    height: auto;\r\n    display: table-cell;    \r\n    text-align: right;    \r\n}\r\n\r\n.url{\r\n    margin-left: 45%;\r\n    \r\n}\r\n\r\n.cv{\r\n    margin-left: 30px;\r\n    font-style: italic;\r\n}\r\n\r\n.h3t{\r\n    margin-top: 10px;\r\n    margin-left: 0;\r\n    float: left;\r\n    border-bottom:solid  gray ;\r\n}\r\n\r\n#contenedor {\r\n    \r\n    width: 73%;\r\n    height: auto;  \r\n    margin: 0 auto;\r\n    float: left;\r\n    background: white;\r\n    -webkit-box-pack:center;\r\n        -ms-flex-pack:center;\r\n            justify-content:center\r\n    }\r\n\r\n#cabecera {\r\n    background: navy;\r\n    \r\n    height: auto;\r\n    width: 100%;\r\n    display: inline-table;\r\n    }\r\n\r\n#lzquierda  {\r\n    \r\n\r\n    float: left;\r\n   \r\n    height: auto;\r\n    width: 35%;\r\n    \r\n    \r\n    }\r\n\r\n#Derecha  {\r\n    float: left;\r\n        height: auto;\r\n        width: 90%;\r\n        \r\n        \r\n    }\r\n\r\n#Centro  {\r\n    \r\n        margin-top: 10px;\r\n        display: table;\r\n        \r\n        height: auto;\r\n        width: 100%;\r\n        display: inline-table;\r\n        \r\n        }\r\n\r\n#principalCentro  {\r\n        margin-top: 70px;\r\n        display: table;\r\n        background: transparent;\r\n        display: table-cell;\r\n        height: 2%;\r\n        width: 100%;\r\n        }\r\n\r\n#equipo  {\r\n\r\n        background: #fff;\r\n        display: table;\r\n        \r\n        display: table-cell;\r\n        height: auto;\r\n        width: 15%;\r\n        margin-top: 50px;\r\n        margin-left: 10px;\r\n        }\r\n\r\n.pie  {\r\n    \r\n    background: white;\r\n    border-top: solid 1px slategray;\r\n    width: 100%;\r\n    height: auto;\r\n    margin-top: 30px;\r\n    \r\n    }\r\n\r\n/*---------------------------------------------MODAL*/\r\n\r\np{\r\n    text-align: justify;\r\n    margin-right: 25px;\r\n    margin-left: 25px;\r\n    margin-top: 5px;\r\n}\r\n\r\n.cabecera_text{\r\n    vertical-align: text-bottom;\r\n    color: mintcream;\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-right: 15px;\r\n}\r\n\r\nh2,h4{\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-left: 24px;\r\n}\r\n\r\nh3{\r\n    margin-top: 0;\r\n    margin-bottom: 7px;\r\n    margin-left: 12px;\r\n}\r\n\r\noutput{\r\n    margin-left: 30px;\r\n    text-align: justify;\r\n}\r\n\r\nh1{\r\n    margin-top: 60px;\r\n    margin-left: 24px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n/*---------------------------------*/\r\n"

/***/ }),

/***/ "./src/app/profesores/profile/profile.component.html":
/***/ (function(module, exports) {

module.exports = "<body>\n \n    <!-- Contenedor para toda la página -->\n     \n   <div id=\"contenedor\">\n    \n     \n   <div id=\"principalCentro\">\n        \n        <div class=\"imagen\">\n        \n            <img class=\"perfil\" src=\"{{profesor.urlFoto}}\">\n\n        </div>  \n\n\n        <div class=\"informacion\">\n            <div class=\"datos\">\n                <h1>{{profesor.nombre}}</h1>\n                <h2>{{profesor.titular}}</h2>\n                <h4>{{profesor.puesto.cargo}}</h4>\n                       \n            </div>\n\n        </div>\n    \n\n        <div id=\"Centro\">\n            \n      \n\n                <div id=\"Derecha\">\n\n                  <div class=\"extracto\">\n                        \n                        <p>{{profesor.extracto}}</p>\n                    </div>\n\n                </div>\n\n        </div>\n        \n\n\n\n\n    </div>\n\n      \n   <div class=\"pie\">   \n\n            <h2>News</h2>\n        \n            \n                <div class=\"news\" *ngFor=\"let n of profesor.news\">\n        \n                    <h3 >{{n.tittle}}  </h3>\n                    <p>\n                            {{n.description}} \n                            <br>\n                            <a class=\"url\" href=\"{{n.url}}\">View</a>\n                    </p>\n        \n                </div> \n        \n  \n\n    </div>\n\n  </div>\n\n  \n  <div class=\"info\">\n        <h2>Contact Information</h2>\n        <h4>Address: </h4>\n        <p>{{profesor.infoContact.address}}</p>\n        <h4>Office: </h4>\n        <p>{{profesor.infoContact.office}}</p>\n        <h4>Email: </h4>\n        <p>{{profesor.infoContact.email}}</p>\n        <h4>Office Phone: </h4>\n        <p>{{profesor.infoContact.officePhone}} ext. ({{profesor.infoContact.extension}})</p>\n        <h3>PRIMARY TEACHING AREA</h3>\n        <output class=\"primaryA\" type=\"primaryA\" name=\"primaryA\" id=\"primaryA\" value=\"{{profesor.primaryArea}}\"></output>\n        <br>\n        <br>\n        <h3>FACULTY CV</h3>\n        <a class=\"cv\" href=\"facebook.com\">Download CV</a>\n        <br>\n        <br>\n    </div>\n\n\n    <div  class=\"info\">\n        <h2>Research Interests</h2>\n        <br>\n\n          <div class=\"li\" *ngFor=\"let i of profesor.interests\">\n                \n           \n           \n                      <h4>{{i.area}}</h4>\n                      \n                      <ul *ngFor=\"let t of i.topics\">\n                       \n                        <li class=\"primaryA\">{{t}}</li>\n                 \n                      </ul>\n    \n                    \n                    </div> \n    </div>\n    \n\n</body>"

/***/ }),

/***/ "./src/app/profesores/profile/profile.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ProfileComponent = /** @class */ (function () {
    function ProfileComponent() {
    }
    ProfileComponent.prototype.ngOnInit = function () {
        //  this.iniciar();
    };
    ProfileComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], ProfileComponent.prototype, "profesor", void 0);
    ProfileComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'profile',
            template: __webpack_require__("./src/app/profesores/profile/profile.component.html"),
            styles: [__webpack_require__("./src/app/profesores/profile/profile.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ProfileComponent);
    return ProfileComponent;
}());



/***/ }),

/***/ "./src/app/profesores/projects/projects.component.css":
/***/ (function(module, exports) {

module.exports = ".publicacion    {\r\n  border-bottom: solid 1px dimgrey;\r\n  width: 95%;\r\n  height: auto;\r\n  margin-top: 20px;\r\n  margin-left: 10px;\r\n  margin-right: 10px;\r\n  margin-bottom: 50px;\r\n}\r\n\r\n.componente{\r\n  border: solid 1px dimgrey;\r\n  -webkit-box-shadow: 4px 8px gray;\r\n          box-shadow: 4px 8px gray;\r\n  width: 90%;\r\n  height: auto;\r\n  margin-top: 10px;\r\n  margin-left: 20px;\r\n  margin-bottom: 20px;    \r\n  background: white;\r\n}\r\n\r\nlabel{\r\n  font-size: 20px;\r\n  display: inline-block;\r\n  width: 80px;\r\n}\r\n\r\noutput{\r\n  text-align: justify;\r\n  display: inline-block;\r\n  font-size: 20px;\r\n  margin-left: 120px;\r\n}\r\n\r\np{\r\n  font-style: italic;\r\n  text-align: justify;\r\n  font-size: 18px;\r\n  margin-right: 25px;\r\n  margin-left: 100px;\r\n  margin-top: 0px;\r\n}\r\n\r\nh2{\r\nmargin-top: 0;\r\nmargin-bottom: 7px;\r\nmargin-left: 12px;\r\n}\r\n\r\nh3{\r\nfont-size: 22px;\r\ntext-transform: capitalize;\r\n}\r\n\r\nh1{\r\n\r\n  margin-left: 24px;\r\n  margin-bottom: 5px;\r\n}\r\n\r\n.fondo {\r\n        \r\n  width: 80%;\r\n  height: auto;  \r\n  margin-top: 10px;\r\n  background: white;\r\n  \r\n}\r\n"

/***/ }),

/***/ "./src/app/profesores/projects/projects.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fondo\">\n\n<h1>Projects</h1>\n\n<div class=\"componente\">\n  \n<ul>\n        <li class=\"publicacion\" *ngFor=\"let p of proyectos\">\n                \n                <h3>{{p.titulo}}</h3>          \n                \n                <label for=\"codigo\">Code: </label>\n                <output type=\"text\" name=\"codigo\" id=\"codigo\" value=\"{{p.codigo}}\"></output>\n                <br>\n                <label for=\"type\">Type: </label>\n                <output type=\"text\" name=\"type\" id=\"type\" value=\"{{p.tipo}}\"></output>\n                <br>\n                <label for=\"resumen\">Summary: </label>\n                <output type=\"text\" name=\"resumen\" id=\"resumen\" value=\"{{p.resumen}}\"></output>\n                <br> \n                <label for=\"autores\">Authors: </label>\n                <p>\n                        {{getAutores(p)}}\n                </p>\n\n        </li>\n</ul>\n\n</div>\n\n</div>"

/***/ }),

/***/ "./src/app/profesores/projects/projects.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProjectsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compartido_clases_proyecto__ = __webpack_require__("./src/app/profesores/compartido/clases/proyecto.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProjectsComponent = /** @class */ (function () {
    function ProjectsComponent() {
    }
    ProjectsComponent.prototype.ngOnInit = function () {
        this.getProyectos();
    };
    ProjectsComponent.prototype.getProyectos = function () {
        this.proyectos = [];
        for (var i = 0; i < this.profesor.productos.length; i++) {
            if (this.profesor.productos[i] instanceof __WEBPACK_IMPORTED_MODULE_2__compartido_clases_proyecto__["a" /* Proyecto */]) {
                this.proyectos.push(this.profesor.productos[i]);
            }
        }
    };
    ProjectsComponent.prototype.getTemas = function (p) {
        var t = "";
        for (var i = 0; i < p.temas.length; i++) {
            if (i > 0 && i < (p.temas.length) && t != "") {
                t = t + ",";
            }
            t = t + p.temas[i];
        }
        return t;
    };
    ProjectsComponent.prototype.getAutores = function (p) {
        var t = "";
        for (var i = 0; i < p.coautores.length; i++) {
            t = t + p.coautores[i] + ", ";
        }
        return t;
    };
    ProjectsComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], ProjectsComponent.prototype, "profesor", void 0);
    ProjectsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'projects',
            template: __webpack_require__("./src/app/profesores/projects/projects.component.html"),
            styles: [__webpack_require__("./src/app/profesores/projects/projects.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ProjectsComponent);
    return ProjectsComponent;
}());



/***/ }),

/***/ "./src/app/profesores/services/services.component.css":
/***/ (function(module, exports) {

module.exports = ".imagen{\r\n    \r\n    width: 40%;\r\n    \r\n    \r\n    float: left;\r\n    margin-top: 0;\r\n\r\n}\r\n\r\n.informacion{\r\n    margin-top: 0;\r\n    width: auto;\r\n    height: auto;   \r\n    \r\n    \r\n    \r\n}\r\n\r\n.study{\r\n\r\n    width: 95%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 4    0px;   \r\n    border-bottom: solid 1px dimgrey;  \r\n}\r\n\r\n.bio{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    width: 95%;\r\n    font-size: 23px;\r\n    margin-top: 0;\r\n    margin-left: 10px;\r\n    margin-right: 10px;\r\n    margin-bottom: 20px;\r\n    background: snow;\r\n    \r\n\r\n}\r\n\r\n.service{\r\n\r\n    \r\n    float: left;\r\n    width: 25%;\r\n    height: 100%;\r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-bottom: 20px;\r\n    \r\n}\r\n\r\n.li{\r\n\r\n    \r\n    background: snow;\r\n    text-align: justify;   \r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n    padding: 10px;\r\n}\r\n\r\n.amarillo{\r\n    border: solid yellow;\r\n    width: 100%;\r\n    height: 20px;\r\n    display: inline-table;\r\n}\r\n\r\nimg{\r\n    \r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    margin-top: 0;\r\n    margin-right: 100px;\r\n    vertical-align: top;\r\n    \r\n}\r\n\r\nbody{\r\n    margin-top: 5px;\r\n    \r\n    background: transparent;\r\n}\r\n\r\n.perfil{\r\n    width:100%;\r\n    height:100%;\r\n    margin:auto;\r\n    border-radius: 30%;\r\n    vertical-align: top;\r\n    margin-left: 10px;\r\n}\r\n\r\n.istar{\r\n    width: 25%;\r\n    display: table-cell;    \r\n    vertical-align: middle;\r\n}\r\n\r\n.datos{\r\n\r\n    width: auto;\r\n    height: auto;\r\n\r\n}\r\n\r\n.info{\r\n\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    background: snow;\r\n    width: 95%;\r\n    height: auto;\r\n    \r\n}\r\n\r\n.miembro{\r\n        \r\n    width: 75%;\r\n    height: auto;\r\n    margin-top: 10px;\r\n    margin-left: 20px;\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n    cursor:  progress;\r\n}\r\n\r\n.primaryA{\r\n    font-style: italic;\r\n    margin-left: 35px;\r\n}\r\n\r\n.blanco{\r\nwidth: 20%;\r\n}\r\n\r\n.titulo{\r\n    \r\n    width: 100%;\r\n    height: auto;\r\n    display: table-cell;    \r\n    text-align: right;    \r\n}\r\n\r\n.url{\r\n    margin-left: 45%;\r\n    \r\n}\r\n\r\n.cv{\r\n    margin-left: 30px;\r\n    font-style: italic;\r\n}\r\n\r\n.h3t{\r\n    margin-top: 10px;\r\n    margin-left: 0;\r\n    \r\n    border-bottom:solid  gray ;\r\n}\r\n\r\n#contenedor {\r\n    \r\n    width: 73%;\r\n    height: auto;  \r\n    margin: 0 auto;\r\n    \r\n    background: white;\r\n    border: solid 1px dimgrey;\r\n    -webkit-box-shadow: 4px 8px gray;\r\n            box-shadow: 4px 8px gray;\r\n    \r\n    }\r\n\r\n#cabecera {\r\n    background: navy;\r\n    \r\n    height: auto;\r\n    width: 100%;\r\n    display: inline-table;\r\n    }\r\n\r\n#lzquierda  {\r\n    \r\n\r\n    float: left;\r\n   \r\n    height: auto;\r\n    width: 35%;\r\n    \r\n    \r\n    }\r\n\r\n#Derecha  {\r\n        \r\n        display: -webkit-box;\r\n        \r\n        display: -ms-flexbox;\r\n        \r\n        display: flex;\r\n        -webkit-box-pack: center;\r\n            -ms-flex-pack: center;\r\n                justify-content: center;\r\n        width: 100%;\r\n        \r\n        \r\n    }\r\n\r\n#Centro  {\r\n    \r\n        margin-top: 10px;\r\n        display: table;\r\n        \r\n        height: auto;\r\n        width: 100%;\r\n        display: inline-table;\r\n        \r\n        }\r\n\r\n#principalCentro  {\r\n        background: white;\r\n        width: 100%;\r\n\r\n    }\r\n\r\n#equipo  {\r\n\r\n        background: #fff;\r\n        display: table;\r\n        \r\n        display: table-cell;\r\n        height: auto;\r\n        width: 15%;\r\n        margin-top: 50px;\r\n        margin-left: 10px;\r\n        }\r\n\r\n#pie  {\r\n    background: white;\r\n    \r\n    width: 100%;\r\n    height: auto;\r\n    }\r\n\r\n.fondo {\r\n        \r\n        width: 80%;\r\n        height: auto;  \r\n        margin-top: 10px;\r\n        background: white;\r\n        \r\n    }\r\n\r\n/*---------------------------------------------MODAL*/\r\n\r\np{\r\n        text-align: justify;\r\n    margin-right: 25px;\r\n    margin-left: 25px;\r\n    \r\n}\r\n\r\n.cabecera_text{\r\n    vertical-align: text-bottom;\r\n    color: mintcream;\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-right: 15px;\r\n}\r\n\r\nh2,h4{\r\n    margin-bottom: 0px;\r\n    margin-top:0px;\r\n    margin-left: 24px;\r\n}\r\n\r\nh1{\r\n\r\n    margin-left: 24px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\nlabel{\r\n    font-size: 20px;\r\n    display: inline-block;\r\n    width: 80px;\r\n  }\r\n\r\noutput{\r\n    text-align: justify;\r\n    display: inline-block;\r\n    font-size: 20px;\r\n    margin-left: 30px;\r\n  }\r\n\r\np{\r\n    font-style: italic;\r\n    text-align: justify;\r\n    font-size: 18px;\r\n    margin-right: 25px;\r\n    margin-left: 100px;\r\n    margin-top: 0px;\r\n  }\r\n\r\nh3{\r\n    font-size: 22px;\r\n    text-transform: capitalize;\r\n    margin-bottom: 0;\r\n    }"

/***/ }),

/***/ "./src/app/profesores/services/services.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fondo\">\n \n  <!-- Contenedor para toda la página -->\n  <h1>Listings of Scientific Service</h1>  \n <div id=\"contenedor\">\n  \n\n\n\n  <div id=\"principalCentro\">\n      <br>\n      <br>\n      \n    <ul>\n        <li class=\"study\" *ngFor=\"let s of profesor.scientifics\">\n            \n          <h3>{{s.tittle}} </h3>\n            <output  type=\"text\" name=\"type\" id=\"type\" >{{s.type}}, {{s.entity}} ({{s.country}}), {{s.ambit}}</output>\n            <br>\n            <output  class=\"primaryA\" type=\"text\" name=\"year\" id=\"year\" value=\"{{s.year}}\"></output>\n            <br>\n            <br>\n            \n      \n                          \n        </li>\n      </ul>\n  </div>\n\n\n\n\n\n  \n</div>\n\n\n\n\n  \n</div>"

/***/ }),

/***/ "./src/app/profesores/services/services.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServicesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__ = __webpack_require__("./src/app/profesores/compartido/clases/profesor.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ServicesComponent = /** @class */ (function () {
    function ServicesComponent() {
    }
    ServicesComponent.prototype.ngOnInit = function () {
        //  this.iniciar();
    };
    ServicesComponent.prototype.verFecha = function (n) {
        var d = new Date(n);
        return d.toLocaleDateString();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__compartido_clases_profesor__["a" /* Profesor */])
    ], ServicesComponent.prototype, "profesor", void 0);
    ServicesComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'services',
            template: __webpack_require__("./src/app/profesores/services/services.component.html"),
            styles: [__webpack_require__("./src/app/profesores/services/services.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ServicesComponent);
    return ServicesComponent;
}());



/***/ }),

/***/ "./src/app/profesores/tab/tab.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


//import {MatTabsModule} from '@angular/material/tabs';
var TabModule = /** @class */ (function () {
    function TabModule() {
    }
    TabModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* CommonModule */],
            ], exports: [],
            declarations: []
        })
    ], TabModule);
    return TabModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map