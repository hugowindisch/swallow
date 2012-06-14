/**
    StylePreview.js

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
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    hasTextAttributes = domvisual.hasTextAttributes;

function StylePreview(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StylePreview);
    this.setOverflow('hidden');
}
StylePreview.prototype = new (domvisual.DOMElement)();
StylePreview.prototype.getConfigurationSheet = function () {
    return { editedStyle: null };
};
StylePreview.prototype.setStyle = function (st) {
    var preview = this.children.preview;
    preview.setStyle(st);
    this.showOrHideText();
};
StylePreview.prototype.previewStyleChange = function (localTheme) {
    var preview = this.children.preview,
        skin = localTheme.getSkin();
    preview.setLocalTheme(localTheme);
    preview.setSkin(skin);
    this.showOrHideText();
};
StylePreview.prototype.showOrHideText = function () {
    var preview = this.children.preview,
        jsData;
    jsData = preview.getStyleData().jsData;
    if (hasTextAttributes(jsData)) {
        if (!this.textVisible) {
            preview.setInnerText('Abc');
            this.textVisible = true;
        }
    } else {
        if (this.textVisible) {
            preview.setInnerText('');
            delete this.textVisible;
        }
    }
};

exports.StylePreview = StylePreview;
