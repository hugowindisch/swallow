/**
    domhooks.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var utils = require('utils'),
    dirty = require('/visual/lib/dirty'),
    updateDOMEventHooks,
    forEachProperty = utils.forEachProperty,
    hookMap = {
        keydown: {
            getDOMElement: function (vis) {
                return document;
            }            
        },
        keyup: {
            getDOMElement: function (vis) {
                return document;
            }            
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
            getDOMElement: function (vis) {
                // should be done on the topmost node
                var el = vis.element;
                while (el.parentNode) {
                    el = el.parentNode;
                }       
                return el;
            }            
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
            getDOMElement: function (vis) {
                // should be done on the topmost node
                var el = vis.element;
                while (el.parentNode) {
                    el = el.parentNode;
                }       
                return el;
            }            
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
function createHandler(name, vis) {
    return function (evt) {
        vis.emit(name, evt);
        dirty.update();
        updateDOMEventHooks(vis);
    };
}


/**
    Checks if interactions are allowed on a given visual.
*/
function eventHooksEnabled(v) {
    if (v.disableEventHooks) {
        return false;
    }
    if (v.parent) {
        return eventHooksEnabled(v.parent);
    }
    return true;
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
        hooks[event] = { handleEvent: createHandler(event, v) };
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
    var enabled = eventHooksEnabled(v);
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
