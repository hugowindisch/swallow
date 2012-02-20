/**
    SelectionInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
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
};

exports.SelectionInfo = SelectionInfo;
