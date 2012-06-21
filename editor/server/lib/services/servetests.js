/**
    servetests.js

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
    makeAll = pillow.makeAll;

function ret404(res, err) {
    res.writeHead(404);
    if (err) {
        res.write(String(err));
    }
    res.end();
}

function serveRebuildLint(req, res, match, options) {
    if (req.method === 'POST') {
        var extOptions = {};
        Object.keys(options).forEach(function (k) {
            extOptions[k] = options[k];
        });
        extOptions.lint = true;
        makeAll(extOptions, function (err) {
            if (err) {
                return ret404(res, err);
            } else {
                res.writeHead(200);
                res.end();
            }
        });

    } else {
        ret404(res);
    }
}

function serveRebuildTest(req, res, match, options) {
    if (req.method === 'POST') {
        var extOptions = {};
        Object.keys(options).forEach(function (k) {
            extOptions[k] = options[k];
        });
        extOptions.test = true;
        makeAll(extOptions, function (err) {
            if (err) {
                return ret404(res, err);
            } else {
                res.writeHead(200);
                res.end();
            }
        });

    } else {
        ret404(res);
    }
}


exports.serveRebuildLint = serveRebuildLint;
exports.serveRebuildTest = serveRebuildTest;
