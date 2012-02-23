/**
    SelectionInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function SelectionInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.SelectionInfo);
}
SelectionInfo.prototype = new (domvisual.DOMElement)();
SelectionInfo.prototype.getConfigurationSheet = function () {
    return {  };
};
SelectionInfo.prototype.init = function (editor) {
    var viewer = editor.getViewer(),
        container = this.parent,
        children = this.children;

    function update(rect) {
        if (rect) {
            children.x.setText(rect[0][0].toFixed(1));
            children.y.setText(rect[0][1].toFixed(1));
            children.w.setText((rect[1][0] - rect[0][0]).toFixed(1));
            children.h.setText((rect[1][1] - rect[0][1]).toFixed(1));
            container.setVisible(true);
        } else {
            container.setVisible(false);
        }
    }
    viewer.on('updateSelectionControlBox', update);
    viewer.on('previewSelectionRect', update);

    function toNumber(s) {
        var n = Number(s);
        if (isNaN(n)) {
            n = 0;
        }
        return n;
    }
    function selectionBoxChanged() {
        var x = toNumber(children.x.getText()),
            y = toNumber(children.y.getText()),
            w = toNumber(children.w.getText()),
            h = toNumber(children.h.getText()),
            selRect = viewer.getSelectionRect(),
            transform = mat4.identity(),
            selection = viewer.getSelection(),
            group = viewer.getGroup(),
            cg;
        if (w < 1) {
            w = 1;
        }
        if (h < 1) {
            h = 1;
        }
        
        mat4.translate(transform, [x, y, 0]);
        mat4.scale(transform, [w / (selRect[1][0] - selRect[0][0]), h / (selRect[1][1] - selRect[0][1]), 1]);
        mat4.translate(transform, [-selRect[0][0], -selRect[0][1], 0]);

        cg = group.cmdCommandGroup('transform', 'Transform a group');
        // transform the whole selection
        forEachProperty(selection, function (sel, name) {
            cg.add(group.cmdTransformPosition(name, transform));
        });
        group.doCommand(cg);
        
    }
    children.x.on('change', selectionBoxChanged);
    children.y.on('change', selectionBoxChanged);
    children.w.on('change', selectionBoxChanged);
    children.h.on('change', selectionBoxChanged);

};

exports.SelectionInfo = SelectionInfo;
