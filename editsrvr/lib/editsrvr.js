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
    };

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
            cb(null);
        } else {
            return cb(new Error('package not found ' + packageName));
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
                }
            });
            res.end();
        });
        break;
    case 'DELETE':
        // not currently supported
        break;
    }
}

function serveVisualList(req, res, match, options) {
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
                ret = [];
            Object.keys(packages).forEach(function (k) {
                var pack = packages[k],
                    found = {};
                pack.other.forEach(function (p) {
                    var m = re.exec(p),
                        type;
                    if (m) {
                        type = m[1];
                        if (!found[type]) {
                            found[type] = true;
                            ret.push({factory: k, type: m[1], path: p});
                        }
                    }
                });
            });
            // there are some details that we want to return too...
            // and for this... we need to load the vis files...
            // kinda sad...
            async.map(
                ret,
                function (r, cb) {
                    fs.readFile(r.path, function (err, data) {
                        if (err) {
                            return cb(err);
                        }
                        var js = JSON.parse(data);
                        cb(
                            null,
                            {
                                factory: r.factory,
                                type: r.type,
                                description: js.description,
                                private: js.private
                            }
                        );
                    });
                },
                function (err, ret) {
                    if (err) {
                        return res.ret404(err);
                    }
                    res.writeHead('200', {'Content-Type': mimeType.json});
                    res.write(JSON.stringify(ret, null, 4));
                    res.end();
                }
            );
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

function getUrls(options) {
    var urls = meatgrinder.getUrls(options);
    urls.push({
        filter: /^\/package$/,
        handler: function (req, res, match) {
        }
    });
    urls.push({
        filter: /^\/visual$/,
        handler: function (req, res, match) {
            serveVisualList(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/package\/([^\/]*)\/visual\/([^\/]*)$/,
        handler: function (req, res, match) {
            serveVisual(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/package\/([^\/]*)\/image$/,
        handler: function (req, res, match) {
            serveImageList(req, res, match, options);
        }
    });
    return urls;
}

meatgrinder.serve(
    getUrls(
        meatgrinder.processArgs(process.argv.slice(2))
    )
);
