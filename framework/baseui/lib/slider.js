/**
    slider.js
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
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    isFunction = utils.isFunction,
    mvvm = require('mvvm'),
    availableBindings = {
        value: mvvm.bidiProp('value')
    },
    group = {
        // authoring dimension
        dimensions: [ 100, 24, 0],
        positions: {
            background: {
                order: 0,
                matrix: [ 100, 0, 0, 0, 0, 24, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            knob: {
                order: 1,
                matrix: [ 24, 0, 0, 0, 0, 24, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            }
        },
        children: {
            background: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    style: "background",
                    position: "background"
                }
            },
            knob: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    style: "knob",
                    position: "knob"
                }
            }
        }
    };

function Slider(config) {
    domvisual.DOMElement.call(this, config, group);
    var children = this.children,
        that = this;

    this.on('mousedown', function (evt) {
        var matrix = that.getFullDisplayMatrix(true),
            dimensions = that.dimensions,
            minValue = that.minValue,
            range = (that.maxValue - minValue);
        function setKnobValue(evt) {
            var pos = mat4.multiplyVec3(matrix, [evt.pageX, evt.pageY, 1]),
                value = (pos[0] / dimensions[0]) * range + minValue;
            evt.preventDefault();
            evt.stopPropagation();
            that.setValue(value);
            that.emit('change', that.getValue(), true);
        }
        that.on('mousemovec', setKnobValue);
        that.once('mouseupc', function (evt) {
            that.removeListener('mousemovec', setKnobValue);
            that.emit('change', that.getValue(), false);
        });
        setKnobValue(evt);
    }).setCursor('pointer');
    this.getChild('knob').setCursor('move');
}

Slider.prototype = new (domvisual.DOMElement)();
mvvm.MVVM.initialize(Slider, availableBindings);
Slider.prototype.getActiveTheme = visual.getGetActiveTheme('baseui', 'Slider');
Slider.prototype.getDescription = function () {
    return "An horizontal Slider";
};

Slider.prototype.theme = new (visual.Theme)({
    background: {
        basedOn : [
            { factory: 'baseui', type: 'Theme', style: 'controlBackground' }
        ]
    },
    knob: {
        basedOn : [
            { factory: 'baseui', type: 'Theme', style: 'control' }
        ]
    }
});

Slider.prototype.setMinValue = function (minValue) {
    this.minValue = Number(minValue);
    this.applyLayout();
    return this;
};

Slider.prototype.getMinValue = function () {
    return this.minValue;
};

Slider.prototype.setMaxValue = function (maxValue) {
    this.maxValue = Number(maxValue);
    this.applyLayout();
    return this;
};

Slider.prototype.setValue = function (value) {
    this.value = Number(value);
    this.applyLayout();
    return this;
};

Slider.prototype.getValue = function () {
    var v = this.value;
    if (v < this.minValue) {
        v = this.minValue;
    }
    if (v > this.maxValue) {
        v = this.maxValue;
    }
    return v;
};

Slider.prototype.setBackgroundStyleAttributes = function (a) {
    this.getChild('background').setStyleAttributes(a);
};

Slider.prototype.getConfigurationSheet = function () {
    var config = require('config'),
        inputConfig = config.inputConfig;
    return {
        minValue: inputConfig('Min value'),
        maxValue: inputConfig('Max value'),
        value: inputConfig('Value'),
        mVVMBindingInfo: config.bindingsConfig('Bindings', availableBindings)
    };
};

Slider.prototype.applyLayout = function (optionalChildren) {
    domvisual.DOMElement.prototype.applyLayout.call(this, optionalChildren);
    if (this.children && this.children.knob) {
        var children = this.children,
            knob = children.knob,
            knobw = knob.dimensions[0],
            range = Math.max(this.dimensions[0] - knobw, 0),
            pos = range *
                (this.getValue() - this.minValue) /
                (this.maxValue - this.minValue);
        knob.setTranslationMatrix([pos, 0, 0]);
    }
    return this;
};

exports.Slider = Slider;
