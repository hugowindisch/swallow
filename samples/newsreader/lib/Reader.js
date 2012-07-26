/**
    Reader.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = 'newsreader',
    className = 'Reader',
    group = require('./groups').groups.Reader,
    TopicList = require('./TopicList').TopicList;

function Reader(config) {
    domvisual.DOMElement.call(this, config, group);
    this.pushPage(new TopicList({url: 'newsreader/lib/topics.json'}));
}
Reader.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
Reader.prototype.getConfigurationSheet = function () {
    return {  };
};
Reader.prototype.pushPage = function (page, overlay) {
    var that = this;
    // clean the stack
    this.forEachChild(function (c) {
        if (c.position === 'right') {
            c.remove();
        }
        else if (c.position === 'content' && !overlay) {
            c.setPosition('left');
        }
    });
    // add the child that we want
    this.addChild(page);
    if (overlay) {
        page.setPosition('content');
    } else {
        page.setPosition('right');
        setTimeout(function () {
            page.setTransition(300);
            page.setPosition('content');
            visual.update();
        }, 10);
    }
    // page notifications
    page.on('pushpage', function (p, overlay) {
        that.pushPage(p, overlay);
    });
    page.on('poppage', function () {
        that.popPage();
    });
};
Reader.prototype.popPage = function () {
    var that = this,
        numC = this.getNumChildren();
    if (numC > 1) {
        this.getChildAtOrder(numC - 1).setTransition(200).setPosition('right');
        this.getChildAtOrder(numC - 2).setPosition('content');
    }
};

exports.Reader = Reader;
