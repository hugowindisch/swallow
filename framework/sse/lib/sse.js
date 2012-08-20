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
/*jslint nomen: false */
var events = require('events'),
    utils = require('utils'),
    isArray = utils.isArray,
    update = require('visual').update,
    forEachProperty = utils.forEachProperty;

/**
* This package adapts the EventSource provided by the browser to make it
* become a standard EventEmitter (so you can use on, once, etc... as defined
* in events.EventEmitter).
*
* EventEmitter will eventually be supported for browsers that don't support it.
*
* @package sse
*/


/**
* Constructs an event source (this EventSource is an events.EventEmitter
* therefore all EventEmitter functions (on, once etc.) can be used with it.
*
* @param {String} url is the url for receiving inits.
* @param {Object} optionalInit is an optional init dictionary.
* @memberOf sse
*/
function EventSource(url, optionalInit) {
    var that = this,
        hooks;
    // weird problem with firefox (if I pass an invalid optionalInit)
    if (arguments.length === 2) {
        this.evtSrc = new window.EventSource(url, optionalInit);
    } else {
        this.evtSrc = new window.EventSource(url);
    }

    hooks = this.hooks = {};
    this.on('newListener', function (eventName, listener) {
        var evtSrc = that.evtSrc;
        if (!hooks[eventName]) {
            hooks[eventName] = function (e) {
                if (that.listeners(eventName).length > 0) {
                    that.emit(eventName, e);
                } else {
                    evtSrc.removeEventListener(hooks[eventName]);
                    delete hooks[eventName];
                }

            };
        }
        evtSrc.addEventListener(eventName, hooks[eventName]);
    });
}

EventSource.prototype = new events.EventEmitter();

/**
* Closes the vent source.
* @returns this.
* @type EventSource
*/
EventSource.prototype.close = function () {
    this.evtSrc.close();
    return this;
};

exports.EventSource = EventSource;
