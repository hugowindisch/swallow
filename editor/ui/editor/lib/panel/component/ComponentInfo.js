/**
    ComponentInfo.js

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
    groups = require('/editor/lib/definition').definition.groups,
    utils = require('utils'),
    limitRange = utils.limitRange,
    ImageOption = require('../ImageOption').ImageOption;

function ComponentInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.ComponentInfo);
}
ComponentInfo.prototype = new (domvisual.DOMElement)();
ComponentInfo.prototype.getConfigurationSheet = function () {
    return { typeInfo: {} };
};
ComponentInfo.prototype.init = function (editor) {
    var that = this,
        viewer = editor.getViewer(),
        children = this.children;

    this.overflowX = new ImageOption({
        'visible':  [ 'editor/img/ofxvisible_s.png', 'editor/img/ofxvisible.png', children.overflowXVisible ],
        'hidden':  [ 'editor/img/ofxhidden_s.png', 'editor/img/ofxhidden.png', children.overflowXHidden ],
        'auto':  [ 'editor/img/ofxauto_s.png', 'editor/img/ofxauto.png', children.overflowXAuto ],
        'scroll':  [ 'editor/img/ofxscroll_s.png', 'editor/img/ofxscroll.png', children.overflowXScroll ]
    });

    this.overflowY = new ImageOption({
        'visible':  [ 'editor/img/ofyvisible_s.png', 'editor/img/ofyvisible.png', children.overflowYVisible ],
        'hidden':  [ 'editor/img/ofyhidden_s.png', 'editor/img/ofyhidden.png', children.overflowYHidden ],
        'auto':  [ 'editor/img/ofyauto_s.png', 'editor/img/ofyauto.png', children.overflowYAuto ],
        'scroll':  [ 'editor/img/ofyscroll_s.png', 'editor/img/ofyscroll.png', children.overflowYScroll ]
    });

    function updateDoc() {
        var group = viewer.getGroup(),
            documentData = group.documentData,
            gridSize = limitRange(children.grid.getValue(), 2, 64, 8);
        group.doCommand(group.cmdSetComponentProperties(
            [limitRange(children.w.getText(), 1, 100000), limitRange(children.h.getText(), 1, 10000), 1],
            children.description.getText(),
            children.privateCheck.getChecked(),
            gridSize,
            children.privateStylesCheck.getChecked(),
            that.overflowX.getSelectedValue(),
            that.overflowY.getSelectedValue()
        ));
    }

    function updateControls() {
        var group = viewer.getGroup(),
            documentData = group.documentData;
        children.w.setText(documentData.dimensions[0]);
        children.h.setText(documentData.dimensions[1]);
        children.description.setText(documentData.description);
        children.privateCheck.setChecked(documentData.private === true);
        children.privateStylesCheck.setChecked(documentData.privateStyles === true);
        children.grid.setValue(documentData.gridSize);
        that.overflowX.setSelectedValue(documentData.overflowX);
        that.overflowY.setSelectedValue(documentData.overflowY);
    }

    children.w.on('change', updateDoc);
    children.h.on('change', updateDoc);
    children.description.on('change', updateDoc);
    children.privateCheck.on('change', updateDoc);
    children.privateStylesCheck.on('change', updateDoc);
    children.grid.on('change', updateDoc);
    viewer.on('updateSelectionControlBox', updateControls);
    this.overflowX.on('change', updateDoc);
    this.overflowY.on('change', updateDoc);
    updateControls();
};

exports.ComponentInfo = ComponentInfo;
