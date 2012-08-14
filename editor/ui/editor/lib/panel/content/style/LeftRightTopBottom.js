/**
    LeftRightTopBottom.js

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

function LeftRightTopBottom(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LeftRightTopBottom);
    var that = this;
    function update() {
        that.emit('change', that.getLeft(), that.getRight(), that.getTop(), that.getBottom());
    }
    function updatePreview() {
        that.emit('preview', that.getLeft(), that.getRight(), that.getTop(), that.getBottom());
    }
    this.getChild('left').on('change', update).on('preview', updatePreview);
    this.getChild('right').on('change', update).on('preview', updatePreview);
    this.getChild('top').on('change', update).on('preview', updatePreview);
    this.getChild('bottom').on('change', update).on('preview', updatePreview);
}
LeftRightTopBottom.prototype = new (domvisual.DOMElement)();
LeftRightTopBottom.prototype.getConfigurationSheet = function () {
    return { };
};
LeftRightTopBottom.prototype.setTitle = function (title) {
    this.getChild('title').setText(title);
};
LeftRightTopBottom.prototype.setLeft = function (v) {
    this.getChild('left').setValue(v);
};
LeftRightTopBottom.prototype.getLeft = function () {
    return this.getChild('left').getValue();
};
LeftRightTopBottom.prototype.setRight = function (v) {
    this.getChild('right').setValue(v);
};
LeftRightTopBottom.prototype.getRight = function () {
    return this.getChild('right').getValue();
};
LeftRightTopBottom.prototype.setTop = function (v) {
    this.getChild('top').setValue(v);
};
LeftRightTopBottom.prototype.getTop = function () {
    return this.getChild('top').getValue();
};
LeftRightTopBottom.prototype.setBottom = function (v) {
    this.getChild('bottom').setValue(v);
};
LeftRightTopBottom.prototype.getBottom = function () {
    return this.getChild('bottom').getValue();
};

exports.LeftRightTopBottom = LeftRightTopBottom;
