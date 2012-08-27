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
    ConfigurationSheet = require('./ConfigurationSheet').ConfigurationSheet,
    onlyInEditorUrl = 'editor/img/disableinstanciation.png',
    notOnlyInEditorUrl = 'editor/img/enableinstanciation.png';

function VisualInfo(config) {
    var that = this;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualInfo);
    this.getChild('selectionBox').setVisible(false);
    this.on('mouseover', function () {
        var ti = that.ti;
        if (!that.buttonAlwaysVisible()) {
            that.getChild('button').setVisible(
                (ti !== undefined &&
                    ti.factory !== 'domvisual' &&
                    ti.factory !== 'baseui')
            );
        }
    }).on('mouseout', function () {
        if (!that.buttonAlwaysVisible()) {
            that.getChild('button').setVisible(false);
        }
    }).getChild(
        'button'
    ).setVisible(
        false
    ).on(
        'click',
        function () {
            this.fcn();
        }
    );
    this.getChild('instanciate'
    ).setCursor('pointer'
    ).on('click', function () {
        var viewer = that.editor.getViewer(),
            inEditor = !viewer.getSelectionOnlyInEditor();
        viewer.setSelectionOnlyInEditor(inEditor);
        this.updateUrl(inEditor);

    }).setVisible(false).updateUrl = function (inEditor) {
        this.setUrl(inEditor ? onlyInEditorUrl : notOnlyInEditorUrl);
    };
}
VisualInfo.prototype = new (domvisual.DOMElement)();
VisualInfo.prototype.theme = new (visual.Theme)({
    selected: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'control' }
        ]
    }
});
VisualInfo.prototype.buttonAlwaysVisible = function () {
    var ti = this.ti,
        group = this.editor.getGroup(ti.factory, ti.type);
    return Boolean(group);
};
VisualInfo.prototype.updateButton = function (b) {
    var ti = this.ti,
        editor = this.editor,
        group = editor.getGroup(ti.factory, ti.type),
        selectedGroup = this.editor.getSelectedGroup(),
        that = this;

    if (group) {
        if (group === selectedGroup) {
            if (group.getCommandChain().isOnSavePoint()) {
                if (editor.hasMoreThanOneGroup()) {
                    b.setText('Close').setVisible(true);
                    b.fcn = function () {
                        editor.closeGroup(ti.factory, ti.type);
                    };
                } else {
                    b.setVisible(false);
                }
            } else {
                b.setText('Save').setVisible(true);
                b.fcn = function () {
                    editor.saveGroup(ti.factory, ti.type);
                };
            }
        } else {
            b.setText('Edit').setVisible(true);
            b.fcn = function () {
                editor.editGroup(ti.factory, ti.type);
            };
        }
    } else {
        b.setText('Open');
        b.fcn = function () {
            editor.editGroup(ti.factory, ti.type);
        };
    }

};
VisualInfo.prototype.setTypeInfo = function (ti) {
    var that = this;
    function select() {
        that.emit('select');
    }
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
                    that.children.description.on('click', select
                    ).setCursor('pointer').setText(Constr.prototype.getDescription());
                }
                // click
                previewClickBox = new domvisual.DOMElement({});
                that.addChild(previewClickBox, 'clickBox');
                previewClickBox.setPosition(
                    'preview'
                ).on('click', select).setCursor('pointer');

            }
        }
    }
    this.ti = ti;
    this.children.name.on('click', select
    ).setCursor('pointer'
    ).setText(ti.type + (ti.factory === 'domvisual' ? '' : (' (' + ti.factory + ')')));
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
    var that = this,
        viewer = editor.getViewer();
    this.editor = editor;
    // configure the button
    this.updateButton(this.getChild('button'));
    function updateOnEdit() {
        // yuck. at this moment we don't have any notification for being
        // unhooked from the stage
        if (!this.connectedToTheStage) {
            viewer.removeListener('command', updateOnEdit);
            viewer.removeListener('setSavePoint', updateOnEdit);
        } else {
            that.updateButton(that.getChild('button'));
        }
    }
    viewer.on('command', updateOnEdit);
    viewer.on('setSavePoint', updateOnEdit);
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
        configurationSheet,
        hooked = true,
        typeInfo = this.ti,
        that = this;

    configurationSheet = new ConfigurationSheet({});
    this.addChild(configurationSheet, 'configurationSheet');
    configurationSheet.setPosition('configurationSheet');

    this.getChild('instanciate'
    ).setVisible(true
    ).updateUrl(viewer.getSelectionOnlyInEditor());

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

    // previews the edited stuff with the sheet's content.
    function previewDataFromConfigurationSheet(newConfig) {
        var editingDefaultAttributes = viewer.getSelectionLength() === 0,
            editedData = editingDefaultAttributes ? {} : viewer.getSelectionConfig();
        if (!editingDefaultAttributes) {
            viewer.previewSelectionConfig(newConfig);
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
                previewDataFromConfigurationSheet,
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
        viewer.removeListener('command', checkConfigChange);
        delete that.unhookConfigurationChangeHandlers;
    };
    // add the handlers to detect configuration changes and update the sheet
    // accordingly
    viewer.on('selectionChanged', setConfigurationSheetContent);
    viewer.on('command', checkConfigChange);
    setConfigurationSheetContent();
};

VisualInfo.prototype.hideDetails = function () {
    var children = this.children,
        configurationSheet = children.configurationSheet;

    this.getChild('instanciate').setVisible(false);
    if (configurationSheet) {
        this.removeChild(configurationSheet);
    }
    if (this.unhookConfigurationChangeHandlers) {
        this.unhookConfigurationChangeHandlers();
    }
    this.setDimensions(groups.VisualInfo.dimensions);
};


exports.VisualInfo = VisualInfo;
