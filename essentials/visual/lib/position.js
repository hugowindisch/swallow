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

function convertScaleToSize(matrix, contentDimension) {
    var v1 = [matrix[0], matrix[4], matrix[8]],
        v2 = [matrix[1], matrix[5], matrix[9]],
        l1 = glmatrix.vec3.length(v1),
        l2 = glmatrix.vec3.length(v2),
        resmat = glmatrix.mat4.scale(matrix, [1 / l1, 1 / l2, 0], []),
        resdim = [ contentDimension[0] * l1, contentDimension[1] * l2, 0];
        
    return { matrix: matrix, dimensions: resdim };
}


/**
    This is like the positioning styles.
    ... not super certain how to handle SIZE, snapping, etc.
    
    NOTE: it's the visuals that need to know how to transform a position
        to something that make sense for them
        
The container that redoes its layout and sees this in one of its children must:
    - convert it to position styles, and apply these styles

*/
function FlowPosition(matrix, inline) {
    this.matrix = matrix;
    this.inline = inline;
}

FlowPosition.prototype.dirtyLayout = function () {
    return false;
};
FlowPosition.prototype.compute = function (
    containerDimensions, 
    layoutDimensions,
    contentDimensions
) {
    return null;
};

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
function AbsolutePosition(matrix, snapping, dontScale) {
    this.matrix = matrix; // should be non rotated
    this.snapping = snapping;
    this.dontScale = (dontScale === true);
}
AbsolutePosition.prototype.dirtyLayout = function () {
    return true;
};
AbsolutePosition.prototype.compute = function (
    containerDimensions, 
    layoutDimensions,
    contentDimensions
) {
    var snapping = this.snapping,
        matrix = this.matrix,
        box = {
            left: null,
            top: null, 
            right: null, 
            bottom: null, 
            width: null, 
            height: null
        },
        outm = glmatrix.mat4.identity(),
        outd = {},
        delta;
/**        
// we already so much need software layouting that doing this using automatic
// css stuff is futile...        
    // note : autosize absolutely prevents both sides from being hooked
    // I will not support the center based options for now
    if (snapping.leftTo === 'right') {
        // both left and right snapped to right (the width will not change)
        if (snapping.rightTo === 'right') {
            // width unchanged,
            // left unchanged
            // hook right side
            box.right = layoutDimensions[0] - (matrix[0] + matrix[12]);
        } else if (righttTo === 'left') {
            delta = containerDimensions[0] - layoutDimensions[0];
            box.left = matrix[12] + delta;
            box.width = matrix[0] + delta;
        } else {
// IT IS POSIBLE THAT    
            box.left     
        }
        
    } else if (snapping.leftTo === 'left') {
        if (snapping.rightTo === 'left') {
            // really nothing to do here
        } else if (snapping.rightTo === 'right') {
            box.left = matrix[12];
            box.right = layoutDimensions[0] - (matrix[12] + matrix[0]);
            // box.width is implicitly changed... we could
            // change it be
        }
    } else {
// THIS IS POSSIBLE    
    }
*/
// NOTE: this could be all done by scaling and scaling removed aftwards
/*    if (snapping.leftTo === 'right') {
        // both left and right snapped to right (the width will not change)
        if (snapping.rightTo === 'right') {
            // width unchanged,
            // left unchanged
            // hook right side
            outm[12] = containerDimensions[0] - (layoutDimensions[0] - matrix[12]); 
        } else if (righttTo === 'left') {
            delta = containerDimensions[0] - layoutDimensions[0];
            outm[12] = matrix[12] + delta;
            outd[0] = matrix[0] + delta;
        } else {
            delta = containerDimensions[0] - layoutDimensions[0];
            outm[12] = matrix[12] + delta;            
        }
    } else if (snapping.leftTo === 'left') {
        if (snapping.rightTo === 'left') {
            // really nothing to do here
        } else if (snapping.rightTo === 'right') {
            delta = containerDimensions[0] - layoutDimensions[0];
            outm[12] = matrix[12];
            outd[0] = matrix[0] + delta;
        } else {
            // .. ?? .. does this mean something
        }
    } else {
        // THIS IS POSSIBLE    ??
    }*/
// Here I simply compute a matrix. If we don't want scaling (but sizing),
// we can only remove it!    
    if (snapping.leftTo === 'right') {
        // both left and right snapped to right (the width will not change)
        if (snapping.rightTo === 'right') {
            // width unchanged,
            // left unchanged
            // hook right side
            outm[12] = containerDimensions[0] - (layoutDimensions[0] - matrix[12]); 
        } else if (snapping.righttTo === 'left') {
            delta = containerDimensions[0] - layoutDimensions[0];
            outm[12] = matrix[12] + delta;
            outm[0] = containerDimensions[0] / layoutDimensions[0];
        } else {
            outm[12] = matrix[12] + delta;            
        }
    } else if (snapping.leftTo === 'left') {
        if (snapping.rightTo === 'left') {
            // really nothing to do here
        } else if (snapping.rightTo === 'right') {
            delta = containerDimensions[0] - layoutDimensions[0];
            outm[12] = matrix[12];
            outd[0] = (matrix[0] + delta) / matrix[0];
        } /*else {
            // .. ?? .. does this mean something
        }*/
    } /*else {
        // THIS IS POSSIBLE    ??
    }*/

    // if size mode is wanted, we want to 'unscale' the matrix... i.e.
    // extract the scaling and transform it to a sizing of the content
    if (this.dontScale) {
        return convertScaleToSize(outm, contentDimensions);
    }

    return { matrix: outm, dimensions: outd };
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
function TransformPosition(matrix, scalemode, dontScale) {
    this.matrix = matrix;
    this.scalemode = scalemode || 'distort';
    this.dontScale = (dontScale === true);
}
TransformPosition.prototype.dirtyLayout = function () {
    return this.scalemode === 'size';
};
/**
    
*/
TransformPosition.prototype.compute = function (
    containerDimensions, 
    layoutDimensions,
    contentDimension
) {
    var matrix = this['compute' + this.scalemode](containerDimensions, layoutDimensions);
    function test(mat) {
        var v1 = [0, 0, 0],
            v2 = [1, 1, 0];
        window.console.log('original ' + layoutDimensions.toString());
        window.console.log('destination ' + containerDimensions.toString());
        window.console.log(glmatrix.mat4.multiplyVec3(mat, v1, []));
        window.console.log(glmatrix.mat4.multiplyVec3(mat, v2, []));
    }
    test(this.matrix);
    test(matrix);
    
    // at this point, we have a matrix that takes a unity rectangle and
    // moves it to its expected position. The problem is that the content
    // that we want to position is not 1x1 so we mut add some scaling to the matrix
    glmatrix.mat4.scale(matrix, [1 / contentDimension[0], 1 / contentDimension[1], 1]);
    test(matrix);
    
    // if size mode is wanted, we want to 'unscale' the matrix... i.e.
    // extract the scaling and transform it to a sizing of the content
    if (this.dontScale) {
        return convertScaleToSize(matrix, contentDimension);
    }
    
    return { matrix: matrix };
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

Layout.prototype.build = function (positionData) {
    var that = this;
    forEachProperty(positionData, function (pos, posname) {
        switch (pos.type) {
        case 'AbsolutePosition':
            that.setPosition(posname, new AbsolutePosition(pos.matrix, pos.snapping, true));
            break;
        case 'FlowPosition':
            that.setPosition(posname, new FlowPosition(pos.matrix, pos.inline, true));
            break;
        case 'TransformPosition':
            that.setPosition(posname, new TransformPosition(pos.matrix, pos.scalemode, true));
            break;
        default:
            throw new Error("Invalid position type " + pos.type);
        }
    });    
};

Layout.prototype.setPosition = function (name, position) {
    this.positions[name] = position;
};

/**
    Applies the layout.
    In the context of DOM this will transform 'positions' to actual styles.
    
    
    
    flow position:
        Nothing to do I think 
        
    absolute position:
        This may change width/height (i.e. SIZE the content)
        
*/
function applyLayout(containerDimensions, layout, visuals) {
    var positions = layout.positions,
        layoutDimensions = layout.dimensions;
    forEachProperty(visuals, function (v) {
        var pos = v.getPosition(),
            computed;
        if (isString(pos)) {
            pos = positions[pos];
        }
        // if we know what to do with that
        if (isObject(pos)) {
            computed = pos.compute(containerDimensions, layoutDimensions, v.dimensions);
            if (computed) {
                v.applyPosition(computed.matrix, computed.dimensions);
            }
        }
    });
}


// library interface
exports.Layout = Layout;
exports.applyLayout = applyLayout;
exports.FlowPosition = FlowPosition;
exports.AbsolutePosition = AbsolutePosition;
exports.TransformPosition = TransformPosition;

