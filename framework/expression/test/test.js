/**
    test.js
    Copyright (C) 2013 Hugo Windisch

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

"use strict";
var exec = require('expression').exec,
    parse = require('expression').parse,
    assert = require('assert'),
    scope = {
        a: 1,
        b: 2,
        c: 3,
        d: function (e, f) {
            return e + f;
        },
        o: { x: 3, abc: function (n) { return 12345; } }
    };

exports.run = function (test, done) {

    test(assert.equal, exec('2', scope), 2, "2");
    test(assert.equal, exec('-3 + 2', scope), (-3 + 2), "(-3 + 2)");
    test(assert.equal, exec('2 + 2', scope), (2 + 2), "2 + 2");
    test(assert.equal, exec('2 + 2 * 3', scope), (2 + 2 * 3), "2 + 2 * 3");
    test(assert.equal, exec('(2 + 2) * 3', scope), ((2 + 2) * 3), "((2 + 2) * 3)");
    test(assert.equal, exec('"abcd"', scope), "abcd", "abcd");
    test(assert.deepEqual, exec('[ 1, 2, 3]', scope), [ 1, 2, 3], "[1, 2, 3]");
    test(assert.equal, exec('a', scope), scope.a, "scope.a");
    test(assert.equal, exec('d(1, 2)', scope), scope.d(1, 2), "scope.d(1, 2)");
    test(assert.equal, exec('o', scope), scope.o, "scope.o");
    //exec('o["x"]');
    test(assert.equal, exec('o.x', scope), scope.o.x, "scope.o.x");
    test(assert.equal, exec('o.abc(a)', scope), scope.o.abc(scope.a), "scope.o.abc(scope.a)");
    test(assert.deepEqual, exec('{ "a": 1, "b": 2 }', scope), { a: 1, b: 2 }, "{ a: 1, b: 2 }");
    test(assert.deepEqual, exec('{ a: 1, b: 2 }', scope), { a: 1, b: 2 }, "{ a: 1, b: 2 }");
    //test(assert.equal, exec('a ++'), scope.a++);
    test(assert.equal, exec('[ 1, 2, 3].length', scope), [ 1, 2, 3].length, "[ 1, 2, 3].length");
    test(assert.equal, exec('~3', scope), ~3, '~3');
    test(assert.equal, exec('~3 + 4', scope), ~3 + 4, '~3 + 4');
    test(assert.equal, exec('~3 + 4 -1 * 2 / 3 % 2', scope), ~3 + 4 -1 * 2 / 3 % 2, "~3 + 4 -1 * 2 / 3 % 2");
    test(assert.equal, exec("1 && 123", scope), 1 && 123, "1 && 123");
    test(assert.equal, exec("0 && 123", scope), 0 && 123, "0 && 123");
    test(assert.equal, exec("1 || 123", scope), 1 || 123, "1 || 123");
    test(assert.equal, exec("0 || 123", scope), 0 || 123, "0 || 123");

    // assign when assignments are not enabled
    scope.z = 0;
    exec('z = 5', scope);
    test(assert.notEqual, scope.z, 5);

    // assignation tests
    scope.z = 0;
    exec('z = 5', scope, true);
    test(assert.equal, scope.z, 5);

    exec('z += 3', scope, true);
    test(assert.equal, scope.z, 8);

    exec('z *= 2', scope, true);
    test(assert.equal, scope.z, 16);

    // test a globalscope object
    test(assert.equal, exec('$myscope.z', scope, false, { $myscope: { z : 124 } }), 124, "$myscope.z");

    // test that we have an lvalue if we evaluate a variable
    (function () {
        var v = parse('z');
        test(assert.ok, v.getScope, 'lvalue');
        // we found the right scope for the variable
        test(assert.equal, v.getScope(scope, false, {}), scope);
        // we found the right variable name
        test(assert.equal, v.variable, 'z');
    }());

    done();

};
