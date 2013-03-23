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
/*globals window, escape */
"use strict";
var controllers = {},
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty,
    isArray = utils.isArray,
    isObject = utils.isObject,
    stripWhite = utils.stripWhite,
    map = utils.map;

function registerController(name, controller) {
    if (controllers[name]) {
        throw new Error('Controller already exists ' + name);
    }
    controllers[name] = controller;
}
/*jslint regexp: false*/

exports.registerController = registerController;
exports.controllers = controllers;
//exports.runController = runController;

// here we add a bunch of predifined controllers
registerController('list', {
    'new': function (arr, arg) {
        if (isArray(arr)) {
            arr.push(arg || {});
        }
    },
    'removeLast': function (arr) {
        if (isArray(arr)) {
            arr.splice(-1, 1);
        }
    },
    remove: function (arr, arg) {
        /*if (isArray(arr)) {
            arr.slice(list.indexOf(arg));
        }*/
        //broken
    }
});
registerController('log', function (arg) {
    console.log(arg);
});
registerController('showJSON', function (arg) {
    /*globals alert */
    alert(JSON.stringify(arg, null, 4));
});
registerController('setRoute', function (factory, type, query) {
    var hash = '#',
        qp = [],
        stage = require('stage');
    try {
        hash = '#' + escape(factory) + '.' + escape(type);
        if (isObject(query) && query) {
            forEachProperty(query, function (v, k) {
                qp.push(escape(k) + '=' + escape(v));
            });
            if (qp.length > 0) {
                hash = hash + '?' + qp.join('&');
            }
        }

        window.location.hash = hash;
    } catch (e) {
    }
});
