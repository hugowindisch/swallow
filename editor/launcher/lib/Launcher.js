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
    // avoid infinite preview
    if (!this.forPreview) {
        this.dependencyManager = new DependencyManager();
        this.dependencyManager.on('change', function (l) {
            that.setVisualList(l);
        });
        this.dependencyManager.loadVisualList();
    }
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
Launcher.prototype.setVisualList = function (list) {
    // we re organize the list hierachically
    var packages = {};
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
