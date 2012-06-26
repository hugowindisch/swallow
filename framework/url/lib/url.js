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
* @api private
*/
function parseQueryString(queryString, sep, eq) {
    sep = sep || '&';
    eq = eq || '=';
    var q = queryString.split(sep),
        ret = {};
    q.forEach(function (qs) {
        var qss = qs.split(eq),
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
* @api private
*/
function stringifyQueryObject(o, sep, eq) {
    sep = sep || '&';
    eq = eq || '=';
    var prop,
        ret = '';
    function format(p, v) {
        var i, l, vi, ret = '';
        if (v instanceof Array) {
            l = v.length;
            for (i = 0; i < l; i += 1) {
                vi = v[i];
                if (i > 0) {
                    ret += sep;
                }
                ret += p + eq + vi;
            }
        } else if (v !== '') {
            ret = p + eq + v;
        } else {
            ret = p;
        }
        return ret;
    }
    for (prop in o) {
        if (o.hasOwnProperty(prop)) {
            if (ret !== '') {
                ret += sep;
            }
            ret += format(prop, o[prop]);
        }
    }
    return ret;
}

/**
* Formats an urlObj (to produce a string)
* @param {String} urlObj. The url object to convert to a string.
* @returns The url string created from urlObj.
*/
function format(urlObj) {
    var path = '';
    if (urlObj.protocol) {
        path += urlObj.protocol + '//';
    }
    if (urlObj.auth) {
        path += urlObj.auth + '@';
    }
    if (urlObj.host) {
        path += urlObj.host;
    } else if (urlObj.hostname) {
        path += urlObj.hostname;
        if (urlObj.port) {
            path += ':' + urlObj.port;
        }
    }
    if (urlObj.pathname) {
        path += urlObj.pathname;
    }
    if (urlObj.search) {
        path += urlObj.search;
    } else if (urlObj.query) {
        path += '?' + stringifyQueryObject(urlObj.query);
    }
    if (urlObj.hash) {
        path += urlObj.hash;
    }
    return path;
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
    var re = /^((http:|https:|ftp:|file:)\/\/(([0-9a-zA-Z_\.:]+)@)*((([0-9a-zA-Z_\.])+)(:([0-9]+))?))?([^?;#]+)?(;[^?]*)?(\?[^#]*)?(#.*)?$/,
        match = re.exec(urlStr),
        protocol = match[2],
        auth = match[4],
        host = match[5],
        port = match[9],
        hostname = match[6],
        search = match[12],
        pathname = match[10],
        hash = match[13],
        ret = { };

    if (protocol) {
        protocol = protocol.toLowerCase();
        ret.protocol = protocol;
    }
    if (auth) {
        ret.auth = auth;
    }
    if (host) {
        host = host.toLowerCase();
        ret.host = host;
    }
    if (hostname) {
        hostname = hostname.toLowerCase();
        ret.hostname = hostname;
    }
    if (port) {
        ret.port = port;
    }
    if (search) {
        ret.search = search;
        ret.query = ret.search.slice(1);
        if (parseQS) {
            ret.query = parseQueryString(ret.query);
        }
    }
    if (pathname) {
        ret.pathname = pathname;
        ret.slashes = pathname.indexOf('/') !== -1;
        ret.path = pathname;
        if (search) {
            ret.path += search;
        }
    }
    if (hash) {
        ret.hash = hash;
    }
    ret.href = format(ret);

    return ret;
}

/**
* Resolves a relative url
* @param {String} from The origin url.
* @param {String} to The url relative to the origin url that should be returned.
* @returns The resolved url (a string).
*/
function resolve(from, to) {
    var tp = parse(to),
        fp = parse(from);

    delete fp.hostname;
    delete fp.query;
    if (tp.protocol || tp.host) {
        // not relative,
        return to;
    }
    if (tp.pathname) {
        if (tp.pathname[0] === '/') {
            fp.pathname = tp.pathname;
        } else {
            fp.pathname += '/' + tp.pathname;
        }
        fp.search = tp.search;
        fp.hash = tp.hash;
    } else if (tp.search) {
        fp.search = tp.search;
        fp.hash = tp.hash;
    } else if (tp.hash) {
        fp.hash = tp.hash;
    }
    return format(fp);
}

exports.parse = parse;
exports.format = format;
exports.resolve = resolve;
