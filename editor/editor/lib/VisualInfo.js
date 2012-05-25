/**
    VisualInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    ConfigurationSheet = require('./ConfigurationSheet').ConfigurationSheet;

function VisualInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualInfo);
    this.children.selectionBox.setVisible(false);
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
                // description
                if (Constr.prototype.getDescription) {
                    that.children.description.setText(Constr.prototype.getDescription());
                }
            }
        }
    }
    this.ti = ti;
    this.children.name.setText(ti.type + (ti.factory === 'domvisual' ? '' : (' (' + ti.factory + ')')));
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
    this.children.selectionBox.setVisible(selected);
    if (selected) {
        this.showDetails();
    } else {
        this.hideDetails();
    }

};
VisualInfo.prototype.showDetails = function () {
    var children = this.children,
        viewer = this.editor.getViewer(),
        group = viewer.getGroup(),
        commandChain = group.getCommandChain(),
        configurationSheet,
        hooked = true,
        that = this;
    configurationSheet = new ConfigurationSheet({});
    this.addChild(configurationSheet, 'configurationSheet');

    configurationSheet.setPosition('configurationSheet');

    // set the default visual if the selection is empty
    if (viewer.getSelectionLength() === 0) {
        viewer.setDefaultVisual({
            factory: this.ti.factory,
            type: this.ti.type,
            config: {}
        });
    }

    function setConfigurationSheetContent() {
        if (hooked) {
            configurationSheet.setEditedVisual(
                that.editor,
                that.getTypeInfo(),
                function (error, dim) {}
            );
        }
    }
    function checkConfigChange(command, name, message, hint, forEachSubCommand) {
        var configChange = false;
        function test(name, message, hint) {
            if (hint && hint.visualConfig) {
                configChange = true;
            }
        }
        if (hooked) {
            if (forEachSubCommand) {
                forEachSubCommand(test);
            }
            test(name, message, hint);
            if (configChange) {
                configurationSheet.setEditedVisual(
                    that.editor,
                    that.getTypeInfo(),
                    function (error, dim) {}
                );
            }
        }
    }
    this.unhookConfigurationSheet = function () {
        hooked = false;
        viewer.removeListener('selectionChanged', setConfigurationSheetContent);
        commandChain.removeListener('command', checkConfigChange);
    };
    viewer.on('selectionChanged', setConfigurationSheetContent);
    commandChain.on('command', checkConfigChange);
    setConfigurationSheetContent();
};
VisualInfo.prototype.hideDetails = function () {
    var children = this.children,
        configurationSheet = children.configurationSheet;
    if (configurationSheet) {
        this.editor.getViewer().setDefaultVisual(null);
        this.removeChild(configurationSheet);
        if (this.unhookConfigurationSheet) {
            this.unhookConfigurationSheet();
            delete this.unhookConfigurationSheet;
        }
    }
    this.setDimensions(groups.VisualInfo.dimensions);
};


exports.VisualInfo = VisualInfo;
