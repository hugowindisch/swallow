/**
    VisualInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function VisualInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualInfo);
}
VisualInfo.prototype = new (domvisual.DOMElement)();
VisualInfo.prototype.theme = new (visual.Theme)({
    selected: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'buttonBackground' }
        ]
    }
});
VisualInfo.prototype.setTypeInfo = function (ti) {
    this.ti = ti;
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
};
VisualInfo.prototype.getTypeInfo = function () {
    var ti = this.ti;
    return { factory: ti.factory, type: ti.type };
};
VisualInfo.prototype.getConfigurationSheet = function () {
    return { typeInfo: {} };
};
VisualInfo.prototype.select = function (selected) {
    this.setStyle(selected ? 'selected' : null);
};


exports.VisualInfo = VisualInfo;
