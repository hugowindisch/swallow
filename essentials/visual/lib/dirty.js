/**
    dirty.js

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    isNumber = utils.isNumber,
    isArray = utils.isArray,
    inUpdate = false;

/**
    Practically we probably only need only one dirty list.
    We keep the dirty list containment-depth-sorted to minimize
    refreshes (a container while updating itself, has chances of
*/
function DirtyList() {
    this.dirty = [];
}

/**
    Flags an element as dirty.
*/
DirtyList.prototype.setDirty = function (o) {
    var i, l = arguments.length;
    if (l > 1) {
        if (!isNumber(o.containmentDepth)) {
            throw new Error("invalid visual");
        }
        if (!o.hasOwnProperty('isDirty')) {
            o.isDirty = {};
            this.dirty.push(o);
        }
        // why?
        for (i = 1; i < l; i += 1) {
            o.isDirty[arguments[i]] = true;
        }
    } else {
        throw new Error('setDirty called with no reason');
    }
};

/**
    Returns a depth sorted dirty list
*/
DirtyList.prototype.getDepthSortedList = function () {
    var dirty = [],
        i,
        thisdirty = this.dirty,
        l = thisdirty.length,
        o,
        depth;
    for (i = 0; i < l; i += 1) {
        o = thisdirty[i];
        depth = o.containmentDepth || 0;
        if (!dirty[depth]) {
            dirty[depth] = [o];
        } else {
            dirty[depth].push(o);
        }
    }
    return dirty;
};

/**
    Cleans all dirt.
*/
DirtyList.prototype.update = function () {
    var i,
        l,
        j,
        k,
        ll,
        dirty,
        o,
        why;
    if (inUpdate) {
        throw new Error('Recursive Update');
    }
    inUpdate = true;

    function clean(o) {
        var why = o.isDirty;
        delete o.isDirty;
        o.update(why);
    }
    dirty = this.getDepthSortedList();
    while ((l = dirty.length) > 0) {
        this.dirty = [];
        // we go bottom up
        for (i = l - 1; i >= 0; i -= 1) {
            o = dirty[i];
            if (isArray(o)) {
                ll = o.length;
                for (k = 0; k < ll; k += 1) {
                    clean(o[k]);
                }
            } else if (o) {
                clean(o);
            }
        }
        dirty = this.getDepthSortedList();
    }
    inUpdate = false;
};

var dirty = new DirtyList();
exports.setDirty = function (o, why) {
    dirty.setDirty.apply(dirty, arguments);
};
exports.update = function () {
    dirty.update();
};
exports.setChildrenDirty = function (o, why) {
    var i,
        l = arguments.length,
        args;
    for (i = 0; i < l; i += 1) {
        args[i] = arguments[i];
    }

    forEachProperty(o.children, function (c) {
        args[0] = c;
        dirty.setDirty.apply(dirty, args);
    });
};
