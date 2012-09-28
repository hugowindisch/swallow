/**
    listbox.js
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
    isFunction = utils.isFunction;

function ListBox(config) {
    domvisual.DOMElement.call(this, config);
    this.setOverflow([ 'hidden', 'auto']);
    this.setStyle('bg');
}

ListBox.prototype = new (domvisual.DOMElement)();

ListBox.prototype.getActiveTheme = visual.getGetActiveTheme(
    'baseui',
    'ListBox'
);

ListBox.prototype.getDescription = function () {
    return "An item selection box";
};
ListBox.prototype.theme = new (visual.Theme)({
    bg: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'controlBackground'
            }
        ]
    },
    item: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'selectionBox'
            }
        ]
    },
    itemSelected: {
        basedOn: [
            // take the line styles from here
            {
                factory: 'baseui',
                type: 'Theme',
                style: 'selectionBoxSelected'
            }
        ]
    }
});

ListBox.prototype.createViewer = function (item) {
/*
    function onLoad() {
        var imageDimensions = this.getComputedDimensions();
        this.setHtmlFlowing({
            width: (vert * imageDimensions[0] / imageDimensions[1]) + 'px',
            height: vert + 'px',
            display: 'inline-block',
            whiteSpace: 'nowrap'
        });
    }

    var cell = new (domvisual.DOMImg)({url: item});
    cell.setStyle('item'
    ).setDimensions([20, 20, 0]
    ).once('load', onLoad
    );

    cell.showSelectionBox = function (selected) {
        this.setStyle(selected ? 'item' : 'itemSelected');
        return this;
    }

    return cell;
*/
    return null;
};

// note items should be strings
ListBox.prototype.setItems = function (items, createViewer) {
    if (this.items !== items) {
        this.items = items;
        this.selected = null;
        if (createViewer) {
            this.createViewer = createViewer;
        } else {
            delete this.createViewer;
        }
        this.updateChildren();
    }
    return this;
};

ListBox.prototype.setSelectedItem = function (item) {
    var i,
        items = this.items,
        l = items.length,
        sel = null;
    for (i = 0; i < l; i += 1) {
        if (items[i] === item) {
            sel = i;
            break;
        }
    }
    this.select(sel);
    return this;
};

ListBox.prototype.getSelectedItem = function () {
    if (this.selected !== null) {
        return this.items[this.selected];
    }
    return null;
};

ListBox.prototype.getConfigurationSheet = function () {
    return { item: {} };
};

ListBox.prototype.select = function (n) {
    if (this.selected !== n) {
        if (this.selected !== null) {
            this.cells[this.selected].showSelectionBox(false);
        }
        this.selected = n;
        if (this.selected !== null) {
            this.cells[this.selected].showSelectionBox(true);
        }
    }
    return this;
};

ListBox.prototype.updateChildren = function () {
    var items = this.items,
        i,
        l = items.length,
        item,
        c,
        container,
        cell,
        that = this;
    this.cells = [];
    this.removeAllChildren();
    container = this.addHtmlChild('div', '', null);

    function getOnClick(n) {
        return function () {
            if (that.selected !== n) {
                that.select(n);
            } else {
                that.select(null);
            }
            that.emit('change', that.getSelectedItem());
        };
    }
    for (i = 0; i < l; i += 1) {
        item = items[i];
        cell = this.createViewer(item);
        cell.on('click', getOnClick(i)
        ).setCursor('pointer').showSelectionBox(false);
        this.cells.push(cell);
        container.addChild(cell);
    }
    return this;
};


exports.ListBox = ListBox;
