/**
    StyleSettingBorder.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleSettingBorder(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingBorder);
}
StyleSettingBorder.prototype = new (domvisual.DOMElement)();
StyleSettingBorder.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StyleSettingBorder = StyleSettingBorder;
