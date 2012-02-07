/**
    utils.js

        A bunch of javascript utilities.

    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/
function forEachProperty(object, f) {
    var p;
    if (object) {
        for (p in object) {
            if (object.hasOwnProperty(p)) {
                f(object[p], p, object);
            }
        }
    }
}
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
function isString(s) {
    return typeOf(s) === 'string';
}
function isNumber(n) {
    return typeOf(n) === 'number';
}
function isArray(a) {
    return typeOf(a) === 'array';
}
function isObject(o) {
    return typeOf(o) === 'object';
}
function isFunction(f) {
    return typeOf(f) === 'function';
}
function deepCopy(o) {
    var res, i, l, v;
    switch (typeOf(o)) {
    case 'object': 
        res = {};
        forEachProperty(o, function (p, n) {
            res[n] = deepCopy(p);
        });
        return res;
    case 'array':
        res = [];
        l = o.length;
        for (i = 0; i < l; i += 1) {
            v = o[i];
            if (v !== undefined) {
                res[i] = deepCopy(v);
            }
        }
        return res;
    default:
        return o;
    }
}
exports.forEachProperty = forEachProperty;
exports.typeOf = typeOf;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.deepCopy = deepCopy;

