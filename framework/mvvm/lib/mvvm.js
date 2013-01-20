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
    Each visual could have some bindings (a bindings object)
        - all bindings would be known centrally (when removed an visual
            unregisters its bindings, when inserted, it re registers its
            bindings)
        - the bindings themselves can keep track of dirtyness and stuff
            keeping things in synch

        - how to correctly synch this with events??? any problem here???

        - how to use this for something ELSE than an visual (should be easy
        because the whole binding mechansim is separated from the
        visual thing)

        - monitoring the whole thing (like we should be able to monitor
        an object or subobject for changes under it). This would greatly
        help in the editor (ex: someone changes the red property of a color
        we want to know that the color itself changed... so we want to somehow
        propagate dirt upwards or I don't know)

NOTE: to expose bindings to the editor, visuals will have some name bindings
"blabla": [ setViewValue, getViewValue]

The 'object' will be implicit (i.e. the object attached to this thing)
The 'property' will be a string

*/
//"use strict";
/*jslint sloppy: true */
var utils = require('utils'),
    domvisual = require('domvisual'),
    globalEvents = domvisual.globalEvents,
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty,
    Scope = require('./scope').Scope,
    BindingMap = require('./map').BindingMap;

// automatically refresh the bindings on browser events
globalEvents.on('browserEvent', function () {
    BindingMap.refresh();
});

// keep all MVVM crap under one umbrella
function MVVM() {
    this.bindingMap = new BindingMap();
    this.w = '';
    // FIXME: this should probably not be done here!
    this.bindingMap.register();
}



// helpers for creating bindings in components
// MyThing.prototype.setBindings = setBindings(availableBindings);
// bindings:
// { type, variable }
// variable is like a big path
/*function setBindings(availableBindings) {

// FIXME: probably bad.... can we really bind at this moment???

    return function (bindings) {
        this.mvvm = new MVVM();
        var that = this,
            MVVM = this.mvvm,
            scope = this.mvvm.scope,
            bindingMap = MVVM.bindingMap;
        forEachProperty(bindings, function (v, k) {
            var res = scope.resolve(v.variable),
                b = availableBindings[k];
            bindingMap.bind(
                res.object,
                res.variable,
                function (v) {
                    return b.setViewValue(that, v);
                },
                function () {
                    b.getViewValue(that);
                },
                v
            );
        });
        return this;
    };
}
function getBindings(availableBindinds) {
    return function () {
        var ret = [],
            bindingMap = this.mvvm && this.mvvm.bindingMap;
        if (bindingMap) {
            forEach(bindingMap.bindings, function (v) {
                if (v.bindingInfo) {
                    ret.push(v.bindingInfo);
                }
            });
        }
        return ret;
    };
}
*/
function setMVVMWith(w) {
    this.mvvm = this.mvvm || new MVVM();
    this.mvvm.w = w;
    return this;
}
function getMVVMWith() {
    return this.mvvm && this.mvvm.w;
}
function bindMVVM(bindingTypes) {
    return function (data) {
        if (!(data instanceof Scope)) {
            data = new Scope(data);
            // FIXME called with DATA, this is a top level scope
            //data.setTopLevel();
        }
        this.mvvm = this.mvvm || new MVVM();
        var mvvm = this.mvvm,
            map = mvvm.bindingMap,
            scope = data.resolveScope(this.w),
            that = this;
        mvvm.scope = scope;

        map.clear();
        if (this.bindingInfo) {
            forEach(this.bindingInfo, function (b, k) {
                var res = scope.resolve(b.variable),
                    bt = bindingTypes[b.type];
                map.bind(
                    res.object,
                    res.variable,
                    function (v) {
                        return bt.setViewValue(that, v);
                    },
                    function () {
                        return bt.getViewValue(that);
                    }
                );
            });
        }
        // always deep
        this.forEachChild(function (c) {
            if (c.bindMVVM) {
                c.bindMVVM(scope);
            }
        });

        return this;
    };
}
function setBindingInfo(b) {
    this.bindingInfo = b;
    return this;
}
function getBindingInfo() {
    return this.bindingInfo || [];
}
MVVM.initialize = function (VisualConstructor, bindingTypes) {
    VisualConstructor.prototype.setMVVMBindingInfo = setBindingInfo;
    VisualConstructor.prototype.getMVVMBindingInfo = getBindingInfo;
    VisualConstructor.prototype.bindMVVM = bindMVVM(bindingTypes);
    VisualConstructor.prototype.setMVVMWith = setMVVMWith;
    VisualConstructor.prototype.getMVVMWith = getMVVMWith;
};

exports.Scope = Scope;
exports.BindingMap = BindingMap;
exports.MVVM = MVVM;
