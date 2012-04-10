/**
    LayoutAnchor.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    ConfigurationSheet = require('./ConfigurationSheet').ConfigurationSheet,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function LayoutAnchor(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LayoutAnchor);
}
LayoutAnchor.prototype = new (domvisual.DOMElement)();
LayoutAnchor.prototype.theme = new (visual.Theme)({
    hConnector: {
        data: [
            'editor_layoutAnchorHorizontal', 'editor_layoutAnchorPx'
        ]
    },
    hAdapter: {
        data: [
            'editor_layoutAnchorAdapterHorizontal', 'editor_layoutAnchorPx'
        ]
    }
});
LayoutAnchor.prototype.getConfigurationSheet = function () {
    return { orientation: {} };
};

LayoutAnchor.prototype.setOrientation = function (orientation) {
    this.orientation = orientation;
};
// for an horizontal anchor this is an x coord, for a vert a y coord
LayoutAnchor.prototype.setDelta = function (delta) {
    this.delta = delta;
};
LayoutAnchor.prototype.setClearance = function (clearance) {
    this.clearance = clearance;
};
LayoutAnchor.prototype.drawConnector = function () {
    switch (this.orientation) {
    case 'horizontal':
        this.drawHorizontalConnector();
        break;
    default:
        break;
    }
};
LayoutAnchor.prototype.drawHorizontalConnector = function () {
    var delta = this.delta,
        clearance = this.clearance,
        connector,
        button,
        w,
        h,
        adapter;

    this.removeAllChildren();
    // 1. create the horizontal connector
    connector = new (domvisual.DOMElement)();
    connector.setStyle("hConnector");
    this.addChild(connector, 'connector');
    if (delta > 60) {
        connector.setDimensions([delta, 1, 0]);
    } else {
        connector.setDimensions([60, 1, 0]);
        adapter = new (domvisual.DOMElement)();
        w = 60 - delta;
        h = delta < 5 ? (clearance + 30) : 30;
        adapter.setDimensions([w, h, 0]);
        adapter.setMatrix([1, 0, 0, 0,   0, 1, 0, 0,  0, 0, 1, 0,  60 - w, -h, 0, 1]);
        adapter.setStyle('hAdapter');
        this.addChild(adapter);
    }

    // 2. create the anchor type
    //button = new (domvisual.DOMElement)();


};


exports.LayoutAnchor = LayoutAnchor;
