/**
    servevisualcomponent.js

    The SwallowApps Editor, an interactive application builder for creating
    html applications.

    Copyright (C) 2012  Hugo Windisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>

*/
"use strict";
var pillow = require('pillow'),
    jqtpl = require('jqtpl'),
    path = require('path'),
    findPackages = pillow.findPackages,
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    wrench = require('wrench'),
    ssevents = require('./ssevents'),
    mimeType = {
        json: 'application/json'
    },
    monitored = { factory: 'monitor', type: 'Monitor' };

function apply(to, from) {
    Object.keys(from).forEach(function (k) {
        to[k] = from[k];
    });
    return to;
}

function getMakeHtmlFunction(type, title, monitor, writeHtmlBuf) {
    return function (
        cxt,
        cb
    ) {
        var options = cxt.options,
            details = cxt.details,
            packageMap = cxt.packageMap,
            mostRecentJSDate = cxt.mostRecentJSDate,
            deps = cxt.deps,
            depsFileMap = cxt.depsFileMap,
            cssFileMap = cxt.cssFileMap,
            cssMostRecentDate = cxt.cssMostRecentDate,
            // we need to load all components
            dependencies = [ ],
            cssFiles = [],
            iconFile = path.join(details.dirname, type + '.favicon.png'),
            icon = details.stats[iconFile] ? (details.name + '/' + type + '.favicon.png') : null,
            loadingVis = false,
            vis = {};
        function whenReady() {
            if (deps) {
                Object.keys(deps).forEach(function (d) {
                    dependencies.push(d + '/' + d + '.js');
                });
                Object.keys(cssFileMap).forEach(function (k) {
                    var details = cssFileMap[k].details,
                        vfn = details.name + k.slice(details.dirname.length);
                    cssFiles.push(vfn.split('\\').join('/'));
                });
            }
            // return the generated buffer
            writeHtmlBuf(jqtpl.tmpl('visualComponent', {
                dependencies: dependencies,
                css: cssFiles,
                factory: details.name,
                type: type,
                jquery: options.jquery ? path.basename(options.jquery) : null,
                monitor: monitor,
                icon: vis.icon || icon,
                title: vis.title || title,
                description: vis.description,
                keywords: vis.keywords,
                fonts: options.fonts || []
            }));
            cb(null);
        }
        details.other.forEach(function (f) {
            if (!loadingVis && (f.indexOf(type + '.vis') !== -1)) {
                loadingVis = true;
                fs.readFile(f, function (err, dat) {
                    if (!err) {
                        vis = JSON.parse(dat);
                    }
                    whenReady();
                });
            }
        });
        if (!loadingVis) {
            whenReady();
        }
    };
}

function makeAndGenerateHtml(options, factory, type, monitor, minify, cb) {
    var htmlBuf,
        extendedOptions = apply(
            {
                makeRules: {
                    makeHtml: getMakeHtmlFunction(type, type, monitor, function (buf) { htmlBuf = buf; })
                }
            },
            options
        );
    pillow.makePackage(
        extendedOptions,
        factory,
        function (err) {
            if (err) {
                return cb(err);
            }
            return cb(null, htmlBuf);
        }
    );
}

function serveVisualComponent(forEdit, monitor) {
    return function (req, res, cxt) {
        makeAndGenerateHtml(cxt.options, cxt.match[1], cxt.match[2], monitor, false, function (err, buf) {
            if (err) {
                res.writeHead(404);
                console.log(err);
                return;
            }
            res.writeHead(200);
            res.write(buf);
            res.end();
        });
    };
}

/*
function publishVisualComponent(req, res, cxt) {
    var options = cxt.options,
        match = cxt.match,
        factory = match[1],
        type = match[2],
        publishFolder = options.publishFolder,
        cmpFolder = path.join(publishFolder, factory + '.' + type);

    function ret404(err) {
        res.writeHead(404);
        if (err) {
            res.write(String(err));
        }
        res.end();
    }

    async.series(
        [
            function (cb) {
                // create directory
                fs.mkdir(publishFolder, function (err) {
                    // FIXME we assume that any error is because the directory exits
                    cb(null);
                });
            },
            function (cb) {
                // FIXME: savagely remove directory (synchronously, bad)
                wrench.rmdirSyncRecursive(cmpFolder, true);
                // create directory
                fs.mkdir(cmpFolder, cb);
            },
            function (cb) {
                // publish
                var extendedOptions = apply(
                        {
                            extra: function (opt, details, packageMap, deps, cssFileMap, cb) {
                                if (factory === details.name) {
                                    var htmlBuf = generateVisualComponentHtml(
                                        opt,
                                        details,
                                        packageMap,
                                        deps,
                                        cssFileMap,
                                        type,
                                        type
                                    );
                                    // now we are ready to write this file
                                    fs.writeFile(path.join(cmpFolder, 'index.html'), htmlBuf, cb);
                                } else {
                                    cb(null);
                                }
                            },
                            // force minification
                            minify: true
                        },
                        options
                    );
                // override dest folder
                extendedOptions.dstFolder = cmpFolder;
                // make
                pillow.makePackage(
                    extendedOptions,
                    factory,
                    cb
                );
            }
        ],
        // callback
        function (err) {
            if (err) {
                return ret404(err);
            }
            res.writeHead(200);
            res.end();
        }
    );
}
*/
function monitor(req, res, cxt) {
    var options = cxt.options,
        match = cxt.match,
        factory = match[1],
        type = match[2],
        processed;
    switch (req.method) {
    case 'GET':
        res.writeHead(200, {'Content-Type': mimeType.json});
        res.write(JSON.stringify(monitored));
        res.end();
        break;
    case 'POST':
        if (factory && type) {
            monitored = { factory: factory, type: type };
            ssevents.emit('monitor', monitored);
        }
        res.writeHead(200);
        res.end();
        break;
    default:
        res.writeHead(404);
        break;
    }

    res.end();
}

function redirectToMonitored(req, res, cxt) {
    var options = cxt.options,
        match = cxt.match,
        m = monitored;
    res.setHeader("Location", "/swallow/make/" + m.factory + '.' + m.type + '.mon');
    res.writeHead(302);
    res.end();
}

exports.serveVisualComponent = serveVisualComponent;
// broken
//exports.publishVisualComponent = publishVisualComponent;
exports.monitor = monitor;
exports.redirectToMonitored = redirectToMonitored;
exports.makeAndGenerateHtml = makeAndGenerateHtml;
