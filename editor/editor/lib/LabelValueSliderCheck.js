/**
    LabelValueSliderCheck.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    limitRange = utils.limitRange,
    groups = require('./definition').definition.groups;

function LabelValueSliderCheck(config) {
    this.defaultValue = 0;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LabelValueSliderCheck);
    var children = this.children,
        that = this;
    children.slider.on('change', function (v, sliding) {
        that.value = v;
        that.updateCheck();
        that.updateInput();
        that.emit(sliding ? 'preview' : 'change', v);
    });
    children.value.on('change', function () {
        var n = limitRange(this.getValue(), 0, 1000);
        that.value = n;
        that.updateCheck();
        that.updateSlider();
        that.emit('change', n);
    });
    children.check.on('change', function (s) {
        if (!s) {
            delete that.value;
        } else {
            that.value = 0;
        }
        that.updateSlider();
        that.updateInput();
        that.emit('change', that.value);
    });

}
LabelValueSliderCheck.prototype = new (domvisual.DOMElement)();
LabelValueSliderCheck.prototype.getConfigurationSheet = function () {
    return { label: null, value: null, minValue: null, maxValue: null, defaultValue: null, check: null };
};
LabelValueSliderCheck.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
LabelValueSliderCheck.prototype.setValue = function (v) {
    if (v) {
        this.value = v;
    }
    this.updateSlider();
    this.updateInput();
    this.updateCheck();
};
LabelValueSliderCheck.prototype.setDefaultValue = function (v) {
    this.defaultValue = v;
};
LabelValueSliderCheck.prototype.setMinValue = function (v) {
    this.children.slider.setMinValue(v);
};
LabelValueSliderCheck.prototype.setMaxValue = function (v) {
    this.children.slider.setMaxValue(v);
};
LabelValueSliderCheck.prototype.setCheck = function (c) {
    this.children.check.setValue(c);
};
LabelValueSliderCheck.prototype.updateSlider = function () {
    this.children.slider.setValue(this.value || 0);
};
LabelValueSliderCheck.prototype.updateInput = function () {
    this.children.value.setValue(Number(this.value || 0).toFixed(1));
};
LabelValueSliderCheck.prototype.updateCheck = function () {
    this.children.check.setValue(this.value !== undefined);
};

exports.LabelValueSliderCheck = LabelValueSliderCheck;
