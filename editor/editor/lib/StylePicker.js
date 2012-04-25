/**
    StylePicker.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StylePicker(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StylePicker);
}
StylePicker.prototype = new (domvisual.DOMElement)();
StylePicker.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StylePicker = StylePicker;
