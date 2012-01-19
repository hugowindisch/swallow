/**
    domvisual.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    utils = require('utils'),
    dirty = require('/visual/lib/dirty'),
    position = require('/visual/lib/position'),
    updateDOMEventHooks = require('./domhooks').updateDOMEventHooks,
    Visual = visual.Visual,
    forEachProperty = utils.forEachProperty,
    isObject = utils.isObject;

/*
    We will try to go without jQuery in here (i.e. support jQuery but not
    force it)
*/
function updateCssClass(v) {
    var cssClass = "";
    forEachProperty(v.cssClasses, function (c, name) {
        cssClass += name;
        cssClass += ' ';
    });
    v.element.setAttribute('class', cssClass);
}

function updateConstructed(v) {
}

function updatePositionChanged(v) {
}

function updateParentChanged(v) {
// no longer needed
/*    // first, we must update our parent connection
    var parent = v.parent;
    if (parent) {
        // we should have a parent with an element
        if (parent.element) {
            // this should match the dom parent of our element.
            
        } else {
            throw new Error("Non topmost DOMVisual with no DOMVisual parent.");
        }
    } else {
        // we have no parent, so we should be un parented in the DOM too
        // excepted if, we are the so called 'stage' or topmost thing
    }*/
}

function updateChildrenDepthShuffled(v) {
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

function updateLayout(v) {
    var layout = v.layout;
    if (layout) {
        position.applyLayout(v.dimensions, layout, v.children);
    }
}

function DOMVisual(config, element) {
    var that = this;
    this.element = element;
    this.cssClasses = {};
    this.setClass('domvisual');
    Visual.call(this, config);
    // this might not be the best idea, maybe overriding addListener would
    // be better.
    this.addListener('addListener', function () {
        updateDOMEventHooks(that);
    });
    this.setConfig(config);
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
};
DOMVisual.prototype.removeChild = function (child) {
    // it is easier to track element containement immediately instead
    // of waiting for the update function to be called. This
    // is maybe a little bit ugly, but until I find better, it will do
    this.element.removeChild(child.element);
    this.superRemoveChild(child);
};
// we do style through css when dealing with html content
DOMVisual.prototype.setClass = function (cssClassName) {
    // why trigger dom changes immediately, keep this cached
    this.cssClasses[cssClassName] = true;
    dirty.setDirty(this, 'cssClass');
    
};
DOMVisual.prototype.clearClass = function (cssClassName) {
    delete this.cssClasses[cssClassName];
};
/**
    Applies a position to the element (i.e. convert it to something that
    works in the target rendering system, e.g. the DOM)
*/
DOMVisual.prototype.applyPosition = function (matrix, newdimensions) {
    var style = this.element.style;
    if (newdimensions) {
        this.setDimensions(newdimensions);
        style.width = newdimensions[0] + 'px';
        style.height = newdimensions[1] + 'px';
    }
    if (matrix) {
        // let'say we don't initially support css3
        style.left = matrix[12] + 'px';
        style.top = matrix[13] + 'px';
    }
    // this is not accurate because for flow positions we don't want
    // to be absolute
    style.position = 'absolute';
    dirty.setDirty(this, 'layout');
};

DOMVisual.prototype.update = function (why) {
    // if we don't have an element, we are probably a prototype
    if (this.element) {        
        if (why.cssClass) {
            updateCssClass(this);
        }
        if (why.constructed) {
            updateConstructed(this);
        }
        if (why.positionChanged) {
            updatePositionChanged(this);
        }
        if (why.parentChanged) {
            updateParentChanged(this);
        }
        if (why.childrenDepthShuffled) {
            updateChildrenDepthShuffled(this);
        }
        // this means that our actual position changed
        if (why.layout) {
            updateLayout(this);
        }
    }
};
DOMVisual.prototype.setConfig = function (config) {
    var conf, i, classes;
    if (isObject(config)) {
        conf = config['domvisual.DOMVisual'];
        if (conf) {
            classes = conf.cssClass;
            if (classes) {
                for (i = 0; i < classes.length; i += 1) {
                    this.setClass(classes[i]);
                }
            }
        }
    }
//    var d = config['domvisual.DOMVisual'];
//    if (d) {
//    }
};


/////////////////
// a general container
function DOMElement(config) {
    DOMVisual.call(this, config, document.createElement('div'));
}
DOMElement.prototype = new DOMVisual();


/////////////////////
// an html container
// this will NOT support addChild
// ANOTHER option would be to have 2 html elements in an DOMHtml, one
// for html and another on top of it for the regular children... this would
// make everything more easy
function DOMHtml(config) {
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
}
DOMImg.prototype = new DOMVisual();

/////////////////
// A video tag
function DOMVideo() {
}
DOMVideo.prototype = new DOMVisual();


exports.getVisualNames = function () {
    return [ 'DOMElement', 'DOMImg', 'DOMVideo' ];
};
exports.DOMElement = DOMElement;
exports.DOMImg = DOMImg;
exports.DOMVideo = DOMVideo;

/*
    We will have to do more than that but we need something to
    setup the topmost container.
*/
exports.createFullScreenApplication = function (child) {
    var bodyElement = document.getElementsByTagName('body')[0],
        thisElement = document.createElement('div'),
        viz = new DOMVisual({}, thisElement);
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
                    matrix: [ 100, 0, 0, 0,   0, 100, 0, 0,    0, 0, 1, 0,   0, 0, 0, 0 ],
                    scalemode: "distort"
                }
            }
        }
    );
    viz.addChild(child, 'root');
    child.setPosition('root');
    viz.name = 'stage';
    viz.element.style.left = 0;
    viz.element.style.right = 0;
    viz.element.style.top = 0;
    viz.element.style.bottom = 0;
    viz.element.style.position = 'absolute';
    function updateTopLayout() {
        viz.dimensions = [viz.element.offsetWidth, viz.element.offsetHeight, 0];
        dirty.setDirty(viz, 'layout');
    }
    viz.on('resize', function () {
        updateTopLayout();
        // update will be automatically called.
    });
    updateTopLayout();    
    dirty.update();
    return child;
};

