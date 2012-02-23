/**
    viewer.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    selectionbox = require('./selectionbox'),
    forEachProperty = utils.forEachProperty,
    deepCopy = utils.deepCopy,
    groups = require('./definition').definition.groups,
    vec3 = glmatrix.vec3,
    mat4 = glmatrix.mat4,
    convertScaleToSize = visual.convertScaleToSize;
    
/**
    Useful functions for dealing with selections.
*/
function getEnclosingRect(m) {
    var i, v1, v2, v3, t, minpt = [], maxpt = [], mn, mx, min = Math.min, max = Math.max;
    for (i = 0; i < 3; i += 1) {
        t = m[12 + i];
        v1 = m[i] + t;
        v2 = m[i + 4] + t;
        v3 = m[i + 8] + t;
        mn = min(v1, v2, v3, t);
        mx = max(v1, v2, v3, t);
        if (maxpt[i] === undefined || mn < minpt[i]) {
            minpt[i] = mn;
        }
        if (maxpt[i] === undefined || mx > maxpt[i]) {
            maxpt[i] = mx;
        }
    }
    return [minpt, maxpt];
}

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
        (r1min[1] <= r2max[1] && r1max[1] >= r2min[1]) &&
        (r1min[2] <= r2max[2] && r1max[2] >= r2min[2]);
}

function rectToMatrix(r) {
    var m = mat4.identity(),
        rmin = r[0],
        rmax = r[1],
        rmin0, 
        rmin1, 
        rmin2;
    m[12] = rmin0 = rmin[0];
    m[13] = rmin1 = rmin[1];
    m[14] = rmin2 = rmin[2];
    m[0] = rmax[0] - rmin0;
    m[5] = rmax[1] - rmin1;
    m[10] = rmax[2] - rmin2;
    return m;
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
    this.selection = {};
    
    // setup the selection control box
    this.selectionControlBox = new (selectionbox.SelectionBox)({});
    this.selectionControlBox.setMatrix(mat4.translate(mat4.identity(), [100, 100, 0]));
    this.selectionControlBox.setDimensions([200, 200, 1]);
    this.children.decorations.addChild(this.selectionControlBox, 'selectionControlBox');
    // add handlers for the selectionControlBox
    this.selectionControlBox.transformContentMatrix = function (matrix) {
        return mat4.multiply(that.zoomMat, matrix, mat4.create());
    };
    this.selectionControlBox.getFDM = function () {
        return that.children.visuals.getFullDisplayMatrix(true);
    };
    this.selectionControlBox.on('transform', function (transform) {
        var group = that.group,
            cg = that.group.cmdCommandGroup('transform', 'Transform a group');
        // transform the whole selection
        forEachProperty(that.selection, function (sel, name) {
            cg.add(group.cmdTransformPosition(name, transform));
        });
        group.doCommand(cg);
    });
    this.selectionControlBox.on('preview', function (transform) {
        that.previewSelectionTransformation(transform);
    });
    
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
    Enables or disables box selection.
        The provided callbacks will be called on selection Start, selection,
        and selection end.
*/
GroupViewer.prototype.enableBoxSelection = function (
    selectionStart,
    selection,
    selectionEnd
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
        endpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 0]);
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
        var mat = visuals.getFullDisplayMatrix(true);
        startpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 0]);
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
        children = this.children;
    forEachProperty(this.selection, function (s, n) {
        var vis = children.visuals.children[n],
            pos,
            newpos = {},
            ch = documentData.children[n];
            
        if (vis) {
            pos = documentData.positions[ch.position];
            if (pos) {
                newpos.type = pos.type;
                newpos.snapping = pos.snapping;
                newpos.matrix = mat4.multiply(transform, pos.matrix, mat4.create());
                vis.setPosition(visual.deserializePosition(newpos));
            }
        }
    });
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
    this.updateAll();
    this.resetScroll();
};
GroupViewer.prototype.popZoom = function () {
    if (this.zoomStack.length > 1) {
        this.zoomStack.pop();
        this.updateAll();
        this.resetScroll();
    }
};

/**
    Checks if there is an item under the mouse.
*/
GroupViewer.prototype.itemAtPosition = function (position, subset) {
    var documentData = this.documentData,
        children = documentData.children,
        rp = [position, position],
        ret = null,
        retCh = null;
    subset = subset || documentData.positions;
    forEachProperty(subset, function (it, name) {
        var r = getEnclosingRect(it.matrix),
            ch;
        if (intersects(r, rp)) {
            ch = children[name];
            if ((retCh === null) || ((ch !== undefined) && ch.order > retCh.order)) {
                ret = name;
                retCh = ch;
            }
        }
    });
    return ret;
};

/**
    Checks if there is a selected item under the mouse.
*/
GroupViewer.prototype.selectedItemAtPosition = function (position) {
    return this.itemAtPosition(position, this.selection);
};

/**
    Selection.
*/
GroupViewer.prototype.selectByMatrix = function (matrix, toggle) {
    var documentData = this.documentData,
        selrect,
        sel,
        selection = this.selection;
    function select(name) {
        if (toggle && selection[name]) {
            delete selection[name];
        } else {
            selection[name] = documentData.positions[name];
        }
    }   
    // select a point
    if (matrix[0] === 0 && matrix[5] === 0 && matrix[10] === 0) {
        sel = this.itemAtPosition([matrix[12], matrix[13], matrix[14]]);
        if (sel) {
            select(sel);
        }
    } else {
        selrect = getEnclosingRect(matrix);
        forEachProperty(documentData.positions, function (c, name) {
            var r = getEnclosingRect(c.matrix);
            if (intersects(selrect, r)) {
                select(name);
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
    Checks whether a position is selected.
*/
GroupViewer.prototype.positionIsSelected = function (name) {
    return this.selection[name] !== undefined;
};

/**
    Checks whether a visual is selected.
*/
GroupViewer.prototype.visualIsSelected = function (name) {
    var documentData = this.documentData,
        vis = documentData.children[name],
        ret = false;
    if (vis) {
        ret = this.positionIsSelected(vis.position);
    }
    return ret;
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
GroupViewer.prototype.getSelectionRect = function () {
    var unionr;
    // compute the graphic size of the selection    
    forEachProperty(this.selection, function (box, name) {
        var r = getEnclosingRect(box.matrix);
        if (!unionr) {
            unionr = r;
        } else {
            unionr = unionRect(r, unionr);
        }
    });
    return unionr;
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
        case 'cmdAddPosition':
            that.clearSelection();
            that.addToSelection(hint.name);
            break;
        case 'shutTheFuckUpJSLint':
            break;
        }
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
    this.updateAll();
    this.resetScroll();
};

/**
    Updates the representation of the selection box.
*/
GroupViewer.prototype.updateSelectionControlBox = function () {
    var r,
        unionr = this.getSelectionRect(),
        matrix,
        res;
    // show the selection box
    if (unionr) {
        this.selectionControlBox.setContentMatrix(rectToMatrix(unionr));
        this.selectionControlBox.setVisible(true);
    } else {
        // the selection is empty, hide the box
        this.selectionControlBox.setVisible(false);
    }
    this.emit('updateSelectionControlBox');
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
    children.positions.removeAllChildren();
    //children.decorations.removeAllChildren();
    // children
    children.visuals.setPosition(null);
    children.visuals.createGroup(documentData);
    children.visuals.setMatrix(zoomMat);
    
    forEachProperty(children.visuals.children, function (c) {
        // Sets the preview mode
        c.enableInteractions(false);
    });
    // positions   
    children.positions.setPosition(null);
    children.positions.setDimensions(extendedDimensions);
    children.positions.setMatrix(mat4.identity());
    forEachProperty(documentData.positions, function (c, name) {
        // regenerate it
        var pos = new (domvisual.DOMElement)({}),
            res = convertScaleToSize(mat4.multiply(zoomMat, c.matrix, mat4.create()));

        pos.setDimensions(res.dimensions);
        pos.setMatrix(res.matrix);
        pos.setClass('editor_GroupViewer_position');
        children.positions.addChild(pos, name);
    });    
    // decorations
    children.decorations.setPosition(null);
    children.decorations.setDimensions(extendedDimensions);
    children.decorations.setMatrix(mat4.identity());
    
    // selection control box
    this.updateSelectionControlBox();
};



exports.GroupViewer = GroupViewer;
