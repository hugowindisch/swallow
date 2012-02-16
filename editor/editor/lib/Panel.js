/**
    Panel.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    baseui = require('baseui'),
    VisualList = require('./VisualList').VisualList,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function Panel(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Panel);
    this.populate();
}
Panel.prototype = new (domvisual.DOMElement)();
Panel.prototype.populate = function () {
    // initially, forget drawers, add a VisualList directly
    var vl = new VisualList({});
    vl.setHtmlFlowing({});
    this.addChild(vl);
};
exports.Panel = Panel;
