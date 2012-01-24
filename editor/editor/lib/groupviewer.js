/**
    viewer.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
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
    this.documentData = group.documentData;
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
    
    // regenerate everything
    this.regenerateAll();
};
/**
    Regenerates the whole thing.
*/
GroupViewer.prototype.regenerateAll = function () {
    console.log('regenerate all');
    var documentData = this.documentData,
        children = this.children,
        that = this;
    // regenerate content
    children.visuals.removeAllChildren();
    children.positions.removeAllChildren();
    //children.decorations.removeAllChildren();
    // children
    children.visuals.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1]);
    children.visuals.createGroup(documentData);
    children.visuals.setDimensions(documentData.dimensions);
    forEachProperty(children.visuals.children, function (c) {
        // Sets the preview mode
        c.enableInteractions(false);
    });
    // positions
    children.positions.setDimensions(documentData.dimensions);
    children.positions.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1]);
    children.positions.setLayout(documentData);
    forEachProperty(documentData.positions, function (c, name) {
        // regenerate it
        var pos = new (domvisual.DOMElement)({});
        pos.setPosition(name);
        pos.setClass('positionbox');
        children.positions.addChild(pos, name);
    });    
    // selection    
};
/**
    Zoom 
*/
GroupViewer.prototype.zoomTo = function () {
};
GroupViewer.prototype.pushZoom = function () {
};
GroupViewer.prototype.popZoom = function () {
};
/**
    Selection.
*/
GroupViewer.prototype.select = function (matrix) {
};



exports.GroupViewer = GroupViewer;
