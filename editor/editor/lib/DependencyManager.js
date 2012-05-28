/**
    DependencyManager.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    utils = require('utils'),
    events = require('events'),
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
    this.factories = {};
    this.visualList = [];
}
DependencyManager.prototype = new (events.EventEmitter)();

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
    forEach(this.visualList, function (v) {
        var factory = v.factory,
            l = require(factory),
            type,
            Constr,
            theme;
        if (l) {
            type = v.type;
            Constr = l[type];
            if (Constr && Constr.prototype.privateStyles === false) {
                theme = Constr.prototype.theme;
                if (theme) {
                    forEachProperty(theme.getThemeData(), function (s, name) {
                        if (!s.private) {
                            res.push({ factory: factory, type: type, style: name});
                        }
                    });
                }
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
    http.get({ path: '/visual'}, function (res) {
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
    forEach(visualList, function (item) {
        var f = item.factory;
        if (!factories[f] && !toLoad[f]) {
            toLoad[f] = item;
            loading += 1;
        }
    });
    forEachProperty(toLoad, function (item) {
        var factory = item.factory;
        // factory not already loaded?
        visual.loadPackage(factory, function (err) {
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
        this.emit('change', visualList, this.factories);
    }
};
DependencyManager.prototype.update = function (visualList, factories) {
    this.visualList = visualList;
    this.factories = factories;
    this.emit('change', visualList, factories);
};
exports.DependencyManager = DependencyManager;
