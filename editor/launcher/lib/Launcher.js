/**
    Launcher.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    http = require('http'),
    utils = require('utils'),
    DependencyManager = require('depmanager').DependencyManager,
    forEachProperty = utils.forEachProperty,
    forEachSortedProperty = utils.forEachSortedProperty,
    forEach = utils.forEach,
    group = require('./groups').groups.Launcher,
    Package = require('./Package').Package,
    VisualModule = require('./VisualModule').VisualModule;

function Launcher(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    // load the stuff that we need
    var that = this;
    // setup the dependency manager
    this.dependencyManager = new DependencyManager();
    this.dependencyManager.on('change', function (l) {
        that.updateVisualList(l);
    });
    // load, avoiding infinite recursion
    if (!this.forPreview) {
        this.loadLists();
    }
    function getNewPackageName() {
        var name = that.getChilld('packageAddName').getValue();
        // some validation
        return (/^[a-z][a-zA-Z0-9]+$/).test(name) ? name : null;
    }
    this.getChild('packageAdd').on('click', function () {
        var name = that.getChild('packageAddName').getValue(),
            // we should validate and strip unwanted stuff
            req;
        if (name) {
            req = http.request(
                {
                    method: 'PUT',
                    path: '/package/' + name,
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
}
Launcher.createPreview = function () {
    var ret = new Launcher({forPreview: true});
    ret.setChildrenClipping('hidden');
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
    // we also need to get the full package list because packages without
    // visuals will not be listed by the dependency manager
    var data = '',
        that = this;
    http.get({ path: '/package'}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data);
            that.updateVisualListFromPackageList(jsonData);
        });
    });
};
Launcher.prototype.updateVisualListFromPackageList = function (list) {
    var that = this;
    forEachProperty(list, function (p, pname) {
        var deps = p.dependencies;
        // somwhat bad & implicit way of determining visual packages
        if (deps && deps.visual && deps.domvisual && deps.glmatrix && deps.events) {
            that.packages[pname] = [];
        }
    });
    this.updatePackageList();
};
Launcher.prototype.updateVisualList = function (list) {
    var packages = this.packages;
    // we re organize the list hierachically
    forEach(list, function (v) {
        var n = v.factory,
            pn = packages[n];
        if (pn) {
            pn.push(v);
        } else {
            packages[n] = [v];
        }
    });
    this.packages = packages;
    this.updatePackageList();
};
Launcher.prototype.updatePackageList = function () {
    var packageList = this.getChild('packageList'),
        that = this;
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
    var packageList = this.getChild('packageList');
    if (name !== this.selected) {
        if (this.selected) {
            packageList.getChild(this.selected).setSelected(false);
        }
        this.selected = name;
        if (this.selected) {
            packageList.getChild(this.selected).setSelected(true);
        }
        this.updateModuleList();
    }
};
Launcher.prototype.updateModuleList = function () {
    var moduleList = this.getChild('moduleList'),
        that = this;
    moduleList.removeAllChildren();
    moduleList.setOverflow(['visible', 'auto']);
    delete this.selectedModule;
    if (this.selected) {
        forEach(this.packages[this.selected], function (p) {
            var factory, Type, mv, success;
            try {
                factory = require(p.factory);
                Type = factory[p.type];
                if (Type && Type.prototype && Type.prototype.getDescription) {
                    mv = new VisualModule({
                        name: p.type,
                        description: Type.prototype.getDescription(),
                        preview: Type,
                        typeInfo: p
                    });
                    mv.setHtmlFlowing({ position: 'relative' }, true);
                    moduleList.addChild(mv, p.type);
                    mv.on('select', function (isSelected) {
                        that.selectModule(p);
                    });
                    success = true;
                } else {
                    success = false;
                }
            } catch (e) {
                console.log(e);
                success = false;
            }
            if (!success) {
                console.log("Cannot show " + p.factory + " " + p.type);
            }
        });
    }
};
Launcher.prototype.selectModule = function (module) {
    var moduleList = this.getChild('moduleList');
    if (module !== this.selectedModule) {
        if (this.selectedModule) {
            moduleList.getChild(this.selectedModule.type).setSelected(false);
        }
        this.selectedModule = module;
        if (this.selectedModule) {
            moduleList.getChild(this.selectedModule.type).setSelected(true);
        }
    }
};

exports.Launcher = Launcher;
