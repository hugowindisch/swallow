/**
    Icon.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = 'newsreader',
    className = 'Icon',
    group = require('./groups').groups.Icon;

function Icon(config) {
    domvisual.DOMElement.call(this, config, group);
    var that = this;
}
Icon.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
Icon.prototype.getConfigurationSheet = function () {
    return {  };
};
Icon.prototype.setImg = function (url) {
    this.getChild('img').setUrl(url);
    return this;
};

exports.Icon = Icon;
