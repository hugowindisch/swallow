/**
    LabelValueSlider.js
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
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    limitRange = utils.limitRange,
    group = {
        dimensions: [360, 25, 0],
        positions: {
            label: {
                order: 0,
                matrix: [ 60, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            },
            value: {
                order: 0,
                matrix: [ 60, 0, 0, 0, 0, 22, 0, 0,  0, 0, 1, 0, 65, 0, 0, 1],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            },
            slider: {
                order: 0,
                matrix: [ 180, 0, 0, 0, 0, 22, 0, 0,  0, 0, 1, 0, 130, 0, 0, 1],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            }
        },
        children: {
            label: {
                factory: "baseui",
                type: "Label",
                config: {
                    text: "Size:",
                    position: "label"
                }
            },
            value: {
                factory: "domvisual",
                type: "DOMInput",
                config: {
                    text: "0",
                    position: "value"
                }
            },
            slider: {
                factory: "baseui",
                type: "Slider",
                config: {
                    value: 0,
                    minValue: 0,
                    maxValue: 50,
                    position: "slider"
                }
            }
        }
    };

function LabelValueSlider(config) {
    this.defaultValue = 0;
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var children = this.children,
        that = this;
    children.slider.on('change', function (v, sliding) {
        that.value = v;
        that.updateInput();
        that.emit(sliding ? 'preview' : 'change', v);
    });
    children.value.on('change', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var n = limitRange(this.getValue(), 0, 1000);
        that.value = n;
        that.updateSlider();
        that.emit('change', n);
    });
}

LabelValueSlider.prototype = new (domvisual.DOMElement)();

LabelValueSlider.prototype.getActiveTheme = visual.getGetActiveTheme(
    'baseui',
    'LabelValueSlider'
);

LabelValueSlider.prototype.getDescription = function () {
    return "A label, input and slider interconnected";
};

LabelValueSlider.prototype.getConfigurationSheet = function () {
    return {
        label: null,
        value: null,
        minValue: null,
        maxValue: null,
        defaultValue: null
    };
};

LabelValueSlider.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
    return this;
};

LabelValueSlider.prototype.setValue = function (v) {
    v = v || 0;
    this.value = v;
    this.updateSlider();
    this.updateInput();
    return this;
};

LabelValueSlider.prototype.setDefaultValue = function (v) {
    this.defaultValue = v;
    return this;
};

LabelValueSlider.prototype.setMinValue = function (v) {
    this.children.slider.setMinValue(v);
    return this;
};

LabelValueSlider.prototype.setMaxValue = function (v) {
    this.children.slider.setMaxValue(v);
    return this;
};

LabelValueSlider.prototype.updateSlider = function () {
    this.children.slider.setValue(this.value || 0);
};

LabelValueSlider.prototype.updateInput = function () {
    this.children.value.setValue(Number(this.value || 0).toFixed(1));
};

LabelValueSlider.prototype.setSliderBarStyleAttributes = function (a) {
    this.children.slider.setBackgroundStyleAttributes(a);
};

exports.LabelValueSlider = LabelValueSlider;
