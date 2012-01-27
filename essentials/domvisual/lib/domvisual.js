/**
    domvisual.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    utils = require('utils'),
    dirty = require('/visual/lib/dirty'),
    position = require('/visual/lib/position'),
    glmatrix = require('glmatrix'),
    updateDOMEventHooks = require('./domhooks').updateDOMEventHooks,
    Visual = visual.Visual,
    forEachProperty = utils.forEachProperty,
    isObject = utils.isObject,
    isArray = utils.isArray,
    setDirty = dirty.setDirty;

function DOMVisual(config, groupData, element) {
    var that = this;
    this.element = element;
    this.cssClasses = {};
    this.setClass('domvisual');
    this.connectedToTheStage = false;
    this.disableEventHooks = false;
    Visual.call(this, config, groupData);
    // this might not be the best idea, maybe overriding addListener would
    // be better.
    this.addListener('addListener', function () {
        updateDOMEventHooks(that);
    });
}
DOMVisual.prototype = new Visual();
DOMVisual.prototype.superAddChild = DOMVisual.prototype.addChild;
DOMVisual.prototype.superRemoveChild = DOMVisual.prototype.removeChild;
DOMVisual.prototype.addChild = function (child, name) {
    if (!child.element) {
        throw new Error('Non DOM child added to a DOM visual');
    }
    // it is easier to track element containement immediately instead
    // of waiting for the update function to be called. This
    // is maybe a little bit ugly, but until I find better, it will do
    this.superAddChild(child, name);
    this.element.appendChild(child.element);
    var connectedToTheStage = this.connectedToTheStage,
        disableEventHooks = this.disableEventHooks;
    visual.forVisualAndAllChildrenDeep(child, function (c) {
        c.connectedToTheStage = connectedToTheStage;
        c.disableEventHooks = disableEventHooks;
        // here we should revalidate the hooks for this child
        updateDOMEventHooks(c);
    });
};
DOMVisual.prototype.removeChild = function (child) {
    // it is easier to track element containement immediately instead
    // of waiting for the update function to be called. This
    // is maybe a little bit ugly, but until I find better, it will do
    this.element.removeChild(child.element);
    this.superRemoveChild(child);
    var connectedToTheStage = this.connectedToTheStage,
        disableEventHooks = this.disableEventHooks;
    visual.forVisualAndAllChildrenDeep(child, function (c) {
        c.connectedToTheStage = false;
        // here we should revalidate the hooks for this child
        updateDOMEventHooks(c);
    });
};
DOMVisual.prototype.enableInteractions = function (enable) {
    var disable = !enable;
    visual.forVisualAndAllChildrenDeep(this, function (c) {
        c.disableEventHooks = disable;
        // here we should revalidate the hooks for this child
        updateDOMEventHooks(c);
    });
};

// we do style through css when dealing with html content
DOMVisual.prototype.setClass = function (cssClassName) {
    var i, l;
    if (isArray(cssClassName)) {
        l = cssClassName.length;
        for (i = 0; i < l; i += 1) {
            this.cssClasses[cssClassName[i]] = true;
        }
    } else {
        // why trigger dom changes immediately, keep this cached
        this.cssClasses[cssClassName] = true;
    }
    setDirty(this, 'content');
};
DOMVisual.prototype.clearClass = function (cssClassName) {
    delete this.cssClasses[cssClassName];
};

DOMVisual.prototype.getDisplayMatrix = function () {
    var scrollX = this.element.scrollLeft,
        scrollY = this.element.scrollTop,
        mat;
        
    if (scrollX || scrollY) {
        mat = glmatrix.mat4.translate(
            this.matrix, 
            [-scrollX, -scrollY, 0],
            glmatrix.mat4.create()
        );
    } else {
        mat = this.matrix;
    }
    return mat;
};


/**
    Flow relegates the positionning to the html engine, flowing
    the content.
    Note that even if we are flowed by html, we still can apply our layout
    rules to our children and ourselves be positioned by our parent
    (i.e. the swagup layouting is independent of the html layouting)
    
    {
        inline: true|false, // inline vs block html flowing
        autoWidth,      // don't use our dimensions
        autoHeight,     // don't use our dimensions 
    }
    use null or undefined to disable flow
*/
DOMVisual.prototype.setHtmlFlowing = function (flowing) {
    if (this.htmlFlowing !== flowing) {
        this.htmlFlowing = flowing;
        setDirty(this, 'matrix');
        setDirty(this, 'dimensions');
    }
};

/**
    Enables children clipping.
    available modes are
        visible hidden scroll
*/
DOMVisual.prototype.setChildrenClipping = function (mode) {
    this.childrenClipping = mode;
    setDirty(this, 'content');
};

/**
    Sets scrolling.
*/
DOMVisual.prototype.setScroll = function (v3) {
    this.scroll = v3;
    setDirty(this, 'content');
};

/**
    DOM update (we essentially treat the DOM as an output thing)
*/
DOMVisual.prototype.updateMatrixRepresentation = function () {
    if (this.element && this.name !== 'stage') {    
        var matrix = this.matrix,
            style = this.element.style,
            htmlFlowing = this.htmlFlowing,
            transform;
        // full matrix not yet supported
        if (!htmlFlowing) {
            // we can either use left & top (if html5 is not supported)
            // or use matrices but in this case, all scaling will be
            // removed
            if (this.isOnlyTranslated()) {
                style.left = matrix[12] + 'px';
                style.top = matrix[13] + 'px';
                style.webkitBackfaceVisibility = null;
                style.MozTransformOrigin = style.webkitTransformOrigin = style.transformOrigin = null;
                style.MozTransform = style.webkitTransform = style.transform = null;
            } else {
                // we need the whole css3 transform shebang
// FIXME: I did not have internet and I want the full matrix thing
                // 3d transform                
                transform = 'translate(' + matrix[12] + 'px, ' + matrix[13] + 'px) ';
                transform += 'scale(' + matrix[0] + ',' + matrix[5] + ')';
                style.webkitBackfaceVisibility = 'hidden';
                style.MozTransformOrigin = style.webkitTransformOrigin = style.transformOrigin = '0 0 0';
                style.MozTransform = style.webkitTransform = style.transform = transform;
            }
        } else {        
            style.left = null; //'auto';
            style.top = null; //'auto';
            style.webkitBackfaceVisibility = null;
            style.MozTransformOrigin = style.webkitTransformOrigin = style.transformOrigin = null;
            style.MozTransform = style.webkitTransform = style.transform = null;
        }
    }
};
DOMVisual.prototype.updateDimensionsRepresentation = function () {
    if (this.element && this.name !== 'stage') {
        var style = this.element.style,
            htmlFlowing = this.htmlFlowing;
        if (!htmlFlowing) {
            style.width = this.dimensions[0] + 'px';
            style.height = this.dimensions[1] + 'px';
            style.position = 'absolute';
            style.display = 'block';
        } else {
            style.width = htmlFlowing.autoWidth ? null : this.dimensions[0] + 'px';
            style.height = htmlFlowing.autoHeight ? null : this.dimensions[1] + 'px';
            style.position = 'relative';
            style.display = htmlFlowing.inline ? 'inline-block' : 'block';
        }
    }
};
DOMVisual.prototype.updateChildrenDepthRepresentation = function () {
// NOT TESTED
/*
    if (this.element) {
        var children = this.children,
            sortedNodes = [],
            element = this.element,
            i, 
            n;
        if (children) {
            // get an ordered children array
            forEachProperty(children, function (c) {
                sortedNodes[c.depth] = element.removeChild(c.element);
            });
            // add all children to their containing element in the right order
            n = sortedNodes.length;
            for (i = 0; i < n; i += 1) {
                element.appendChild(sortedNodes[i]);
            }
        }
    }
*/
};
DOMVisual.prototype.updateContentRepresentation = function () {
    if (this.element) {
        var cssClass = "",
            childrenClipping = this.childrenClipping,
            element = this.element,
            style = element.style;        
        forEachProperty(this.cssClasses, function (c, name) {
            cssClass += name;
            cssClass += ' ';
        });
        element.setAttribute('class', cssClass);
        if (this.childrenClipping) {
            style.overflow = this.childrenClipping;
        } else {
            style.overflow = null;
        }
        if (this.scroll) {
            element.scrollLeft = this.scroll[0];
            element.scrollTop = this.scroll[1];
        }
    }
};

DOMVisual.prototype.getConfigurationSheet = function () {
    return { "class": {} };
};

/////////////////
// a general container
function DOMElement(config, groupData) {
    DOMVisual.call(this, config, groupData, document.createElement('div'));
}
DOMElement.prototype = new DOMVisual();


/////////////////////
// an html container
// this will NOT support addChild
// ANOTHER option would be to have 2 html elements in an DOMHtml, one
// for html and another on top of it for the regular children... this would
// make everything more easy
function DOMHtml(config) {
    DOMVisual.call(this, config, null, document.createElement('div'));
}
DOMHtml.prototype = new DOMVisual();
DOMHtml.prototype.addChild = function () {
    throw new Error("addChild NOT supported in DOMHtml, use DOMElement instead");
};
DOMHtml.prototype.removeChild = function () {
    throw new Error("removeChild NOT supported in DOMHtml, use DOMElement instead");
};

/////////////////
// an img element
function DOMImg(config) {
    DOMVisual.call(this, config, null, document.createElement('img'));
}
DOMImg.prototype = new DOMVisual();
DOMImg.prototype.setUrl = function (url) {
    this.element.src = url;
    //setDirty(this, 'content');
};
DOMImg.prototype.getConfigurationSheet = function () {
    return { "class": {}, "url": {} };
};

/////////////////
// A video tag
function DOMVideo(config) {
    DOMVisual.call(this, config, null, document.createElement('video'));
}
DOMVideo.prototype = new DOMVisual();


exports.getVisualNames = function () {
    return [ 'DOMElement', 'DOMImg', 'DOMVideo' ];
};
exports.DOMElement = DOMElement;
exports.DOMHtml = DOMHtml;
exports.DOMImg = DOMImg;
exports.DOMVideo = DOMVideo;

/*
    We will have to do more than that but we need something to
    setup the topmost container.
*/
exports.createFullScreenApplication = function (child) {
    var bodyElement = document.getElementsByTagName('body')[0],
        thisElement = document.createElement('div'),
        viz = new DOMVisual({}, null, thisElement);
    // do some stupid stuff here:
    bodyElement.appendChild(thisElement);
    if (!child.dimensions) {
        throw new Error("dimensions should be defined by now!");
    }
    viz.setLayout(
        {
    
            dimensions: [100, 100, 0],
            positions: {
                root: {
                    type: "TransformPosition",
                    matrix: [ 100, 0, 0, 0,   0, 100, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    scalemode: "distort"
                }
            }
        }
    );
    viz.connectedToTheStage = true;
    viz.addChild(child, 'root');
    child.setPosition('root');
    viz.name = 'stage';
    viz.matrix = glmatrix.mat4.identity();
    viz.element.style.left = 0;
    viz.element.style.right = 0;
    viz.element.style.top = 0;
    viz.element.style.bottom = 0;
    viz.element.style.position = 'absolute';
    function updateTopLayout() {
        viz.setDimensions([viz.element.offsetWidth, viz.element.offsetHeight, 0]);
    }
    viz.on('resize', function () {
        updateTopLayout();
        // update will be automatically called.
    });
    updateTopLayout();    
    dirty.update();
    return child;
};

