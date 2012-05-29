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
    return new (domvisual.DOMImg)({url: 'baseui/img/labelpreview.png'});
};
Label.prototype = new (domvisual.DOMElement)();
Label.prototype.getActiveTheme = visual.getGetActiveTheme('baseui', 'Label');
Label.prototype.getDescription = function () {
    return "A label";
};
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
    return this;
};

Label.prototype.getText = function () {
    return this.text;
};

Label.prototype.getConfigurationSheet = function () {
    return {
        text: require('config').inputConfig('Text'),
        textAlign: null,
        bold: require('config').booleanConfig('Bold') 
    };
};

Label.prototype.setTextAlign = function (align) {
    this.setStyleAttributes({ textAlign: align});
    return this;
};

Label.prototype.setBold = function (enable) {
    this.setStyleAttributes({ fontWeight: enable ? 'bold' : null});
    return this;
};


exports.Label = Label;
