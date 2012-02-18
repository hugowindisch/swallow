/**
    Layering.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function Layering(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Layering);
}
Layering.prototype = new (domvisual.DOMElement)();
Layering.prototype.setTypeInfo = function (ti) {
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
};
Layering.prototype.getConfigurationSheet = function () {
    return { typeInfo: {} };
};

exports.Layering = Layering;
