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
    Layering = require('./Layering').Layering,
    Styling = require('./Styling').Styling,
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
        li = new Layering({}),
        liFolder = new (baseui.Folder)({internal: li, text: 'Layering' }),
        sti = new Styling({}),
        stiFolder = new (baseui.Folder)({internal: sti, text: 'Style' }),
        si = new SelectionInfo({}),
        siFolder = new (baseui.Folder)({ internal: si, text: 'Position' }),
        vl = new VisualList({}),
        vlFolder = new (baseui.Folder)({ internal: vl, text: 'Content' });
    liFolder.setHtmlFlowing({});
    ciFolder.setHtmlFlowing({});
    stiFolder.setHtmlFlowing({});
    vlFolder.setHtmlFlowing({});
    siFolder.setHtmlFlowing({});
    ciFolder.setExpanded(false);
    liFolder.setExpanded(false);
    stiFolder.setExpanded(true);
    vlFolder.setExpanded(true);
    siFolder.setExpanded(true);

    this.addChild(ciFolder);
    this.addChild(liFolder);
    this.addChild(siFolder);
    this.addChild(stiFolder);
    this.addChild(vlFolder);

    // setup the various panel items
    li.init(editor);
    ci.init(editor);
    sti.init(editor);
    si.init(editor);
    vl.init(editor);

    this.setChildrenClipping([ 'hidden', 'auto']);
    function disableUglyMouseBehaviors(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    // this breaks the combo box
    //this.on('mousedown', disableUglyMouseBehaviors);
    //this.on('mousemove', disableUglyMouseBehaviors);
    //this.on('mouseup', disableUglyMouseBehaviors);
};
exports.Panel = Panel;
