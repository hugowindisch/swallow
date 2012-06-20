/**
    editor.js

    The SwallowApps Editor, an interactive application builder for creating
    html applications.

    Copyright (C) 2012  Hugo Windisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
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
    DependencyManager = require('depmanager').DependencyManager,
    defaultPlugins = [
        require('./plugin/select').setup
    ];


function modulePath(factory, type) {
    return '/package/' + factory + '/visual/' + type;
}

function Editor(config) {
    // create the dependency manager
    this.dependencyManager = new DependencyManager();
    this.dependencyManager.loadVisualList();
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Editor);
    // create the menu bar and toolbar
    this.setStyle('background');
    this.setOverflow('hidden');
    // a bit ugly. but the viewer does not know the editor and must
    // be notifed of this.
    var viewer = this.getChild('viewer'),
        that = this;
    this.dependencyManager.on('change', function (visualList, packages, typeInfo) {
        var di = that.docInfo;
        that.dependencyManagerLoaded = true;
        if (di && (!typeInfo || typeInfo.factory !== di.factory || typeInfo.type !== di.type)) {
            viewer.fullRedraw();
        }
    });
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
Editor.prototype.getDocInfo = function () {
    return this.docInfo;
};
Editor.prototype.loadGroup = function (factory, type) {
    var data = '',
        that = this;
    http.get({ path: modulePath(factory, type)}, function (res) {
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
    return this;
};
Editor.prototype.publishGroup = function (factory, type) {
    var that = this;
    http.get({ path: '/publish/' + this.docInfo.factory + '.' + this.docInfo.type}, function (res) {
        res.on('error', function (e) {
            alert('Error loading');
        });
    });
    return this;
};
Editor.prototype.monitorGroup = function (factory, type) {
    var ti = this.docInfo,
        req = http.request(
            { method: 'POST', path: '/monitor/' + ti.factory + '.' + ti.type},
            function (res) {
                res.on('error', function (e) {
                    alert('Error setting monitored application');
                });
            }
        );
    req.end();
    return this;
};




Editor.prototype.saveGroup = function (factory, type, doc, cb) {
    factory = factory || this.docInfo.factory;
    type = type || this.docInfo.type;
    doc = doc || this.children.viewer.getGroup().documentData;
    var req = http.request(
        {
            method: 'POST',
            path: modulePath(factory, type)
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
            privateVisual: true,
            privateTheme: true,
            dimensions: [ 600, 400, 0],
            gridSize: 8,
            children: {},
            positions: {}
        },
        cb
    );
};


Editor.prototype.setGroupData = function (factory, type, groupData) {
    var viewer = this.getChild('viewer');
    this.docInfo = {
        factory: factory,
        type: type
    };
    viewer.setGroup(
        new (require('./model').Group)(groupData, this.docInfo)
    );
    this.getChild('panel').init(this);
    this.addPlugins(defaultPlugins);
    if (this.dependencyManagerLoaded) {
        viewer.fullRedraw();
    }
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
exports.GroupViewer = require('./viewer/groupviewer').GroupViewer;
exports.SelectionBox = require('./viewer/selectionbox').SelectionBox;
exports.VisualInfo = require('./panel/content/VisualInfo').VisualInfo;
exports.VisualList = require('./panel/content/VisualList').VisualList;
exports.EmptyPosition = require('./viewer/EmptyPosition').EmptyPosition;
exports.ConfigurationSheet = require('./panel/content/ConfigurationSheet').ConfigurationSheet;
exports.LayoutAnchors = require('./viewer/LayoutAnchors').LayoutAnchors;
exports.SelectionInfo = require('./panel/position/SelectionInfo').SelectionInfo;
exports.SnapButton = require('./viewer/SnapButton').SnapButton;
exports.RotationBox = require('./viewer/RotationBox').RotationBox;
exports.Layering = require('./panel/layering/Layering').Layering;
exports.LayerInfo = require('./panel/layering/LayerInfo').LayerInfo;
exports.Styling = require('./panel/content/style/Styling').Styling;
exports.StylingHeading = require('./panel/content/style/StylingHeading').StylingHeading;
exports.StyleName = require('./panel/content/style/StyleName').StyleName;
exports.StyleInfo = require('./panel/content/style/StyleInfo').StyleInfo;
exports.StylePreview = require('./panel/content/style/StylePreview').StylePreview;
exports.StylePicker = require('./panel/content/style/StylePicker').StylePicker;
exports.StyleSettingCorner = require('./panel/content/style/feature/StyleSettingCorner').StyleSettingCorner;
exports.StyleSettingBorder = require('./panel/content/style/feature/StyleSettingBorder').StyleSettingBorder;
exports.StyleSettingBackground = require('./panel/content/style/feature/StyleSettingBackground').StyleSettingBackground;
exports.StyleSettingText = require('./panel/content/style/feature/StyleSettingText').StyleSettingText;
exports.StyleSettingShadow = require('./panel/content/style/feature/StyleSettingShadow').StyleSettingShadow;
exports.StyleFeatureSelector = require('./panel/content/style/StyleFeatureSelector').StyleFeatureSelector;
exports.LabelValueSliderCheck = require('./panel/content/style/LabelValueSliderCheck').LabelValueSliderCheck;
exports.Panel = require('./panel/Panel').Panel;
