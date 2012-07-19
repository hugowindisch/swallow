/**
    test.js

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

/*global __filename, __dirname */
var swallowapps = require('swallowapps'),
    assert = require('assert'),
    async = require('async'),
    fs = require('fs'),
    http = require('http'),
    path = require('path');

function httpGet(path, cb) {
    var data = '';
    http.get(path, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            cb(null, data);
        });
        res.on('error', function (e) {
            cb(e);
        });
    });
}

function testGetMiddleWare(cb) {
    var app = require('express').createServer(),
        options = {
            srcFolder: __dirname,
            dstFolder: path.join(__dirname, 'generated')
        };
    app.use(swallowapps.getMiddleWare());
    app.listen(1337);
    httpGet('http://localhost:1337/swallow/testhttp', function (err, data) {
        app.close();
        cb(err);
    });
}

async.series(
    [
        testGetMiddleWare
    ],
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('all ok');
        }
    }
);
