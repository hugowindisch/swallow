/**
    StylePreview.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    hasTextAttributes = domvisual.hasTextAttributes;

function StylePreview(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StylePreview);
    this.setChildrenClipping('hidden');
}
StylePreview.prototype = new (domvisual.DOMElement)();
StylePreview.prototype.getConfigurationSheet = function () {
    return { editedStyle: null };
};
StylePreview.prototype.setStyle = function (st) {
    var preview = this.children.preview;
    preview.setStyle(st);
    this.showOrHideText();
};
StylePreview.prototype.previewStyleChange = function (skin) {
    var preview = this.children.preview;
    preview.setLocalTheme(skin);
    this.showOrHideText();
};
StylePreview.prototype.showOrHideText = function () {
    var preview = this.children.preview,
        jsData;
    jsData = preview.getStyleData().jsData;
    if (hasTextAttributes(jsData)) {
        if (!this.textVisible) {
            preview.setInnerText('Abc');
            this.textVisible = true;
        }
    } else {
        if (this.textVisible) {
            preview.setInnerText('');
            delete this.textVisible;
        }
    }
};

exports.StylePreview = StylePreview;
