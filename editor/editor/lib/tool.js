/**
    tool.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups;

function Tool(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config);
    this.createGroup(groups.Tool);
    this.setConfigg(config);
}
Tool.prototype = new (domvisual.DOMElement)();
Tool.prototype.setConfigg = function (config) {
// this is very heavy for what it accomplishes
    var conf, imgUrl;
    if (config) {
        conf = config['editor.Tool'];
        if (conf) {
            imgUrl = conf.imgUrl;
            if (imgUrl) {
                this.children.image.setUrl(imgUrl);
            }
        }
    }
};


exports.Tool = Tool;


