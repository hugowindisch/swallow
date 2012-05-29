/**
    Launcher.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    http = require('http'),
    utils = require('utils'),
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
    this.loadVisualList();
}
Launcher.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'Launcher');
Launcher.prototype.getConfigurationSheet = function () {
    return {  };
};
Launcher.prototype.loadVisualList = function () {
    var data = '',
        that = this;
    http.get({ path: '/visual'}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data);
            that.setVisualList(jsonData);
        });
        res.on('error', function (e) {
            alert('Error loading');
        });
    });
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
            var mv = new VisualModule({ info: p });
            mv.setHtmlFlowing({ position: 'relative'}, true);
            moduleList.addChild(mv, p.type);
            mv.on('select', function (isSelected) {
                that.selectModule(p);
            });
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
