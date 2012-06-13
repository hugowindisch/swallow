/**
    StyleName.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups;

function StyleName(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleName);
}
StyleName.prototype = new (domvisual.DOMElement)();
StyleName.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StyleName = StyleName;
