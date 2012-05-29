/**
    SnapButton.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
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
