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
    if (selected !== this.selected) {
        this.selected = selected;
        this.children.selectionBox.setVisible(selected);
        if (selected) {
            this.showDetails();
        } else {
            this.hideDetails();
        }
    }
};
VisualInfo.prototype.showDetails = function () {
    var children = this.children,
        editor = this.editor,
        viewer = editor.getViewer(),
        group = viewer.getGroup(),
        commandChain = group.getCommandChain(),
        configurationSheet,
        hooked = true,
        typeInfo = this.ti,
        that = this;

    configurationSheet = new ConfigurationSheet({});
    this.addChild(configurationSheet, 'configurationSheet');
    configurationSheet.setPosition('configurationSheet');

    // updates the edited stuff with the sheet's content.
    function updateDataFromConfigurationSheet(newConfig) {
        var editingDefaultAttributes = viewer.getSelectionLength() === 0,
            editedData = editingDefaultAttributes ? {} : viewer.getSelectionConfig();
        if (editingDefaultAttributes) {
            viewer.setDefaultVisual({
                factory: typeInfo.factory,
                type: typeInfo.type,
                config: newConfig
            });
        } else {
            viewer.setSelectionConfig(newConfig);
        }
    }

    // updates the configuration sheet with the data
    function setConfigurationSheetContent() {
        if (hooked) {
            var editingDefaultAttributes = viewer.getSelectionLength() === 0,
                editedData = editingDefaultAttributes ? {} : viewer.getSelectionConfig();
            configurationSheet.setEditedVisual(
                that.getTypeInfo(),
                editedData,
                updateDataFromConfigurationSheet,
                editor
            );
        }
    }

    // hooks the configuration sheet
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
            // if one of the commands changed the config
            if (configChange) {
                setConfigurationSheetContent();
            }
        }
    }
    // add a function to unkook the handlers
    this.unhookConfigurationChangeHandlers = function () {
        hooked = false;
        viewer.removeListener('selectionChanged', setConfigurationSheetContent);
        commandChain.removeListener('command', checkConfigChange);
        delete that.unhookConfigurationChangeHandlers;
    };
    // add the handlers to detect configuration changes and update the sheet
    // accordingly
    viewer.on('selectionChanged', setConfigurationSheetContent);
    commandChain.on('command', checkConfigChange);
    setConfigurationSheetContent();
};

VisualInfo.prototype.hideDetails = function () {
    var children = this.children,
        configurationSheet = children.configurationSheet;
    if (configurationSheet) {
        this.removeChild(configurationSheet);
    }
    if (this.unhookConfigurationChangeHandlers) {
        this.unhookConfigurationChangeHandlers();
    }
    this.setDimensions(groups.VisualInfo.dimensions);
};


exports.VisualInfo = VisualInfo;
