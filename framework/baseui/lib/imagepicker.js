/**
    imagepicker.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    isFunction = utils.isFunction;

function ImagePicker(config) {
    domvisual.DOMElement.call(this, config);
    this.setChildrenClipping([ 'auto', 'hidden']);
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
