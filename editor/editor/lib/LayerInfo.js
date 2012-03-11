/**
    LayerInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function LayerInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LayerInfo);
}
LayerInfo.prototype = new (domvisual.DOMElement)();
LayerInfo.prototype.setTypeInfo = function (ti) {
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
};
LayerInfo.prototype.getConfigurationSheet = function () {
    return { contentName: {} };
};
LayerInfo.prototype.setContentName = function (txt) {
    this.children.name.setText(txt);
};
exports.LayerInfo = LayerInfo;
