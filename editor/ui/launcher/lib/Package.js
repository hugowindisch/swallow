/**
    Package.js

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
    group = require('/launcher/lib/groups').groups.Package;

function Package(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var that = this;
    this.setCursor('pointer');
    this.on('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.emit('select', that.selected);
    });
    if (this.selelected === undefined) {
        this.setSelected(false);
    }
}
Package.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'Package');
Package.prototype.getConfigurationSheet = function () {
    return {  };
};
Package.prototype.setName = function (n) {
    this.getChild('name').setText(n);
};
Package.prototype.setSelected = function (s) {
    this.selected = s;
    // we don't want to support this at this moment.
    this.getChild('delete').setVisible(false); //s);
    this.getChild('background').setTransition(200).setStyle(s ? 'select' : 'normal');
};

exports.Package = Package;
