/**
    folder.js
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


function Folder(config) {
    var that = this;
    domvisual.DOMElement.call(this, config);
    this.updateChildren();
}
Folder.prototype = new (domvisual.DOMElement)();

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
};


/**
*/
Folder.prototype.setText = function (o) {
    this.text = o;
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
        o.setHtmlFlowing({}, true);
        o.setVisible(false);
        tc.on('click', function () {
            that.toggleExpansion();
        });        
    }
};

/**
    Toggles the expansion of the box.
*/
Folder.prototype.toggleExpansion = function () {
    var expanded = !this.expanded,
        children = this.children;
    this.expanded = expanded;
    if (expanded) {
        children.title.setStyle('expanded');
        children.content.setVisible(true);
    } else {
        children.title.setStyle('contracted');
        children.content.setVisible(false);
    }
};

Folder.prototype.getConfigurationSheet = function () {
    return { internal: {}, text: {} };
};

exports.Folder = Folder;
