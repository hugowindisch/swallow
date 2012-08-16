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
    vec3 = glmatrix.vec3,
    pi = Math.PI,
    atan = Math.atan;

/*
function getYAngle(m) {
    var z = m[8],
        x = m[0],
        ret;
    if (x !== 0) {
        ret = atan (z/x);
    } else if (z !== 0) {
        ret = atan (pi / 2) - ( x / z )

    } else {
        ret = 0;
    }
    return ret * 180 / pi;
}

function getXAngle(m) {
    var z = m[9],
        y = m[5],
        ret;
    if (x !== 0) {
        ret = atan(z / y);
    } else if (z !== 0) {
        ret = atan(pi / 2) - ( y / z )

    } else {
        ret = 0;
    }
    return ret * 180 /pi;
}*/


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
        children.opacitySlider.setVisible(rectDefined);
        children.opacityInput.enable(rectDefined);

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
    function rotationMatrix(angle, vector) {
        var transform = mat4.identity(),
            r = viewer.getSelectionRect(),
            mid = [
                (r[0][0] + r[1][0]) / 2,
                (r[0][1] + r[1][1]) / 2,
                (r[0][2] + r[1][2]) / 2
            ];
        mat4.translate(transform, mid);
        mat4.rotate(transform, pi * angle / 180, vector);
        mat4.translate(transform, [-mid[0], -mid[1], -mid[2]]);
        return transform;
    }

    function xRotationMatrix(angle) {
        return rotationMatrix(angle, [1, 0, 0]);
    }
    function yRotationMatrix(angle) {
        return rotationMatrix(angle, [0, 1, 0]);
    }

    children.xRotation.on('change', function (angle) {
        viewer.transformSelection(xRotationMatrix(angle));
    });
    children.xRotation.on('preview', function (angle) {
        viewer.previewSelectionTransformation(xRotationMatrix(angle));
    });

    children.yRotation.on('change', function (angle) {
        viewer.transformSelection(yRotationMatrix(angle));
    });
    children.yRotation.on('preview', function (angle) {
        viewer.previewSelectionTransformation(yRotationMatrix(angle));
    });

    update(null);
};

exports.SelectionInfo = SelectionInfo;
