/**
    chekcbox.js
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
        dimensions: [ 24, 24, 0],
        positions: {
            background: {
                order: 0,
                matrix: [ 24, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
            },
            image: {
                order: 1,
                matrix: [ 16, 0, 0, 0,   0, 16, 0, 0,    0, 0, 1, 0,   4, 4, 0, 1 ],
                snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
            }
        },
        children: {
            background: {
                factory: "domvisual",
                type: "DOMElement",
                position: "background",
                config: {
                    style: "normal"
                }
            },
            image: {
                factory: "domvisual",
                type: "DOMImg",
                position: "image",
                config: {
                    url: "baseui/lib/menucheck.png"
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
CheckBox.prototype.theme = new (visual.Theme)({
    normal: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'buttonBackground' }
        ]
    },
    pressed: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'pressedButtonBackground' }
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
