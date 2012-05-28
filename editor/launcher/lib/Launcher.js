/**
    Launcher.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/launcher/lib/groups').groups.Launcher;

function Launcher(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
}
Launcher.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'Launcher');
Launcher.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.Launcher = Launcher;
