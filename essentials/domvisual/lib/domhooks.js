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
            createHandler: function (vis) {
                return function (evt) {
                    vis.emit('keydown', evt);
                    dirty.update();
                    updateDOMEventHooks(vis);
                };
            },
            getDOMElement: function (vis) {
                return document;
            }            
        },
        keyup: {
            createHandler: function (vis) {
                return function (evt) {
                    vis.emit('keyup', evt);
                    dirty.update();
                    updateDOMEventHooks(vis);
                };
            },
            getDOMElement: function (vis) {
                return document;
            }            
        }
    };


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
function removeDOMHook(v, event, element) {
    var hooks = v.domHooks;
    // we must be unhooked from keydown
    if (hooks && hooks[event]) {
        element.removeEventListener(event, hooks[event]);
        delete hooks[event];
    }
}

/**
    Hooks a dom handler.
*/
function addDOMHook(v, event, fcn, element) {
    var hooks = enforceDOMHooks(v);
    if (!hooks[event]) {
        hooks[event] = { handleEvent: fcn };
        element.addEventListener(event, hooks.keydown, false);
    }
}


/**
    This will inspect the type of events that we have and update the
    dom event hooks accordingly (i.e. connect us to the keyboard and mouse
    or not).
*/   
updateDOMEventHooks = function (v) {
    forEachProperty(hookMap, function (value, key) {
        var listeners = v.listeners(key);
        if (listeners.length > 0) {
            addDOMHook(v, key, value.createHandler(v), value.getDOMElement(v));
        } else {
            removeDOMHook(v, key, value.getDOMElement(v));
        }        
    });
};

exports.updateDOMEventHooks = updateDOMEventHooks;
