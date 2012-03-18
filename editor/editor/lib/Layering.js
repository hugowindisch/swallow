/**
    Layering.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    LayerInfo = require('./LayerInfo').LayerInfo,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function Layering(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Layering);
}
Layering.prototype = new (domvisual.DOMElement)();
Layering.prototype.setTypeInfo = function (ti) {
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
};
Layering.prototype.getConfigurationSheet = function () {
    return { typeInfo: {} };
};
Layering.prototype.init = function (editor) {
    var viewer = editor.getViewer(),
        that = this;
    this.editor = editor;
    function refresh() {
        that.updateList();
    }
    viewer.on('updateSelectionControlBox', refresh);
    refresh();
};
Layering.prototype.updateList = function () {
    var viewer = this.editor.getViewer(),
        group = viewer.getGroup(),
        selection = viewer.getSelection(),
        that = this,
        documentData = group.documentData,
        it = [];
        
    forEachProperty(documentData.children, function (c, name) {
        it.push({name: name, order: c.order});
    });
    it.sort(function (i1, i2) {
        return i1.order - i2.order;
    });
    this.removeAllChildren();
    forEach(it, function (i) {
        var name = i.name,
            ch = new LayerInfo({contentName: name, selected: selection[name]});
        ch.setHtmlFlowing({position: 'relative'}, true);
        that.addChild(ch, name);
        ch.on('select', function (name) {
            viewer.clearSelection();
            viewer.addToSelection(name);
            viewer.updateSelectionControlBox();
        });
    });
    this.setDimensions([groups.Layering.dimensions[0], it.length * 25 + 10, 1]);
};

exports.Layering = Layering;
