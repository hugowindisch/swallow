/**
    ${clsname}.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    mvvm = require('mvvm'),
    packageName = '${packageName}',
    className = '${clsname}',
    group = require('./groups').groups.${clsname},
    availableBindings = mvvm.getDefaultBindings();

function ${clsname}(config) {
    domvisual.DOMElement.call(this, config, group);
}
${clsname}.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
mvvm.MVVM.initialize(${clsname}, availableBindings);
${clsname}.prototype.getConfigurationSheet = function () {
    return {
        mVVMBindingInfo: require('config').bindingsConfig('Bindings', availableBindings)
    };
};

exports.${clsname} = ${clsname};
