/**
    editor.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/

// this is the top level editor

var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    topmost;


function Editor(data) {
    // call the baseclass
    domvisual.DOMElement.call(this, data);
    this.createGroup(groups.Editor);
    this.setData(data);
}
Editor.prototype = new (domvisual.DOMElement)();

Editor.prototype.setData = function (data) {
//    var d = data['editor.Editor'];
//    if (d) {
//    }
};


// Editor interface
// Adds a tool to the toolbox
Editor.prototype.addTool = function () {
};
// available to tools while active
// Adds a tool data box
Editor.prototype.setToolData = function (toolData) {
};

// we want this to be able to run as a standalone application
if (require.main.id === 'editor') {
    domvisual.createFullScreenApplication(new Editor());
}

