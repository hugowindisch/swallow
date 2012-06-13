/**
    StylingHeading.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups;

function StylingHeading(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StylingHeading);
}
StylingHeading.prototype = new (domvisual.DOMElement)();
StylingHeading.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StylingHeading = StylingHeading;
