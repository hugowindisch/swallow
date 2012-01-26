/**
    selectionbox.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function SelectionBox(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config);
    this.createGroup(groups.SelectionBox);

    var children = this.children,
        that = this;
        
    function makeHandler(box, fcn) {
        box.on('mousedown', function (evt) {
            // snapshot the dimensions
            var dimensions = vec3.create(that.dimensions),
                matrix = mat4.create(that.matrix),
                mat = that.parent.getFullDisplayMatrix(true),
                startpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]),
                endpos;
            // we want to fully keep the result as a matrix
            matrix[0] = dimensions[0];
            matrix[5] = dimensions[1];
            matrix[10] = dimensions[2];
                
            function mouseMove(evt) {
                mat = that.parent.getFullDisplayMatrix(true);
                evt.preventDefault();
                endpos = glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 1]);
                var delta = vec3.subtract(startpos, endpos, vec3.create()),
                    newdim = vec3.add(dimensions, delta),
                    newmat = fcn(matrix, delta),
                    res;
                
                res = visual.convertScaleToSize(newmat);
                that.setDimensions(res.dimensions);
                that.setMatrix(res.matrix);
            }

            box.once('mouseupc', function (evt) {
                box.removeListener('mousemovec', mouseMove);
                // the position and matrix of our container is what we need
            });
            box.on('mousemovec', mouseMove);
        });
    }

    makeHandler(children.topLeft, function (matrix, delta) {
        var newmat = mat4.create(matrix);
        newmat[12] -= delta[0];
        newmat[13] -= delta[1];
        newmat[14] -= delta[2];
        newmat[0] += delta[0];
        newmat[5] += delta[1];
        newmat[10] += delta[2];
        return newmat;
    });

    makeHandler(children.topRight, function (matrix, delta) {
        var newmat = mat4.create(matrix);
        newmat[13] -= delta[1];
        newmat[14] -= delta[2];
        newmat[0] -= delta[0];
        newmat[5] += delta[1];
        newmat[10] += delta[2];
        return newmat;
    });

    makeHandler(children.bottomRight, function (matrix, delta) {
        var newmat = mat4.create(matrix);
        newmat[14] -= delta[2];
        newmat[0] -= delta[0];
        newmat[5] -= delta[1];
        newmat[10] += delta[2];
        return newmat;
    });

    makeHandler(children.bottomLeft, function (matrix, delta) {
        var newmat = mat4.create(matrix);
        newmat[12] -= delta[0];
        newmat[14] -= delta[2];
        newmat[0] += delta[0];
        newmat[5] -= delta[1];
        newmat[10] += delta[2];
        return newmat;
    });

}
SelectionBox.prototype = new (domvisual.DOMElement)();
SelectionBox.prototype.setConfigg = function (config) {
};

exports.SelectionBox = SelectionBox;
