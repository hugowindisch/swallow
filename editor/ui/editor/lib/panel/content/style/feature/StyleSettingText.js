/**
    StyleSettingText.js

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
    apply = utils.apply,
    genericFamilies = [ 'serif', 'sans-serif', 'cursive', 'fantasy', 'monospace' ];

function StyleSettingText(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingText);
    var children = this.children,
        that = this;

    this.fontWeight = new ImageOption({
        'normal':  [ 'editor/img/fsnormal_s.png', 'editor/img/fsnormal.png', children.fontWeightNormal ],
        'bold': [ 'editor/img/fsbold_s.png', 'editor/img/fsbold.png', children.fontWeightBold ]
    }, children.fontWeightCheck);


    this.fontWeight.on('change', function (v) {
        if (v === undefined) {
            delete that.styleData.weight;
        } else {
            that.styleData.weight = v;
        }
        that.emit('change', that.styleData);
    });
    this.textAlign = new ImageOption({
        'left':  [ 'editor/img/faleft_s.png', 'editor/img/faleft.png', children.textAlignLeft ],
        'right':  [ 'editor/img/faright_s.png', 'editor/img/faright.png', children.textAlignRight ],
        'center':  [ 'editor/img/facenter_s.png', 'editor/img/facenter.png', children.textAlignCenter ],
        'justify':  [ 'editor/img/fajustify_s.png', 'editor/img/fajustify.png', children.textAlignJustify ]
    }, children.textAlignCheck);

    this.textAlign.on('change', function (v) {
        if (v === undefined) {
            delete that.styleData.align;
        } else {
            that.styleData.align = v;
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
//        evt.preventDefault();
//        evt.stopPropagation();
        children.fontFamilyCheck.setValue(true);
        that.styleData.family = this.getSelectedItem();
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
StyleSettingText.prototype.setEditor = function (editor) {
    this.editor = editor;
};

StyleSettingText.prototype.setStyleData = function (st) {
    var children = this.children,
        families = this.editor.editConfig.fonts || genericFamilies;
    this.styleData = apply({}, st);

    this.fontWeight.setSelectedValue(this.styleData.weight);
    this.textAlign.setSelectedValue(this.styleData.align);
    children.fontSize.setValue(this.styleData.size);

    children.fontFamily.setItems(families);
    children.fontFamily.setSelectedItem(this.styleData.family);

    children.fontFamilyCheck.setValue(this.styleData.family !== undefined);
    children.color.setValue(st.color || { r: 0, g: 0, b: 0, a: 1});

    children.colorCheck.setValue(st.color);
};

exports.StyleSettingText = StyleSettingText;
