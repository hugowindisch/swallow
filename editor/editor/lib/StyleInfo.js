/**
    StyleInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    hasTextAttributes = domvisual.hasTextAttributes;

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

    innerPreview.setStyle(st.factory === null ? st.style : st);
    label.setText(st.style);
    this.editedStyle = st;
    this.showOrHideText();
};
StyleInfo.prototype.getEditedStyle = function () {
    return this.editedStyle;
};
StyleInfo.prototype.highlight = function (selected) {
    this.children.selectionBox.setVisible(selected);
};
StyleInfo.prototype.previewStyleChange = function (localTheme) {
    var children = this.children,
        preview = children.preview,
        innerPreview = preview.children.preview,
        st = this.editedStyle;
    innerPreview.setLocalTheme(localTheme);
    innerPreview.setSkin(localTheme.getSkin(), true);
    this.showOrHideText();
    this.showStyleDecoration(localTheme.getStyleDecoration(
        this.editedStyle.factory,
        this.editedStyle.type,
        this.editedStyle.style
    ));
};
StyleInfo.prototype.showOrHideText = function () {
    var children = this.children,
        preview = children.preview,
        innerPreview = preview.children.preview,
        jsData;
    jsData = innerPreview.getStyleData().jsData;
    if (hasTextAttributes(jsData)) {
        if (!this.textVisible) {
            innerPreview.setInnerText('Abc');
            this.textVisible = true;
        }
    } else {
        if (this.textVisible) {
            innerPreview.setInnerText('');
            delete this.textVisible;
        }
    }
};
StyleInfo.prototype.showStyleDecoration = function (decoration) {
    if (decoration !== this.decoration) {
        this.decoration = decoration;
        var deco = this.getChild('decoration');
        switch (decoration) {
        case 'sublocal':
            deco.setUrl('editor/img/sublocal.png');
            deco.setVisible(true);
            break;
        case 'subremote':
            deco.setUrl('editor/img/subremote.png');
            deco.setVisible(true);
            break;
        case 'skin':
            deco.setUrl('editor/img/skin.png');
            deco.setVisible(true);
            break;
        default:
            deco.setVisible(false);
            break;
        }
    }
};
exports.StyleInfo = StyleInfo;
