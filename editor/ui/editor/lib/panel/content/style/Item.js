/**
    item.js
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
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    group = require('/editor/lib/definition').definition.groups.Item;


function Item(config) {
    domvisual.DOMElement.call(this, config, group);
    var that = this;
    this.getChild('background').on('click', function () {
        that.emit('select');
    }).setCursor('pointer');
    this.getChild('deleteBtn').on('click', function () {
        that.emit('delete');
    }).setCursor('pointer');
}

Item.prototype = new (domvisual.DOMElement)();

Item.prototype.getDescription = function () {
    return "A Item";
};

Item.prototype.showDelete = function (show) {
    this.getChild('deleteBtn').setVisible(show);
};

exports.Item = Item;
