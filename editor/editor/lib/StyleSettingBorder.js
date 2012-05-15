/**
    StyleSettingBorder.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    ImageOption = require('./ImageOption').ImageOption,
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    apply = utils.apply;

function StyleSettingBorder(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingBorder);
    var children = this.children,
        that = this;
    this.borderStyle = new ImageOption({
        'solid':  [ 'editor/lib/bssolid_s.png', 'editor/lib/bssolid.png', children.styleSolid ],
        'dashed': [ 'editor/lib/bsdashed_s.png', 'editor/lib/bsdashed.png', children.styleDashed ],
        'dotted': [ 'editor/lib/bsdotted_s.png', 'editor/lib/bsdotted.png', children.styleDotted ],
        'none': [ 'editor/lib/bsnone_s.png', 'editor/lib/bsnone.png', children.styleNone ]
    }, children.styleCheck);

    this.borderStyle.on('change', function (v) {
        if (v === undefined) {
            delete that.styleData.style;
        } else {
            that.styleData.style = v;
        }
        that.emit('change', that.styleData, children.synchCheck.getValue());
    });
    children.width.on('change', function (v) {
        if (v === undefined) {
            delete that.styleData.width;
        } else {
            that.styleData.width = v;
        }
        that.emit('change', that.styleData, children.synchCheck.getValue());
    });
    children.width.on('preview', function (v) {
        if (v === undefined) {
            delete that.styleData.width;
        } else {
            that.styleData.width = v;
        }
        that.emit('preview', that.styleData, children.synchCheck.getValue());
    });
    children.colorCheck.on('click', function (v) {
        delete that.styleData.color;
        that.emit('change', that.styleData, children.synchCheck.getValue());
    });
    children.color.on('change', function (v) {
        that.styleData.color = v;
        children.colorCheck.setValue(true);
        that.emit('change', that.styleData, children.synchCheck.getValue());
    });
    children.color.on('preview', function (v) {
        that.styleData.color = v;
        children.colorCheck.setValue(true);
        that.emit('preview', that.styleData, children.synchCheck.getValue());
    });

    children.clear.on('click', function () {
        that.styleData = {};
        that.emit('reset', that.styleData, children.synchCheck.getValue());
    });
}
StyleSettingBorder.prototype = new (domvisual.DOMElement)();
StyleSettingBorder.prototype.getConfigurationSheet = function () {
    return {  };
};
StyleSettingBorder.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingBorder.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingBorder.prototype.setStyleData = function (st) {
    var children = this.children;
    this.styleData = apply({}, st);
    this.borderStyle.setSelectedValue(this.styleData.style);
    children.width.setValue(this.styleData.width);
    children.color.setValue(st.color || { r: 0, g: 0, b: 0, a: 1});
    children.colorCheck.setValue(st.color);
};

exports.StyleSettingBorder = StyleSettingBorder;
