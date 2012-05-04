/**
    StyleSettingText.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    ImageOption = require('./ImageOption').ImageOption,
    utils = require('utils'),
    apply = utils.apply;

function StyleSettingText(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingText);
    var children = this.children,
        that = this;

    this.fontWeight = new ImageOption({
        'solid':  [ 'editor/lib/fsnormal_s.png', 'editor/lib/fsnormal.png', children.fontWeightNormal ],
        'dashed': [ 'editor/lib/fsbold_s.png', 'editor/lib/fsbold.png', children.fontWeightBold ],
        'dotted': [ 'editor/lib/fsbolder_s.png', 'editor/lib/fsbolder.png', children.fontWeightBolder ],
        'none': [ 'editor/lib/fslight_s.png', 'editor/lib/fslight.png', children.fontWeightLighter ]
    }, children.fontWeightCheck);


    this.fontWeight.on('change', function (v) {
        if (v === undefined) {
            delete that.styleData.fontWeight;
        } else {
            that.styleData.fontWeight = v;
        }
        that.emit('change', that.styleData);
    });
    children.fontSize.on('change', function (v) {
        if (v === undefined) {
            delete that.styleData.fontSize;
        } else {
            that.styleData.fontSize = v;
        }
        that.emit('change', that.styleData);
    });
    children.fontSize.on('preview', function (v) {
        if (v === undefined) {
            delete that.styleData.fontSize;
        } else {
            that.styleData.fontSize = v;
        }
        that.emit('preview', that.styleData);
    });
    children.fontFamily.on('change', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        children.fontFamilyCheck.setValue(true);
        that.styleData.fontFamily = this.getValue();
        that.emit('preview', that.styleData);
    });
    children.fontFamilyCheck.on('change', function (v) {
        if (!v) {
            delete that.styleData.fontFamily;
        } else {
            that.styleData.fontFamily = '';
        }
        that.emit('preview', that.styleData);
    });
    children.clear.on('click', function () {
        that.styleData = {};
        that.emit('reset', that.styleData);
    });


}
StyleSettingText.prototype = new (domvisual.DOMElement)();
StyleSettingText.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingText.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingText.prototype.setStyleData = function (st) {
    var children = this.children;
    this.styleData = apply({}, st);

    this.fontWeight.setSelectedValue(this.styleData.fontWeight);
    children.fontSize.setValue(this.styleData.fontSize);
    children.fontFamily.setValue(this.styleData.fontFamily || '');
    children.fontFamilyCheck.setValue(this.styleData.fontFamily !== undefined);
};

exports.StyleSettingText = StyleSettingText;
