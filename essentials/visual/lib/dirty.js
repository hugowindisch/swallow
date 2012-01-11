/**
    dirty.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

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
DirtyList.prototype.setDirty = function (o, why) {
    if (!o.isDirty) {
        var depth = o.containmentDepth,
            dirty = this.dirty;
        o.isDirty = {};
            
        if (!dirty[depth]) {
            dirty[depth] = [o];
        } else {
            dirty[depth].push(o);
        }
    }
    if (why) {
        o.isDirty[why] = true;
    }
};

/**
    Cleans all dirt.
*/
DirtyList.prototype.update = function () {
    var i, 
        l,
        dirty,
        o,
        why;
        
    while ((l = this.dirty.length) > 0) {
        dirty = this.dirty;      
        this.dirty = [];
        for (i = 0; i < l; i += 1) {
            o = dirty[i];
            why = o.isDirty;
            delete o.isDirty;
            o.update(why);
        }
    }
};

var dirty = new DirtyList();
exports.setDirty = function (o, why) {
    dirty.setDirty(o, why);
};
exports.update = function () {
    dirty.update();
};

