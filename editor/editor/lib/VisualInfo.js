/**
    VisualInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    VisualProperties = require('./VisualProperties').VisualProperties,
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
        try {
            factory = require(ti.factory);
            if (factory) {
                Constr = factory[ti.type];
                if (Constr) {
                    preview = new Constr({});
                    that.addChild(preview, 'preview');
                    preview.setPosition('preview');
                }
            }
        } catch (e) {
        }
    }
    this.ti = ti;
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
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
        visualProperties,
        configurationSheet,
        csPos = groups.VisualInfo.positions.configurationSheet,
        csPosMat = mat4.create(csPos.matrix),
        csVertical = 10,
        that = this;
    visualProperties = new VisualProperties({});
    configurationSheet = new ConfigurationSheet({});

    visualProperties.setPosition('visualProperties');
    this.addChild(visualProperties, 'visualProperties');
    this.addChild(configurationSheet, 'configurationSheet');
    
    csPosMat[5] = csVertical;
    configurationSheet.setPosition(new (visual.AbsolutePosition)(
        csPosMat,
        { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
    ));

    function setConfigurationSheetContent() {    
        configurationSheet.setEditedVisual(that.editor, function (error, dim) {
            that.setDimensions(
                [that.dimensions[0], csPosMat[13] + dim[1] + 10, 1]
            );
        });
    }
    this.unhookConfigurationSheet = function () {
        viewer.removeListener('updateSelectionControlBox', setConfigurationSheetContent);
    };
    viewer.on('updateSelectionControlBox', setConfigurationSheetContent);
    setConfigurationSheetContent();
};
VisualInfo.prototype.hideDetails = function () {
    var children = this.children,
        visualProperties = children.visualProperties,
        configurationSheet = children.configurationSheet;
    if (visualProperties) {
        this.removeChild(visualProperties);
    }
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
