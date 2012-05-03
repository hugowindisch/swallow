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
    return { label: null };
};
StyleSettingShadow.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingShadow.prototype.setStyleData = function (st) {
    var children = this.children,
        styleData;
    this.styleData = {
        color: st.shadow
    };
//    this.updateSlider();
//    this.updateInput();
};


exports.StyleSettingShadow = StyleSettingShadow;
