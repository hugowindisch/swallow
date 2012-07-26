/**
    OuterModule.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/samples/lib/groups').groups.OuterModule;

function OuterModule(config) {
    domvisual.DOMElement.call(this, config, group);
}
OuterModule.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'samples', 'OuterModule');
OuterModule.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.OuterModule = OuterModule;
