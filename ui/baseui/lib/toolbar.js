/**
    toolbar.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    verticalmenu = require('./verticalmenu'),
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    isFunction = utils.isFunction;
    

function Toolbar(config) {
    var that = this;
    domvisual.DOMElement.call(this, config);
}
Toolbar.prototype = new (domvisual.DOMElement)();

Toolbar.prototype.setItems = function (items) {
    if (isFunction(items)) {
        this.getItems = items;
    } else {
        this.items = items;
    }
    this.updateChildren();
};

/**
    It is way easier to create something like this in HTML (because the
    automatic layouting fits this thing so well).
*/
Toolbar.prototype.updateChildren = function () {
    // we want to remove all our children
    this.removeAllChildren();
    
    // we now want to iterate our items and create children for them
    var items = this.getItems(),
        i,
        l = items.length;
    for (i = 0; i < l; i += 1) {
        this.createItemHtml(items[i], i, l);
    }
};

Toolbar.prototype.createItemHtml = function (item, index, numIndex) {
    var that = this,
        name = String(index),
        icon = item.getIcon(),
        c;
    
    if (icon) {
        c = this.addHtmlChild(
            'span', 
            '<img src = "' + icon + '" alt = "' + item.getText() + '" ></img>',
            { "class": "baseui_Toolbar_item" },
            name
        );
        // keep a reference to the item
        c.item = item;
        
        // to this child we want to add a handler
        c.on('click', function () {
            item.action();
            that.updateChildren();
        });
        c.on('mouseover', function () {
            // if something is already highlighted
            /*if (that.highlighted) {
                that.highlightItem(name);
            }*/
        });
    }
};


exports.Toolbar = Toolbar;
