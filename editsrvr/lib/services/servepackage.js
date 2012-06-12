/**
    servepackage.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var pillow = require('pillow'),
    jqtpl = require('jqtpl'),
    path = require('path'),
    findPackages = pillow.findPackages,
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    ssevents = require('./ssevents');

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
exports.servePackage = servePackage;
