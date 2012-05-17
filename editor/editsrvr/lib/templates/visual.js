/**
    {clsname}.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/{packageName}/lib/groups').groups.{clsname};

function {clsname}(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
}
{clsname}.prototype = visual.inheritVisual(domvisual.DOMElement, group);
{clsname}.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.{clsname} = {clsname};
