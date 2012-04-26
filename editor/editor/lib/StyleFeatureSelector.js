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

function featureUrl(feature, selected) {
    return 'editor/lib/sp_' + feature + (selected ? '_s.png' : '.png');
}
function StyleFeatureSelector(config) {
    var that = this,
        children;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleFeatureSelector);
    children = this.children;
    function toggleChild() {
        var n = this.name;
        that.emit('select', n);
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
StyleFeatureSelector.prototype.setStyleData = function (st) {
    var jsData = {},
        children = this.children;
    if (st && st.jsData) {
        jsData = st.jsData;
    }
    forEachProperty(children, function (ch, name) {
        ch.setUrl(featureUrl(name, Boolean(jsData[name])));
    });
};
StyleFeatureSelector.prototype.clearFeatureHighlight = function (feature) {
    var children = this.children;
    children[feature].setUrl(featureUrl(feature, false));
};
StyleFeatureSelector.prototype.setFeatureHighlight = function (feature) {
    var children = this.children;
    children[feature].setUrl(featureUrl(feature, true));
};

exports.StyleFeatureSelector = StyleFeatureSelector;
