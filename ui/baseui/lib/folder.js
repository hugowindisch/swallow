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

/**
    o.factory: name of the factory
    o.type: type
    o.config: config to use
*/
Folder.prototype.setInternal = function (o) {
    this.internal = o;
};

/**
    o.factory: name of the factory
    o.type: type
    o.config: config to use
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
        fact,
        Constr,
        tc,
        c,
        that = this;
    // clear our content
    this.removeAllChildren();
    this.expanded = false;

    fact = require(o.factory);
    if (fact) {
        Constr = fact[o.type];
        if (Constr) {
            tc = this.addTextChild('div', t, { 'class': 'baseui_Drawer_title_closed' }, 'title');
            c = new Constr(o.config);
            this.addChild(c, 'content');
            //c.setHtmlFlowing({ autoWidth: false, autoHeight: false, inline: false});
            c.setHtmlFlowing({ autoWidth: true, autoHeight: true, inline: false});            
            c.setVisible(false);
            tc.on('click', function () {
                that.toggleExpansion();
            });
        }        
    }
};

/**
    Toggles the expansion of the box.
*/
Folder.prototype.toggleExpansion = function () {
    var expanded = !this.expanded;
    this.expanded = expanded;
    if (expanded) {
        this.children.content.setVisible(true);
    } else {
        this.children.content.setVisible(false);
    }
};

Folder.prototype.getConfigurationSheet = function () {
    return { internal: {}, text: {} };
};

exports.Folder = Folder;
