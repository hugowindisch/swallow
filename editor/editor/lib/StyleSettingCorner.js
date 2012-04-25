/**
    StyleSettingCorner.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    deepCopy = utils.deepCopy,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleSettingCorner(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingCorner);
    var children = this.children,
        that = this;
    children.radiusSlider.on('change', function (v, sliding) {
        children.radiusValue.setValue(v);
        if (!sliding) {
            that.emit('change', that.feature, this.getValue());
        }
    });
    children.radiusValue.on('change', function (v) {
        that.emit('change', Number(this.getValue()));
        that.emit('change', that.feature, this.getValue());
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
StyleSettingCorner.prototype.setEditedStyle = function (st) {
    if (st) {
        this.editedFeature = deepCopy(st[this.feature]);
        if (!this.editedFeature) {
            this.editedFeature = {};
        }
    } else {
        this.editedFeature = {};
    }
};
exports.StyleSettingCorner = StyleSettingCorner;
