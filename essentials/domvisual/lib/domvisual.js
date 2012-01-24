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
DOMVisual.prototype.enableInteractions = function (enable) {
    delete this.disableEventHooks;
    if (!enable) {
        this.disableEventHooks = true;
    }
    updateDOMEventHooks(this);
};

// we do style through css when dealing with html content
DOMVisual.prototype.setClass = function (cssClassName) {
    // why trigger dom changes immediately, keep this cached
    this.cssClasses[cssClassName] = true;
    dirty.setDirty(this, 'content');
    
};
DOMVisual.prototype.clearClass = function (cssClassName) {
    delete this.cssClasses[cssClassName];
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
        dirty.setDirty(this, 'matrix');
        dirty.setDirty(this, 'dimensions');
    }
};

/**
    DOM update (we essentially treat the DOM as an output thing)
*/
DOMVisual.prototype.updateMatrixRepresentation = function () {
    if (this.element && this.name !== 'stage') {    
        var style = this.element.style,
            htmlFlowing = this.htmlFlowing;
        // full matrix not yet supported
        if (!htmlFlowing) {
            style.left = this.matrix[12] + 'px';
            style.top = this.matrix[13] + 'px';
        } else {        
            style.left = null; //'auto';
            style.top = null; //'auto';
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
        var cssClass = "";
        forEachProperty(this.cssClasses, function (c, name) {
            cssClass += name;
            cssClass += ' ';
        });
        this.element.setAttribute('class', cssClass);
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
};
DOMVisual.prototype.updateContainerRepresentation = function () {
    // FIXME: not supported yet (not sure this should even exist)
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
    DOMVisual.call(this, config, document.createElement('img'));
    if (config && config['domvisual.DOMImg'] && config['domvisual.DOMImg'].url) {
        this.setUrl(config['domvisual.DOMImg'].url);
    }
}
DOMImg.prototype = new DOMVisual();
DOMImg.prototype.setUrl = function (url) {
    this.element.src = url;
};

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

