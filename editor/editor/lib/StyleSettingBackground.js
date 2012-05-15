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
    var children = this.children,
        that = this;

    children.colorCheck.on('click', function (v) {
        delete that.styleData.color;
        that.emit('change', that.styleData);
    });
    children.color.on('change', function (v) {
        that.styleData.color = v;
        children.colorCheck.setValue(true);
        that.emit('change', that.styleData);
    });
    children.color.on('preview', function (v) {
        that.styleData.color = v;
        children.colorCheck.setValue(true);
        that.emit('preview', that.styleData);
    });
    children.clear.on('click', function () {
        that.styleData = {};
        that.emit('reset', that.styleData);
    });
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

    children.color.setValue(st.color || { r: 0, g: 0, b: 0, a: 1});
    children.colorCheck.setValue(st.color);
};

exports.StyleSettingBackground = StyleSettingBackground;
