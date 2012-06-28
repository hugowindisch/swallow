/**
    gradienteditor.js
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
    GradientStop = require('./gradientstop').GradientStop,
    isFunction = utils.isFunction,
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty,
    group = {
        // authoring dimension
        dimensions: [ 340, 320, 0],
        positions: {
            color: {
                order: 0,
                matrix: [ 340, 0, 0, 0, 0, 160, 0, 0, 0, 0, 1, 0, 0, 120, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'auto',
                    width: 'px',
                    top: 'px',
                    bottom: 'auto',
                    height: 'px'
                }
            },
            stops: {
                order: 1,
                matrix: [ 340, 0, 0, 0, 0, 120, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
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
                factory: "baseui",
                type: "ColorPicker",
                config: {
                    position: "color"
                }
            },
            stops: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    position: "stops"
                }
            }
        }
    };

function GradientEditor(config) {
    domvisual.DOMElement.call(this, config, group);
    var children = this.children,
        that = this;
    if (this.value === undefined) {
        this.setValue({
            colors: [{r: 0, g: 0, b: 0, a: 1}, {r: 255, g: 255, b: 255, a: 1}],
            stops: [0, 1],
            type: 'horizontal'
        });
    }
    this.getChild('color').on('preview', function (color) {
        if (that.selectedStop) {
            that.selectedStop.setColor(color);
        }
        that.emit('preview', that.getValue());
    }).on('change', function (color) {
        that.emit('change', that.getValue());
    });
}

GradientEditor.prototype = new (domvisual.DOMElement)();


GradientEditor.prototype.getDescription = function () {
    return "A gradient editor";
};

GradientEditor.prototype.getConfigurationSheet = function () {
    return {
        value: null
    };
};

GradientEditor.prototype.setValue = function (v) {
    this.value = v;
    var stops = this.getChild('stops'),
        that = this,
        n = 0,
        plus;
    stops.removeAllChildren();
    delete this.selectedStop;

    function addStop(config, order) {
        var newChild = new GradientStop(config);
        stops.addChild(
            newChild,
            n,
            order
        );
        n += 1;
        newChild.setHtmlFlowing(
            {position: 'relative'}, true
        ).on('preview', function () {
            that.emit('preview', that.getValue());
        }).on('change', function () {
            that.emit('change', that.getValue());
        }).on('select', function () {
            that.select(this);
        }).on('remove', function () {
            stops.removeChild(this);
            if (that.selectedStop === this) {
                that.select(stops.getChildAtOrder(0));
            }
            that.updateControlVisibility();
        });
        if (!that.selectedStop) {
            that.select(newChild);
        }
        return newChild;
    }

    if (v) {
        forEach(v.colors, function (color, i) {
            addStop(
                {color: color, stop: v.stops[i]},
                i
            );
        });

        // add a + button
        plus = new domvisual.DOMImg({url: 'editor/img/addstop.png'});
        stops.addChild(plus, 'plus');
        plus.setHtmlFlowing(
            {position: 'relative'},
            false
        ).setDimensions(
            [22, 22, 0]
        ).on('click', function () {
            that.select(addStop(
                {
                    color: {r: 0, g: 0, b: 0, a: 1},
                    stop: 1
                },
                stops.numChildren - 1
            ));
            that.updateControlVisibility();
        });
        this.updateControlVisibility();
    }
    return this;
};

GradientEditor.prototype.getValue = function () {
    var stops = this.getChild('stops'),
        ret = { colors: [], stops: [], type: 'vertical' };
    forEachProperty(stops.getChildren(), function (c) {
        if (c instanceof GradientStop) {
            ret.colors.push(c.getColor());
            ret.stops.push(c.getStop());
        }
    });
    return ret;
};

GradientEditor.prototype.select = function (stop) {
    if (stop !== this.selectedStop) {
        if (this.selectedStop) {
            this.selectedStop.setSelected(false);
            delete this.selectedStop;
        }
        if (stop) {
            this.selectedStop = stop;
            stop.setSelected(true);
            this.getChild('color').setValue(stop.getColor());
        }
    }
};

GradientEditor.prototype.updateControlVisibility = function () {
    var stops = this.getChild('stops'),
        nc = stops.numChildren;
    stops.getChild('plus').setVisible(nc <= 5);
    forEachProperty(stops.getChildren(), function (c) {
        if (c instanceof GradientStop) {
            c.enableRemove(nc > 3);
        }
    });

};

exports.GradientEditor = GradientEditor;
