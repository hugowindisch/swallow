/**
    Package.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/launcher/lib/groups').groups.Package;

function Package(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var that = this;
    this.setCursor('pointer');
    this.on('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.emit('select', that.selected);
    });
    if (this.selelected === undefined) {
        this.setSelected(false);
    }
}
Package.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'Package');
Package.prototype.getConfigurationSheet = function () {
    return {  };
};
Package.prototype.setName = function (n) {
    this.getChild('name').setText(n);
};
Package.prototype.setSelected = function (s) {
    this.selected = s;
    // we don't want to support this at this moment.
    this.getChild('delete').setVisible(false); //s);
    this.getChild('background').setTransition(200).setStyle(s ? 'select' : 'normal');
};

exports.Package = Package;
