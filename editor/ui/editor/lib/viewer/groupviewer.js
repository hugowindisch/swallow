/**
    groupviewer.js

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
/*globals FormData */
"use strict";
var visual = require('visual'),
    domvisual = require('domvisual'),
    getEnclosingRect = visual.getEnclosingRect,
    rectToMatrix = visual.rectToMatrix,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    selectionbox = require('./selectionbox'),
    LayoutAnchors = require('./LayoutAnchors').LayoutAnchors,
    RotationBox = require('./RotationBox').RotationBox,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    deepCopy = utils.deepCopy,
    groups = require('/editor/lib/definition').definition.groups,
    vec3 = glmatrix.vec3,
    mat4 = glmatrix.mat4,
    EmptyPosition = require('./EmptyPosition').EmptyPosition,
    convertScaleToSize = visual.convertScaleToSize,
    DependencyManager = require('depmanager').DependencyManager,
    apply = utils.apply;

/**
    Useful functions for dealing with selections.
*/
function unionRect(r1, r2) {
    var min = Math.min, max = Math.max,
        r1min = r1[0], r2min = r2[0],
        r1max = r1[1], r2max = r2[1];
    return [
        [min(r1min[0], r2min[0]), min(r1min[1], r2min[1]), min(r1min[2], r2min[2])],
        [max(r1max[0], r2max[0]), max(r1max[1], r2max[1]), max(r1max[2], r2max[2])]
    ];
}

function intersects(r1, r2) {
    var r1min = r1[0], r2min = r2[0],
        r1max = r1[1], r2max = r2[1];
    return (r1min[0] <= r2max[0] && r1max[0] >= r2min[0]) &&
        (r1min[1] <= r2max[1] && r1max[1] >= r2min[1]); // &&
        //(r1min[2] <= r2max[2] && r1max[2] >= r2min[2]);
}

function encloses(r1, r2) {
    var r1min = r1[0], r2min = r2[0],
        r1max = r1[1], r2max = r2[1];
    return (r1min[0] <= r2min[0] && r1max[0] >= r2max[0]) &&
        (r1min[1] <= r2min[1] && r1max[1] >= r2max[1]); // &&
        //(r1min[2] <= r2min[2] && r1max[2] >= r2max[2]);
}

function GroupViewer(config) {
    var that = this;
    // create the dependency manager
    this.dependencyManager = new DependencyManager();
    this.dependencyManager.loadVisualList();
    this.dependencyManager.on('change', function (visualList, packages, typeInfo) {
        var group = that.group;
        that.dependencyManagerLoaded = true;
        if (group && group.docInfo && (!typeInfo || group.docInfo.factory !== typeInfo.factory || group.docInfo.type !== typeInfo.type)) {
            that.fullRedraw();
        }
    });

    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.GroupViewer);
    // empty box by default
    this.defaultVisual = null;
    // maybe this will be part of the config
    this.setStyle('background');
    this.setOverflow('scroll');
    // border around the group in pixels (when not scaled)
    this.groupBorderPix = 1000;
    this.showGrid = true;
    this.showAnchors = true;
    this.selection = {};

    // thse are the possible modes of the selection control box (should be called selection transformation box)
    // setup the selection control box
    this.selectionScalingUI = new (selectionbox.SelectionBox)({});
    this.children.decorations.addChild(this.selectionScalingUI, 'selectionScalingUI');
    // setup the rotation box
    this.selectionRotationUI = new RotationBox();
    this.children.decorations.addChild(this.selectionRotationUI, 'selectionRotationUI');
    // to these are the possible choices
    this.selectionControlBoxModes = [
        this.selectionScalingUI,
        this.selectionRotationUI
    ];
    this.selectionControlBox = this.selectionControlBoxModes[0];
    this.selectionRotationUI.setVisible(false);
    this.selectionControlBox.setVisible(false);

    // layout anchors
    this.layoutAnchors = new (LayoutAnchors)({});
    this.children.decorations.addChild(this.layoutAnchors, 'layoutAnchors');
    // add handlers for the selectionScalingUI
    this.selectionRotationUI.transformContentMatrix =
        this.selectionScalingUI.transformContentMatrix = function (matrix) {
            return mat4.multiply(that.zoomMat, matrix, mat4.create());
        };
    this.selectionScalingUI.getSnappedTransform = function (delta, constrain, rect) {
        return that.getSnappedTransform(delta, constrain, rect);
    };

    this.selectionRotationUI.getFDM =
        this.selectionScalingUI.getFDM = function () {
            return that.children.visuals.getFullDisplayMatrix(true);
        };
    this.selectionRotationUI.snapPositionToGrid =
        this.selectionScalingUI.snapPositionToGrid = function (pos) {
            return that.snapPositionToGrid(pos);
        };
    this.selectionRotationUI.getSnappedTransform = function (delta, constrain, rect) {
        return that.getSnappedTransform(delta, constrain, rect);
    };

    // transform handlers
    function transformHandler(transform) {
        that.transformSelection(transform);
    }
    this.selectionScalingUI.on('transform', transformHandler);
    this.selectionRotationUI.on('transform', transformHandler);
    // preview handlers
    function previewHandler(transform) {
        that.previewSelectionTransformation(transform);
    }
    this.selectionScalingUI.on('preview', previewHandler);
    this.selectionScalingUI.on('toggle', function () {
        that.toggleSelectionControlBoxMode();
    });
    this.selectionRotationUI.on('preview', previewHandler);
    this.selectionRotationUI.on('toggle', function () {
        that.toggleSelectionControlBoxMode();
    });
    // anchor handlers
    this.layoutAnchors.on('anchor', function (anchor) {
        var group = that.group,
            cg = that.group.cmdCommandGroup('anchor', 'Anchor a group');
        // transform the whole selection
        forEachProperty(that.selection, function (sel, name) {
            cg.add(group.cmdSetPositionSnapping(name, anchor));
        });
        group.doCommand(cg);
    });
    this.children.grid.setVisible(false);
}
GroupViewer.prototype = new (domvisual.DOMElement)();

GroupViewer.prototype.theme = new (visual.Theme)({
    background: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'windowDarkerForeground' }
        ]
    },
    page: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'windowForeground' }
        ]
    }
});

/**
    Set the dependency manager.
*/
GroupViewer.prototype.getDependencyManager = function () {
    return this.dependencyManager;
};

/**
    Toogle from the scale box to the rotation box, to whatever box we may
    add.
*/
GroupViewer.prototype.toggleSelectionControlBoxMode = function () {
    var modes = this.selectionControlBoxModes,
        visible = this.selectionControlBox.getVisible(),
        l = modes.length,
        that = this,
        mode = this.selectionControlBox,
        found;
    forEach(modes, function (m, n) {
        if (m === mode) {
            found = n;
        }
    });
    if (found === undefined || found === (l - 1)) {
        found = 0;
    } else {
        found += 1;
    }
    this.selectionControlBox.setVisible(false);
    this.selectionControlBox = this.selectionControlBoxModes[found];
    this.selectionControlBox.setVisible(visible);
};

GroupViewer.prototype.resetSelectionControlBoxMode = function (mode) {
    if (this.selectionControlBox !== this.selectionControlBoxModes[0]) {
        var visible = this.selectionControlBox.getVisible();
        this.selectionControlBox.setVisible(false);
        this.selectionControlBox = this.selectionControlBoxModes[0];
        this.selectionControlBox.setVisible(visible);
    }

};


GroupViewer.prototype.setShowGrid = function (show) {
    if (this.showGrid !== show) {
        this.showGrid = show;
        this.adjustZoomToGridSize();
    }
};
GroupViewer.prototype.getShowGrid = function () {
    return this.showGrid;
};
GroupViewer.prototype.setShowAnchors = function (show) {
    if (this.showAnchors !== show) {
        this.showAnchors = show;
        this.adjustZoomToGridSize();
    }
};
GroupViewer.prototype.getShowAnchors = function () {
    return this.showAnchors;
};
GroupViewer.prototype.getShowOutlines = function () {
    return this.showOutlines;
};
GroupViewer.prototype.setShowOutlines = function (show) {
    if (this.showOutlines !== show) {
        this.showOutlines = show;
        this.adjustZoomToGridSize();
    }
};

/**
    Shows / hides the selection control box.
*/
GroupViewer.prototype.showSelectionControlBox = function (visible) {
    var selectionControlBox = this.selectionControlBox,
        ret = selectionControlBox.getVisible();
    selectionControlBox.setVisible(visible);
    return ret;
};

/**
    Shows / hides layout anchors
*/
GroupViewer.prototype.showLayoutAnchors = function (visible) {
    var layoutAnchors = this.layoutAnchors,
        ret = layoutAnchors.getVisible();
    layoutAnchors.setVisible(visible);
    return ret;
};
/**
    Enables or disables box selection.
        The provided callbacks will be called on selection Start, selection,
        and selection end.
*/
GroupViewer.prototype.enableBoxSelection = function (
    selectionStart,
    selection,
    selectionEnd,
    useGrid
) {
    var that = this,
        decorations = this.children.decorations,
        visuals = this.children.visuals,
        mouseBox,
        startpos,
        endpos,
        matrix,
        nmatrix,
        prevCursor,
        mouseDown,
        showMouseBox = true;

    function twoPositionsToMatrix(pos1, pos2) {
        var mat = glmatrix.mat4.identity();
        mat4.translate(mat, pos1);
        mat4.scale(mat, vec3.subtract(pos2, pos1, vec3.create()));
        return mat;
    }
    function twoPositionsToNormalizedMatrix(pos1, pos2) {
        var v1 = vec3.create(),
            v2 = vec3.create(),
            p1,
            p2,
            i;
        for (i = 0; i < 3; i += 1) {
            p1 = pos1[i];
            p2 = pos2[i];
            if (p1 < p2) {
                v1[i] = p1;
                v2[i] = p2;
            } else {
                v1[i] = p2;
                v2[i] = p1;
            }
        }
        return twoPositionsToMatrix(v1, v2);
    }
    function applyGrid(pos) {
        if (useGrid) {
            pos = that.snapPositionToGrid(pos);
        }
        return pos;
    }

    // resets box selection
    if (this.resetBoxSelection) {
        this.resetBoxSelection();
        delete this.resetBoxSelection;
    }
    function updateMouseBox(nmatrix) {
        if (showMouseBox) {
            var zoomMat = that.zoomMat,
                res = convertScaleToSize(mat4.multiply(zoomMat, nmatrix, mat4.create()));
            if (!mouseBox) {
                mouseBox = new (domvisual.DOMElement)({ "class": "editor_GroupViewer_mouseBox"});
                decorations.addChild(mouseBox, 'mouseBox');
            }
            mouseBox.setDimensions(res.dimensions);
            mouseBox.setMatrix(res.matrix);
        }
    }
    function removeMouseBox() {
        if (mouseBox) {
            decorations.removeChild(mouseBox);
            mouseBox = null;
        }
    }
    // we want to add mouse events to the decoration child
    function mouseMove(evt) {
        evt.preventDefault();
        var mat = visuals.getFullDisplayMatrix(true);
        endpos = applyGrid(glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 0]));
        matrix = twoPositionsToMatrix(startpos, endpos);
        nmatrix = twoPositionsToNormalizedMatrix(startpos, endpos);
        updateMouseBox(nmatrix);
        if (selection) {
            selection(matrix, nmatrix, startpos, endpos, evt);
        }
    }
    function mouseUp(evt) {
        evt.preventDefault();
        decorations.removeListener('mousemovec', mouseMove);
        removeMouseBox();
        that.setCursor(prevCursor);
        if (selectionEnd) {
            selectionEnd(matrix, nmatrix, startpos, endpos, evt);
        }
    }
    mouseDown = function (evt) {
        evt.preventDefault();
        var mat = visuals.getFullDisplayMatrix(true),
            evtPos = [evt.pageX, evt.pageY, 0];

        this.blurFocusedElement();
        prevCursor = that.setCursor('crosshair');
        startpos = applyGrid(glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 0]));
        endpos = startpos;
        decorations.on('mousemovec', mouseMove);
        decorations.once('mouseupc', mouseUp);
        matrix = twoPositionsToMatrix(startpos, endpos);
        nmatrix = twoPositionsToNormalizedMatrix(startpos, endpos);
        if (selectionStart) {
            showMouseBox = selectionStart(matrix, nmatrix, startpos, endpos, evt);
        }
        updateMouseBox(nmatrix);
    };

    // setup box selection
    if (selectionStart || selection || selectionEnd) {
        decorations.on('mousedown', mouseDown);
        this.resetBoxSelection = function () {
            decorations.removeListener('mousedown', mouseDown);
        };
    }
};

/**
    Sets a cursor
*/
GroupViewer.prototype.setCursor = function (c) {
    var prev = this.decorationCursor;
    this.decorationCursor = c;
    this.getChild('decorations').setCursor(c);
    return prev;
};

/**
    Previews a transoformation of the selection.
*/
GroupViewer.prototype.previewSelectionTransformation = function (transform) {
    var documentData = this.documentData,
        children = this.children,
        visuals = children.visuals.children || {},
        outlines = children.outlines.children || {},
        zoomMat = this.zoomMat,
        selRect,
        ipe;
    forEachProperty(this.selection, function (s, n) {
        var vis = visuals[n],
            ol = outlines[n],
            pos,
            res,
            newpos = {},
            ch = documentData.children[n];
        pos = documentData.positions[n];
        if (pos) {
            // graphic element
            if (vis || ol) {
                newpos.type = pos.type;
                newpos.snapping = pos.snapping;
                newpos.matrix = mat4.multiply(transform, pos.matrix, mat4.create());
                if (vis) {
                    vis.setPosition(new (visual.Position)(newpos.matrix, newpos.snapping, newpos.opacity));
                }
                if (ol) {
                    ol.setPosition(new (visual.Position)(newpos.matrix, newpos.snapping, newpos.opacity));
                }
            }
        }
    });
    this.showLayoutAnchors(false);
    // hide the inplace editor
    this.previewTransformInplaceEdit(transform);

    // update previews
    this.emit('previewSelectionRect', this.getSelectionRect(transform));

};

/**
    Returns the currently edited group.
*/
GroupViewer.prototype.getGroup = function () {
    return this.group;
};

/**
    Returns a zoom in matrix to a given point.
*/
GroupViewer.prototype.getZoomInMatrix = function (position) {
    var zoomStack = this.zoomStack,
        l = zoomStack.length,
        topZoom = zoomStack[l - 1],
        z = topZoom[0],
        dimensions = this.dimensions,
        z2 = z * 2,
        zd = [
            dimensions[0] / z2,
            dimensions[1] / z2,
            dimensions[2]
        ],
        m = mat4.create(topZoom);
    m[0] = zd[0];
    m[5] = zd[1];
    m[10] = zd[2];
    m[12] = position[0] - zd[0] / 2;
    m[13] = position[1] - zd[1] / 2;
    m[14] = position[2];
    return m;
};

/**
    Resets the scroll.
*/
GroupViewer.prototype.resetScroll = function () {
    var zoomMat = this.zoomStack[this.zoomStack.length - 1],
        zoomTranslate = [zoomMat[12], zoomMat[13], zoomMat[14]];
    this.setScroll(zoomTranslate);
};

/**
    Pushes a given zoom matrix.
*/
GroupViewer.prototype.pushZoomMatrix = function (mat) {
    var zs = this.zoomStack,
        z = mat[0],
        popped = false,
        scroll,
        topm;
    while (zs.length > 0 && zs[zs.length - 1][0] > z) {
        zs.pop();
        popped = true;
    }
    // keep the current scroll
    if (!popped) {
        topm = zs[zs.length - 1];
        scroll = this.getScroll();
        topm[12] = scroll[0];
        topm[13] = scroll[1];
    }
    this.zoomStack.push(mat);
    this.adjustZoomToGridSize();
};

/**
    Zoom to a given position (described by a matrix, in model coordinates)
*/
GroupViewer.prototype.pushZoom = function (matrix) {
    // if the matrix is too small
    if (!matrix || (matrix[0] < 10 || matrix[5] < 10)) {
        matrix = this.getZoomInMatrix([matrix[12], matrix[13], matrix[14]]);
    }
    var documentData = this.documentData,
        borderPix = this.groupBorderPix,
        z = this.dimensions[0] / matrix[0],
        zy = this.dimensions[1] / matrix[5],
        mat = mat4.create(matrix);

    mat[12] += borderPix;
    mat[13] += borderPix;

    // we want uniform scaling
    if (z > zy) {
        z = zy;
    }
    mat[0] = z;
    mat[5] = z;
    mat[10] = z;
    mat[12] *= z;
    mat[13] *= z;
    mat[14] *= z;
    // push the matrix
    this.pushZoomMatrix(mat);
};

/**
    Zoom to page.
*/
GroupViewer.prototype.zoomToPage = function () {
    var mat = mat4.scale(mat4.identity(), this.documentData.dimensions);
    this.pushZoom(mat);
};

/**
    Zoom to content.
*/
GroupViewer.prototype.zoomToContent = function () {
    var documentData = this.documentData,
        children = documentData.children,
        positions = documentData.positions,
        unionr;
    forEachProperty(positions, function (pos) {
        var r = getEnclosingRect(pos.matrix);
        if (!unionr) {
            unionr = r;
        } else {
            unionr = unionRect(r, unionr);
        }
    });
    if (unionr) {
        this.pushZoom(rectToMatrix(unionr));
    } else {
        this.zoomToPage();
    }
};

/**
    Zoom to real size (100%)
*/
GroupViewer.prototype.zoom100 = function () {
    var borderPix = this.groupBorderPix;
    // push the matrix
    this.pushZoomMatrix(
        mat4.translate(mat4.identity(), [borderPix - 20, borderPix - 20, 0], mat4.create())
    );
};

/**
    Zoom in.
*/
GroupViewer.prototype.zoomIn = function () {
    var scaling = 2,
        scroll = this.getScroll(),
        dim = this.dimensions,
        borderPix = this.groupBorderPix,
        zoomMat = this.zoomStack[this.zoomStack.length - 1],
        z = zoomMat[0],
        mat = mat4.identity();

    mat[0] = z * scaling;
    mat[5] = z * scaling;
    mat[10] = z * scaling;
    mat[12] = scaling * (scroll[0] + dim[0] / 2 - dim[0] / (scaling * 2));
    mat[13] = scaling * (scroll[1] + dim[1] / 2 - dim[1] / (scaling * 2));
    mat[14] = 0;

    this.pushZoomMatrix(mat);
};

/**
    Adjust the zoom to the current grid.
*/
GroupViewer.prototype.adjustZoomToGridSize = GroupViewer.prototype.fullRedraw = function () {
    if (this.group && this.dependencyManagerLoaded) {
        var gridSize = this.group.documentData.gridSize,
            zoomStack = this.zoomStack,
            zoom = zoomStack[zoomStack.length - 1],
            z = Math.round(zoom[0] * gridSize) / gridSize;

        zoom[0] = z;
        zoom[5] = z;
        zoom[10] = z;
        this.updateAll();
        this.resetScroll();
        this.regenerateGrid();
    }
};

/**
    Pops the zoom.
*/
GroupViewer.prototype.popZoom = function () {
    if (this.zoomStack.length > 1) {
        this.zoomStack.pop();
        this.updateAll();
        this.resetScroll();
        this.regenerateGrid();
    }
};

/**
    Regenerates the grid.
*/
GroupViewer.prototype.regenerateGrid = function () {
    var gridSize,
        gridOffset,
        zoomMat,
        zv,
        gridDim,
        gridOffs,
        showGrid = this.showGrid,
        children = this.children,
        grid = children.grid,
        ctx;

    // show the grid
    if (showGrid) {
        gridSize = this.group.documentData.gridSize;
        gridOffset = this.groupBorderPix % gridSize;
        zoomMat = this.zoomMat;
        zv = [zoomMat[0], zoomMat[5], zoomMat[10]];
        gridDim = [gridSize * zv[0], gridSize * zv[1], 0];
        gridOffs = [gridOffset * zv[0], gridOffset * zv[1], 0];
        // skip some grid spots if the grid is too dense
        while (gridDim[0] < 8) {
            gridDim[0] *= 2;
            gridDim[1] *= 2;
        }
        grid.setWidth(gridDim[0]);
        grid.setHeight(gridDim[1]);

        ctx = grid.getContext2D();
        ctx.fillStyle = 'rgb(150,150,150)';
        ctx.fillRect(gridOffs[0], gridOffs[1], 1, 1);
        //ctx.fillRect(1,1,2,2);
        children.decorations.setStyleAttributes({
            backgroundImage: grid.toDataURL(),
            backgroundRepeat: { repeat: [ 'repeat', 'repeat' ] }
        });
    } else {
        children.decorations.setStyleAttributes({
            backgroundImage: null,
            backgroundRepeat: null
        });
    }
};

/**
    Snaps to grid.
*/
GroupViewer.prototype.snapPositionToGrid = function (position) {
    var ret = vec3.create(position),
        gridSize;
    // if we use the grid
    if (this.showGrid) {
        gridSize = this.group.documentData.gridSize;
        ret[0] = Math.round(ret[0] / gridSize) * gridSize;
        ret[1] = Math.round(ret[1] / gridSize) * gridSize;
    }
    return ret;
};

/**
    Snaps a selection rect to a grid with a translation (xl).
*/
GroupViewer.prototype.getSnappedTransform = function (xl, constrain, selectionRect) {
    var translate = vec3.create(xl),
        abs = Math.abs,
        min = Math.min,
        srt = [
            vec3.add(selectionRect[0], translate, vec3.create()),
            vec3.add(selectionRect[1], translate, vec3.create())
        ],
        srSnapped = [
            this.snapPositionToGrid(vec3.create(srt[0])),
            this.snapPositionToGrid(vec3.create(srt[1]))
        ],
        d1,
        d2,
        i;
    // grids (snapping)
    for (i = 0; i < 2; i += 1) {
        d1 = srt[0][i] - srSnapped[0][i];
        d2 = srt[1][i] - srSnapped[1][i];
        if (abs(d1) <= abs(d2)) {
            translate[i] -= d1;
        } else {
            translate[i] -= d2;
        }
    }

    // constrains
    if (constrain) {
        if (abs(translate[0]) > abs(translate[1])) {
            translate[1] = 0;
        } else {
            translate[0] = 0;
        }
    }
    return mat4.translate(
        mat4.identity(),
        translate
    );
};


/**
    Checks if there is an item under the mouse.
*/
GroupViewer.prototype.itemAtPosition = function (position, subset) {
    var documentData = this.documentData,
        children = documentData.children,
        positions = documentData.positions,
        rp = [position, position],
        retOrder = 0,
        ret = null;
    subset = subset || positions;
    forEachProperty(subset, function (it, name) {
        if (it.enableSelect !== false && it.enableDisplay !== false) {
            var r = getEnclosingRect(it.matrix);
            if (intersects(r, rp)) {
                if (ret === null || it.order > retOrder) {
                    ret = name;
                    retOrder = it.order;
                }
            }
        }
    });
    return ret;
};

/**
    Checks if there is a selected item under the mouse.
*/
GroupViewer.prototype.itemAtPositionIsSelected = function (position) {
    var it = this.itemAtPosition(position);
    return this.selection[it] !== undefined;
};

/**
    Selection.
*/
GroupViewer.prototype.selectByMatrix = function (matrix, toggle, byContact, clearSelection) {
    var documentData = this.documentData,
        selectionChanged = false,
        selrect,
        sel,
        selp,
        selfcn = byContact === true ? intersects : encloses,
        positions = documentData.positions,
        selection = this.selection;

    if (clearSelection) {
        this.selection = selection = {};
        selectionChanged = true;
    }
    function select(name) {
        if (toggle && selection[name]) {
            delete selection[name];
        } else {
            selection[name] = positions[name];
        }
        selectionChanged = true;
    }
    // select a point
    if (matrix[0] === 0 && matrix[5] === 0 && matrix[10] === 0) {
        sel = this.itemAtPosition([matrix[12], matrix[13], matrix[14]]);

        if (sel) {
            selp = positions[sel];
            if (selp.enableSelect !== false && selp.enableDisplay !== false) {
                select(sel);
            }
        }
    } else {
        selrect = getEnclosingRect(matrix);
        forEachProperty(positions, function (c, name) {
            if (c.enableSelect !== false && c.enableDisplay !== false) {
                var r = getEnclosingRect(c.matrix);
                if (selfcn(selrect, r)) {
                    select(name);
                }
            }
        });
    }
    // notify that the selection changed
    if (selectionChanged) {
        this.emit('selectionChanged');
    }
};

/**
    Add a given position to the selection.
*/
GroupViewer.prototype.addToSelection = function (name, clearSelection, skipNotify) {
    var sel = this.documentData.positions[name],
        changed = false;
    if (clearSelection) {
        this.selection = {};
        changed = true;
    }
    if (sel && !this.selection[name]) {
        this.selection[name] = sel;
        changed = true;
    }
    if (changed && !skipNotify) {
        this.emit('selectionChanged');
    }
};
GroupViewer.prototype.removeFromSelection = function (name, clearSelection, skipNotify) {
    var changed = false;
    if (clearSelection) {
        this.selection = {};
        changed = true;
    }
    if (this.selection[name]) {
        delete this.selection[name];
        changed = true;
    }
    if (changed && !skipNotify) {
        this.emit('selectionChanged');
    }

};
GroupViewer.prototype.clearSelection = function (name, skipNotify) {
    this.selection = {};
    if (!skipNotify) {
        this.emit('selectionChanged');
    }
};
GroupViewer.prototype.getSelection = function () {
    return this.selection;
};

/**
    Remove stuff that does not exist from the selection.
*/
GroupViewer.prototype.purgeSelection = function (notify) {
    var positions = this.documentData.positions,
        selection = {},
        posn;
    forEachProperty(this.selection, function (p, n) {
        posn = positions[n];
        if (posn && posn.enableSelect !== false && posn.enableDisplay !== false) {
            selection[n] = p;
        }
    });
    this.selection = selection;
    if (notify) {
        this.emit('selectionChanged');
    }
};

/**
    Checks whether a position is selected.
*/
GroupViewer.prototype.positionIsSelected = function (name) {
    return this.selection[name] !== undefined;
};

GroupViewer.prototype.getSelectionLength = function () {
    var n = 0;
    forEachProperty(this.selection, function () {
        n += 1;
    });
    return n;
};

GroupViewer.prototype.selectionIsEmpty = function () {
    return this.getSelectionLength() === 0;
};
// returns a single selected item (useful when the selection length is 1)
GroupViewer.prototype.getSelectedName = function () {
    var ret;
    forEachProperty(this.selection, function (p, n) {
        ret = n;
    });
    return ret;
};
GroupViewer.prototype.getSelectedPosition = function () {
    var documentData = this.documentData;
    return documentData.positions[this.getSelectedName()];
};

GroupViewer.prototype.getSelectionRect = function (optionalTransform) {
    var unionr;
    optionalTransform = optionalTransform || mat4.identity();
    // compute the graphic size of the selection
    forEachProperty(this.selection, function (box, name) {
        var matrix = mat4.multiply(optionalTransform, box.matrix, mat4.create()),
            r = getEnclosingRect(matrix);
        if (!unionr) {
            unionr = r;
        } else {
            unionr = unionRect(r, unionr);
        }
    });
    return unionr;
};
GroupViewer.prototype.getSelectionAnchoring = function () {
    var anchoring = {};
    forEachProperty(this.selection, function (box, name) {
        var snapping = box.snapping;
        forEachProperty(snapping, function (a, an) {
            if (anchoring[an]) {
                if (anchoring[an] !== a) {
                    anchoring[an] = 'unknown';
                }
            } else {
                anchoring[an] = a;
            }
        });
    });
    return anchoring;
};
GroupViewer.prototype.getSelectionTypeInfo = function () {
    var children = this.documentData.children,
        typeInfo;
    forEachProperty(this.selection, function (box, name) {
        var ch = children[name];
        if (ch) {
            if (typeInfo === undefined) {
                typeInfo = {
                    factory: ch.factory,
                    type: ch.type
                };
            } else if (typeInfo !== null) {
                if (typeInfo.factory !== ch.factory || typeInfo.type !== ch.type) {
                    typeInfo = null;
                }
            }
        } else {
            typeInfo = null;
        }
    });
    // no typeinfo: return null
    if (typeInfo === undefined) {
        typeInfo = null;
    }
    return typeInfo;
};
GroupViewer.prototype.getSelectionOpacity = function () {
    var opacity;
    forEachProperty(this.selection, function (box, name) {
        var op = box.opacity;
        if (op === undefined || op === null) {
            op = 1;
        }
        if (opacity === undefined) {
            opacity = op;
        } else if (opacity !== op) {
            opacity = null;
        }
    });
    if (opacity === undefined) {
        opacity = null;
    }
    return opacity;
};
GroupViewer.prototype.setSelectionOpacity = function (opacity) {
    var group = this.group,
        cg = group.cmdCommandGroup('setSelectionOpacity', 'Change Opacity');
    // transform the whole selection
    forEachProperty(this.selection, function (sel, name) {
        cg.add(group.cmdSetPositionOpacity(name, opacity));
    });
    group.doCommand(cg);
};
GroupViewer.prototype.previewSelectionOpacity = function (opacity) {
    var children = this.children,
        visuals = children.visuals.children || {};
    forEachProperty(this.selection, function (sel, name) {
        var vis = visuals[name];
        if (vis) {
            vis.setOpacity(opacity);
        }
    });
};
GroupViewer.prototype.transformSelection = function (transform) {
    var group = this.group,
        cg = this.group.cmdCommandGroup('transform', 'Transform a group'),
        ipe;
    // transform the whole selection
    forEachProperty(this.selection, function (sel, name) {
        cg.add(group.cmdTransformPosition(name, transform));
    });
    group.doCommand(cg);
};
/**
    This will gather a config object will all similarily defined
    value from the selection.
*/
GroupViewer.prototype.getSelectionConfig = function () {
    var config = {},
        configDirty = {},
        ch = this.documentData.children;
    forEachProperty(this.selection, function (pos, name) {
        var c = ch[name];
        if (c) {
            forEachProperty(c.config, function (confV, confN) {
                var dirty = configDirty[confN];
                if (dirty && config[confN] !== confV) {
                    delete config[confN];
                } else if (!dirty) {
                    config[confN] = confV;
                    configDirty[confN] = true;
                }
            });
        }
    });
    return config;
};
/**
    This will update the selection with a given config.
*/
GroupViewer.prototype.setSelectionConfig = function (config) {
    var group = this.group,
        cg = group.cmdCommandGroup('setSelectionConfig', 'Change Config'),
        ch = this.documentData.children;
    forEachProperty(this.selection, function (pos, name) {
        var c = ch[name];
        if (c) {
            cg.add(group.cmdSetVisualConfig(name, apply({ position: c.config.position }, config)));
        }
    });
    group.doCommand(cg);
};
/**
    This will preview a new config
*/
GroupViewer.prototype.previewSelectionConfig = function (config) {
    var visuals = this.getChild('visuals');
    forEachProperty(this.selection, function (pos, name) {
        var c = visuals.getChild(name);
        if (c) {
            c.setConfiguration(config);
        }
    });
};

/**
    Flag selected children to be only for preview in the editor.
*/
GroupViewer.prototype.getSelectionOnlyInEditor = function () {
    var ret = null,
        group = this.group,
        ch = this.documentData.children;
    forEachProperty(this.selection, function (pos, name) {
        var c = ch[name],
            onlyInEditor;
        if (c) {
            onlyInEditor = Boolean(c.onlyInEditor);
            if (ret === null) {
                ret = onlyInEditor;
            } else if (ret !== onlyInEditor) {
                ret = null;
                return true;
            }
        }
    });
    return ret;
};
GroupViewer.prototype.setSelectionOnlyInEditor = function (onlyInEditor) {
    var group = this.group,
        cg = group.cmdCommandGroup('setSelectionOnlyInEditor', 'Change OnlyInEditor flag'),
        ch = this.documentData.children;
    forEachProperty(this.selection, function (pos, name) {
        var c = ch[name];
        if (c) {
            cg.add(group.cmdSetVisualOnlyInEditor(name, onlyInEditor));
        }
    });
    group.doCommand(cg);
};

GroupViewer.prototype.previewStyleChange = function (localTheme) {
    var ipe = this.getChild('inplaceEditor');
    this.getChild('visuals').setLocalTheme(localTheme).setSkin(localTheme.skin, true);

    if (ipe) {
        ipe.setLocalTheme(localTheme).setSkin(localTheme.skin, true);
    }
};
GroupViewer.prototype.getPositionRect = function (name) {
    var pos = this.documentData.positions[name],
        res;
    if (pos) {
        res = getEnclosingRect(pos.matrix);
    }
    return res;
};

GroupViewer.prototype.getPreviewTheme = function () {
    if (this.previewTheme === undefined) {
        this.previewTheme = this.group.createBoundThemeFromData();
    }
    return this.previewTheme;
};

GroupViewer.prototype.setDefaultVisual = function (vis) {
    this.defaultVisual = vis;
};

GroupViewer.prototype.getDefaultVisual = function () {
    return this.defaultVisual;
};

GroupViewer.prototype.untransformSelection = function () {
    var group = this.group,
        documentData = group.documentData,
        selection = this.selection,
        visuals = this.getChild('visuals'),
        cmdGroup = group.cmdCommandGroup('clearTransformation', 'Clear Transformation');

    // for everything in the selection
    forEachProperty(selection, function (c, n) {
        var vis = visuals.getChild(n),
            authoringDimensions = vis ? vis.getNaturalDimensions() : null;

        cmdGroup.add(group.cmdClearTransformationPosition(n, authoringDimensions));
    });
    // do the combined command
    group.doCommand(cmdGroup);
};
//////////////////////
// private stuff (maybe should go in groupviewerprivate)
GroupViewer.prototype.setGroup = function (group) {
    var that = this,
        commandChain = group.getCommandChain(),
        documentData = group.documentData,
        borderPix = this.groupBorderPix;
    delete this.previewTheme;
    this.selection = {};
    // the group selection mechanism:
    // - we clear all listeners from the selected group's command chain
    // - we assign this group to ourself
    // - we emit a setgroup event
    // - also: we always forward the 'command' events from the selected
    // command chain, so we act as a proxy for this command chain. This
    // means that all the 'satellite' user interface elements that act
    // on us can use US instead of the group's command chain and this way
    // dont worry about re connecting themselves to the group's command Chain
    commandChain.removeAllListeners();
    this.group = group;
    this.emit('setGroup', group);
    this.documentData = documentData;
    // FIXME (or food for thoughts) maybe we should deal with command groups
    // by iterating all their sub commands
    function onCommand(command, name, message, hint, forEachSubCommand) {
        var redraw = false,
            notifySelectionChanged = false;
        function processCommand(name, message, hint) {
            switch (name) {
            case 'cmdUnsetStyleBase':
            case 'cmdSetStyleBase':
            case 'cmdSetStyleFeatures':
            case 'cmdRenameStyle':
            case 'cmdRemoveStyleAndReferences':
            case 'cmdRemoveRemoteStyleSkin':
            case 'cmdSetRemoteStyleSkinFeatures':
                delete that.previewTheme;
                redraw = true;
                break;
            case 'cmdAddStyle':
                delete that.previewTheme;
                // no redraw
                break;
            case 'cmdAddPosition':
                that.addToSelection(hint.name, false, true);
                notifySelectionChanged = true;
                redraw = true;
                break;
            case 'cmdSetComponentProperties':
                that.adjustZoomToGridSize();
                // no redraw
                break;
            case 'rename':
                if (hint) {
                    delete that.selection[hint.from];
                    that.selection[hint.to] = documentData.positions[hint.to];
                } else {
                    throw new Error('Missing rename hint');
                }
                // no redraw
                break;
            default:
                redraw = true;
                break;
            }
        }
        // clear the selection if needed (not done in subcommands)
        if (hint && hint.clearSelection) {
            that.clearSelection(true);
            notifySelectionChanged = true;
        }
        // process the command
        processCommand(name, message, hint, forEachSubCommand);
        // if it is a group, also process the subcommands
        if (forEachSubCommand) {
            redraw = false;
            // if the command is a group
            forEachSubCommand(processCommand);
        }
        that.purgeSelection();
        if (redraw) {
            that.updateAll();
        }
        if (notifySelectionChanged) {
            that.emit('selectionChanged');
        }
        // finally, forward the 'command'
        // (we act as a proxy for the selected document's command chain)
        that.emit('command', command, name, message, hint, forEachSubCommand);
    }
    // hook ourselves
    commandChain.on('command', onCommand);
    commandChain.on('setSavePoint', function () {
        that.emit('setSavePoint');
    });

    this.zoomStack = [
        mat4.scale(mat4.identity(), [0.25, 0.25, 1], mat4.create())
    ];
    this.zoom100();
};
GroupViewer.prototype.commitPendingChanges = function () {
    var group = this.group,
        name = this.inplaceEditName,
        newConfig;
    // this should commit some of the changes
    this.blurFocusedElement();
    // if we have an inplace editor, we must also do something
    if (name) {
        newConfig = this.getInplaceEditorConfig();
        // update the model if needed (non null new config)
        if (newConfig) {
            group.doCommand(group.cmdSetVisualConfig(name, newConfig));
        }
    }
};
GroupViewer.prototype.getInplaceEditTransformation = function (matrix) {
    var zoomMat = mat4.create(this.zoomStack[this.zoomStack.length - 1]),
        zoomMatNoTranslate = mat4.create(zoomMat),
        borderPix = this.groupBorderPix,
        res;
    // compute the appropriate matrix
    zoomMatNoTranslate[12] = 0;
    zoomMatNoTranslate[13] = 0;
    zoomMatNoTranslate[14] = 0;
    res = convertScaleToSize(matrix);
    res.matrix[12] += borderPix;
    res.matrix[13] += borderPix;
    mat4.multiply(zoomMatNoTranslate, res.matrix, res.matrix);
    return res;
};

GroupViewer.prototype.previewTransformInplaceEdit = function (transform) {
    var ipe = this.getChild('inplaceEditor'),
        group,
        documentData,
        mat,
        res;
    if (ipe && this.inplaceEditName) {
        group = this.group;
        documentData = group.documentData;
        mat = documentData.positions[this.inplaceEditName].matrix;
        res = this.getInplaceEditTransformation(mat4.multiply(transform, mat, mat4.create()));
        ipe.setMatrix(res.matrix);
        ipe.setDimensions(res.dimensions);
    }
};
GroupViewer.prototype.getInplaceEditorConfig = function () {
    var group = this.group,
        name = this.inplaceEditName,
        documentData = group.documentData,
        ipe = this.getChild('inplaceEditor'),
        newConfig = null,
        typeInfo;

    if (ipe) {
        typeInfo = documentData.children[name];
        if (typeInfo && typeInfo.factory === ipe.typeInfo.factory && typeInfo.type === ipe.typeInfo.type) {
            newConfig = deepCopy(typeInfo.config);
            // if the config did not change, nullify it
            if (!ipe.updateConfiguration(newConfig)) {
                newConfig = null;
            }
        }
    }
    return newConfig;
};
GroupViewer.prototype.inplaceEditorVisible = function () {
    return Boolean(this.getChild('inplaceEditor'));
};
GroupViewer.prototype.updateInplaceEdit = function () {
    var group = this.group,
        documentData = group.documentData,
        selName = this.getSelectedName(),
        typeInfo,
        factory,
        Constr,
        config,
        that = this,
        ipe = this.getChild('inplaceEditor'),
        theme,
        res;
    // we prevent reentry (that is possible because we can update the config
    // of a component from here, and trigger a redraw)
    if (this.inUpdateInplaceEdit) {
        return;
    }
    this.inUpdateInplaceEdit = true;
    function inplaceEditorMatchesSelection() {
        var name = that.inplaceEditName,
            selName = that.getSelectedName(),
            typeInfo = documentData.children[name],
            ipe = that.getChild('inplaceEditor'),
            ipeTI;
        if (that.getSelectionLength() === 1 && selName === name && ipe && typeInfo) {
            ipeTI = ipe.typeInfo;
            return typeInfo.factory === ipeTI.factory && typeInfo.type === ipeTI.type;
        }
        return false;
    }
    function remove() {
        var newConfig,
            ipe = that.getChild('inplaceEditor'),
            normalChild,
            name = that.inplaceEditName;
        if (ipe) {
            // update the group if it still exists
            newConfig = that.getInplaceEditorConfig();
            // remove the child
            that.removeChild(ipe);
            delete that.inplaceEditName;
            // re show the 'normal' child if it exists
            normalChild = that.getChild('visuals').getChild(name);
            if (normalChild) {
                normalChild.setStyleAttributes({color: null});
            }
            // update the model if needed (non null new config)
            if (newConfig) {
                group.doCommand(group.cmdSetVisualConfig(name, newConfig));
            }
            that.emit('inplaceEditChanged');
        }
    }

    if (!inplaceEditorMatchesSelection()) {
        // we have an inplace editor
        remove();
        ipe = null;
    }
    if (this.getSelectionLength() === 1) {
        // compute the appropriate matrix
        res = this.getInplaceEditTransformation(documentData.positions[selName].matrix);
        // if we still have an inplace editor at this point, we should
        // make sure that it has the appropriate matrix
        if (ipe) {
            ipe.setMatrix(res.matrix);
            ipe.setDimensions(res.dimensions);
            typeInfo = documentData.children[that.inplaceEditName];
            ipe.updateEditor(typeInfo.config);
            theme = this.getPreviewTheme();
            ipe.setLocalTheme(theme).setSkin(theme.skin);
            this.getChild('visuals').getChild(this.inplaceEditName).setStyleAttributes({color: {r: 0, g: 0, b: 0, a: 0}});
        } else {
            typeInfo = documentData.children[selName];
            if (typeInfo) {
                factory = require(typeInfo.factory);
                Constr = factory[typeInfo.type];
                // is this type inplace editable?
                if (Constr.getInplaceEditor) {
                    // create the inplace editor
                    ipe = Constr.getInplaceEditor();
                    this.addChild(ipe, 'inplaceEditor');
                    ipe.setMatrix(res.matrix);
                    ipe.setDimensions(res.dimensions);
                    // FIXME
                    //ipe.setSkin(this.getPreviewTheme().getSkin());
                    // not sure this is ok
                    theme = this.getPreviewTheme();
                    ipe.setLocalTheme(theme).setSkin(theme.skin);
                    ipe.init(typeInfo.config);
                    ipe.typeInfo = typeInfo;
                    this.inplaceEditName = selName;
                    this.getChild('visuals').getChild(that.inplaceEditName).setStyleAttributes({color: {r: 0, g: 0, b: 0, a: 0}});
                    that.emit('inplaceEditChanged');
                }
            }
        }
    }
    delete this.inUpdateInplaceEdit;
};

/**
    Updates the representation of the selection box.
*/
GroupViewer.prototype.updateSelectionControlBox = function () {
    var unionr = this.getSelectionRect(),
        unionmat,
        modes = this.selectionControlBoxModes,
        selectionControlBox = this.selectionControlBox;
    // show the selection box
    if (unionr) {
        unionmat = rectToMatrix(unionr);
        forEach(modes, function (m, n) {
            m.setContentRectAndMatrix(unionr, unionmat);
        });
        selectionControlBox.setVisible(true);
    } else {
        // the selection is empty, hide the box
        selectionControlBox.setVisible(false);
    }

    this.updateLayoutAnchors();

    this.updateInplaceEdit();

    this.emit('updateSelectionControlBox', unionr);
};

/**
    Updates the representation of the layout anchors.
*/
GroupViewer.prototype.updateLayoutAnchors = function () {
    var unionr = this.getSelectionRect(),
        zoomMat = this.zoomMat,
        layoutAnchors = this.layoutAnchors;
    // show the selection box
    if (unionr) {
        layoutAnchors.setPageRect(this.getTransformedPageRect());
        layoutAnchors.setAnchors(this.getSelectionAnchoring());
        layoutAnchors.setContentRect([mat4.multiplyVec3(zoomMat, unionr[0]), mat4.multiplyVec3(zoomMat, unionr[1])]);
        layoutAnchors.setVisible(this.showAnchors);
    } else {
        // the selection is empty, hide the box
        layoutAnchors.setVisible(false);
    }
};

/**
    This will filter the documentData to make it displayable in the editor.
*/
GroupViewer.prototype.getDisplayableDocumentData = function (wireframe) {
    var documentData = this.documentData,
        positions = documentData.positions,
        children = documentData.children,
        theme = this.getPreviewTheme(),
        borderStyle = 'dotted',
        borderColor = { r: 0, g: 0, b: 0, a: 0.5 },
        fdd = {
            dimensions: documentData.dimensions,
            children: {},
            positions: {},
            theme: theme
        };

    forEachProperty(documentData.positions, function (pos, name) {
        var c = children[name];
        if (positions[name].enableDisplay !== false) {
            fdd.positions[name] = {
                type: "Position",
                order: pos.order,
                opacity: pos.opacity,
                matrix: pos.matrix,
                snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
            };
            if (wireframe) {
                fdd.children[name] = {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        position: name,
                        styleAttributes: {
                            borderTopWidth: 1,
                            borderTopStyle: borderStyle,
                            borderTopColor: borderColor,
                            borderRightWidth: 1,
                            borderRightStyle: borderStyle,
                            borderRightColor: borderColor,
                            borderBottomWidth: 1,
                            borderBottomStyle: borderStyle,
                            borderBottomColor: borderColor,
                            borderLeftWidth: 1,
                            borderLeftStyle: borderStyle,
                            borderLeftColor: borderColor
                        }
                    }
                };
            } else if (c) {
                fdd.children[name] = deepCopy(c);
                delete fdd.children[name].onlyInEditor;
            } else {
                // we want to create a fake preview element
                fdd.children[name] = {
                    factory: "editor",
                    type: "EmptyPosition",
                    config: {
                        position: name
                    }
                };
            }
        }
    });
    return fdd;
};

/**
    Returns the transformed (for zoom) page rect.
*/
GroupViewer.prototype.getTransformedPageRect = function () {
    var dim = this.documentData.dimensions,
        zoomMat = this.zoomMat,
        topLeft = mat4.multiplyVec3(zoomMat, vec3.create()),
        bottomRight = mat4.multiplyVec3(zoomMat, dim, vec3.create());

    return [topLeft, bottomRight];
};


/**
    Regenerates the whole thing.


HOW WE DEAL WITH ZOOM
- only the childen layer is really zoomed
    (it should not be handled by the position thing (?))
- we apply the zoom matrix to stuff we create in  the positions layer.
    this one has no scaling
- the decorations layer is not scaled either


To display something in model coordinate in the decorations or positions layer,
    we must apply the zooming matrix to it

To display something in model coordinates in the visuals layer, there is nothing
    special to do

*/
GroupViewer.prototype.updateAll = function () {
    if (!this.documentData || !this.dependencyManagerLoaded) {
        return;
    }
    var documentData = this.documentData,
        children = this.children,
        that = this,
        borderPix = this.groupBorderPix,
        zoomMat = mat4.create(this.zoomStack[this.zoomStack.length - 1]),
        zoomTranslate,
        zoomMatNoTranslate = mat4.create(zoomMat),
        displayableDocumentData = this.getDisplayableDocumentData(),
        extendedDimensions = vec3.create(this.documentData.dimensions);

    // remove the translation from the zoom matrix
    zoomTranslate = [zoomMat[12], zoomMat[13], zoomMat[14]];
    zoomMat[12] = 0;
    zoomMat[13] = 0;
    zoomMat[14] = 0;
    mat4.translate(zoomMat, [borderPix, borderPix, 0]);
    zoomMatNoTranslate[12] = 0;
    zoomMatNoTranslate[13] = 0;
    zoomMatNoTranslate[14] = 0;

    // keep this (useful for coordinate transformations)
    this.zoomMat = zoomMat;

    // compute the extended dimensions
    extendedDimensions[0] += borderPix * 2;
    extendedDimensions[1] += borderPix * 2;
    extendedDimensions[2] = 1;
    mat4.multiplyVec3(zoomMatNoTranslate, extendedDimensions);

    // regenerate content
    children.visuals.removeAllChildren();
    children.visuals.theme = displayableDocumentData.theme;
    children.visuals.setPosition(null);
    try {
        children.visuals.createGroup(displayableDocumentData);
    } catch (e) {
        console.log('Error while regenerating the view ' + e);
    }
    children.visuals.setMatrix(zoomMat);
    children.visuals.setSkin(displayableDocumentData.theme.getSkin(), true);

    forEachProperty(children.visuals.children, function (c) {
        // Sets the preview mode
        c.enableInteractions(false);
    });
    // regenerate outlines (wireframe)
    children.outlines.removeAllChildren();
    children.outlines.setPosition(null);
    if (this.showOutlines) {
        try {
            children.outlines.createGroup(this.getDisplayableDocumentData(true));
        } catch (e2) {
            console.log('Error while regenerating the view ' + e2);
        }
        children.outlines.setMatrix(zoomMat);
    }

    // decorations
    children.decorations.setPosition(null);
    children.decorations.setDimensions(extendedDimensions);
    children.decorations.setMatrix(mat4.identity());

    // selection control box
    this.updateSelectionControlBox();
};

exports.GroupViewer = GroupViewer;
