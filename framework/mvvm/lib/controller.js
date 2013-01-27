/**
    controller.js
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
/*
    controllers:
    we want to manipulate un adulterated data. plain data, jason data.

    So our data will not have 'class/prototype' functions.

    so we can add CONTROLLERS. These are data manipulators.A CONTROLLER is
    some kind of function that anyone can use to act on some data. It can
    act on anything (but may expect some kind of data). A CONTROLLER is a data
    manipulator.

    We can add controllers to mvvm (NOT scope related: why would a button
    need to be the child of a list to be able to work on it)

    syntax for events:
    scope.variable:controller(params)

    controller can be nested

    controllers receive (scope, expression, params..)
*/
"use strict";
var controllers = {},
    utils = require('utils'),
    forEach = utils.forEach,
    isArray = utils.isArray,
    stripWhite = utils.stripWhite,
    map = utils.map;

function registerController(name, controller) {
    if (controllers[name]) {
        throw new Error('Controller already exists ' + name);
    }
    controllers[name] = controller;
}
/*jslint regexp: false*/
function runController(scope, expression) {
    var what = /([^:]*)\:([^\(]*)\(([^\)]*)\)?/.exec(expression),
        expressionPart,
        controllerPart,
        controller = controllers,
        args;

    if (what) {
        expressionPart = what[1];
        controllerPart = what[2].split('.');
        args = map(what[3].split(','), stripWhite);

        // find the controller
        forEach(controllerPart, function (sub) {
            controller = controller[sub];
        });

        // at this point we should have a function
        args.unshift(scope, expressionPart);
        controller.apply(null, args);
    }
}

exports.registerController = registerController;
exports.runController = runController;

// here we add a bunch of predifined controllers
registerController('list', {
    'new': function (scope, expression) {
        var res = scope.resolve(expression),
            arr = res.object[res.variable];
        if (isArray(arr)) {
            arr.push({});
        }
    },
    'removeLast': function (scope, expression) {
        var res = scope.resolve(expression),
            arr = res.object[res.variable];
        if (isArray(arr)) {
            arr.splice(-1, 1);
        }
    },
    remove: function (scope, expression) {
        var listScope = scope.getListCope(),
            list;
        if (listScope) {
            list = listScope.list;
            list.slice(list.indexOf(list.cachedValue));
        }
    }
});
registerController('log', function (scope, expression, arg) {
    console.log(arg);
});
registerController('showJSON', function (scope, expression, arg) {
    var res = scope.resolve(expression);
    alert(JSON.stringify(res.object[res.variable], null, 4));
});
