/**
    DependencyManager.js

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
var visual = require('visual'),
    utils = require('utils'),
    events = require('events'),
    sse = require('sse'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    http = require('http');

/*
The goal of this thing is to put the dynamic loading of dependencies in
one place and to provide accessors for operations that spawn multiple
factories (like querying all the possible styles).

I will want at some point to implement a more explicit dependency system
(i.e. from the editor select the modules that you want to use in the
current component). This will be changeable during an editing session,
and modules should be unloadable. So deciding on what you depend will
be quite explicit and will allow to add non-graphic components, perhaps.


The dependency manager should be an event emitter so that interested components
can react to reloading or changing themselves when the dependencies change.
*/
function DependencyManager() {
    var that = this;
    this.factories = {};
    this.visualList = {};
    // sse handling
    this.sse = new sse.EventSource('/events');

    this.sse.on('savecomponent', function (evt) {
        var typeInfo = JSON.parse(evt.data);
        that.reloadModule(typeInfo.factory, typeInfo.type);
    });
    this.sse.on('newcomponent', function (evt) {
        var typeInfo = JSON.parse(evt.data);
        that.reloadModule(typeInfo.factory, typeInfo.type);
    });
    this.sse.on('deletecomponent', function (evt) {
        var typeInfo = JSON.parse(evt.data);
        that.unloadModule(typeInfo.factory, typeInfo.type);
    });
    this.sse.on('newpackage', function (evt) {
        var packageName = JSON.parse(evt.data);
        that.addEmptyPackage(packageName);
    });

}
DependencyManager.prototype = new (events.EventEmitter)();

/**
    Returns the sse connection.
    This is not super nice but not that bad either.
    (note: we don't want many sse connections per app...)
*/
DependencyManager.prototype.getSSE = function () {
    return this.sse;
};

/**
    Returns all the factories currently loaded and avaiable.
*/
DependencyManager.prototype.getFactories = function () {
    return this.factories;
};

/**
    Returns all the visuals currently loaded and availabe.
*/
DependencyManager.prototype.getVisualList = function () {
    return this.visualList;
};

/**
    Returns all available styles
    {
        factory:
        type:
        style: the name of the style
    }
*/
DependencyManager.prototype.getStyleList = function () {
    var res = [];
    forEachProperty(this.visualList, function (v, factory) {
        if (v.visuals) {
            var l = require(factory),
                type,
                Constr,
                theme;
            if (l) {
                forEach(v.visuals, function (type) {
                    Constr = l[type];
                    if (Constr && Constr.prototype.privateStyles === false) {
                        theme = Constr.prototype.theme;
                        if (theme) {
                            forEachProperty(theme.getThemeData(), function (s, name) {
                                if (!s.privateStyle) {
                                    res.push({ factory: factory, type: type, style: name});
                                }
                            });
                        }
                    }
                });
            }
        }
    });
    return res;
};

//////////////////
// private stuff
DependencyManager.prototype.loadVisualList = function () {
    var data = '',
        that = this;
    http.get({ path: '/package'}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            that.loadMissingFactories(JSON.parse(data));
        });
    });
};
DependencyManager.prototype.loadMissingFactories = function (visualList) {
    var factories = {},
        toLoad = {},
        loading = 0,
        that = this;
    forEachProperty(this.factories, function (l, n) {
        factories[n] = l;
    });
    forEachProperty(visualList, function (item, fname) {
        if (!factories[fname] && !toLoad[fname] && item.visuals) {
            toLoad[fname] = fname;
            loading += 1;
        }
    });
    forEachProperty(toLoad, function (item, factory) {
        // factory not already loaded?
        visual.loadPackage(factory, null, false, function (err) {
            if (!err) {
                factories[factory] = factory;
            }
            loading -= 1;
            if (loading === 0) {
                // we can update our data and notify
                that.update(visualList, factories);
            }
        });
    });
    // if at this point, we have nothing to load:
    if (loading === 0) {
        this.visualList = visualList;
        this.emit('change', visualList, this.factories, null);
    }
};
DependencyManager.prototype.reloadModule = function (factory, type) {
    var that = this;
    visual.loadPackage(factory, null, true, function (err) {
        var vl, vis, found;
        if (!err) {
            that.factories[factory] = factory;
            vl = that.visualList[factory];
            if (!vl) {
                vl = that.visualList[factory] = {
                    name: factory
                };
            }
            vis = vl.visuals;
            if (!vis) {
                vis = vl.visuals = [];
            }
            forEach(vis, function (v) {
                if (v === type) {
                    found = true;
                }
            });
            if (!found) {
                vis.push(type);
            }
            that.emit('change', that.visualList, that.factories, { factory: factory, type: type });
        }
    });
};
// FIXME: we could purge empty packages.
DependencyManager.prototype.unloadModule = function (factory, type) {
    var vl = this.visualList[factory],
        vis,
        newvis = [];
    if (vl) {
        vis = vl.visuals;
        forEach(vis, function (v) {
            if (v !== type) {
                newvis.push(v);
            }
        });
        vl.visuals = newvis;
        this.emit('change', this.visualList, this.factories);
    }
};
DependencyManager.prototype.addEmptyPackage = function (packageName) {
    // we add a new empty factoy. No real need to update the visual list
    if (!this.factories[packageName]) {
        this.factories[packageName] = packageName;
        this.visualList[packageName] = { name: packageName, visuals: [] };
        this.emit('change', this.visualList, this.factories);
    }
};
DependencyManager.prototype.update = function (visualList, factories) {
    this.visualList = visualList;
    this.factories = factories;
    this.emit('change', visualList, factories);
};
exports.DependencyManager = DependencyManager;
