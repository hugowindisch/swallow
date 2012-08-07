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
    domquery = require('domquery'),
    testHtml;

testHtml = [
    '<div id = "id1"></div>',
    '<div class = "cl1"></div>',
    '<thens:div></div>',
    '<div anattribute="anattr"></div>',
    '<div anattribute="aaabbbccc"></div>',
    '<div><div anattribute></div></div>',
    '<div attr="aaa bbb ccc"></div>',
    '<div attr="aaabbbccc"></div>',
    '<div attr="aaa-bbb-ccc"></div>',
    '<div id = "zoo"><div id="zoo1"></div><div id="zoo2"></div><div id="zoo3"><div id="zoo4"></div></div></div>',
    '<input type="button" disabled id="b1"></input>',
    '<input type="button" id="b3"></input>',
    '<input type="checkbox" checked id="cb1"></input>',
    '<input type="checkbox" id="cb3"></input>'
].join('\n');


exports.run = function (test, done) {
    var el = document.createElement('div'),
        res;
    el.innerHTML = testHtml;

    res = domquery('*', el);
    test(assert, res.length);

    res = domquery('thens|div', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery('thens|*', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery('.cl1', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery('#id1', el);
    test(assert.strictEqual, res.length, 1);

    // attributes
    res = domquery('[anattribute]', el);
    test(assert.strictEqual, res.length, 3);

    res = domquery('[anattribute="anattr"]', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery('[anattribute^="aaa"]', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery('[anattribute$="ccc"]', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery('[anattribute*="bbb"]', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery('[attr~="bbb"]', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery('[attr|="aaa"]', el);
    test(assert.strictEqual, res.length, 1);

    // semicolon stuff
    res = domquery(':root');
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0], document.documentElement);

    res = domquery('#zoo1:nth-child(0)', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo1');

    res = domquery('#zoo2:nth-child(1)', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo2');

    res = domquery('#zoo3:nth-child(2)', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo3');

    res = domquery('#zoo1:first-child', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo1');

    res = domquery('#zoo3:last-child', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo3');

    res = domquery('#zoo4:only-child', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo4');

    res = domquery('#zoo1:only-child', el);
    test(assert.strictEqual, res.length, 0);

    res = domquery('#zoo4:empty', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo4');

    res = domquery('#zoo3:empty', el);
    test(assert.strictEqual, res.length, 0);

    res = domquery(':link');
    test(assert, res.length);

    res = domquery('input', el);
    test(assert.strictEqual, res.length, 4);

    res = domquery(':enabled', el);
    test(assert.strictEqual, res.length, 3);

    res = domquery(':disabled', el);
    test(assert.strictEqual, res.length, 1);

    res = domquery(':checked', el);
    test(assert.strictEqual, res.length, 1);

    // relationship stuff
    res = domquery('#zoo #zoo4', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo4');

    res = domquery('#id1 #zoo4', el);
    test(assert.strictEqual, res.length, 0);

    res = domquery('#zoo #zoo3 #zoo4', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo4');

    res = domquery('#zoo > #zoo4', el);
    test(assert.strictEqual, res.length, 0);

    res = domquery('#zoo>#zoo4', el);
    test(assert.strictEqual, res.length, 0);

    res = domquery('#zoo > #zoo3 > #zoo4', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo4');

    res = domquery('#zoo>#zoo3>#zoo4', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo4');

    res = domquery('#zoo1 + #zoo2', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo2');

    res = domquery('#zoo1 + #zoo3', el);
    test(assert.strictEqual, res.length, 0);

    res = domquery('#zoo1 ~ #zoo2', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo2');

    res = domquery('#zoo1 ~ #zoo3', el);
    test(assert.strictEqual, res.length, 1);
    test(assert.strictEqual, res[0].getAttribute('id').toLowerCase(), 'zoo3');

    done();
};
