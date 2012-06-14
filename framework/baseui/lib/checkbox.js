/**
    chekcbox.js
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
    config = require('config'),
    group = {
        // authoring dimension
        dimensions: [ 24, 24, 0],
        positions: {
            background: {
                order: 0,
                matrix: [ 24, 0, 0, 0, 0, 24, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            image: {
                order: 1,
                matrix: [ 16, 0, 0, 0, 0, 16, 0, 0, 0, 0, 1, 0, 4, 4, 0, 1 ],
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
            background: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    style: "normal",
                    position: "background"
                }
            },
            image: {
                factory: "domvisual",
                type: "DOMImg",
                config: {
                    url: "baseui/img/menucheck.png",
                    position: "image"
                }
            }
        }
    };

function CheckBox(config) {
    var that = this;
    this.value = true;
    domvisual.DOMElement.call(this, config, group);
    // add some hooks:
    this.setCursor('pointer');
    this.on('mousedown', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        that.children.background.setStyle('pressed');
        this.once('mouseupc', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            that.children.background.setStyle('normal');
            that.setValue(!that.getValue());
            that.emit('change', that.getValue());

        });
    });
}

CheckBox.prototype = new (domvisual.DOMElement)();

CheckBox.prototype.getActiveTheme = visual.getGetActiveTheme(
    'baseui',
    'CheckBox'
);

CheckBox.prototype.getDescription = function () {
    return "A CheckBox";
};

CheckBox.prototype.theme = new (visual.Theme)({
    normal: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'buttonBackground'
            }
        ]
    },
    pressed: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'pressedButtonBackground'
            }
        ]
    }
});

CheckBox.createPreview = function () {
    return new CheckBox({value: true});
};

CheckBox.prototype.getConfigurationSheet = function () {
    return {
        value: null
    };
};

CheckBox.prototype.setValue = function (value) {
    this.value = Boolean(value);
    this.children.image.setVisible(this.value);
    return this;
};

CheckBox.prototype.getValue = function () {
    return this.value;
};

exports.CheckBox = CheckBox;
