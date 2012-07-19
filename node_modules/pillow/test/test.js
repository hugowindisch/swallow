/**
    test.js

    Copyright (C) 2012 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
*/
/*global __filename, __dirname */
var pillow = require('pillow'),
    assert = require('assert'),
    async = require('async'),
    fs = require('fs'),
    http = require('http'),
    wrench = require('wrench'),
    path = require('path');

// FIXME: testing still extremely shallow (stuff like the effect of dependencies
// linting, minimizing, etc... not tested)
// FIXME: move to nodeunit

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

function testMakeAndServe(cb) {
    var res = null;
    // FIXME: test this (even though it is implicitely tested by other tests)
    cb(res);
}

function testServe(cb) {
    var res = null,
        options = {
            srcFolder: __dirname,
            dstFolder: path.join(__dirname, 'generated')
        },
        srv = pillow.serve(pillow.urls, options),
        data = '';
    // should we sleep here?
    httpGet('http://localhost:1337/make/testpackage/testpackage.js', function (err, data) {
        srv.close();
        wrench.rmdirSyncRecursive(options.dstFolder, true);
        cb(err);
    });
}

function testGetMiddleWare(cb) {
    var app = require('express').createServer(),
        options = {
            srcFolder: __dirname,
            dstFolder: path.join(__dirname, 'generated')
        };
    app.use(pillow.getMiddleWare(pillow.urls, options));
    app.listen(1337);
    httpGet('http://localhost:1337/make/testpackage/testpackage.js', function (err, data) {
        app.close();
        wrench.rmdirSyncRecursive(options.dstFolder, true);
        cb(err);
    });
}

function testUrls(cb) {
    var res = null;
    try {
        // exported args is an array
        assert(pillow.urls instanceof Array);
    } catch (e) {
        res = e;
    }
    cb(res);
}

function testMakeAll(cb) {
    var res = null,
        options = {
            srcFolder: __dirname,
            dstFolder: path.join(__dirname, 'generated')
        };
    pillow.makeAll(options, function (err) {
        if (err) {
            return cb(err);
        }
        try {
            assert(fs.statSync(options.dstFolder).isDirectory());
            assert(fs.statSync(path.join(options.dstFolder, 'testpackage')).isDirectory());
            assert(fs.statSync(path.join(options.dstFolder, 'testpackage2')).isDirectory());
            assert.throws(function () {
                fs.statSync(path.join(options.dstFolder, 'testnonpillowpackage'));
            });
            assert(fs.statSync(path.join(options.dstFolder, 'testpackage', 'testpackage.js')).isFile());
            assert(fs.statSync(path.join(options.dstFolder, 'testpackage2', 'testpackage2.js')).isFile());
            assert(fs.statSync(path.join(options.dstFolder, 'pillow.js')).isFile());
        } catch (e) {
            res = e;
        }
        wrench.rmdirSyncRecursive(options.dstFolder, true);
        cb(res);
    });
}

function testMakePackage(cb) {
    var res = null,
        options = {
            srcFolder: __dirname,
            dstFolder: path.join(__dirname, 'generated')
        };
    pillow.makePackage(options, 'testpackage', function (err) {
        if (err) {
            return cb(err);
        }
        try {
            assert(fs.statSync(options.dstFolder).isDirectory());
            assert(fs.statSync(path.join(options.dstFolder, 'testpackage')).isDirectory());
            assert.throws(function () {
                fs.statSync(path.join(options.dstFolder, 'testpackage2'));
            });
            assert(fs.statSync(path.join(options.dstFolder, 'testpackage', 'testpackage.js')).isFile());
            assert(fs.statSync(path.join(options.dstFolder, 'pillow.js')).isFile());
        } catch (e) {
            res = e;
        }
        wrench.rmdirSyncRecursive(options.dstFolder, true);
        cb(res);
    });
}

function testMakeFile(cb) {
    var res = null,
        options = {
            srcFolder: __dirname,
            dstFolder: path.join(__dirname, 'generated')
        };
    pillow.makeFile(options, 'testpackage/testpackage.js', function (err) {
        if (err) {
            return cb(err);
        }
        try {
            assert(fs.statSync(options.dstFolder).isDirectory());
            assert(fs.statSync(path.join(options.dstFolder, 'testpackage')).isDirectory());
            assert.throws(function () {
                fs.statSync(path.join(options.dstFolder, 'testpackage2'));
            });
            assert(fs.statSync(path.join(options.dstFolder, 'testpackage', 'testpackage.js')).isFile());
            assert(fs.statSync(path.join(options.dstFolder, 'pillow.js')).isFile());
        } catch (e) {
            res = e;
        }
        wrench.rmdirSyncRecursive(options.dstFolder, true);
        cb(res);
    });
}

function testProcessArgs(cb) {
    var res = null;
    cb(res);
}

function testShowHelp(cb) {
    // add a test here?
    cb(null);
}

function testArgFilters(cb) {
    var res = null;
    try {
        // exported args is an array
        assert(pillow.argFilters instanceof Array);
    } catch (e) {
        res = e;
    }
    cb(res);
}

function testFixOptions(cb) {
    var res = null;
    cb(res);
}

function testFindPackages(cb) {
    var res = null,
        srcFolder = __dirname;
    pillow.findPackages([srcFolder], function (err, packages) {
        if (err) {
            return cb(err);
        }
        try {
            assert(packages.testpackage);
            assert(packages.testpackage2);
        } catch (e) {
            res = e;
        }
        cb(res);
    });

}

function testCommandLineStuff(cb) {
    var res = null;

    // FIXME: the two command line things
    cb(res);
}

async.series(
    [
        testMakeAndServe,
        testServe,
        testGetMiddleWare,
        testUrls,
        testMakeAll,
        testMakePackage,
        testMakeFile,
        testProcessArgs,
        testShowHelp,
        testArgFilters,
        testFixOptions,
        testFindPackages
    ],
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('all ok');
        }
    }
);
