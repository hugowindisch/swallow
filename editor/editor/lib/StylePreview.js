/**
    StylePreview.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach;
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
};
StylePreview.prototype.previewStyleChange = function (skin) {
    var preview = this.children.preview;
    preview.setLocalTheme(skin);
};

exports.StylePreview = StylePreview;
