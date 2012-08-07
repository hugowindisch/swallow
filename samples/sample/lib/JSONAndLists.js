/**
    JSONAndLists.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/samples/lib/groups').groups.JSONAndLists,
    http = require('http'),
    whiskers = require('whiskers'),
    domelement = require('domelement');

function JSONAndLists(config) {

    domvisual.DOMElement.call(this, config, group);
    this.load();
}
JSONAndLists.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'samples', 'JSONAndLists');
JSONAndLists.prototype.getConfigurationSheet = function () {
    return {  };
};
JSONAndLists.prototype.load = function () {
    var data = '',
        that = this;
    http.get(
        {path: 'samples/lib/htmlsample.html'},
        function (res) {
            res.on('data', function (d) {
                data += d;
            });
            res.on('end', function () {

                that.setHtml(data);
            });
            res.on('error', function (e) {
                alert('Error loading');
            });
        }
    );
};

JSONAndLists.prototype.setHtml = function (html) {
    var that = this;
    this.getChild('theStuff').addHtmlChild('div', html);
    setTimeout(function () {
        var el = that.getChild('theStuff').element;

        domelement('.swallow', el
        ).setVisual('baseui', 'Button', { text: 'hello'});

        domelement('h1', el
        ).setStyle(visual.defaultSkin, 'samples', 'JSONAndLists', 'style'
        ).setMargins(40, 40, 40, 40
        ).setPadding(10, 10, 10, 10);

        console.log(whiskers.render('<test>{test}</test', { test: 'abcd' }));

        visual.update();
    }, 50);
};

exports.JSONAndLists = JSONAndLists;
