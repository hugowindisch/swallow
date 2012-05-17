/**
    imageviewer.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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
            },
        }
    };

function ImageViewer(config) {
    this.scaling = 'constrain';
    domvisual.DOMElement.call(this, config, group);
    var that = this,
        image = this.getChild('image');
    image.on('load', function () {
        that.updateImage();
    });
}
ImageViewer.prototype = new (domvisual.DOMElement)();
ImageViewer.prototype.getDescription = function () {
    return "An ImageViewer that keeps its aspect ratio";
};
ImageViewer.createPreview = function () {
    return new domvisual.DOMImg({url: 'domvisual/lib/imagepreview.png'});
};

ImageViewer.prototype.getConfigurationSheet = function () {
    return {
        url: require('config').imageUrlConfig('Image'),
        scaling: null
    };
};
ImageViewer.prototype.setUrl = function (value) {
    var image = this.getChild('image');
    image.setUrl(value);
    image.setVisible(false);
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
                image.setTranslationMatrix([(dim[0] - nd[0]) / 2, (dim[1] - nd[1]) / 2, 0]);
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
