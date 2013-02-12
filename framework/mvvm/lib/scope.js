/**
    scope.js
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
var controller = require('./controller'),
    globalObject = {},
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty;
// We have the notion of binding scope
function Scope(object, withObject, parentScope) {
    this.parent = parentScope;
    this.object = object || globalObject;
    this.withObject = (this.parent && this.parent.withObject) || '';
    if (withObject) {
        this.withObject += ('/' + withObject);
    }
}
Scope.globalScope = new Scope(globalObject);

Scope.prototype.getListScope = function () {
    var scope = this;
    while (!scope.list) {
        scope = scope.parent;
    }
    return scope;
};
Scope.prototype.getTop = function () {
    var scope = this;
    while (scope.parent) {
        scope = scope.parent;
    }
    return scope;
};
Scope.prototype.getParent = function () {
    return this.parent;
};
// resolves a scope relative to the current scope with a with clause
Scope.prototype.resolveScope = function (w) {
    if (w === '') {
        return this;
    }
    if (typeof w === 'string') {
        w = w.split('/');
    }
    var p = w,
        res = {},
        varpath,
        scope = this;
    // resolves a variable
    forEach(p, function (rel, i) {
        if (rel === '..') {
            if (scope.getParent()) {
                scope = scope.getParent();
            } else {
                // invalid path!?!?!?
                throw new Error('Invalid path');
            }
        } else if (rel === '') {
            scope = scope.getTop();
        } else if (rel === '~') {
            // global scope
            scope = new Scope();
        } else if (rel !== '.') {
            // resolve to an scope
            scope = new Scope(scope.object, rel, scope);
        }
    });
    return scope;
};
Scope.prototype.resolveObject = function () {
    var rel = this.withObject.split('/').unshift(),
        o = this.object;
    forEach(rel, function (r) {
        var newo = o[rel];
        if (typeof newo !== 'object') {
            newo = o[rel] = {};
        }
        o = newo;
    });
    return o;
};

Scope.prototype.evaluate = function (compiledExpression) {
    var globals = {
        $parent: this.getParent(),
        $top: this.getTop(),
        $cnt: controller.controllers
    };
    return compiledExpression(this.resolveObject(), true, globals);
};
Scope.prototype.assign = function (compiledExpression, value) {
    // if the compiledExpression does not have a getScope, it cannot be assigned
    if (compiledExpression.getScope) {
        var globals = {
            $parent: this.getParent(),
            $top: this.getTop(),
            $cnt: controller.controllers
        };
        compiledExpression.getScope(this.resolveObject(), true, globals)[compiledExpression.variable] = value;
    }
};
exports.Scope = Scope;
