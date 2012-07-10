/**
    PositionAnimation.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    group = require('/testcontent/lib/groups').groups.PositionAnimation;

function PositionAnimation(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var n = 0,
        that = this,
        pos = [
            { pos: 'pos', pos0: 'pos0', pos1: 'pos1' },
            { pos: 'pos2', pos0: 'pos3', pos1: 'pos4' }

        ];
    // move things around
    function transition() {
        n += 1;
        if (n >= pos.length) {
            n = 0;
        }
        forEachProperty(pos[n], function (p, n) {
            that.getChild(n).setTransition(300).setPosition(p);
        });
    }
    // hook the transition function to some handlers
    this.on('keydown', transition).on('click', transition);
}
PositionAnimation.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'testcontent', 'PositionAnimation');
PositionAnimation.prototype.getConfigurationSheet = function () {
    return {  };
};

exports.PositionAnimation = PositionAnimation;
