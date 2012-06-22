/**
    Launcher.js

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
var visual = require('visual'),
    domvisual = require('domvisual'),
    http = require('http'),
    utils = require('utils'),
    sse = require('sse'),
    DependencyManager = require('depmanager').DependencyManager,
    forEachProperty = utils.forEachProperty,
    forEachSortedProperty = utils.forEachSortedProperty,
    forEach = utils.forEach,
    group = require('./groups').groups.Launcher,
    Package = require('./Package').Package,
    VisualModule = require('./VisualModule').VisualModule,
    excludePackages = {
        domvisual: true,
        editor: true,
        baseui: true
    };

function Launcher(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    // load the stuff that we need
    var that = this;

    // load, avoiding infinite recursion and using the SSE of the dependency
    // manager which blocks some ip channels in preview mode.
    if (!this.forPreview) {
        // setup the dependency manager
        this.dependencyManager = new DependencyManager();
        this.dependencyManager.on('change', function (l) {
            var prevSelected = that.selected;
            that.updateVisualList(l);
            // FIXME: the dual list thing is quite ugly
            if (prevSelected) {
                that.selectPackage(prevSelected);
            }

        });
        // not super nice... we add a handler of our own on its sse connection
        // (note: these connections keep a socket open and we have a limited
        // number)
        this.dependencyManager.getSSE().on('monitor', function (evt) {
            var monitored = JSON.parse(evt.data);
            that.flagModuleAsMonitored(monitored);
        });
        this.loadLists();
    }
    function getNewPackageName() {
        var name = that.getChild('packageAddName').getValue();
        // some validation
        return (/^[a-z][a-zA-Z0-9]+$/).test(name) ? name : null;
    }
    this.getChild('packageAdd').on('click', function () {
        var name = getNewPackageName(),
            // we should validate and strip unwanted stuff
            req;
        if (name) {
            req = http.request(
                {
                    method: 'PUT',
                    path: '/package/' + name
                },
                function (res) {
                    res.on('error', function (e) {
                        alert('Error saving');
                    });
                    res.on('end', function () {
                    });
                }
            );
            req.end();
        } else {
            alert('invalid name ' + name);
        }
    });
    function getNewModuleName() {
        var name = that.getChild('moduleAddName').getValue();
        // some validation
        return (/^[A-Z][a-zA-Z0-9]+$/).test(name) ? name : null;
    }
    this.getChild('moduleAdd').on('click', function () {
        var name = getNewModuleName(),
            packageName = that.selected,
            // we should validate and strip unwanted stuff
            req;
        if (name && packageName) {
            req = http.request(
                {
                    method: 'PUT',
                    path: '/package/' + packageName + '/visual/' + name
                },
                function (res) {
                    res.on('error', function (e) {
                        alert('Error saving');
                    });
                    res.on('end', function () {
                    });
                }
            );
            req.end();
        } else {
            alert('error');
        }
    });
    this.getChild('monitor').on('click', function () {
        window.open('/m', '_blank');
    }).setCursor('pointer');

    this.getChild('github').on('click', function () {
        window.open('http://www.github.com', '_blank');
    }).setCursor('pointer');

    this.getChild('web').on('click', function () {
        window.open('http://www.swallowapps.com', '_blank');
    }).setCursor('pointer');

    this.getChild('help').on('click', function () {
        window.open('/make/helpviewer.Help.html', '_blank');
    }).setCursor('pointer');

    this.getChild('test').on('click', function () {
        window.open('/make/testviewer.TestViewer.html', '_blank');
    }).setCursor('pointer');


    this.getChild('share').setOpacity(0.5);
    this.getChild('trace').setOpacity(0.5);

}
Launcher.createPreview = function () {
    var ret = new Launcher({forPreview: true});
    ret.setOverflow('hidden');
    ret.enableScaling(true);
    return ret;
};

Launcher.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'Launcher');
Launcher.prototype.setForPreview = function () {
    this.forPreview = true;
};
Launcher.prototype.loadLists = function () {
    this.packages = {};
    this.dependencyManager.loadVisualList();
};
Launcher.prototype.updateVisualList = function (list) {
    var packages = this.packages;
    forEachProperty(list, function (item, name) {
        if (item.visuals && !excludePackages[name]) {
            packages[name] = item;
        }
    });
    this.packages = packages;
    this.updatePackageList();
};
Launcher.prototype.updatePackageList = function () {
    var packageList = this.getChild('packageList'),
        that = this;
    delete this.selected;
    packageList.removeAllChildren();
    packageList.setOverflow(['visible', 'auto']);
    forEachSortedProperty(this.packages, function (p, pn) {
        var pv = new Package({ name: pn });
        pv.setHtmlFlowing({ position: 'relative'}, true);
        packageList.addChild(pv, pn);
        pv.on('select', function (isSelected) {
            if (!isSelected) {
                that.selectPackage(pn);
            }
        });
    });
};
Launcher.prototype.selectPackage = function (name) {
    var packageList = this.getChild('packageList'),
        s;
    if (name !== this.selected) {
        if (this.selected) {
            s = packageList.getChild(this.selected);
            if (s) {
                s.setSelected(false);
            }
            delete this.selected;
        }
        s = packageList.getChild(name);
        if (s) {
            this.selected = name;
            s.setSelected(true);
        }
        this.updateModuleList();
    }
};
Launcher.prototype.updateModuleList = function () {
    var moduleList = this.getChild('moduleList'),
        that = this,
        mm = this.monitoredModule,
        selPackageName = this.selected,
        factory;
    moduleList.removeAllChildren();
    moduleList.setOverflow(['visible', 'auto']);
    delete this.selectedModule;
    if (this.selected) {
        factory = require(selPackageName);
        forEach(this.packages[selPackageName].visuals, function (type) {
            var Type, mv, success;
            try {
                Type = factory[type];
                if (Type && Type.prototype && Type.prototype.getDescription) {
                    mv = new VisualModule({
                        name: type,
                        description: Type.prototype.getDescription(),
                        preview: Type,
                        typeInfo: { factory: that.selected, type: type },
                        monitored: (mm && mm.factory === selPackageName && mm.type === type)
                    });
                    mv.setHtmlFlowing({ position: 'relative' }, true);
                    moduleList.addChild(mv, type);
                    success = true;
                } else {
                    success = false;
                }
            } catch (e) {
                console.log(e);
                success = false;
            }
            if (!success) {
                console.log("Cannot show " + factory + " " + type);
            }
        });
    }
};
Launcher.prototype.flagModuleAsMonitored = function (typeInfo) {
    var mm = this.monitoredModule,
        moduleList = this.getChild('moduleList'),
        m;
    if (mm && mm.factory === this.selected) {
        m = moduleList.getChild(mm.type);
        if (m) {
            m.setMonitored(false);
        }
    }
    mm = this.monitoredModule = typeInfo;
    if (mm && mm.factory === this.selected) {
        m = moduleList.getChild(mm.type);
        if (m) {
            m.setMonitored(true);
        }
    }
};
exports.Launcher = Launcher;
