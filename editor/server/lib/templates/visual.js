/**
    ${clsname}.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = '${packageName}',
    className = '${clsname}',
    group = require('./groups').groups.${clsname};

function ${clsname}(config) {
    domvisual.DOMElement.call(this, config, group);
}
${clsname}.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
${clsname}.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.${clsname} = ${clsname};
