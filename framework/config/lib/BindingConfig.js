/**
    config.js
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
    isFunction = utils.isFunction,
    group =  {
        dimensions: [ 200, 60, 0],
        positions: {
            label: {
                order: 0,
                matrix: [ 100, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   5, 0, 0, 1 ],
                snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'auto', bottom: 'px' }
            },
            select: {
                order: 0,
                matrix: [ 240, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   105, 0, 0, 1 ],
                snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'auto', bottom: 'px' }
            },
            expressionLabel: {
                order: 0,
                matrix: [ 90, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   40, 30, 0, 1 ],
                snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'auto', bottom: 'px' }
            },
            expression: {
                order: 0,
                matrix: [ 240, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   105, 30, 0, 1 ],
                snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'auto', bottom: 'px' }
            }
        },
        children: {
            label: {
                factory: 'baseui',
                type: 'Label',
                config: {
                    position: 'label'
                }
            },
            select: {
                factory: 'domvisual',
                type: 'DOMSelect',
                config: {
                    position: 'select'
                }
            },
            expressionLabel: {
                factory: 'baseui',
                type: 'Label',
                config: {
                    position: 'expressionLabel',
                    text: 'variable:'
                }
            },
            expression: {
                factory: 'baseui',
                type: 'Input',
                config: {
                    position: 'expression'
                }
            }
        }
    };

function BindingConfig(config) {
    var that = this;
    that.data = {};
    domvisual.DOMElement.call(this, config, group);
    this.getChild('select').on('change', function () {
        var sel = that.selected = this.getSelectedOption();
        if (that.data) {
            that.getChild('expression').setText(that.data[sel] || '');
        }
    });
    this.getChild('expression').on('change', function (v) {
        var sel = that.selected;
        if (sel) {
            if (v) {
                that.data[sel] = v;
                that.emit('change', that.data);
            } else {
                delete that.data[sel];
                that.emit('change', that.data);
            }
        }
    });
}

BindingConfig.prototype = new (domvisual.DOMElement)();

BindingConfig.prototype.setData = function (data) {
    this.data = data;
    if (this.selected) {
        this.getChild('expression').setText(this.data[this.selected] || '');
    }
};
BindingConfig.prototype.getData = function (data) {
    if (this.selected) {
        this.data[this.selected] = this.getChild('expression').getText();
    }
    return this.data;
};
BindingConfig.prototype.setOptions = function (options) {
    this.getChild('select').setOptions(options);
    this.selected = this.getChild('select').getSelectedOption();
};
BindingConfig.prototype.setLabel = function (l) {
    this.getChild('label').setText(l);
};


exports.BindingConfig = BindingConfig;
