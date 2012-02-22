/**
    domhooks.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var utils = require('utils'),
    dirty = require('/visual/lib/dirty'),
    keycodes = require('./keycodes'),
    numToVk = keycodes.numToVk,
    makeKeyString = keycodes.makeKeyString,
    decorateVk = keycodes.decorateVk,
    updateDOMEventHooks,
    forEachProperty = utils.forEachProperty,
    hookMap;

/**
    Filters a key event to uniformize it. 
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
    ret.preventDefault = function () { evt.preventDefault(); };
    ret.stopPropagation = function () { evt.stopPropagation(); };
    // prevent...
    return ret;
}

/**
    Returns the topmost element.
*/
function getTopmostElement(vis) {
    // should be done on the topmost node
    var el = vis.element;
    while (el.parentNode) {
        el = el.parentNode;
    }       
    return el;
}

/**
    Our event hooks
*/
hookMap = {
    keydown: {
        getDOMElement: function (vis) {
            return document;
        },
        filterEvent: FilterKeyEvent
    },
    keyup: {
        getDOMElement: function (vis) {
            return document;
        },
        filterEvent: FilterKeyEvent
    },
    resize: {
        getDOMElement: function (vis) {
            return window;
        }            
    },
    click: {
        getDOMElement: function (vis) {            
            return vis.element;
        }            
    },
    mousedown: {
        getDOMElement: function (vis) {            
            return vis.element;
        }            
    },
    mouseup: {
        getDOMElement: function (vis) {            
            return vis.element;
        }            
    },
    mouseupc: {
        capture: true,
        domEvent: 'mouseup',
        getDOMElement: getTopmostElement
    },
    mouseover: {
        getDOMElement: function (vis) {            
            return vis.element;
        }            
    },
    mousemove: {
        getDOMElement: function (vis) {            
            return vis.element;
        }            
    },
    mousemovec: {
        capture: true,
        domEvent: 'mousemove',
        getDOMElement: getTopmostElement
    },
    mouseout: {
        getDOMElement: function (vis) {            
            return vis.element;
        }            
    }
};


/**
    Creates a handler for a given event name.
*/
function createHandler(name, vis, filter) {
    return function (evt) {
        if (filter) {
            evt = filter(evt);
        }
        vis.emit(name, evt);
        dirty.update();
        updateDOMEventHooks(vis);
    };
}


/**
    Adds dom event hooks to v if necessary.
*/
function enforceDOMHooks(v) {
    var ret = v.domHooks;
    if (!ret) {
        ret = v.domHooks = {};
    }
    return ret;
}


/**
    Unhooks a dom handler.
*/
function removeDOMHook(v, event, hook) {
    var hooks = v.domHooks,
        element;   
    // we must be unhooked from keydown
    if (hooks && hooks[event]) {
        element = hook.getDOMElement(v);
        element.removeEventListener(
            hook.domEvent ? hook.domEvent : event, 
            hooks[event],
            hook.capture === true
        );
        delete hooks[event];
    }
}

/**
    Hooks a dom handler.
*/
function addDOMHook(v, event, hook) {
    var hooks = enforceDOMHooks(v);
    if (!hooks[event]) {    
        hooks[event] = { handleEvent: createHandler(event, v, hook.filterEvent) };
        hook.getDOMElement(v).addEventListener(
            hook.domEvent ? hook.domEvent : event, 
            hooks[event], 
            hook.capture === true
        );
    }
}


/**
    This will inspect the type of events that we have and update the
    dom event hooks accordingly (i.e. connect us to the keyboard and mouse
    or not).
*/   

updateDOMEventHooks = function (v) {
    var enabled = v.connectedToTheStage && !v.disableEventHooks;
    forEachProperty(hookMap, function (value, key) {
        var listeners = v.listeners(key);
        if (enabled && listeners.length > 0) {
            addDOMHook(v, key, value);
        } else {
            removeDOMHook(v, key, value);
        }        
    });
};

exports.updateDOMEventHooks = updateDOMEventHooks;
