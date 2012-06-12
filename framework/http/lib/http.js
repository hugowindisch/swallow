/**
    http.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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
* @constructor Constructs a client response.
* @param {Object} headers The http headers.
* @param {String} statusCode The status of the response.
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
* @returns {ClientResponse} this.
*/
ClientResponse.prototype.pause = function () {
    // not currently supported
    return this;
};

/**
* Resumes the response (not currently supported).
* @returns {ClientResponse} this.
*/
ClientResponse.prototype.resume = function () {
    // not currently supported
    return this;
};

/**
* Sets the encoding of the response (not currently supported).
* @returns {ClientResponse} this.
*/
ClientResponse.prototype.setEncoding = function () {
    // not currently supported
    return this;
};

/**
* @constructor Constructs a client request.
* @param {Object} options The options (host, port, method, path, headers)
* @param {String} statusCode The status of the response.
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
        //console.log('!!!' + this.readyState + ' ' + this.responseText.length);
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
* @returns {ClientRequest} this.
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
* @returns {ClientRequest} this.
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
* @returns {ClientRequest} this.
*/
ClientRequest.prototype.abort = function () {
    this.request.abort();
    return this;
};

/**
* Initiates an http request.
* @param {Object} options The options (host, port, method, path, headers)
* @param {Function} callback The optional callback.
* @returns {ClientRequest} this.
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
* @returns {ClientRequest} this.
*/
function get(options, callback) {
    options.method = 'GET';
    var ret = request(options, callback);
    ret.end();
    return ret;
}
exports.request = request;
exports.get = get;
