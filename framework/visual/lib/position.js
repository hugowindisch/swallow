/**
    position.js
    Copyright (C) 2012 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
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

/**
* Returns a rect that fully encloses the result of applying the provided
* matrix to a (1x1) rectangle.
* @param {mat4} m The matrix
* @returns {array} An array of two vec3 that give the topleft and bottom right
*               corners of the enclosing rect.
*/
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

/**
* Converts a rect to a matrix that would transform a 1x1 element to the rect.
* @param {array} r An array of two vec3 giving the topleft and bottomright
*                   corners of the rect to transform.
*/
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
* @constructor Constructs a position.
* @param {mat4} The matrix that positions a 1x1x1 element
* @param {Object} snapping The snapping mode:
*            left : % px auto cpx
*            right: % px auto cpx
*            width: % px auto
*            top: % px auto cpx
*            bottom: % px auto cpx
*            height: % px auto
* @param {Number} An opacity to apply on that position
*/
function Position(matrix, snapping, opacity) {
    this.matrix = matrix;
    this.snapping = snapping;
    this.opacity = opacity;
    var srcRect = this.srcRect = getEnclosingRect(matrix);
    this.srcExt = vec3.subtract(srcRect[1], srcRect[0], vec3.create());
}

/**
* Checks if this position is fully constrained.
* @private
*/
Position.prototype.isUnconstrained = function () {
    var snapping = this.snapping;
    return snapping.width === 'auto' || snapping.height === 'auto';
};

/**
* Computes the rects in the context of the specified container dimensions.
* @private
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
* Computes the matrix in the context of the specified container dimensions.
* @private
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
* @constructor Constructs a layout that essentially consists in a collection of
*               named positions.
* @param {vec3} dimensions  The dimensions of the layout
* @param {Object} positionData The position map (name: Position).
*/
function Layout(dimensions, positionData) {
    this.dimensions = dimensions;
    this.positions = {};
    this.build(positionData);
}

/**
* @private
*/
Layout.prototype.build = function (positionData) {
    var that = this;
    forEachProperty(positionData, function (pos, posname) {
        that.setPosition(
            posname,
            new Position(pos.matrix, pos.snapping, pos.opacity)
        );
    });
};

/**
* @private
*/
Layout.prototype.setPosition = function (name, position) {
    this.positions[name] = position;
};

/**
* Removes the scaling from a matrix (so that its directing vectors have a length
* of 1).
* @param {mat4} matrix The matrix to modify
* @returns {Object} matrix will be the modified matrix and dimensions will be
*                   the extracted dimensions.
*/
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
* Applies the layout.
* @private
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
* Computes the reverse dimensioning of a container.
* @private
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
