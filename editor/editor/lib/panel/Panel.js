/**
    Panel.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    baseui = require('baseui'),
    VisualList = require('./content/VisualList').VisualList,
    SelectionInfo = require('./position/SelectionInfo').SelectionInfo,
    ComponentInfo = require('./component/ComponentInfo').ComponentInfo,
    Layering = require('./layering/Layering').Layering;

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
        si = new SelectionInfo({}),
        siFolder = new (baseui.Folder)({ internal: si, text: 'Position' }),
        vl = new VisualList({}),
        vlFolder = new (baseui.Folder)({ internal: vl, text: 'Content' });
    liFolder.setHtmlFlowing({});
    ciFolder.setHtmlFlowing({});
    vlFolder.setHtmlFlowing({});
    siFolder.setHtmlFlowing({});
    ciFolder.setExpanded(false);
    liFolder.setExpanded(false);
    siFolder.setExpanded(false);
    vlFolder.setExpanded(true);

    this.addChild(ciFolder);
    this.addChild(liFolder);
    this.addChild(siFolder);
    this.addChild(vlFolder);

    // setup the various panel items
    li.init(editor);
    ci.init(editor);
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
