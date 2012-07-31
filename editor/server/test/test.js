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
    wrench = require('wrench'),
    path = require('path'),
    url = require('url'),
    swallowroot = path.join(__dirname, '../../..'),
    work = path.join(swallowroot, 'testwork');

function httpGet(u, cb) {
    var data = '';
    http.get(u, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            cb(null, data, res);
        });
        res.on('error', function (e) {
            cb(e, null, res);
        });
    });
}

function httpPost(u, toSend, cb) {
    var data = '',
        r = url.parse(u),
        req;
    r.method = 'POST';
    req = http.request(r, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            cb(null, data, res);
        });
        res.on('error', function (e) {
            cb(e, null, res);
        });
    });
    if (toSend) {
        req.write(toSend);
    }
    req.end();
    return req;
}

/*
http://localhost:1337/swallow/events,
http://localhost:1337/swallow/testevent/abcd,
*/
function testGetMiddleWare(cb) {
    var app = require('express').createServer(),
        options = {
            work: work
        };
    app.use(swallowapps.getMiddleWare(options));
    app.listen(1337);
    // we can test a bunch of requests
    // (we cannot really do them in parallel since we use the same dstfolder
    // in all cases)
    async.series([
        // http echo mode
        function (cb) {
            httpGet('http://localhost:1337/swallow/testhttp', function (err, data) {
                console.log('testhttp ' + err);
                cb(err);
            });
        },
        // get a webpage for running one of the samples
        function (cb) {
            httpGet('http://localhost:1337/swallow/make/samples.StyleAnimation.html', function (err, data) {
                // if it worked, validate a few more things
                if (!err) {
                    try {
                        assert(fs.existsSync(options.dstFolder));
                        assert(fs.existsSync(path.join(options.dstFolder, 'samples')));
                        assert(fs.existsSync(path.join(options.dstFolder, 'samples', 'samples.js')));
                        assert(data.indexOf('StyleAnimation') >= 0);
                    } catch (e) {
                        err = e;
                    }
                }
                wrench.rmdirSyncRecursive(options.dstFolder, true);
                console.log('/make/samples.StyleAnimation.html ' + err);
                cb(err);
            });
        },
        // get a webpage for monitoring one of the samples
        function (cb) {
            httpGet('http://localhost:1337/swallow/make/samples.StyleAnimation.mon', function (err, data) {
                // if it worked, validate a few more things
                if (!err) {
                    try {
                        assert(fs.existsSync(options.dstFolder));
                        assert(fs.existsSync(path.join(options.dstFolder, 'samples')));
                        assert(fs.existsSync(path.join(options.dstFolder, 'samples', 'samples.js')));
                        assert(data.indexOf('StyleAnimation') >= 0);
                    } catch (e) {
                        err = e;
                    }
                }

                wrench.rmdirSyncRecursive(options.dstFolder, true);
                console.log('/make/samples.StyleAnimation.mon ' + err);
                cb(err);
            });
        },
        // get a webpage for editing one of the samples
        function (cb) {
            httpGet('http://localhost:1337/swallow/make/samples.StyleAnimation.edit', function (err, data) {
                wrench.rmdirSyncRecursive(options.dstFolder, true);
                console.log('/make/samples.StyleAnimation.edit ' + err);
                cb(err);
            });
        },
        // make an asset
        function (cb) {
            httpGet('http://localhost:1337/swallow/make/samples/lib/tree.jpg', function (err, data) {
                // if it worked, validate a few more things
                if (!err) {
                    try {
                        assert(fs.existsSync(options.dstFolder));
                        assert(fs.existsSync(path.join(options.dstFolder, 'samples')));
                        assert(fs.existsSync(path.join(options.dstFolder, 'samples', 'lib')));
                        assert(fs.existsSync(path.join(options.dstFolder, 'samples', 'lib', 'tree.jpg')));
                    } catch (e) {
                        err = e;
                    }
                }

                wrench.rmdirSyncRecursive(options.dstFolder, true);
                console.log('/make/samples/lib/tree.jpg ' + err);
                cb(err);
            });
        },
        // publish a sample
        function (cb) {
            httpGet('http://localhost:1337/swallow/publish/samples.StyleAnimation', function (err, data) {
                // if it worked, validate a few more things
                if (!err) {
                    try {
                        assert(fs.existsSync(options.publishFolder));
                        assert(fs.existsSync(path.join(options.publishFolder, 'samples.StyleAnimation')));
                        assert(fs.existsSync(path.join(options.publishFolder, 'samples.StyleAnimation', 'index.html')));
                        assert(fs.existsSync(path.join(options.publishFolder, 'samples.StyleAnimation', 'pillow.js')));
                        assert(fs.existsSync(path.join(options.publishFolder, 'samples.StyleAnimation', 'samples')));

                    } catch (e) {
                        err = e;
                    }
                }
                wrench.rmdirSyncRecursive(options.publishFolder, true);
                console.log('/publish/samples.StyleAnimation ' + err);
                cb(err);
            });
        },
        // monitor something
        function (cb) {
            httpPost('http://localhost:1337/swallow/monitor/samples.StyleAnimation', null, function (err, data, res) {
                // if it worked, validate a few more things
                if (!err) {
                    httpGet('http://localhost:1337/swallow/monitor', function (err, data) {
                        var monitored = JSON.parse(data);
                        if (!err) {
                            try {
                                assert(monitored);
                                assert.strictEqual(monitored.factory, 'samples');
                                assert.strictEqual(monitored.type, 'StyleAnimation');
                            } catch (e) {
                                err = e;
                            }
                        }
                        console.log('/monitor/samples.StyleAnimation ' + err);
                        cb(err);
                    });
                } else {
                    console.log('(ERR) /monitor/samples.StyleAnimation ' + err);
                    cb(err);
                }
            });
        },
        // get the monitored application
        function (cb) {
            httpGet('http://localhost:1337/swallow/m', function (err, data, res) {
                if (!err) {
                    try {
                        assert.strictEqual(res.statusCode, 302);
                        assert.strictEqual(res.headers.location, '/swallow/make/samples.StyleAnimation.mon');
                    } catch (e) {
                        err = e;
                    }
                }
                wrench.rmdirSyncRecursive(options.dstFolder, true);
                console.log('/monitor/samples.StyleAnimation ' + err);
                cb(err);
            });
        },
        // get the full list of packages
        function (cb) {
            httpGet('http://localhost:1337/swallow/package', function (err, data) {
                var json;
                if (!err) {
                    try {
                        json = JSON.parse(data);
                        assert(json);
                        assert(json.samples);
                        assert.strictEqual(json.samples.name, 'samples');
                    } catch (e) {
                        err = e;
                    }
                }
                console.log('/swallow/package ' + err);
                cb(err);
            });
        },
        // get a vis file
        function (cb) {
            httpGet('http://localhost:1337/swallow/package/samples/visual/StyleAnimation', function (err, data) {
                var json;
                if (!err) {
                    try {
                        json = JSON.parse(data);
                        assert(json);
                        assert.strictEqual(json.description, 'An animation example using styles');
                    } catch (e) {
                        err = e;
                    }
                }
                console.log('/package/samples/visual/StyleAnimation ' + err);
                cb(err);
            });
        },
        // get a list of images for a sample
        function (cb) {
            httpGet('http://localhost:1337/swallow/package/samples/image', function (err, data) {
                var json;
                if (!err) {
                    try {
                        json = JSON.parse(data);
                        assert(json);
                        assert(json instanceof Array);
                    } catch (e) {
                        err = e;
                    }
                }
                console.log('/swallow/package/samples/image ' + err);
                cb(err);
            });
        },
        // generate help files
        function (cb) {
            httpPost('http://localhost:1337/swallow/makehelp', null, function (err, data) {
                var json;
                if (!err) {
                    httpGet('http://localhost:1337/swallow/make/samples/samples.dox.json', function (err, data) {
                        console.log('/swallow/makehelp ' + err);
                        cb(err);
                    });
                } else {
                    console.log('/swallow/makehelp ' + err);
                    cb(err);
                }
            });
        },
        // generate lint
        function (cb) {
            httpPost('http://localhost:1337/swallow/makelint', null, function (err, data) {
                var json;
                if (!err) {
                    httpGet('http://localhost:1337/swallow/make/samples/samples.lint.json', function (err, data) {
                        console.log('/swallow/makelint ' + err);
                        cb(err);
                    });
                } else {
                    console.log('/swallow/makelint ' + err);
                    cb(err);
                }
            });
        },
        // generate test module
        function (cb) {
            httpPost('http://localhost:1337/swallow/maketest', null, function (err, data) {
                var json;
                if (!err) {
                    httpGet('http://localhost:1337/swallow/make/samples/samples.test.js', function (err, data) {
                        console.log('/swallow/maketest ' + err);
                        cb(err);
                    });
                } else {
                    console.log('/swallow/maketest ' + err);
                    cb(err);
                }
            });
        }
    ], function (err) {
        app.close();
        wrench.rmdirSyncRecursive(options.work, true);
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
