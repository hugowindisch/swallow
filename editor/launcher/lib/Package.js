/**
    Package.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/launcher/lib/groups').groups.Package;

function Package(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
}
Package.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'Package');
Package.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.Package = Package;