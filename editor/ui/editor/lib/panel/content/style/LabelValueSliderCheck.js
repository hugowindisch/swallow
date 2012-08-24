/**
    LabelValueSliderCheck.js

    The SwallowApps Editor, an interactive application builder for creating
    html applications.

    Copyright (C) 2012  Hugo Windisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    isNumber = utils.isNumber,
    limitRange = utils.limitRange,
    groups = require('/editor/lib/definition').definition.groups;

function LabelValueSliderCheck(config) {
    this.value = null;
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
    children.value.on('change', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
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
    return { label: null, value: null, minValue: null, maxValue: null, check: null, checkVisible: null };
};
LabelValueSliderCheck.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
    return this;
};
LabelValueSliderCheck.prototype.setValue = function (v) {
    if (isNumber(v)) {
        this.value = v;
    } else {
        this.value = null;
    }
    this.updateSlider();
    this.updateInput();
    this.updateCheck();
    return this;
};
LabelValueSliderCheck.prototype.getValue = function () {
    return this.value;
};
LabelValueSliderCheck.prototype.setMinValue = function (v) {
    this.children.slider.setMinValue(v);
    return this;
};
LabelValueSliderCheck.prototype.setMaxValue = function (v) {
    this.children.slider.setMaxValue(v);
    return this;
};
LabelValueSliderCheck.prototype.setCheck = function (c) {
    this.children.check.setValue(c);
    return this;
};
LabelValueSliderCheck.prototype.updateSlider = function () {
    this.children.slider.setValue(this.value || 0);
};
LabelValueSliderCheck.prototype.updateInput = function () {
    this.children.value.setValue(Number(this.value || 0).toFixed(1));
};
LabelValueSliderCheck.prototype.updateCheck = function () {
    this.children.check.setValue(this.value !== null);
};
LabelValueSliderCheck.prototype.setCheckVisible = function (visible) {
    this.children.check.setVisible(visible);
};

exports.LabelValueSliderCheck = LabelValueSliderCheck;
