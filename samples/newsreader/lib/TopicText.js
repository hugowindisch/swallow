/**
    TopicText.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = 'newsreader',
    className = 'TopicText',
    group = require('./groups').groups.TopicText,
    markdown = require('markdown'),
    http = require('http');

function TopicText(config) {
    domvisual.DOMElement.call(this, config, group);
    var that = this;
    this.getChild('text').setOverflow([ 'hidden', 'auto']);
    this.getChild('button'
    ).setImg('newsreader/img/back.png'
    ).on('mousedown', function () {
        that.emit('poppage');
    });
}
TopicText.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
TopicText.prototype.getConfigurationSheet = function () {
    return {  };
};

TopicText.prototype.setTitle = function (title) {
    this.getChild('title').setOverflow('hidden').setInnerText(title);
};

TopicText.prototype.setUrl = function (topicUrl) {
    var data = '',
        that = this;
    http.get({path: topicUrl}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            that.setMarkdown(data);
        });
    });
};

TopicText.prototype.setMarkdown = function (md) {
    // render the thing using markdown
    var html = markdown.toHTML(md);
    this.getChild('text').setInnerHTML(html);
};

exports.TopicText = TopicText;
