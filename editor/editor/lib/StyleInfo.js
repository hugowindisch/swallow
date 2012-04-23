/**
    StyleInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function StyleInfo(config) {
    var that = this;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleInfo);
/*
    this.on('click', function (evt) {
        var viewer = that.viewer,
            name = that.contentName;
        viewer.clearSelection();
        viewer.addToSelection(name);
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
    this.updateAll(); */
}
StyleInfo.prototype = new (domvisual.DOMElement)();
StyleInfo.prototype.theme = new (visual.Theme)({
    background: {
    },
    selectedBackground: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'pressedButtonBackground' }
        ]
    }
});
/*StyleInfo.prototype.setTypeInfo = function (ti) {
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
};*/
StyleInfo.prototype.getConfigurationSheet = function () {
    return { /*contentName: null, viewer: null*/ };
};
/*StyleInfo.prototype.setContentName = function (txt) {
    this.children.name.setText(txt);
    this.contentName = txt;
};
StyleInfo.prototype.setViewer = function (viewer) {
    this.viewer = viewer;
};
StyleInfo.prototype.updateAll = function () {
    var viewer = this.viewer,
        name = this.contentName,
        group = viewer.getGroup(),
        position = group.documentData.positions[name],
        selection = viewer.getSelection();
    this.setStyle(selection[name] ? 'selectedBackground' : 'background');
    this.children.enableSelection.setUrl(
        position.enableSelect !== false ?
            'editor/lib/enableSelect.png' :
            'editor/lib/disableSelect.png'
    );
    this.children.enableView.setUrl(
        position.enableDisplay !== false ?
            'editor/lib/enableView.png' :
            'editor/lib/disableView.png'
    );
};*/
exports.StyleInfo = StyleInfo;
