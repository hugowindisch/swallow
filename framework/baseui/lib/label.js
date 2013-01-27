/**
    label.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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
    isFunction = utils.isFunction,
    mvvm = require('mvvm'),
    availableBindings = mvvm.getDefaultBindings({
        text: mvvm.bidiPropBinding('text')
    });
    

function Label(config) {
    domvisual.DOMElement.call(this, config);
}

Label.createPreview = function () {
    return new (domvisual.DOMImg)({url: 'baseui/img/labelpreview.png'});
};

Label.prototype = new (domvisual.DOMElement)();
mvvm.MVVM.initialize(Label, availableBindings);

Label.prototype.getActiveTheme = visual.getGetActiveTheme('baseui', 'Label');

Label.prototype.getDescription = function () {
    return "A label";
};

Label.prototype.theme = new (visual.Theme)({
    text: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'controlText' }
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
    var config = require('config');
    return {
        text: config.inputConfig('Text'),
        textAlign: null,
        bold: config.booleanConfig('Bold'),
        mVVMBindingInfo: config.bindingsConfig('Bindings', availableBindings)
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
