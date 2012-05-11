/**
    EmptyPosition.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups;

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
EmptyPosition.prototype.getNaturalDimensions = function () {
    return null;
};

exports.EmptyPosition = EmptyPosition;
