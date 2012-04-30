/**
    StyleName.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleName(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleName);
}
StyleName.prototype = new (domvisual.DOMElement)();
StyleName.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StyleName = StyleName;
