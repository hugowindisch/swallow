/**
    VisualModule.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/launcher/lib/groups').groups.VisualModule;

function VisualModule(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);

    this.setCursor('pointer');
    this.on('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.emit('select', this.selected);
    });
    if (this.selected === undefined) {
        this.setSelected(false);
    }
}
VisualModule.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'VisualModule');
VisualModule.prototype.getConfigurationSheet = function () {
    return {  };
};
VisualModule.prototype.setInfo = function (info) {
    this.info = info;
    this.getChild('name').setText(info.type);
    this.getChild('description').setText(info.description);
};

VisualModule.prototype.setSelected = function (s) {
    this.selected = s;
    this.getChild('edit').setVisible(s);
    this.getChild('run').setVisible(s);
    this.getChild('delete').setVisible(s);


    this.getChild('background').setTransition(500).setStyle(s ? 'select' : 'normal');
};


exports.VisualModule = VisualModule;
