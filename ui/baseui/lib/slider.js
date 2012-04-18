/**
    slider.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    isFunction = utils.isFunction,
    group = {
        // authoring dimension
        dimensions: [ 100, 24, 0],
        positions: {
            background: {
                type: "Position",
                order: 0,
                matrix: [ 100, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
            },
            knob: {
                type: "Position",
                order: 1,
                matrix: [ 24, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'px', height: 'auto' }
            }
        },
        children: {
            background: {
                factory: "domvisual",
                type: "DOMElement",
                position: "background",
                config: {
                    style: "background"
                }
            },
            knob: {
                factory: "domvisual",
                type: "DOMElement",
                position: "knob",
                config: {
                    style: "knob"
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
    });
}

Slider.prototype = new (domvisual.DOMElement)();

Slider.prototype.theme = new (visual.Theme)({
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

Slider.prototype.setMinValue = function (minValue) {
    this.minValue = minValue;
    this.applyLayout();
};

Slider.prototype.getMinValue = function () {
    return this.minValue;
};

Slider.prototype.setMaxValue = function (maxValue) {
    this.maxValue = maxValue;
    this.applyLayout();
};

Slider.prototype.setValue = function (value) {
    this.value = value;
    this.applyLayout();
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

Slider.prototype.getConfigurationSheet = function () {
    var config = require('config'),
        inputConfig = config.inputConfig;
    return {
        minValue: inputConfig('Min value'),
        maxValue: inputConfig('Max value'),
        value: inputConfig('Value')
    };
};

Slider.prototype.applyLayout = function () {
    domvisual.DOMElement.prototype.applyLayout.call(this);
    if (this.children) {
        var children = this.children,
            knob = children.knob,
            knobw = knob.dimensions[0],
            range = Math.max(this.dimensions[0] - knobw, 0),
            pos = range * (this.getValue() - this.minValue) / (this.maxValue - this.minValue);
        knob.setTranslationMatrix([pos, 0, 0]);
    }
};

exports.Slider = Slider;
