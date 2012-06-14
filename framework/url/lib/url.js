/**
    url.js
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
/*jslint regexp: false */

/*
* Parses the query string.
*/
function parseQueryString(queryString) {
    var q = queryString.split('&'),
        ret = {};
    q.forEach(function (qs) {
        var qss = qs.split('='),
            name = qss[0],
            value = qss[1];
        if (!ret[name]) {
            ret[name] = value;
        } else if (ret[name] instanceof Array) {
            ret[name].push(value);
        } else {
            ret[name] = [ ret[name], value];
        }
    });
    return ret;
}

/**
* Parses an url and returns an object with the following members: protocol,
* host, port, hostname, search, query (if parseQS),  pathname, slashes and
* href. The behavior is not guaranteed to be the same as Node.js in all
* circumstances.
* @param {String} urlStr The url to parse.
* @param {Booelean} parseQS true to parse the query string.
*/
function parse(urlStr, parseQS) {
    parseQS = parseQS || false;
    var re = /^((http:|https:|ftp:|file:)\/\/((([0-9a-zA-Z_\.])+)(:([0-9]+))?))?([^?;#]+)?(;[^?]*)?(\?[^#]*)?(#.*)?$/,
        match = re.exec(urlStr),
        protocol = match[2],
        host = match[3],
        port = match[7],
        hostname = match[4],
        search = match[10],
        pathname = match[8],
        href = '',
        ret = { };
    if (protocol) {
        ret.protocol = protocol;
        href += protocol;
    }
    if (host) {
        ret.host = host;
    }
    if (port) {
        ret.port = port;
    }
    if (hostname) {
        ret.hostname = hostname;
        href += hostname;
    }
    if (search) {
        ret.search = search;
        ret.query = ret.search.slice(1);
        if (parseQS) {
            ret.query = parseQueryString(ret.query);
        }
        href += search;
    }
    if (pathname) {
        ret.pathname = pathname;
        ret.slashes = pathname.indexOf('/') !== -1;
    }
    ret.href = href;

    // ret.slashes
    // ret.href: 'http://127.0.0.1:1337/static/editor.html?a=1&b=2'
    return ret;
}

/**
* Not currently supported.
*/
function format(urlObj) {
    throw new Error('not currently supported');
}

/**
* Not currently supported.
*/
function resolve(from, to) {
    throw new Error('not currently supported');
}

exports.parse = parse;
exports.format = format;
exports.resolve = resolve;
