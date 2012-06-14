/**
    StylingHeading.js

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
    groups = require('/editor/lib/definition').definition.groups;

function StylingHeading(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StylingHeading);
}
StylingHeading.prototype = new (domvisual.DOMElement)();
StylingHeading.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StylingHeading = StylingHeading;
