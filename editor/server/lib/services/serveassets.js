/**
    serveassets.js

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

var formidable = require('formidable'),
    pillow = require('pillow'),
    findPackages = pillow.findPackages,
    async = require('async'),
    path = require('path'),
    fs = require('fs');


/*
*/
function fixFileName(fn) {
    var match = /^([^\.]+)\.(.+)$/.exec(fn);
    if (match) {
        fn = match[1] + '.' + match[2].toLowerCase();
    }
    return fn;
}

/**
    Creates a folder if the folder does not already exist.
    (note: copied from pillow, kinda bad)
*/
function createFolder(foldername, cb) {
    var fn = path.resolve(foldername),
        basedir = path.dirname(fn);

    function makeUnexistingDir(dirname, cb) {
        fs.exists(dirname, function (exists) {
            fs.mkdir(dirname, '0775', function (err) {
                var eExist = /^EEXIST/;
                if (!err || eExist.test(err.message)) {
                    err = null;
                }
                cb(err);
            });
        });
    }
    fs.exists(basedir, function (exists) {
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


/*
*/
function uploadToPackage(req, options, packageName, cb) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            return cb(err);
        }
        findPackages(options.srcFolder, function (err, packages) {
            var pack,
                uploadDir;
            // error
            if (err) {
                return cb(err);
            }
            // normal case
            pack = packages[packageName];
            if (pack) {
                // we need the destination folder to exist
                uploadDir = path.join(pack.dirname, 'img');
                createFolder(
                    uploadDir,
                    function (err) {
                        if (err) {
                            return cb(err);
                        }
                        async.forEach(
                            Object.keys(files),
                            function (fn, cb) {
                                var file = files[fn];
                                fs.rename(file.path, path.join(uploadDir, fixFileName(file.name)), cb);
                            },
                            function (err) {
                                cb(err);
                            }
                        );
                    }
                );
            } else {
                return cb(new Error('package not found ' + pack));
            }
        });
    });
}

function serveUploadAssets(req, res, cxt) {
    var options = cxt.options,
        match = cxt.match,
        packageName = match[1],
        extOptions = {};

    function ret404(err) {
        res.writeHead(404);
        if (err) {
            res.write(String(err));
        }
        res.end();
    }

    if (req.method === 'POST') {

        uploadToPackage(req, options, packageName, function (err) {
            if (err) {
                return ret404(err);
            }
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload');
            res.end();
        });
    } else {
        ret404();
    }
}

exports.serveUploadAssets = serveUploadAssets;
