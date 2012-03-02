/**
    editor.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/

// this is the top level editor

var visual = require('visual'),    
    domvisual = require('domvisual'),
    baseui = require('baseui'),
    url = require('url'),
    http = require('http'),
    groups = require('./definition').definition.groups,
    MenuItem = baseui.MenuItem,
    defaultPlugins = [
        require('./plugin/select').setup
    ];


function Editor(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Editor);
    // create the menu bar and toolbar
    this.setStyle('background');
    this.addPlugins(defaultPlugins);
    this.children.panel.init(this);
    this.setChildrenClipping('hidden');
    
    
// setup some fake stuff
////////////////////////
/*    var grData = {
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
                order: 0,
                config: {
                    "class": [ "thing" ]
                }                
            }
        }
    },
        gr = new (require('./model').Group)(grData);
    this.children.viewer.setGroup(gr);
//    gr.cmdAddPosition('test1', 'xyzfake');*/
    
}
Editor.prototype = new (domvisual.DOMElement)();

Editor.prototype.theme = new (visual.Theme)({
    background: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'windowBackground' }
        ]
    },
    panel: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'windowBackground' } 
        ]
    }
});

// Editor interface
////////////////////
Editor.prototype.setGroupData = function (factory, type, groupData) {
    this.docInfo = {
        factory: factory,
        type: type
    };
    this.children.viewer.setGroup(
        new (require('./model').Group)(groupData)
    );
};
Editor.prototype.getDocInfo = function () {
    return this.docInfo;
};
Editor.prototype.loadGroup = function (factory, type) {
    var data = '',
        that = this;
    http.get({ path: '/visual/' + factory + '/' + type}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data);
            that.setGroupData(factory, type, jsonData);
        });
        res.on('error', function (e) {
            alert('Error loading');
        });
    });
};
Editor.prototype.saveGroup = function (factory, type) {
    factory = factory || this.docInfo.factory;
    type = type || this.docInfo.type;
    var doc = this.children.viewer.getGroup().documentData,
        req = http.request(
            {
                method: 'POST',
                path: '/visual/' + factory + '/' + type
            }, 
            function (res) {
                res.on('error', function (e) {
                    alert('Error saving');
                });
            }
        );
    req.write(JSON.stringify(doc));
    req.end();
};

/**
    Adds some plugins
*/
Editor.prototype.addPlugins = function (plugins) {
    var menus = {
            file: [],
            edit: [],
            tool: [],
            object: [],
            run: [],
            help: []
        },
        i, 
        l = plugins.length;
        
    this.menus = menus;
    this.menubar = [
        new MenuItem("File", null, menus.file), 
        new MenuItem("Edit", null, menus.edit),
        new MenuItem("Tool", null, menus.tool),
        new MenuItem("Object", null, menus.object),
        new MenuItem("Run", null, menus.run),
        new MenuItem("Help", null, menus.help)
    ];
/*
    this.menubar = [
        new MenuItem("File"), 
        new MenuItem("Edit", null, [
            new MenuItem("Undo"),
            new MenuItem("Redo"),
            new MenuItem("Cut"),
            new MenuItem("Copy"),
            new MenuItem("Paste"),
            new MenuItem("Select All"),
        ]),
        new MenuItem("Tool", null, this.toolbar),
        new MenuItem("Object", null, [
            new MenuItem("Move Up"),
            new MenuItem("Move Down"),
            new MenuItem("To Top"),
            new MenuItem("To Bottom"),
            new MenuItem("Align Left"),
            new MenuItem("Align Center"),
            new MenuItem("Align Right"),
            new MenuItem("Align Top"),
            new MenuItem("Align Middle"),
            new MenuItem("Align Bottom")
        ]),
        new MenuItem("Run", null, [
            new MenuItem("Run"),
            new MenuItem("Run Minimized"),
            new MenuItem("Lint"),
            new MenuItem("Test"),
            new MenuItem("Generate Documentation"),
        ]),
        new MenuItem("Help", null, [
            new MenuItem("Editor Help"),
            new MenuItem("Editor Documentation"),
            new MenuItem("Content Help"),
            new MenuItem("Content Documentation"),
            new MenuItem("All packages"),
            new MenuItem("About")
        ]),
    ];
*/
    for (i = 0; i < l; i += 1) {
        plugins[i](this);
    }
    
    // initialize the menu
    this.children.menu.setItems(this.menubar);
    // initialize the toolbar (this could be more clever... i.e. keep
    // everything that has an icon).
    this.children.tools.setItems(this.menus.tool);
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
exports.GroupViewer = require('./groupviewer').GroupViewer;
exports.SelectionBox = require('./selectionbox').SelectionBox;
exports.VisualInfo = require('./VisualInfo').VisualInfo;
exports.VisualList = require('./VisualList').VisualList;
exports.VisualInfo = require('./VisualInfo').VisualInfo;
exports.VisualProperties = require('./VisualProperties').VisualProperties;
exports.ConfigurationSheet = require('./ConfigurationSheet').ConfigurationSheet;
exports.VisualList = require('./Layering').Layering;
exports.SelectionInfo = require('./SelectionInfo').SelectionInfo;
exports.Panel = require('./Panel').Panel;

// note: this should be last
// we want this to be able to run as a standalone application
if (require.main === module) {
    (function () {
        var p = url.parse(document.URL, true),
            factory = p.query.factory,
            type = p.query.type,
            data = '';
        http.get({ path: '/visual/' + factory + '/' + type}, function (res) {
            res.on('data', function (d) {
                data += d;
            });
            res.on('end', function () {
                var jsonData = JSON.parse(data),
                    edit = new Editor();
                edit.setGroupData(factory, type, jsonData);
                domvisual.createFullScreenApplication(edit);
            });
        });
    }());    
}

