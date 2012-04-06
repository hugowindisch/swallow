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
        that = this,
        prevName,
        documentData = group.documentData,
        it = [];

    forEachProperty(documentData.children, function (c, name) {
        it.push({name: name, order: c.order});
    });
    it.sort(function (i1, i2) {
        return i1.order - i2.order;
    });
    // remove the children that are not in the list
    forEachProperty(this.children, function (c, name) {
        if (!documentData.children[name]) {
            that.removeChild(name);
        }
    });
    // add the ones that are missing and update the others
    forEach(it, function (i) {
        var name = i.name,
            ch = that.getChild(name);

        if (!ch) {
            ch = new LayerInfo({contentName: name, viewer: viewer});
            ch.setHtmlFlowing({position: 'relative'}, true);
            that.addChild(ch, name);
        } else {
            // simply update it
            ch.updateAll();
        }
        that.orderAfter(name, prevName);
        prevName = name;
    });
    this.setDimensions([groups.Layering.dimensions[0], it.length * 25 + 10, 1]);
};

exports.Layering = Layering;
