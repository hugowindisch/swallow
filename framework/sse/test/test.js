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
    sse = require('sse'),
    http = require('http');

exports.run = function (test, done) {
    var es = new sse.EventSource('/swallow/events'),
        req1 = http.request(
            { method: "POST", path: "/swallow/testevent/message?a=1&b=2&c=3" }
        ),
        req2 = http.request(
            { method: "POST", path: "/swallow/testevent/blah?a=abc&b=def&c=ghi" }
        ),
        expected = 3;

    function all() {
        expected -= 1;
        if (expected === 0) {
            done();
        } else if (expected === 1) {
            es.close();
        }
    }

    function testMessageEvent(evt) {
        var data = JSON.parse(evt.data);
        test(assert.strictEqual, evt.type, 'message');
        test(assert.strictEqual, data.a, '1');
        test(assert.strictEqual, data.b, '2');
        test(assert.strictEqual, data.c, '3');
        all();
    }
    function testBlahEvent(evt) {
        var data = JSON.parse(evt.data);
        test(assert.strictEqual, evt.type, 'blah');
        test(assert.strictEqual, data.a, 'abc');
        test(assert.strictEqual, data.b, 'def');
        test(assert.strictEqual, data.c, 'ghi');
        all();
    }
    function testOpenEvent(evt) {
        test(assert.strictEqual, evt.type, 'open');
        // fire the events
        req1.end();
        req2.end();
        all();
    }

    es.on('open', testOpenEvent);
    es.on('message', testMessageEvent);
    es.on('blah', testBlahEvent);

};
