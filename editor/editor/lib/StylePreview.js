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
StylePreview.prototype.setEditedStyle = function (st) {
    this.children.preview.setStyle(st);
/*    var children = this.children,
        preview = children.preview;

    preview.setStyle(st);
    preview.setInnerText(st.style);
    this.editedStyle = st;*/
};

exports.StylePreview = StylePreview;
