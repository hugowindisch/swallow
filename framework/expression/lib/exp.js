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
        parsed,
        globalScope,
        assignmentsAllowed;
    parser.yy = {};
    parser.yy.getScope = function () {
        return cxt;
    };
    parser.yy.resolve = function (getScope, variable) {
        function res() {
            return getScope()[variable];
        }
        res.getScope = getScope;
        res.variable = variable;
        return res;
    };
    parser.yy.resolveGlobal = function (getScope, variable) {
        function res() {
            var ret = getScope()[variable];
            if (ret === undefined) {
                ret = globalScope[variable];
            }
            return ret;
        }
        res.getScope = getScope;
        res.variable = variable;
        return res;
    };
    parser.yy.constant = function (c) {
        return function () {
            return c;
        };
    };
    parser.yy.assignment = function (f) {
        return function () {
            if (assignmentsAllowed) {
                return f();
            }
            // throw?
            return 0;
        };
    };
    parsed = parser.parse(expression);
    function exec(scope, allowAssignments, globalScopeObject) {
        assignmentsAllowed = Boolean(allowAssignments);
        globalScope = globalScopeObject || {};
        cxt = scope;
        return parsed();
    }
    // allow to deal with lvalues from the outside
    if (parsed.getScope) {
        exec.getScope = function (scope, allowAssignments, globalScopeObject) {
            assignmentsAllowed = Boolean(allowAssignments);
            globalScope = globalScopeObject || {};
            cxt = scope;
            return parsed.getScope();
        };
        exec.variable = parsed.variable;
    }
    return exec;
}
exports.parse = parse;
exports.exec = function (expression, scope, allowAssignments, globalScopeObject) {
    return parse(expression)(scope, allowAssignments, globalScopeObject);
};

/*console.log(parse('2 + 2')({}));
console.log(exports.exec('{ "a": 1, "b": 2 }', {}));
console.log(exports.exec('d(1,2)', { d: function (a, b) { return a + b; } }));*/
