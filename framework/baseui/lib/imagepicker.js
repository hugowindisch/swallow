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
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    isFunction = utils.isFunction;

function ImagePicker(config) {
    domvisual.DOMElement.call(this, config);
    this.setOverflow([ 'auto', 'hidden']);
}

ImagePicker.prototype = new (domvisual.DOMElement)();

ImagePicker.prototype.getActiveTheme = visual.getGetActiveTheme(
    'baseui',
    'ImagePicker'
);

ImagePicker.prototype.getDescription = function () {
    return "An image selection box";
};
ImagePicker.prototype.theme = new (visual.Theme)({
    image: {
        basedOn: [
            // take the line styles from here
            { factory: 'baseui', type: 'Theme', style: 'imagePickerImage' }
        ]
    },
    imageSelected: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'imagePickerImageSelected'
            }
        ]
    }
});

ImagePicker.prototype.setUrls = function (urls) {
    if (this.imageUrls !== urls) {
        this.imageUrls = urls;
        this.selected = null;
        this.updateChildren();
    }
    return this;
};

ImagePicker.prototype.setSelectedUrl = function (url) {
    var i,
        imageUrls = this.imageUrls,
        l = imageUrls.length,
        sel = null;
    for (i = 0; i < l; i += 1) {
        if (imageUrls[i] === url) {
            sel = i;
            break;
        }
    }
    this.select(sel);
    return this;
};
ImagePicker.prototype.getSelectedUrl = function (url) {
    if (this.selected !== null) {
        return this.imageUrls[this.selected];
    }
    return null;
};

ImagePicker.prototype.getConfigurationSheet = function () {
    return { urls: {} };
};

ImagePicker.prototype.select = function (n) {
    if (this.selected !== n) {
        if (this.selected !== null) {
            this.cells[this.selected].setStyle('image');
        }
        this.selected = n;
        if (this.selected !== null) {
            this.cells[this.selected].setStyle('imageSelected');
        }
    }
    return this;
};

ImagePicker.prototype.updateChildren = function () {
    var urls = this.imageUrls,
        i,
        l = urls.length,
        url,
        c,
        table,
        row,
        cell,
        vert = 40,
        that = this;
    this.cells = [];
    this.removeAllChildren();
    table = this.addHtmlChild('table', '', null, 'table');
    row = table.addHtmlChild('tr', '', null, 'row');

    function onLoad() {
        var imageDimensions = this.getComputedDimensions();
        this.setHtmlFlowing({
            width: (vert * imageDimensions[0] / imageDimensions[1]) + 'px',
            height: vert + 'px'
        });
    }
    function getOnClick(n) {
        return function () {
            if (that.selected !== n) {
                that.select(n);
            } else {
                that.select(null);
            }
            that.emit('change', that.getSelectedUrl());
        };
    }
    for (i = 0; i < l; i += 1) {
        url = urls[i];
        cell = row.addHtmlChild('td', '');
        this.cells.push(cell);
        cell.setStyle('image');
        c = new (domvisual.DOMImg)({url: url});
        c.setDimensions([20, 20, 0]);
        cell.addChild(c, 'image ' + i);
        c.once('load', onLoad);
        c.on('click', getOnClick(i));
        c.setCursor('pointer');
    }
    return this;
};

exports.ImagePicker = ImagePicker;
