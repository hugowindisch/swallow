/**
    position.js

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var utils = require('utils'),
    glmatrix = require('glmatrix'),
    vec3 = glmatrix.vec3,
    mat4 = glmatrix.mat4,
    dirty = require('./dirty'),
    setDirty = dirty.setDirty,
    isString = utils.isString,
    isObject = utils.isObject,
    forEachProperty = utils.forEachProperty;

function getEnclosingRect(m) {
    var tv1 = mat4.multiplyVec3(m, [1, 0, 0]),
        tv2 = mat4.multiplyVec3(m, [0, 1, 0]),
        tv3 = mat4.multiplyVec3(m, [1, 1, 0]),
        tv4 = mat4.multiplyVec3(m, [0, 0, 1]),
        v1,
        v2,
        v3,
        v4,
        i,
        minpt = [],
        maxpt = [],
        min = Math.min,
        max = Math.max,
        mn,
        mx;
    for (i = 0; i < 3; i += 1) {
        v1 = tv1[i];
        v2 = tv2[i];
        v3 = tv3[i];
        v4 = tv4[i];
        mn = min(v1, v2, v3, v4);
        mx = max(v1, v2, v3, v4);
        if (maxpt[i] === undefined || mn < minpt[i]) {
            minpt[i] = mn;
        }
        if (maxpt[i] === undefined || mx > maxpt[i]) {
            maxpt[i] = mx;
        }
    }
    return [minpt, maxpt];
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

/**
    it has the following attributes:
        matrix
        left : % px auto
        right: % px auto
        width: % px auto

        top: % px auto
        bottom: % px auto
        height: % px auto
*/
function Position(matrix, snapping, opacity) {
    this.matrix = matrix;
    this.snapping = snapping;
    this.opacity = opacity;
    var srcRect = this.srcRect = getEnclosingRect(matrix);
    this.srcExt = vec3.subtract(srcRect[1], srcRect[0], vec3.create());
}

/**
    Checks if this position is fully constrained.
*/
Position.prototype.isUnconstrained = function () {
    var snapping = this.snapping;
    return snapping.width === 'auto' || snapping.height === 'auto';
};

/**
    Computes the rects in the context of the specified container dimensions.
*/
Position.prototype.computeDstRect = function (
    containerDimensions,
    layoutDimensions
) {
    var snapping = this.snapping,
        matrix = this.matrix,
        srcRect = this.srcRect,
        dstRect = [vec3.create(), vec3.create()];

    switch (snapping.left) {
    case 'px':
        dstRect[0][0] = srcRect[0][0];
        break;
    case '%':
        dstRect[0][0] = containerDimensions[0] *
            srcRect[0][0] / layoutDimensions[0];
        break;
    case 'cpx':
        dstRect[0][0] = (containerDimensions[0] / 2) -
            ((layoutDimensions[0] / 2) - srcRect[0][0]);
        break;
    }
    switch (snapping.right) {
    case 'px':
        dstRect[1][0] = containerDimensions[0] -
            (layoutDimensions[0] - srcRect[1][0]);
        break;
    case '%':
        dstRect[1][0] = containerDimensions[0] *
            srcRect[1][0] / layoutDimensions[0];
        break;
    case 'cpx':
        dstRect[1][0] = (containerDimensions[0] / 2) -
            ((layoutDimensions[0] / 2) - srcRect[1][0]);
        break;
    }
    switch (snapping.top) {
    case 'px':
        dstRect[0][1] = srcRect[0][1];
        break;
    case '%':
        dstRect[0][1] = containerDimensions[1] *
            srcRect[0][1] / layoutDimensions[1];
        break;
    case 'cpx':
        dstRect[0][1] = (containerDimensions[1] / 2) -
            ((layoutDimensions[1] / 2) - srcRect[0][1]);
        break;
    }
    switch (snapping.bottom) {
    case 'px':
        dstRect[1][1] = containerDimensions[1] -
            (layoutDimensions[1] - srcRect[1][1]);
        break;
    case '%':
        dstRect[1][1] = containerDimensions[1] *
            srcRect[1][1] / layoutDimensions[1];
        break;
    case 'cpx':
        dstRect[1][1] = (containerDimensions[1] / 2) -
            ((layoutDimensions[1] / 2) - srcRect[1][1]);
        break;
    }
    // deal with auto
    // --------------
    if (snapping.left === 'auto') {
        if (snapping.right !== 'auto') {
            switch (snapping.width) {
            case 'px':
                dstRect[0][0] = dstRect[1][0] -
                    (srcRect[1][0] - srcRect[0][0]);
                break;
            case '%':
                dstRect[0][0] = dstRect[1][0] -
                    containerDimensions[0] *
                    (srcRect[1][0] - srcRect[0][0]) /
                    layoutDimensions[0];
                break;
            case 'auto':
                // 2 auto things let's not support this right now
                break;
            }
        } else {
            // 2 or mroe auto things let's not support this right now
            throw new Error('auto not supported here yet');
        }
    } else if (snapping.right === 'auto') {
        if (snapping.left !== 'auto') {
            switch (snapping.width) {
            case 'px':
                dstRect[1][0] = dstRect[0][0] + (srcRect[1][0] - srcRect[0][0]);
                break;
            case '%':
                dstRect[1][0] = dstRect[0][0] +
                    containerDimensions[0] *
                    (srcRect[1][0] - srcRect[0][0]) /
                    layoutDimensions[0];
                break;
            case 'auto':
                // 2 auto things let's not support this right now
                break;
            }
        } else {
            // 2 or mroe auto things let's not support this right now
            throw new Error('auto not supported here yet');
        }
    }
    //
    if (snapping.top === 'auto') {
        if (snapping.bottom !== 'auto') {
            switch (snapping.height) {
            case 'px':
                dstRect[0][1] = dstRect[1][1] - (srcRect[1][1] - srcRect[0][1]);
                break;
            case '%':
                dstRect[0][1] = dstRect[1][1] -
                    containerDimensions[1] *
                    (srcRect[1][1] - srcRect[0][1]) /
                    layoutDimensions[1];
                break;
            case 'auto':
                // 2 auto things let's not support this right now
                break;
            }
        } else {
            // 2 or mroe auto things let's not support this right now
            throw new Error('auto not supported here yet');
        }
    } else if (snapping.bottom === 'auto') {
        if (snapping.top !== 'auto') {
            switch (snapping.height) {
            case 'px':
                dstRect[1][1] = dstRect[0][1] + (srcRect[1][1] - srcRect[0][1]);
                break;
            case '%':
                dstRect[1][1] = dstRect[0][1] +
                    containerDimensions[1] *
                    (srcRect[1][1] - srcRect[0][1]) /
                    layoutDimensions[1];
                break;
            case 'auto':
                // 2 auto things let's not support this right now
                break;
            }
        } else {
            // 2 or mroe auto things let's not support this right now
            throw new Error('auto not supported here yet');
        }
    }
    dstRect[1][2] = 1;
    return dstRect;
};

/**
    Computes the matrix in the context of the specified container dimensions.
*/
Position.prototype.compute = function (
    containerDimensions,
    layoutDimensions
) {
    var snapping = this.snapping,
        matrix = this.matrix,
        srcRect = this.srcRect,
        dstRect = this.computeDstRect(containerDimensions, layoutDimensions),
        scale,
        srcExt = this.srcExt,
        dstExt,
        outm = mat4.identity();

    // compute the scaling
    dstExt = vec3.subtract(dstRect[1], dstRect[0], vec3.create());
    scale = [
        srcExt[0] === 0 ? 0 : dstExt[0] / srcExt[0],
        srcExt[1] === 0 ? 0 : dstExt[1] / srcExt[1],
        1
    ];
    // now we want to compute the matrix
    mat4.translate(outm, dstRect[0]);
    mat4.scale(outm, scale);
    mat4.translate(outm, [-srcRect[0][0], -srcRect[0][1], 0]);
    mat4.multiply(outm, matrix);
    return outm;
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
        that.setPosition(
            posname,
            new Position(pos.matrix, pos.snapping, pos.opacity)
        );
    });
};

Layout.prototype.setPosition = function (name, position) {
    this.positions[name] = position;
};

function convertScaleToSize(matrix) {
    var v1 = [matrix[0], matrix[1], matrix[2]],
        v2 = [matrix[4], matrix[5], matrix[6]],
        v3 = [matrix[8], matrix[9], matrix[10]],
        l1 = vec3.length(v1),
        l2 = vec3.length(v2),
        l3 = vec3.length(v3),
        resmat = mat4.scale(matrix, [1 / l1, 1 / l2, 1 / l3], mat4.create()),
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
                    mat4.scale(
                        matrix,
                        [1 / v.dimensions[0], 1 / v.dimensions[1], 1]
                    );
                    v.setMatrix(matrix);
                }
            }
            // opacity
            if (pos.opacity) {
                v.setOpacity(pos.opacity);
            }
        }
    }
}

/**
    Computes the reverse dimensioning of a container.
*/
function computeReverseDimensioning(containerDimensions, layout, v) {
    var positions = layout.positions,
        layoutDimensions = layout.dimensions,
        pos = v.getPositionObject(),
        snapping = pos.snapping,
        requestedDimensions = v.requestedDimensions,
        res = vec3.create(containerDimensions),
        srcRect,
        dstRect,
        srcExt,
        dstExt,
        delta;
    // if we know what to do with that
    // note: it is totally valid not to have a position. When we don't have
    // a position, our dimensions and matrix remain as they are.
    if (requestedDimensions && pos !== null && !v.scalingEnabled) {
        srcRect = pos.srcRect;
        srcExt = pos.srcExt;
        dstRect = pos.computeDstRect(containerDimensions, layoutDimensions);
        dstExt = vec3.subtract(dstRect[1], dstRect[0], vec3.create());
        delta = vec3.subtract(requestedDimensions, dstExt, vec3.create());
        // the width and height must be auto to be affected
        if (pos.snapping.width === 'auto') {
            res[0] += delta[0];
        }
        if (pos.snapping.height === 'auto') {
            res[1] += delta[1];
        }
    }
    return res;
}

// library interface
exports.Layout = Layout;
exports.applyLayout = applyLayout;
exports.Position = Position;
exports.convertScaleToSize = convertScaleToSize;
exports.getEnclosingRect = getEnclosingRect;
exports.rectToMatrix = rectToMatrix;
exports.computeReverseDimensioning = computeReverseDimensioning;
