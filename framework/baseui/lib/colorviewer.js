/**
    ColorViewer.js
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
var visual = require('visual'),
    domvisual = require('domvisual'),
    config = require('config'),
    mvvm = require('mvvm'),
    availableBindings = mvvm.getDefaultBindings({
        r: mvvm.bidiPropBinding('r'),
        g: mvvm.bidiPropBinding('g'),
        b: mvvm.bidiPropBinding('b'),
        a: mvvm.bidiPropBinding('a')
    });


function ColorViewer(config) {
    this.rgba = { r: 0, g: 0, b: 0, a: 1 };
    domvisual.DOMElement.call(this, config);
    this.updateBG();
}

ColorViewer.prototype = new (domvisual.DOMElement)();

mvvm.MVVM.initialize(ColorViewer, availableBindings);

ColorViewer.prototype.getConfigurationSheet = function () {
    var config = require('config');
    return {
        mVVMBindingInfo: config.bindingsConfig('Bindings', availableBindings)
    };
};

ColorViewer.prototype.setR = function (v) {
    this.rgba.r = v;
    this.updateBG();
};
ColorViewer.prototype.setG = function (v) {
    this.rgba.g = v;
    this.updateBG();
};
ColorViewer.prototype.setB = function (v) {
    this.rgba.b = v;
    this.updateBG();
};
ColorViewer.prototype.setA = function (v) {
    this.rgba.a = v;
    this.updateBG();
};
ColorViewer.prototype.updateBG = function () {
    this.setStyleAttributes({ backgroundColor: this.rgba });
};
exports.ColorViewer = ColorViewer;
