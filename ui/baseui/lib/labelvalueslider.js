/**
    LabelValueSlider.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    limitRange = utils.limitRange,
    group = {
        dimensions: [360, 25, 0],
        positions: {
            label: {
                order: 0,
                matrix: [ 60, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
            },
            value: {
                order: 0,
                matrix: [ 60, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   65, 0, 0, 1],
                snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
            },
            slider: {
                order: 0,
                matrix: [ 180, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   130, 0, 0, 1],
                snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
            }
        },
        children: {
            label: {
                factory: "baseui",
                type: "Label",
                position: "label",
                config: { text: "Size:"}
            },
            value: {
                factory: "domvisual",
                type: "DOMInput",
                position: "value",
                config: { text: "0"}
            },
            slider: {
                factory: "baseui",
                type: "Slider",
                position: "slider",
                config: { value: 0, minValue: 0, maxValue: 50 }
            }
        }
    };

function LabelValueSlider(config) {
    this.defaultValue = 0;
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var children = this.children,
        that = this;
    children.slider.on('change', function (v, sliding) {
        that.value = v;
        that.updateInput();
        that.emit(sliding ? 'preview' : 'change', v);
    });
    children.value.on('change', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var n = limitRange(this.getValue(), 0, 1000);
        that.value = n;
        that.updateSlider();
        that.emit('change', n);
    });
}
LabelValueSlider.prototype = new (domvisual.DOMElement)();
LabelValueSlider.prototype.getConfigurationSheet = function () {
    return { label: null, value: null, minValue: null, maxValue: null, defaultValue: null };
};
LabelValueSlider.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
    return this;
};
LabelValueSlider.prototype.setValue = function (v) {
    if (v) {
        this.value = v;
    }
    this.updateSlider();
    this.updateInput();
    return this;
};
LabelValueSlider.prototype.setDefaultValue = function (v) {
    this.defaultValue = v;
    return this;
};
LabelValueSlider.prototype.setMinValue = function (v) {
    this.children.slider.setMinValue(v);
    return this;
};
LabelValueSlider.prototype.setMaxValue = function (v) {
    this.children.slider.setMaxValue(v);
    return this;
};
LabelValueSlider.prototype.updateSlider = function () {
    this.children.slider.setValue(this.value || 0);
};
LabelValueSlider.prototype.updateInput = function () {
    this.children.value.setValue(Number(this.value || 0).toFixed(1));
};
LabelValueSlider.prototype.setSliderBarStyleAttributes = function (a) {
    this.children.slider.setBackgroundStyleAttributes(a);
};

exports.LabelValueSlider = LabelValueSlider;
