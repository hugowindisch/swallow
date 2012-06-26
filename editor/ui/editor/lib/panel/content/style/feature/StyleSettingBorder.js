/**
    StyleSettingBorder.js

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
    ImageOption = require('/editor/lib/panel/ImageOption').ImageOption,
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    apply = utils.apply;

function StyleSettingBorder(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingBorder);
    var children = this.children,
        that = this;
    this.borderStyle = new ImageOption({
        'solid':  [ 'editor/img/bssolid_s.png', 'editor/img/bssolid.png', children.styleSolid ],
        'dashed': [ 'editor/img/bsdashed_s.png', 'editor/img/bsdashed.png', children.styleDashed ],
        'dotted': [ 'editor/img/bsdotted_s.png', 'editor/img/bsdotted.png', children.styleDotted ],
        'none': [ 'editor/img/bsnone_s.png', 'editor/img/bsnone.png', children.styleNone ]
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
