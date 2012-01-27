/**
    editor.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/

// this is the top level editor

var visual = require('visual'),    
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    defaultPlugins = [
        require('./plugin/select').setup
    ];


function Editor(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Editor);
    this.addPlugins(defaultPlugins);
    
// setup some fake stuff
////////////////////////
    var grData = {
        dimensions: [ 200, 200, 1],
        positions: {
            pos1: {
                type: "AbsolutePosition",
                matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
            },
            pos2: {
                type: "AbsolutePosition",
                matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   20, 20, 0, 1 ],
                snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
            },
            pos3: {
                type: "AbsolutePosition",
                matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   40, 0, 0, 1 ],
                snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
            },
        },
        children: {
            pos1: {
                factory: "domvisual",
                type: "DOMElement",
                position: "pos1",
                enableScaling: false,
                depth: 0,
                config: {
                    "class": [ "thing" ]
                }                
            }
        }
    },
        gr = new (require('./model').Group)(grData);
    this.children.viewer.setGroup(gr);
//    gr.cmdAddPosition('test1', 'xyzfake');
    
}
Editor.prototype = new (domvisual.DOMElement)();


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


/**
    Returns the group viewer.
*/
Editor.prototype.getViewer = function () {
    return this.children.viewer;
};

/**
    Returns the tool box.
*/
Editor.prototype.getToolbox = function () {
    return this.children.toolbox;
};

exports.Editor = Editor;
exports.Toolbox = require('./toolbox').Toolbox;
exports.Tool = require('./tool').Tool;
exports.GroupViewer = require('./groupviewer').GroupViewer;
exports.SelectionBox = require('./selectionbox').SelectionBox;

// note: this should be last
// we want this to be able to run as a standalone application
if (require.main === module) {
    domvisual.createFullScreenApplication(new Editor());
}


