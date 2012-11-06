/**
    domhooks.js
    Copyright (C) 2012 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
*/
/*globals window */
var utils = require('utils'),
    dirty = require('/visual/lib/dirty'),
    keycodes = require('./keycodes'),
    numToVk = keycodes.numToVk,
    makeKeyString = keycodes.makeKeyString,
    decorateVk = keycodes.decorateVk,
    updateDOMEventHooks,
    forEachProperty = utils.forEachProperty,
    browser = require('./browser').getBrowser(),
    hookMap;

/*
* Filters a key event to uniformize it.
* @api private
*/
function FilterKeyEvent(evt) {
    var ret = {
            keyCode: evt.keyCode,
            ctrlKey: evt.ctrlKey,
            shiftKey: evt.shiftKey,
            metaKey: evt.metaKey,
            altKey: evt.altKey
        },
        vk = numToVk(evt.keyCode);

    ret.keyString = makeKeyString(
        vk,
        evt.ctrlKey,
        evt.altKey,
        evt.metaKey,
        evt.shiftKey
    );
    ret.decoratedVk = decorateVk(
        vk,
        evt.ctrlKey,
        evt.altKey,
        evt.metaKey,
        evt.shiftKey
    );
    ret.preventDefault = function () {
        evt.preventDefault();
    };
    ret.stopPropagation = function () {
        evt.stopPropagation();
    };
    // prevent...
    return ret;
}

/*
* Returns the topmost element.
* @api private
*/
function getTopmostElement(vis) {
    // should be done on the topmost node
    var el = vis.element;
    while (el.parentNode) {
        el = el.parentNode;
    }
    return el;
}

/*
* Our event hooks
* @api private
*/
hookMap = {
    keydown: {
        getDOMElement: function (vis) {
            var el = vis.element;
            return el.nodeName.toLowerCase() === 'input' ? el : document;
        },
        filterEvent: FilterKeyEvent,
        interactive: true
    },
    keyup: {
        getDOMElement: function (vis) {
            var el = vis.element;
            return el.nodeName.toLowerCase() === 'input' ? el : document;
        },
        filterEvent: FilterKeyEvent,
        interactive: true
    },
    resize: {
        getDOMElement: function (vis) {
            return window;
        }
    },
    click: {
        getDOMElement: function (vis) {
            return vis.element;
        },
        interactive: true
    },
    mousedown: {
        getDOMElement: function (vis) {
            return vis.element;
        },
        interactive: true
    },
    mousedownt: {
        domEvent: 'mousedown',
        getDOMElement: getTopmostElement,
        interactive: true
    },
    mousedownc: {
        capture: true,
        domEvent: 'mousedown',
        getDOMElement: getTopmostElement,
        interactive: true
    },
    mouseup: {
        getDOMElement: function (vis) {
            return vis.element;
        },
        interactive: true
    },
    mouseupc: {
        capture: true,
        domEvent: 'mouseup',
        getDOMElement: getTopmostElement,
        interactive: true
    },
    mouseupt: {
        domEvent: 'mouseup',
        getDOMElement: getTopmostElement,
        interactive: true
    },
    mouseover: {
        getDOMElement: function (vis) {
            return vis.element;
        },
        interactive: true
    },
    mousemove: {
        getDOMElement: function (vis) {
            return vis.element;
        },
        interactive: true
    },
    mousemovec: {
        capture: true,
        domEvent: 'mousemove',
        getDOMElement: getTopmostElement,
        interactive: true
    },
    mouseout: {
        getDOMElement: function (vis) {
            return vis.element;
        },
        interactive: true
    },
    change: {
        getDOMElement: function (vis) {
            return vis.element;
        }
    },
    load: {
        getDOMElement: function (vis) {
            return vis.element;
        }
    },
    error: {
        getDOMElement: function (vis) {
            return vis.element;
        }
    },
    drop: {
        getDOMElement: function (vis) {
            return vis.element;
        }
    },
    dragover: {
        getDOMElement: function (vis) {
            return vis.element;
        }
    },
    transitionend: {
        domEvent: ({
            'AppleWebKit': 'webkitTransitionEnd',
            'Mozilla': 'transitionend'
        })[browser],
        getDOMElement: function (vis) {
            return vis.element;
        }
    },
    DOMSubtreeModified: {
        getDOMElement: function (vis) {
            return vis.element;
        }
    }
};

/*
* Creates a handler for a given event name.
* @api private
*/
function createHandler(name, vis, filter) {
    return function (evt) {
        if (filter) {
            evt = filter(evt);
        }
        vis.emit(name, evt);
        if (!dirty.isInUpdate()) {
            dirty.update();
        }
        updateDOMEventHooks(vis);
    };
}

/*
* Adds dom event hooks to v if necessary.
* @api private
*/
function enforceDOMHooks(v) {
    var ret = v.domHooks;
    if (!ret) {
        ret = v.domHooks = {};
    }
    return ret;
}

/**
    IE compatibility
*/
function addEventListener(element, event, hook, capture) {
    if (element.addEventListener) {
        element.addEventListener(event, hook, capture);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, hook);
    }
}
function removeEventListener(element, event, hook, capture) {
    if (element.removeEventListener) {
        element.removeEventListener(event, hook, capture);
    } else if (element.attachEvent) {
        element.detachEvent('on' + event, hook);
    }
}

/*
* Unhooks a dom handler.
* @api private
*/
function removeDOMHook(v, event, hook) {
    var hooks = v.domHooks;
    // we must be unhooked from keydown
    if (hooks && hooks[event]) {
        removeEventListener(
            hook.getDOMElement(v),
            hook.domEvent ? hook.domEvent : event,
            hooks[event],
            hook.capture === true
        );
        delete hooks[event];
    }
}

/*
* Hooks a dom handler.
* @api private
*/
function addDOMHook(v, event, hook) {
    var hooks = enforceDOMHooks(v);
    if (!hooks[event]) {
        hooks[event] = {
            handleEvent: createHandler(event, v, hook.filterEvent)
        };
        addEventListener(
            hook.getDOMElement(v),
            hook.domEvent ? hook.domEvent : event,
            hooks[event],
            hook.capture === true
        );
    }
}

/**
* This will inspect the type of events that we have and update the
* dom event hooks accordingly (i.e. connect us to the keyboard and mouse
* or not).
* @api private
*/
updateDOMEventHooks = function (v) {
    var enabled = v.connectedToTheStage,
        interactiveEnabled = !v.disableInteractiveEventHooks;
    forEachProperty(hookMap, function (value, key) {
        var listeners = v.getListeners(key);
        if (enabled && (!value.interactive || interactiveEnabled) &&
                listeners.length > 0) {
            addDOMHook(v, key, value);
        } else {
            removeDOMHook(v, key, value);
        }
    });
};

exports.updateDOMEventHooks = updateDOMEventHooks;
