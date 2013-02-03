/**
    exp.js
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
var expression = require('./expression'),
    parser = expression.parser;
function parse(expression) {
    var cxt = {
        },
        parsed;
    parser.yy = {};
    parser.yy.getScope = function () {
        return cxt;
    };
    parser.yy.resolve = function (getScope, variable) {
        return function () {
            return getScope()[variable];
        };
    };
    parser.yy.constant = function (c) {
        return function () {
            return c;
        };
    };
    parsed = parser.parse(expression);
    return function (scope) {
        cxt = scope;
        return parsed();
    };
}
exports.parse = parse;
exports.exec = function (expression, scope) {
    return parse(expression)(scope);
};

/*console.log(parse('2 + 2')({}));
console.log(exports.exec('{ "a": 1, "b": 2 }', {}));
console.log(exports.exec('d(1,2)', { d: function (a, b) { return a + b; } }));*/
