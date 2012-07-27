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

var assert = require('assert'),
    http = require('http'),
    utils = require('utils'),
    forEach = utils.forEach;

// we would need caolan async!
function parallel(array, cb) {
    var pending = array.length,
        error;
    function done(err) {
        pending -= 1;
        if (err) {
            error = err;
        }
        if (pending === 0) {
            cb(err);
        }
    }
    forEach(array, function (a) {
        a(done);
    });
}

exports.run = function (test, done) {
    var tested = 0;

    function doGET(options, extraValidation, cb) {
        var data = '';
        http.get(
            options,
            function (res) {
                res.on('data', function (d) {
                    data += d;
                });
                res.on('end', function () {
                    var req = JSON.parse(data);
                    // actual tests
                    test(
                        assert.strictEqual,
                        req.method,
                        'GET'
                    );
                    test(
                        assert.strictEqual,
                        req.url,
                        '/swallow/testhttp'
                    );
                    test(
                        assert.strictEqual,
                        res.statusCode,
                        200
                    );
                    test(
                        assert.strictEqual,
                        typeof res.headers,
                        'object'
                    );
                    if (extraValidation) {
                        extraValidation(req, res);
                    }
                    cb(null);
                });
                res.on('error', function (err) {
                    cb(err);
                });
            }
        );
    }

    // test http GET
    function testGET(cb) {
        doGET({ path: '/swallow/testhttp' }, null, cb);
    }
    function testGETWithString(cb) {
        doGET('/swallow/testhttp', null, cb);
    }
    function testGETWithFullUrl(cb) {
        doGET('http://localhost:1337/swallow/testhttp', null, cb);
    }
    function testGETWithHeaders(cb) {
        doGET({
                path: '/swallow/testhttp',
                headers: {
                    'Content-Type': 'expectedContentType'
                }
            },
            function (reqdata, res) {
                test(
                    assert.strictEqual,
                    reqdata.headers['content-type'],
                    'expectedContentType'
                );
            },
            cb
        );
    }
    function testGETWithAuth(cb) {
        doGET(
            'http://joe:pass@localhost:1337/swallow/testhttp',
            // not so clear how to test that. I'm not sure what is
            // supposed to happen and maybe the headers are NOT
            // sent if we are on a non SSL encrypted connexion (?)
            function (reqdata, res) {},
            cb
        );
    }
    // test http POST
    function testPOST(cb) {
        var data = '',
            r;
        r = http.request(
            { path: '/swallow/testhttp', method: 'POST' },
            function (res) {
                res.on('data', function (d) {
                    data += d;
                });
                res.on('end', function () {
                    var req = JSON.parse(data);
                    // actual tests
                    test(
                        assert.strictEqual,
                        req.method,
                        'POST'
                    );
                    test(
                        assert.strictEqual,
                        req.url,
                        '/swallow/testhttp'
                    );
                    test(
                        assert.strictEqual,
                        req.postData,
                        'abcdef'
                    );
                    cb(null);
                });
                res.on('error', function (err) {
                    cb(err);
                });
            }
        );
        r.write('abcdef');
        r.end();
    }

    // test http POST
    function testPUT(cb) {
        var data = '',
            r;
        r = http.request(
            { path: '/swallow/testhttp', method: 'PUT' },
            function (res) {
                res.on('data', function (d) {
                    data += d;
                });
                res.on('end', function () {
                    var req = JSON.parse(data);
                    // actual tests
                    test(
                        assert.strictEqual,
                        req.method,
                        'PUT'
                    );
                    test(
                        assert.strictEqual,
                        req.url,
                        '/swallow/testhttp'
                    );
                    test(
                        assert.strictEqual,
                        req.postData,
                        'abcdefg'
                    );
                    cb(null);
                });
                res.on('error', function (err) {
                    cb(err);
                });
            }
        );
        r.write('abcdefg');
        r.end();
    }


    // launch the tests
    parallel([
        testGET,
        testGETWithString,
        testGETWithFullUrl,
        testGETWithHeaders,
        testGETWithAuth,
        testPOST,
        testPUT
    ], function () {
        test(
            assert.strictEqual,
            test.total,
            27
        );
        // we are done!
        done();
    });
};
