/**
    input.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    isFunction = utils.isFunction;

function Input(config) {
    domvisual.DOMInput.call(this, config);
    this.setStyle('text');
}

Input.prototype = new (domvisual.DOMInput)();

Input.prototype.getActiveTheme = visual.getGetActiveTheme('baseui', 'Input');

Input.prototype.getDescription = function () {
    return "A text input component";
};

Input.createPreview = function () {
    return new Input({text: 'input'});
};

Input.prototype.theme = new (visual.Theme)({
    text: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'inputText' }
        ]
    }
});

Input.prototype.getConfigurationSheet = function () {
    return { text: require('config').inputConfig('Text') };
};

exports.Input = Input;
