/**
    LayerInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function LayerInfo(config) {
    var that = this;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LayerInfo);

    this.on('click', function (evt) {
        var viewer = that.viewer,
            name = that.contentName;
        if (viewer.positionIsSelected(name)) {
            viewer.removeFromSelection(name);
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
