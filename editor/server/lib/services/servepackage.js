/**
    servepackage.js

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
                        // create package.json
                        fs.writeFile(
                            path.join(dstFolder, packageName, 'lib', 'groups.js'),
                            '',
                            cb
                        );
                    },
                ],
                cb
            );
        } else {
            cb(new Error('Package already exists'));
        }
    });
}

function servePackage(req, res, cxt) {
    var options = cxt.options,
        match = cxt.match,
        packageName = match[1],
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
        return ret404();
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
        return ret404();
    }
}
exports.servePackage = servePackage;
