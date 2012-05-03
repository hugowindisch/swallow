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

Label.createPreview = function () {
    return new (domvisual.DOMImg)({url: 'baseui/lib/labelpreview.png'});
};
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
    text = text || '';
    this.setInnerText(text);
    this.setStyle('text');
    this.text = text;
};

Label.prototype.getText = function () {
    return this.text;
};

Label.prototype.getConfigurationSheet = function () {
    return { text: require('config').inputConfig('Text'), textAlign: null, bold: null };
};

Label.prototype.setTextAlign = function (enable) {
// FIXME: (this is fake, there is no right way to do this yet)
    this.element.style.textAlign = enable ? 'center' : null;
};

Label.prototype.setBold = function (enable) {
// FIXME: (this is fake, there is no right way to do this yet)
    this.element.style.fontWeight = enable ? 'bold' : 'normal';
};


exports.Label = Label;
