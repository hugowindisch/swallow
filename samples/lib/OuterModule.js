/**
    OuterModule.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/testcontent/lib/groups').groups.OuterModule;

function OuterModule(config) {
    domvisual.DOMElement.call(this, config, group);
}
OuterModule.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'testcontent', 'OuterModule');
OuterModule.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.OuterModule = OuterModule;