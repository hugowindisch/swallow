/**
    mvvm.js
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

/*
 the goal is to bring knockoutjs-like features to swallow so that

We want to:
-  be able to bind visual object attributes to model variables
- expose bindings in property sheets
- load a model from a server (so from the editor, we coud configure our bindings
setup our url save the thing and tada, zero programming
- probably have a notion of 'filter' (a way of remapping property names...
not certain about this one)

- Writing models by hand: this is nice...
- Writing models by 'instrumenting' a normal object

Monitoring mechanism
====================
Options:
a) observables
--------------

b) something more complicated
-----------------------------

. we could use the dirty mechanism (end of event processing) to refresh things
(how do we NOT refresh something that initiated the change)

Algo:
for all bound properties in the view model:
    - if the edited value has changed
        - update the model value
    - if the model value is not the same as the edited value
        - update the edited value

Bindings:
    Each Element could have some bindings (a bindings object)
        - all bindings would be known centrally (when removed an Element
            unregisters its bindings, when inserted, it re registers its
            bindings)
        - the bindings themselves can keep track of dirtyness and stuff
            keeping things in synch

        - how to correctly synch this with events??? any problem here???

        - how to use this for something ELSE than an element (should be easy
        because the whole binding mechansim is separated from the
        Element thing)

        - monitoring the whole thing (like we should be able to monitor
        an object or subobject for changes under it). This would greatly
        help in the editor (ex: someone changes the red property of a color
        we want to know that the color itself changed... so we want to somehow
        propagate dirt upwards or I don't know)

NOTE: to expose bindings to the editor, elements will have some name bindings
"blabla": [ setViewValue, getViewValue]

The 'object' will be implicit (i.e. the object attached to this thing)
The 'property' will be a string

*/
"use strict";
var utils = require('utils'),
    domvisual = require('domvisual'),
    globalEvents = domvisual.globalEvents,
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

BindingMap.prototype.register = function () {
    BindingMap.registry[this.id] = this;
    return this;
};

BindingMap.prototype.unregister = function () {
    delete BindingMap.registry[this.id];
    return this;
};

BindingMap.prototype.refresh = function () {
    var modelChange = false;
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
        } else if (vVal !== undefined && v.val !== vVal) {
            // the view value changed
            o[propName] = vVal;
            v.val = vVal;
            modelChange = true;
        }

    });
    return modelChange;
};
BindingMap.refresh = function () {
    var reg = BindingMap.registry,
        modelChange = true;
    function mc() {
        modelChange = false;
        forEachProperty(reg, function (v, k) {
            if (v.refresh()) {
                modelChange = true;
            }
        });
    }
    while (modelChange) {
        mc();
    }
};

// automatically refresh the bindings on browser events
globalEvents.on('browserEvent', function () {
    BindingMap.refresh();
});

exports.BindingMap = BindingMap;
