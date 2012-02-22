/**
    position.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/



/*
Position & Layout
=================
- A super cool in css is that the position of an element depends on the styles
applied to itself when it uses absolute positionning

- Sticking to CSS concepts is probably a good thing in general

NOTE: CLIPPING OF WHAT'S OUTSIDE THE SIZE OF A COMPONENT IS INDEPENDENT
    CLIP: SHOW | HIDE | SCROLL
    
Kinds of position:
------------------
- Flow (CSS2)
    Inline | Block
    
- Absolute (no rotation, use left,right width, height) (CSS2) (no scaling... some stuff inside this box may be scaled)
    Snapping of 4 edges (none, left, right)
        Centering in X or Y
            {
                leftTo: none|left|right|center
                rightTo: none|left|right|center
                centerXTo: none|left|right|center
                topTo: none|top|bottom|center
                bottomTo: none|top|bottom|center
                centerYTo: none|top|bottom|center
            }

- Transform (use a 3d transform) (CSS3)
    (this always uses the authored position/size vs the authoring container size)

    SCALE vs SIZE 
        (for SIZE we must extract the scaling factors, resize the content and
        relayout children)
    SCALE: DISTORT | FITW | FITH | SHOWALL | COVER | NONE
    
    (if NONE, we extract the scaling factor


Stuff we should be able to do
-----------------------------
- A separator widget (this would work on the outer container's layout)
    (this has implications... namingly, that )
- An absolutely positionned container that scales its content
- Centering an auto length fixed width column

- Two auto length columns which length is determined by the tallest (wha!!!!)


===================================
A MATRIX has no effect on layout: it does not change the size of the content
    it simply graphically moves it around.
    
THINGS THAT CHANGE THE SIZE OF THE CONTENT TRIGGER A RE-LAYOUT ON THE
ITEM THAT CHANGED SIZE -> "CONTENTSIZEDIRTY" -> RE LAYOUT

What can trigger a CONTENTSIZEDIRTY?
- IF the box is AUTOWIDTH or AUTOHEIGHT
    -> A CONTENT CHANGE
    well.... ANY dirtying in ANY child of such a box MAY affect the
    content size... so this case is relatively problematic...
    
    BUT: ??? sizing could be ALWAYS relative to the authored size ????
        if we are 'auto' size

- In any other cases, a setPosition on a parent 

*****************
layout = mindfuck

++++++++++++++++++++++++++++++++++++++++++++++++++++++
MOre thoughts:
- autoWidth, autoHeight:
    this is a property of the content NOT a property of the POSITION
- no matter the autowidth, autoHeight, we always have a dimension and do
    the swagup layout according to that
- we can (if we want) 


So we have, per element:
a MATRIX (that may or not have some scaling)
a SIZE (that is our dimensions)
getContentDimensions()


THIS IS USEFUL IF WE DEFINE OUR POSITION AS FLOW... IT SAYS: FLOW ACCORDING TO
OUR CONTENT
    autoWidth 
    autoHeight
    
    ... so maybe it should ONLY be used for FLOW
(so the decsion of APPLYING dimensions to the 

But we could always interrogate our content size and resize ourselves according to
that


*/
var utils = require('utils'),
    glmatrix = require('glmatrix'),
    dirty = require('./dirty'),
    setDirty = dirty.setDirty,
    isString = utils.isString,
    isObject = utils.isObject,
    forEachProperty = utils.forEachProperty;

/**
    matrix:
        a matrix (mat4) that positions a unity rectangle in space
        (only x,y, sx sy are used to determine w & h and x & y of
        the block we are positioning)
        
    snapping: (default is none everywhere)
            {
                leftTo: left|right|center
                rightTo: left|right|center
                centerXTo: left|right|center
                topTo: top|bottom|center
                bottomTo: top|bottom|center
                centerYTo: top|bottom|center
            }

----------
- The container that updates this layout and sees this in one of
    its children must:
    
    - convert it to position styles, and apply these styles
    - dirty the layout of this children in most cases (so why not, always!)
   

*/
function AbsolutePosition(matrix, snapping) {
    this.matrix = matrix; // should be non rotated
    this.snapping = snapping;
}
AbsolutePosition.prototype.dirtyLayout = function () {
    return true;
};
AbsolutePosition.prototype.compute = function (
    containerDimensions, 
    layoutDimensions
) {
    var snapping = this.snapping,
        matrix = this.matrix,
        outm = glmatrix.mat4.identity(),
        delta;
        
    if (snapping.leftTo === 'right') {
        // both left and right snapped to right (the width will not change)
        if (snapping.rightTo === 'right') {
            // width unchanged,
            // left unchanged
            // hook right side
            outm[0] = matrix[0];
            outm[12] = containerDimensions[0] - (layoutDimensions[0] - matrix[12]);
        } else if (snapping.righttTo === 'left') {
            delta = containerDimensions[0] - layoutDimensions[0];
            outm[12] = matrix[12] + delta;
            outm[0] = matrix[0] - 2 * delta;
        } else {
            outm[0] = matrix[0];
            outm[12] = matrix[12] + delta;            
        }
    } else if (snapping.leftTo === 'left') {
        if (snapping.rightTo === 'left') {
            // really nothing to do here
            outm[0] = matrix[0];
            outm[12] = matrix[12];
        } else if (snapping.rightTo === 'right') {
            delta = containerDimensions[0] - layoutDimensions[0];
            outm[12] = matrix[12];
            outm[0] = matrix[0] + delta;
        } /*else {
            // .. ?? .. does this mean something
        }*/
    }

    if (snapping.topTo === 'bottom') {
        // both top and bottom snapped to bottom (the width will not change)
        if (snapping.bottomTo === 'bottom') {
            // width unchanged,
            // top unchanged
            // hook bottom side
            outm[5] = matrix[5];
            outm[13] = containerDimensions[1] - (layoutDimensions[1] - matrix[13]); 
        } else if (snapping.bottomtTo === 'top') {
            delta = containerDimensions[1] - layoutDimensions[1];
            outm[13] = matrix[13] + delta;
            outm[5] = matrix[5] - 2 * delta;
        } else {
            outm[5] = matrix[5];
            outm[13] = matrix[13] + delta;            
        }
    } else if (snapping.topTo === 'top') {
        if (snapping.bottomTo === 'top') {
            // really nothing to do here
            outm[5] = matrix[5];
            outm[13] = matrix[13];
        } else if (snapping.bottomTo === 'bottom') {
            delta = containerDimensions[1] - layoutDimensions[1];
            outm[13] = matrix[13];
            outm[5] = matrix[5] + delta;
        } /*else {
            // .. ?? .. does this mean something
        }*/
    }

    return outm;
};

/**
    matrix:
        a matrix (mat4) that positions a unity rectangle in space
        
    scalemode:
        'distort':
            compute a matrix that will show all my content distorted in
            the computed box
        'fitw':
            compute a matrix that will show my non distorted content 
        'fith'
        'showall'
        'cover'
        
    size:
        scaling is removed (from the matrix) and converted to
            a resize of the content. Other transfos are applied
        
        
----------
- The container that updates this layout and sees this in one of
    its children must:
    
    - convert it to position styles, and apply these styles
    - dirty the layout of this children if 'size' is used
        
*/
function TransformPosition(matrix, scalemode) {
    this.matrix = matrix;
    this.scalemode = scalemode || 'distort';
}
TransformPosition.prototype.dirtyLayout = function () {
    return this.scalemode === 'size';
};
/**
    
*/
TransformPosition.prototype.compute = function (
    containerDimensions, 
    layoutDimensions
) {
    return this['compute' + this.scalemode](containerDimensions, layoutDimensions);    
};

function computeScaling(
    containerDimensions, 
    layoutDimensions
) {
    var i = 0,
        scale = [];
    // compute the scaling in x and y
    for (i = 0; i < 2; i += 1) {
        scale[i] = containerDimensions[i] / layoutDimensions[i];
    }
    scale[2] = 1;
    return scale;
}

TransformPosition.prototype.computedistort = function (
    containerDimensions, 
    layoutDimensions
) {
    var i = 0,
        scale = computeScaling(containerDimensions, layoutDimensions),
        out = glmatrix.mat4.identity();
    glmatrix.mat4.scale(out, scale);
    glmatrix.mat4.multiply(out, this.matrix, out);
    
    return out;
};
TransformPosition.prototype.computefitw = function (
    containerDimensions, 
    layoutDimensions
) {
    var i = 0,
        scale = computeScaling(containerDimensions, layoutDimensions),
        out = glmatrix.mat4.identity();
        
    scale[1] = scale[0];
    glmatrix.mat4.scale(out, scale);
    glmatrix.mat4.multiply(out, this.matrix, out);
    
    return out;
};
TransformPosition.prototype.computefith = function (
    containerDimensions, 
    layoutDimensions
) {
    var i = 0,
        scale = computeScaling(containerDimensions, layoutDimensions),
        out = glmatrix.mat4.identity();
        
    scale[0] = scale[1];
    glmatrix.mat4.scale(out, scale);
    glmatrix.mat4.multiply(out, this.matrix, out);
    
    return out;
};
TransformPosition.prototype.computeshowall = function (
    containerDimensions, 
    layoutDimensions
) {
    var i = 0,
        scale = computeScaling(containerDimensions, layoutDimensions),
        out = glmatrix.mat4.identity();
        
    if (scale[0] > scale[1]) {
        scale[0] = scale[1];
    } else {
        scale[1] = scale[0];    
    }
    glmatrix.mat4.scale(out, scale);
    glmatrix.mat4.multiply(out, this.matrix, out);
    
    return out;
};
TransformPosition.prototype.computecover = function (
    containerDimensions, 
    layoutDimensions
) {
    var i = 0,
        scale = computeScaling(containerDimensions, layoutDimensions),
        out = glmatrix.mat4.identity();
        
    if (scale[0] > scale[1]) {
        scale[1] = scale[0];
    } else {
        scale[0] = scale[1];
    }
    glmatrix.mat4.scale(out, scale);
    glmatrix.mat4.multiply(out, this.matrix, out);
    
    return out;
};

/**
    This is a layout that essentially consists in a collection of named
    positions.
*/
function Layout(dimensions, positionData) {
    this.dimensions = dimensions;
    this.positions = {};
    this.build(positionData);
}

function deserializePosition(pos) {
    switch (pos.type) {
    case 'AbsolutePosition':
        return new AbsolutePosition(pos.matrix, pos.snapping);
    case 'TransformPosition':
        return new TransformPosition(pos.matrix, pos.scalemode);
    default:
        throw new Error("Invalid position type " + pos.type);
    }
}

Layout.prototype.build = function (positionData) {
    var that = this;
    forEachProperty(positionData, function (pos, posname) {
        that.setPosition(posname, deserializePosition(pos));
    });    
};

Layout.prototype.setPosition = function (name, position) {
    this.positions[name] = position;
};


function convertScaleToSize(matrix) {
    var v1 = [matrix[0], matrix[4], matrix[8]],
        v2 = [matrix[1], matrix[5], matrix[9]],
        v3 = [matrix[2], matrix[6], matrix[10]],
        l1 = glmatrix.vec3.length(v1),
        l2 = glmatrix.vec3.length(v2),
        l3 = glmatrix.vec3.length(v3),
        resmat = glmatrix.mat4.scale(matrix, [1 / l1, 1 / l2, 1 / l3], glmatrix.mat4.create()),
        resdim = [ l1, l2, l3];

    return { matrix: resmat, dimensions: resdim };
}

/**
    Applies the layout.
    In the context of DOM this will transform 'positions' to actual styles.
    
    
    
    flow position:
        Nothing to do I think 
        
    absolute position:
        This may change width/height (i.e. SIZE the content)
        
*/
function applyLayout(containerDimensions, layout, v) {
    if (layout) {
        var positions = layout.positions,
            layoutDimensions = layout.dimensions,
            pos = v.getPosition(),
            res,
            matrix;
        if (isString(pos)) {
            pos = positions[pos];
        }
        // if we know what to do with that
        // note: it is totally valid not to have a position. When we don't have
        // a position, our dimensions and matrix remain as they are.
        if (isObject(pos)) {
            matrix = pos.compute(containerDimensions, layoutDimensions);
            if (matrix) {
                if (!v.scalingEnabled) {
                    res = convertScaleToSize(matrix);
                    v.setMatrix(res.matrix);
                    v.setDimensions(res.dimensions);
                } else {
                    // this is probably NOT best done here
                    glmatrix.mat4.scale(matrix, [1 / v.dimensions[0], 1 / v.dimensions[1], 1]);
                    v.setMatrix(matrix);
                }
            }
        }
    }
}


// library interface
exports.Layout = Layout;
exports.applyLayout = applyLayout;
exports.AbsolutePosition = AbsolutePosition;
exports.TransformPosition = TransformPosition;
exports.convertScaleToSize = convertScaleToSize;
exports.deserializePosition = deserializePosition;
