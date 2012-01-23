/**
    viewer.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups;


function GroupViewer(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config);
    this.createGroup(groups.GroupViewer);
    //this.setData(data);
    //this.addPlugins(defaultPlugins);
}
GroupViewer.prototype = new (domvisual.DOMElement)();
GroupViewer.prototype.setGroup = function (group) {
    var that = this,
        commandChain = group.getCommandChain();
    if (this.unhookFromGroup) {
        this.unhookFromGroup();
    }
    function onDo(name, message, hint) {
/*        switch (name) {
        default:
            // regenerate all
            that.regenerateAll();
        }*/
        that.regenerateAll();
    }
    // hook ourselves
    commandChain.on('do', onDo);
    commandChain.on('undo', onDo);
    commandChain.on('redo', onDo);
    
    // unhook current document
    this.unhookFromGroup = function () {
        commandChain.removeListener('do', onDo);
        commandChain.removeListener('undo', onDo);
        commandChain.removeListener('redo', onDo);
    };
};
/**
    Regenerates the whole thing.
*/
GroupViewer.prototype.regenerateAll = function () {
    console.log('regenerate all');
};

exports.GroupViewer = GroupViewer;
