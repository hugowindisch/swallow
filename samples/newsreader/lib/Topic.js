/**
    Topic.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = 'newsreader',
    className = 'Topic',
    group = require('./groups').groups.Topic,
    TopicText = require('./TopicText').TopicText;

function Topic(config) {
    domvisual.DOMElement.call(this, config, group);
    this.on('click', function () {
        this.emit('pushpage', new TopicText({url: this.contentUrl, title: this.title}));
    }).setCursor('pointer');
}
Topic.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
Topic.prototype.getConfigurationSheet = function () {
    return {  };
};
Topic.prototype.setTitle = function (txt) {
    this.title = txt;
    this.getChild('title').setOverflow('hidden').setInnerText(txt);
};
Topic.prototype.setShort = function (txt) {
    this.getChild('short').setOverflow('hidden').setInnerText(txt);
};
Topic.prototype.setImage = function (url) {
    this.getChild('image').setUrl(url);
};
Topic.prototype.setContent = function (url) {
    this.contentUrl = url;
};


exports.Topic = Topic;
