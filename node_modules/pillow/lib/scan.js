/**
    scan.js
        This will scan directories, find the package.json files and then
        publish the package.json files in a statically servable directory
        structure.

    Copyright (C) 2012 Hugo Windisch

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
/*globals __dirname, __filename */
var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    jqtpl = require('jqtpl'),
    jsmin = require('jsmin'),
    assetExt = {
        'jpg': true,
        'png': true,
        'gif': true,
        'html': true,
        'json': false,
        'css': true,
        'vis': false
    };

// synchronously load the templates that we need when this module is loaded
jqtpl.template(
    'srcTemplate',
    fs.readFileSync(
        path.join(__dirname, 'templates/src.js')
    ).toString()
);
jqtpl.template(
    'headerTemplate',
    fs.readFileSync(
        path.join(__dirname, 'templates/header.js')
    ).toString()
);
jqtpl.template(
    'componentTemplate',
    fs.readFileSync(
        path.join(__dirname, 'templates/component.html')
    ).toString()
);

/**
    Concatenates two objects.
*/
function concatObject(dst, src) {
    var k;
    for (k in src) {
        if (src.hasOwnProperty(k)) {
            dst[k] = src[k];
        }
    }
    return dst;
}

/**
    Creates a folder if the folder does not already exist.
*/
function createFolder(foldername, cb) {
    var fn = path.resolve(foldername),
        basedir = path.dirname(fn);

    function makeUnexistingDir(dirname, cb) {
        path.exists(dirname, function (exists) {
            fs.mkdir(dirname, '0775', function (err) {
                var eExist = /^EEXIST/;
                if (!err || eExist.test(err.message)) {
                    err = null;
                }
                cb(err);
            });
        });
    }
    path.exists(basedir, function (exists) {
        if (!exists) {
            createFolder(basedir, function (err) {
                if (err) {
                    return cb(err);
                }
                makeUnexistingDir(fn, cb);
            });
        } else {
            makeUnexistingDir(fn, cb);
        }
    });
}

/**
    Copies a file.
*/
function copyFile(from, to, cb) {
    fs.readFile(from, function (err, data) {
        if (err) {
            return cb(err);
        }
        createFolder(to, function (err) {
            var dstFile = path.join(to, path.basename(from));
            if (err) {
                return cb(err);
            }
            fs.writeFile(dstFile, data, function (err) {
                cb(err);
            });
        });
    });
}

/**
    Updates a file (copies it if it does not exist or if it is
    out dated).
*/
function copyFileIfOutdated(from, to, cb) {
    async.map(
        [from, path.join(to, path.basename(from))],
        fs.stat,
        function (err, stats) {
            if (err || stats[1].mtime.getTime() < stats[0].mtime.getTime()) {
                copyFile(from, to, cb);
            } else {
                // nothing to do
                cb(null);
            }
        }
    );
}

/**
    Checks if a file is older than a given date
*/
function checkOlderOrInvalid(fn, date, cb) {
    fs.stat(fn, function (err, stats) {
        cb(null, err || (stats.mtime.getTime() < date.getTime()));
    });
}

/**
    Finds files that matches a given pattern in an object
    { filename: filestat }
*/
function filterStats(stats, regexp) {
    var res = {};
    Object.keys(stats).forEach(function (s) {
        if (regexp.test(s)) {
            res[s] = stats[s];
        }
    });
    return res;
}

/**
    Finds the latest date for a given regexp
    { filename: filestat }
*/
function getMostRecent(stats, regexp) {
    var s = filterStats(stats, regexp),
        ret = new Date();
    ret.setTime(0);
    Object.keys(s).forEach(function (k) {
        var stat = s[k];
        if (stat.mtime.getTime() > ret.getTime()) {
            ret = stat.mtime;
        }
    });
    return ret;
}

/**
    Returns a package map that contains a package an all its recursive
    dependencies.
*/
function getPackageDependencies(packageMap, packageName) {
    function gd(res, name) {
        var p = packageMap[name],
            dep;
        if (p) {
            res[name] = p;
            dep = p.json.dependencies;
            if (dep) {
                Object.keys(dep).forEach(function (k) {
                    // FIXME we should validate versions
                    gd(res, k);
                });
            }
        } else {
            throw new Error("Missing Package " + name);
        }
    }
    var res = {};
    gd(res, packageName);
    return res;
}

/**
    Returns a unified { filename: stats} for a package map.
*/
function getFileMap(packageMap) {
    var res = {};
    Object.keys(packageMap).forEach(function (k) {
        var p = packageMap[k];
        concatObject(res, p.stats);
    });
    return res;
}

/**
    Publishes an asset such as a jpg or png by copying it in the
    deployment directory.
*/
function publishAsset(
    options,
    modulename,
    modulerootfolder,
    filename,
    cb
) {
    var dstfile = path.join(
            options.dstFolder,
            modulename,
            filename.slice(modulerootfolder.length)
        ),
        dstfolder = path.dirname(dstfile),
        getExt = /\.(\w+)$/,
        m = getExt.exec(filename);

    if (m && assetExt[m[1]]) {
        copyFileIfOutdated(filename, dstfolder, cb);
    } else {
        // nothing to do
        cb(null);
    }
}

/**
    Loads a js file (as text), packages it in a module closure and adds
    this module closure to a module.
*/
function publishJSFile(
    modulename,
    modulerootfolder,
    filename,
    dependencies,
    jsstream,
    optMini,
    cb
) {
    // we want to split the path
    //filename.split(
    var pillowPath = modulename + filename.slice(modulerootfolder.length, -3);

    async.waterfall([
        function (cb) {
            fs.readFile(filename, cb);
        },
        function (filecontent, cb) {
            var indented = filecontent.toString().split('\n').map(
                    function (line) {
                        return '    ' + line;
                    }
                ).join('\n');

            cb(null, jqtpl.tmpl('srcTemplate', {
                modulename: modulename,
                filepath: pillowPath,
                code: indented,
                dependencies: dependencies
            }));

        },
        function (out, cb) {
            // optionally uglify (do not mangle)
            var ast;
            if (optMini) {
                out = jsmin.jsmin(out);
            }
            // write the result
            jsstream.write(out);
            cb(null);
        }
    ], cb);
}

/**
    Finds by guessing the module path.
    These will be tried in order:
        packagname.js
        /lib/packagename.js

    getMainModulePath
*/
function getMainModulePath(details) {
    if (details.json.main) {
        return details.json.main;
    }
    var regExp = new RegExp(details.name + '\\.js$'),
        res;
    details.js.forEach(function (n) {
        var s;
        if (regExp.test(n)) {
            s = details.name + n.slice(details.dirname.length, -3);
            if (!res || s.length < res.length) {
                res = s;
            }
        }
    });
    return res;
}

/**
    Publishes all the js files in the package (the files are combined into
    one single js file).
*/
function publishJSFiles(
    options,
    details,
    packageMap,
    deps,
    cb
) {
    var publishdir = path.join(options.dstFolder, details.name),
        publishJsStream = path.join(publishdir, details.name + '.js'),
        stream = fs.createWriteStream(publishJsStream),
        dependencies = [ ];
    if (deps) {
        Object.keys(deps).forEach(function (d) {
            if (d !== details.name) {
                dependencies.push(d);
            }
        });
    }

    async.forEach(details.js, function (f, cb) {
        publishJSFile(
            details.name,
            details.dirname,
            f,
            dependencies,
            stream,
            options.minify,
            cb
        );
    }, function (err) {
        if (err) {
            return cb(err);
        }
        stream.write(jqtpl.tmpl('headerTemplate', {
            modulename: details.name,
            dependencies: dependencies,
            modulepath: getMainModulePath(details)
        }));
        cb(null);
    });
}

/**
    Publishes the html that allows to run the package in a browser
    using a standalone statically loaded html.
*/
function publishHtml(
    options,
    details,
    packageMap,
    deps,
    cssFileMap,
    cb
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
    fs.writeFile(
        path.join(options.dstFolder, details.name + '.html'),
        jqtpl.tmpl('componentTemplate', {
            dependencies: dependencies,
            css: cssFiles,
            main: details.name,
            jquery: options.jquery ? path.basename(options.jquery) : null
        }),
        cb
    );
}

/**
    Publishes the pillow file itself. This is a simple file copy.
*/
function publishPillow(
    outputfolder,
    cb
) {
    copyFileIfOutdated(path.join(__dirname, 'pillow.js'), outputfolder, cb);
}

/**
    Generates the published form of a given package.
*/
function makePublishedPackage(
    options,
    details,
    packageMap,
    cb
) {
    var detName = details.name,
        mostRecentJSDate = getMostRecent(
            details.stats,
            new RegExp("(\\.js$|" + detName + "\\.json)")
        ),
        deps = getPackageDependencies(packageMap, detName),
        depsFileMap = getFileMap(deps),
        cssFileMap = options.css ? filterStats(depsFileMap, /\.css$/) : {},
        cssMostRecentDate =
            options.css ?
            getMostRecent(depsFileMap, /\.css$/) :
            mostRecentJSDate;

    async.parallel([
        function (cb) {
            checkOlderOrInvalid(
                path.join(options.dstFolder, detName, detName + '.js'),
                mostRecentJSDate,
                function (err, older) {
                    if (older) {
                        publishJSFiles(options, details, packageMap, deps, cb);
                    } else {
                        cb(err);
                    }
                }
            );
        },
        function (cb) {
            async.forEach(details.other, function (f, cb) {
                publishAsset(
                    options,
                    detName,
                    details.dirname,
                    f,
                    cb
                );
            }, cb);
        },
        function (cb) {
            if (options.html) {
                if (mostRecentJSDate.getTime() > cssMostRecentDate.getTime()) {
                    cssMostRecentDate = mostRecentJSDate;
                }
                // FIXME: publishHtml does not depend on jquery (important?)
                checkOlderOrInvalid(
                    path.join(options.dstFolder, detName + '.html'),
                    cssMostRecentDate,
                    function (err, older) {
                        if (older) {
                            publishHtml(
                                options,
                                details,
                                packageMap,
                                deps,
                                cssFileMap,
                                cb
                            );
                        } else {
                            cb(err);
                        }
                    }
                );
            } else {
                // no package.html to generate
                cb(null);
            }
        },
        function (cb) {
            publishPillow(options.dstFolder, cb);
        },
        function (cb) {
            if (options.jquery) {
                copyFileIfOutdated(options.jquery, options.dstFolder, cb);
            } else {
                cb(null);
            }
        },
        function (cb) {
            // support extra processing
            if (options.extra) {
                options.extra(
                    options,
                    details,
                    packageMap,
                    deps,
                    cssFileMap,
                    cb
                );
            } else {
                cb(null);
            }
        }
    ], cb);
}

/**
    Finds all package files (all files that we want to process)
    and returns them in an object
    {
        packageFile: {}
        js: [],
        other: []
    }
*/
function findPackageFiles(folder, details, cb) {
    // make sure we have what we need
    if (!details.js) {
        details.js = [];
    }
    if (!details.other) {
        details.other = [];
    }
    if (!details.stats) {
        details.stats = {};
    }
    // do the async processing
    async.waterfall(
        [
            // read the dir
            function (cb) {
                fs.readdir(folder, cb);
            },
            // stat all files
            function (files, cb) {
                async.map(
                    files,
                    function (filename, cb) {
                        fs.stat(
                            path.join(folder, filename),
                            function (err, stats) {
                                if (err) {
                                    return cb(err);
                                }
                                cb(err, {filename: filename, stats: stats});
                            }
                        );
                    },
                    cb
                );
            },
            // with the stats
            function (stats, cb) {
                // process all files
                async.forEach(
                    stats,
                    function (file, cb) {
                        var isJs = /\.js$/,
                            getExt = /\.(\w+)$/,
                            matches,
                            ffn = path.join(folder, file.filename);
                        if (file.stats.isFile()) {
                            // keep a pointer to the details
                            file.stats.details = details;
                            // js file
                            if (isJs.test(file.filename)) {
                                details.stats[ffn] = file.stats;
                                details.js.push(ffn);
                            } else {
                                matches = getExt.exec(file.filename);
                                if (matches &&
                                        assetExt[matches[1]] !== undefined) {
                                    details.stats[ffn] = file.stats;
                                    details.other.push(ffn);
                                }
                            }
                            // nothing really async here
                            cb(null);
                        } else if (file.stats.isDirectory()) {
                            findPackageFiles(ffn, details, cb);
                        }
                    },
                    cb
                );
            }
        ],
        function (err) {
            cb(err, details);
        }
    );
}

/**
    Loads the details of a package: its package.json file and
    the paths of all its contained files (js, other like gifs and jpgs)
*/
function loadPackageDetails(packageFile, cb) {
    var details = {
        filename: packageFile.filename,
        // FIXME: this does not use the package info
        dirname: path.dirname(packageFile.filename),
        js: [],
        other: []
    };
    fs.readFile(packageFile.filename, function (err, data) {
        if (err) {
            return cb(err);
        }
        // FIXME: try catch
        details.json = JSON.parse(data.toString());
        details.name = details.json.name || path.basename(details.dirname);

        findPackageFiles(details.dirname, details, cb);
    });
}

/**
    Processes a package.json file that has been loaded with its "details".
*/
function processPackageDetails(options, details, packageMap, cb) {
    var dirname = details.dirname,
        // we should use the package.name for the packagename
        packagename = details.name,
        publishdir = path.join(options.dstFolder, packagename);

    // do nothing if the package is in the nomake list
    if (options.nomake && options.nomake[packagename]) {
        return cb(null);
    }

    // create an output dir for this package
    createFolder(publishdir, function (err) {
        if (err) {
            return cb(err);
        }
        makePublishedPackage(
            options,
            details,
            packageMap,
            cb
        );
    });
}

/**
    Processes multiple package details (the packages are given as a package map).
*/
function processMultiplePackageDetails(options, packages, cb) {
    async.forEach(
        Object.keys(packages),
        function (pd, cb) {
            processPackageDetails(options, packages[pd], packages, cb);
        },
        cb
    );
}

/**
    Finds packages from a given folder and calls cb(err, packages) where
    packages is an array of package details.
*/
function findPackagesFromSingleFolder(rootfolder, cb) {
    // search folders for package.json
    async.waterfall(
        [
            // read the dir
            function (cb) {
                fs.readdir(rootfolder, cb);
            },
            // stat all files
            function (files, cb) {
                async.map(files, function (filename, cb) {
                    fs.stat(
                        path.join(rootfolder, filename),
                        function (err, stats) {
                            if (err) {
                                return cb(err);
                            }
                            cb(err, {filename: filename, stats: stats});
                        }
                    );
                }, cb);
            },
            // for files that are js
            function (stats, cb) {
                var found = [], results = {};
                // process all files
                async.forEach(stats, function (file, cb) {
                    var isJs = /package\.json$/;
                    if (file.stats.isFile()) {
                        if (isJs.test(file.filename)) {
                            found.push({
                                filename: path.join(rootfolder, file.filename),
                                stats: file.stats
                            });
                            return cb(null);
                        } else {
                            cb(null);
                        }
                    } else if (file.stats.isDirectory()) {
                        findPackagesFromSingleFolder(
                            path.join(rootfolder, file.filename),
                            function (err, res) {
                                if (!err) {
                                    concatObject(results, res);
                                }
                                cb(err);
                            }
                        );
                    }
                }, function (err) {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null, found, results);
                });
            },
            // load the package details of the found files and add them to the
            // results
            function (found, results, cb) {
                async.map(
                    found,
                    loadPackageDetails,
                    function (err, detailArray) {
                        if (err) {
                            return cb(err);
                        }
                        // map all the results
                        detailArray.forEach(function (d) {
                            results[d.name] = d;
                        });
                        // return the map
                        cb(null, results);
                    }
                );
            }
        ],
        cb
    );
}

/**
    Finds packages from multiple folders.
    note: folderArray can be a string or an array of strings
*/
function findPackages(folderArray, cb) {
    if (!(folderArray instanceof Array)) {
        findPackagesFromSingleFolder(folderArray, cb);
    } else {
        var packages = {};
        async.map(
            folderArray,
            findPackagesFromSingleFolder,
            function (err, res) {
                if (err) {
                    return cb(err);
                }
                res.forEach(function (r) {
                    concatObject(packages, r);
                });
                cb(null, packages);
            }
        );
    }
}

/**
    This function regenerates all packages.
    note: srcFolder can be a string or an array of strings
*/
function makeAll(options, cb) {
    findPackages(options.srcFolder, function (err, packages) {
        if (err) {
            return cb(err);
        }
        processMultiplePackageDetails(options, packages, cb);
    });
}

/**
    This function regenerates a single package.
    note: srcFolder can be a string or an array of strings
*/
function makePackage(options, packageName, cb) {
    // even before we try to find the packages, we want to skip
    // packages that were excluded.
    // Note that this is the only place where it is really beneficial
    // to enforce the nomake thing.
    if (options.nomake && options.nomake[packageName]) {
        // we don't make it
        return cb(null);
    }

    findPackages(options.srcFolder, function (err, packages) {
        var deps;
        if (err) {
            return cb(err);
        }
        try {
            deps = getPackageDependencies(packages, packageName);
        } catch (e) {
            console.log(e);
            return cb(e);
        }
        processMultiplePackageDetails(options, deps, cb);
    });
}

/**
    This function regenerates a single file (or a full package if
    a package name is specified).
    note: srcFolder can be a string or an array of strings
*/
function makeFile(options, dstFolderRelativeFilePath, cb) {
    // the provided relative path should be relative to the dstFolder
    // and consequently the first subdir should be the package name
    var assetFolder = path.normalize(dstFolderRelativeFilePath),
        assetFolderRoot,
        splitFolder = assetFolder.split('/');
    if (splitFolder.length > 1) {
        assetFolderRoot = splitFolder[0];
    } else if (/\.html$/.test(dstFolderRelativeFilePath)) {
        assetFolderRoot = dstFolderRelativeFilePath.slice(0, -5);
    } else if (dstFolderRelativeFilePath.indexOf('.') === -1) {
        assetFolderRoot = dstFolderRelativeFilePath;
    } else {
        // FIXME
        // nothing to regenerate (maybe in fact the pillow.js thing)
        publishPillow(
            options.dstFolder,
            cb
        );
        return;
    }
    // non optimal but ok for now
    makePackage(options, assetFolderRoot, cb);
}


/**
    Library support.
*/
exports.makeAll = makeAll;
exports.makePackage = makePackage;
exports.makeFile = makeFile;
exports.findPackages = findPackages;
