/**
    Panel.js

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
/*globals window */
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
        vlFolder = new (baseui.Folder)({ internal: vl, text: 'Content' }),
        ls = window.localStorage;

    liFolder.setHtmlFlowing({});
    ciFolder.setHtmlFlowing({});
    vlFolder.setHtmlFlowing({});
    siFolder.setHtmlFlowing({});
    ciFolder.on('expand', function (state) {
        ls.panelComponent = state;
    }).setExpanded(ls.panelComponent === 'true');
    liFolder.on('expand', function (state) {
        ls.panelLayering = state;
    }).setExpanded(ls.panelLayering === 'true');
    siFolder.on('expand', function (state) {
        ls.panelPosition = state;
    }).setExpanded(ls.panelPosition === 'true');
    vlFolder.on('expand', function (state) {
        ls.panelContent = state;
    }).setExpanded(ls.panelContent === undefined ? true : (ls.panelContent === 'true'));

    this.removeAllChildren();
    this.addChild(ciFolder);
    this.addChild(liFolder);
    this.addChild(siFolder);
    this.addChild(vlFolder);

    // setup the various panel items
    li.init(editor);
    ci.init(editor);
    si.init(editor);
    vl.init(editor);

    this.setOverflow([ 'hidden', 'auto']);
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
