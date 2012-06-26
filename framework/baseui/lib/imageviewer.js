/**
    imageviewer.js
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
    config = require('config'),
    group = {
        // authoring dimension
        dimensions: [ 24, 24, 0],
        positions: {
        },
        children: {
            image: {
                factory: "domvisual",
                type: "DOMImg",
                config: {
                    style: "normal",
                    position: null
                }
            }
        }
    };

function ImageViewer(config) {
    this.scaling = 'constrain';
    domvisual.DOMElement.call(this, config, group);
    var that = this,
        image = this.getChild('image');
    image.on('load', function () {
        that.updateImage();
        that.emit('load', this.url);
    });
}

ImageViewer.prototype = new (domvisual.DOMElement)();

ImageViewer.prototype.getActiveTheme = visual.getGetActiveTheme(
    'baseui',
    'ImageViewer'
);

ImageViewer.prototype.getDescription = function () {
    return "An ImageViewer that keeps its aspect ratio";
};

ImageViewer.createPreview = function () {
    return new domvisual.DOMImg({url: 'domvisual/img/imagepreview.png'});
};

ImageViewer.prototype.getConfigurationSheet = function () {
    return {
        url: require('config').imageUrlConfig('Image'),
        scaling: null
    };
};

ImageViewer.prototype.setUrl = function (value) {
    if (value !== this.url) {
        var image = this.getChild('image');
        this.url = value;
        image.setUrl(value);
        image.setVisible(false);
    }
};

ImageViewer.prototype.getUrl = function () {
    return this.url;
};

ImageViewer.prototype.setScaling = function (s) {
    this.scaling = s;
};

ImageViewer.prototype.setDimensions = function (dim) {
    domvisual.DOMElement.prototype.setDimensions.call(this, dim);
    this.updateImage();
    return this;
};

ImageViewer.prototype.updateImage = function () {
    var iDim,
        dim = this.dimensions,
        sx,
        sy,
        nd,
        image = this.getChild('image');

    if (image) {
        iDim = image.getImageDimensions();
        if (iDim[0] && iDim[1]) {
            image.setVisible(true);
            switch (this.scaling) {
            case 'constrain':
                sx = dim[0] / iDim[0];
                sy = dim[1] / iDim[1];
                if (sy < sx) {
                    nd = [iDim[0] * sy, iDim[1] * sy, 0];
                } else {
                    nd = [iDim[0] * sx, iDim[1] * sx, 0];
                }
                image.setDimensions(nd);
                image.setTranslationMatrix(
                    [(dim[0] - nd[0]) / 2, (dim[1] - nd[1]) / 2, 0]
                );
                break;
            case 'fitw':
            case 'fith':
            case 'cover':
                // not supported yet
                throw new Error('scaling not supported yet');
            default:
                // not supported yet
                throw new Error('scaling not supported yet');
            }
        }
    }
};

exports.ImageViewer = ImageViewer;
