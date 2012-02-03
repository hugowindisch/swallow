/**
    label.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    isFunction = utils.isFunction;

function Label(config) {
    domvisual.DOMElement.call(this, config);
}

Label.prototype = new (domvisual.DOMElement)();

Label.prototype.theme = new (visual.Theme)({
    text: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'labelText' }
        ]
    }
});

Label.prototype.setText = function (text) {
    this.setInnerText(text);
    this.setStyle('text');
    this.text = text;
};

Label.prototype.getText = function () {
    return this.text;
};

Label.prototype.getConfigurationSheet = function () {
    return { text: {} }; 
};

exports.Label = Label;
