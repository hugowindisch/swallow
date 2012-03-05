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
    ComponentInfo = require('./ComponentInfo').ComponentInfo,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function Panel(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Panel);
}
Panel.prototype = new (domvisual.DOMElement)();
Panel.prototype.init = function (editor) {
    // initially, forget drawers, add a VisualList directly
    var ci = new ComponentInfo({}),
        ciFolder = new (baseui.Folder)({ internal: ci, text: 'Component' }),
        si = new SelectionInfo({}),        
        siFolder = new (baseui.Folder)({ internal: si, text: 'Position' }),
        vl = new VisualList({}),
        vlFolder = new (baseui.Folder)({ internal: vl, text: 'Content' });
    ciFolder.setHtmlFlowing({});
    vlFolder.setHtmlFlowing({});
    siFolder.setHtmlFlowing({});
    ciFolder.setExpanded(false);
    vlFolder.setExpanded(true);
    siFolder.setExpanded(true);

    this.addChild(ciFolder);
    this.addChild(siFolder);
    this.addChild(vlFolder);
    
    // setup the various panel items
    ci.init(editor);
    si.init(editor);
    vl.init(editor);
    
    this.setChildrenClipping([ 'hidden', 'auto']);
};
exports.Panel = Panel;
