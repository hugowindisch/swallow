/**
    tool.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups;

function Tool(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Tool);
}
Tool.prototype = new (domvisual.DOMElement)();
Tool.prototype.getConfigurationSheet = function () {
    return { imgUrl: {} };
};
Tool.prototype.setImgUrl = function (url) {
    this.children.image.setUrl(url);
};


exports.Tool = Tool;


