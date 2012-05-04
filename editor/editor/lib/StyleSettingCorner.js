/**
    StyleSettingCorner.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    utils = require('utils'),
    limitRange = utils.limitRange,
    deepCopy = utils.deepCopy,
    apply = utils.apply;

function StyleSettingCorner(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingCorner);
    var children = this.children,
        that = this;
    function setRadius(v) {
        if (v === undefined) {
            delete that.styleData.radius;
        } else {
            that.styleData.radius = v;
        }
        return that.styleData;
    }
    children.radius.on('change', function (v) {
        that.emit('change', setRadius(v));
    });
    children.radius.on('preview', function (v) {
        that.emit('preview', setRadius(v));
    });
    children.clear.on('click', function () {
        that.styleData = {};
        that.emit('reset', that.styleData);
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
    var children = this.children;
    this.styleData = apply({}, st);
    children.radius.setValue(this.styleData.radius);
};

exports.StyleSettingCorner = StyleSettingCorner;
