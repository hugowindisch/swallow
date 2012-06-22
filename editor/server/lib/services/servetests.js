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
    makeAll = pillow.makeAll,
    url = require('url'),
    ssevents = require('./ssevents');

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

function serveTestHttp(req, res, match, options) {
    res.writeHead(200);
    var ret = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            trailers: req.trailers,
            version: req.httpVersion
        };
    function done() {
        res.write(JSON.stringify(ret, null, 4));
        res.end();
    }
    if (req.method === 'POST' || req.method === 'PUT') {
        req.on('data', function (data) {
            if (!ret.postData) {
                ret.postData = String(data);
            } else {
                ret.postData += String(data);
            }
        });
        req.on('end', done);
        req.on('error', function (err) {
            ret.error = String(err);
            done();
        });

    } else {
        done();
    }
}

function serveTestEvent(req, res, match, options) {
    var u,
        msg = match[1];
    if (req.method === 'POST') {
        res.writeHead(200);
        u = url.parse(req.url, true);
        ssevents.emit(msg, u.query);
        res.end();
    } else {
        ret404(res);
    }
}

exports.serveRebuildLint = serveRebuildLint;
exports.serveRebuildTest = serveRebuildTest;
exports.serveTestHttp = serveTestHttp;
exports.serveTestEvent = serveTestEvent;
