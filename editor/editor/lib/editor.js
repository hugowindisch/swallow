/**
    editor.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/

// this is the top level editor

var visual = require('visual'),    
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    tool = require('./tool'),
    defaultPlugins = [
        require('./plugin/select').setup
    ];


function Editor(data) {
    // call the baseclass
    domvisual.DOMElement.call(this, data);
    this.createGroup(groups.Editor);
    this.setData(data);
    this.addPlugins(defaultPlugins);
    
// setup some fake stuff
////////////////////////
    var gr = new (require('./model').Group)();
    this.children.viewer.setGroup(gr);
    gr.cmdAddPosition('test1', 'xyzfake');
    
}
Editor.prototype = new (domvisual.DOMElement)();


Editor.prototype.setData = function (data) {
    // clear the data panel
    
    // add all what's needed
//    var d = data['editor.Editor'];
//    if (d) {
//    }
};


// Editor interface
////////////////////
/**
    Adds some plugins
*/
Editor.prototype.addPlugins = function (plugins) {
    var i, 
        l = plugins.length;
    for (i = 0; i < l; i += 1) {
        plugins[i](this);
    }
};

/*
    Adds a tool to the     
    the editor (at this time tools can only be added)
*/
Editor.prototype.addTool = function (
    img,
    seleted,
    deselected
) {
    console.log('addTool ' + img);
    var newTool = new (tool.Tool)({'editor.Tool': { imgUrl: img }});
    // we want to flow this thing
    this.children.toolbox.children.tools.addChild(newTool, this.getDefaultName());
    newTool.setHtmlFlowing({inline: true});
    newTool.addListener('click', function (evt) {
        alert('click');    
    });

};
/*
    Sets the contents of the data panel
*/
Editor.prototype.addToolData = function (toolData) {
};

/**
    Sets the current viewer.
(why not let change the viewer... but...
aren't tools related to the viewer?)
*/
Editor.prototype.setViewer = function () {
};

//////////////
// Implementation
Editor.prototype.selectTool = function (tool) {
    if (tool !== this.selectedTool) {
        // deselect the currently selected tool
        
        // clear the tool data panel
        
        // select the new tool
        this.selectedTool = tool;
    }
};

exports.Editor = Editor;
exports.Toolbox = require('./toolbox').Toolbox;
exports.Tool = tool.Tool;
exports.GroupViewer = require('./groupviewer').GroupViewer;

// note: this should be last
// we want this to be able to run as a standalone application
if (require.main === module) {
    domvisual.createFullScreenApplication(new Editor());
}

