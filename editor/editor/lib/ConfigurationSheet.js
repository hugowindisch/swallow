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
    Sets the edited visual. This will load the proper controls in the sheet.
    The sheet may be already loading, and in this case the load will
    be aborted (this is a bit stupid because I don't think we will ever
    reload a different kind of typeInfo in the same ConfigurationSheet,
    so maybe we should simply NOT initiate a new load and exit... )
*/
ConfigurationSheet.prototype.setEditedVisual = function (typeInfo, editedData, saveData, editor) {
    var sheet,
        toLoad = [],
        i,
        l,
        loading,
        aborted = false,
        that = this;

    // prevent entering this function recursively
    if (this.settingConfig) {
        return;
    }

    // abort any pending load
    if (this.abortPending) {
        this.abortPending();
    }
    this.abortPending = function () {
        aborted = true;
    };
    // remove the children
    this.removeAllChildren();

    // get the configuration sheet of the edited type
    sheet = require(typeInfo.factory)[typeInfo.type].prototype.getConfigurationSheet.call(null);

    // computes the list of all input controls to load
    forEachProperty(sheet, function (it, name) {
        if (it) {
            toLoad.push({name: name, fcn: it});
        }
    });

    // updates the data
    function updateData() {
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
        saveData(newConfig);
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
            c.on('change', updateData);
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
            loading -= 1;
            if (loading === 0 && !aborted) {
                initControls();
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
