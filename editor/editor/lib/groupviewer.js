/**
    viewer.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    groups = require('./definition').definition.groups,
    vec3 = glmatrix.vec3,
    mat4 = glmatrix.mat4,
    convertScaleToSize = visual.convertScaleToSize;
    


function GroupViewer(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config);
    // maybe this will be part of the config
    this.setChildrenClipping('scroll');
    this.createGroup(groups.GroupViewer);
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
        selectionBox,
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
    function updateSelectionBox(nmatrix) {
        var zoomMat = that.zoomStack[that.zoomStack.length - 1],        
            res = convertScaleToSize(mat4.multiply(zoomMat, nmatrix, mat4.create()));
        if (!selectionBox) {
            selectionBox = new (domvisual.DOMElement)({});
            decorations.addChild(selectionBox, 'selectionBox');
        }
            
        selectionBox.setDimensions(res.dimensions);
        selectionBox.setMatrix(res.matrix);
    }
    function removeSelectionBox() {
        decorations.removeChild(selectionBox);
        selectionBox = null;
    }
    // we want to add mouse events to the decoration child
    function mouseMove(evt) {
        evt.preventDefault();
        var mat = visuals.getFullDisplayMatrix(true);
        endpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]);
        matrix = twoPositionsToMatrix(startpos, endpos);
        nmatrix = twoPositionsToNormalizedMatrix(startpos, endpos);
        updateSelectionBox(nmatrix);
        if (selection) {
            selection(matrix, nmatrix, startpos, endpos);
        }
    }
    function mouseUp(evt) {
        evt.preventDefault();
        decorations.removeListener('mousemovec', mouseMove);
        removeSelectionBox();
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
        updateSelectionBox(nmatrix);
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
    Zoom to a given position.
*/
GroupViewer.prototype.pushZoom = function (matrix) {
    var documentData = this.documentData,
        z = this.dimensions[0] / matrix[0],
        zy = this.dimensions[1] / matrix[5],
        mat = mat4.create(matrix);
    
    // we want uniform scaling
    if (z > zy) {
        z = zy;
    }
    mat[0] = z;
    mat[5] = z;
    mat[10] = z;
    mat[12] *= -z;
    mat[13] *= -z;
    mat[14] *= -z;
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
        documentData = group.documentData;
    if (this.unhookFromGroup) {
        this.unhookFromGroup();
    }
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
    
    this.zoomStack = [mat4.identity()];
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
    console.log('regenerate all');
    var documentData = this.documentData,
        children = this.children,
        that = this,
        zoomMat = this.zoomStack[this.zoomStack.length - 1];
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
    children.positions.setDimensions(documentData.dimensions);
    children.positions.setMatrix(mat4.identity());
    children.positions.setLayout(documentData);
    forEachProperty(documentData.positions, function (c, name) {
        // regenerate it
        var pos = new (domvisual.DOMElement)({}),
            res = convertScaleToSize(mat4.multiply(zoomMat, c.matrix, mat4.create())),
            zoomedMat;

        pos.setDimensions(res.dimensions);
        pos.setMatrix(res.matrix);
        pos.setClass('positionbox');
        children.positions.addChild(pos, name);
    });    
    // selection    
};



exports.GroupViewer = GroupViewer;
