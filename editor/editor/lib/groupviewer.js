/**
    viewer.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

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
    groups = require('./definition').definition.groups,
    vec3 = glmatrix.vec3,
    mat4 = glmatrix.mat4,
    EmptyPosition = require('./EmptyPosition').EmptyPosition,
    convertScaleToSize = visual.convertScaleToSize;

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
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.GroupViewer);
    // maybe this will be part of the config
    this.setStyle('background');
    this.setChildrenClipping('scroll');
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

    // layout anchors
    this.layoutAnchors = new (LayoutAnchors)({});
    this.children.decorations.addChild(this.layoutAnchors, 'layoutAnchors');
    // add handlers for the selectionScalingUI
    this.selectionRotationUI.transformContentMatrix =
        this.selectionScalingUI.transformContentMatrix = function (matrix) {
            return mat4.multiply(that.zoomMat, matrix, mat4.create());
        };
    this.selectionRotationUI.getFDM =
        this.selectionScalingUI.getFDM = function () {
            return that.children.visuals.getFullDisplayMatrix(true);
        };
    this.selectionRotationUI.snapPositionToGrid =
        this.selectionScalingUI.snapPositionToGrid = function (pos) {
            return that.snapPositionToGrid(pos);
        };
    // transform handlers
    function transformHandler(transform) {
        var group = that.group,
            cg = that.group.cmdCommandGroup('transform', 'Transform a group');
        // transform the whole selection
        forEachProperty(that.selection, function (sel, name) {
            cg.add(group.cmdTransformPosition(name, transform));
        });
        group.doCommand(cg);
    }
    this.selectionScalingUI.on('transform', transformHandler);
    this.selectionRotationUI.on('transform', transformHandler);
    // preview handlers
    function previewHandler(transform) {
        that.previewSelectionTransformation(transform);
    }
    this.selectionScalingUI.on('preview', previewHandler);
    this.selectionRotationUI.on('preview', previewHandler);
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
            { factory: 'baseui', type: 'Theme', style: 'windowDarkerForeground' },
            { factory: 'baseui', type: 'Theme', style: 'sectionBorder' }
        ]
    },
    page: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'windowForeground' }
        ]
    }
});

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
            decorations.setCursor('crosshair');
        }
    }
    function removeMouseBox() {
        if (mouseBox) {
            decorations.removeChild(mouseBox);
            mouseBox = null;
            decorations.setCursor(null);
        }
    }
    // we want to add mouse events to the decoration child
    function mouseMove(evt) {
        evt.preventDefault();
        var mat = visuals.getFullDisplayMatrix(true);
        endpos = applyGrid(glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]));
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
        if (selectionEnd) {
            selectionEnd(matrix, nmatrix, startpos, endpos, evt);
        }
    }
    function mouseDown(evt) {
        evt.preventDefault();
        var mat = visuals.getFullDisplayMatrix(true),
            evtPos = [evt.pageX, evt.pageY, 0];

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
    }

    // setup box selection
    if (selectionStart || selection || selectionEnd) {
        decorations.on('mousedown', mouseDown);
        this.resetBoxSelection = function () {
            decorations.removeListener('mousedown', mouseDown);
        };
    }
};

/**
    Previews a transoformation of the selection.
*/
GroupViewer.prototype.previewSelectionTransformation = function (transform) {
    var documentData = this.documentData,
        children = this.children,
        visuals = children.visuals.children || {},
        zoomMat = this.zoomMat,
        selRect;
    forEachProperty(this.selection, function (s, n) {
        var vis = visuals[n],
            pos,
            res,
            newpos = {},
            ch = documentData.children[n];
        pos = documentData.positions[n];
        if (pos) {
            // graphic element
            if (vis) {
                newpos.type = pos.type;
                newpos.snapping = pos.snapping;
                newpos.matrix = mat4.multiply(transform, pos.matrix, mat4.create());
                vis.setPosition(new (visual.Position)(newpos.matrix, newpos.snapping, newpos.opacity));
            }
        }
    });
    this.showLayoutAnchors(false);
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
    Zoom to a given position.
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
    this.zoomStack.push(mat);
    this.adjustZoomToGridSize();
};

/**
    Adjust the zoom to the current grid.
*/
GroupViewer.prototype.adjustZoomToGridSize = function () {
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
        children.decorations.setBackgroundImage(grid.toDataURL());
    } else {
        children.decorations.setBackgroundImage(null);
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
GroupViewer.prototype.selectByMatrix = function (matrix, toggle, byContact) {
    var documentData = this.documentData,
        selrect,
        sel,
        selp,
        selfcn = byContact === true ? intersects : encloses,
        positions = documentData.positions,
        selection = this.selection;
    function select(name) {
        if (toggle && selection[name]) {
            delete selection[name];
        } else {
            selection[name] = positions[name];
        }
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
};

/**
    Add a given position to the selection.
*/
GroupViewer.prototype.addToSelection = function (name) {
    var sel = this.documentData.positions[name];
    if (sel) {
        this.selection[name] = sel;
    }
};
GroupViewer.prototype.removeFromSelection = function (name) {
    delete this.selection[name];
};
GroupViewer.prototype.clearSelection = function (name) {
    this.selection = {};

};
GroupViewer.prototype.getSelection = function () {
    return this.selection;
};

/**
    Remove stuff that does not exist from the selection.
*/
GroupViewer.prototype.purgeSelection = function () {
    var positions = this.documentData.positions,
        selection = {};
    forEachProperty(this.selection, function (p, n) {
        if (positions[n]) {
            selection[n] = p;
        }
    });
    this.selection = selection;
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
GroupViewer.prototype.getSelectedVisual = function () {
    return this.children.visuals.children[this.getSelectedName()];
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
            cg.add(group.cmdSetVisualConfig(name, config));
        }
    });
    group.doCommand(cg);
};
GroupViewer.prototype.previewStyleChange = function (skin) {
    this.children.visuals.setLocalTheme(skin);
};
GroupViewer.prototype.getPositionRect = function (name) {
    var pos = this.documentData.positions[name],
        res;
    if (pos) {
        res = getEnclosingRect(pos.matrix);
    }
    return res;
};
GroupViewer.prototype.getSelectionCopy = function () {
    var documentData = this.documentData,
        positions = documentData.positions,
        children = documentData.children,
        res = {
            positions: {},
            children: {}
        },
        c;
    forEachProperty(this.selection, function (p, n) {
        c = children[n];
        res.positions[n] = deepCopy(p);
        if (c) {
            res.children[n] = deepCopy(c);
        }
    });
    return res;
};
GroupViewer.prototype.getPreviewTheme = function () {
    if (this.previewTheme === undefined) {
        this.previewTheme = this.group.createBoundThemeFromData();
    }
    return this.previewTheme;
};
//////////////////////
// private stuff (maybe should go in groupviewerprivate)
GroupViewer.prototype.setGroup = function (group) {
    var that = this,
        commandChain = group.getCommandChain(),
        documentData = group.documentData,
        borderPix = this.groupBorderPix;
    if (this.unhookFromGroup) {
        this.unhookFromGroup();
    }
    this.group = group;
    this.documentData = documentData;
    function onDo(name, message, hint) {
        switch (name) {
        case 'cmdUnsetStyleBase':
        case 'cmdSetStyleBase':
        case 'cmdSetStyleFeatures':
        case 'cmdRenameStyle':
        case 'cmdRemoveStyleAndReferences':
            delete that.previewTheme;
            break;
        case 'cmdAddStyle':
            delete that.previewTheme;
            return;
        case 'cmdAddPosition':
            that.clearSelection();
            that.addToSelection(hint.name);
            break;
        case 'cmdSetComponentProperties':
            that.adjustZoomToGridSize();
            return;
        case 'rename':
            if (hint) {
                delete that.selection[hint.from];
                that.selection[hint.to] = documentData.positions[hint.to];
            } else {
                throw new Error('Missing rename hint');
            }
            return;

        }
        that.purgeSelection();
        that.updateAll();
    }
    // hook ourselves
    commandChain.on('do', onDo);
    commandChain.on('undo', onDo);
    commandChain.on('redo', onDo);

    // unhook current document
    this.unhookFromGroup = function () {
        commandChain.removeListener('do', onDo);
        commandChain.removeListener('undo', onDo);
        commandChain.removeListener('redo', onDo);
    };

    this.zoomStack = [
        mat4.scale(mat4.identity(), [0.25, 0.25, 1], mat4.create()),
        mat4.translate(mat4.identity(), [borderPix - 20, borderPix - 20, 0], mat4.create())
    ];
    // regenerate everything
    this.adjustZoomToGridSize();
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
GroupViewer.prototype.getDisplayableDocumentData = function () {
    var documentData = this.documentData,
        positions = documentData.positions,
        children = documentData.children,
        fdd = {
            dimensions: documentData.dimensions,
            children: {},
            positions: {},
            theme: this.getPreviewTheme()
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
            if (c) {
                fdd.children[name] = c;
            } else {
                // we want to create a fake preview element
                fdd.children[name] = {
                    factory: "editor",
                    type: "EmptyPosition",
                    position: name,
                    config: {}
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
    if (!this.documentData) {
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
    //children.decorations.removeAllChildren();
    children.visuals.theme = displayableDocumentData.theme;
    children.visuals.setPosition(null);
    try {
        children.visuals.createGroup(displayableDocumentData);
    } catch (e) {
        // FIXME: this is wrong... because... the components we depend
        // on are not necessarily already loaded...
        // kinda shitty.
    }
    children.visuals.setMatrix(zoomMat);

    forEachProperty(children.visuals.children, function (c) {
        // Sets the preview mode
        c.enableInteractions(false);
    });
    // decorations
    children.decorations.setPosition(null);
    children.decorations.setDimensions(extendedDimensions);
    children.decorations.setMatrix(mat4.identity());

    // selection control box
    this.updateSelectionControlBox();
};


exports.GroupViewer = GroupViewer;
