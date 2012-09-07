/**
    folder.js
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
    verticalmenu = require('./verticalmenu'),
    isFunction = utils.isFunction;


function Folder(config) {
    var that = this;
    domvisual.DOMElement.call(this, config);
    this.indent = 10;
    this.updateChildren();
}

Folder.prototype = new (domvisual.DOMElement)();

Folder.prototype.getActiveTheme = visual.getGetActiveTheme('baseui', 'Folder');

Folder.prototype.getDescription = function () {
    return "An expandable item in a list";
};

Folder.prototype.theme = new (visual.Theme)({
    expanded: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'expandedFolder' }
        ]
    },
    contracted: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'contractedFolder' }
        ]
    }
});

/**
    o.factory: name of the factory
    o.type: type
    o.config: config to use
*/
Folder.prototype.setInternal = function (o) {
    var fact, Constr, c;
    if (o instanceof (visual.Visual)) {
        this.internal = o;
    } else {
        fact = require(o.factory);
        if (fact) {
            Constr = fact[o.type];
            if (Constr) {
                this.internal = new Constr(o.config);
                this.internal.setVisible(false);
            }
        }
    }
    return this;
};


/**
*/
Folder.prototype.setText = function (o) {
    this.text = o;
    return this;
};

/**
    Create the content.
*/
Folder.prototype.updateChildren = function () {
    var o = this.internal,
        t = this.text,
        tc,
        that = this;
    // clear our content
    this.removeAllChildren();
    this.expanded = false;

    if (o) {
        tc = this.addTextChild('div', t, { 'style': 'contracted' }, 'title');
        this.addChild(o, 'content');
        o.setHtmlFlowing({ position: 'relative', left: this.indent + 'px' }, true);
        o.setVisible(false);
        tc.on('click', function () {
            that.toggleExpansion();
            that.emit('expand', that.expanded);
        });
        tc.setCursor('pointer');
    }
};

/**
    Sets the expanded state.
*/
Folder.prototype.setExpanded = function (expanded) {
    var children = this.children;
    if (expanded !== this.expanded) {
        this.expanded = expanded;
        if (expanded) {
            children.title.setStyle('expanded');
            children.content.setVisible(true);
        } else {
            children.title.setStyle('contracted');
            children.content.setVisible(false);
        }
    }
    return this;
};

/**
    Toggles the expansion of the box.
*/
Folder.prototype.toggleExpansion = function () {
    this.setExpanded(!this.expanded);
    return this;
};

/**
    Sets the indent.
*/
Folder.prototype.setIndent = function (indent) {
    this.indent = indent;
    return this;
};

Folder.prototype.getConfigurationSheet = function () {
    return { internal: {}, text: {}, indent: {} };
};

exports.Folder = Folder;
