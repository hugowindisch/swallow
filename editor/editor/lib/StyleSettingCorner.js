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
        that.editedFeature.radius = v;
        that.updateInput();
        that.emit(sliding ? 'preview' : 'change', that.feature, that.editedFeature);
    });
    children.radiusValue.on('change', function (v) {
        var n = limitRange(this.getValue(), 0, 1000);
        that.editedFeature.radius = n;
        that.updateSlider();
        that.emit('change', that.feature, that.editedFeature);
    });
    children.clear.on('click', function () {
        that.emit('reset', that.feature);
    });
}
StyleSettingCorner.prototype = new (domvisual.DOMElement)();
StyleSettingCorner.prototype.getConfigurationSheet = function () {
    return { label: null, feature: null };
};
StyleSettingCorner.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingCorner.prototype.setFeature = function (feature) {
    this.feature = feature;
};
StyleSettingCorner.prototype.setStyleData = function (st) {
    var children = this.children,
        editedFeature;
    if (st) {
        editedFeature = deepCopy(st.jsData[this.feature]);
        if (!editedFeature) {
            editedFeature = { radius: 0 };
        }
    } else {
        editedFeature = { radius: 0 };
    }
    this.editedFeature = editedFeature;
    this.updateSlider();
    this.updateInput();
};

StyleSettingCorner.prototype.updateSlider = function () {
    this.children.radiusSlider.setValue(this.editedFeature.radius);
};
StyleSettingCorner.prototype.updateInput = function () {
    this.children.radiusValue.setValue(Number(this.editedFeature.radius).toFixed(1));
};

exports.StyleSettingCorner = StyleSettingCorner;
