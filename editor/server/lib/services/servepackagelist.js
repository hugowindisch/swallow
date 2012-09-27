/**
    servepackagelist.js

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
/*jslint regexp: false */

var pillow = require('pillow'),
    jqtpl = require('jqtpl'),
    path = require('path'),
    findPackages = pillow.findPackages,
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mimeType = {
        json: 'application/json'
    };

function arrayToMap(a) {
    var o = {};
    if (a) {
        a.forEach(function (v, k) {
            o[v] = true;
        });
    }
    return o;
}

function servePackageList(req, res, cxt) {
    var match = cxt.match,
        options = cxt.options,
        filterPackageList = {},
        filterPackages = false;

    // package filtering
    if (options.filterPackageList) {
        options.filterPackageList.forEach(function (v) {
            filterPackages = true;
            filterPackageList[v] = true;
        });
    }

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
                // if we want to filter the package list, apply the filter
                if (!filterPackages || filterPackageList[k]) {
                    var pack = packages[k],
                        json = pack.json,
                        deps = json.dependencies,
                        kw = arrayToMap(json.keywords),
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
                    if (vis.length > 0 || (kw.visual && kw.pillow && kw.swallowapps)) {
                        json.visuals = vis;
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

exports.servePackageList = servePackageList;
