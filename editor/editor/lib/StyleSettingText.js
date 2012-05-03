/**
    StyleSettingText.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleSettingText(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingText);
}
StyleSettingText.prototype = new (domvisual.DOMElement)();
StyleSettingText.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingText.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingText.prototype.setStyleData = function (st) {
    var children = this.children,
        styleData;
    this.styleData = {
        family: st.family || '',
        color: st.color,
        size: st.size || 8,
        style: st.style || 'normal',
    };
//    this.updateSlider();
//    this.updateInput();
};

exports.StyleSettingText = StyleSettingText;
