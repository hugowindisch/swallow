/**
    selectionbox.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function SelectionBox(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.SelectionBox);

    var children = this.children,
        that = this;

    // set a default content matrix (this is not really needed in real
    // use cases)
    this.contentMatrix = mat4.create(this.matrix);
    this.contentMatrix[0] = this.dimensions[0];
    this.contentMatrix[5] = this.dimensions[1];
    this.contentMatrix[10] = this.dimensions[2];

    function makeHandler(box, fcn) {
        box.setCursor('crosshair');
        box.on('mousedown', function (evt) {
            // snapshot the dimensions
            var matrix = that.contentMatrix,
                rect = that.contentRect,
                dimensions = vec3.create([matrix[0], matrix[5], matrix[10]]),
                mat = that.getFDM(),
                startpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]),
                transform = mat4.identity(),
                endpos;
            // prevent crap from happening
            evt.preventDefault();
            evt.stopPropagation();
            function mouseMove(evt) {
                mat = that.getFDM();
                evt.preventDefault();
                evt.stopPropagation();
                endpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]);
                var delta = vec3.subtract(endpos, startpos, vec3.create()),
                    newmat,
                    res;

                transform = fcn(matrix, rect, delta, dimensions, evt.shiftKey, evt.ctrlKey);
                newmat = mat4.multiply(transform, matrix, mat4.create());
                that.updateRepresentation(newmat);
                that.emit('preview', transform);
            }

            box.once('mouseupc', function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                box.removeListener('mousemovec', mouseMove);
                // the position and matrix of our container is what we need
                that.emit('transform', transform);
            });
            box.on('mousemovec', mouseMove);
        });
    }

    function getScaling(rFrom, rTo) {
        var sFrom = vec3.subtract(rFrom[1], rFrom[0], vec3.create()),
            sTo = vec3.subtract(rTo[1], rTo[0], vec3.create()),
            s = [sTo[0] / sFrom[0], sTo[1] / sFrom[1], 1];

        if (isNaN(s[0])) {
            s[0] = 0;
        }
        if (isNaN(s[1])) {
            s[1] = 0;
        }

        return s;
    }

    function getRectTransform(rFrom, rTo) {
        var transform = mat4.identity(),
            s = getScaling(rFrom, rTo);
        mat4.translate(transform, [rTo[0][0], rTo[0][1], 0]);
        mat4.scale(transform, s);
        mat4.translate(transform, [-rFrom[0][0], -rFrom[0][1], 0]);

        return transform;
    }

    function getConstrainedSize(rFrom, rTo) {
        var s = getScaling(rFrom, rTo),
            sTo = vec3.subtract(rTo[1], rTo[0], vec3.create()),
            abs = Math.abs;
        if (abs(s[0]) < abs(s[1])) {
            sTo[1] = sTo[1] * s[0] / s[1];
        } else {
            sTo[0] = sTo[0] * s[1] / s[0];
        }
        return sTo;
    }

    makeHandler(children.topLeft, function (matrix, rect, delta, dimensions, symmetrical, constrained) {
        var tr = [vec3.create(rect[0]), vec3.create(rect[1])],
            cs;

        vec3.add(tr[0], delta);
        tr[0] = that.snapPositionToGrid(tr[0]);
        if (constrained) {
            cs = getConstrainedSize(rect, tr);
            tr[0][0] = tr[1][0] - cs[0];
            tr[0][1] = tr[1][1] - cs[1];
        }
        if (symmetrical) {
            vec3.add(tr[1], vec3.subtract(rect[0], tr[0], vec3.create()));
        }

        return getRectTransform(rect, tr);
    });

    makeHandler(children.topRight, function (matrix, rect, delta, dimensions, symmetrical, constrained) {
        var tr = [vec3.create(rect[0]), vec3.create(rect[1])],
            cs,
            po = [tr[1][0], tr[0][1], 0],
            p = vec3.create(po),
            d;

        vec3.add(p, delta);
        p = that.snapPositionToGrid(p);
        tr[1][0] = p[0];
        tr[0][1] = p[1];
        if (constrained) {
            cs = getConstrainedSize(rect, tr);
            tr[1][0] = tr[0][0] + cs[0];
            tr[0][1] = tr[1][1] - cs[1];
        }
        if (symmetrical) {
            p = [tr[1][0], tr[0][1], 0];
            d = vec3.subtract(po, p, vec3.create());
            tr[0][0] += d[0];
            tr[1][1] += d[1];
        }

        return getRectTransform(rect, tr);
    });

    makeHandler(children.bottomRight, function (matrix, rect, delta, dimensions, symmetrical, constrained) {
        var tr = [vec3.create(rect[0]), vec3.create(rect[1])],
            cs;

        vec3.add(tr[1], delta);
        tr[1] = that.snapPositionToGrid(tr[1]);
        if (constrained) {
            cs = getConstrainedSize(rect, tr);
            tr[1][0] = tr[0][0] + cs[0];
            tr[1][1] = tr[0][1] + cs[1];
        }
        if (symmetrical) {
            vec3.add(tr[0], vec3.subtract(rect[1], tr[1], vec3.create()));
        }

        return getRectTransform(rect, tr);
    });

    makeHandler(children.bottomLeft, function (matrix, rect, delta, dimensions, symmetrical, constrained) {
        var tr = [vec3.create(rect[0]), vec3.create(rect[1])],
            cs,
            po = [tr[0][0], tr[1][1], 0],
            p = vec3.create(po),
            d;

        vec3.add(p, delta);
        p = that.snapPositionToGrid(p);
        tr[0][0] = p[0];
        tr[1][1] = p[1];
        if (constrained) {
            cs = getConstrainedSize(rect, tr);
            tr[0][0] = tr[1][0] - cs[0];
            tr[1][1] = tr[0][1] + cs[1];
        }
        if (symmetrical) {
            p = [tr[0][0], tr[1][1], 0];
            d = vec3.subtract(po, p, vec3.create());
            tr[1][0] += d[0];
            tr[0][1] += d[1];
        }

        return getRectTransform(rect, tr);
    });

}
SelectionBox.prototype = new (domvisual.DOMElement)();
SelectionBox.prototype.setContentRectAndMatrix = function (rect, matrix) {
    this.contentMatrix = matrix;
    this.contentRect = rect;
    this.updateRepresentation(this.contentMatrix);
};
// hack (for the fact that we are not transfomed the same way as the content we manipulate)
SelectionBox.prototype.getFDM = function () {
    return this.parent.getFullDisplayMatrix(true);
};
// hack (for the fact that we are not transfomed the same way as the content we manipulate)
SelectionBox.prototype.transformContentMatrix = function (matrix) {
    return matrix;
};
SelectionBox.prototype.snapPositionToGrid = function (pos) {
    return pos;
};
SelectionBox.prototype.updateRepresentation = function (contentMatrix) {
    var mat = this.transformContentMatrix(contentMatrix),
        res = visual.convertScaleToSize(mat),
        resMatrix = res.matrix,
        resDimensions = res.dimensions;
    this.setDimensions(resDimensions);
    this.setMatrix(resMatrix);
};
exports.SelectionBox = SelectionBox;
