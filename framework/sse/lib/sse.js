/**
    sse.js
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
var events = require('events'),
    utils = require('utils'),
    isArray = utils.isArray,
    update = require('visual').update,
    forEachProperty = utils.forEachProperty;

/**
* @constructor Constructs an event source.
* @param {String} url is the url for receiving inits.
* @param {Object} optionalInit is an optional init dictionary.
*/
function EventSource(url, optionalInit) {
    var that = this;
    // weird problem with firefox (if I pass an invalid optionalInit)
    if (arguments.length === 2) {
        this.evtSrc = new window.EventSource(url, optionalInit);
    } else {
        this.evtSrc = new window.EventSource(url);
    }

    this.hooks = {};
    this.on('addListener', function () {
        this.updateHooks();
    });
}

EventSource.prototype = new events.EventEmitter();

/**
* Closes the vent source.
* @returns {EventSource} this.
*/
EventSource.prototype.close = function () {
    this.evtSrc.close();
    return this;
};

/**
* @private
*/
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
