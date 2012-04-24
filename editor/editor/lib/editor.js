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
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    groups = require('./definition').definition.groups,
    MenuItem = baseui.MenuItem,
    DependencyManager = require('./DependencyManager').DependencyManager,
    defaultPlugins = [
        require('./plugin/select').setup
    ];


function Editor(config) {
    // create the dependency manager
    this.dependencyManager = new DependencyManager();
    this.dependencyManager.loadVisualList();
    // yurk hack to interface with configuration sheets
    // NOTE: why not passing the editor to the config sheets? We already pass 'editor info'
    // this would remove the need for this ugly thing!!
    // FIXME FIXME FIXME
    require('./Styling').Styling.init(this);
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Editor);
    // create the menu bar and toolbar
    this.setStyle('background');
    this.setChildrenClipping('hidden');
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
    this.children.panel.init(this);
    this.addPlugins(defaultPlugins);
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
Editor.prototype.saveGroup = function (factory, type, doc, cb) {
    factory = factory || this.docInfo.factory;
    type = type || this.docInfo.type;
    doc = doc || this.children.viewer.getGroup().documentData;
    var req = http.request(
            {
                method: 'POST',
                path: '/visual/' + factory + '/' + type
            },
            function (res) {
                res.on('error', function (e) {
                    alert('Error saving');
                    if (cb) {
                        cb(e);
                    }
                });
                res.on('end', function () {
                    if (cb) {
                        cb(null);
                    }
                });
            }
        );
    req.write(JSON.stringify(doc));
    req.end();
};

Editor.prototype.newGroup = function (factory, type, cb) {
    this.saveGroup(
        factory,
        type,
        {
            description: '',
            private: true,
            dimensions: [ 600, 400, 0],
            gridSize: 8,
            children: {},
            positions: {}
        },
        cb
    );
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
            view: [],
            run: [],
            help: []
        },
        i,
        l = plugins.length;

    // this could be a function of the horizontal toolbar
    function findToolsWithIcons() {
        var tools = [];
        forEachProperty(menus, function (m) {
            forEach(m, function (item) {
                if (item && item.getIcon()) {
                    tools.push(item);
                }
            });
        });
        return tools;
    }

    this.menus = menus;
    this.menubar = [
        new MenuItem("File", null, menus.file),
        new MenuItem("Edit", null, menus.edit),
        new MenuItem("Tool", null, menus.tool),
        new MenuItem("Object", null, menus.object),
        new MenuItem("View", null, menus.view),
        new MenuItem("Run", null, menus.run),
        new MenuItem("Help", null, menus.help)
    ];
    for (i = 0; i < l; i += 1) {
        plugins[i](this);
    }

    // initialize the menu
    this.children.menu.setItems(this.menubar);
    // initialize the toolbar (this could be more clever... i.e. keep
    // everything that has an icon).
    this.children.tools.setItems(findToolsWithIcons());
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

/**
    Returns the dependency manager.
*/
Editor.prototype.getDependencyManager = function () {
    return this.dependencyManager;
};

exports.Editor = Editor;
exports.GroupViewer = require('./groupviewer').GroupViewer;
exports.SelectionBox = require('./selectionbox').SelectionBox;
exports.VisualInfo = require('./VisualInfo').VisualInfo;
exports.VisualList = require('./VisualList').VisualList;
exports.VisualInfo = require('./VisualInfo').VisualInfo;
exports.EmptyPosition = require('./EmptyPosition').EmptyPosition;
exports.ConfigurationSheet = require('./ConfigurationSheet').ConfigurationSheet;
exports.LayoutAnchors = require('./LayoutAnchors').LayoutAnchors;
exports.SelectionInfo = require('./SelectionInfo').SelectionInfo;
exports.SnapButton = require('./SnapButton').SnapButton;
exports.RotationBox = require('./RotationBox').RotationBox;
exports.Layering = require('./Layering').Layering;
exports.LayerInfo = require('./LayerInfo').LayerInfo;
exports.Styling = require('./Styling').Styling;
exports.StyleInfo = require('./StyleInfo').StyleInfo;
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
