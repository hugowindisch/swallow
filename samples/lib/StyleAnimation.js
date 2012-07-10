/**
    StyleAnimation.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    group = require('/testcontent/lib/groups').groups.StyleAnimation;

function StyleAnimation(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var nextStyle = {
        style: 'style0',
        style0: 'style1',
        style1: 'style'
    };
    // change some styles
    function transition() {
        forEachProperty(this.children, function (c, n) {
            c.setTransition(300).setStyle(nextStyle[c.style]);
        });
    }
    // hook the transition function to some handlers
    this.on('keydown', transition).on('click', transition);
}
StyleAnimation.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'testcontent', 'StyleAnimation');
StyleAnimation.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.StyleAnimation = StyleAnimation;
