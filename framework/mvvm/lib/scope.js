"use strict";
var globalObject = {},
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty;
// We have the notion of binding scope
function Scope(object, parentScope) {
    this.parent = parentScope;
    this.object = object || globalObject;
}
Scope.globalScope = new Scope(globalObject);

Scope.prototype.getTop = function () {
    var scope = this;
    while (scope.parent) {
        scope = scope.parent;
    }
    return scope;
};
Scope.prototype.getParent = function () {
    return this.parent;
};
Scope.prototype.retrieveOrCreateChildScope = function (member) {
    // note this potentially CREATES a child object
    if (typeof this.object[member] !== 'object') {
        this.object[member] = {};
    }
    return new Scope(this.object[member], this);
};
// resolves a scope relative to the current scope with a with clause
Scope.prototype.resolveScope = function (w) {
    if (typeof w === 'string') {
        w = w.split('/');
    }
    var p = w,
        path = [],
        res = {},
        varpath,
        scope = this;
    // resolves a variable
    forEach(path, function (rel, i) {
        if (rel === '..') {
            if (scope.getParent()) {
                scope = scope.getParent();
            } else {
                // invalid path!?!?!?
                throw new Error('Invalid path');
            }
        } else if (rel === '') {
            scope = scope.getTopmost();
        } else if (rel === '~') {
            // global scope
            scope = new Scope();
        } else if (rel !== '.') {
 ///////////////////////////// I AM HERE!!!!!!!!!!!!!!!!!!!!!!!!!!
            // resolve to an scope
            scope = scope.retrieveOrCreateChildScope(rel);
        }
    });
    return scope;
};
// scope navigation with slashes, variable lookup with dots
Scope.prototype.resolve = function (variable) {
    var p = variable.split('/'),
        scopePart = p.slice(0, -1),
        varpath = p.slice(-1)[0].split('.'),
        scope = this.resolveScope(scopePart),
        res = {};
    res.object = scope.object;
    forEach(varpath, function (v, j) {
        if (j < (varpath.length - 1)) {
            if (typeof res.object[v] !== 'object') {
                res.object[v] = {};
            }
            res.object = res.object[v];
        } else {
            res.variable = v;
        }
    });
    return res;
};
exports.Scope = Scope;
