/**
    fontpicker.js
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
    ListBox = require('./listbox').ListBox,
    Label = require('./label').Label,
    isFunction = utils.isFunction;

function FontPicker(config) {
    domvisual.DOMElement.call(this, config);
    this.setOverflow([ 'hidden', 'auto']);
    this.setStyle('bg');
}

FontPicker.prototype = new ListBox();

FontPicker.prototype.getActiveTheme = visual.getGetActiveTheme(
    'baseui',
    'FontPicker'
);

FontPicker.prototype.getDescription = function () {
    return "An image selection box";
};
FontPicker.prototype.theme = new (visual.Theme)({
    bg: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'controlBackground'
            }
        ]
    },
    image: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'selectionBox'
            }
        ]
    },
    imageSelected: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'selectionBoxSelected'
            }
        ]
    }
});

FontPicker.prototype.createViewer = function (item) {
    var cell;
    cell = new domvisual.DOMElement({innerText: item});
    cell.setHtmlFlowing({
        width: this.dimensions[0] + 'px',
        height: 25 + 'px',
        display: 'block',
        whiteSpace: 'nowrap'
    });

    cell.setStyleAttributes({fontFamily: item});
    cell.showSelectionBox = function (selected) {
        this.setStyle(selected ? 'imageSelected' : 'image');
        return this;
    };
    return cell;
};


exports.FontPicker = FontPicker;
