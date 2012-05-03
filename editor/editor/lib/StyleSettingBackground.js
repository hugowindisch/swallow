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
StyleSettingBackground.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingBackground.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingBackground.prototype.setStyleData = function (st) {
    var children = this.children,
        styleData;
    this.styleData = {
        color: st.color
    };
//    this.updateSlider();
//    this.updateInput();
};

exports.StyleSettingBackground = StyleSettingBackground;
