/**
    ${clsname}.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/${packageName}/lib/groups').groups.${clsname};

function ${clsname}(config) {
    domvisual.DOMElement.call(this, config, group);
}
${clsname}.prototype = visual.inheritVisual(domvisual.DOMElement, group, '${packageName}', '${clsname}');
${clsname}.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.${clsname} = ${clsname};
