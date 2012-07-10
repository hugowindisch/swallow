/**
    InnerModule.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/testcontent/lib/groups').groups.InnerModule;

function InnerModule(config) {
    domvisual.DOMElement.call(this, config, group);
}
InnerModule.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'testcontent', 'InnerModule');
InnerModule.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.InnerModule = InnerModule;