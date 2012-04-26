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
function forEach(array, f) {
    var l = array.length, i;
    for (i = 0; i < l; i += 1) {
        f(array[i], i, array);
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
function limitRange(n, minN, maxN, ifNaN) {
    n = Number(n);
    if (isNaN(n)) {
        n = (ifNaN === undefined) ? minN : ifNaN;
    } else if (n < minN) {
        n = minN;
    } else if (n > maxN) {
        n = maxN;
    }
    return n;
}
exports.forEachProperty = forEachProperty;
exports.forEach = forEach;
exports.typeOf = typeOf;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.deepCopy = deepCopy;
exports.limitRange = limitRange;
