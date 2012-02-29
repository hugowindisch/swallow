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
    this.removeAllChildren(); 
    forEachProperty(sheet, function (it, name) {
        if (it) {
            toLoad.push({name: name, fcn: it});
        }
    });

    function updateContent() {
        forEachProperty(sheet, function (it, name) {
            var vis, valueName, newConfig = {};
            if (it) {
                vis = that.children[name];
                newConfig[name] = vis.getData();
            }
            // apply this to the model
            group.doCommand(group.cmdSetVisualConfig(selectedName, newConfig));
        });
    }

    function createControls() {
        var i, l = toLoad.length, tl, c, data;
        for (i = 0; i < l; i += 1) {
            tl = toLoad[i];
            c = tl.ctrl;
            c.setHtmlFlowing({position: 'relative'}, true);
            data = editedData.config[tl.name];
            if (data) {
                c.setData(editedData.config[tl.name]);
            }
            c.on('change', updateContent);
            that.addChild(c, toLoad[i].name);
        }
    }
    
    function getOnLoad(n) {
        return function (err, ctrl) {
            var i,
                l = toLoad.length,
                c;
            toLoad[n].ctrl = ctrl;
            if (err) {
                error = err;
            }
            loading -= 1;
            if (loading === 0) {
                createControls();
                // append all our children            
                cbWhenReady(err, that.getComputedDimensions());
            }
        };
    }
    
    loading = toLoad.length;
    l = loading;
    for (i = 0; i < l; i += 1) {
        toLoad[i].fcn({}, getOnLoad(i));
    }

};

exports.ConfigurationSheet = ConfigurationSheet;
