/**
    StyleFeatureSelector.js

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
    forEach = utils.forEach;

function featureUrl(feature, selected) {
    return 'editor/img/sp_' + feature + (selected ? '_s.png' : '.png');
}
function StyleFeatureSelector(config) {
    var that = this,
        children;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleFeatureSelector);
    children = this.children;
    function toggleChild() {
        var n = this.name;
        that.emit('select', n);
    }
    forEachProperty(children, function (c) {
        c.on('click', toggleChild);
        c.setCursor('pointer');
    });
}
StyleFeatureSelector.prototype = new (domvisual.DOMElement)();
StyleFeatureSelector.prototype.getConfigurationSheet = function () {
    return { };
};
StyleFeatureSelector.prototype.setStyleFeatures = function (stf) {
    forEachProperty(this.children, function (ch, name) {
        ch.setUrl(featureUrl(name, Boolean(stf[name])));
    });
};

exports.StyleFeatureSelector = StyleFeatureSelector;
