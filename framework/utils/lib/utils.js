/**
    utils.js

        A bunch of javascript utilities.

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
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

function forEachSortedProperty(object, f, optionalSortFunction) {
    var a = [],
        l,
        i,
        n;
    function cmp(n1, n2) {
        return n1 > n2;
    }
    optionalSortFunction = optionalSortFunction || cmp;
    forEachProperty(object, function (p, name) {
        a.push(name);
    });
    l = a.length;
    if (l > 0) {
        a.sort(cmp);
        for (i = 0; i < l; i += 1) {
            n = a[i];
            f(object[n], n);
        }
    }
}

function forEach(array, f) {
    var l = array.length, i;
    for (i = 0; i < l; i += 1) {
        f(array[i], i, array);
    }
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

function apply(to, from) {
    forEachProperty(from, function (v, n) {
        to[n] = v;
    });
    return to;
}

function applyDeep(to, from) {
    forEachProperty(from, function (v, n) {
        to[n] = deepCopy(v);
    });
    return to;
}

function prune(o) {
    var n = 0;
    forEachProperty(o, function (p, name) {
        var empty;
        if (isObject(p)) {
            if (!prune(p)) {
                empty = true;
            }
        } else if (p === null || p === undefined) {
            empty = true;
        }
        if (empty) {
            delete o[name];
        } else {
            n += 1;
        }
    });
    return n;
}

// ensure(o, 'a', 'b', 'c') will make sure o.a.b.c exists and return it
function ensure(o) {
    var l = arguments.length, i, n, nextO;
    for (i = 1; i < l; i += 1) {
        n = String(arguments[i]);
        if (!o.hasOwnProperty(n)) {
            o = o[n] = {};
        } else {
            o = o[n];
        }
    }
    return o;
}

// checks if something is ensured and returns it (or null if it is not)
function ensured(o) {
    var l = arguments.length, i, n, nextO;
    for (i = 1; i < l; i += 1) {
        n = String(arguments[i]);
        if (!o.hasOwnProperty(n)) {
            return null;
        } else {
            o = o[n];
        }
    }
    return o;
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
exports.forEachSortedProperty = forEachSortedProperty;
exports.forEach = forEach;
exports.typeOf = typeOf;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.deepCopy = deepCopy;
exports.limitRange = limitRange;
exports.applyDeep = applyDeep;
exports.apply = apply;
exports.prune = prune;
exports.ensure = ensure;
exports.ensured = ensured;
