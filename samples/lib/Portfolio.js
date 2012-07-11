/**
    Portfolio.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('./groups').groups.Portfolio,
    utils = require('utils'),
    forEach = utils.forEach;

function Portfolio(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var children = this.getChildren(),
        that = this;
    forEach(
        [ 'pos2', 'pos1', 'pos3', 'pos4', 'pos5' ],
        function (n) {
            children[n].on(
                'mousemove',
                function () {
                    this.setOpacity(1);
                }
            ).on(
                'mouseout',
                function () {
                    this.setOpacity(0.5);
                }
            ).on(
                'click',
                function () {
                    var viewer = children.pos8,
                        url = this.getUrl();
                    if (url !== viewer.getUrl()) {
                        viewer.clearTransition();
                        viewer.setOpacity(0.1);
                        viewer.setUrl(this.getUrl());
                        viewer.on('load', function () {
                            viewer.setTransition(1000);
                            viewer.setOpacity(1);
                        });
                    }
                }
            ).setOpacity(0.5);
        }
    );
}
Portfolio.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'samples', 'Portfolio');

exports.Portfolio = Portfolio;
