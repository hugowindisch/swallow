/**
    event.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
function ensureEvents(ee) {
    var ret = ee._events;
    if (!ret) {
        ret = ee._events = {};
    }
    return ret;
}
// I decided to adopt Node's event emitting API and implemented it here
function EventEmitter() {
}
EventEmitter.prototype.addListener = EventEmitter.prototype.on = function (event, listener) {
    var events = ensureEvents(this);
    if (!events[event]) {
        events[event] = listener;
    } else if (events[event] instanceof Array) {
        events[event].push(listener);
    } else {
        events[event] = [ this._events[event], listener ];
    }
    // we should check for max Events
    // we should fire an event for addListener
    this.emit('addListener', event, listener);
};
EventEmitter.prototype.once = function (event, listener) {
    var that = this;
    function onetime() {
        that.removeListener(event, onetime);
        listener.apply(this, arguments);
    }
    this.on(event, onetime);
};
EventEmitter.prototype.removeListener = function (event, listener) {
    var events, i, n, handlers;
    if (this._events) {
        events = this._events;
        handlers = events[event];
        if (handlers === listener) {
            delete events[event];
        } else if (handlers instanceof Array) {
            n = handlers.length;
            for (i = 0; i < n; i += 1) {
                if (handlers[i] === listener) {
                    handlers.splice(i, 1);
                    break;
                }
            }
            if (handlers.length === 0) {
                delete events[event];
            }
        }
    }
};
EventEmitter.prototype.removeAllListeners = function (event) {
    if (this._events) {
        delete this._events[event];
    }
};
EventEmitter.prototype.setMaxListeners = function (n) {
    // FIXME: NOT SUPPORTED YET (this behaves weirdly in node)
};
EventEmitter.prototype.listeners = function (event) {
    var events = ensureEvents(this),
        ret = events[event];
    if (!ret) {
        ret = events[event] = [];
    } else if (!(ret instanceof Array)) {
        ret = events[event] = [ret];
    }
    return ret;
};
EventEmitter.prototype.emit = function (event) {
    var events = this._events,
        ret = false,
        listeners,
        args,
        i,
        n;
    if (events) {
        listeners = events[event];
        if (listeners instanceof Array) {
            args = Array.prototype.slice.call(arguments, 1);
            n = listeners.length;
            for (i = 0; i < n; i += 1) {
                listeners[i].apply(this, args);
            }
            ret = true;
        } else if (listeners) {
            listeners.apply(this, Array.prototype.slice.call(arguments, 1));
            ret = true;
        }
    }
    return ret;
};

exports.EventEmitter = EventEmitter;
