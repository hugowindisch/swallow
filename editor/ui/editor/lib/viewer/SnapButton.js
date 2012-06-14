/**
    SnapButton.js

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
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    snappingUrl = {
        'px': 'editor/img/snappx.png',
        '%': 'editor/img/snappercent.png',
        'cpx': 'editor/img/snapcpx.png',
        'auto': 'editor/img/snapnone.png',
        'unknown': 'editor/img/snapunknown.png'
    },
    snappingToggle = {
        'px': '%',
        '%': 'px',
        'auto': 'px',
        'unknown': 'px'
    },
    snappingToggleCpx = {
        'px': '%',
        '%': 'cpx',
        'cpx': 'px',
        'auto': 'px',
        'unknown': 'px'
    };

function SnapButton(config) {
    var that = this;
    this.sToggle = snappingToggle;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.SnapButton);
    // default snapping to unknown
    if (!this.snapping) {
        this.setSnapping('unknown');
    }
    // events
    this.on('mousedown', function (evt) {
        that.setSnapping(that.sToggle[that.snapping] || 'px');
        evt.preventDefault();
        evt.stopPropagation();
        that.emit('change', that.snapping);
    });
    this.setCursor('pointer');
}
SnapButton.prototype = new (domvisual.DOMElement)();
SnapButton.prototype.getConfigurationSheet = function () {
    return { snapping: null, cpx: null };
};

/**
    'auto', 'px', '%', 'unknown'
*/
SnapButton.prototype.setSnapping = function (snapping) {
    if (!snappingUrl[snapping]) {
        snapping = 'unknown';
    }
    this.snapping = snapping;
    this.children.pos.setUrl(snappingUrl[snapping]);
};

/**
*/
SnapButton.prototype.getSnapping = function () {
    return this.snapping;
};

/**
    Enable cpx.
*/
SnapButton.prototype.setCpx = function (enable) {
    this.sToggle = enable ? snappingToggleCpx : snappingToggle;
};


exports.SnapButton = SnapButton;
