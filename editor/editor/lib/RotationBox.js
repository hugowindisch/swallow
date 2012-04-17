/**
    RotationBox.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
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

    function makeHandler(box) {
        box.setCursor('crosshair');
        box.on('mousedown', function (evt) {
            var matrix = that.contentMatrix,
                dimensions = vec3.create([matrix[0], matrix[5], matrix[10]]),
                center = vec3.create([matrix[12] + dimensions[0] / 2, matrix[13] + dimensions[1] / 2, 0]),
                mat = that.getFDM(),
                startpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]),
                startAngle = computeAngle(startpos, center),
                transform = mat4.identity(),
                endpos,
                endAngle;
            // prevent crap from happening
            evt.preventDefault();
            evt.stopPropagation();
            that.setVisible(false);

            function mouseMove(evt) {
                mat = that.getFDM();
                evt.preventDefault();
                evt.stopPropagation();
                endpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]);
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

    // set a default content matrix (this is not really needed in real
    // use cases)
    this.contentMatrix = mat4.create(this.matrix);
    this.contentMatrix[0] = this.dimensions[0];
    this.contentMatrix[5] = this.dimensions[1];
    this.contentMatrix[10] = this.dimensions[2];

}
RotationBox.prototype = new (domvisual.DOMElement)();
RotationBox.prototype.setContentMatrix = function (matrix) {
    this.contentMatrix = matrix;
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
