/**
    LabelChoicesCheck.js

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
    forEachProperty = utils.forEachProperty,
    limitRange = utils.limitRange,
    ImageOption = require('/editor/lib/panel/ImageOption').ImageOption,
    groups = require('/editor/lib/definition').definition.groups;

function LabelChoicesCheck(config) {
    this.defaultValue = 0;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LabelChoicesCheck);
}
LabelChoicesCheck.prototype = new (domvisual.DOMElement)();
LabelChoicesCheck.prototype.getConfigurationSheet = function () {
    return {};
};
LabelChoicesCheck.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
    return this;
};
LabelChoicesCheck.prototype.setCheckVisible = function (v) {
    this.getChild('check').setVisible(v);
    return this;
};
LabelChoicesCheck.prototype.setSelectedValue = function (v) {
    this.imageOption.setSelectedValue(v);
    return this;
};
LabelChoicesCheck.prototype.getSelectedValue = function () {
    return this.imageOption.getSelectedValue();
};
LabelChoicesCheck.prototype.setCheck = function (c) {
    this.getChild('check').setValue(c);
    return this;
};
LabelChoicesCheck.prototype.getCheck = function () {
    return this.getChild('check').getValue();
};
LabelChoicesCheck.prototype.setChoices = function (ch) {
    var that = this,
        choices = this.getChild('choices'),
        imageOpt = {};
    choices.removeAllChildren();
    forEachProperty(ch, function (c, cname) {
        var img = new domvisual.DOMImg({url: c[1]});
        choices.addChild(img, cname);
        img.setHtmlFlowing({display: 'inline-block', position: 'relative'}
        ).setCursor('pointer');
        imageOpt[cname] = [
            c[0],
            c[1],
            img
        ];
    });
    this.imageOption = new ImageOption(imageOpt, this.getChild('check'));
    this.imageOption.on('change', function (v) {
        that.emit('change', v);
    });
    this.imageOption.on('checkchange', function (v) {
        that.emit('checkchange', v);
    });
    return this;
};


exports.LabelChoicesCheck = LabelChoicesCheck;
