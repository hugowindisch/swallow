/**
    serveimagelist.js

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
    mimeType = {
        json: 'application/json'
    };

function serveImageList(req, res, cxt) {
    var options = cxt.options,
        match = cxt.match;

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

exports.serveImageList = serveImageList;
