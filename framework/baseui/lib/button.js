/**
    button.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    config = require('config'),
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
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
            { factory: 'baseui', type: 'Theme', style: 'buttonBackground' }

        ]
    },
    pressedBackground: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'pressedButtonBackground'
            }

        ]
    },
    text: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'buttonText' }

        ]
    },
    pressedText: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'pressedButtonText' }

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
