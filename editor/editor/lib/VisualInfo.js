/**
    VisualInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    ConfigurationSheet = require('./ConfigurationSheet').ConfigurationSheet,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function VisualInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualInfo);
    this.setChildrenClipping('hidden');
}
VisualInfo.prototype = new (domvisual.DOMElement)();
VisualInfo.prototype.theme = new (visual.Theme)({
    selected: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'buttonBackground' }
        ]
    }
});
VisualInfo.prototype.setTypeInfo = function (ti) {
    var that = this;
    function loadPreview() {
        var factory,
            Constr,
            preview;
        define.meat.loadPackage(ti.factory, function (err) {
            if (!err) {
                factory = require(ti.factory);
                if (factory) {
                    Constr = factory[ti.type];
                    if (Constr) {
                        if (Constr.createPreview) {
                            // specific preview
                            preview = Constr.createPreview();
                        } else {
                            // generic preview
                            preview = new Constr({});
                            preview.setChildrenClipping('hidden');
                            preview.enableScaling(true);
                        }
                        preview.setPosition('preview');
                        preview.enableInteractions(false);
                        that.addChild(preview, 'preview');
                    }
                }
            } /*else {
                // display something to say that it did not work properly.
            }*/
        });
    }
    this.ti = ti;
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
    this.children.description.setText(ti.description);
    // show the preview (normally, I would have to load it)
    loadPreview();
};
VisualInfo.prototype.getTypeInfo = function () {
    var ti = this.ti;
    return { factory: ti.factory, type: ti.type };
};
VisualInfo.prototype.getConfigurationSheet = function () {
    return { typeInfo: {} };
};
VisualInfo.prototype.init = function (editor) {
    this.editor = editor;
};
VisualInfo.prototype.select = function (selected) {
    this.setStyle(selected ? 'selected' : null);
    if (selected) {
        this.showDetails();
    } else {
        this.hideDetails();
    }

};
VisualInfo.prototype.showDetails = function () {
    var children = this.children,
        viewer = this.editor.getViewer(),
        configurationSheet,
        csPos = groups.VisualInfo.positions.configurationSheet,
        csPosMat = mat4.create(csPos.matrix),
        csVertical = 10,
        hooked = true,
        that = this;
    configurationSheet = new ConfigurationSheet({});
    this.addChild(configurationSheet, 'configurationSheet');

    csPosMat[5] = csVertical;
    configurationSheet.setPosition(new (visual.Position)(
        csPosMat,
        { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'px', height: 'auto' }
    ));

    function setConfigurationSheetContent() {
        if (hooked) {
            configurationSheet.setEditedVisual(that.editor, function (error, dim) {
                that.setDimensions(
                    [that.dimensions[0], csPosMat[13] + dim[1] + 10, 1]
                );
            });
        }
    }
    this.unhookConfigurationSheet = function () {
        hooked = false;
        viewer.removeListener('updateSelectionControlBox', setConfigurationSheetContent);
    };
    viewer.on('updateSelectionControlBox', setConfigurationSheetContent);
    setConfigurationSheetContent();
};
VisualInfo.prototype.hideDetails = function () {
    var children = this.children,
        configurationSheet = children.configurationSheet;
    if (configurationSheet) {
        this.removeChild(configurationSheet);
        if (this.unhookConfigurationSheet) {
            this.unhookConfigurationSheet();
            delete this.unhookConfigurationSheet;
        }
    }
    this.setDimensions(groups.VisualInfo.dimensions);
};


exports.VisualInfo = VisualInfo;
