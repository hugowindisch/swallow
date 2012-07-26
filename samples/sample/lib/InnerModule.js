/**
    InnerModule.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/samples/lib/groups').groups.InnerModule;

function InnerModule(config) {
    domvisual.DOMElement.call(this, config, group);
}
InnerModule.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'samples', 'InnerModule');
InnerModule.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.InnerModule = InnerModule;
