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
/*globals window */
// this is the top level editor

/**
* This package implements portions of the editor and is not currently
* documented.
*
* @package editor
* @skipdoc
*/
/*! */
var visual = require('visual'),
    domvisual = require('domvisual'),
    events = require('events'),
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
    return '/swallow/package/' + factory + '/visual/' + type;
}

function Editor(config) {
    var that = this,
        toLoad;

    /// hack for allowing components to disable some animations when
    // running in the editor (seems like the less evil way of doing it as
    // I write it but... quite ugly anyway)
    domvisual.getStage().isSwallowEditor = true;
    // keep track of the loaded groups
    this.groups = {
    };
    // create the dependency manager
    this.dependencyManager = new DependencyManager();
    this.dependencyManager.loadVisualList();
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Editor);
    this.setStyle('background').setOverflow('hidden');
    // FIXME
    // a bit sideways... maybe the groupviewer should hook itself directly
    // to the editor
    this.dependencyManager.on('change', function (visualList, packages, typeInfo) {
        var di = that.getDocInfo();
        that.dependencyManagerLoaded = true;
        if (di && (!typeInfo || typeInfo.factory !== di.factory || typeInfo.type !== di.type)) {
            that.getChild('viewer').fullRedraw();
        }
    });
    function loadLocation() {
        var factory, type;
        if (window.location.hash) {
            toLoad = window.location.hash.split('.');
            if (toLoad.length === 2) {
                factory = toLoad[0].slice(1);
                type = toLoad[1];
                that.editGroup(factory, type);
            }
        }
        // FIXME: we should have a Visual.setInterval that would cleanly
        // remove the interval when the thing is removed from the stage,
        // and do the update automatically
        visual.update();
    }

    // once the config is loaded, init the plugins and the panel
    this.loadConfig(function (err, config) {
        if (!err) {
            that.editConfig = config;
        } else {
            that.editConfig = {};
        }
        // init the plugins
        that.initPlugins(defaultPlugins);
        // init the panel
        that.getChild('panel').init(that);
        // poll the location
        setInterval(loadLocation, 200);
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

function getKey(factory, type) {
    return factory + '.' + type;
}

// Editor interface
////////////////////
Editor.prototype.loadConfig = function (cb) {
    var data = '';
    http.get({ path: '/swallow/editconfig'}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            cb(null, JSON.parse(data));
        });
        res.on('error', function (e) {
            cb(e);
        });
    });
};
Editor.prototype.getEditConfig = function () {
    return this.editConfig;
};
Editor.prototype.getDocInfo = function () {
    var sg = this.selectedGroup,
        docInfo = sg !== undefined ? sg.docInfo : null;
    return docInfo;
};
Editor.prototype.getSelectedGroup = function () {
    return this.selectedGroup;
};
Editor.prototype.getGroups = function () {
    return this.groups;
};
Editor.prototype.hasMoreThanOneGroup = function () {
    var n = 0;
    return forEachProperty(this.groups, function () {
        n += 1;
        if (n > 1) {
            return true;
        }
        return false;
    });
};
Editor.prototype.getGroup = function (factory, type) {
    var key = getKey(factory, type);
    return this.groups[key];
};
Editor.prototype.editGroup = function (factory, type) {
    var key = getKey(factory, type),
        docInfo = { factory: factory, type: type },
        newGroup,
        that = this;

    if (this.groups[key]) {
        this.selectGroup(this.groups[key]);
    } else {
        this.loadGroup(factory, type, function (err, jsonData) {
            if (!err) {
                try {
                    that.groups[key] =
                        newGroup =
                        new (require('./model').Group)(jsonData, docInfo);
                    that.selectGroup(newGroup);
                } catch (e) {
                    err = e;
                }
            }
            if (err) {
                alert(err);
            }
        });
    }
    return this;
};
Editor.prototype.loadGroup = function (factory, type, cb) {
    var data = '',
        that = this,
        key = getKey(factory, type);
    http.get({ path: modulePath(factory, type)}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data);
            if (cb) {
                cb(null, jsonData);
            }
        });
        res.on('error', function (e) {
            if (cb) {
                cb(e);
            }
        });
    });
    return this;
};
Editor.prototype.publishGroup = function (factory, type) {
    factory = factory || this.selectedGroup.docInfo.factory;
    type = type || this.selectedGroup.docInfo.type;
    var that = this;
    http.get({ path: '/swallow/publish/' + factory + '.' + type}, function (res) {
        res.on('error', function (e) {
            alert('Error loading');
        });
    });
    return this;
};
Editor.prototype.monitorGroup = function (factory, type) {
    factory = factory || this.selectedGroup.docInfo.factory;
    type = type || this.selectedGroup.docInfo.type;

    var req = http.request(
            { method: 'POST', path: '/swallow/monitor/' + factory + '.' + type},
            function (res) {
                res.on('error', function (e) {
                    alert('Error setting monitored application');
                });
            }
        );
    req.end();
    return this;
};
Editor.prototype.closeGroup = function (factory, type) {
    var key = getKey(factory, type),
        group = this.groups[key],
        otherGroup;
    forEachProperty(this.groups, function (g, k) {
        if (g !== group) {
            otherGroup = g;
            return true;
        }
    });
    if (otherGroup) {
        this.selectGroup(otherGroup);
        if (group.getCommandChain().isOnSavePoint()) {
            delete this.groups[key];
        }
    }
};
Editor.prototype.saveGroup = function (factory, type, cb) {
    factory = factory || this.selectedGroup.docInfo.factory;
    type = type || this.selectedGroup.docInfo.type;
    var req,
        key = getKey(factory, type),
        group = this.groups[key],
        doc;

    // prevent problems
    if (!group) {
        if (cb) {
            cb(new Error('Group not loaded ' + key));
        }
        return;
    }

    doc = group.documentData;
    req = http.request(
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
                group.getCommandChain().setSavePoint();
                if (cb) {
                    cb(null);
                }
            });
        }
    );
    req.write(JSON.stringify(doc, group.getReplacer()));
    req.end();
};

Editor.prototype.hasUnsavedGroups = function () {
    return forEachProperty(this.groups, function (g) {
        return !g.getCommandChain().isOnSavePoint();
    });
};

Editor.prototype.saveAllGroups = function () {
    var that = this;
    forEachProperty(this.groups, function (g) {
        if (!g.getCommandChain().isOnSavePoint()) {
            that.saveGroup(g.docInfo.factory, g.docInfo.type);
        }
    });
};

Editor.prototype.newGroup = function (factory, type) {
    var key = getKey(factory, type),
        emptyGroup = {
            description: '',
            privateVisual: true,
            privateTheme: true,
            dimensions: [ 600, 400, 0],
            gridSize: 8,
            children: {},
            positions: {}
        },
        docInfo = {factory: factory, type: type},
        newGroup;

    if (!this.groups[key]) {
        this.groups[key] =
            newGroup =
            new (require('./model').Group)(emptyGroup, docInfo);
        this.selectGroup(newGroup);
    }
};

Editor.prototype.runGroup = function (factory, type, cb) {
    window.open('/swallow/make/' + factory + '.' + type + '.html', '_blank');
};

Editor.prototype.selectGroup = function (group) {
    if (group !== this.selectedGroup) {
        window.location.hash = '#' + group.docInfo.factory + '.' + group.docInfo.type;
        this.selectedGroup = group;
        var viewer = this.getChild('viewer');
        viewer.setGroup(group);
        if (this.dependencyManagerLoaded) {
            viewer.fullRedraw();
        }
    }
};

/**
    Adds some plugins.
    Well... there is no real plugin system yet. But most editor functions
    are injected here.
*/
Editor.prototype.initPlugins = function (plugins) {
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
exports.Skinning = require('./panel/content/style/Skinning').Skinning;
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
exports.LeftRightTopBottom = require('./panel/content/style/LeftRightTopBottom').LeftRightTopBottom;
exports.StyleSheet = require('./panel/content/style/StyleSheet').StyleSheet;
exports.FormattedText = require('./panel/content/style/FormattedText').FormattedText;
exports.Item = require('./panel/content/style/Item').Item;
exports.ItemList = require('./panel/content/style/ItemList').ItemList;
exports.LabelChoicesCheck = require('./panel/content/style/LabelChoicesCheck').LabelChoicesCheck;
