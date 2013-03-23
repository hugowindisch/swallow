/**
    stage.js
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
/*globals window, unescape */
"use strict";
var stage = require('domvisual').getStage(),
    visual = require('visual'),
    utils = require('utils'),
    deepCopy = utils.deepCopy,
    deepEqual = utils.deepEqual,
    isArray = utils.isArray,
    isString = utils.isString,
    forEach = utils.forEach,
    enter = 'enter',
    show = 'show',
    exit = 'exit',
    duration = 300,
    transition,
    visibleFactory = null,
    visibleType = null,
    visiblePage = null,
    visibleParams = {};


// sets the resize policy of the stage
function setResizePolicy(hResize, vResize, w, h) {
    stage.applyLayout = function () {
        var dimensions = stage.dimensions;
        stage.forEachChild(function (c) {
            var dim = c.dimensions;
            c.setDimensions([
                hResize ? dimensions[0] : dim[0],
                vResize ? dimensions[1] : dim[1],
                dim[2]
            ]);
            c.setDimensions(c.getDimensionsAdjustedForContent());
        });
    };
    stage.requestDimensions = function (dim) {
        stage.applyLayout();
    }
    stage.setOverflow(['hidden', 'auto']);
    stage.setLayout(null);
}

// sets the transition for entering pages
function setTransition(enterPos, showPos, exitPos, dur, trans) {
}

// this is the showPage functionnality
function showPage(factory, type, params) {
    var Constr,
        c,
        cDim,
        root = stage.getChildAtPosition('root');
    function pageOut(vp) {
        if (root.layout && root.layout.positions.exit) {
            vp.setTransition(300);
            vp.setPosition(exit);
            // what IF transitions are NOT supported!!!
            vp.on('transitionend', function () {
                vp.remove();
            });
        } else {
            vp.remove();
        }
    }
    function pageIn(vp) {
        var cDim = deepCopy(vp.dimensions);
        root.addChild(vp);
        if (root.layout && root.layout.positions[enter]) {
            vp.clearTransition();
            vp.setPosition(enter);
            setTimeout(function () {
                if (vp.parent && vp.position !== exit) {
                    vp.setTransition(300);
                    vp.setPosition(show);
                    vp.requestDimensions(cDim);
                    visual.update();
                }
            }, 10);
        } else {
            vp.setPosition(show);
            vp.requestDimensions(cDim);
        }
    }
    if (visibleFactory !== factory || visibleType !== type || !deepEqual(params, visibleParams)) {
        // remove the existing page
        if (visiblePage) {
            pageOut(visiblePage);
            visiblePage = null;
            visibleFactory = null;
            visibleType = null;
        }
        // create the new one
        try {
            Constr = require(factory)[type];
            c = new Constr(params);
        } catch (e) {
            console.log('Could not create: ' + factory + '.' + type);
            return;
        }
        try {
            pageIn(c);
        } catch (e2) {
            console.log('problem in pageIn ' + e2);
        }
        visiblePage = c;
        visibleFactory = factory;
        visibleType = type;
        visibleParams = params;
    }
}
// load a location
function loadLocation() {
    var factory, type, parts, toLoad, args, plist, params = {};
    if (window.location.hash) {
        parts = window.location.hash.split('?');
        toLoad = parts[0].split('.');
        if (toLoad.length === 2) {
            factory = unescape(toLoad[0].slice(1));
            type = unescape(toLoad[1]);
        }
        if (parts.length > 1) {
            plist = parts[1].split('&');
            forEach(plist, function (p) {
                var assign = p.split('='),
                    k = assign[0],
                    v = assign[1];
                if (isString(v)) {
                    v = unescape(v);
                }
                if (isArray(params[k])) {
                    params[k].push(v);
                } else if (params.hasOwnProperty(k)) {
                    params[k] = [params[k], v];

                } else {
                    params[k] = v;
                }
            });
        }

    }
    showPage(factory, type, params);
    // FIXME: we should have a Visual.setInterval that would cleanly
    // remove the interval when the thing is removed from the stage,
    // and do the update automatically
    visual.update();
}
function enableAutoRouting() {
    // poll the location
    setInterval(loadLocation, 300);
}

exports.setResizePolicy = setResizePolicy;
exports.setTransition = setTransition;
exports.showPage = showPage;
exports.enableAutoRouting = enableAutoRouting;
