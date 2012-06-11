/**
    url.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*jslint regexp: false */

// note: this is really not what it should be...
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

function format(urlObj) {
    throw new Error('not currently supported');
//    return urlObj.protocol + urlObj.host + urlObj
}

function resolve(from, to) {
    throw new Error('not currently supported');
}

exports.parse = parse;
exports.format = format;
exports.resolve = resolve;
