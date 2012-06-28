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
        dimensions: [ 340, 25, 0],
        positions: {
            color: {
                order: 0,
                matrix: [ 22, 0, 0, 0, 0, 22, 0, 0, 0, 0, 1, 0, 35, 0, 0, 1 ],
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
                matrix: [ 200, 0, 0, 0, 0, 22, 0, 0, 0, 0, 1, 0, 60, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            },
            remove: {
                order: 2,
                matrix: [ 22, 0, 0, 0, 0, 22, 0, 0, 0, 0, 1, 0, 265, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            },
            selection: {
                order: 2,
                matrix: [ 30, 0, 0, 0, 0, 22, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
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
            remove: {
                factory: "domvisual",
                type: "DOMImg",
                config: {
                    position: "remove",
                    url: "editor/img/removestop.png"
                }
            },
            selection: {
                factory: "domvisual",
                type: "DOMImg",
                config: {
                    position: "selection",
                    url: "editor/img/currentstop.png",
                    visible: false
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
    this.getChild('color').on('click', function () {
        that.emit('select');
    });
    this.getChild('remove').on('click', function () {
        that.emit('remove', this);
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
    this.getChild('selection').setVisible(selected);
};

GradientStop.prototype.enableRemove = function (enable) {
    this.getChild('remove').setVisible(enable);
};

exports.GradientStop = GradientStop;
