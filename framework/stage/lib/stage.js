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
/*globals window */
"use strict";
var stage = require('domvisual').getStage(),
    visual = require('visual'),
    utils = require('utils'),
    deepCopy = utils.deepCopy,
    enter = 'enter',
    show = 'show',
    exit = 'exit',
    duration = 300,
    transition;

// sets the resize policy of the stage
function setResizePolicy(hResize, vResize) {
}

// sets the transition for entering pages
function setTransition(enterPos, showPos, exitPos, dur, trans) {
}

// this is the showPage functionnality
function showPage(factory, type) {
    var Constr,
        c,
        cDim,
        root = stage.getChildAtPosition('root'),
        visibleFactory = null,
        visibleType = null,
        visiblePage = null;
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
        root.adjustDimensionsToContent(cDim);

        if (root.layout && root.layout.positions[enter]) {
            vp.clearTransition();
            vp.setPosition(enter);
            setTimeout(function () {
                if (vp.parent && vp.position !== exit) {
                    vp.setTransition(300);
                    vp.setPosition(show);
                    visual.update();
                }
            }, 10);
        } else {
            vp.setPosition(show);
        }
    }
    if (visibleFactory !== factory || visibleType !== type) {
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
            c = new Constr();
            pageIn(c);
            visiblePage = c;
            visibleFactory = factory;
            visibleType = type;
        } catch (e) {
        }
    }
}
// load a location
function loadLocation() {
    var factory, type, toLoad;
    if (window.location.hash) {
        toLoad = window.location.hash.split('.');
        if (toLoad.length === 2) {
            factory = toLoad[0].slice(1);
            type = toLoad[1];
        }
    }
    showPage(factory, type);
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
