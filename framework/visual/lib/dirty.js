/**
    dirty.js
    Copyright (C) 2012 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    isNumber = utils.isNumber,
    isArray = utils.isArray,
    inUpdate = false;

/*
* Constructs a dirty list
* @private
*/
function DirtyList() {
    this.dirty = [];
}

/*
* Flags an element as dirty.
* @private
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

/*
* Returns a depth sorted dirty list
* @private
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

/*
* Cleans all dirt.
* @private
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

/*
* Sets a visual element as dirty.
* @private
*/
exports.setDirty = function (o, why) {
    dirty.setDirty.apply(dirty, arguments);
};

/*
* Updates a visual element.
* @private
*/
exports.update = function () {
    dirty.update();
};

/*
* Sets all children of a visual element as dirty.
* @private
*/
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
