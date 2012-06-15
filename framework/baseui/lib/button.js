/**
    button.js
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
        dimensions: [ 400, 200, 0],
        positions: {
            background: {
                order: 0,
                matrix: [ 400, 0, 0, 0, 0, 200, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            text: {
                order: 1,
                matrix: [ 380, 0, 0, 0, 0, 16, 0, 0, 0, 0, 1, 0, 10, 92, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'cpx',
                    bottom: 'cpx',
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
            text: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    style: "text",
                    position: "text"
                }
            }
        }
    };

function Button(config) {
    var that = this;
    domvisual.DOMElement.call(this, config, group);
    // add some hooks:
    this.setCursor('pointer');
    this.on('mousedown', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        that.children.background.setStyle('pressedBackground');
        this.once('mouseupc', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            that.children.background.setStyle('background');
            that.emit('pressed');
        });
    });
}

Button.prototype = new (domvisual.DOMElement)();

Button.prototype.getDescription = function () {
    return "A Button";
};

Button.prototype.getActiveTheme = visual.getGetActiveTheme('baseui', 'Button');

Button.prototype.theme = new (visual.Theme)({
    background: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'control' }

        ]
    },
    pressedBackground: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'controlPressed'
            }

        ]
    },
    text: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'controlTextCentered' }

        ]
    },
    pressedText: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'controlTextCentered' }

        ]
    }
});

Button.createPreview = function () {
    return new Button({text: 'Button'});
};

Button.prototype.getConfigurationSheet = function () {
    return {
        text: config.inputConfig('Text')
    };
};

Button.prototype.setText = function (text) {
    this.children.text.removeAllChildren();
    this.children.text.addTextChild('div', text, null, 'text');
    return this;
};

exports.Button = Button;
