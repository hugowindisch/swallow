/**
    test.js
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
var assert = require('../lib/assert');

exports.run = function (test, done) {
    function testAssert() {
        // assert false
        function assertFalse(v) {
            try {
                assert(false);
            } catch (e) {
                test(
                    assert.strictEqual,
                    String(e),
                    'AssertionError: false == true'
                );
            }
        }
        // assert false
        assertFalse(undefined);
        assertFalse(null);

        // assert true
        test(assert, true);
        test(assert, 1);
        test(assert, "1");
        test(assert, "0");

    }
    function testOk() {
        test(
            assert.strictEqual,
            assert,
            assert.ok
        );
    }
    function testFail() {
        //xp.fail = fail;
        // asserFail
        function assertFail(actual, expected, message, operator, msg) {
            try {
                assert.fail(actual, expected, message, operator);
            } catch (e) {
                test(
                    assert.strictEqual,
                    String(e),
                    msg
                );
            }
        }
        // test failures
        assertFail('1', '2', null, 'abc', 'AssertionError: "1" abc "2"');
        assertFail('1', '2', null, null, 'AssertionError: "1"  "2"');
        assertFail('1', '2', null, undefined, 'AssertionError: "1"  "2"');
        assertFail('1', '2', 'hello', 'abc', 'AssertionError: hello');
    }
    function testEqual() {
        function fail(actual, expected, msgOpt, msg) {
            try {
                assert.equal(actual, expected, msgOpt);
            } catch (e) {
                test(
                    assert.strictEqual,
                    String(e),
                    msg
                );
            }
        }
        fail(1, 2, null, 'AssertionError: 1 == 2');
        fail(1, 2, 'hello', 'AssertionError: hello');
        fail(undefined, 0, null, 'AssertionError: "undefined" == 0');
        fail(null, 0, null, 'AssertionError: null == 0');
        test(assert.equal, undefined, null);
        test(assert.equal, '1', '1');
        test(assert.equal, 1, "1");
        test(assert.equal, 1, Number(1));
        //test(assert.equal, 1, new Number(1));
    }
    function testNotEqual() {
        //xp.notEqual = function (actual, expected, msgOpt) {
        function fail(actual, expected, msgOpt, msg) {
            try {
                assert.notEqual(actual, expected, msgOpt);
            } catch (e) {
                test(
                    assert.strictEqual,
                    String(e),
                    msg
                );
            }
        }
        fail(1, '1', null, 'AssertionError: 1 != "1"');
        fail(1, Number(1), null, 'AssertionError: 1 != 1');
        fail(undefined, null, null, 'AssertionError: "undefined" != null');
        test(assert.notEqual, 1, 2);
        test(assert.notEqual, null, 0);
        test(assert.notEqual, undefined, 0);
    }
    function testDeepEqual() {
        //xp.deepEqual = function (actual, expected, msgOpt) {
        test(
            assert.deepEqual,
            { a: 2, b: 'abc', c: undefined, d: null, e: { a: 1, b: 2}},
            { a: 2, b: 'abc', c: undefined, d: null, e: { a: 1, b: 2}}
        );
    }
    function testNotDeepEqual() {
        //xp.notDeepEqual = function (actual, expected, msgOpt) {
        test(
            assert.notDeepEqual,
            { a: 2, b: 'abc', c: undefined, d: null, e: { a: 1, b: 3}},
            { a: 2, b: 'abc', c: undefined, d: null, e: { a: 1, b: 2}}
        );
    }
    function testStrictEqual() {
        //xp.strictEqual = function (actual, expected, msgOpt) {
        function fail(actual, expected, msgOpt, msg) {
            try {
                assert.strictEqual(actual, expected, msgOpt);
            } catch (e) {
                test(
                    assert.strictEqual,
                    String(e),
                    msg
                );
            }
        }
        fail(1, 2, null, 'AssertionError: 1 === 2');
        fail(1, 2, 'hello', 'AssertionError: hello');
        fail(undefined, 0, null, 'AssertionError: "undefined" === 0');
        fail(null, 0, null, 'AssertionError: null === 0');
        fail(undefined, null, null, 'AssertionError: "undefined" === null');
        //fail(1, new Number(1), null, 'AssertionError: 1 === 1');
        fail(1, "1", null, 'AssertionError: 1 === "1"');
        test(assert.strictEqual, '1', '1');
        test(assert.strictEqual, 1, 1);
        test(assert.strictEqual, 1, Number(1));
    }
    function testNotStrictEqual() {
        //xp.notStrictEqual = function (actual, expected, msgOpt) {
        function fail(actual, expected, msgOpt, msg) {
            try {
                assert.notStrictEqual(actual, expected, msgOpt);
            } catch (e) {
                test(
                    assert.strictEqual,
                    String(e),
                    msg
                );
            }
        }
        fail(1, 1, null, 'AssertionError: 1 !== 1');
        fail(1, Number(1), null, 'AssertionError: 1 !== 1');
        test(assert.notStrictEqual, NaN, NaN);
        test(assert.notStrictEqual, null, undefined);
        test(assert.notStrictEqual, 1, '1');
        test(assert.notStrictEqual, null, 0);
        test(assert.notStrictEqual, undefined, 0);
    }
    function testThrows() {
        //xp.throws = function (block, Error_opt, msgOpt) {
        function willThrow(f, cond, msgOpt, err) {
            try {
                assert.throws(f, cond, msgOpt);
            } catch (e) {
                test(assert.strictEqual, String(e), err);
            }
        }
        test(
            assert.throws,
            function () {
                throw new Error('abc');
            }
        );
        test(
            assert.throws,
            function () {
                throw new Error('abc');
            },
            /Error/
        );
        test(
            assert.throws,
            function () {
                throw new Error('abc');
            },
            Error
        );
        test(
            assert.throws,
            function () {
                throw new Error('abc');
            },
            function () {
                return true;
            }
        );
        willThrow(
            function () {},
            undefined,
            null,
            'AssertionError: "Missing expected exception.."  "undefined"'
        );
        willThrow(
            function () {},
            undefined,
            "hello",
            'AssertionError: "Missing expected exception. hello"  "undefined"'
        );
        willThrow(
            function () {
                throw new Error('abc');
            },
            /Errorrr/,
            undefined,
            'Error: abc'
        );
    }
    function testIfError() {
        //xp.ifError = function () {
        test(assert.strictEqual, assert.ifError(0), undefined);
        test(assert.strictEqual, assert.ifError(false), undefined);
        test(assert.strictEqual, assert.ifError(null), undefined);
        test(assert.strictEqual, assert.ifError(undefined), undefined);
        test(assert.strictEqual, assert.ifError(true), true);
        test(assert.strictEqual, assert.ifError('abc'), 'abc');
    }
    function testDoesNotThrow() {
        //xp.doesNotThrow = function () {
        function willThrow(f, cond, msgOpt, err) {
            try {
                assert.doesNotThrow(f, cond, msgOpt);
            } catch (e) {
                test(assert.strictEqual, String(e), err);
            }
        }
        test(
            assert.doesNotThrow,
            function () {}
        );
        willThrow(
            function () {
                throw new Error('abc');
            },
            undefined,
            undefined,
            'Error: abc'
        );
        willThrow(
            function () {
                throw new Error('abc');
            },
            /Error/,
            undefined,
            'AssertionError: "Got unwanted exception.."  "undefined"'
        );
        willThrow(
            function () {
                throw new Error('abc');
            },
            /Error/,
            'hello',
            'AssertionError: "Got unwanted exception. hello"  "undefined"'
        );
        willThrow(
            function () {
                throw new Error('abc');
            },
            /Errorrr/,
            undefined,
            'Error: abc'
        );
        willThrow(
            function () {
                throw new Error('abc');
            },
            function () {
                return true;
            },
            'hello',
            'AssertionError: "Got unwanted exception. hello"  "undefined"'
        );
        willThrow(
            function () {
                throw new Error('abc');
            },
            Error,
            'hello',
            'AssertionError: "Got unwanted exception. hello"  "undefined"'
        );

    }

    // run the tests
    testAssert();
    testOk();
    testFail();
    testEqual();
    testNotEqual();
    testDeepEqual();
    testNotDeepEqual();
    testStrictEqual();
    testNotStrictEqual();
    testThrows();
    testIfError();
    testDoesNotThrow();

    // we don't want async testing and will never call done
    done();
};
