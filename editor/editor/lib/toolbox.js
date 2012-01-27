/**
    toolbox.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    tool = require('./tool');

function Toolbox(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Toolbox);
}
Toolbox.prototype = new (domvisual.DOMElement)();

/*
    Adds a tool to the     
    the editor (at this time tools can only be added)
*/
Toolbox.prototype.addTool = function (
    img,
    description,
    selected,
    deselected
) {
    var newTool = new (tool.Tool)({imgUrl: img }),
        that = this;
    // we want to flow this thing
    this.children.tools.addChild(newTool, this.getDefaultName());
    newTool.setHtmlFlowing({inline: true});
    newTool.whenSelected = selected;
    newTool.whenDeselected = deselected;
    newTool.addListener('click', function (evt) {
        // if this is a modal tool
        if (deselected) {
            that.selectTool(newTool);
        } else {
            // otherwise, just do the action
            selected();
        }
    });
};

/**
    Sets the active tool.
*/
Toolbox.prototype.selectTool = function (tool) {
    var that = this,
        previousTool;
    if (tool !== this.selectedTool) {
        // deselect the currently selected tool
        previousTool = this.selectedTool;
        if (this.selectedTool) {
            this.selectedTool.whenDeselected();
        }
        
        // clear the tool data panel
        
        // select the new tool
        this.selectedTool = tool;
        if (this.selectedTool) {
            this.selectedTool.whenSelected(function () {
                that.selectTool(previousTool);
            });
        }
    }
};

exports.Toolbox = Toolbox;
