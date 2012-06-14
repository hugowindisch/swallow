/**
    LayerInfo.js

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
    groups = require('/editor/lib/definition').definition.groups;

function LayerInfo(config) {
    var that = this;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LayerInfo);

    this.on('click', function (evt) {
        var viewer = that.viewer,
            name = that.contentName;
        if (viewer.positionIsSelected(name)) {
            viewer.removeFromSelection(name, !evt.ctrlKey);
        } else {
            viewer.addToSelection(name, !evt.ctrlKey);
        }
        viewer.updateSelectionControlBox();
    });
    this.children.enableSelection.on('click', function (evt) {
        var group = that.viewer.getGroup(),
            name = that.contentName,
            enable = group.documentData.positions[name].enableSelect === false ? true : false;
        evt.stopPropagation();
        group.doCommand(group.cmdEnableSelectPosition(name, enable));
    });
    this.children.enableView.on('click', function (evt) {
        var group = that.viewer.getGroup(),
            name = that.contentName,
            enable = group.documentData.positions[name].enableDisplay === false ? true : false;
        evt.stopPropagation();
        group.doCommand(group.cmdEnableDisplayPosition(name, enable));
    });
    this.updateAll();
}
LayerInfo.prototype = new (domvisual.DOMElement)();
LayerInfo.prototype.theme = new (visual.Theme)({
    background: {
    },
    selectedBackground: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'pressedButtonBackground' }
        ]
    }
});
LayerInfo.prototype.setTypeInfo = function (ti) {
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
};
LayerInfo.prototype.getConfigurationSheet = function () {
    return { contentName: null, viewer: null };
};
LayerInfo.prototype.setContentName = function (txt) {
    this.children.name.setText(txt);
    this.contentName = txt;
};
LayerInfo.prototype.setViewer = function (viewer) {
    this.viewer = viewer;
};
LayerInfo.prototype.updateAll = function () {
    var viewer = this.viewer,
        name = this.contentName,
        group = viewer.getGroup(),
        position = group.documentData.positions[name],
        selection = viewer.getSelection();
    this.setStyle(selection[name] ? 'selectedBackground' : 'background');
    this.children.enableSelection.setUrl(
        position.enableSelect !== false ?
            'editor/img/enableSelect.png' :
            'editor/img/disableSelect.png'
    );
    this.children.enableView.setUrl(
        position.enableDisplay !== false ?
            'editor/img/enableView.png' :
            'editor/img/disableView.png'
    );
};
exports.LayerInfo = LayerInfo;
