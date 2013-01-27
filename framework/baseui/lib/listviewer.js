/**
    ListViewer.js
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

var domvisual = require('domvisual'),
    mvvm = require('mvvm'),
    availableBindings = {
        "list": mvvm.listBinding(function (vis, data) {
            return vis.createChild();
        })
    };
function ListViewer(config) {
    this.Viewer = domvisual.DOMElement;
    domvisual.DOMElement.call(this, config);
    this.setOverflow([ 'hidden', 'auto' ]);
}
ListViewer.prototype = new domvisual.DOMElement();
mvvm.MVVM.initialize(ListViewer, availableBindings);
ListViewer.prototype.getConfigurationSheet = function () {
    var config = require('config');
    return {
        mVVMBindingInfo: config.bindingsConfig('Bindings', availableBindings),
        factory: config.inputConfig('Factory: '),
        type: config.inputConfig('Type: '),
    };
};
ListViewer.prototype.setFactory = function (V) {
    this.factory = V;
    return this;
};
ListViewer.prototype.setType = function (V) {
    this.type = V;
    return this;
};
ListViewer.prototype.createChild = function () {
    var f = require(this.factory),
        C = f && f[this.type],
        r;
    if (C) {
        r = new C({htmlFlowing: { position: 'relative'}});
        r.setHtmlFlowing({ position: 'relative' }, true);
    }
    return r;
};
ListViewer.prototype.applyLayout = function (children) {
    var dimensions = this.dimensions;
    this.forEachChild(function (c) {
        var cd = c.dimensions;
        c.setDimensions([dimensions[0], cd[1], cd[2]]);
    });
};
exports.ListViewer = ListViewer;
