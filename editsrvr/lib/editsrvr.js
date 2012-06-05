#!/usr/bin/node
/**
    editsrvr.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals __dirname */
/*jslint regexp: false */

/*
    There can be many visual elements in a given package.
    A visual component is identified by a package/constructorName pair.

    There will be, in the visual component:
        constructorName.vis
        constructorName.js

    Generated during the save phase
    ===============================
        groups.js
            // exports all needed stuff (exports.xyz)
            // including a function that will add all needed exports
            // to the

        package.json
            // the dependencies are updated to reflect all what's listed
            // in the various vis files


        so, saving a .vis will cause the following things to happen:
            - Update the lib/group.js file
            - Update the package.json file

    URLS that we support
    ====================
    visual/package/Constructor
        PUT
        GET: returns an existing visual
        DELETE
    visual/
        GET: returns a list of all visuals
    visual/package/Constructor/img
        GET: returns a list of all images available to the



   // EXPORTED visuals
   // from the editor a vis can be marked as private (only accessible to
   // is containing package) or public (accessible to everyone).
*/
var meatgrinder = require('meatgrinder'),
    jqtpl = require('jqtpl'),
    fs = require('fs'),
    path = require('path'),
    findPackages = meatgrinder.findPackages,
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mimeType = {
        json: 'application/json'
    },
    ssevents = require('./ssevents');


jqtpl.template(
    'jsFile',
    fs.readFileSync(
        path.join(__dirname, 'templates/visual.js')
    ).toString()
);

jqtpl.template(
    'groupFile',
    fs.readFileSync(
        path.join(__dirname, 'templates/groups.js')
    ).toString()
);

jqtpl.template(
    'visualComponent',
    fs.readFileSync(
        path.join(__dirname, 'templates/visualComponent.html')
    ).toString()
);

jqtpl.template(
    'packageJson',
    fs.readFileSync(
        path.join(__dirname, 'templates/packageJson')
    ).toString()
);

jqtpl.template(
    'mainJs',
    fs.readFileSync(
        path.join(__dirname, 'templates/main.js')
    ).toString()
);

function apply(to, from) {
    Object.keys(from).forEach(function (k) {
        to[k] = from[k];
    });
    return to;
}

// creates a new / empty visual
function createNewVisual() {
    return {
        description: '',
        private: true,
        privateTheme: true,
        dimensions: [ 600, 400, 0],
        gridSize: 8,
        children: {},
        positions: {}
    };
}

// finds a given visual in the specified package
function findVisualInPackage(pack, visual) {
    var re = /([^\/\.]*)\.vis$/,
        ret;
    pack.other.some(function (d) {
        var m = re.exec(d);
        if (m && m[1] === visual) {
            ret = d;
            return true;
        }
        return false;
    });
    return ret;
}

// finds a given js in the specified package
function findJSInPackage(pack, visual) {
    var re = /([^\/\.]*)\.js$/,
        ret;
    pack.js.some(function (d) {
        var m = re.exec(d);
        if (m && m[1] === visual) {
            ret = d;
            return true;
        }
        return false;
    });
    return ret;
}


// loads all vis files in a package
function loadVisFiles(pack, cb) {
    var re = /([^\/\.]*)\.vis$/,
        // find all the visuals in the package
        pVis = pack.other.filter(function (fn) {
            return re.test(fn);
        });
    // load all the vis files
    async.map(
        pVis,
        function (v, cb) {
            fs.readFile(v, function (err, data) {
                var visName = re.exec(v)[1];
                if (err) {
                    return cb(err);
                }
                try {
                    cb(null, {name: visName, path: v, data: JSON.parse(data)});
                } catch (e) {
                    cb(e);
                }
            });

        },
        cb
    );
}

// generates the visual.js file (default source file)
function saveVisualSourceFile(pack, visual, cb) {
    var js = findJSInPackage(pack, visual);
    // only save it if it can't already be found (i.e. create a default
    // js file).
    if (!js) {
        fs.writeFile(
            path.join(pack.dirname, 'lib', visual + '.js'),
            jqtpl.tmpl(
                'jsFile',
                {
                    packageName: pack.name,
                    clsname: visual
                }
            ),
            cb
        );
    } else {
        cb(null);
    }
}
// generates the groups.js
function saveGroupsJS(pack, allVis, cb) {
    var json = {},
        constructors = [];
    allVis.forEach(function (v) {
        var ctr = {};
        json[v.name] = v.data;
        ctr.name = v.name;
        ctr.path = findJSInPackage(pack, v.name);
        if (!ctr.path) {
            ctr.path = '/' + pack.name + '/lib/' + v.name;
        } else {
            ctr.path = ctr.path.slice(pack.dirname.length, -3);
            ctr.path = '/' + pack.name + ctr.path;
        }

        constructors.push(ctr);
    });
    fs.writeFile(
        path.join(pack.dirname, 'lib', 'groups.js'),
        jqtpl.tmpl(
            'groupFile',
            {
                packageName: pack.name,
                constructors: constructors,
                groups: JSON.stringify(json, null, 4),

            }
        ),
        cb
    );
}
//
// regenerates the package.json
function savePackageJSON(packages, pack, allVis, cb) {
    var json = pack.json;
    if (!json.dependencies) {
        json.dependencies = {};
    }
    allVis.forEach(function (v) {
        var children = v.data.children;
        Object.keys(children).forEach(function (k) {
            var vis = children[k],
                pName = vis.factory,
                dp = packages[pName];
            // we cannot be dependent on ourself
            if (pName !== json.name) {
                if (dp) {
                    json.dependencies[pName] = dp.json.version;
                } else {
                    return cb(new Error('Unresolved package ' + pName));
                }
            }
        });
    });
    fs.writeFile(pack.filename, JSON.stringify(json, null, 4), cb);
}
// saves a visual
function saveVisual(options, packageName, constructorName, json, cb) {
    var visData;
    // parse the data
    try {
        visData = JSON.parse(json);
        json = JSON.stringify(visData, null, 4);
    } catch (e) {
        return cb(e);
    }

    // save it
    findPackages(options.srcFolder, function (err, packages) {
        var pack,
            visFile,
            ret;
        // error
        if (err) {
            return cb(err);
        }
        // normal case
        pack = packages[packageName];
        if (pack) {
            visFile = findVisualInPackage(pack, constructorName);
            if (!visFile) {
                visFile = path.join(pack.dirname, 'lib', constructorName + '.vis');
            }
            fs.writeFile(visFile, json, function (err) {
                if (err) {
                    return cb(err);
                } else {
                    pack.other.push(visFile);
                    loadVisFiles(pack, function (err, allVis) {
                        if (err) {
                            return cb(err);
                        } else {
                            async.parallel([
                                function (cb) {
                                    savePackageJSON(packages, pack, allVis, cb);
                                },
                                function (cb) {
                                    saveGroupsJS(pack, allVis, cb);
                                },
                                function (cb) {
                                    saveVisualSourceFile(pack, constructorName, cb);
                                }
                            ], cb);
                        }
                    });
                }
            });
        } else {
            return cb(new Error('package not found ' + packageName));
        }
    });
}
// deletes a visual
function deleteVisual(options, packageName, constructorName, cb) {
    // save it
    findPackages(options.srcFolder, function (err, packages) {
        var pack,
            visFile,
            jsFile,
            allVis,
            ret;
        // error
        if (err) {
            return cb(err);
        }
        // normal case
        pack = packages[packageName];
        if (pack) {
            visFile = findVisualInPackage(pack, constructorName);
            jsFile = findJSInPackage(pack, constructorName);
            if (visFile && jsFile) {
                async.series(
                    [
                        // delete the visual file
                        function (cb) {
                            fs.unlink(visFile, cb);
                        },
                        // delete the js file
                        function (cb) {
                            fs.unlink(jsFile, cb);
                        },
                        function (cb) {
                            // reload packages
                            findPackages(options.srcFolder, function (err, packages) {
                                if (err) {
                                    return cb(err);
                                }
                                pack = packages[packageName];
                                cb(null);
                            });
                        },
                        // load the visual files for this package
                        function (cb) {
                            loadVisFiles(pack, function (err, av) {
                                if (err) {
                                    return cb(err);
                                }
                                allVis = av;
                                cb(null);
                            });
                        },
                        // regenerate the group
                        function (cb) {
                            saveGroupsJS(pack, allVis, cb);
                        }
                    ],
                    cb
                );
            } else {
                cb(new Error('module not found ' + constructorName));
            }
        } else {
            cb(new Error('package not found ' + packageName));
        }
    });
}
// reads a visual
function loadVisual(options, packageName, constructorName, cb) {
    // get an updated view of all available packages
    findPackages(options.srcFolder, function (err, packages) {
        var pack,
            visFile,
            ret;
        // error
        if (err) {
            return cb(err);
        }
        // normal case
        pack = packages[packageName];
        if (pack) {
            // find the visual, return the vis file as is
            visFile = findVisualInPackage(pack, constructorName);
            if (!visFile) {
                return cb(new Error('constructor not found ' + constructorName));
            }
            return cb(null, visFile);
        } else {
            return cb(new Error('package not found ' + pack));
        }
    });
}
function serveVisual(req, res, match, options) {
    var packageName = match[1],
        constructorName = match[2],
        postData;

    function ret404(err) {
        res.writeHead(404);
        if (err) {
            res.write(String(err));
        }
        res.end();
    }

    // sends a file
    function sendFile(path, mime) {
        var rs = fs.createReadStream(path);

        rs.on('error', ret404);
        rs.once('open', function (fd) {
            res.writeHead(200, {'Content-Type': mime});
        });

        rs.pipe(res);
    }
    switch (req.method) {
    case 'GET':
        loadVisual(options, packageName, constructorName, function (err, filePath) {
            if (err) {
                return ret404();
            } else {
                sendFile(filePath, mimeType.json);
            }
        });
        break;
    case 'POST':
        postData = '';
        // save the vis file, regenerate package information
        req.on('data', function (data) {
            postData += data;
        });
        req.on('end', function () {
            saveVisual(options, packageName, constructorName, postData, function (err) {
                if (err) {
                    ret404(err);
                } else {
                    res.writeHead(200);
                    res.end();
                    ssevents.emit('savecomponent', { factory: packageName, type: constructorName });
                }
            });
        });
        break;
    case 'PUT':
        saveVisual(options, packageName, constructorName, JSON.stringify(createNewVisual()), function (err) {
            if (err) {
                ret404(err);
            } else {
                res.writeHead(200);
                res.end();
                ssevents.emit('newcomponent', { factory: packageName, type: constructorName });
            }
        });
        break;
    case 'DELETE':
        // not currently supported
        deleteVisual(options, packageName, constructorName, function (err) {
            if (err) {
                ret404(err);
            } else {
                res.writeHead(200);
                res.end();
                ssevents.emit('deletecomponent', { factory: packageName, type: constructorName });
            }
        });
        break;
    }
}

function savePackage(options, packageName, cb) {
    var dstFolder = options.newPackages || '.';
    // get an updated view of all available packages
    findPackages(options.srcFolder, function (err, packages) {
        var pack = packages[packageName];
        if (!pack) {
            // create dir, create lib subdir, create
            // package.json, create lib/packagename.js
            async.series(
                [
                    function (cb) {
                        // create folder
                        fs.mkdir(path.join(dstFolder, packageName), cb);
                    },
                    function (cb) {
                        // create subfolder
                        fs.mkdir(path.join(dstFolder, packageName, 'lib'), cb);
                    },
                    function (cb) {
                        // create package.json
                        fs.writeFile(
                            path.join(dstFolder, packageName, 'package.json'),
                            jqtpl.tmpl('packageJson', { name: packageName}),
                            cb
                        );
                    },
                    function (cb) {
                        // create lib/packagename.js
                        fs.writeFile(
                            path.join(dstFolder, packageName, 'lib', packageName + '.js'),
                            jqtpl.tmpl('mainJs', { }),
                            cb
                        );
                    }
                ],
                cb
            );
        } else {
            cb(new Error('Package already exists'));
        }
    });
}

function servePackage(req, res, match, options) {
    var packageName = match[1],
        constructorName = match[2];

    function ret404(err) {
        res.writeHead(404);
        if (err) {
            res.write(String(err));
        }
        res.end();
    }

    switch (req.method) {
    case 'GET':
        break;
    case 'PUT':
        savePackage(options, packageName, function (err) {
            if (err) {
                ret404(err);
            } else {
                res.writeHead(200);
                res.end();
                ssevents.emit('newpackage', packageName);
            }
        });
        break;
    case 'DELETE':
        // not currently supported
        break;
    }
}


function servePackageList(req, res, match, options) {
    function ret404(err) {
        res.writeHead(404);
        if (err) {
            res.write(String(err));
        }
        res.end();
    }

    if (req.method === 'GET') {
        findPackages(options.srcFolder, function (err, packages) {
            if (err) {
                return ret404(err);
            }
            var re = /([^\/\.]*)\.vis$/,
                // find all the visuals in the package
                ret = {};
            Object.keys(packages).forEach(function (k) {
                var pack = packages[k],
                    json = pack.json,
                    deps = json.dependencies,
                    found = {},
                    vis = [];

                ret[k] = json;
                // is it a visual package
                pack.other.forEach(function (p) {
                    var m = re.exec(p),
                        type;
                    if (m) {
                        type = m[1];
                        if (!found[type]) {
                            found[type] = true;
                            vis.push(m[1]);
                        }
                    }
                });
                // we must support 'still empty' packages and this is
                // an ugly way to determine that
                if (vis.length > 0 || (deps && deps.visual && deps.domvisual && deps.glmatrix)) {
                    json.visuals = vis;
                }

            });
            res.writeHead('200', {'Content-Type': mimeType.json});
            res.write(JSON.stringify(ret, null, 4));
            res.end();
        });

    } else {
        ret404();
    }
}

function serveImageList(req, res, match, options) {
    function ret404(err) {
        res.writeHead(404);
        if (err) {
            res.write(String(err));
        }
        res.end();
    }

    if (req.method === 'GET') {
        findPackages(options.srcFolder, function (err, packages) {
            if (err) {
                return ret404(err);
            }
            var re = /([^\/\.]*)\.(jpg|png)$/,
                // find all the visuals in the package
                ret = [],
                pack = packages[match[1]],
                found = {};
            pack.other.forEach(function (p) {
                var m = re.exec(p),
                    type;
                if (m) {
                    type = m[1];
                    if (!found[type]) {
                        found[type] = true;
                        ret.push(pack.name + p.slice(pack.dirname.length));
                    }
                }
            });
            res.writeHead('200', {'Content-Type': mimeType.json});
            res.write(JSON.stringify(ret, null, 4));
            res.end();
        });

    } else {
        ret404();
    }
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
    editType
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
        jquery: options.jquery ? path.basename(options.jquery) : null
    });
}

function serveVisualComponent(options, forEdit) {
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
                                forEdit ? match[2] : null
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

function getUrls(options) {
    var urls = meatgrinder.getUrls(options);
    urls.unshift({
        filter: /^\/$/,
        handler: function (req, res, match) {
            // response comes from the http server
            res.setHeader("Location", "/make/launcher.Launcher.html");
            res.writeHead(302);
            res.end();
        }
    });

    urls.unshift({
        filter: /^\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.html$/,
        handler: serveVisualComponent(options, false)
    });
    urls.unshift({
        filter: /^\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.edit$/,
        handler: serveVisualComponent(options, true)
    });
    urls.push({
        filter: /^\/package$/,
        handler: function (req, res, match) {
            servePackageList(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/package\/([a-z][a-zA-Z0-9]+)\/visual\/([A-Z][a-zA-Z0-9]+)$/,
        handler: function (req, res, match) {
            serveVisual(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/package\/([a-z][a-zA-Z0-9]+)$/,
        handler: function (req, res, match) {
            servePackage(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/package\/([a-z][a-zA-Z0-9]+)\/image$/,
        handler: function (req, res, match) {
            serveImageList(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/events$/,
        handler: function (req, res, match) {
            ssevents.serveEvents(req, res, match, options);
        }
    });
    return urls;
}

meatgrinder.serve(
    getUrls(
        meatgrinder.processArgs(process.argv.slice(2))
    )
);
