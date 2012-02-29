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
    themes = require('./themes'),
    isString = utils.isString,
    applyLayout = position.applyLayout,
    setDirty = dirty.setDirty,
    setChildrenDirty = dirty.setChildrenDirty,
    EventEmitter = events.EventEmitter,
    defaultNameIndex = 0;


function forVisualAndAllChildrenDeep(v, fcn) {
    fcn(v);
    if (v.children) {
        forEachProperty(v.children, function (v) {
            forVisualAndAllChildrenDeep(v, fcn);
        });
    }
}

function setContainmentDepth(v, depth) {
    v.containmentDepth = depth;
    if (v.children) {
        forEachProperty(v.children, function (c) {
            // sets the containment depth of the children
            setContainmentDepth(c, depth + 1);
        });
    }
}

function matrixIsTranslateOnly(matrix) {
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

function updateChildrenPositions(v) {
    forEachProperty(v.children, function (c) {
        applyLayout(v.dimensions, v.layout, c);
    });
}


/**
    A visual.
    A visual can contain other visuals.
    It has a position.
    It can render itself in its container (DOM, canvas, webgl)
*/
function Visual(config, groupData) {
    this.containmentDepth = 0;
    // set default dimension
    this.setDimensions([1, 1, 0]);
    // construct optional goup, and setup optional config
    if (groupData) {
        this.createGroup(groupData);
    }
    if (config) {
        this.setConfiguration(config);
    }
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
        var parent = this.parent;
        if (parent) {
            applyLayout(parent.dimensions, parent.layout, this);
        }
    }
};

/**
    Allows (or disallows) user interactions (mouse, keyboard). Disallowing
    interactions can be used to display a component as a passive preview.
    By default, interactions are always enabled.
    
    // this function is implemented by subclasses
*/
Visual.prototype.enableInteractions = function (enable) {
    throw new Error('enableInteractions should be implemented by concrete subclasses.');
};

/**
    Sets the dimension  of the visual
    (the dimensions are defined as an Array ... compatible with glmatrix)
    
    'auto' for any of this will make the dimension determined
    by the content of the box.
*/
Visual.prototype.setDimensions = function (v3) {
    this.dimensions = v3;
    setDirty(this, 'dimensions');
    // Keep all children in synch (in terms of position and matrix)
    updateChildrenPositions(this);
};
/**
    Sets the matrix.
    Note that setting the matrix directly can have no effect if this visual
    has a 'position' (the position will regenerate the matrix).
*/
Visual.prototype.setMatrix = function (m4) {
    this.matrix = m4;
    setDirty(this, 'matrix');
};
/**
    Sets the matrix with a matrix that is normalized to scale a unity
    rect to the position and dimensions that we need. The matrix is transformed
    by removing our scaling factor.
    Note that setting the matrix directly can have no effect if this visual
    has a 'position' (the position will regenerate the matrix).
*/
/*Visual.prototype.setNormalizedMatrix = function (m4) {
    var dimensions = this.dimensions;
    this.setMatrix(
        glmatrix.mat4.scale(
            m4, 
            [1 / dimensions[0], 1 / dimensions[1], 1],
            glmatrix.mat4.create()
        )
    );
};*/
/**
    Returns the matrix.
*/
Visual.prototype.getMatrix = function () {
    var matrix = this.matrix || glmatrix.mat4.identity();
    return matrix;
};

/**
    Checks that only translation is needed on this visual.
*/
Visual.prototype.isOnlyTranslated = function () {
    matrixIsTranslateOnly(this.matrix);
};
/**
    Returns the 'display' matrix. This can be overridden in subclasses
    that do nothing with the real matrix but and display the element differently.
    The only known case of this is when an element uses the normal html
    flowing or scrolling: the real positionning is determined by the html engine.
    
    This should be private (well...)
*/
Visual.prototype.getDisplayMatrix = function () {
    return this.getMatrix();
};
/**
    Returns the full display matrix (i.e. the combined matrix of all parents).
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
    var parent = this.parent;
    if (parent) {
        applyLayout(parent.dimensions, parent.layout, this);
    }
};
Visual.prototype.getPosition = function () {
    return this.position;
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
    updateChildrenPositions(this);
};
Visual.prototype.getLayout = function () {
    return this.layout;
};
Visual.prototype.addChild = function (child, name) {
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
    child.order = this.numChildren;
    child.parent = this;
    this.numChildren += 1;
    setContainmentDepth(child, this.containmentDepth + 1);
    // immediately redimension this child
    applyLayout(this.dimensions, this.layout, child);
};
Visual.prototype.removeChild = function (child) {
    // allow the use of a name
    if (isString(child)) {
        child = this.children[child];
        if (!child) {
            throw new Error('Unavailable child');
        }
    } else {
        if (child.parent !== this) {
            throw new Error('Invalid child');
        }
    }
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
};
Visual.prototype.removeAllChildren = function () {
    var that = this;
    forEachProperty(this.children, function (c) {
        that.removeChild(c);
    });
};
Visual.prototype.getChildAtOrder = function (d) {
    forEachProperty(this.children, function (c) {
        if (c.order === d) {
            return c;
        }
    });
};
Visual.prototype.swapOrder = function (d1, d2) {
    var o1 = utils.isNumber(d1) ? this.getChildAtOrder(d1) : this.children[d1],
        o2 = utils.isNumber(d2) ? this.getChildAtOrder(d2) : this.children[d2],
        d = o1.order;
    o1.order = o2.order;
    o2.order = d;
    setDirty(this, 'childrenOrder');
};
Visual.prototype.increaseOrder = function (d) {
};
Visual.prototype.decreaseOrder = function (d) {
};
Visual.prototype.toMaxOrder = function (d) {
};
Visual.prototype.toMinOrder = function (d) {
};
/**
    Called to update the visual part.
    NOTE: this should not be overriden in components. This should only be
    implemented in subclasses that port the Visual to a new rendering
    system (ex: DOM, Canvas, WebGL)
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
    if (why.dimensions) {        
        // update dim representation of ourself
        this.updateDimensionsRepresentation();
    }
    if (why.style) {
        // update dim representation of ourself
        this.updateStyleRepresentation();
    }
    this.updateDone();
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
Visual.prototype.updateChildrenOrderRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};
Visual.prototype.updateStyleRepresentation = function () {
    throw new Error("Not supported in abstract base class Visual");
};
Visual.prototype.updateDone = function () {
    // do nothing, don't complain
};

/**
    Creates multiple children from a description like:
*/
Visual.prototype.createChildren = function (groupData) {
    var isFunction = utils.isFunction,
        isString = utils.isString,
        sortedChildrenNames = [],
        children = groupData.children,
        i, 
        l,
        name,
        it,
        fact,
        Constr,
        child;
        
    forEachProperty(children, function (it, name) {
        sortedChildrenNames.push(name);
    });    
    sortedChildrenNames.sort(function (i1, i2) {
        return children[i1].order - children[i2].order;
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
        this.addChild(child, name);
    }
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
    Sets the configuration of this visual.
    The config is somthing like:
    
    {
        data1: somestuff,
        data2: somestuff,
        etc: somestuff
    }
    
    (calling the baseclass, if you need to do so, you can always have a data
    that is baseclassdata: {} )
*/
Visual.prototype.setConfiguration = function (config) {
    if (utils.isObject(config)) {
        var configSheet = this.getConfigurationSheet(),
            that = this;
        forEachProperty(config, function (cnf, name) {
            var fcn,
                fname = that.getSetFunctionName(name);
            // validate that this thing works
            if (configSheet.hasOwnProperty(name)) {
                fcn = that[fname];
                if (!utils.isFunction(fcn)) {
                    throw new Error('Configuration function not found: ' + fname);
                }
                fcn.call(that, cnf);
            } else {
                throw new Error("The configuration has an unexpected member: " + name);
            }
        });
    }
};

Visual.prototype.getSetFunctionName = function (name) {
    return 'set' + name[0].toUpperCase() + name.slice(1);
};

Visual.prototype.getGetFunctionName = function (name) {
    return 'get' + name[0].toUpperCase() + name.slice(1);
};

/**
    Gets data sheet (this allows the editor to edit this visual element)
    getConfigurationSheet
    

    // should create a viwer that has a     
    Sheet: {
        myData: {
            fcnCreateDataViewer(data)
            fcnGetData(dataViewer)
        }
    }
*/
Visual.prototype.getConfigurationSheet = function (config) {
};

/**
    Applies a skin (a per-instance theme).
    This is intentionally named setTheme, allowing the 'config' system to
    setup the skin.
*/
Visual.prototype.setSkin = function (theme) {
    // this dirties at least our content
    themes.applySkin(this, theme);
    setDirty(this, 'style');
};

/**
    Sets a skin style (a per instance theme style)
*/
Visual.prototype.setSkinStyle = function (styleName, style) {
    var o = {};
    o[styleName] = style;
    themes.applySkin(this, o);
    // this dirties our content
    setDirty(this, 'style');
};

/**
    Retrieves a theme style.
    (this is an array of information like css styles or something)
*/
Visual.prototype.getSkinStyle = function (styleName) {
    return themes.getStyle(this.theme, styleName);
};

/**
    sets the style of this visual. This is either a string,
    in which case it refers to a named style in the parent's
    theme/skin, or a style (as defined in themes.js).
*/    
Visual.prototype.setStyle = function (style) {
    if (style !== this.style) {
        this.style = style;
        setDirty(this, 'style');
    }
};

/**
    Returns the style data for this visual.
*/
Visual.prototype.getStyleData = function () {
    var style = this.style, parentTheme, parent;
    if (isString(style)) {
        // + we allow ourself as a container to use our own styles
        // and all our children an sub children that don't have their own
        // theme
        for (parent = this; parent && !parentTheme; parent = parent.parent) {
            parentTheme = parent.theme;
        }
        if (parentTheme) {
            style = parentTheme[style];
        }
    }
    return themes.getStyleData(style);
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
exports.AbsolutePosition = position.AbsolutePosition;
exports.TransformPosition = position.TransformPosition;
exports.deserializePosition = position.deserializePosition;
exports.matrixIsTranslateOnly = matrixIsTranslateOnly;
exports.convertScaleToSize = position.convertScaleToSize;
exports.forVisualAndAllChildrenDeep = forVisualAndAllChildrenDeep;
exports.Theme = themes.Theme;
exports.update = dirty.update;

