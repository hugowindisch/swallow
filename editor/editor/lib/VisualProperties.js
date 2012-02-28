/**
    VisualProperties.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function VisualProperties(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualProperties);
}
VisualProperties.prototype = new (domvisual.DOMElement)();
VisualProperties.prototype.getConfigurationSheet = function () {
    return { typeInfo: {} };
};


exports.VisualProperties = VisualProperties;
