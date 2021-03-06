/**
    colorpicker.js
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
    isFunction = utils.isFunction,
    group = {
        // authoring dimension
        dimensions: [ 340, 160, 0],
        positions: {
            rgba: {
                order: 0,
                matrix: [ 40, 0, 0, 0, 0, 24, 0, 0, 0, 0, 1, 0, 250, 0, 0, 1 ],
                snapping: {
                    left: 'auto',
                    right: 'px',
                    width: 'px',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            hsla: {
                order: 0,
                matrix: [ 40, 0, 0, 0, 0, 30, 0, 0, 0, 0, 1, 0, 300, 0, 0, 1 ],
                snapping: {
                    left: 'auto',
                    right: 'px',
                    width: 'px',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            hr: {
                order: 0,
                matrix: [ 340, 0, 0, 0, 0, 30, 0, 0, 0, 0, 1, 0, 0, 30, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            sg: {
                order: 0,
                matrix: [ 340, 0, 0, 0, 0, 30, 0, 0, 0, 0, 1, 0, 0, 60, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            lb: {
                order: 0,
                matrix: [ 340, 0, 0, 0, 0, 30, 0, 0, 0, 0, 1, 0, 0, 90, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            a: {
                order: 0,
                matrix: [ 340, 0, 0, 0, 0, 30, 0, 0, 0, 0, 1, 0, 0, 120, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            }
        },
        children: {
            rgba: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    position: "rgba"
                }
            },
            hsla: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    position: "hsla"
                }
            },
            hr: {
                factory: "baseui",
                type: "LabelValueSlider",
                config: {
                    position: "hr"
                }
            },
            sg: {
                factory: "baseui",
                type: "LabelValueSlider",
                config: {
                    position: "sg"
                }
            },
            lb: {
                factory: "baseui",
                type: "LabelValueSlider",
                config: {
                    position: "lb"
                }
            },
            a: {
                factory: "baseui",
                type: "LabelValueSlider",
                config: {
                    label: 'A:',
                    minValue: 0,
                    maxValue: 1,
                    value: 1,
                    position: "a"
                }
            }
        }
    };


function ColorPicker(config) {
    domvisual.DOMElement.call(this, config, group);
    var children = this.children,
        that = this;
    if (this.value === undefined) {
        this.setValue({r: 0, g: 0, b: 0, a: 1});
    }
    children.hr.on('change', function (v) {
        that.setHr(v);
        that.emit('change', that.getValue());
    });
    children.sg.on('change', function (v) {
        that.setSg(v);
        that.emit('change', that.getValue());
    });
    children.lb.on('change', function (v) {
        that.setLb(v);
        that.emit('change', that.getValue());
    });
    children.a.on('change', function (v) {
        that.setA(v);
        that.emit('change', that.getValue());
    });
    children.hr.on('preview', function (v) {
        that.setHr(v);
        that.emit('preview', that.getValue());
    });
    children.sg.on('preview', function (v) {
        that.setSg(v);
        that.emit('preview', that.getValue());
    });
    children.lb.on('preview', function (v) {
        that.setLb(v);
        that.emit('preview', that.getValue());
    });
    children.a.on('preview', function (v) {
        that.setA(v);
        that.emit('preview', that.getValue());
    });
}

ColorPicker.prototype = new (domvisual.DOMElement)();

ColorPicker.prototype.getActiveTheme = visual.getGetActiveTheme(
    'baseui',
    'ColorPicker'
);

ColorPicker.prototype.getDescription = function () {
    return "A color picker";
};

ColorPicker.prototype.theme = new (visual.Theme)({
    background: {
        data: [
            'baseui_theme_outlineRounded',
            'baseui_theme_outlineColor',
            'baseui_theme_windowDarkerForeground'
        ]
    },
    knob: {
        data: [
            'baseui_theme_outlineRounded',
            'baseui_theme_outlineColor',
            'baseui_theme_controlFillNormal'
        ]
    }
});

ColorPicker.prototype.getConfigurationSheet = function () {
    return {
        value: null
    };
};

ColorPicker.prototype.setValue = function (v) {
    this.value = v;
    if (v.r !== undefined) {
        this.showRGBA();
    } else {
        this.showHSLA();
    }
    return this;
};

ColorPicker.prototype.getValue = function () {
    return this.value;
};

ColorPicker.prototype.showRGBA = function () {
    var children = this.children,
        that = this;
    children.hr.setLabel('R:').setMaxValue(255).setValue(this.value.r);
    children.sg.setLabel('G:').setMaxValue(255).setValue(this.value.g);
    children.lb.setLabel('B:').setMaxValue(255).setValue(this.value.b);
    children.a.setValue(this.value.a);

    function updateSliderBackground() {
        var value = that.value,
            r = value.r,
            g = value.g,
            b = value.b,
            a = value.a;
        children.hr.setSliderBarStyleAttributes({
            backgroundImage: {
                colors: [
                    { r: 0, g: g, b: b, a: a},
                    { r: 255, g: g, b: b, a: a}
                ],
                stops: [ 0, 1],
                type: 'horizontal'
            }
        });
        children.sg.setSliderBarStyleAttributes({
            backgroundImage: {
                colors: [
                    { r: r, g: 0, b: b, a: a},
                    { r: r, g: 255, b: b, a: a}
                ],
                stops: [ 0, 1],
                type: 'horizontal'
            }
        });
        children.lb.setSliderBarStyleAttributes({
            backgroundImage: {
                colors: [
                    { r: r, g: g, b: 0, a: a},
                    { r: r, g: g, b: 255, a: a}
                ],
                stops: [ 0, 1],
                type: 'horizontal'
            }
        });
        children.a.setSliderBarStyleAttributes({
            backgroundImage: {
                colors: [
                    { r: r, g: g, b: b, a: 0},
                    { r: r, g: g, b: b, a: 1}
                ],
                stops: [ 0, 1],
                type: 'horizontal'
            }
        });
    }


    this.setHr = function (v) {
        this.value.r = v;
        updateSliderBackground();
    };
    this.setSg = function (v) {
        this.value.g = v;
        updateSliderBackground();
    };
    this.setLb = function (v) {
        this.value.b = v;
        updateSliderBackground();
    };
    this.setA = function (v) {
        this.value.a = v;
        updateSliderBackground();
    };
    updateSliderBackground();
};

ColorPicker.prototype.showHSLA = function () {
};

exports.ColorPicker = ColorPicker;
