/**
    EmptyPosition.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function EmptyPosition(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.EmptyPosition);
}
EmptyPosition.prototype = new (domvisual.DOMElement)();
EmptyPosition.prototype.theme = new (visual.Theme)({
    background: {
        data: [ 'editor_emptyPosition' ]
    }
});


exports.EmptyPosition = EmptyPosition;
