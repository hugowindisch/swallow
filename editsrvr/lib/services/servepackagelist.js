/**
    servepackagelist.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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

exports.servePackageList = servePackageList;
