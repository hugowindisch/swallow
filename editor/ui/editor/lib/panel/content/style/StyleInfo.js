/**
    StyleInfo.js

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
    groups = require('/editor/lib/definition').definition.groups,
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
    children.label.setOverflow('hidden');
    preview.setOverflow('hidden');
    innerPreview = new (domvisual.DOMElement)();
    preview.addChild(innerPreview, 'preview');
    innerPreview.setDimensions(preview.dimensions.slice(0));
    innerPreview.setTranslationMatrix([0, 0, 0]);
}
StyleInfo.prototype = new (domvisual.DOMElement)();
StyleInfo.prototype.theme = new (visual.Theme)({
    background: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'controlBackground' }
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
