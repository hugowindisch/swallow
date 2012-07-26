/**
    GlobalStyling.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = 'newsreader',
    className = 'GlobalStyling',
    group = require('./groups').groups.GlobalStyling;

function GlobalStyling(config) {
    domvisual.DOMElement.call(this, config, group);
}
GlobalStyling.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
GlobalStyling.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.GlobalStyling = GlobalStyling;