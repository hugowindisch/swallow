/**
    visual.js
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
/*global define*/
var utils = require('utils'),
    events = require('events'),
    glmatrix = require('glmatrix'),
    forEachProperty = utils.forEachProperty,
    dirty = require('./dirty'),
    position = require('./position'),
    themes = require('./themes'),
    Theme = themes.Theme,
    Skin = themes.Skin,
    defaultSkin = themes.defaultSkin,
    isString = utils.isString,
    isObject = utils.isObject,
    isNumber = utils.isNumber,
    isArray = utils.isArray,
    applyLayout = position.applyLayout,
    setDirty = dirty.setDirty,
    setChildrenDirty = dirty.setChildrenDirty,
    EventEmitter = events.EventEmitter,
    defaultNameIndex = 0;

/**
* This package implements the Visual class (and other related classes)
* and functions. The Visual class is the base class of all visual elements
* that can be created with the graphic editor.
*
* @package visual
*/


/*
* Enumerates the children of a visual in depth.
* @api private
*/
function forVisualAndAllChildrenDeep(v, fcn) {
    if (fcn(v) !== true && v.children) {
        return forEachProperty(v.children, function (v) {
            return forVisualAndAllChildrenDeep(v, fcn);
        });
    }
    return false;
}

/*
* Sets the containement depth of a visual (depth from the topmost parent)
* @api private
*/
function setContainmentDepth(v, depth) {
    if (depth !== v.containmentDepth) {
        v.containmentDepth = depth;
        if (v.children) {
            forEachProperty(v.children, function (c) {
                // sets the containment depth of the children
                setContainmentDepth(c, depth + 1);
            });
        }
    }
}

/*
* Checks that a matrix has only translations.
* @api private
*/
function matrixIsTranslateOnly(matrix) {
    if (!matrix) {
        throw new Error('Invalid matrix ' + matrix);
    }
    function isOne(n) {
        return Math.round(n * 1000) === 10000;
    }
    function isZero(n) {
        return Math.round(n * 1000) === 0;
    }
    return (
        isOne(matrix[0]) &&
        isOne(matrix[5]) &&
        isOne(matrix[10]) &&

        isZero(matrix[1]) &&
        isZero(matrix[2]) &&
        isZero(matrix[4]) &&
        isZero(matrix[6]) &&
        isZero(matrix[8]) &&
        isZero(matrix[9])
    );
}

/*
* Checks the equality of two vectors (vec3).
* @api private
*/
function vec3IsEqual(v1, v2) {
    return v1 === v2 ||
        (v1 && v2 && v1[0] === v2[0] && v1[1] === v2[1] && v1[3] === v2[3]);
}

/**
* A visual element.
* It can contain other visual elements.
* It can render itself in its container (ex: the DOM).
* @param {Object} config the configuration for this visual.
* @param {Object} groupData the editor data for this visual.
* @memberOf visual
*/
function Visual(config, groupData) {
    this.containmentDepth = 0;
    // set default dimension
    this.setDimensions(groupData ? groupData.dimensions : [1, 1, 0]);
    // construct optional goup, and setup optional config
    if (groupData) {
        this.createGroup(groupData);
    }
    if (config) {
        this.setConfiguration(config);
    }
}

Visual.prototype = new EventEmitter();

/**
* Returns the description of this visual element.
* @returns The textual description of this visual element.
* @type String
*/
Visual.prototype.getDescription = function () {
    return 'Visual Component';
};

/**
* Returns a default (unique) name
* @api private
*/
Visual.prototype.getDefaultName = function () {
    var ret = 'visual' + defaultNameIndex;
    defaultNameIndex += 1;
    return ret;
};

/**
* Returns the full name of the current visual (useful for debugging). The
* full name is a dot separated string containing the names of all parents,
* ex: 'a.b.c', assuming that this visual component is named 'c', its parent
* is named 'b' and the topmost visual element is named 'a'.
* @returns the full name of this visual component.
* @type String
*/
Visual.prototype.getFullName = function () {
    var n = this.name;
    if (this.parent) {
        n = this.parent.getFullName() + '.' + n;
    }
    return n;
};

/**
* Iterates all the children.
* @returns this
* @type Visual
*/
Visual.prototype.forEachChild = function (f) {
    forEachProperty(this.children, f);
    return this;
};

/**
* Allows scaling. When a visual is moved to a given position, it
* is resized. The resizing part of the transformation can either be
* interpreted as a scaling or as a resizing.
* @param (Boolean) enable determines if scaling of sizing will be used when
*               moving this visual component to a given position.
* @returns this
* @type Visual
*/
Visual.prototype.enableScaling = function (enable) {
    enable = (enable === true);
    if (this.scalingEnabled !== enable) {
        this.scalingEnabled = enable;
        var parent = this.parent;
        if (parent) {
            parent.applyLayout(this);
        }
    }
    return this;
};

/**
* Allows (or disallows) user interactions (mouse, keyboard). Disallowing
* interactions can be used to display a component as a passive preview.
* By default, interactions are always enabled. This can be used to set a
* visual component to 'preview only' mode.
* @param {Boolean} enable Enables or disables interactions
* @returns this
*/
Visual.prototype.enableInteractions = function (enable) {
    throw new Error(
        'enableInteractions should be implemented by concrete subclasses.'
    );
};

/**
* Sets the dimension  of the visual
* (the dimensions are defined as a 3d vector)
* @param {vec3} v3 The dimensions of this visual element.
* @returns this
* @type Visual
*/
Visual.prototype.setDimensions = function (v3) {
    var dimensions = this.dimensions;
    if (!this.hasOwnProperty('dimensions') || !vec3IsEqual(this.dimensions, v3)) {
        this.dimensions = v3;
        setDirty(this, 'dimensions');
        // Keep all children in synch (in terms of position and matrix)
        this.applyLayout();
    }
    return this;
};

/**
* Checks that this visual is unsconstrained.
* @api private
*/
Visual.prototype.isUnconstrained = function () {
    return this.position === undefined || this.htmlFlowingApplySizing;
};

/**
* Sets a requested dimension. This allows a contained element to
* resize its container to fit its size under certain circumstances.
* If the container is unconstrained and that the element is at a
* position that allows the container to resize (e.g. the position has
* an auto height or an auto width), the position is unconstrained,
* and the container is free to resize itself, the dedimensioning will
* happen.
* @api private
*/
Visual.prototype.requestDimensions = function (v3) {
    var parent;
    // note: we compare with the actual dimensions, if they don't match
    // we still do everything (i.e. potentially ask our outer container
    // to do something)...
    // note: some more thought must be given to the 'reverse' resizing of
    // things.
    if (!vec3IsEqual(this.dimensions, v3)) {
        if (!v3) {
            delete this.requestedDimensions;
        } else {
            this.requestedDimensions = v3;
            if (this.isUnconstrained()) {
                // resize myself right now
                this.setDimensions(v3);
            } else {
                parent = this.parent;
                // ask my container
                parent.requestDimensions(
                    parent.getDimensionsAdjustedForContent()
                );
            }
        }
    }
    return this;
};

/**
* This will compute the dimensions from the content if possible.
* @api private
*/
Visual.prototype.getDimensionsAdjustedForContent = function () {
    //-------------------
    // for all our children
    var that = this,
        dimensions = this.dimensions,
        ret;
    forEachProperty(this.children, function (c, name) {
        if (c.requestedDimensions) {
            var pos = c.getPositionObject(),
                newd;
            if (pos !== null && pos.isUnconstrained()) {
                newd = position.computeReverseDimensioning(
                    dimensions,
                    that.layout,
                    c
                );
                if (ret === undefined || newd[0] < ret[0] || newd[1] < ret[1]) {
                    ret = newd;
                }
            }
        }
    });
    // now, we no our requested dimensions
    return ret;
};

/**
* Sets the matrix.
* Note that setting the matrix directly can have no effect if this visual
* has a 'position' (the position will regenerate the matrix).
* @param {mat4} m4 the matrix.
* @returns this
* @type Visual
*/
Visual.prototype.setMatrix = function (m4) {
    if (!(isObject(m4) || isArray(m4))) {
        throw new Error('Invalid matrix type ' + (typeof m4));
    }
    if (m4 !== this.matrix) {
        this.matrix = m4;
        setDirty(this, 'matrix');
    }
    return this;
};

/**
* Sets a simple translation matrix.
* @param {vec3} v3 The translation matrix for this visual component.
* @returns this
* @type Visual
*/
Visual.prototype.setTranslationMatrix = function (pos) {
    this.setMatrix(glmatrix.mat4.create(
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, pos[0], pos[1], pos[2], 1]
    ));
    return this;
};

/**
* Returns the matrix.
* @returns The current transformation matrix of this visual component.
* @type mat4
*/
Visual.prototype.getMatrix = function () {
    var matrix = this.matrix || glmatrix.mat4.identity();
    return matrix;
};

/**
* Returns the 'display' matrix. This can be overridden in subclasses
* that do nothing with the real matrix but and display the element differently.
* The only known case of this is when an element uses the normal html
* flowing or scrolling: the real positionning is determined by the html engine.
* @api private
*/
Visual.prototype.getDisplayMatrix = function () {
    return this.getMatrix();
};

/**
* Returns the full display matrix (i.e. the combined matrix of all parents).
* @returns the full display matrix of this component.
* @type mat4
*/
Visual.prototype.getFullDisplayMatrix = function (inverse) {
    dirty.update();
    var mat = glmatrix.mat4.set(this.getDisplayMatrix(), []),
        parent;
    for (parent = this.parent; parent; parent = parent.parent) {
        glmatrix.mat4.multiply(parent.getDisplayMatrix(), mat, mat);
    }
    if (inverse) {
        glmatrix.mat4.inverse(mat);
    }
    return mat;
};

/**
* Sets the opacity of the visual (1 = fully opaque, 0 = fully transparent).
* @param {Number} opacity A number between 0 and 1 1 being fully opaque.
* @returns this
* @type Visual
*/
Visual.prototype.setOpacity = function (opacity) {
    opacity = Number(opacity);
    if (opacity !== this.getOpacity()) {
        if (opacity >= 1) {
            delete this.opacity;
        } else {
            if (opacity < 0) {
                opacity = 0;
            }
            this.opacity = opacity;
        }
        setDirty(this, 'opacity');
    }
    return this;
};

/**
* Returns the opacity of the visual.
* @returns The opacity of this visual component (1 being fully opaque).
* @type Number
*/
Visual.prototype.getOpacity = function () {
    var opacity = this.opacity;
    if (opacity === undefined) {
        opacity = 1;
    }
    return opacity;
};

/**
* Sets the position. The position is a string that gives the name of the postion
* to which this visual coponent is placed (in the current layout of this
* visual component's container).
* @param {String|Function} position The name of the position to use or a function that will receive containerDimensions, layout (with the proper this).
* @returns this
* @type Visual
*/
Visual.prototype.setPosition = function (position) {
    if (this.position !== position) {
        this.position = position;
        var parent = this.parent;
        if (parent && position !== null) {
            parent.applyLayout(this);
        }
    }
    return this;
};

/**
* Returns the position.
* @returns The position of this visual component (in its container).
* @type String
*/
Visual.prototype.getPosition = function () {
    return this.position;
};
Visual.prototype.getPositionObject = function () {
    var position = this.position,
        parent = this.parent,
        layout;
    if (isString(position) && parent) {
        layout = parent.layout;
        if (layout) {
            position = layout.positions[position];
        } else {
            position = null;
        }
    }
    return position || null;
};

/**
* When a visual is a group it will use a layout object to move its
* children when it is itself moved.
* @param {Object} groupData The data generated by the editor for this visual element or a compatible alternate layout.
* @returns this
* @type Visual
*/
Visual.prototype.setLayout = function (groupData) {
    this.layout = new position.Layout(
        groupData.dimensions,
        groupData.positions
    );
    this.applyLayout();
    return this;
};

/**
* Returns the layout of this visual element.
* @returns The current layout of this visual element (container).
* @type Visual
*/
Visual.prototype.getLayout = function () {
    return this.layout;
};

/**
* Returns the 'natural' dimensions of the element or default dimension.
* This can be overriden but by default will return the layout dimensions.
* It is ok to return null.
* @returns The natural dimensions of this visual element.
* @type vec3
*/
Visual.prototype.getNaturalDimensions = function () {
    if (this.layout) {
        return this.layout.dimensions;
    }
    return null;
};

/**
* This is called each time a container decides to reposition all its children
* (mainly when its dimensions changes but also if its layout changes).
*
* Note: this function can be overridden by subclasses that wish to control
* the positioning of their children (relative to their dimensions) by
* themselves.
*/
Visual.prototype.applyLayout = function (children) {
    var dimensions = this.dimensions,
        layout = this.layout;
    // support applying the layout to a subset of children
    if (!children) {
        children = this.children;
    } else if (isObject(children)) {
        children = [children];
    } else if (!isArray(children)) {
        children = [];
    }
    forEachProperty(children, function (c) {
        applyLayout(dimensions, layout, c);
    });
    return this;
};

/**
* Adds a child to this container. If no name is specified a name will be
* automatically generated.
* @param {Visual} child The child to add.
* @param {String} name the (optional) name of the child.
* @param (Number) atOptionalOrder The optional depth of the component.
* @returns this
* @type Visual
*/
Visual.prototype.addChild = function (child, name, atOptionalOrder) {
    name = name || this.getDefaultName();
    if (this.children && this.children[name]) {
        throw new Error("Child " + name + " already exists.");
    }
    if (child.parent) {
        child.parent.removeChild(child);
    }
    if (this.children === undefined) {
        this.children = {};
        this.numChildren = 0;
    }
    this.children[name] = child;
    child.name = name;
    if (atOptionalOrder !== undefined) {
        if (atOptionalOrder >= 0 && atOptionalOrder < this.numChildren) {
            forEachProperty(this.children, function (c) {
                if (c.order >= atOptionalOrder) {
                    c.order += 1;
                }
            });
            child.order = atOptionalOrder;
            setDirty(this, 'childrenOrder');
        } else if (atOptionalOrder === this.numChildren) {
            child.order = atOptionalOrder;
        } else {
            throw new Error(
                'Invalid order ' +
                    atOptionalOrder +
                    'must be between 0 and ' +
                    this.numChildren
            );
        }
    } else {
        child.order = this.numChildren;
    }
    child.parent = this;
    this.numChildren += 1;
    setContainmentDepth(child, this.containmentDepth + 1);
    // immediately redimension this child
    this.applyLayout(child);
    child.emit('added');
    return this;
};

/**
* Returns the number of children.
* @returns the number of children
* @type Number
*/
Visual.prototype.getNumChildren = function () {
    return this.numChildren;
};

/**
* Resolves a child name to a visual or a child depth to a visual. If a visual is provided, validates that it is a child of this container. This is similar to getChild but accepts more input types.
* @param {String|Number|Object} child
* @returns the resolved visual
* @type Visual
*/
Visual.prototype.resolveChild = function (child) {
    // allow the use of a name
    if (isString(child)) {
        child = this.children[child];
        if (!child) {
            throw new Error('Unavailable child');
        }
    } else if (isNumber(child)) {
        child = this.getChildAtOrder(child);
    } else if (isObject(child)) {
        if (child.parent !== this) {
            throw new Error('Invalid child');
        }
    } else {
        throw new Error("Unexpected child type " + (typeof child));
    }
    return child;
};

/**
* Removes a child from this container (its parent).
* @param child {String} The child to remove. Can optionally be the child itself.
* @returns this
* @type Visual
*/
Visual.prototype.removeChild = function (child, unsafeBreakContainer) {
    var order;
    child = this.resolveChild(child);
    order = child.order;
    delete this.children[child.name];
    // you only have a name inside a parent
    delete child.name;
    // we must remove it from our array of children
    // stay light
    this.numChildren -= 1;
    if (this.numChildren === 0) {
        delete this.children;
        delete this.numChildren;
    }
    child.parent = null;
    setContainmentDepth(child, 0);
    // we also need to adjust all orders
    if (!unsafeBreakContainer) {
        forEachProperty(this.children, function (c) {
            if (c.order > order) {
                c.order -= 1;
            }
        });
    }
    child.emit('removed');
    return this;
};

/**
* Removes all children from this component.
* @returns this
* @type Visual
*/
Visual.prototype.removeAllChildren = function () {
    var that = this;
    forEachProperty(this.children, function (c) {
        that.removeChild(c, true);
    });
    return this;
};

/**
* Returns the (read only) array of children of this component.
* @returns the array of children.
* @type Array
*/
Visual.prototype.getChildren = function () {
    return this.children || {};
};

/**
* Returns a given child of this component.
* @param {String} name The name of the child to return.
* @returns the child if it exists.
* @type Visual
*/
Visual.prototype.getChild = function (name) {
    var ch;
    if (this.children) {
        ch = this.children[name];
    }
    return ch;
};

/**
* Returns a child at a given depth (order).
* @param {Number} order the Depth of the child to return.
* @returns the child at the specified depth.
* @type Visual
*/
Visual.prototype.getChildAtOrder = function (d) {
    var ch;
    forEachProperty(this.children, function (c) {
        if (c.order === d) {
            ch = c;
        }
    });
    return ch;
};

/**
* Returns a sibling of the current component.
* @param {String}
*/
Visual.prototype.getSibling = function (name) {
    var ret,
        parent = this.parent;
    if (parent) {
        ret = parent.getChild(name);
    }
    return ret;
};

/**
* Returns the parent of the current component.
* @returns the parent of this visual component.
* @type Visual
*/
Visual.prototype.getParent = function () {
    return this.parent;
};

/**
* Removes this visual from its container.
* @returns the parent of this visual component.
* @type Visual
*/
Visual.prototype.remove = function () {
    if (this.parent) {
        this.parent.removeChild(this);
    }
    return this;
};

/**
* Swaps the orders (depths) of two children of this component.
* @returns this
* @type Visual
*/
Visual.prototype.swapOrder = function (d1, d2) {
    var o1 = this.resolveChild(d1),
        o2 = this.resolveChild(d2),
        d = o1.order;
    o1.order = o2.order;
    o2.order = d;
    setDirty(this, 'childrenOrder');
    return this;
};

/**
* Move the toMove child before the ref child.
* @param {String} toMove The name of the child to move.
* @param {String} ref The name of the reference child.
* @returns this
* @type Visual
*/
Visual.prototype.orderBefore = function (toMove, ref) {
    if (toMove === ref) {
        return;
    }
    var refOrder = 0,
        children = this.children,
        cToMove = this.resolveChild(toMove),
        rc;
    if (cToMove) {
        if (ref && children) {
            rc = this.resolveChild(ref);
            if (rc) {
                refOrder = rc.order;
            }
        }
        forEachProperty(children, function (c) {
            if (c.order >= refOrder) {
                c.order += 1;
            }
        });
        cToMove.order = refOrder;
        setDirty(this, 'childrenOrder');
    }
    return this;
};

/**
* Move the toMove child after the ref child.
* @param {String} toMove The name of the child to move.
* @param {String} ref The name of the reference child.
* @returns this
* @type Visual
*/
Visual.prototype.orderAfter = function (toMove, ref) {
    if (toMove === ref) {
        return;
    }
    var refOrder = 0,
        children = this.children,
        cToMove = this.resolveChild(toMove),
        rc;
    if (cToMove) {
        if (ref && children) {
            rc = this.resolveChild(ref);
            if (rc) {
                refOrder = rc.order + 1;
            }
        }
        forEachProperty(children, function (c, name) {
            if (c.order >= refOrder) {
                c.order += 1;
            }
        });
        cToMove.order = refOrder;
        setDirty(this, 'childrenOrder');
    }
    return this;
};

/**
* Called to update the visual part.
* NOTE: this should not be overriden in components. This should only be
* implemented in subclasses that port the Visual to a new rendering
* system (ex: DOM, Canvas, WebGL)
* @api private
*/
Visual.prototype.update = function (why) {
    var container;
    // NOTE: it is NOT ok to dirty in here
    // Here we REMAKE our representation according to what has changed
    // why is "WHAT HAS CHANGED" NOT "WHAT NEEDS TO BE REFRESHED"
    if (why.childrenOrder) {
        // regenerate the order of our children
        this.updateChildrenOrderRepresentation();
    }
    if (why.matrix) {
        this.updateMatrixRepresentation();
    }
    if (why.style) {
        // update style representation of ourself
        this.updateStyleRepresentation();
    }
    if (why.dimensions) {
        // update dim representation of ourself
        this.updateDimensionsRepresentation();
    }
    if (why.opacity) {
        // update opacity representation of ourself
        this.updateOpacityRepresentation();
    }
    this.updateDone();
    return this;
};

/**
* updateMatrixRepresentation
* @api private
*/
Visual.prototype.updateMatrixRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};

/**
* updateDimensionsRepresentation
* @api private
*/
Visual.prototype.updateDimensionsRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};

/**
* updateChildrenOrderRepresentation
* @api private
*/
Visual.prototype.updateChildrenOrderRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};

/**
* updateStyleRepresentation
* @api private
*/
Visual.prototype.updateStyleRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};

/**
* updateOpacityRepresentation
* @api private
*/
Visual.prototype.updateOpacityRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};

/**
* updateDone
* @api private
*/
Visual.prototype.updateDone = function () {
    // do nothing, don't complain
};

/**
* Creates multiple children from a description like:
* @api private
*/
Visual.prototype.createChildren = function (groupData) {
    var isFunction = utils.isFunction,
        isString = utils.isString,
        sortedChildrenNames = [],
        children = groupData.children,
        positions = groupData.positions,
        i,
        l,
        name,
        it,
        fact,
        Constr,
        child;

    forEachProperty(children, function (it, name) {
        if (!it.onlyInEditor) {
            sortedChildrenNames.push(name);
        }
    });
    sortedChildrenNames.sort(function (i1, i2) {
        var pos1 = positions[children[i1].config.position],
            pos2 = positions[children[i2].config.position],
            l = children.length,
            o1 = pos1 ? pos1.order : l,
            o2 = pos2 ? pos2.order : l;

        return o1 - o2;
    });
    l = sortedChildrenNames.length;
    for (i = 0; i < l; i += 1) {
        name = sortedChildrenNames[i];
        it = children[name];
        fact = require(it.factory);

        if (!fact) {
            throw new Error('unknown factory ' + it.factory);
        }
        Constr = fact[it.type];
        if (!Constr) {
            throw new Error(
                'unknown constructor ' +
                    it.type +
                    ' in factory ' +
                    it.factory
            );
        }

        child = new Constr(it.config);
        // add the child to the children list
        this.addChild(child, name);
    }
    return this;
};

/**
* Creates the content of this visual element from editor data.
* @api private
*/
Visual.prototype.createGroup = function (groupData) {
    var overflowX, overflowY, skin;
    // set position
    this.setDimensions(groupData.dimensions);
    // set layout
    this.setLayout(groupData);
    // construct our children
    this.createChildren(groupData);
    // set our clipmode
    overflowX = groupData.overflowX || 'visible';
    overflowY = groupData.overflowY || 'visible';
    if (overflowX !== 'visible' || overflowY !== 'visible') {
        this.setOverflow([overflowX, overflowY]);
    }
    // set our skin
    skin = this.getPreferredSkin();
    if (skin !== null) {
        this.setSkin(skin, true);
    }
    return this;
};

/**
* Sets the configuration of this visual.
* The config is somthing like:
* {
*     data1: somestuff,
*     data2: somestuff,
*     etc: somestuff
* }
* @param {Object} config A map of name value pairs
* @type Visual
* @returns this
*/
Visual.prototype.setConfiguration = function (config) {
    if (utils.isObject(config)) {
        var that = this;
        forEachProperty(config, function (cnf, name) {
            var fname = that.getSetFunctionName(name),
                fcn = that[fname];
            if (!utils.isFunction(fcn)) {
                throw new Error('Configuration function not found: ' + fname);
            }
            fcn.call(that, cnf);
        });
    }
    return this;
};

/**
* getSetFunctionName
* @api private
*/
Visual.prototype.getSetFunctionName = function (name) {
    return 'set' + name[0].toUpperCase() + name.slice(1);
};

/**
* getGetFunctionName
* @api private
*/
Visual.prototype.getGetFunctionName = function (name) {
    return 'get' + name[0].toUpperCase() + name.slice(1);
};

/**
* Returns the configuration sheet of this component. Override this function
* to allow the editor to configure your component.
* @returns An object that describes the editable properties of this visual component.
* @type Object
*/
Visual.prototype.getConfigurationSheet = function () {
};

/**
* This sets a 'local theme'. It is used by the editor. I'm not sure
* it should be used in other contexts.
* @api private
*/
Visual.prototype.setLocalTheme = function (theme) {
    // this dirties at least our content
    this.theme = theme;
    forVisualAndAllChildrenDeep(this, function (v) {
        setDirty(v, 'style');
    });
    return this;
};

/**
* The default version does not support skinning.
* @api private
*/
Visual.prototype.getActiveTheme = function () {
    if (this.hasOwnProperty('theme')) {
        return this.theme;
    }
    // FIXME: this is probably not needed we should go through the default
    // skin if we do not have a skin
    return this.theme || null;
};

/**
    sets the style of this visual. This is either a string,
    in which case it refers to:
    - (string) a named style in the parent's theme/skin
    - a style (as defined in themes.js).
    - a {factory, type, style } object
*/
Visual.prototype.setStyle = function (style) {
    if (style !== this.style) {
        this.style = style;
        setDirty(this, 'style');
    }
    return this;
};

/**
* Sets the skin of the current component.
* @param {Object} the skin to apply.
* @param {String} deep can take 3 values:
*     true,
*    false
*    'very' (very deep)
* @returns this
* @type Visual
*/
Visual.prototype.setSkin = function (skin, deep) {
    this.skin = skin;
    setDirty(this, 'style');
    if (deep) {
        forEachProperty(this.children, function (c) {
            if (deep === 'very' || !c.getPreferredSkin()) {
                c.setSkin(skin, deep);
            }
        });
    }
    return this;
};

/**
* Returns the preferred skin (which is the authoring skin for edited documents).
* @api private
*/
Visual.prototype.getPreferredSkin = function () {
    return null;
};

/**
* Returns the style data for this visual.
* @api private
*/
Visual.prototype.getStyleData = function () {
    var style = this.style,
        parentTheme,
        parent,
        skin;
    // if the style is a name, it refers to a style in this component's (or
    // its container's) theme
    if (isString(style)) {
        // + we allow ourself as a container to use our own styles
        // and all our children an sub children that don't have their own
        // theme
        for (parent = this; parent && !parentTheme; parent = parent.parent) {
            parentTheme = parent.getActiveTheme();
        }
        if (parentTheme) {
            return parentTheme.getStyleData(style);
        }
    } else if (isObject(style) && style.factory && style.type && style.style) {
        skin = this.skin || defaultSkin;
        // this is a precise theme (fully qualified)
        try {
            return skin.getTheme(
                style.factory,
                style.type
            ).getStyleData(style.style);
        } catch (e) {
            throw new Error(
                'Cannot find style ' +
                    style.factory +
                    '.' +
                    style.type +
                    '.' +
                    style.style
            );
        }
    }
    // FIXME: this would be better if it came from the themes thing
    // (like getDefaultStyleData()).
    return { data: [], jsData: {} };
};

/**
* Sets event handlers. This allows to set event handlers through the config, so that these event handlers will start to exist immediately after the constructor of Visual has been called. This can occasionally be useful when constructing visuals by code in circumstances where an event must be caught very early.
* @param {Object} handlers A map of handlers
* @type Visual
* @returns this
*/
Visual.prototype.setEventHandlers = function (handlers) {
    var that = this;
    forEachProperty(handlers, function (h, n) {
        that.on(n, h);
    });
    return this;
};

/**
* Loads a package in a way that is coordinated with dirt handling.
* @param {String} p the name of the package to load.
* @param {Object} applicationDomain The application domain in which the package should be loaded (will default to the same applicationDomain as this component if set to null)
* @param {Boolean} reload true to force reloading of the package.
* @param {Boolean} forTesting true to get the testing version of the package.
* @param {Function} callback an optional function to call when the loading is complete.
* @memberOf visual
*/
function loadPackage(p, applicationDomain, reload, forTesting, callback) {
    applicationDomain = applicationDomain || require.applicationDomain;
    reload = reload || false;
    define.pillow.loadPackage(
        p,
        applicationDomain,
        reload,
        forTesting,
        function () {
            if (callback) {
                callback.apply(this, arguments);
            }
            dirty.update();
        }
    );
}

/**
* getGetActiveTheme
* @api private
*/
function getGetActiveTheme(factoryName, typeName) {
    return function () {
        var skin = this.skin;
        if (this.hasOwnProperty('theme')) {
            return this.theme;
        } else if (skin) {
            return skin.getTheme(factoryName, typeName);
        }
        return this.theme || null;
    };
}

/**
* Returns a style list from a theme
*/
function getStyleListFromTheme(t, packageName, className) {
    var ret = [],
        utils = require('utils'),
        forEachProperty = utils.forEachProperty;

    forEachProperty(t.themeData, function (d, k) {
        ret.push({
            factory: packageName,
            type: className,
            style: k
        });
    });
    return ret;
}


/**
* Creates a prototype for a subclass of a visual element.
* @param {String} Base the baseclass
* @param {Object} groupData the editor data for this component.
* @param {factoryName} the name of the package to which this component belongs.
* @param {typeName} the name of the constructor for this component.
* @returns the prototype.
* @type Object
* @memberOf visual
*/
function inheritVisual(Base, groupData, factoryName, typeName) {
    var proto = new Base(),
        skin;
    if (groupData.skin) {
        skin = new Skin(groupData.skin);
        skin.debugName = factoryName + ':' + typeName;
        proto.getPreferredSkin =     function () {
            return skin;
        };
    }
    proto.theme = new Theme(groupData.theme, skin);
    proto.privateStyles = groupData.privateStyles;
    proto.privateVisual = groupData.privateVisual;
    proto.getDescription = function () {
        return groupData.description;
    };
    proto.getStyleListFromTheme = function () {
        return getStyleListFromTheme(proto.theme, factoryName, typeName);
    };
    // for legacy reasons, we support not providing the typenames
    // in this case, skinning will not work
    if (factoryName && typeName) {
        proto.getActiveTheme = getGetActiveTheme(factoryName, typeName);
    }
    return proto;
}


// export all what we want to export for the module
exports.Visual = Visual;
exports.Layout = position.Layout;
exports.applyLayout = position.applyLayout;
exports.Position = position.Position;
exports.matrixIsTranslateOnly = matrixIsTranslateOnly;
exports.convertScaleToSize = position.convertScaleToSize;
exports.forVisualAndAllChildrenDeep = forVisualAndAllChildrenDeep;
exports.Theme = Theme;
exports.Skin = Skin;
exports.defaultSkin = defaultSkin;
exports.update = dirty.update;
exports.getEnclosingRect = position.getEnclosingRect;
exports.rectToMatrix = position.rectToMatrix;
exports.loadPackage = loadPackage;
exports.vec3IsEqual = vec3IsEqual;
exports.inheritVisual = inheritVisual;
exports.getGetActiveTheme = getGetActiveTheme;
