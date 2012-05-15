/**
    ComponentInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    utils = require('utils'),
    limitRange = utils.limitRange,
    ImageOption = require('./ImageOption').ImageOption;
/*
function StyleSettingText(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingText);
    var children = this.children,
        that = this;

    this.fontWeight = new ImageOption({
        'normal':  [ 'editor/lib/fsnormal_s.png', 'editor/lib/fsnormal.png', children.fontWeightNormal ],
        'bold': [ 'editor/lib/fsbold_s.png', 'editor/lib/fsbold.png', children.fontWeightBold ]
    }, children.fontWeightCheck);
*/

function ComponentInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.ComponentInfo);
}
ComponentInfo.prototype = new (domvisual.DOMElement)();
ComponentInfo.prototype.getConfigurationSheet = function () {
    return { typeInfo: {} };
};
ComponentInfo.prototype.init = function (editor) {
    var that = this,
        viewer = editor.getViewer(),
        children = this.children;

    this.overflowX = new ImageOption({
        'visible':  [ 'editor/lib/ofxvisible_s.png', 'editor/lib/ofxvisible.png', children.overflowXVisible ],
        'hidden':  [ 'editor/lib/ofxhidden_s.png', 'editor/lib/ofxhidden.png', children.overflowXHidden ],
        'auto':  [ 'editor/lib/ofxauto_s.png', 'editor/lib/ofxauto.png', children.overflowXAuto ],
        'scroll':  [ 'editor/lib/ofxscroll_s.png', 'editor/lib/ofxscroll.png', children.overflowXScroll ]
    });

    this.overflowY = new ImageOption({
        'visible':  [ 'editor/lib/ofyvisible_s.png', 'editor/lib/ofyvisible.png', children.overflowYVisible ],
        'hidden':  [ 'editor/lib/ofyhidden_s.png', 'editor/lib/ofyhidden.png', children.overflowYHidden ],
        'auto':  [ 'editor/lib/ofyauto_s.png', 'editor/lib/ofyauto.png', children.overflowYAuto ],
        'scroll':  [ 'editor/lib/ofyscroll_s.png', 'editor/lib/ofyscroll.png', children.overflowYScroll ]
    });

    function updateDoc() {
        var group = viewer.getGroup(),
            documentData = group.documentData,
            gridSize = limitRange(children.grid.getValue(), 2, 64, 8);
        group.doCommand(group.cmdSetComponentProperties(
            [limitRange(children.w.getText(), 1, 100000), limitRange(children.h.getText(), 1, 10000), 1],
            children.description.getText(),
            children.privateCheck.getChecked(),
            gridSize,
            children.privateStylesCheck.getChecked(),
            that.overflowX.getSelectedValue(),
            that.overflowY.getSelectedValue()
        ));
    }

    function updateControls() {
        var group = viewer.getGroup(),
            documentData = group.documentData;
        children.w.setText(documentData.dimensions[0]);
        children.h.setText(documentData.dimensions[1]);
        children.description.setText(documentData.description);
        children.privateCheck.setChecked(documentData.private === true);
        children.privateStylesCheck.setChecked(documentData.privateTheme === true);
        children.grid.setValue(documentData.gridSize);
        that.overflowX.setSelectedValue(documentData.overflowX);
        that.overflowY.setSelectedValue(documentData.overflowY);
    }

    children.w.on('change', updateDoc);
    children.h.on('change', updateDoc);
    children.description.on('change', updateDoc);
    children.privateCheck.on('change', updateDoc);
    children.privateStylesCheck.on('change', updateDoc);
    children.grid.on('change', updateDoc);
    viewer.on('updateSelectionControlBox', updateControls);
    this.overflowX.on('change', updateDoc);
    this.overflowY.on('change', updateDoc);
    updateControls();
};

exports.ComponentInfo = ComponentInfo;
