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
        'normal':  [ 'editor/lib/fsnormal_s.png', 'editor/lib/fsnormal.png', children.fontWeightNormal ],
        'bold': [ 'editor/lib/fsbold_s.png', 'editor/lib/fsbold.png', children.fontWeightBold ],
        'bolder': [ 'editor/lib/fsbolder_s.png', 'editor/lib/fsbolder.png', children.fontWeightBolder ],
        'lighter': [ 'editor/lib/fslight_s.png', 'editor/lib/fslight.png', children.fontWeightLighter ]
    }, children.fontWeightCheck);


    this.fontWeight.on('change', function (v) {
        if (v === undefined) {
            delete that.styleData.weight;
        } else {
            that.styleData.weight = v;
        }
        that.emit('change', that.styleData);
    });
    children.fontSize.on('change', function (v) {
        if (v === undefined) {
            delete that.styleData.size;
        } else {
            that.styleData.size = v;
        }
        that.emit('change', that.styleData);
    });
    children.fontSize.on('preview', function (v) {
        if (v === undefined) {
            delete that.styleData.size;
        } else {
            that.styleData.size = v;
        }
        that.emit('preview', that.styleData);
    });
    children.fontFamily.on('change', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        children.fontFamilyCheck.setValue(true);
        that.styleData.family = this.getValue();
        that.emit('change', that.styleData);
    });
    children.fontFamilyCheck.on('change', function (v) {
        if (!v) {
            delete that.styleData.family;
        } else {
            that.styleData.family = '';
        }
        that.emit('change', that.styleData);
    });
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

    this.fontWeight.setSelectedValue(this.styleData.weight);
    children.fontSize.setValue(this.styleData.size);
    children.fontFamily.setValue(this.styleData.family || '');
    children.fontFamilyCheck.setValue(this.styleData.family !== undefined);
    children.color.setValue(st.color || { r: 0, g: 0, b: 0, a: 1});
};

exports.StyleSettingText = StyleSettingText;
