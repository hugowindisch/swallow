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
    this.select(false);
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
    return { editedStyle: null };
};
StyleInfo.prototype.setEditedStyle = function (st) {
    var children = this.children,
        preview = children.preview;

    preview.setStyle(st);
    preview.setInnerText(st.style);
    this.editedStyle = st;
};
StyleInfo.prototype.getEditedStyle = function () {
    return this.editedStyle;
};
StyleInfo.prototype.select = function (selected) {
    this.children.selectionBox.setVisible(selected);
};

exports.StyleInfo = StyleInfo;
