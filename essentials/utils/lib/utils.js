/**
    utils.js

        A bunch of javascript utilities.

    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/
exports.forEachProperty = function (object, f) {
    var p;
    if (object) {
        for (p in object) {
            if (object.hasOwnProperty(p)) {
                f(object[p], p, object);
            }
        }
    }
};
function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}
exports.typeOf = typeOf;

exports.isString = function (s) {
    return typeOf(s) === 'string';
};
exports.isNumber = function (n) {
    return typeOf(n) === 'number';
};
exports.isArray = function (a) {
    return typeOf(a) === 'array';
};
exports.isObject = function (o) {
    return typeOf(o) === 'object';
};
exports.isFunction = function (f) {
    return typeOf(f) === 'function';
};

