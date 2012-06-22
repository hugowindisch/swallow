/**
    assert.js
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
//http://wiki.commonjs.org/wiki/Unit_Testing/1.1
/*jslint eqeqeq: false, nomen: false */
var xp;

function equal(o1, o2) {
    var p;
    if (typeof(o1) === 'object' && typeof(o2) === 'object') {
        if (o1 instanceof Date) {
            return (o2 instanceof Date) && o2.getTime() == o1.getTime();
        } else {
            // both objects
            if (typeof o2 !== 'object') {
                return false;
            }
            // same prototype
            //if (o2.__proto___ !== o1.__proto__) {
            //}
            // all properties of o1 in o2 and equal
            for (p in o1) {
                if (o1.hasOwnProperty(p)) {
                    if (!o2.hasOwnProperty(p) || !equal(o1[p], o2[p])) {
                        return false;
                    }
                }
            }
            // all properties of o2 in o1
            for (p in o2) {
                if (o2.hasOwnProperty(p)) {
                    if (!o1.hasOwnProperty(p)) {
                        return false;
                    }
                }
            }
            // if we reached this point, everything is fine
            return true;
        }
    } else {
        return o1 == o2;
    }
}

/**
* Constructs an assertion error.
*/
function AssertionError(o) {

    if (typeof o === 'object') {
        this.message = o.message;
        this.actual = o.actual;
        this.expected = o.expected;
        this.operator = o.operator;
    } else {
        // in node the assertion error has the properties but they are undefined
        this.message = this.actual = this.expected = this.operator = undefined;
    }
}
AssertionError.prototype = new Error();
AssertionError.prototype.toString = function () {
    // emulate node (a bit wtf)
    function toStr(a) {
        if (a === undefined) {
            return '"undefined"';
        } else if (typeof a === 'string') {
            return '"' + a + '"';
        } else {
            return String(a);
        }
    }
    if (this.message) {
        return 'AssertionError: ' + this.message;
    }
    return 'AssertionError: ' +
        toStr(this.actual) +
        ' ' +
        (this.operator || '') +
        ' ' +
        toStr(this.expected);
};

/**
* Throws an assertion error (not in the commonJS spec but supported by nodeJS).
*/
function fail(actual, expected, message, operator) {
    throw new AssertionError({
        message: message,
        actual: actual,
        expected: expected,
        operator: operator
    });
}

/**
* Fails if the specified guard is not true (by throwing an AssertionError).
*/
function ok(guard, msgOpt) {
    if (!guard) {
        fail(false, true, msgOpt, '==');
    }
}

xp = ok;
xp.ok = ok;

xp.fail = fail;

/**
* Tests equality.
*/
xp.equal = function (actual, expected, msgOpt) {
    if ((actual == expected) === false) {
        fail(actual, expected, msgOpt, '==');
    }
};

/**
* Tests inequality.
*/
xp.notEqual = function (actual, expected, msgOpt) {
    if ((actual != expected) === false) {
        fail(actual, expected, msgOpt, '!=');
    }
};

/**
* Tests deep equality.
*/
xp.deepEqual = function (actual, expected, msgOpt) {
    if (equal(actual, expected) === false) {
        fail(actual, expected, msgOpt, 'deepEqual');
    }
};

/**
* Tests deep ineequality.
*/
xp.notDeepEqual = function (actual, expected, msgOpt) {
    if (equal(actual, expected)) {
        fail(actual, expected, msgOpt, 'notDeepEqual');
    }
};

/**
* Tests strict equality.
*/
xp.strictEqual = function (actual, expected, msgOpt) {
    if ((actual === expected) === false) {
        fail(actual, expected, msgOpt, '===');
    }
};

/**
* Tests strict inequality.
*/
xp.notStrictEqual = function (actual, expected, msgOpt) {
    if ((actual !== expected) === false) {
        fail(actual, expected, msgOpt, '!==');
    }
};

/**
* Checks that the specified function throws something.
*/
xp.throws = function (block, errorOpt, msgOpt) {
    var err, to;
    try {
        block();
    } catch (e) {
        to = typeof errorOpt;
        err = e;
        if (to === 'function') {
            if (errorOpt(e) !== true && !(e instanceof errorOpt)) {
                throw e;
            }
        } else if (to === 'object' && (errorOpt instanceof RegExp)) {
            if (!errorOpt.test(String(e))) {
                throw e;
            }
        }
    }
    if (!err) {
        fail("Missing expected exception." + (msgOpt ? (" " + msgOpt) : "."));
    }
};

/**
* Tests if value is not a false value.
*/
xp.ifError = function (v) {
    if (v) {
        return v;
    }
};

/**
* Checks that the specified function does not throw anything.
*/
xp.doesNotThrow = function (block, errorOpt, msgOpt) {
    var to;
    try {
        block();
    } catch (e) {
        to = typeof errorOpt;
        if (to === 'function') {
            if (errorOpt(e) === true || (e instanceof errorOpt)) {
                fail("Got unwanted exception." + (msgOpt ? (" " + msgOpt) : "."));
            }
        } else if (to === 'object' && (errorOpt instanceof RegExp)) {
            if (errorOpt.test(String(e))) {
                fail("Got unwanted exception." + (msgOpt ? (" " + msgOpt) : "."));
            }
        }
        throw e;
    }
};

/// exports
module.exports = xp;
