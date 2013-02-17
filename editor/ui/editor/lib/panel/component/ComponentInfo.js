/**
    ComponentInfo.js

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
"use strict";
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    utils = require('utils'),
    http = require('http'),
    limitRange = utils.limitRange,
    ImageOption = require('../ImageOption').ImageOption;

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

    function loadImageUrls() {
        var docInfo = editor.getDocInfo(),
            data = '';
        http.get(
            '/swallow/package/' + docInfo.factory + '/image',
            function (res) {
                res.on('data', function (d) {
                    data += d;
                });
                res.on('end', function () {
                    var jsonData = JSON.parse(data);
                    that.getChild('icon').setUrls(jsonData);
                });
            }
        );
    }

    function updateDoc() {
        var group = viewer.getGroup(),
            documentData = group.documentData,
            gridSize = limitRange(children.grid.getValue(), 2, 64, 8);
        group.doCommand(group.cmdSetComponentProperties(
            [limitRange(children.w.getText(), 1, 100000), limitRange(children.h.getText(), 1, 10000), 1],
            children.description.getText(),
            gridSize,
            children.title.getValue(),
            children.keywords.getValue(),
            children.icon.getValue(),
            children.hResizeCheck.getValue(),
            children.vResizeCheck.getValue()
        ));
    }

    function updateControls() {
        var group = viewer.getGroup(),
            documentData;
        if (group) {
            documentData = group.documentData;
            children.w.setText(documentData.dimensions[0]);
            children.h.setText(documentData.dimensions[1]);
            children.description.setText(documentData.description);
            children.grid.setValue(documentData.gridSize);
            children.title.setValue(documentData.title);
            children.keywords.setValue(documentData.keywords);
            children.icon.setValue(documentData.icon);
            children.hResizeCheck.setValue(documentData.hResize);
            children.vResizeCheck.setValue(documentData.vResize);
            loadImageUrls();
        }
    }

    children.w.on('change', updateDoc);
    children.h.on('change', updateDoc);
    children.description.on('change', updateDoc);
    children.grid.on('change', updateDoc);
    viewer.on('updateSelectionControlBox', updateControls);
    children.title.on('change', updateDoc);
    children.keywords.on('change', updateDoc);
    children.icon.on('change', updateDoc);
    children.hResizeCheck.on('change', updateDoc);
    children.vResizeCheck.on('change', updateDoc);
    updateControls();
};

exports.ComponentInfo = ComponentInfo;
