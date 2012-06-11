/**
    event.js

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
function ensureEvents(ee) {
    if (!ee.hasOwnProperty('_events')) {
        ee._events = {};
    }
    return ee._events;
}

// I decided to adopt Node's event emitting API and implemented it here
function EventEmitter() {
}

EventEmitter.prototype.addListener =
    EventEmitter.prototype.on =
    function (event, listener) {
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
        return this;
    };

EventEmitter.prototype.once = function (event, listener) {
    var that = this;
    function onetime() {
        that.removeListener(event, onetime);
        listener.apply(this, arguments);
    }
    this.on(event, onetime);
    return this;
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
    return this;
};

EventEmitter.prototype.removeAllListeners = function (event) {
    if (this._events) {
        delete this._events[event];
    }
    return this;
};

EventEmitter.prototype.setMaxListeners = function (n) {
    // FIXME: NOT SUPPORTED YET (this behaves weirdly in node)
};

// this sucks badly (imo) because we get something and something potentially
// gets created.
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

// same as above without altering the emitter
EventEmitter.prototype.getListeners = function (event) {
    var ret;
    if (this._events) {
        ret = this._events[event] || [];
        // buggy: what if the listener IS an array?
        if (!(ret instanceof Array)) {
            ret = [ret];
        }
    } else {
        ret = [];
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
            listeners = listeners.slice(0);
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
