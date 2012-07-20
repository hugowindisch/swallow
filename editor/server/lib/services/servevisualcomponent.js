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

/**
    Publishes the html that allows to run the package in a browser
    using a standalone statically loaded html.
*/
function generateVisualComponentHtml(
    options,
    details,
    packageMap,
    deps,
    cssFileMap,
    type,
    editFactory,
    editType,
    monitor
) {
    // we need to load all components
    var dependencies = [ ],
        cssFiles = [],
        iconFile = path.join(details.dirname, type + '.favicon.png'),
        icon = details.stats[iconFile] ? (details.name + '/' + type + '.favicon.png') : null;
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
    return jqtpl.tmpl('visualComponent', {
        dependencies: dependencies,
        css: cssFiles,
        factory: details.name,
        type: type,
        editFactory: editFactory,
        editType: editType,
        jquery: options.jquery ? path.basename(options.jquery) : null,
        monitor: monitor,
        icon: icon
    });
}

function serveVisualComponent(forEdit, monitor) {
    return function (req, res, cxt) {
        var options = cxt.options,
            match = cxt.match,
            factory = forEdit ? 'editor' : match[1],
            type = forEdit ? 'Editor' : match[2],
            extendedOptions = apply(
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
                                forEdit ? match[1] : null,
                                forEdit ? match[2] : null,
                                monitor
                            );
                            // now we are ready to return this
                            res.writeHead(200);
                            res.write(htmlBuf);
                            // we intentionally don't call res.end here
                            // ee call it when makePackage returns
                        }
                        cb(null);
                    }
                },
                options
            );
        pillow.makePackage(
            extendedOptions,
            factory,
            function (err) {
                if (err) {
                    res.writeHead(404);
                    console.log(err);
                }
                // res.end is done here
                res.end();
            }
        );
    };
}

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
exports.publishVisualComponent = publishVisualComponent;
exports.monitor = monitor;
exports.redirectToMonitored = redirectToMonitored;
