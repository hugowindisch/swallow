/**
    VisualModule.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/launcher/lib/groups').groups.VisualModule;

function VisualModule(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var that = this;

    this.setCursor('pointer');
    this.on('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.emit('select', this.selected);
    });
    if (this.selected === undefined) {
        this.setSelected(false);
    }
    this.getChild('run').on('click', function () {
        var ti = that.typeInfo;
        window.open(ti.factory + '.' + ti.type + '.html', '_blank');
    });
    this.getChild('edit').on('click', function () {
        var ti = that.typeInfo;
        window.open('editor.editor.html?factory=' + ti.factory + '&type=' + ti.type, '_blank');
    });
}
VisualModule.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'VisualModule');
VisualModule.prototype.getConfigurationSheet = function () {
    return {  };
};
VisualModule.prototype.setName = function (name) {
    this.getChild('name').setText(name);
};
VisualModule.prototype.setDescription = function (description) {
    this.getChild('description').setText(description);
};
VisualModule.prototype.setPreview = function (Preview) {
    var preview;
    if (Preview.createPreview) {
        // specific preview
        preview = Preview.createPreview();
    } else {
        // generic preview
        preview = new Preview({});
        preview.setChildrenClipping('hidden');
        preview.enableScaling(true);
    }
    preview.setPosition('preview');
    preview.enableInteractions(false);
    this.addChild(preview, 'preview');
};
VisualModule.prototype.setTypeInfo = function (typeInfo) {
    this.typeInfo = typeInfo;
};

VisualModule.prototype.setSelected = function (s) {
    this.selected = s;
    this.getChild('edit').setVisible(s);
    this.getChild('run').setVisible(s);
    this.getChild('delete').setVisible(s);


    this.getChild('background').setTransition(500).setStyle(s ? 'select' : 'normal');
};


exports.VisualModule = VisualModule;
