var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups;

function Toolbox(data) {
    // call the baseclass
    domvisual.DOMElement.call(this, data);
    this.createGroup(groups.Toolbox);
    //this.setData(data);
}
Toolbox.prototype = new (domvisual.DOMElement)();

Toolbox.prototype.addTool = function () {
};

exports.Toolbox = Toolbox;
