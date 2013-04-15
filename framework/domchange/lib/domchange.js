/**
    domchange.js
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
"use strict";
/*global MutationObserver, window */
function pollingImplementation() {
    var utils = require('utils'),
        visual = require('visual'),
        forEach = utils.forEach,
        INTERVAL = 50,
        timeout = null,
        monitored = [];

    function trackDimChange() {
        var mon = [],
            changed = false;
        forEach(monitored, function (m) {
            var dim,
                e = m.vis.element;
            // we won't keep the ones that are removed
            if (m.vis.connectedToTheStage) {
                // get the computed dimensions
                dim = m.vis.getComputedDimensions();
                if (dim[0] !== m.dim[0] || dim[1] !== m.dim[1]) {
                    m.vis.emit('domchange', dim.slice(0));
                    m.dim = dim;
                    changed = true;
                }
                mon.push(m);
            }
        });
        // replace the list of monitored
        monitored = mon;
        return changed;
    }

    function updateMonitoring() {
        function mon() {
            if (trackDimChange()) {
                visual.update();
            }
            timeout = null;
            updateMonitoring();
        }
        if (monitored.length > 0) {
            if (timeout === null) {
                timeout = setTimeout(mon, INTERVAL);
            }
        } else {
            if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
            }
        }
    }

    function remove(vis) {
        forEach(monitored, function (m, i) {
            if (m.vis === vis) {
                monitored.splice(i, 1);
                return true;
            }
        });
    }

    function stop(vis) {
        remove(vis);
        updateMonitoring();
        return exports;
    }

    function start(vis) {
        remove(vis);
        monitored.push({
            vis: vis,
            dim: [ vis.element.offsetWidth, vis.element.offsetHeight, 0 ]
        });
        updateMonitoring();
        return exports;
    }

    exports.start = start;
    exports.stop = stop;
}
function mutationObserverImplementation() {
    var visual = require('visual');
    function stop(vis) {
        if (vis.mutationObserver) {
            vis.mutationObserver.disconnect();
            delete vis.mutationObserver;
        }
    }
    function start(vis) {
        if (!vis.mutationObserver) {
            var prevDim = vis.getComputedDimensions(),
                config = { attributes: true, childList: true, characterData: true };
            vis.mutationObserver = new MutationObserver(function (mutations) {
                vis.mutationObserver.disconnect();
                var dim = vis.getComputedDimensions();
                if (dim[0] !== prevDim[0] || dim[1] !== prevDim[1]) {
                    vis.emit('domchange', dim.slice(0));
                    visual.update();
                    prevDim = dim;
                }
                vis.mutationObserver.observe(vis.element, config);
            });
            vis.mutationObserver.observe(vis.element, config);
        }
    }
    exports.start = start;
    exports.stop = stop;
}
if (window.MutationObserver) {
    // do it by mutation observers
    mutationObserverImplementation();
} else {
    // Do it by polling
    pollingImplementation();
}
