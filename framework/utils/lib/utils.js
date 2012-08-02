/**
    utils.js
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

/**
* This package implements various utility functions.
*
* @package utils
*/

/**
* Returns the type of a vlue, correctly distinguishing between object and array.
* @param {any} value The value we want to inspect.
* @returns The type of the value.
* @type String
* @memberOf utils
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

/**
* Returns true if is is a string.
* @param {any} s The value to inspect.
* @returns true if s is a string.
* @type Boolean
* @memberOf utils
*/
function isString(s) {
    return typeOf(s) === 'string';
}

/**
* Returns true if is is a number.
* @param {any} n The value to inspect.
* @returns true if s is a number.
* @type Boolean
* @memberOf utils
*/
function isNumber(n) {
    return typeOf(n) === 'number';
}

/**
* Returns true if is is an array.
* @param {any} a The value to inspect.
* @returns true if s is an array.
* @type Boolean
* @memberOf utils
*/
function isArray(a) {
    return typeOf(a) === 'array';
}

/**
* Returns true if is is an object.
* @param {any} o The value to inspect.
* @returns true if s is an object.
* @type Boolean
* @memberOf utils
*/
function isObject(o) {
    return typeOf(o) === 'object';
}

/**
* Returns true if is is a function.
* @param {any} f The value to inspect.
* @returns true if s is a function.
* @type Boolean
* @memberOf utils
*/
function isFunction(f) {
    return typeOf(f) === 'function';
}

/**
* Enumerates the object calling f for each (value, name) pair.
* @param {Ojbect} object The object to iterate.
* @param {Function} f The callback to call for each (value, name) pair.
* @memberOf utils
*/
function forEachProperty(object, f) {
    var p;
    if (object) {
        for (p in object) {
            if (object.hasOwnProperty(p)) {
                if (f(object[p], p, object) === true) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
* Enumerates the object calling f for each (value, name) pair in sorted
* order of name.
* @param {Ojbect} object The object to iterate.
* @param {Function} f The callback to call for each (value, name) pair.
* @param {Function} optionalSortFunction An optional sorting function.
* @memberOf utils
*/

function forEachSortedProperty(object, f, optionalSortFunction) {
    var a = [],
        l,
        i,
        n;
    function cmp(n1, n2) {
        if (n1 > n2) {
            return 1;
        } else if (n1 < n2) {
            return -1;
        }
        return 0;
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
            if (f(object[n], n) === true) {
                return true;
            }
        }
    }
    return false;
}

/**
* Enumerates the array calling f for each (value, index) pair.
* @param {Ojbect} array The array to iterate.
* @param {Function} f The callback to call for each (value, index) pair.
* @memberOf utils
*/
function forEach(array, f) {
    var l = array.length, i;
    for (i = 0; i < l; i += 1) {
        if (f(array[i], i, array) === true) {
            return true;
        }
    }
    return false;
}

/**
* Returns a deep copy of object o.
* @param {any} o The object (or value) to copy.
* @returns A copy of the value.
* @type any
* @memberOf utils
*/
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

/**
* Deeply tests strict equality between two objects
* @param {any} o1 The first object.
* @param {any} o2 The second object.
* @memberOf utils
* @type Boolean
* @returns Strict equality between two objects.
*/
function deepEqual(o1, o2) {
    function eqa(a1, a2) {
        var l = a1.length, i;
        if (l === a2.length) {
            for (i = 0; i < l; i += 1) {
                if (!deepEqual(a1[i], a2[i])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    function eqo(o1, o2) {
        var v, tested = {};
        for (v in o1) {
            if (o1.hasOwnProperty(v) && o2.hasOwnProperty(v)) {
                if (!deepEqual(o1[v], o2[v])) {
                    return false;
                }
                tested[v] = true;
            }
        }
        for (v in o2) {
            if (o2.hasOwnProperty(v) && !tested[v]) {
                return false;
            }
        }
        return true;
    }

    function de(o1, o2) {
        switch (typeOf(o1)) {
        case 'object':
        case 'array':
            return eqa(o1, o2);
        default:
            return o1 === o2;
        }
    }
    return typeOf(o1) === typeOf(o2) && de(o1, o2);
}

/**
* Copies all property of from to to
* @param {Object} from The from object.
* @param {Object} to The to object.
* @type Object
* @memberOf utils
*/
function apply(to, from) {
    forEachProperty(from, function (v, n) {
        to[n] = v;
    });
    return to;
}

/**
* Copies all property of from to to by calling deepCopy on all copied values.
* @param {Object} from The from object.
* @param {Object} to The to object.
* @type Object
* @memberOf utils
*/
function applyDeep(to, from) {
    forEachProperty(from, function (v, n) {
        to[n] = deepCopy(v);
    });
    return to;
}

/**
* Returns the keys.
* @param {Object} from The from object.
* @type Array
* @memberOf utils
*/
function keys(from) {
    var ks = [];
    forEachProperty(from, function (o, k) {
        ks.push(k);
    });
    return ks;
}

/**
* Recursively removes undefined an null properties from an object.
* @param {Object} o The object to prune.
* @returns The number of remaining properties in o
* @type Number
* @memberOf utils
*/
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

/**
* ensure(o, 'a', 'b', 'c') will make sure o.a.b.c exists and return it
* @returns The modified object.
* @type Object
* @memberOf utils
*/
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

/**
* ensure(o, 'a', 'b', 'c') will make sure o.a.b.c exists and return it
* @returns The found value or null
* @type any
* @memberOf utils
*/
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

/**
* Limits the range of a number.
* @param {Number} n The number to modify
* @param {Number} minN The minimum value of n.
* @param {Number} maxN The maximum value of n.
* @param {Number} ifNaN The value to use if isNaN(n).
* @returns The limited number.
* @type Number
* @memberOf utils
*/
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
exports.deepEqual = deepEqual;
exports.limitRange = limitRange;
exports.applyDeep = applyDeep;
exports.apply = apply;
exports.keys = keys;
exports.prune = prune;
exports.ensure = ensure;
exports.ensured = ensured;
