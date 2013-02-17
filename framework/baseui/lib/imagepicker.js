/**
    imagepicker.js
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
    ListBox = require('./listbox').ListBox,
    isFunction = utils.isFunction;

function ImagePicker(config) {
    ListBox.call(this, config);
}

ImagePicker.prototype = new ListBox();

ImagePicker.prototype.getActiveTheme = visual.getGetActiveTheme(
    'baseui',
    'ImagePicker'
);

ImagePicker.prototype.getDescription = function () {
    return "An image selection box";
};
ImagePicker.prototype.theme = new (visual.Theme)({
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

ImagePicker.prototype.setUrls = function (urls) {
    this.setItems(urls);
    return this;
};

ImagePicker.prototype.setValue = ImagePicker.prototype.setSelectedUrl = function (url) {
    this.setSelectedItem(url);
    return this;
};

ImagePicker.prototype.getValue = ImagePicker.prototype.getSelectedUrl = function () {
    return this.getSelectedItem();
};

ImagePicker.prototype.getConfigurationSheet = function () {
    return { urls: {} };
};

ImagePicker.prototype.createViewer = function (item) {
    var vert = 40, cell, onLoad;
    onLoad = function () {
        var imageDimensions = this.getComputedDimensions();
        this.setHtmlFlowing({
            width: (vert * imageDimensions[0] / imageDimensions[1]) + 'px',
            height: vert + 'px',
            display: 'inline-block',
            whiteSpace: 'nowrap'
        });
    };

    cell = new (domvisual.DOMImg)({url: item});
    cell.setDimensions([20, 20, 0]).once('load', onLoad);

    cell.showSelectionBox = function (selected) {
        this.setStyle(selected ? 'imageSelected' : 'image');
        return this;
    };

    return cell;
};


exports.ImagePicker = ImagePicker;
