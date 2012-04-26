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
        this.selected = true;
        this.setUrl(featureUrl(n, true));
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
StyleFeatureSelector.prototype.setEditedStyle = function (st) {
    // cannot work
/*    var children = this.children;
    forEachProperty(children, function (ch, name) {
        ch.setUrl(featureUrl(name, Boolean(st[name])));
    });*/
};
StyleFeatureSelector.prototype.clearFeatureHighlight = function (feature) {
    var children = this.children;
    children[feature].setUrl(featureUrl(feature, false));
};

exports.StyleFeatureSelector = StyleFeatureSelector;
