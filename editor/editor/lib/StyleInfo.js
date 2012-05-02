/**
    StyleInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleInfo);
    var that = this,
        children = this.children,
        preview = children.preview,
        innerPreview;
    this.setCursor('pointer');
    this.highlight(false);
    children.label.setChildrenClipping('hidden');
    preview.setChildrenClipping('hidden');
    innerPreview = new (domvisual.DOMElement)();
    preview.addChild(innerPreview, 'preview');
    innerPreview.setDimensions(preview.dimensions.slice(0));
    innerPreview.setTranslationMatrix([0, 0, 0]);
}
StyleInfo.prototype = new (domvisual.DOMElement)();
StyleInfo.prototype.theme = new (visual.Theme)({
    background: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'pressedButtonBackground' }
        ]
    }
});
StyleInfo.prototype.getConfigurationSheet = function () {
    return { editedStyle: null };
};
StyleInfo.prototype.setEditedStyle = function (st) {
    var children = this.children,
        preview = children.preview,
        innerPreview = preview.children.preview,
        label = children.label;

    innerPreview.setInnerText('Abc');
    innerPreview.setStyle(st.factory === null ? st.style : st);
    label.setText(st.style);

    this.editedStyle = st;
};
StyleInfo.prototype.getEditedStyle = function () {
    return this.editedStyle;
};
StyleInfo.prototype.highlight = function (selected) {
    this.children.selectionBox.setVisible(selected);
};
StyleInfo.prototype.previewStyleChange = function (skin) {
    var children = this.children,
        preview = children.preview,
        innerPreview = preview.children.preview;
    innerPreview.setLocalTheme(skin);
};

exports.StyleInfo = StyleInfo;
