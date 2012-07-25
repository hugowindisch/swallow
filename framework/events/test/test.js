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
/*jslint nomen: false */
var events = require('events'),
    assert = require('assert');


exports.run = function (test, done) {
    // EventEmitter.prototype.addListener = function (event, listener) {
    var ee = new events.EventEmitter(),
        called1 = 0,
        called2 = 0;
    function l1() {
        called1 += 1;
    }
    function l2() {
        called2 += 1;
    }
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    ee.addListener('a', l1);
    test(assert.strictEqual, ee.listeners('a').length, 10);
    test(assert.strictEqual, ee.listeners('a').warned, undefined);
    ee.addListener('a', l1);
    test(assert.strictEqual, ee.listeners('a').length, 11);
    test(assert.strictEqual, ee.listeners('a').warned, true);

    ee.addListener('b', l2);
    ee.addListener('b', l1);

    ee.emit('a');
    test(assert.strictEqual, called1, 11);
    test(assert.strictEqual, called2, 0);

    ee.emit('b');
    test(assert.strictEqual, called1, 12);
    test(assert.strictEqual, called2, 1);

    called1 = 0;
    called2 = 0;
    ee.removeListener('a', l1);
    ee.removeListener('a', l1);
    ee.removeListener('a', l1);
    test(assert.strictEqual, ee.listeners('a').length, 8);

    ee.once('a', l2);
    test(assert.strictEqual, ee.listeners('a').length, 9);
    ee.emit('a');
    test(assert.strictEqual, ee.listeners('a').length, 8);
    test(assert.strictEqual, called1, 8);
    test(assert.strictEqual, called2, 1);

    test(assert.strictEqual, ee.on, ee.addListener);

    ee.removeAllListeners('a');
    ee.removeAllListeners('b');
    test(assert.strictEqual, ee.listeners('a').length, 0);
    test(assert.strictEqual, ee.listeners('b').length, 0);
    ee.setMaxListeners(2);
    ee.on('a', l1);
    ee.on('a', l2);
    test(assert.strictEqual, ee.listeners('a').warned, undefined);
    ee.on('a', l2);
    test(assert.strictEqual, ee.listeners('a').warned, true);

    test(assert.strictEqual, ee.getListeners('c') instanceof Array, true);
    test(assert.strictEqual, ee.getListeners('c').length, 0);
    test(assert.strictEqual, ee._events.c, undefined);

    done();
};
