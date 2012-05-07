/**
    {clsname}.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/{packageName}/lib/groups').groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function {clsname}(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.{clsname});
}
{clsname}.prototype = new (domvisual.DOMElement)();
{clsname}.prototype.theme = new (visual.Theme)(groups.{clsname}.theme);
{clsname}.prototype.privateTheme = groups.{clsname}.privateTheme;
{clsname}.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.{clsname} = {clsname};
