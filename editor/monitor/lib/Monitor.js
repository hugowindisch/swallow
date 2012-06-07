/**
    Monitor.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/monitor/lib/groups').groups.Monitor;

function Monitor(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
}
Monitor.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'monitor', 'Monitor');
Monitor.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.Monitor = Monitor;