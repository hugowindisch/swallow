/**
    serveimagelist.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals __dirname */
/*jslint regexp: false */

var meatgrinder = require('meatgrinder'),
    jqtpl = require('jqtpl'),
    path = require('path'),
    findPackages = meatgrinder.findPackages,
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mimeType = {
        json: 'application/json'
    };

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

exports.serveImageList = serveImageList;
