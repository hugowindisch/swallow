/**
    LabelValueSliderCheck.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function LabelValueSliderCheck(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LabelValueSliderCheck);
}
LabelValueSliderCheck.prototype = new (domvisual.DOMElement)();
LabelValueSliderCheck.prototype.getConfigurationSheet = function () {
    return { label: null, value: null, minValue: null, maxValue: null, check: null };
};
LabelValueSliderCheck.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
LabelValueSliderCheck.prototype.setValue = function (v) {
};
LabelValueSliderCheck.prototype.setMinValue = function (v) {
};
LabelValueSliderCheck.prototype.setMaxValue = function (v) {
};
LabelValueSliderCheck.prototype.setCheck = function (c) {
//    this.children.check.setCheck(c);
};

exports.LabelValueSliderCheck = LabelValueSliderCheck;
