/**
    itemlist.js
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
    forEach = utils.forEach,
    Item = require('./Item').Item;

function ItemList(config) {
    domvisual.DOMElement.call(this, config);

    // adding the
    var it = new domvisual.DOMImg({url: 'editor/img/addstop.png', title: 'Add Image'}),
        that = this;
    it.setDimensions([32, 32, 0]);
    it.setHtmlFlowing({position: 'relative', display: 'inline-block'}, true);
    this.addChild(it, 'addMore');
    it.on('click', function () {
        that.addItem({});
    }).setCursor('pointer');
}

ItemList.createPreview = function () {
    return new (domvisual.DOMImg)({url: 'baseui/img/ItemListpreview.png'});
};

ItemList.prototype = new (domvisual.DOMElement)();

ItemList.prototype.getDescription = function () {
    return "An ItemList";
};

ItemList.prototype.addItems = function (n) {
    var i;
    for (i = 0; i < n; i += 1) {
        this.addItem();
    }
    return this;
};

ItemList.prototype.addItem = function () {
    var it = new Item(),
        that = this;

    it.setHtmlFlowing({position: 'relative', display: 'inline-block'}, true);
    it.on('select', function () {
        // emit a selected event
        that.emit('select', that.getItemIndex(it));
    }).on('delete', function () {
        that.emit('delete',  that.getItemIndex(it));
    });
    this.addChild(it, null, this.getNumChildren() - 1);
    this.updateButtons();
    return this;
};
ItemList.prototype.selectItem = function (n) {
    this.select(this.getChildAtOrder(n));
    return this;
};
ItemList.prototype.deleteItem = function (n) {
    this.removeChild(this.getChildAtOrder(n));
    this.updateButtons();
    return this;
};
ItemList.prototype.updateButtons = function () {
    this.getChild('addMore').setVisible(this.getNumChildren() < 6);
    if (this.selected) {
        this.selected.showDelete(this.getNumChildren() > 2);
    }
};
ItemList.prototype.getItemIndex = function (it) {
    return it.order;
};
ItemList.prototype.select = function (item) {
    if (this.selected !== item) {
        if (this.selected) {
            this.selected.showDelete(false);
        }
        this.selected = item;
        if (!this.selected) {
            delete this.selected;
        }
        this.updateButtons();
    }
};

exports.ItemList = ItemList;
