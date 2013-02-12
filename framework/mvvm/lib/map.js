/**
    map.js
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
var utils = require('utils'),
    expression = require('expression'),
    isArray = utils.isArray,
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty;
// each object
function BindingMap() {
    this.bindings = [];
    this.id = BindingMap.id;
    BindingMap.id += 1;
}
BindingMap.id = 0;
BindingMap.registry = {};
BindingMap.prototype.bind = function (
    scope, // the actual model object to monitor
    expr, // the property name inside this object
    setViewValue, // update the view
    getViewValue, //  (optional) get the value inside the view
    synchronizeList
) {
    this.bindings.push({
        scope: scope,
        compiledExpression: expression.parse(expr),
        setViewValue: setViewValue,
        getViewValue: getViewValue,
        synchronizeList: synchronizeList
    });
};

BindingMap.prototype.clear = function () {
    this.bindings = [];
};

BindingMap.prototype.register = function () {
    BindingMap.registry[this.id] = this;
    return this;
};

BindingMap.prototype.unregister = function () {
    delete BindingMap.registry[this.id];
    return this;
};
BindingMap.prototype.refreshModel = function () {
    forEach(this.bindings, function (v, i) {
        if (v.getViewValue) {
            var scope = v.scope,
                compiledExpression = v.compiledExpression,
                vVal = v.getViewValue();
            // if the view value changed this view
            // should refresh the model
            if (v.val !== undefined && vVal !== undefined && v.vVal !== vVal) {
                // the view value changed
                scope.assign(compiledExpression, vVal);
                v.val = vVal;
                v.vVal = vVal;
            }
        }
    });
};
BindingMap.prototype.refreshListView = function () {
    forEach(this.bindings, function (v, i) {
        var scope, propName, val, vVal;
        if (v.synchronizeList) {
            scope = v.scope;
            val = scope.evaluate(v.compiledExpression);
            if (val === undefined) {
                val = [];
                scope.assign(v.compiledExpression, val);
            }
            if (isArray(val)) {
                v.synchronizeList(val);
            }
        }
    });
};
BindingMap.prototype.refreshView = function () {
    forEach(this.bindings, function (v, i) {
        var o, propName, val, vVal;
        if (v.setViewValue) {
            val = v.scope.evaluate(v.compiledExpression);
            if (val === undefined) {
                val = 0;
                v.scope.assign(v.compiledExpression, val);
            }
            // if the model value changced
            if (v.val !== val) {
                // update the view
                if (v.vVal !== val) {
                    v.setViewValue(val);
                    v.vVal = v.getViewValue ? v.getViewValue() : val;
                }
                v.val = val;
            }
        }
    });
};
/*
1. resolve the SCOPES themselves

expressions:
------------
(magic globals)
    $parent.
    $top.
    $topmost.
    + all controllers

*/
BindingMap.refresh = function () {
    var reg = BindingMap.registry;
    forEachProperty(reg, function (v, k) {
        v.refreshModel();
    });
    forEachProperty(reg, function (v, k) {
        v.refreshListView();
    });
    forEachProperty(reg, function (v, k) {
        v.refreshView();
    });
};
exports.BindingMap = BindingMap;
