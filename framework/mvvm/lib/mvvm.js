/**
    mvvm.js
    Copyright (C) 2013 Hugo Windisch

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
//"use strict";
/*jslint sloppy: true */
var utils = require('utils'),
    events = require('events'),
    domvisual = require('domvisual'),
    globalEvents = domvisual.globalEvents,
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty,
    isObject = utils.isObject,
    controller = require('./controller'),
    Scope = require('./scope').Scope,
    BindingMap = require('./map').BindingMap;

// automatically refresh the bindings on browser events
globalEvents.on('browserEvent', function () {
    BindingMap.refresh();
});

function bindMVVM(vis, scope) {
    var mvvm = vis.mvvm,
        availableBindings = vis.availableBindings,
        listValue = mvvm.listValue;

    // with is a special binding that we process here
    if (vis.bindingInfo && vis.bindingInfo.with) {
        mvvm.w = vis.bindingInfo.with;
    }
    // special handling of listed elements
    if (listValue) {
        // note that these never have a with
        mvvm.scope = new Scope(isObject(listValue) ? listValue : {}, null, scope);
    } else {
        // normal scoping
        mvvm.scope = scope.resolveScope(mvvm.w);
    }
    if (vis.bindingInfo) {
        forEachProperty(vis.bindingInfo, function (b, k) {
            availableBindings[k](vis, mvvm, b);
        });
    }
}

function getMVVMScope(vis) {
    if (vis.mvvm && vis.mvvm.topScope) {
        return vis.mvvm.topScope;
    }
    while (vis) {
        if (vis.mvvm && vis.mvvm.scope) {
            return vis.mvvm.scope;
        }
        vis = vis.getParent();
    }
    return Scope.globalScope;
}

// keep all MVVM crap under one umbrella
function MVVM(vis) {
    var that = this;
    this.w = '';

    vis.on('connectedToTheStage', function (c) {
        if (c) {
            that.bindingMap = new BindingMap();
            bindMVVM(vis, getMVVMScope(vis));
            that.bindingMap.register();
        } else if (that.bindingMap) {
            that.bindingMap.unregister();
            // clear the binding map
            that.bindingMap.clear();
            that.emit('clear');
            delete that.bindingMap;
        }
    });
}
MVVM.prototype = new events.EventEmitter();
MVVM.prototype.setWith = function (w) {
    if (w) {
        this.w = w;
    } else {
        delete this.w;
    }
    return this;
};
MVVM.prototype.getWith = function () {
    return this.w;
};

function setMVVMData(data) {
    this.mvvm = this.mvvm || new MVVM(this);
    this.mvvm.topScope = new Scope(data);
}

function setBindingInfo(b) {
	this.mvvm = this.mvvm || new MVVM(this);
    this.bindingInfo = b;
    return this;
}
function getBindingInfo() {
    return this.bindingInfo || [];
}
MVVM.initialize = function (VisualConstructor, availableBindings) {
    VisualConstructor.prototype.setMVVMBindingInfo = setBindingInfo;
    VisualConstructor.prototype.getMVVMBindingInfo = getBindingInfo;
    VisualConstructor.prototype.availableBindings = availableBindings;
    VisualConstructor.prototype.setMVVMData = setMVVMData;
};

// binding helpers
// ---------------
function bidiPropBinding(propertyName) {
    return function (vis, mvvm, expression) {
        mvvm.bindingMap.bind(
            mvvm.scope,
            expression,
            function (v) {
                var fcn = vis[vis.getSetFunctionName(propertyName)];
                if (fcn) {
                    return fcn.call(vis, v);
                }
                return vis;
            },
            function () {
                // FIXME: this should be optional
                var fcn = vis[vis.getGetFunctionName(propertyName)];
                if (fcn) {
                    return fcn.call(vis);
                }
                return undefined;
            },
            null
        );
    };
}
function withBinding() {
    return function (vis, mvvm, expression) {
        // we do nothing here because this is caught earlier
    };
}
function listBinding(createVisualForData) {
    return function (vis, mvvm, expression) {
        // create a list if there is nothing
//        if (res.object[res.variable] === undefined) {
//            res.object[res.variable] = [];
//        }
        mvvm.bindingMap.bind(
            mvvm.scope,
            expression,
            null,
            null,
            // here we could do the full list synchronization
            function (l) {
                var children = {},
                    order = 0;
                // FIXME: to speedup things, we could MAP the items.
                // the degenrated case is when items.toString() all return
                // the same thing but if it does not the list scanning becomes
                // ~o(n)
                vis.forEachChild(function (c, k) {
                    // here, the child should always have a scope and
                    // a cached value and a list
                    var v = c.mvvm.scope.cachedValue,
                        kk = String(v),
                        e = {c: c, v: v },
                        l = children[kk];
                    if (!l) {
                        children[kk] = [e];
                    } else {
                        l.push(e);
                    }
                });
//console.log(children);
                // scan the list
//console.log('-----------');
                forEach(l, function (e, i) {
                    var ch,
                        l = children[String(e)];
                    // we want to find the child that checks element e
                    // this is fucking o(n2) so pretty bad... an observable
                    // list would be way better!!!!!!!!!
                    // at least we are greedy
                    if (!l || !forEach(l, function (c, j) {
                            if (c.v === e) {
                                l.splice(j, 1);
                                if (c.c.order !== order) {
//console.log('moveChild ' + c.c.name + ' ' + c.c.order + ' -> ' + order);
                                    vis.setOrderUnsafe(c.c, order);
                                }
                                return true;
                            }
                        })
                            ) {
                        // not found, we need to add a new one
                        ch = createVisualForData(vis, e);
                        if (ch) {
                            // make sure it has mmvm stuff
                            ch.mvvm = ch.mvvm || new MVVM(ch);
                            ch.mvvm.listValue = e;
                            // if e is an object, this thing should have its own scope
                            vis.addChild(ch);
                            vis.setOrderUnsafe(ch, order);
                            // HERE, ch should have a scope
                            if (!ch.mvvm.scope) {
                                throw new Error('Missing scope after insertion');
                            }
                            // keep list info FIXME: needs to be in the scope object
                            ch.mvvm.scope.cachedValue = e;
                            ch.mvvm.scope.list = l;

//console.log('addChild ' + ch.name + ' ' + order);
                        }
                    }
                    // increase order
                    order += 1;
                });
                // make sure that what we will remove is in order
                forEachProperty(children, function (l) {
                    forEach(l, function (c) {
                        vis.setOrderUnsafe(c.c, order);
                        order += 1;
                    });
                });
                // remove
                forEachProperty(children, function (l) {
                    forEach(l, function (c) {
//console.log('removeChild ' + c.c.name);
                        c.c.remove();
                    });
                });
            }
        );
    };
}
function eventBinding(event) {
    // FIXME: the problem with this binding is : when it is REGENERATED!
    //
    return function (vis, mvvm, expression) {
        function listener() {
            controller.runController(mvvm.scope, expression);
        }
        vis.on(event, listener);
        mvvm.on('clear', function () {
            vis.removeListener(event, listener);
        });
    };
}
// maybe the basic drag and drop thing should go in domvisual really
// like setdraggable, setDropZone
// anyway I have to support the mappings for the events...
function draggableBinding() {
    return function (vis, mvvm, expression) {
        //vis.setDraggable(// expression //)
    };
}
function dropZoneBinding() {
// 2 things we need to know: what to accept and what to do
// when we accept stuff
    return function (vis, mvvm, expression) {
        var event = 'dropPayload';
        function listener(payload) {
            //controller.runController(mvvm.scope, expression);
        }
        vis.on(event, listener);
        mvvm.on('clear', function () {
            vis.removeListener(event, listener);
        });
    };
}
function dragAndDropList() {
// we need the accept object:
    return function (vis, mvvm, expression) {
        var event = 'dropPayload';
        function listener() {
            // here we manipulate the list
        }
        vis.on(event, listener);
        mvvm.on('clear', function () {
            vis.removeListener(event, listener);
        });
    };
}

function getDefaultBindings(extraBindings) {
    return utils.apply(extraBindings || {}, {
        position: bidiPropBinding('position'),
        mouseover: eventBinding('mouseover'),
        mouseout: eventBinding('mouseout'),
        'with': withBinding()
    });
}

exports.Scope = Scope;
exports.BindingMap = BindingMap;
exports.MVVM = MVVM;
exports.bidiPropBinding = bidiPropBinding;
exports.withBinding = withBinding;
exports.listBinding = listBinding;
exports.eventBinding = eventBinding;
exports.registerController = require('./controller').registerController;
exports.getDefaultBindings = getDefaultBindings;
