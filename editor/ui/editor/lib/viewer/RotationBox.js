/**
    RotationBox.js

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
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function RotationBox(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.RotationBox);

    var children = this.children,
        that = this;

    function computeAngle(pos, center) {
        var dx = pos[0] - center[0],
            dy = pos[1] - center[1],
            h = Math.sqrt(dx * dx + dy * dy),
            a = 0;
        if (h > 0.5) {
            a = Math.acos(dx / h);
            if (dy < 0) {
                a = 2 * Math.PI - a;
            }
        }
        return a;
    }

    // FIXME: this code is duplicated from selectionbox -- begin
    function makeDragHandler(box) {
        box.setCursor('pointer'
        ).on('mousedown', function (evt) {
            var moved = false,
                matrix = that.contentMatrix,
                rect = that.contentRect,
                mat = that.getFDM(),
                startpos = mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]);

            evt.preventDefault();
            evt.stopPropagation();
            this.blurFocusedElement();
            function getMat(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                var endpos = mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]),
                    delta = vec3.subtract(endpos, startpos, vec3.create());
                return that.getSnappedTransform(delta, evt.ctrlKey, rect);
            }
            box.on('mousemovec', function (evt) {
                var newMat = getMat(evt);
                moved = true;
                that.updateRepresentation(mat4.multiply(newMat, matrix, mat4.create()));
                that.emit('preview', newMat);

            });
            box.once('mouseupc', function (evt) {
                if (moved) {
                    that.emit('transform', getMat(evt));
                } else {
                    that.emit('toggle');
                }
                box.removeAllListeners('mousemovec');
            });

        });
    }
    // -- end

    function makeHandler(box) {
        box.setCursor('move');
        box.on('mousedown', function (evt) {
            var matrix = that.contentMatrix,
                dimensions = vec3.create([matrix[0], matrix[5], matrix[10]]),
                center = vec3.create([matrix[12] + dimensions[0] / 2, matrix[13] + dimensions[1] / 2, 0]),
                mat = that.getFDM(),
                startpos = mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]),
                startAngle = computeAngle(startpos, center),
                transform = mat4.identity(),
                endpos,
                endAngle;
            // prevent crap from happening
            this.blurFocusedElement();
            evt.preventDefault();
            evt.stopPropagation();
            that.setVisible(false);

            function mouseMove(evt) {
                mat = that.getFDM();
                evt.preventDefault();
                evt.stopPropagation();
                endpos = mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]);
                endAngle = computeAngle(endpos, center);
                var delta = vec3.subtract(startpos, endpos, vec3.create()),
                    newmat,
                    res;

                transform = mat4.identity();

                mat4.translate(transform, center);
                mat4.rotate(transform, endAngle - startAngle, [0, 0, 1]);
                mat4.translate(transform, [-center[0], -center[1], 0]);
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
    makeHandler(children.topLeft);
    makeHandler(children.topRight);
    makeHandler(children.bottomLeft);
    makeHandler(children.bottomRight);

    makeDragHandler(this.getChild('topDrag'));
    makeDragHandler(this.getChild('rightDrag'));
    makeDragHandler(this.getChild('bottomDrag'));
    makeDragHandler(this.getChild('leftDrag'));

    // set a default content matrix (this is not really needed in real
    // use cases)
    this.contentMatrix = mat4.create(this.matrix);
    this.contentMatrix[0] = this.dimensions[0];
    this.contentMatrix[5] = this.dimensions[1];
    this.contentMatrix[10] = this.dimensions[2];

}
RotationBox.prototype = new (domvisual.DOMElement)();
RotationBox.prototype.theme = new (visual.Theme)({
    dragManipulator: {
        jsData: {
            backgroundColor: {
                r: 200,
                g: 200,
                b: 200,
                a: 0.5
            }
        }
    }
});

RotationBox.prototype.setContentRectAndMatrix = function (rect, matrix) {
    this.contentMatrix = matrix;
    this.contentRect = rect;
    this.updateRepresentation(this.contentMatrix);
};
// hack (for the fact that we are not transfomed the same way as the content we manipulate)
RotationBox.prototype.getFDM = function () {
    return this.parent.getFullDisplayMatrix(true);
};
// hack (for the fact that we are not transfomed the same way as the content we manipulate)
RotationBox.prototype.transformContentMatrix = function (matrix) {
    return matrix;
};
RotationBox.prototype.updateRepresentation = function (contentMatrix) {
    var mat = this.transformContentMatrix(contentMatrix),
        res = visual.convertScaleToSize(mat),
        resMatrix = res.matrix,
        resDimensions = res.dimensions;
    this.setDimensions(resDimensions);
    this.setMatrix(resMatrix);
};
exports.RotationBox = RotationBox;
