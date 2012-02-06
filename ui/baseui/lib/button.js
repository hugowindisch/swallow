/**
    button.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    verticalmenu = require('./verticalmenu'),
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    isFunction = utils.isFunction,
    group = {
        // authoring dimension
        dimensions: [ 400, 200, 0],
        positions: {
            background: {
                type: "AbsolutePosition",
                matrix: [ 400, 0, 0, 0,   0, 200, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
            },
            text: {
                type: "AbsolutePosition",
                matrix: [ 380, 0, 0, 0,   0, 180, 0, 0,    0, 0, 1, 0,   10, 10, 0, 1 ],
                snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
            }                
        },
        children: {
            background: {
                factory: "domvisual",
                type: "DOMElement",
                position: "background",
                enableScaling: false,
                order: 0,
                config: {
                    style: "background"
                }                
            },
            text: {
                factory: "domvisual",
                type: "DOMElement",
                position: "text",
                enableScaling: false,
                order: 1,
                config: {
                    style: "text"
                }                
            }
        }
    };

function Button(config) {
    var that = this;
    domvisual.DOMElement.call(this, config, group);
    // add some hooks:
    this.on('mousedown', function (evt) {
        evt.preventDefault();
        that.children.background.setStyle('pressedBackground');
        this.once('mouseupc', function (evt) {
            evt.preventDefault();
            that.children.background.setStyle('background');
            that.emit('click');
        });
    });
}
Button.prototype = new (domvisual.DOMElement)();
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
            { factory: 'baseui', type: 'Theme', style: 'pressedButtonBackground' }
            
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
Button.prototype.getConfigurationSheet = function () {
    return { text: {} };
};
Button.prototype.setText = function (text) {
    this.children.text.removeAllChildren();
    this.children.text.addTextChild('div', text, null, 'text');
};

exports.Button = Button;

