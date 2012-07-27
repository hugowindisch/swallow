/**
    TopicList.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = 'newsreader',
    className = 'TopicList',
    group = require('./groups').groups.TopicList,
    http = require('http'),
    utils = require('utils'),
    forEach = utils.forEach,
    Categories = require('./Categories').Categories,
    catinfo = require('./catinfo');

function TopicList(config) {
    domvisual.DOMElement.call(this, config, group);
    var that = this;
    this.getChild('button').on('mousedown', function () {
        var cats = new Categories({topicList: that.topicList});
        that.emit('pushpage', cats, true);
        cats.on('changecat', function (c) {
            that.setCategory(c);
        });
    });
}
TopicList.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
TopicList.prototype.getConfigurationSheet = function () {
    return {  };
};
TopicList.prototype.setUrl = function (topicUrl) {
    var data = '',
        that = this;
    http.get({path: topicUrl}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            that.setTopicList(JSON.parse(data));
        });
    });
};
TopicList.prototype.setTopicList = function (jsonData) {
    this.topicList = jsonData;
    this.setCategory('all');

};
TopicList.prototype.setCategory = function (cat) {
    var topics = this.getChild('topics'),
        that = this;
    topics.removeAllChildren().setOverflow(['hidden', 'auto']);
    forEach(this.topicList, function (t) {
        var top = t.topic,
            v;
        if (t.category === cat || cat === 'all') {
            v = new (require(top.factory)[top.type])(top.config);
            topics.addChild(v);
            v.setHtmlFlowing({position: 'relative'}, true);
            // set a 'function' position to resize ourselves to our container
            // width
            v.setPosition(function (cntDim) {
                this.setDimensions([cntDim[0], this.dimensions[1], 0]);
            });
            v.on('pushpage', function (p) {
                that.emit('pushpage', p);
            });
            v.on('poppage', function () {
                that.emit('poppage');
            });
        }
    });
    this.getChild('title').setOverflow('hidden').setInnerText(catinfo[cat].title);
    this.getChild('button').setImg(catinfo[cat].icon);
};

exports.TopicList = TopicList;
