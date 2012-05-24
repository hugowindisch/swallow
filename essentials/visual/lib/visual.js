/**
    visual.js

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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
    isString = utils.isString,
    isObject = utils.isObject,
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

function vec3IsEqual(v1, v2) {
    return v1 === v2 || (v1 && v2 && v1[0] === v2[0] && v1[1] === v2[1] && v1[3] === v2[3]);
}

function updateChildrenPositions(v) {
    if (v.layout) {
        forEachProperty(v.children, function (c) {
            applyLayout(v.dimensions, v.layout, c);
        });
    }
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
Visual.prototype.getDescription = function () {
    return 'Visual Component';
};
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
    Returns the full name from the current visual (useful for debugging)
*/
Visual.prototype.getFullName = function () {
    var n = this.name;
    if (this.parent) {
        n = this.parent.getFullName() + '.' + n;
    }
    return n;
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
    var dimensions = this.dimensions;
    if (!vec3IsEqual(this.dimensions, v3)) {
        this.dimensions = v3;
        setDirty(this, 'dimensions');
        // Keep all children in synch (in terms of position and matrix)
        this.applyLayout();
    }
    return this;
};
/**
    Checks that this visual is unsconstrained.
*/
Visual.prototype.isUnconstrained = function () {
    return this.position === undefined || this.htmlFlowingApplySizing;
};
/**
    Sets a requested dimension. This allows a contained element to
    resize its container to fit its size under certain circumstances.
    If the container is unconstrained and that the element is at a
    position that allows the container to resize (e.g. the position has
    an auto height or an auto width), the position is unconstrained,
    and the container is free to resize itself, the dedimensioning will
    happen.
*/
Visual.prototype.requestDimensions = function (v3) {
    var parent;
    // note: we compare with the actual dimensions, if they don't match
    // we still do everything (i.e. potentially ask our outer container
    // to do something)...
    // note: some more thought must be given to the 'reverse' resizing of things.
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
                parent.requestDimensions(parent.getDimensionsAdjustedForContent());
            }
        }
    }
    return this;
};
/**
    This will compute the dimensions from the content if possible.
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
                newd = position.computeReverseDimensioning(dimensions, that.layout, c);
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
    Sets the matrix.
    Note that setting the matrix directly can have no effect if this visual
    has a 'position' (the position will regenerate the matrix).
*/
Visual.prototype.setMatrix = function (m4) {
    this.matrix = m4;
    setDirty(this, 'matrix');
    return this;
};
/**
    Sets a simple translation matrix.
*/
Visual.prototype.setTranslationMatrix = function (pos) {
    this.setMatrix(glmatrix.mat4.create([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, pos[0], pos[1], pos[2], 1]));
    return this;
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
    Sets the opacity of the visual (1 = fully opaque, 0 = fully transparent).
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
    Returns the opacity of the visual.
*/
Visual.prototype.getOpacity = function () {
    var opacity = this.opacity;
    if (opacity === undefined) {
        opacity = 1;
    }
    return opacity;
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
    if (this.position !== position) {
        this.position = position;
        var parent = this.parent;
        if (parent && position !== null) {
            applyLayout(parent.dimensions, parent.layout, this);
        }
    }
    return this;
};
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
    When a visual is a group it will use a layout object to move its
    children when it is itself moved.
    The layout can be manipulated programmatically. This allows to
    implement stuff like separator bars that work in harmony with
    everything else.
*/
Visual.prototype.setLayout = function (groupData) {
    this.layout = new (position.Layout)(groupData.dimensions, groupData.positions);
    this.applyLayout();
    return this;
};
Visual.prototype.getLayout = function () {
    return this.layout;
};
/**
    Returns the 'natural' dimensions of the element or default dimension.
    This can be overriden but by default will return the layout dimensions.
    It is ok to return null.
*/
Visual.prototype.getNaturalDimensions = function () {
    if (this.layout) {
        return this.layout.dimensions;
    }
    return null;
};
/**
    This is called each time a container decides to reposition all its children
    (mainly when its dimensions changes but also if its layout changes).

    Note: this function can be overridden by subclasses that wish to control
    the positioning of their children (relative to their dimensions) by
    themselves.
*/
Visual.prototype.applyLayout = function () {
    updateChildrenPositions(this);
};

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
            throw new Error('Invalid order ' + atOptionalOrder + 'must be between 0 and ' + this.numChildren);
        }
    } else {
        child.order = this.numChildren;
    }
    child.parent = this;
    this.numChildren += 1;
    setContainmentDepth(child, this.containmentDepth + 1);
    // immediately redimension this child
    applyLayout(this.dimensions, this.layout, child);
    return this;
};
Visual.prototype.resolveChild = function (child) {
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
    return child;
};
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
    return this;
};
Visual.prototype.removeAllChildren = function () {
    var that = this;
    forEachProperty(this.children, function (c) {
        that.removeChild(c, true);
    });
    return this;
};
Visual.prototype.getChildren = function () {
    return this.children || {};
};
Visual.prototype.getChild = function (name) {
    var ch;
    if (this.children) {
        ch = this.children[name];
    }
    return ch;
};
Visual.prototype.getChildAtOrder = function (d) {
    var ch;
    forEachProperty(this.children, function (c) {
        if (c.order === d) {
            ch = c;
        }
    });
    return ch;
};
Visual.prototype.getSibling = function (name) {
    var ret,
        parent = this.parent;
    if (parent) {
        ret = parent.getChild(name);
    }
    return ret;
};
Visual.prototype.swapOrder = function (d1, d2) {
    var o1 = utils.isNumber(d1) ? this.getChildAtOrder(d1) : this.children[d1],
        o2 = utils.isNumber(d2) ? this.getChildAtOrder(d2) : this.children[d2],
        d = o1.order;
    o1.order = o2.order;
    o2.order = d;
    setDirty(this, 'childrenOrder');
    return this;
};
Visual.prototype.increaseOrder = function (d) {
    return this;
};
Visual.prototype.decreaseOrder = function (d) {
    return this;
};
Visual.prototype.toMaxOrder = function (d) {
    return this;
};
Visual.prototype.toMinOrder = function (d) {
    return this;
};
Visual.prototype.orderBefore = function (toMove, ref) {
    if (toMove === ref) {
        return;
    }
    var refOrder = 0,
        children = this.children,
        cToMove = children[toMove],
        rc;
    if (cToMove) {
        if (ref && children) {
            rc = children[ref];
            if (rc) {
                refOrder = rc.order;
            }
        }
        forEachProperty(this.children, function (c) {
            if (c.order >= refOrder) {
                c.order += 1;
            }
        });
        cToMove.order = refOrder;
        setDirty(this, 'childrenOrder');
    }
    return this;
};
Visual.prototype.orderAfter = function (toMove, ref) {
    if (toMove === ref) {
        return;
    }
    var refOrder = 0,
        children = this.children,
        cToMove = children[toMove],
        rc;
    if (cToMove) {
        if (ref && children) {
            rc = children[ref];
            if (rc) {
                refOrder = rc.order + 1;
            }
        }
        forEachProperty(this.children, function (c, name) {
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
Visual.prototype.updateOpacityRepresentation = function () {
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
        positions = groupData.positions,
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
            throw new Error('unknown constructor ' + it.type + ' in factory ' + it.factory);
        }

        child = new Constr(it.config);
        // add the child to the children list
        this.addChild(child, name);
    }
    return this;
};

/**
    Creates the content of this visual element from editor data.
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
        this.setChildrenClipping([overflowX, overflowY]);
    }
    // set our skin
    skin = this.getPreferredSkin();
    if (skin !== null) {
        this.setSkin(skin, true);
    }
    return this;
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
    This sets a 'local theme'. It is used by the editor. I'm not sure
    it should be used in other contexts. Maybe even the editor could use
    the skinning thing instead... maybe not...
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
    The default version does not support skinning.
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
    Sets the skin of the current component.
    deep can take 3 values:
        true,
        false
        'very' (very deep)
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
};

/**
    Returns the preferred skin (which is the authoring skin for edited documents).
*/
Visual.prototype.getPreferredSkin = function () {
    return null;
};

/**
    Returns the style data for this visual.
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
        skin = this.skin || themes.defaultSkin;
        // this is a precise theme (fully qualified)
        try {
            return skin.getTheme(style.factory, style.type).getStyleData(style.style);
        } catch (e) {
            throw new Error('Cannot find style ' + style.factory + '.' + style.type + '.' + style.style);
        }
    }
    // FIXME: this would be better if it came from the themes thing
    // (like getDefaultStyleData()).
    return { data: [], jsData: {} };
};

/**
    Loads a package in a way that is coordinated with dirt handling.
*/
function loadPackage(p, callback) {
    define.meat.loadPackage(p, function () {
        if (callback) {
            callback.apply(this, arguments);
        }
        dirty.update();
    });
}

/**
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
    proto.privateTheme = groupData.privateTheme;
    proto.getDescription = function () {
        return groupData.description;
    };
    // for legacy reasons, we support not providing the typenames
    // in this case, skinning will not work
    if (factoryName && typeName) {
        proto.getActiveTheme = function () {
            var skin = this.skin;
            if (this.hasOwnProperty('theme')) {
                return this.theme;
            } else if (skin) {
                return skin.getTheme(factoryName, typeName);
            }
            return this.theme || null;
        };
    }
    return proto;
}


// export all what we want to export for the module
exports.Visual = Visual;
// this should not be there: a Visual is abstract. It should not be exposed
// to the editor
exports.getVisualNames = function () {
    return [ 'Visual' ];
};
exports.Layout = position.Layout;
exports.applyLayout = position.applyLayout;
exports.Position = position.Position;
exports.matrixIsTranslateOnly = matrixIsTranslateOnly;
exports.convertScaleToSize = position.convertScaleToSize;
exports.forVisualAndAllChildrenDeep = forVisualAndAllChildrenDeep;
exports.Theme = Theme;
exports.update = dirty.update;
exports.getEnclosingRect = position.getEnclosingRect;
exports.rectToMatrix = position.rectToMatrix;
exports.loadPackage = loadPackage;
exports.vec3IsEqual = vec3IsEqual;
exports.inheritVisual = inheritVisual;
