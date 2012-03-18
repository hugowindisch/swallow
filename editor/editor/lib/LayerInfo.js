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
    this.on('click', function () {
        that.emit('select', that.contentName);
    });
    this.children.enableSelection.on('click', function (evt) {
        evt.stopPropagation();
        console.log('clickEnableSelection');
    });
    this.children.enableView.on('click', function (evt) {
        evt.stopPropagation();
        console.log('clickEnableView');
    });
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
    return { contentName: null, selected: null };
};
LayerInfo.prototype.setContentName = function (txt) {
    this.children.name.setText(txt);
    this.contentName = txt;
};
LayerInfo.prototype.setSelected = function (sel) {
    this.setStyle(sel ? 'selectedBackground' : 'background');
};
exports.LayerInfo = LayerInfo;
