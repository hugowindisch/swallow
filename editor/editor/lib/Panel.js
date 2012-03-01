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
    SelectionInfo = require('./SelectionInfo').SelectionInfo,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function Panel(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Panel);
}
Panel.prototype = new (domvisual.DOMElement)();
Panel.prototype.init = function (editor) {
    // initially, forget drawers, add a VisualList directly
    var si = new SelectionInfo({}),
        siFolder = new (baseui.Folder)({ internal: si, text: 'Position' }),
        vl = new VisualList({}),
        vlFolder = new (baseui.Folder)({ internal: vl, text: 'Content' });
    vlFolder.setHtmlFlowing({});
    siFolder.setHtmlFlowing({});
    vlFolder.setExpanded(true);
    siFolder.setExpanded(true);
    
    this.addChild(siFolder);
    this.addChild(vlFolder);
    
    // setup the various panel items
    si.init(editor);
    vl.init(editor);
    
    this.setChildrenClipping([ 'hidden', 'auto']);
};
exports.Panel = Panel;
