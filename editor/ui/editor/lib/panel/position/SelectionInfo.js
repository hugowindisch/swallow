/**
    SelectionInfo.js

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
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    limitRange = utils.limitRange,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    isNumber = utils.isNumber,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function SelectionInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.SelectionInfo);
}
SelectionInfo.prototype = new (domvisual.DOMElement)();
SelectionInfo.prototype.getConfigurationSheet = function () {
    return {  };
};
SelectionInfo.prototype.init = function (editor) {
    var viewer = editor.getViewer(),
        container = this.parent,
        children = this.children;

    function update(rect) {
        var rectDefined = Boolean(rect);
        children.x.enable(rectDefined);
        children.y.enable(rectDefined);
        children.w.enable(rectDefined);
        children.h.enable(rectDefined);

        if (rectDefined) {
            children.x.setText(rect[0][0].toFixed(1));
            children.y.setText(rect[0][1].toFixed(1));
            children.w.setText((rect[1][0] - rect[0][0]).toFixed(1));
            children.h.setText((rect[1][1] - rect[0][1]).toFixed(1));
        }
        if (viewer.getSelectionLength() === 1) {
            children.name.setText(viewer.getSelectedName());
            children.name.enable(true);
        } else {
            children.name.setText('');
            children.name.enable(false);
        }
    }
    function updateAll(rect) {
        // rect
        update(rect);
        // opacity
        var opacity = viewer.getSelectionOpacity();
        if (opacity === null) {
            children.opacitySlider.setValue(100);
            children.opacityInput.setValue('');
        } else {
            children.opacityInput.setValue(Math.round(opacity * 100));
            children.opacitySlider.setValue(opacity * 100);
        }
    }
    viewer.on('updateSelectionControlBox', updateAll);
    viewer.on('previewSelectionRect', update);

    function toNumber(s) {
        var n = Number(s);
        if (isNaN(n)) {
            n = 0;
        }
        return n;
    }
    function selectionBoxChanged() {
        var x = limitRange(children.x.getText(), -10000, 10000),
            y = limitRange(children.y.getText(), -10000, 10000),
            w = limitRange(children.w.getText(), -10000, 10000),
            h = limitRange(children.h.getText(), -10000, 10000),
            selRect = viewer.getSelectionRect(),
            transform = mat4.identity(),
            selection = viewer.getSelection(),
            group = viewer.getGroup(),
            cg;

        mat4.translate(transform, [x, y, 0]);
        mat4.scale(transform, [w / (selRect[1][0] - selRect[0][0]), h / (selRect[1][1] - selRect[0][1]), 1]);
        mat4.translate(transform, [-selRect[0][0], -selRect[0][1], 0]);

        cg = group.cmdCommandGroup('transform', 'Transform a group');
        // transform the whole selection
        forEachProperty(selection, function (sel, name) {
            cg.add(group.cmdTransformPosition(name, transform));
        });
        group.doCommand(cg);

    }
    children.x.on('change', selectionBoxChanged);
    children.y.on('change', selectionBoxChanged);
    children.w.on('change', selectionBoxChanged);
    children.h.on('change', selectionBoxChanged);
    children.name.on('change', function () {
        var txt = this.getText(),
            group = viewer.getGroup(),
            documentData = group.documentData,
            selName = viewer.getSelectedName(),
            cg;

        if (txt !== selName) {
            if (documentData.positions[txt] === undefined && documentData.children[txt] === undefined) {
                if (txt.length > 0) {
                    cg = group.cmdCommandGroup('rename', 'Rename a group', { from: selName, to: txt });
                    cg.add(group.cmdRenamePosition(selName, txt));
                    if (documentData.children[selName]) {
                        cg.add(group.cmdRenameVisual(selName, txt));
                    }
                    group.doCommand(cg);
                } else {
                    alert('empty name ' + txt);
                }

            } else {
                alert('name already taken ' + txt);
            }
        }
        this.getText();
    });
    children.opacitySlider.on('change', function (v, sliding) {
        children.opacityInput.setValue(Math.round(v));
        if (sliding) {
            viewer.previewSelectionOpacity(v / 100);
        } else {
            viewer.setSelectionOpacity(v / 100);
        }
    });
    children.opacityInput.on('change', function () {
        var opacity = limitRange(children.opacityInput.getValue(), 0, 100);
        children.opacitySlider.setValue(opacity);
        viewer.setSelectionOpacity(opacity / 100);

    });
    update(null);
};

exports.SelectionInfo = SelectionInfo;
