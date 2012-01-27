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
    groups = require('./definition').definition.groups,
    vec3 = glmatrix.vec3,
    mat4 = glmatrix.mat4,
    convertScaleToSize = visual.convertScaleToSize;
    

function GroupViewer(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.GroupViewer);
    // maybe this will be part of the config
    this.setChildrenClipping('scroll');
    // border around the group in pixels (when not scaled)
    this.groupBorderPix = 1000;    
    
    this.selectionControlBox = new (selectionbox.SelectionBox)({});
    this.selectionControlBox.setMatrix(mat4.translate(mat4.identity(), [100, 100, 0]));
    this.selectionControlBox.setDimensions([200, 200, 1]);
    this.children.decorations.addChild(this.selectionControlBox, 'selectionControlBox');
}
GroupViewer.prototype = new (domvisual.DOMElement)();

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
        nmatrix;

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
        var zoomMat = that.zoomMat,
            res = convertScaleToSize(mat4.multiply(zoomMat, nmatrix, mat4.create()));
        if (!mouseBox) {
            mouseBox = new (domvisual.DOMElement)({ "class": "editor_GroupViewer_mouseBox"});
            decorations.addChild(mouseBox, 'mouseBox');
        }
        mouseBox.setDimensions(res.dimensions);
        mouseBox.setMatrix(res.matrix);
    }
    function removeMouseBox() {
        decorations.removeChild(mouseBox);
        mouseBox = null;
    }
    // we want to add mouse events to the decoration child
    function mouseMove(evt) {
        evt.preventDefault();
        var mat = visuals.getFullDisplayMatrix(true);
        endpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]);
        matrix = twoPositionsToMatrix(startpos, endpos);
        nmatrix = twoPositionsToNormalizedMatrix(startpos, endpos);
        updateMouseBox(nmatrix);
        if (selection) {
            selection(matrix, nmatrix, startpos, endpos);
        }
    }
    function mouseUp(evt) {
        evt.preventDefault();
        decorations.removeListener('mousemovec', mouseMove);
        removeMouseBox();
        if (selectionEnd) {
            selectionEnd(matrix, nmatrix, startpos, endpos);
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
        updateMouseBox(nmatrix);
        if (selectionStart) {
            selectionStart(matrix, nmatrix, startpos, endpos);
        }
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
    Returns the currently edited group.
*/
GroupViewer.prototype.getGroup = function () {
    return this.group;
};

/**
    Zoom to a given position.
*/
GroupViewer.prototype.pushZoom = function (matrix) {
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
    this.regenerateAll();
};
GroupViewer.prototype.popZoom = function () {
    if (this.zoomStack.length > 1) {
        this.zoomStack.pop();
        this.regenerateAll();
    }
};

/**
    Selection.
*/
GroupViewer.prototype.select = function (matrix) {
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
/*        switch (name) {
        default:
            // regenerate all
            that.regenerateAll();
        }*/
        that.regenerateAll();
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
    
    this.zoomStack = [mat4.translate(mat4.identity(), [borderPix, borderPix, 0], mat4.create())];
    // regenerate everything
    this.regenerateAll();
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
GroupViewer.prototype.regenerateAll = function () {
    if (!this.documentData) {
        return;
    }
    var documentData = this.documentData,
        children = this.children,
        that = this,
        borderPix = this.groupBorderPix,
        zoomMat = mat4.create(this.zoomStack[this.zoomStack.length - 1]),
        zoomTranslate = [],
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

    this.setScroll(zoomTranslate);
};



exports.GroupViewer = GroupViewer;
