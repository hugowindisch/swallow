/**
    StyleSettingBackground.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleSettingBackground(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingBackground);
}
StyleSettingBackground.prototype = new (domvisual.DOMElement)();
StyleSettingBackground.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StyleSettingBackground = StyleSettingBackground;
