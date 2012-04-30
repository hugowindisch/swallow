/**
    StylingHeading.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StylingHeading(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StylingHeading);
}
StylingHeading.prototype = new (domvisual.DOMElement)();
StylingHeading.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StylingHeading = StylingHeading;
