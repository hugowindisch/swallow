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
var url = require('url'),
    assert = require('assert');

exports.run = function (test, done) {
    // EventEmitter.prototype.addListener = function (event, listener) {
    // http://user:pass@host.com:8080/p/a/t/h?query=string#hash
    var p1 = 'http://user:pass@host.com:8080/p/a/t/h?query=string&abc=3&abc=4#hash',
        ret = url.parse(p1, true);

    test(assert.strictEqual, ret.host, "host.com:8080");
    test(assert.strictEqual, ret.auth, "user:pass");
    test(assert.strictEqual, ret.hostname, "host.com");
    test(assert.strictEqual, ret.href, p1);
    test(assert.strictEqual, ret.pathname, "/p/a/t/h");
    test(assert.strictEqual, ret.port, "8080");
    test(assert.strictEqual, ret.protocol, "http:");
    test(assert.strictEqual, ret.query.abc[0], "3");
    test(assert.strictEqual, ret.query.abc[1], "4");
    test(assert.strictEqual, ret.query.query, "string");
    test(assert.strictEqual, ret.search, "?query=string&abc=3&abc=4");
    test(assert.strictEqual, ret.slashes, true);
    test(assert.strictEqual, ret.path, "/p/a/t/h?query=string&abc=3&abc=4");

    test(assert.strictEqual, url.format(ret), p1);
    delete ret.host;
    test(assert.strictEqual, url.format(ret), p1);
    delete ret.search;
    test(assert.strictEqual, url.format(ret), p1);

    ret = url.parse('abcd');
    test(assert.strictEqual, ret.pathname, 'abcd');
    test(assert.strictEqual, ret.path, 'abcd');
    test(assert.strictEqual, ret.href, 'abcd');

    ret = url.parse('abcd?efg');
    test(assert.strictEqual, ret.pathname, 'abcd');
    test(assert.strictEqual, ret.path, 'abcd?efg');
    test(assert.strictEqual, ret.href, 'abcd?efg');
    test(assert.strictEqual, ret.search, '?efg');
    test(assert.strictEqual, ret.query, 'efg');

    ret = url.parse("ab@cd");
    test(assert.strictEqual, ret.pathname, 'ab@cd');
    test(assert.strictEqual, ret.path, 'ab@cd');
    test(assert.strictEqual, ret.href, 'ab@cd');

    ret = url.parse("#xyz");
    test(assert.strictEqual, ret.hash, "#xyz");
    test(assert.strictEqual, ret.href, "#xyz");

    test(
        assert.strictEqual,
        url.resolve(p1, '/bla'),
        'http://user:pass@host.com:8080/bla'
    );

    test(
        assert.strictEqual,
        url.resolve(p1, 'bla'),
        'http://user:pass@host.com:8080/p/a/t/h/bla'
    );

    test(
        assert.strictEqual,
        url.resolve(p1, '?a=3'),
        'http://user:pass@host.com:8080/p/a/t/h?a=3'
    );


    test(
        assert.strictEqual,
        url.resolve(p1, '#xyz'),
        'http://user:pass@host.com:8080/p/a/t/h?query=string&abc=3&abc=4#xyz'
    );

    done();
};
