/**
    StyleFeatureSelector.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;
function StyleFeatureSelector(config) {
    var that = this,
        children;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleFeatureSelector);
    children = this.children;
    function toggleChild() {
        var n = this.name;
        this.selected = !this.selected;
        this.setUrl('editor/lib/sp_' + n + (this.selected ? '_s.png' : '.png'));
    }
    forEachProperty(children, function (c) {
        c.on('click', toggleChild);
        c.setCursor('pointer');
    });
}
StyleFeatureSelector.prototype = new (domvisual.DOMElement)();
StyleFeatureSelector.prototype.getConfigurationSheet = function () {
    return { editedStyle: null };
};
StyleFeatureSelector.prototype.setEditedStyle = function (st) {
/*    var children = this.children,
        preview = children.preview;

    preview.setStyle(st);
    preview.setInnerText(st.style);
    this.editedStyle = st;*/
};
StyleFeatureSelector.prototype.getEditedStyle = function () {
//    return this.editedStyle;
};

exports.StyleFeatureSelector = StyleFeatureSelector;
