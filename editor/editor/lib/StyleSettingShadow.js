/**
    StyleSettingShadow.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleSettingShadow(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingShadow);
}
StyleSettingShadow.prototype = new (domvisual.DOMElement)();
StyleSettingShadow.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StyleSettingShadow = StyleSettingShadow;
