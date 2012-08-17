/**
    StyleSettingBackgroundImageImage.js

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
    utils = require('utils'),
    isArray = utils.isArray,
    deepCopy = utils.deepCopy,
    groups = require('/editor/lib/definition').definition.groups;

function StyleSettingBackgroundImage(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingBackgroundImage);
    var children = this.children,
        that = this;
    this.getChild('gradient').on('preview', function (v) {
        that.updateData(v);
        that.emit('preview', that.styleData);
    });
    this.getChild('gradient').on('change', function (v) {
        that.updateData(v);
        that.emit('change', that.styleData);
    });
    this.getChild('clear').on('click', function () {
        that.emit('reset', {});
    });

}
StyleSettingBackgroundImage.prototype = new (domvisual.DOMElement)();
StyleSettingBackgroundImage.prototype.getConfigurationSheet = function () {
    return {  };
};
StyleSettingBackgroundImage.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingBackgroundImage.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingBackgroundImage.prototype.getNewGradient = function () {
    return {
        stops: [0, 1],
        colors: [
            {r: 0, g: 0, b: 0, a: 1},
            {r: 255, g: 255, b: 255, a: 1}
        ],
        type: 'vertical'
    };
};
StyleSettingBackgroundImage.prototype.getDefaultStyleData = function () {
    return {
        bgi: [ this.getNewGradient() ]
    };
};
StyleSettingBackgroundImage.prototype.setStyleData = function (st) {
    var sd = this.styleData = deepCopy(st),
        bgi = sd.bgi,
        that = this;
    if (!isArray(bgi)) {
        bgi = sd.bgi = [sd.bgi];
    }
    if (!bgi || !bgi[0].stops || bgi[0].stops.length < 2) {
        sd = this.styleData = this.getDefaultStyleData();
        bgi = sd.bgi;
    }
    this.getChild('itemList').addItems(bgi.length
    ).on('delete', function (n) {
        this.deleteItem(n);
        that.deleteData(n);
    }).on('select', function (n) {
        this.selectItem(n);
        that.selectData(n);
    }).selectItem(0);
    this.selectData(0);

};

StyleSettingBackgroundImage.prototype.selectData = function (n) {
    this.selected = n;
    var dat = this.styleData.bgi[n];
    if (!dat) {
        dat = this.styleData.bgi[n] = this.getNewGradient();
    }
    this.getChild('gradient').setValue(dat);
};

StyleSettingBackgroundImage.prototype.deleteData = function (n) {
    delete this.styleData.bgi[n];
    this.selectData(0);
    this.emit('change', this.styleData);
};


StyleSettingBackgroundImage.prototype.updateData = function (d) {
    if (this.selected !== undefined) {
        this.styleData.bgi[this.selected] = d;
    }
};

exports.StyleSettingBackgroundImage = StyleSettingBackgroundImage;
