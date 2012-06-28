/**
    gradientstop.js
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
        dimensions: [ 340, 30, 0],
        positions: {
            color: {
                order: 0,
                matrix: [ 25, 0, 0, 0, 0, 25, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            },
            stop: {
                order: 1,
                matrix: [ 270, 0, 0, 0, 0, 25, 0, 0, 0, 0, 1, 0, 30, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            },
            action: {
                order: 2,
                matrix: [ 25, 0, 0, 0, 0, 25, 0, 0, 0, 0, 1, 0, 310, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            }
        },
        children: {
            color: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    position: "color"
                }
            },
            stop: {
                factory: "baseui",
                type: "Slider",
                config: {
                    position: "stop",
                    minValue: 0,
                    maxValue: 1
                }
            },
            action: {
                factory: "domvisual",
                type: "DOMImg",
                config: {
                    position: "action"
                }
            }
        }
    };


function GradientStop(config) {
    domvisual.DOMElement.call(this, config, group);
    var that = this;

    this.getChild('stop').on('change', function (v) {
        that.emit('change', v);
        that.emit('select');
    }).on('preview', function (v) {
        that.emit('preview', v);
    });
}

GradientStop.prototype = new (domvisual.DOMElement)();

GradientStop.prototype.getDescription = function () {
    return "A gradient stop";
};

GradientStop.prototype.getConfigurationSheet = function () {
    return {
        value: null
    };
};

GradientStop.prototype.setColor = function (v) {
    this.color = v;
    this.getChild('color').setStyleAttributes({
        backgroundColor: v
    });
    return this;
};

GradientStop.prototype.getColor = function () {
    return this.color;
};

GradientStop.prototype.setStop = function (v) {
    this.getChild('stop').setValue(v);
    return this;
};

GradientStop.prototype.getStop = function (v) {
    return this.getChild('stop').getValue();
};

GradientStop.prototype.setSelected = function (selected) {
};

exports.GradientStop = GradientStop;
