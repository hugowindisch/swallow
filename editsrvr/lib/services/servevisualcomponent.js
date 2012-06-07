/**
    servevisualcomponent.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var meatgrinder = require('meatgrinder'),
    jqtpl = require('jqtpl'),
    path = require('path'),
    findPackages = meatgrinder.findPackages,
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
function generateVisualCompoentHtml(
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
        cssFiles = [];
    if (deps) {
        Object.keys(deps).forEach(function (d) {
            dependencies.push(path.join(d, d + '.js'));
        });
        Object.keys(cssFileMap).forEach(function (k) {
            var details = cssFileMap[k].details;
            cssFiles.push(details.name + k.slice(details.dirname.length));
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
        monitor: monitor
    });
}

function serveVisualComponent(options, forEdit, monitor) {
    return function (req, res, match) {
        var factory = forEdit ? 'editor' : match[1],
            type = forEdit ? 'Editor' : match[2],
            extendedOptions = apply(
                {
                    extra: function (opt, details, packageMap, deps, cssFileMap, cb) {
                        if (factory === details.name) {
                            var htmlBuf = generateVisualCompoentHtml(
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
                            res.end();
                        }
                        cb(null);
                    }
                },
                options
            );
        meatgrinder.makePackage(
            extendedOptions,
            factory,
            function (err) {
                if (err) {
                    res.writeHead(404);
                    console.log(err);
                }
            }
        );
    };
}

function publishVisualComponent(req, res, match, options) {
    var factory = match[1],
        type = match[2],
        publishFolder = './publish',
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
                                    var htmlBuf = generateVisualCompoentHtml(
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
                meatgrinder.makePackage(
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

function monitor(req, res, match, options) {
    var factory = match[1],
        type = match[2],
        processed;
    switch (req.method) {
    case 'GET':
        monitored = { factory: factory, type: type };
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

function redirectToMonitored(req, res, match, options) {
    var m = monitored;
    res.setHeader("Location", "/make/" + m.factory + '.' + m.type + '.mon');
    res.writeHead(302);
    res.end();
}

exports.serveVisualComponent = serveVisualComponent;
exports.publishVisualComponent = publishVisualComponent;
exports.monitor = monitor;
exports.redirectToMonitored = redirectToMonitored;
