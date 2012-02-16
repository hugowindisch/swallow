/**
    VisualList.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    VisualInfo = require('./VisualInfo').VisualInfo,
    http = require('http'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function VisualList(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualList);
    this.reload();
}
VisualList.prototype = new (domvisual.DOMElement)();
VisualList.prototype.reload = function () {
    this.removeAllChildren();
    var data = '',
        that = this;
    http.get({ path: '/visual'}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data),
                i,
                l = jsonData.length,
                c;
            for (i = 0; i < l; i += 1) {
                c = new VisualInfo({ typeInfo: jsonData[i]});
                // FIXME: this needs some thinking... I want to flow the thing,
                // and doing so 
                c.setHtmlFlowing({position: 'relative'}, true);
                that.addChild(c);
            }
        });
    });
};

exports.VisualList = VisualList;
