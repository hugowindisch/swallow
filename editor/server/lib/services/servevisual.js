/**
    servevisual.js

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
/*globals __dirname */
/*jslint regexp: false */

var pillow = require('pillow'),
    jqtpl = require('jqtpl'),
    path = require('path'),
    findPackages = pillow.findPackages,
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    ssevents = require('./ssevents'),
    mimeType = {
        json: 'application/json'
    };

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
    var json = pack.json,
        unresolvedPackages = [];
    if (!json.dependencies) {
        json.dependencies = {};
    }
    // adds a dependency to the package
    function addDep(pName) {
        var dp = packages[pName];
        if (pName !== json.name) {
            if (dp) {
                json.dependencies[pName] = '>=' + dp.json.version;
            } else {
                unresolvedPackages.push(pName);
            }
        }
    }
    allVis.forEach(function (v) {
        var children = v.data.children,
            theme = v.data.theme;
        // search external dependencies in children
        Object.keys(children).forEach(function (k) {
            var vis = children[k],
                pName = vis.factory,
                config = vis.config;
            // add the dependency
            addDep(pName);
            // styles in the config
            Object.keys(config).forEach(function (k) {
                if (k === 'style') {
                    var pName = config[k].factory;
                    if (pName) {
                        addDep(pName);
                    }
                }
            });
        });
        // search external dependencies in themes
        if (theme) {
            Object.keys(theme).forEach(function (k) {
                var style = theme[k],
                    basedOn = style.basedOn;
                if (basedOn) {
                    basedOn.forEach(function (b) {
                        addDep(b.factory);
                    });
                }
            });
        }
        // should we also search in skins? I don't think so.
    });
    // add an unresolved dependencies thing in the package if we found some
    if (unresolvedPackages.length > 0) {
        json.unresolvedDependencies = unresolvedPackages;
    } else {
        delete json.unresolvedDependencies;
    }
    // save the thing!
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
function serveVisual(req, res, cxt) {
    var options = cxt.options,
        match = cxt.match,
        packageName = match[1],
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

exports.serveVisual = serveVisual;
