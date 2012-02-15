#!/usr/local/bin/node
/**
    editsrvr.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
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
*/
var meatgrinder = require('meatgrinder'),
    fs = require('fs'),
    path = require('path'),
    findPackages = meatgrinder.findPackages,
    fs = require('fs'),
    path = require('path'),
    async = require('async');



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

// generates the groups.js
function saveGroupsJS(pack, allVis, cb) {
    var json = {};
    allVis.forEach(function (v) {
        json[v.name] = v.data;
    });
    fs.writeFile(
        path.join(pack.dirname, 'lib', 'groups.js'),
        'exports.groups = ' + JSON.stringify(json, null, 4),
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
            if (dp) {
                json.dependencies[pName] = dp.json.version;
            } else {
                return cb(new Error('Unresolved package ' + pName));
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
            fs.writeFile(path.join(pack.dirname, constructorName + '.vis'), json, function (err) {
                if (err) {
                    return cb(err);
                } else {
                    loadVisFiles(pack, function (err, allVis) {
                        if (err) {
                            return cb(err);
                        } else {
                            async.parallel([
                                function () {
                                    savePackageJSON(packages, pack, allVis, cb);
                                },
                                function () {
                                    saveGroupsJS(pack, allVis, cb);
                                }
                            ], cb);
                            //cb(null);                        
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
                sendFile(filePath, 'application/json');
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

function getUrls(options) {
    var urls = meatgrinder.getUrls(options);
    urls.push({
        filter: /^\/visual\/([^\/]*)\/([^\/]*)$/, 
        handler: function (req, res, match) {
            serveVisual(req, res, match, options);
        }
    });
    return urls;
}

meatgrinder.serve(
    getUrls(
        meatgrinder.processArgs(process.argv.slice(2))
    )
);

