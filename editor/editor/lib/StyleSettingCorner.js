/**
    StyleSettingCorner.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    limitRange = utils.limitRange,
    deepCopy = utils.deepCopy,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleSettingCorner(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingCorner);
    var children = this.children,
        that = this;
    children.radiusSlider.on('change', function (v, sliding) {
        that.styleData.radius = v;
        that.updateInput();
        that.emit(sliding ? 'preview' : 'change', that.styleData);
    });
    children.radiusValue.on('change', function (v) {
        var n = limitRange(this.getValue(), 0, 1000);
        that.styleData.radius = n;
        that.updateSlider();
        that.emit('change', that.styleData);
    });
    children.clear.on('click', function () {
        that.emit('reset');
    });
}
StyleSettingCorner.prototype = new (domvisual.DOMElement)();
StyleSettingCorner.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingCorner.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingCorner.prototype.setStyleData = function (st) {
    var children = this.children,
        styleData;
    this.styleData = {
        radius: st.radius || 0
    };
    this.updateSlider();
    this.updateInput();
};

StyleSettingCorner.prototype.updateSlider = function () {
    this.children.radiusSlider.setValue(this.styleData.radius);
};
StyleSettingCorner.prototype.updateInput = function () {
    this.children.radiusValue.setValue(Number(this.styleData.radius).toFixed(1));
};

exports.StyleSettingCorner = StyleSettingCorner;
