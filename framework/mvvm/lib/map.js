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
    object, // the actual model object to monitor
    propertyName, // the property name inside this object
    setViewValue, // update the view
    getViewValue //  (optional) get the value inside the view
) {
    this.bindings.push({
        object: object,
        popertyName: propertyName,
        setViewValue: setViewValue,
        getViewValue: getViewValue || function () {}
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
    var modelChange = false;
    forEach(this.bindings, function (v, i) {
        var o = v.object,
            propName = v.propName,
            vVal = v.getViewValue();
        if (vVal !== undefined && v.val !== vVal) {
            // the view value changed
            o[propName] = vVal;
            v.val = vVal;
            modelChange = true;
        }
    });
    return modelChange;
};
BindingMap.prototype.refreshView = function () {
    forEach(this.bindings, function (v, i) {
        var o = v.object,
            propName = v.propName,
            val = o[propName],
            vVal = v.getViewValue();
        // if the model value changed
        if (v.val !== val) {
            // update the view
            if (vVal !== val) {
                v.setViewValue(val);
                v.val = val;
            }
        }
    });
};
BindingMap.refresh = function () {
    var reg = BindingMap.registry;
    function refreshModel() {
        forEachProperty(reg, function (v, k) {
            v.refreshModel();
        });
    }
    function refreshView() {
        forEachProperty(reg, function (v, k) {
            v.refreshView();
        });
    }
    refreshModel();
    refreshView();
};
exports.BindingMap = BindingMap;