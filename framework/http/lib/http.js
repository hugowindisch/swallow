/**
    http.js
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
var utils = require('utils'),
    events = require('events'),
    update = require('visual').update,
    forEachProperty = utils.forEachProperty,
    readyStates = {
        unsent: 0,
        opened: 1,
        headersReceived: 2,
        loading: 3,
        done: 4
    };

/**
* This package provides implements the request and get methods in a way
* very similar to nodejs. Not all nodejs features are supported.
* @package http
*/


/**
* Constructs a client response.
* @param {Object} headers The http headers.
* @param {String} statusCode The status of the response.
* @memberOf http
*/
function ClientResponse(headers, statusCode) {
    this.headers = headers;
    this.statusCode = statusCode;
    this.httpVersion = null;
    this.trailers = null;
}

ClientResponse.prototype = new (events.EventEmitter)();

/**
* Pauses the response (not currently supported).
* @returns this.
* @type ClientResponse
*/
ClientResponse.prototype.pause = function () {
    // not currently supported
    return this;
};

/**
* Resumes the response (not currently supported).
* @returns this.
* @type ClientResponse
*/
ClientResponse.prototype.resume = function () {
    // not currently supported
    return this;
};

/**
* Sets the encoding of the response (not currently supported).
* @returns this.
* @type ClientResponse
*/
ClientResponse.prototype.setEncoding = function () {
    // not currently supported
    return this;
};

/**
* Constructs a client request.
* @param {Object} options The options (host, port, method, path, headers)
* @param {String} statusCode The status of the response.
* @memberOf http
*/
function ClientRequest(options) {
    var url = '',
        that = this,
        response;

    if (options.host) {
        url += options.host;
        if (options.port) {
            url = url + ':' + options.port;
        }
    }
    if (options.path) {
        url = url + options.path;
    }
    this.options = options;
    this.request = new XMLHttpRequest();
    this.toSend = null;
    try {
        this.request.open(
            options.method,
            url,
            true
        );
    } catch (e) {
        setTimeout(function () {
            that.emit('error', e);
        }, 0);
    }
    function parseHeaders(headers) {
        var arr = headers.split('\n'),
            l = arr.length,
            i,
            nv,
            res = {};
        for (i = 0; i < l; i += 1) {
            nv = arr[i].split(' ');
            res[nv[0].slice(0, -1)] = nv[1];
        }
        return res;
    }
    this.request.onreadystatechange = function () {
        switch (this.readyState) {
        case readyStates.unsent:
            break;
        case readyStates.opened:
            break;
        case readyStates.headersReceived:
            response = new ClientResponse(
                parseHeaders(this.getAllResponseHeaders()),
                this.status
            );
            that.emit('response', response);
            update();
            break;
        case readyStates.loading:
            break;
        case readyStates.done:
            if (!response) {
                response = new ClientResponse(null, this.status);
            }
            response.emit('data', this.responseText);
            response.emit('end');
            update();
            break;
        }
    };
}

ClientRequest.prototype = new (events.EventEmitter)();

/**
* Writes to the request.
* @param {String} chunk The data to write.
* @returns this.
* @type ClientRequest
*/
ClientRequest.prototype.write = function (chunk) {
    if (this.toSend === null) {
        this.toSend = chunk;
    } else {
        this.toSend += chunk;
    }
    return this;
};

/**
* Ends the request.
* @param {String} data Optional data to write.
* @returns this.
* @type ClientRequest
*/
ClientRequest.prototype.end = function (data) {
    var that = this;
    if (data !== undefined) {
        this.write(data);
    }
    forEachProperty(this.options.headers, function (h, hn) {
        that.request.setRequestHeader(hn, h);
    });
    this.request.send(this.toSend);
    return this;
};

/**
* Aborts the request.
* @returns this.
* @type ClientRequest
*/
ClientRequest.prototype.abort = function () {
    this.request.abort();
    return this;
};

/**
* Initiates an http request.
* @param {Object} options The options (host, port, method, path, headers)
* @param {Function} callback The optional callback.
* @returns A new ClientRequest
* @type ClientRequest
* @memberOf http
*/
function request(options, callback) {
    var ret = new ClientRequest(options);
    if (callback) {
        ret.on('response', callback);
    }
    return ret;
}

/**
* Initiates an http get.
* @param {Object} options The options (host, port, method, path, headers)
* @param {Function} callback The optional callback.
* @returns A new ClientRequest
* @type ClientRequest
* @memberOf http
*/
function get(options, callback) {
    options.method = 'GET';
    var ret = request(options, callback);
    ret.end();
    return ret;
}
exports.request = request;
exports.get = get;
