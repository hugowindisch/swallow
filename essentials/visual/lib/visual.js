/**
    visual.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

/**
Thinking
========
- I don't want something big but I want to be able to graphically deal with
graphical stuff.

- I don't want to be a dom manipulation framework. Somehow, people should be
able to use the one they like. But, often web frameworks deal with component
loading and for this I want to stick to CommonJS packages & modules. So there
are clashing elements.

- Positioning is an element of skinning that is somehow different (in terms
of human manipulation of elements)


- Maybe ids are good enough

- user data vs container: the dom is shared by many components. Components
may want to have userdata.

Features I want:
----------------
* Theming: wellknown styles that apply to all components of a set (this could
work with multiple classes)

* Skinning should be done through css (css style)


1. type of 'box', just like in html, the element.


==============
If I could use the same model for canvas, webgl, and html (i.e. see the dom
as an output format)

... th

The first level of abstraction has in fact nothing to do with html.
It is an abstraction of graphic elements that need to refreshs themselves
=========================================================================
---------------
Visual()
Position()
Event()
Dirt()

The second level of abstraction is the html thing (it has to do with
implementing a visual on top of the DOM)

Then we could implement a visual on top of a canvas (other libray)

A position can be a named position inside our parent or an unmanaged position.

*/

var utils = require('utils'),
    events = require('events'),
    glmatrix = require('glmatrix'),
    forEachProperty = utils.forEachProperty,
    dirty = require('./dirty'),
    position = require('./position'),
    applyLayout = position.applyLayout,
    setDirty = dirty.setDirty,
    setChildrenDirty = dirty.setChildrenDirty,
    EventEmitter = events.EventEmitter,
    defaultNameIndex = 0;

function setContainmentDepth(v, depth) {
    v.containmentDepth = depth;
    if (v.children) {
        forEachProperty(v.children, function (c) {
            // sets the containment depth of the children
            setContainmentDepth(c, depth + 1);
        });
    }
}

/**
    A visual.
    A visual can contain other visuals.
    It has a position.
    It can render itself in its container (DOM, canvas, webgl)
*/
function Visual(config) {
    this.containmentDepth = 0;
    this.setConfig(config);
    // set default dimension
    this.setDimensions([1, 1, 0]);
    setDirty(this, 'constructed');
}
Visual.prototype = new EventEmitter();
Visual.prototype.getSize = function () {
};
/**
    Returns a default (unique) name
*/
Visual.prototype.getDefaultName = function () {
    var ret = 'visual' + defaultNameIndex;
    defaultNameIndex += 1;
    return ret;
};
/**
    Allows scaling. When a visual is moved to a given position, it
    is resized. The resizing part of the transformation can either be 
    interpreted as a scaling or as a resizing.
*/
Visual.prototype.enableScaling = function (enable) {
    enable = (enable === true);
    if (this.scalingEnabled !== enable) {
        this.scalingEnabled = enable;
        setDirty(this, 'position');
    }
};
/**
    Sets the dimension  of the visual
    (the dimensions are defined as an Array ... compatible with glmatrix)
    
    'auto' for any of this will make the dimension determined
    by the content of the box.
*/
Visual.prototype.setDimensions = function (vec3) {
    this.dimensions = vec3;
    setDirty(this, 'dimensions');    
};
Visual.prototype.setMatrix = function (mat4) {
    this.matrix = mat4;
    setDirty(this, 'matrix');
};
/**
    Sets the position. The position is either a string
    (referring to a position name in the parent layout) OR
    a position object created with one of the following constructors:
        position.FlowPosition
        position.AbsolutePosition
        position.TransformPosition
    OR nothing
        
    Note that a position is not necessarily a matrix. It is a way
    to compute a matrix (or style) given the size of the parent container.
*/
Visual.prototype.setPosition = function (position) {
    this.position = position;
    setDirty(this, 'position');
};
Visual.prototype.getPosition = function () {
    return this.position;
};
/**
    Applies a position to the element (i.e. convert it to something that
    works in the target rendering system, e.g. the DOM)
*/
Visual.prototype.applyPosition = function (containerDimensions, layoutDimensions, position) {
    // we only know how to do this in subclasses
    throw new Error('a Visual is abstract and cannot be displayed');
};
/**
    When a visual is a group it will use a layout object to move its
    children when it is itself moved.
    The layout can be manipulated programmatically. This allows to
    implement stuff like separator bars that work in harmony with
    everything else.
*/
Visual.prototype.setLayout = function (groupData) {
    this.layout = new (position.Layout)(groupData.dimensions, groupData.positions);
    setDirty(this, 'layout');
};
Visual.prototype.getLayout = function () {
    return this.layout;
};
Visual.prototype.addChild = function (child, name) {
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
    child.depth = this.numChildren;
    child.parent = this;
    this.numChildren += 1;
    setContainmentDepth(child, this.containmentDepth + 1);
    // parent changed
    setDirty(child, 'container');
};
Visual.prototype.removeChild = function (child) {
    // we become a container
    if (child.parent === this) {
        delete this.children[child.name];
        // you only have a name inside a parent
        delete child.name;
        // we must remove it from our array of children
        // stay light
        if (this.numChildren === 0) {
            delete this.children;
            delete this.numChildren;
        }
        child.parent = null;
        setContainmentDepth(child, 0);
        setDirty(child, 'container');
    }
};
Visual.prototype.getChildAtDepth = function (d) {
    forEachProperty(this.children, function (c) {
        if (c.depth === d) {
            return c;
        }
    });
};
Visual.prototype.swapDepths = function (d1, d2) {
    var o1 = utils.isNumber(d1) ? this.getChildAtDepth(d1) : this.children[d1],
        o2 = utils.isNumber(d2) ? this.getChildAtDepth(d2) : this.children[d2],
        d = o1.depth;
    o1.depth = o2.depth;
    o2.depth = d;
    setDirty(this, 'childrendepth');
};
Visual.prototype.increaseDepth = function (d) {
};
Visual.prototype.decreaseDepth = function (d) {
};
Visual.prototype.toMaxDepth = function (d) {
};
Visual.prototype.toMinDepth = function (d) {
};
/**
    Called to update the visual part.
    
    why is an object with zero or more of the following properties:
        constructed, positionChanged, parentChanged, childrenDepthShuffled,
        dimensionsChanged
        
    NOTE: this should not be overriden in components. This should only be
    implemented in subclasses that port the Visual to a new rendering
    system (ex: DOM, Canvas, WebGL)
*/
Visual.prototype.update = function (why) {
    var container;
    // Here we REMAKE our representation according to what has changed
    // why is "WHAT HAS CHANGED" NOT "WHAT NEEDS TO BE REFRESHED"
    if (why.matrix) {
        this.updateMatrixRepresentation();
    }
    if (why.dimensions) {
        // dirty position of all children
        setChildrenDirty(this, 'position');
        
        // update dim representation of ourself
        this.updateDimensionsRepresentation();
    }
    if (why.position) {
        // recompute matrix & dimension from 'position'
        container = this.parent;
        if (container && container.layout) {
            applyLayout(container.dimensions, container.layout, this);
        }
    }
    if (why.childrendepth) {
        // regenerate the order of our children
        this.updateChildrenDepthRepresentation();
    }
    if (why.content) {
        this.updateContentRepresentation();
    }
    if (why.layout) {
        // dirty position of all children
        setChildrenDirty(this, 'position');
    }
    if (why.container) {
        // this is somehow fucked up, we've been moved to another container
        this.updateContainerRepresentation();
        // dirty our position
        setDirty(this, 'position');
    }
};

/**
    Stub implementations.
*/
Visual.prototype.updateMatrixRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};
Visual.prototype.updateDimensionsRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};
Visual.prototype.updateChildrenDepthRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};
Visual.prototype.updateContentRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};
Visual.prototype.updateContainerRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};

/**
    Creates multiple children from a description like:
*/
Visual.prototype.createChildren = function (groupData) {
    var that = this,
        isFunction = utils.isFunction,
        isString = utils.isString;
    forEachProperty(groupData.children, function (it, name) {
        var fact = require(it.factory),
            Constr,
            child;

        if (!fact) {
            throw new Error('unknown factory ' + it.factory);
        }
        Constr = fact[it.type];
        if (!Constr) {
            throw new Error('unknown constructor ' + it.type + ' in factory ' + it.factory);
        }
        child = new Constr(it.config);

        // set the position of the child (this will override whatever
        // position that the child set in its constructor)
        if (isString(it.position)) {
            child.setPosition(it.position);
        }
        if (it.enableScaling === true) {
            child.enableScaling(true);
        }
        // add the child to the children list
        that.addChild(child, name);
    });
};

/**
    Creates the content of this visual element from editor data.
*/
Visual.prototype.createGroup = function (groupData) {
    // set position
    this.setDimensions(groupData.dimensions);
    // set layout
    this.setLayout(groupData);
    // construct our children
    this.createChildren(groupData);
};

/**
    Sets data. The data will be partitioned as:
    {
        "package.Visual": {
            }
    }
*/
Visual.prototype.setConfig = function (config) {
//    var d = config['visual.Visual'];
//    if (d) {
//    }
};

/**
    Gets data sheet (this allows the editor to edit this visual element)
*/

// export all what we want to export for the module
exports.Visual = Visual;
// this should not be there: a Visual is abstract. It should not be exposed
// to the editor
exports.getVisualNames = function () {
    return [ 'Visual' ];
};
exports.Layout = position.Layout;
exports.applyLayout = position.applyLayout;
exports.FlowPosition = position.FlowPosition;
exports.AbsolutePosition = position.AbsolutePosition;
exports.TransformPosition = position.TransformPosition;

