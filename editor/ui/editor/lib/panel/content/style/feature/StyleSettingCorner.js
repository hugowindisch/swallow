/**
    StyleSettingCorner.js

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
    limitRange = utils.limitRange,
    deepCopy = utils.deepCopy,
    apply = utils.apply;

function StyleSettingCorner(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingCorner);
    var children = this.children,
        that = this;
    function setRadius(v) {
        if (v === undefined) {
            delete that.styleData.radius;
        } else {
            that.styleData.radius = v;
        }
        return that.styleData;
    }
    children.radius.on('change', function (v) {
        that.emit('change', setRadius(v), children.synchCheck.getValue());
    });
    children.radius.on('preview', function (v) {
        that.emit('preview', setRadius(v), children.synchCheck.getValue());
    });
    children.clear.on('click', function () {
        that.styleData = {};
        that.emit('reset', that.styleData, children.synchCheck.getValue());
    });
}
StyleSettingCorner.prototype = new (domvisual.DOMElement)();
StyleSettingCorner.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingCorner.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingCorner.prototype.setStyleData = function (st) {
    var children = this.children;
    this.styleData = apply({}, st);
    children.radius.setValue(this.styleData.radius);
};

exports.StyleSettingCorner = StyleSettingCorner;
