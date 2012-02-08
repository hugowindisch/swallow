/**
    http.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/
/*
    Do XMLHttpRequest in a node fashion. No we don't get the same as
    what we have in Node, but yes, maybe, some of our code will work
    in both worlds unmodified.
*/

/*
Options
host: A domain name or IP address of the server to issue the request to.
port: Port of remote server.
method: A string specifying the HTTP request method. Possible values: 'GET' (default), 'POST', 'PUT', and 'DELETE'.
path: Request path. Should include query string and fragments if any. E.G. '/index.html?page=12'
headers: An object containing request headers.

unsupported:
-------------
agent: Controls Agent behavior. Possible values:
    undefined (default): use default Agent for this host and port.
    Agent object: explicitly use the passed in Agent.
    false: explicitly generate a new Agent for this host and port. Agent will not be re-used.
*/
var utils = require('utils'),
    events = require('events'),
    forEachProperty = utils.forEachProperty,
    readyStates = {
        unsent: 0,
        opened: 1,
        headersReceived: 2,
        loading: 3,
        done: 4
    };

function ClientResponse(headers, statusCode) {
    this.headers = headers;
    this.statusCode = statusCode;
    this.httpVersion = null;
    this.trailers = null;
}
ClientResponse.prototype = new (events.EventEmitter)();
ClientResponse.prototype.pause = function () {
    // not currently supported
};
ClientResponse.prototype.resume = function () {
    // not currently supported
};
ClientResponse.prototype.setEncoding = function () {
    // not currently supported
};   
    
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
            break;
        case readyStates.loading:        
            break;
        case readyStates.done:
            response.emit('data', this.responseText);
            response.emit('end');
            break;
        }
    };
}
ClientRequest.prototype = new (events.EventEmitter)();
ClientRequest.prototype.write = function (chunk) {
    if (this.toSend === null) {
        this.toSend = chunk;
    } else {
        this.toSend += chunk;
    }
};
ClientRequest.prototype.end = function (data) {
    var that = this;
    if (data) {
        this.toSend += data;
    }
    forEachProperty(this.options.headers, function (h, hn) {    
        that.request.setRequestHeader(hn, h);
    });
    this.request.send(this.toSend);
};
ClientRequest.prototype.abort = function () {
    this.request.abort();
};

function request(options, callback) {
    var ret = new ClientRequest(options);
    if (callback) {
        ret.on('response', callback);
    }
    return ret;
}

function get(options, callback) {
    options.method = 'GET';
    var ret = request(options, callback);
    ret.end();
    return ret;
}
exports.request = request;
exports.get = get;

