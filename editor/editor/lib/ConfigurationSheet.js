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
    var that = this;
    // when our (flowed) content is resized, we want to get notified
    // and ask for a resize of ourselves!
    this.on('domchanged', function () {
        that.requestDimensions(that.getComputedDimensions());
    });
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
ConfigurationSheet.prototype.setEditedVisual = function (editor, typeInfo, cbWhenReady) {
    var viewer = editor.getViewer(),
        group = viewer.getGroup(),
        editedData,
        sheet,
        toLoad = [],
        error = null,
        i,
        l,
        loading,
        editingDefaultAttributes = viewer.getSelectionLength() === 0,
        that = this;

    // prevent entering this function recursively
    if (this.settingConfig) {
        return;
    }
    // get the edited data
    editedData = editingDefaultAttributes ? {} : viewer.getSelectionConfig();

    // get the configuration sheet of the edited type
    sheet = require(typeInfo.factory)[typeInfo.type].prototype.getConfigurationSheet.call(null);

    this.removeAllChildren();
    // computes the list of all input controls to load
    forEachProperty(sheet, function (it, name) {
        if (it) {
            toLoad.push({name: name, fcn: it});
        }
    });

    // updates the edited stuff with the sheet's content.
    function updateContent() {
        var newConfig = {};
        forEachProperty(sheet, function (it, name) {
            var c;
            if (it) {
                c = that.children[name];
                newConfig[name] = c.getData();
            }
        });
        // apply this to the model (and prevent updating the sheet while this happens)
        that.settingConfig = true;
        if (editingDefaultAttributes) {
            viewer.setDefaultVisual({
                factory: typeInfo.factory,
                type: typeInfo.type,
                config: newConfig
            });
        } else {
            viewer.setSelectionConfig(newConfig);
        }
        delete that.settingConfig;
    }

    // initializes all controls
    function initControls() {
        var i, l = toLoad.length, tl, c, data;
        for (i = 0; i < l; i += 1) {
            tl = toLoad[i];
            c = tl.ctrl;
            c.setHtmlFlowing({position: 'relative'}, true);
            data = editedData[tl.name];
            if (data) {
                c.setData(data);
            }
            c.on('change', updateContent);
            that.addChild(c, toLoad[i].name);
        }
    }

    // returns a function to be called when the controls are loaded
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
                initControls();
                // append all our children
                cbWhenReady(err, that.getComputedDimensions());
            }
        };
    }

    // loads the controls needed for the sheet
    loading = toLoad.length;
    l = loading;
    for (i = 0; i < l; i += 1) {
        toLoad[i].fcn(editor, getOnLoad(i));
    }

};

exports.ConfigurationSheet = ConfigurationSheet;
