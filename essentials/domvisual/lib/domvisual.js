/**
    domvisual.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    utils = require('utils'),
    dirty = require('/visual/lib/dirty'),
    Visual = visual.Visual,
    forEachProperty = utils.forEachProperty;
    
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
function DOMVisual(element) {
    this.element = element;
    this.cssClasses = {};
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
    
};
DOMVisual.prototype.clearClass = function (cssClassName) {
    delete this.cssClasses[cssClassName];
};

DOMVisual.prototype.update = function (why) {
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
};

/////////////////
// a general container
function DOMElement() {
    DOMVisual.call(this, document.createElement('div'));
}
DOMElement.prototype = new DOMVisual();

/////////////////////
// an html container
// this will NOT support addChild
// ANOTHER option would be to have 2 html elements in an DOMHtml, one
// for html and another on top of it for the regular children... this would
// make everything more easy
function DOMHtml() {
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
function DOMImg() {
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
exports.createTopmostContainer = function () {
    return new DOMVisual(document.getElementsByTagName('body')[0]);
};

