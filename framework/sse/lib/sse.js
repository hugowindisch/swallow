/**
    sse.js

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var events = require('events'),
    utils = require('utils'),
    isArray = utils.isArray,
    update = require('visual').update,
    forEachProperty = utils.forEachProperty;

function EventSource(url, optionalInit) {
    var that = this;
    this.evtSrc = new window.EventSource(url, optionalInit);
    this.hooks = {};
    this.on('addListener', function () {
        this.updateHooks();
    });
}
EventSource.prototype = new events.EventEmitter();
EventSource.prototype.close = function () {
    this.evtSrc.close();
};
EventSource.prototype.updateHooks = function () {
    var that = this,
        evtSrc = that.evtSrc,
        hooks = that.hooks;
    // sadly, we need to be chummy chummy with the EventListener to
    // accomplish what we need
    forEachProperty(this._events, function (evt, evtName) {
        // if there are some handlers
        if (evt && (!isArray(evt) || evt.length > 0)) {
            if (!hooks[evtName]) {
                // we want to hook something on the inner source
                hooks[evtName] = function (e) {
                    that.emit(evtName, e);
                    update();
                };
                evtSrc.addEventListener(evtName, hooks[evtName]);
            }
        } else {
            if (hooks[evtName]) {
                evtSrc.removeEventListener(evtName, hooks[evtName]);
                // we want no event at all on the innersource
                delete hooks[evtName];
            }
        }
    });
};
exports.EventSource = EventSource;
