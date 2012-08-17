/**
    domvisual.js
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
var visual = require('visual'),
    utils = require('utils'),
    dirty = require('/visual/lib/dirty'),
    position = require('/visual/lib/position'),
    glmatrix = require('glmatrix'),
    config = require('config'),
    styles = require('./styles'),
    styleToCss = styles.styleToCss,
    updateDOMEventHooks = require('./domhooks').updateDOMEventHooks,
    keycodes = require('./keycodes'),
    preferences = require('./browser').getPreferences(),
    Visual = visual.Visual,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEachProperty,
    isObject = utils.isObject,
    isArray = utils.isArray,
    isNumber = utils.isNumber,
    apply = utils.apply,
    prune = utils.prune,
    vec3IsEqual = visual.vec3IsEqual,
    getStyleDimensionAdjustment = styles.getStyleDimensionAdjustment,
    setDirty = dirty.setDirty,
    theStage;

/**
* This package implements subclasses of visual.Visual that can be used
* in the context of the DOM.
* @package domvisual
*/

/**
* Constructs a DOMVisual
* This constructor serves as an abstract base class for all dom visual elements.
* @memberOf domvisual
*/
function DOMVisual(config, groupData, element) {
    var that = this;
    this.element = element;
    this.connectedToTheStage = false;
    this.disableInteractiveEventHooks = false;
    this.visible = true;
    // this might not be the best idea, maybe overriding addListener would
    // be better.
    this.addListener('newListener', function () {
        updateDOMEventHooks(that);
    });
    Visual.call(this, config, groupData);

}

DOMVisual.prototype = new Visual();

/**
* Adds a child to a DOMVisual
* @api private
*/
DOMVisual.prototype.addChild = function (child, name, optionalOrder) {
    var connectedToTheStage,
        disableInteractiveEventHooks,
        orderDirty = this.dirty ? this.childrenOrder === true : false;
    if (!child) {
        throw new Error('Adding an invalid child ' + child);
    }
    if (!child.element) {
        throw new Error('Non DOM child added to a DOM visual');
    }
    // it is easier to track element containement immediately instead
    // of waiting for the update function to be called.
    Visual.prototype.addChild.call(this, child, name, optionalOrder);
    // no need to worry, we can add the element at the end of the list
    if (!this.dirty || !this.dirty.childrenOrder || orderDirty) {
        this.element.appendChild(child.element);
    } else {
        // we need to find the element at optionalOrder+1
        // and put this thing before
        this.element.insertBefore(
            child.element,
            this.getChildAtOrder(optionalOrder).element
        );
        // and manually clear the dirt (ok, this is ugly)
        delete this.dirty.orderDirty;
    }
    connectedToTheStage = this.connectedToTheStage;
    disableInteractiveEventHooks = this.disableInteractiveEventHooks;
    visual.forVisualAndAllChildrenDeep(child, function (c) {
        c.connectedToTheStage = connectedToTheStage;
        if (disableInteractiveEventHooks) {
            c.disableInteractiveEventHooks = true;
        }
        // here we should revalidate the hooks for this child
        updateDOMEventHooks(c);
    });
    return this;
};

/**
* Removes a child to a DOMVisual
* @api private
*/
DOMVisual.prototype.removeChild = function (child) {
    // it is easier to track element containement immediately instead
    // of waiting for the update function to be called.
    child = this.resolveChild(child);
    try {
        this.element.removeChild(child.element);
    } catch (e) {
        throw new Error("Child " +
            child.name +
            " not in " +
            this.getFullName());
    }
    Visual.prototype.removeChild.call(this, child);
    var connectedToTheStage = this.connectedToTheStage,
        disableInteractiveEventHooks = this.disableInteractiveEventHooks;
    visual.forVisualAndAllChildrenDeep(child, function (c) {
        c.connectedToTheStage = false;
        // here we should revalidate the hooks for this child
        updateDOMEventHooks(c);
    });
    return this;
};

/**
* Sets the dimensions of a DOMVisual
* @api private
*/
DOMVisual.prototype.setDimensions = function (d) {
    if ((!this.hasOwnProperty('dimensions')) || d[0] !== this.dimensions[0] || d[1] !== this.dimensions[1]) {
        Visual.prototype.setDimensions.apply(this, arguments);
        // the whole thing of upwards notification is still a bit experimental
        // and maybe ugly... but... if we resize something that is flowed,
        // we want the container of the flowed stuff to be notified
        // so it can do something if it needs to adapt.
        this.notifyDOMChanged();
    }
    return this;
};

/**
* Enables/Disables interactions in a DOMVisual
* @api private
*/
DOMVisual.prototype.enableInteractions = function (enable) {
    var disable = !enable;
    visual.forVisualAndAllChildrenDeep(this, function (c) {
        c.disableInteractiveEventHooks = disable;
        // here we should revalidate the hooks for this child
        updateDOMEventHooks(c);
    });
};

/**
* +/- deprecated
* @api private
*/
DOMVisual.prototype.setClass = function (cssClassName) {
    var i, l;
    if (this.cssClasses === undefined) {
        this.cssClasses = {};
    }
    if (isArray(cssClassName)) {
        l = cssClassName.length;
        for (i = 0; i < l; i += 1) {
            this.cssClasses[cssClassName[i]] = true;
        }
    } else {
        // why trigger dom changes immediately, keep this cached
        this.cssClasses[cssClassName] = true;
    }
    setDirty(this, 'style');
    return this;
};

/*
* +/- deprecated
* @api private
*/
DOMVisual.prototype.clearClass = function (cssClassName) {
    if (this.cssClasses[cssClassName]) {
        delete this.cssClasses[cssClassName];
        setDirty(this, 'style');
    }
};

/*
* getDisplayMatrix
* @api private
*/
DOMVisual.prototype.getDisplayMatrix = function () {
    var scrollX = this.element.scrollLeft,
        scrollY = this.element.scrollTop,
        mat;

    if (this.htmlFlowing) {
        mat = this.getComputedMatrix();

    } else {
        mat = this.getMatrix();
    }

    if (scrollX || scrollY) {
        mat = glmatrix.mat4.translate(
            mat,
            [-scrollX, -scrollY, 0],
            glmatrix.mat4.create()
        );
    }
    return mat;
};

/**
* Flow relegates the positionning to the html engine, flowing
* the content.
* Note that even if we are flowed by html, we still can apply our layout
* rules to our children and ourselves be positioned by our parent
* (i.e. the swallow layouting is independent of the html layouting)
* use null or undefined to disable flow
* @param {Object} styles extra styles to apply while flowing
* @param {Boolean} true to size this element normally
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setHtmlFlowing = function (styles, applySizing) {
    if (this.htmlFlowing !== styles) {
        this.htmlFlowing = styles;
        setDirty(this, 'matrix', 'dimensions');
    }
    applySizing = (applySizing === true);
    if (this.htmlFlowingApplySizing !== applySizing) {
        this.htmlFlowingApplySizing = applySizing;
        setDirty(this, 'matrix', 'dimensions');
    }
    return this;
};

/*
* As an explicit but quite ugly way to allow containers
* that have a layout to be notified of a change in underlying
* flowed content (not that these containers may be themselves flowed).
* we have this method (that must be called manually) (by flowed content).
*
* (this avoids the use of DOM mutation events)
* (this pretty ugly/convoluted... but...)
*
*
* NOTE: we could force a getDomAccces() and releaseDomAccess for
* dealing with explicit 'html flowed' stuff and hook the event on the release.
*
* This may be a very bad idea.
* (poorly documented, and to be changed if possible)
* @api private
*/
DOMVisual.prototype.notifyDOMChanged = function () {
    var that = this,
        v = that;
    function emitter(v) {
        return function () {
            v.emit('domchanged');
            dirty.update();
        };
    }
    while (v) {
        if (v.getListeners('domchanged').length > 0) {
            // quite ugly FIXME: the 100 here is arbitrary BUT...
            // some kind of delay seems to be needed (so that
            // the browser regenerates its content and it becomes possible
            // to measure it correctly...)
            setTimeout(emitter(v), 200);
            break;
        }
        if (v !== that && !v.htmlFlowing) {
            break;
        }
        v = v.parent;
    }
    return this;
};

/**
* Enables children clipping. available modes are:
*        visible hidden scroll auto
*
* @param {String} mode A string or array (to separate x and y clipping mode)
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setOverflow = function (mode) {
    this.childrenClipping = mode;
    setDirty(this, 'style');
    return this;
};

/**
* Sets the scrolling value of this element.
* @param {vec3} v3 The scrolling position.
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setScroll = function (v3) {
    this.scroll = v3;
    setDirty(this, 'style');
    return this;
};

/**
* Sets the visibility of this eleemnt.
* @param {Boolean} visible The visibility
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setVisible = function (visible) {
    if (this.visible !== visible) {
        this.visible = visible;
        setDirty(this, 'dimensions');
    }
    return this;
};

/**
* Returns the visibility of this eleemnt.
* @returns {Boolean} the visibility of this element.
*/
DOMVisual.prototype.getVisible = function () {
    return this.visible;
};

/**
* Sets the cursor.
* @param {String} the cursor (ex: 'pointer')
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setCursor = function (cursor) {
    this.element.style.cursor = cursor;
    return this;
};

/**
* Sets the transition (to apply to all properties)... Not sure this is what
* we ultimately want (pretty sure it is not... but for now it is this way).
* @param {Number} duration The duration in ms
* @param {String} easingFunction The easing function (defaults to 'easein')
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setTransition = function (
    duration,
    easingFunction
) {
    // force update
    dirty.update();
    // set the transition
    this.transition = {
        duration: duration || 300,
        easingFunction: easingFunction || 'easein',
        // we do not support partial transitions yet
        property: 'all'
    };
    this.updateTransitionRepresentation();
    return this;
};

/**
* Clears the transition.
* @returns this (for chaining calls).
*/
DOMVisual.prototype.clearTransition = function () {
    // force update
    dirty.update();
    // remove the transition
    delete this.transition;
    this.updateTransitionRepresentation();
};

/**
* Adds some html as a child of this element (can be used to create children
* that use plain html. i.e. to create more software components that don't use
* the editor.
* @param {String} tag The tag to use (e.g. 'div')
* @param {String} text The html to use
* @param {Object} config (any config to pass to the DOMVisual)
* @param {String} name The name of the child
* @returns The created child.
*/
DOMVisual.prototype.addHtmlChild = function (tag, text, config, name) {
    var element = document.createElement(tag),
        child = new DOMVisual(config, null, element);
    element.innerHTML = text;
    child.setHtmlFlowing({});
    this.addChild(child, name);
    return child;
};

/**
* Adds some text as a child of this element (can be used to create children
* that use plain html. i.e. to create more software components that don't use
* the editor.
* @param {String} tag The tag to use (e.g. 'div')
* @param {String} text The text to use
* @param {Object} config (any config to pass to the DOMVisual)
* @param {String} name The name of the child
* @returns The created child.
*/
DOMVisual.prototype.addTextChild = function (tag, text, config, name) {
    var element = document.createElement(tag),
        child = new DOMVisual(config, null, element);
    child.element.appendChild(document.createTextNode(text));
    child.setHtmlFlowing({});
    this.addChild(child, name);
    return child;
};

/**
* Sets the html of a DOMVisual. This removes all children.
* (note: we could have an option to keep the children... since we can
* easily remove them first, and re add them after).
* @param {String} html The html to use.
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setInnerHTML = function (html) {
    this.removeAllChildren();
    this.element.innerHTML = html;
    setDirty(this, 'matrix', 'dimensions', 'style');
    return this;
};

/**
* Sets the text of a DOMVisual. This removes all children.
* @param {String} text The text to use
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setInnerText = function (text) {
    this.removeAllChildren();
    this.element.innerHTML = '';
    // skip obvious cases of emptyness
    if (text !== null && text !== undefined && text !== '') {
        this.element.appendChild(document.createTextNode(text));
    }
    setDirty(this, 'matrix', 'dimensions', 'style');
    return this;
};

/**
* Sets html (tag) attributes. This should not be useful most of the time.
* @param {Object} attr The attributes to use.
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setElementAttributes = function (attr) {
    var element = this.element;
    forEachProperty(attr, function (v, n) {
        element.setAttribute(String(n), String(v));
    });
    return this;
};

/**
* Sets style attributes (see styles.js for what is supported).
* Note:
*     - some functions could be removed because they overlap on this one
*     - Clearing : set with null or undefined (+ uniformize this with
*         setElementAttributes).
*     - These attributes OVERRRIDE what is defined in the styles
*     - FIXME: there is a clash between the setHtmlFlowing thing and this.
* @param {Object} attr The attributes to use.
* @returns this (for chaining calls).
*/
DOMVisual.prototype.setStyleAttributes = function (attr) {
    if (!this.styleAttributes) {
        this.styleAttributes = {};
    }
    apply(this.styleAttributes, attr);
    if (prune(this.styleAttributes) === 0) {
        delete this.styleAttributes;
    }
    setDirty(this, 'style');
    return this;
};

/*
* setStyleDimensionsAdjustment
* @api private
*/
DOMVisual.prototype.setStyleDimensionsAdjustment = function (v3) {
    if (!vec3IsEqual(v3, this.styleDimensionsAdjustment)) {
        if (!v3) {
            if (this.styleDimensionsAdjustment) {
                delete this.styleDimensionsAdjustment;
                // dirty size representation
                setDirty(this, 'dimensions');
            }
        } else {
            this.styleDimensionsAdjustment = v3;
            // dirty size representation
            setDirty(this, 'dimensions');
        }
    }
    return this;
};

/*
* DOM update (we essentially treat the DOM as an output thing)
* @api private
*/
function has3D(mat) {
    return mat[2] !== 0 ||
        mat[6] !== 0 ||
        mat[14] !== 0;
}
function onlyTranslate(mat) {
    return mat[0] === 1 &&
        mat[1] === 0 &&
        mat[2] === 0 &&

        mat[4] === 0 &&
        mat[5] === 1 &&
        mat[6] === 0 &&

        mat[8] === 0 &&
        mat[9] === 0 &&
        mat[10] === 1;
}

DOMVisual.prototype.updateMatrixRepresentation = function () {
    if (this.element && this.name !== 'stage') {
        var matrix = this.matrix,
            style = this.element.style,
            htmlFlowing = this.htmlFlowing,
            transform,
            preferMatrixPositioning = preferences.preferMatrixPositioning,
            allow3D = preferences.allow3D;
        // full matrix not yet supported
        if (!htmlFlowing) {
            if (matrix) {
                // we can either use left & top (if html5 is not supported)
                // or use matrices but in this case, all scaling will be
                // removed
                if (!preferMatrixPositioning && onlyTranslate(matrix)) {
                    style.left = matrix[12] + 'px';
                    style.top = matrix[13] + 'px';
                    style.webkitBackfaceVisibility = null;
                    style.MozTransformOrigin =
                        style.webkitTransformOrigin =
                        style.transformOrigin =
                        null;
                    style.MozTransform =
                        style.webkitTransform =
                        style.transform =
                        null;
                } else {
                    // we need the whole css3 transform shebang
                    // 3d transform
                    style.left = '0px';
                    style.top = '0px';
                    // note: if there is no 3d, we could (maybe default to the 2d
                    // version)
                    if (!has3D(matrix) || !allow3D) {
                        transform = 'matrix(' +
                            matrix[0] +
                            ', ' +
                            matrix[1] +
                            ', ' +
                            matrix[4] +
                            ', ' +
                            matrix[5] +
                            ', ' +
                            matrix[12] +
                            ', ' +
                            matrix[13] +
                            ')';
                    } else {
                        transform = 'matrix3d(' +
                            matrix[0] +
                            ', ' +
                            matrix[1] +
                            ', ' +
                            matrix[2] +
                            ', ' +
                            matrix[3] +
                            ', ' +
                            matrix[4] +
                            ', ' +
                            matrix[5] +
                            ', ' +
                            matrix[6] +
                            ', ' +
                            matrix[7] +
                            ', ' +
                            matrix[8] +
                            ', ' +
                            matrix[9] +
                            ', ' +
                            matrix[10] +
                            ', ' +
                            matrix[11] +
                            ', ' +
                            matrix[12] +
                            ', ' +
                            matrix[13] +
                            ', ' +
                            matrix[14] +
                            ', ' +
                            matrix[15] +
                            ')';
                    }
                }
                style.MozTransformOrigin =
                    style.webkitTransformOrigin =
                    style.transformOrigin = '0 0 0';
                style.MozTransform =
                    style.webkitTransform =
                    style.transform =
                    transform;
            }
        } else {
            style.left = null;
            style.top = null;
            style.webkitBackfaceVisibility = null;
            style.MozTransformOrigin =
                style.webkitTransformOrigin =
                style.transformOrigin =
                null;
            style.MozTransform =
                style.webkitTransform =
                style.transform =
                null;
        }
        if (allow3D) {
            // FIXME: HACK for testing perspective stuff.
            style.MozPerspective =
                style.webkitPerspective = '500px';
        }

    }
};

/*
* updateTransitionRepresentation
* @api private
*/
DOMVisual.prototype.updateTransitionRepresentation = function () {
    var transition = this.transition || { property: null, duration: null, easingFunction: null },
        style = this.element.style;


    // transitions FIXME: not sure this should be here
    style.webkitTransitionProperty =
        style.MozTransitionProperty =
        style.transitionProperty =
        transition.property;

    style.webkitTransitionDuration =
        style.MozTransitionDuration =
        style.transitionDuration =
        transition.duration + 'ms';

    style.webkitTransitionTimingFunction =
        style.MozTransitionTimingFunction =
        style.transitionTimingFunction =
        transition.easingFunction;
};

/*
* updateDimensionsRepresentation
* @api private
*/
DOMVisual.prototype.updateDimensionsRepresentation = function () {
    function adjust(v, a) {
        if (a >= v) {
            return 1;
        }
        return v - a;
    }
    if (this.element && this.name !== 'stage') {
        var style = this.element.style,
            htmlFlowing = this.htmlFlowing,
            dimensions = this.dimensions,
            styleDimensionsAdjustement = this.styleDimensionsAdjustment ||
                [0, 0];
        if (!htmlFlowing) {
            style.width =
                adjust(dimensions[0], styleDimensionsAdjustement[0]) +
                'px';
            style.height =
                adjust(dimensions[1], styleDimensionsAdjustement[1]) +
                'px';
            style.position = 'absolute';
            style.display = this.visible ? 'block' : 'none';
        } else {
            // clear our stuff
            if (this.htmlFlowingApplySizing) {
                style.width =
                    adjust(dimensions[0], styleDimensionsAdjustement[0]) +
                    'px';
                style.height =
                    adjust(dimensions[1], styleDimensionsAdjustement[1]) +
                    'px';
            } else {
                style.width = null;
                style.height = null;
            }
            style.position = null;
            style.display = null;
            // let the htmlFlowing apply its stuff
            forEachProperty(htmlFlowing, function (v, n) {
                style[n] = v;
            });
            // override visibility
            if (!this.visible) {
                style.display = 'none';
            }
        }
    }
};

/*
* updateChildrenOrderRepresentation
* @api private
*/
DOMVisual.prototype.updateChildrenOrderRepresentation = function () {
    if (this.element) {
        var children = this.children,
            sortedNodes = [],
            element = this.element,
            i,
            n;
        if (children) {
            // get an ordered children array
            forEachProperty(children, function (c) {
                sortedNodes[c.order] = c.element;
                element.removeChild(c.element);
            });
            // add all children to their containing element in the right order
            n = sortedNodes.length;
            for (i = 0; i < n; i += 1) {
                if (sortedNodes[i]) {
                    element.appendChild(sortedNodes[i]);
                }
            }
        }
    }
};

/*
* updateStyleRepresentation
* @api private
*/
DOMVisual.prototype.updateStyleRepresentation = function () {
    var cssClass,
        element = this.element,
        styleData,
        jsData,
        v,
        style;
    // FIXME note: what if we have no style at all whatsoever?
    // Why do this at all?
    // (many groups will have no style of their own)
    if (element) {
        styleData = this.getStyleData();
        // retrieve the css classes that apply
        cssClass = styleData.data.join(' ');
        style = element.style;
        forEachProperty(this.cssClasses, function (c, name) {
            cssClass += ' ';
            cssClass += name;
        });
        element.setAttribute('class', cssClass);
        jsData = styleData.jsData;
        if (this.styleAttributes) {
            apply(jsData, this.styleAttributes);
        }
        styleToCss(style, jsData);
        // because of the weird effect of borders on the visible size of
        // explicitely sized elements in html, we need to adjust for border size
        this.setStyleDimensionsAdjustment(getStyleDimensionAdjustment(jsData));
    }
};

/*
* updateOpacityRepresentation
* @api private
*/
DOMVisual.prototype.updateOpacityRepresentation = function () {
    var element = this.element,
        style;
    if (element) {
        style = element.style;
        if (isNumber(this.opacity)) {
            style.webkitOpacity =
                style.opacity =
                style.mozOpacity =
                this.opacity;
        } else {
            style.webkitOpacity =
                style.opacity =
                style.mozOpacity =
                null;
        }
    }
};

/*
* updateDone
* @api private
*/
DOMVisual.prototype.updateDone = function () {
    var element = this.element,
        style,
        childrenClipping;
    if (element) {
        style = element.style;
        childrenClipping = this.childrenClipping;
        if (childrenClipping) {
            if (isArray(childrenClipping)) {
                style.overflowX = childrenClipping[0];
                style.overflowY = childrenClipping[1];
            } else {
                style.overflow = childrenClipping;
            }
        } else {
            style.overflow = null;
        }
        if (this.scroll) {
            element.scrollLeft = this.scroll[0];
            element.scrollTop = this.scroll[1];
        }
    }
};

/*
* @getConfigurationSheet
* @api private
*/
DOMVisual.prototype.getConfigurationSheet = function () {
    return { "class": {}, "style": {} };
};

/*
* Returns the computed matrix of this element
* (if the element uses html flowing)
* This can go wrong (the values may not be already good... apparently)
* @api private
*/
DOMVisual.prototype.getComputedMatrix = function () {
    // this retrieves stuff for the dom, so we must be clean
    dirty.update();
    var ret = glmatrix.mat4.identity(),
        element = this.element;

    ret[12] = element.offsetLeft;
    ret[13] = element.offsetTop;
    return ret;
};

/*
* Returns the computed dimension of this element
* (if the element uses html flowing)
* @api private
*/
DOMVisual.prototype.getComputedDimensions = function () {
    // this retrieves stuff for the dom, so we must be clean
    dirty.update();
    var element = this.element,
        style = this.element.style,
        w = style.width,
        h = style.height,
        ret;
    style.width = null;
    style.height = null;
    ret =  [ element.offsetWidth, element.offsetHeight, 1];
    style.width = w;
    style.height = h;
    return ret;
};


/*
* Creates a 'stage' in a given element. This can be used to create the
* top level stage in a full screen application or to punch swallow components
* inside some free flowing html.
*/
function createStage(inElement) {
    var viz = new DOMVisual({}, null, inElement);
    // do some stupid stuff here:
    function updateTopLayout() {
        viz.setDimensions(
            [viz.element.offsetWidth, viz.element.offsetHeight, 0]
        );
    }

    inElement.innerHTML = '';
    inElement.style.overflow = 'hidden';
    viz.setLayout(
        {
            dimensions: [100, 100, 0],
            positions: {
                root: {
                    matrix: [
                        100, 0, 0, 0, 0, 100, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                    ],
                    snapping: {
                        left: 'px',
                        right: 'px',
                        width: 'auto',
                        top: 'px',
                        bottom: 'px',
                        height: 'auto'
                    }
                }
            }
        }
    );
    viz.connectedToTheStage = true;
    viz.name = 'stage';
    viz.matrix = glmatrix.mat4.identity();
    viz.element.style.left = '0px';
    viz.element.style.right = '0px';
    viz.element.style.top = '0px';
    viz.element.style.bottom = '0px';
    viz.element.style.position = 'absolute';
    viz.setOverflow('hidden');
    viz.on('resize', function () {
        updateTopLayout();
        dirty.update();
    });
    updateTopLayout();
    return viz;
}

function createVisual(inElement, factory, type, config, optionalWidth, optionalHeight) {
    var viz = new DOMVisual({}, null, inElement),
        f = require(factory),
        T = f[type],
        c = new T(config),
        w = optionalWidth || Number(inElement.offsetWidth),
        h = optionalHeight || Number(inElement.offsetHeight);
    viz.setLayout(
        {
            dimensions: [w, h, 0],
            positions: {
                root: {
                    matrix: [
                        w, 0, 0, 0,       0, h, 0, 0,      0, 0, 1, 0,     0, 0, 0, 1
                    ],
                    snapping: {
                        left: 'px',
                        right: 'px',
                        width: 'auto',
                        top: 'px',
                        bottom: 'px',
                        height: 'auto'
                    }
                }
            }
        }
    );
    viz.connectedToTheStage = true;
    viz.name = 'stage';
    viz.matrix = glmatrix.mat4.identity();
    viz.element.style.position = 'relative';

// can we let any element be its own root by overriding its element or something
    viz.addChild(c, 'root');
    c.setPosition('root');
    viz.setDimensions([w, h, 1]);
    return c;

}
exports.createVisual = createVisual;

/*
* Creates or returns the (already created) stage.
* @api private
*/
function getStage() {
    var topMost;
    if (!theStage) {
        topMost = document.createElement('div');
        document.getElementsByTagName('body')[0].appendChild(topMost);
        theStage = createStage(topMost);

    }
    return theStage;
}

/*
* Runs this element full screen.
* @api private
*/
DOMVisual.prototype.runFullScreen = function () {
    getStage().addChild(this);
    this.setPosition('root');
    dirty.update();
    return this;
};

/**
* Constructs a DOMElement.
* @param {Object} config The configuration if any.
* @param {Object} groupData The data from the editor if any.
* @memberOf domvisual
*/
function DOMElement(config, groupData) {
    DOMVisual.call(this, config, groupData, document.createElement('div'));
}

DOMElement.prototype = new DOMVisual();

/**
* Returns the description of this element (to be displayed in the editor).
* @returns The textual descripton of this element.
* @type String
*/
DOMElement.prototype.getDescription = function () {
    return "A styled rectangle with optional text";
};

/**
* Creates a preview for the editor
* @returns The visual to display as a preview.
* @type Visual
*/
DOMElement.createPreview = function () {
    return new (exports.DOMImg)({url: 'domvisual/img/elementpreview.png'});
};

/**
* Returns the configuration sheet of this element (allowing the editor to
* configure it in the panel)
* @returns The configuration sheet for this element.
* @type Object
*/
DOMElement.prototype.getConfigurationSheet = function () {
    return {
        "class": null,
        "innerText": require('config').inputConfigFullLine('Text'),
        "style": require('config').styleConfig('Style:')
    };
};

/**
* Constructs an image element.
* @memberOf domvisual
*/
function DOMImg(config) {
    DOMVisual.call(this, config, null, document.createElement('img'));
}

DOMImg.prototype = new DOMVisual();

/**
* Returns the description of this element (to be displayed in the editor).
* @returns The textual descripton of this element.
* @type String
*/
DOMImg.prototype.getDescription = function () {
    return "A png or jpeg image";
};

/**
* Creates a preview for the editor
* @returns The visual to display as a preview.
* @type Visual
*/
DOMImg.createPreview = function () {
    return new (DOMImg)({url: 'domvisual/img/imagepreview.png'});
};

/**
* Sets the url of the image to display.
* @param {String} url The url of the image to display.
* @returns this.
* @type DOMImg
*/
DOMImg.prototype.setUrl = function (url) {
    this.element.src = url;
    return this;
};

/**
* Returns the dimensions of the inner image (real dimensions)
* @returns The dimensions of the image.
* @type vec3
*/
DOMImg.prototype.getImageDimensions = function () {
    var element = this.element;
    return [element.naturalWidth, element.naturalHeight, 0];
};

/**
* Returns the dimensions of the inner image (real dimensions)
* @returns The dimensions of the image.
* @type vec3
*/
DOMImg.prototype.getNaturalDimensions = function () {
    return this.getImageDimensions();
};

/**
* Returns the configuration sheet of this element (allowing the editor to
* configure it in the panel)
* @returns The configuration sheet for this element.
* @type Object
*/
DOMImg.prototype.getConfigurationSheet = function () {
    return {
        "class": null,
        "url": require('config').imageUrlConfig('Image'),
        "style": null //require('config').styleConfig('Style:')
    };
};

/**
* Constructs a video element.
* @memberOf domvisual
*/
function DOMVideo(config) {
    DOMVisual.call(this, config, null, document.createElement('video'));
}

DOMVideo.prototype = new DOMVisual();

/**
* Returns the description of this element (to be displayed in the editor).
* @returns The textual descripton of this element.
* @type String
*/
DOMVideo.prototype.getDescription = function () {
    return "A movie";
};

/**
* Creates a preview for the editor
* @returns The visual to display as a preview.
* @type Visual
*/
DOMVideo.createPreview = function () {
    return new (DOMImg)({url: 'domvisual/img/videopreview.png'});
};

/**
* Sets the url of the video to display.
* @param {String} url The url of the video to display.
* @returns this.
* @type DOMVideo
*/
DOMVideo.prototype.setUrl = function (url) {
    this.element.src = url;
    return this;
};
/**
* Returns the configuration sheet of this element (allowing the editor to
* configure it in the panel)
* @returns The configuration sheet for this element.
* @type Object
*/
DOMVideo.prototype.getConfigurationSheet = function () {
    return {
        "class": null,
        "url": require('config').inputConfig('Url'),
        "style": require('config').styleConfig('Style:')
    };
};

/**
* Constructs an input element.
* @memberOf domvisual
*/
function DOMInput(config) {
    DOMVisual.call(this, config, null, document.createElement('input'));
    var that = this;
    // prevent form submission that we will never use
    this.on('keydown', function (evt) {
        if (evt.keyCode === 13) {
            evt.stopPropagation();
        }
    });
}

DOMInput.prototype = new DOMVisual();

/**
* Sets the type of this input element.
* @param {String} type The type of element.
* @returns this.
* @type DOMinput
*/
DOMInput.prototype.setType = function (type) {
    this.element.type = type;
    return this;
};

/**
* Returns the type of this input element.
* @returns The type of element.
* @type String
*/
DOMInput.prototype.getType = function () {
    return this.element.type;
};

/**
* Sets the text (value) of this input element.
* @param {String} text The text.
* @returns this.
* @type DOMInput
*/
DOMInput.prototype.setText = function (text) {
    if (text === undefined || text === null) {
        text = '';
    } else {
        text = String(text);
    }
    this.element.value = text;
    return this;
};

/**
* Sets the text (value) of this input element.
* @param {String} text The text.
* @returns this.
* @type DOMInput
*/
DOMInput.prototype.setValue = DOMInput.prototype.setText;

/**
* Returns the text (value) of this input element.
* @returns The text (or value) of this element
* @type String
*/
DOMInput.prototype.getText = function () {
    return this.element.value;
};

/**
* Returns the text (value) of this input element.
* @returns The text (or value) of this element
* @type String
*/
DOMInput.prototype.getValue = DOMInput.prototype.getText;

/**
* Enables or disables this element.
* @param {Boolean} enable true to enable false to disable (gray).
* @returns this.
* @type String
*/
DOMInput.prototype.enable = function (enable) {
    this.element.disabled = !enable;
    return this;
};

/**
* Checks or unchecks this element.
* @param {Boolean} state The check state.
* @returns this.
* @type DOMInput
*/
DOMInput.prototype.setChecked = function (state) {
    this.element.checked = state;
    return this;
};

/**
* Returns the check state of this element.
* @returns state The check state.
* @type Boolean
*/
DOMInput.prototype.getChecked = function (state) {
    return this.element.checked === true;
};

/**
* Returns the configuration sheet of this element (allowing the editor to
* configure it in the panel)
* @returns The configuration sheet for this element.
* @type Object
*/
DOMInput.prototype.getConfigurationSheet = function () {
    return { "class": {}, "style": {}, "text": {}, "type": {} };
};

/**
* Constructs a text area.
* @memberOf domvisual
*/
function DOMTextArea(config) {
}

DOMTextArea.prototype = new DOMVisual();

/**
* Sets the text or value.
* @param {String} txt The text to set.
* @returns this.
* @type DOMTextArea
*/
DOMTextArea.prototype.setText = function (txt) {
    this.element.value = txt;
    return this;
};

/**
* Sets the text or value.
* @param {String} txt The text to set.
* @returns this.
* @type DOMTextArea
*/
DOMTextArea.prototype.setValue = DOMTextArea.prototype.setText;

/**
* Returns the text (value) of this text area element.
* @returns The text (or value) of this element
* @type String
*/
DOMTextArea.prototype.getText = function (txt) {
    return this.element.value;
};

/**
* Returns the text (value) of this text area element.
* @returns The text (or value) of this element
* @type String
*/
DOMTextArea.prototype.getValue = DOMTextArea.prototype.getText;

/**
* Sets the nubmer of rows.
* @param {Number} r The number of rows.
* @returns this.
* @type DOMTextArea
*/
DOMTextArea.prototype.setRows = function (r) {
    this.element.rows = r;
    return this;
};

/**
* Sets the nubmer of columns.
* @param {Number} c The number of columns.
* @returns this.
* @type DOMTextArea
*/
DOMTextArea.prototype.setCols = function (c) {
    this.element.cols = c;
    return this;
};

/**
* Returns the configuration sheet of this element (allowing the editor to
* configure it in the panel)
* @returns The configuration sheet for this element.
* @type Object
*/
DOMTextArea.prototype.getConfigurationSheet = function () {
    return { "text": {}, "rows": {}, "cols": {} };
};


/**
* Constructs a combo box.
* @memberOf domvisual
*/
function DOMSelect(config) {
    DOMVisual.call(this, config, null, document.createElement('select'));
}

DOMSelect.prototype = new DOMVisual();

/**
* Sets the choices of this combo box.
* @param {Object} options The choices fro the combo box.
* @returns this.
* @type DOMSelect
*/
DOMSelect.prototype.setOptions = function (options) {
    // FIXME: we could support object and array for options
    this.removeAllChildren();
    this.options = options;
    var i, l = options.length, c;
    for (i = 0; i < l; i += 1) {
        c = this.addHtmlChild('option', options[i], {}, i);
        c.setElementAttributes({ value: i});
    }
    return this;
};

/**
* Sets the selection index of the combo box.
* @param {Number} n The selection index.
* @returns this.
* @type DOMSelect
*/
DOMSelect.prototype.setSelectedIndex = function (n) {
    this.element.selectedIndex = n;
    return this;
};

/**
* Returns the selection index of the combo box.
* @returns The selection index.
* @type Number
*/
DOMSelect.prototype.getSelectedIndex = function () {
    return this.element.selectedIndex;
};

/**
* Sets the selected option of the combo box.
* @param {String} o The selected option.
* @returns this.
* @type DOMSelect
*/
DOMSelect.prototype.setSelectedOption = function (o) {
    var index = null;
    forEach(this.options, function (oo, n) {
        if (oo === o) {
            index = n;
        }
    });
    this.setSelectedIndex(index);
    return this;
};

/**
* Returns the selected option of the combo box.
* @returns The selected option.
* @type String
*/
DOMSelect.prototype.getSelectedOption = function () {
    var index = this.getSelectedIndex(),
        ret = null;
    if (index >= 0 && index !== null) {
        ret = this.options[index] || null;
    }
    return ret;
};

/**
* Enables or disables the combo box.
* @param {Boolean} enable true to enable the combo box.
* @returns this.
* @type DOMSelect
*/
DOMSelect.prototype.enable = function (enable) {
    this.element.disabled = !enable;
    return this;
};

/**
* Returns the configuration sheet of this element (allowing the editor to
* configure it in the panel)
* @returns The configuration sheet for this element.
* @type Object
*/
DOMSelect.prototype.getConfigurationSheet = function () {
    return { "options": {} };
};

/**
* Constructs a canvas.
* @memberOf domvisual
*/
function DOMCanvas(config) {
    DOMVisual.call(this, config, null, document.createElement('canvas'));
}

DOMCanvas.prototype = new DOMVisual();

/**
* Sets the width of the canvas.
* @param {Number} w The width
* @returns this.
* @type DOMCanvas
*/
DOMCanvas.prototype.setWidth = function (w) {
    this.element.setAttribute('width', w);
    return this;
};

/**
* Sets the height of the canvas.
* @param {Number} w The height
* @returns this.
* @type DOMCanvas
*/
DOMCanvas.prototype.setHeight = function (h) {
    this.element.setAttribute('height', h);
    return this;
};

/**
* Returns the 2d context of the canvas.
* @returns The 2d context.
* @type Object
*/
DOMCanvas.prototype.getContext2D = function () {
    // return the 2d context
    return this.element.getContext('2d');
};

/**
* Returns the data url of the canvas.
* @returns The data url.
* @type String
*/
DOMCanvas.prototype.toDataURL = function () {
    return this.element.toDataURL.apply(this.element, arguments);
};

/**
* Returns the configuration sheet of this element (allowing the editor to
* configure it in the panel)
* @returns The configuration sheet for this element.
* @type Object
*/
DOMCanvas.prototype.getConfigurationSheet = function () {
    return { "width": {}, "height": {} };
};

exports.DOMElement = DOMElement;
exports.DOMImg = DOMImg;
exports.DOMVideo = DOMVideo;
exports.DOMInput = DOMInput;
exports.DOMSelect = DOMSelect;
exports.DOMCanvas = DOMCanvas;
exports.styleToCss = styleToCss;
exports.hasTextAttributes = styles.hasTextAttributes;
exports.makeKeyString = keycodes.makeKeyString;
exports.decorateVk = keycodes.decorateVk;
