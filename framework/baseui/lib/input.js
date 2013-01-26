/**
    input.js
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
"use strict";
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    isFunction = utils.isFunction,
	mvvm = require('mvvm'),
    availableBindings = {
        value: mvvm.bidiProp('value')
    };

function Input(config) {
    domvisual.DOMInput.call(this, config);
    this.setStyle('text');
}

Input.prototype = new (domvisual.DOMInput)();

mvvm.MVVM.initialize(Input, availableBindings);

Input.prototype.getActiveTheme = visual.getGetActiveTheme('baseui', 'Input');

Input.prototype.getDescription = function () {
    return "A text input component";
};

Input.prototype.setPassword = function (pw) {
    if (pw) {
        this.setType('password');
    } else {
        this.setType('text');
    }
    return this;
};

Input.createPreview = function () {
    return new Input({text: 'input'});
};

Input.prototype.theme = new (visual.Theme)({
    text: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'controlText' }
        ]
    }
});

Input.prototype.getConfigurationSheet = function () {
    var config = require('config');
    return {
        text: config.inputConfig('Text'),
        placeholder: config.inputConfig('Placeholder'),
        password: config.booleanConfig('Password'),
        mVVMBindingInfo: config.bindingsConfig('Bindings', availableBindings)
    };
};

exports.Input = Input;
