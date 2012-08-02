/**
    VisualInfo.js

    The SwallowApps Editor, an interactive application builder for creating
    html applications.

    Copyright (C) 2012  Hugo Windisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    deepCopy = utils.deepCopy,
    groups = require('/editor/lib/definition').definition.groups,
    ConfigurationSheet = require('./ConfigurationSheet').ConfigurationSheet;

function VisualInfo(config) {
    var that = this;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualInfo);
    this.getChild('selectionBox').setVisible(false);
    this.on('mouseover', function () {
        var ti = that.ti;
        that.getChild('button').setVisible(
            ti !== undefined &&
                ti.factory !== 'domvisual' &&
                ti.factory !== 'baseui'
        );
    }).on('mouseout', function () {
        that.getChild('button').setVisible(false);
    }).getChild(
        'button'
    ).setVisible(
        false
    ).on(
        'click',
        function () {
            that.editor.editGroup(that.ti.factory, that.ti.type);
        }
    );
}
VisualInfo.prototype = new (domvisual.DOMElement)();
VisualInfo.prototype.theme = new (visual.Theme)({
    selected: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'control' }
        ]
    }
});
VisualInfo.prototype.setTypeInfo = function (ti) {
    var that = this;
    function loadPreview() {
        var factory,
            Constr,
            preview,
            previewClickBox;
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
                    preview.setOverflow('hidden');
                    preview.enableScaling(true);
                }
                preview.setPosition('preview');
                preview.enableInteractions(false);
                that.addChild(preview, 'preview');
                // description
                if (Constr.prototype.getDescription) {
                    that.children.description.setText(Constr.prototype.getDescription());
                }
                // click
                previewClickBox = new domvisual.DOMElement({});
                that.addChild(previewClickBox, 'clickBox');
                previewClickBox.setPosition(
                    'preview'
                ).on('click', function () {
                    that.emit('select');
                }).setCursor('pointer');
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
    return this.ti;
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
                deepCopy(that.getTypeInfo()),
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
