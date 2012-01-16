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
    forEachProperty = utils.forEachProperty,
    dirty = require('./dirty'),
    position = require('./position'),
    setDirty = dirty.setDirty,
    EventEmitter = events.EventEmitter;

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
function Visual() {
    this.containmentDepth = -1;
    this.container = null;
    setDirty(this, 'constructed');
}
Visual.prototype = new EventEmitter();
Visual.prototype.getSize = function () {
};
/**
    Sets the dimension  of the visual
    (the dimensions are defined as an Array ... compatible with glmatrix)
    
    'auto' for any of this will make the dimension determined
    by the content of the box.
*/
Visual.prototype.setDimensions = function (vec3) {
    this.dimensions = vec3;
    setDirty('dimensionsChanged');    
};
/**
    Sets the position. The position is either a string
    (referring to a position name in the parent layout) OR
    a position object created with one of the following constructors:
        position.FlowPosition
        position.AbsolutePosition
        position.TransformPosition
        
    Note that a position is not necessarily a matrix. It is a way
    to compute a matrix (or style) given the size of the parent container.
*/
Visual.prototype.setPosition = function (position) {
    this.position = position;
    setDirty(this, 'positionChanged');
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
Visual.prototype.setLayout = function (layout) {
    if (this.layout !== layout) {
        this.layout = layout;
    }
};
Visual.prototype.getLayout = function () {
    return this.layout;
};
Visual.prototype.addChild = function (child, name) {
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
    this.numChildren += 1;
    setContainmentDepth(child, this.containmentDepth + 1);
    // parent changed
    setDirty(child, 'parentChanged');
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
        setContainmentDepth(child, -1);
        setDirty(child, 'parentChanged');
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
    setDirty(this.childrenDepthShuffled);
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
};

/**
    Creates multiple children from a description like:
*/
Visual.prototype.createChildren = function (info) {
    var that = this;
    forEachProperty(info.items, function (it, name) {
        var v = it.visual,
            Constr = require(v.factory)[v.type];
        that.addChild(
            new Constr(v.data),
            name
        );
    });
};



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
