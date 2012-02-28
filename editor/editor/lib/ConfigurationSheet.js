/**
    ConfigurationSheet.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    baseui = require('baseui'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;
/*globals define */
function ConfigurationSheet(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.ConfigurationSheet);
}
ConfigurationSheet.prototype = new (domvisual.DOMElement)();
ConfigurationSheet.prototype.getConfigurationSheet = function () {
    return { };
};
/**
    The configuration sheet
    
    {
        label: 'abc',
        factory,
        type,
        // optional
            config,
            valueName,  // assumed: 'value'
            changeEvent, // assumed: 'change' (change event)
            labelAbove: true
            order // if you want a special ordering
    }
    define.meat.loadPackage(jsonData[i].factory, packageLoaded);
*/
ConfigurationSheet.prototype.setEditedVisual = function (editor, cbWhenReady) {
    var viewer = editor.getViewer(),
        selectedName = viewer.getSelectedName(),
        vis = viewer.getSelectedVisual(),
        group = viewer.getGroup(),
        documentData = group.documentData,
        editedData = documentData.children[selectedName],
        sheet,
        toLoad = [],
        error = null,
        i,
        l,
        loading,
        that = this;
    if (viewer.getSelectionLength() !== 1 || this.selectedName === selectedName || vis === undefined) {
        return;
    }

    sheet = vis.getConfigurationSheet();

    this.selectedName = selectedName;
    this.sheet = sheet;
    this.removeAllChildren();
    // find what needs to be loaded as editors
    forEachProperty(sheet, function (it, name) {
        if (it.factory && it.type) {
            toLoad.push({name: name, item: it});
        }
    });
    loading = toLoad.length;
    function updateContent() {
        forEachProperty(sheet, function (it, name) {
            var vis, valueName, newConfig = {};
            if (it.factory && it.type) {
                valueName = it.valueName || 'data';
                vis = that.children[name];
                newConfig[name] = vis[vis.getGetFunctionName(valueName)]();
            }
            // apply this to the model
            group.doCommand(group.cmdSetVisualConfig(selectedName, newConfig));
        });
    }
    function createItemEditors() {
        forEachProperty(sheet, function (it, name) {
            var p, Constr, c, valueName, configValue, label;
            if (it.factory && it.type) {
                p = require(it.factory);
                if (p) {
// LABEL / LABELTOP                
                    Constr = p[it.type];
                    if (Constr) {
                        if (it.label) {
                            label = new (baseui.Label)({text: it.label});
                            label.setHtmlFlowing({});
                            that.addChild(label);
                        }
                        c = new Constr(it.config || {});
                        c.setHtmlFlowing({});
                        // set the proper data
                        valueName = it.valueName || 'data';
                        configValue = editedData.config[name];
                        if (configValue) {
                            c[c.getSetFunctionName(valueName)](editedData.config[name]);
                        }
                        // add the child
                        that.addChild(c, name);
                        c.on('change', updateContent);
                    }
                }
            }
        });
    }
    function getPackageLoaded(toLoad) {
        return function (err) {
            loading -= 1;
            if (err) {
                error = err;
            }
            if (loading === 0) {
                // we are done : we can create all the item editors
                createItemEditors();
                // callback:
                if (cbWhenReady) {                
                    cbWhenReady(error, that.getComputedDimensions());
                }
            }
        };
    }
    if (loading > 0) {
        l = loading;
        for (i = 0; i < l; i += 1) {
            define.meat.loadPackage(
                toLoad[i].item.factory, 
                getPackageLoaded(toLoad[i])
            );
        }
    }
};


exports.ConfigurationSheet = ConfigurationSheet;
