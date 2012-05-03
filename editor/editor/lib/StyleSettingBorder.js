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
StyleSettingBorder.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingBorder.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingBorder.prototype.setStyleData = function (st) {
    var children = this.children,
        styleData;
    this.styleData = {
        style: st.style || 'none',
        color: st.color,
        width: st.width || 0
    };
//    this.updateSlider();
//    this.updateInput();
};

exports.StyleSettingBorder = StyleSettingBorder;
