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

"use strict";
var parser = require('expression').parser,
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

    parser.yy = {
        scope: scope
    };
    test(assert.equal, parser.parse('2'), 2, "2");
    test(assert.equal, parser.parse('-3 + 2'), (-3 + 2), "(-3 + 2)");
    test(assert.equal, parser.parse('2 + 2'), (2 + 2), "2 + 2");
    test(assert.equal, parser.parse('2 + 2 * 3'), (2 + 2 * 3), "2 + 2 * 3");
    test(assert.equal, parser.parse('(2 + 2) * 3'), ((2 + 2) * 3), "((2 + 2) * 3)");
    test(assert.equal, parser.parse('"abcd"'), "abcd", "abcd");
    test(assert.deepEqual, parser.parse('[ 1, 2, 3]'), [ 1, 2, 3], "[1, 2, 3]");
    test(assert.equal, parser.parse('a'), scope.a, "scope.a");
    test(assert.equal, parser.parse('d(1, 2)'), scope.d(1, 2), "scope.d(1, 2)");
    test(assert.equal, parser.parse('o'), scope.o, "scope.o");
    //parser.parse('o["x"]');
    test(assert.equal, parser.parse('o.x'), scope.o.x, "scope.o.x");
    test(assert.equal, parser.parse('o.abc(a)'), scope.o.abc(scope.a), "scope.o.abc(scope.a)");
    test(assert.deepEqual, parser.parse('{ "a": 1, "b": 2 }'), { a: 1, b: 2 }, "{ a: 1, b: 2 }");
    //test(assert.equal, parser.parse('a ++'), scope.a++);
    test(assert.equal, parser.parse('[ 1, 2, 3].length'), [ 1, 2, 3].length, "[ 1, 2, 3].length");
    test(assert.equal, parser.parse('~3'), ~3, '~3');
    test(assert.equal, parser.parse('~3 + 4'), ~3 + 4, '~3 + 4');
    test(assert.equal, parser.parse('~3 + 4 -1 * 2 / 3 % 2'), ~3 + 4 -1 * 2 / 3 % 2, "~3 + 4 -1 * 2 / 3 % 2");
    test(assert.equal, parser.parse("1 && 123"), 1 && 123, "1 && 123");
    test(assert.equal, parser.parse("0 && 123"), 0 && 123, "0 && 123");
    test(assert.equal, parser.parse("1 || 123"), 1 || 123, "1 || 123");
    test(assert.equal, parser.parse("0 || 123"), 0 || 123, "0 || 123");

    // assignation tests
    scope.z = 0;
    parser.parse('z = 5');
    test(assert.equal, scope.z, 5);

    parser.parse('z += 3');
    test(assert.equal, scope.z, 8);

    parser.parse('z *= 2');
    test(assert.equal, scope.z, 16);

    done();

};
