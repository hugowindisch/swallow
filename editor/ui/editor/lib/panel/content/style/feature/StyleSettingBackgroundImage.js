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
    deepCopy = utils.deepCopy,
    groups = require('/editor/lib/definition').definition.groups;

function StyleSettingBackgroundImage(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingBackgroundImage);
    var children = this.children,
        that = this;
    this.getChild('gradient').on('preview', function (v) {
        that.styleData = { bgi: v };
        that.emit('preview', that.styleData);
    });
    this.getChild('gradient').on('change', function (v) {
        that.styleData = { bgi: v };
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
StyleSettingBackgroundImage.prototype.getDefaultStyleData = function () {
    return {
        bgi: {
            stops: [0, 1],
            colors: [
                {r: 0, g: 0, b: 0, a: 1},
                {r: 255, g: 255, b: 255, a: 1}
            ],
            type: 'vertical'
        }
    };
};
StyleSettingBackgroundImage.prototype.setStyleData = function (st) {
    var sd = this.styleData = deepCopy(st),
        bgi = sd.bgi;
    if (!bgi || !bgi.stops || bgi.stops.length < 2) {
        this.styleData = this.getDefaultStyleData();
    }

    this.getChild('gradient').setValue(this.styleData.bgi);
};

exports.StyleSettingBackgroundImage = StyleSettingBackgroundImage;
