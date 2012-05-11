/**
    domvisual.js

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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
    Visual = visual.Visual,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEachProperty,
    isObject = utils.isObject,
    isArray = utils.isArray,
    isNumber = utils.isNumber,
    apply = utils.apply,
    vec3IsEqual = visual.vec3IsEqual,
    getStyleDimensionAdjustment = styles.getStyleDimensionAdjustment,
    setDirty = dirty.setDirty;

function DOMVisual(config, groupData, element) {
    var that = this;
    this.element = element;
    this.cssClasses = {};
    this.connectedToTheStage = false;
    this.disableEventHooks = false;
    this.visible = true;
    Visual.call(this, config, groupData);
    // this might not be the best idea, maybe overriding addListener would
    // be better.
    this.addListener('addListener', function () {
        updateDOMEventHooks(that);
    });
}
DOMVisual.prototype = new Visual();
DOMVisual.prototype.addChild = function (child, name, optionalOrder) {
    var connectedToTheStage,
        disableEventHooks,
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
        // we need to find the element at optionalOrder+1 and put this thing before
        this.element.insertBefore(child.element, this.getChildAtOrder(optionalOrder).element);
        // and manually clear the dirt (ok, this is ugly)
        delete this.dirty.orderDirty;
    }
    connectedToTheStage = this.connectedToTheStage;
    disableEventHooks = this.disableEventHooks;
    visual.forVisualAndAllChildrenDeep(child, function (c) {
        c.connectedToTheStage = connectedToTheStage;
        if (disableEventHooks) {
            c.disableEventHooks = true;
        }
        // here we should revalidate the hooks for this child
        updateDOMEventHooks(c);
    });
};
DOMVisual.prototype.removeChild = function (child) {
    // it is easier to track element containement immediately instead
    // of waiting for the update function to be called.
    child = this.resolveChild(child);
    try {
        this.element.removeChild(child.element);
    } catch (e) {
        throw new Error("Child " + child.name + " not in " + this.getFullName());
    }
    Visual.prototype.removeChild.call(this, child);
    var connectedToTheStage = this.connectedToTheStage,
        disableEventHooks = this.disableEventHooks;
    visual.forVisualAndAllChildrenDeep(child, function (c) {
        c.connectedToTheStage = false;
        // here we should revalidate the hooks for this child
        updateDOMEventHooks(c);
    });
};
DOMVisual.prototype.setDimensions = function (d) {
    if (d[0] !== this.dimensions[0] || d[1] !== this.dimensions[1]) {
        Visual.prototype.setDimensions.apply(this, arguments);
        // the whole thing of upwards notification is still a bit experimental
        // and maybe ugly... but... if we resize something that is flowed,
        // we want the container of the flowed stuff to be notified
        // so it can do something if it needs to adapt.
        this.notifyDOMChanged();
    }
    return this;
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
    setDirty(this, 'style');
    return this;
};
DOMVisual.prototype.clearClass = function (cssClassName) {
    if (this.cssClasses[cssClassName]) {
        delete this.cssClasses[cssClassName];
        setDirty(this, 'style');
    }
};

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


/**
    As an explicit but quite ugly way to allow containers
    that have a layout to be notified of a change in underlying
    flowed content (not that these containers may be themselves flowed).
    we have this method (that must be called manually) (by flowed content).

    (this avoids the use of DOM mutation events)
    (this pretty ugly/convoluted... but...)


    NOTE: we could force a getDomAccces() and releaseDomAccess for
    dealing with explicit 'html flowed' stuff and hook the event on the release.

    This may be a very bad idea.
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
        if (v.listeners('domchanged').length > 0) {
            // quite ugly
            setTimeout(emitter(v), 0);
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
    Enables children clipping.
    available modes are
        visible hidden scroll auto

    can be an array to set x and y clipping differently
*/
DOMVisual.prototype.setChildrenClipping = function (mode) {
    this.childrenClipping = mode;
    setDirty(this, 'style');
    return this;
};

/**
    Sets scrolling.
*/
DOMVisual.prototype.setScroll = function (v3) {
    this.scroll = v3;
    setDirty(this, 'style');
    return this;
};

/**
    Sets visibility.
*/
DOMVisual.prototype.setVisible = function (visible) {
    if (this.visible !== visible) {
        this.visible = visible;
        setDirty(this, 'dimensions');
    }
    return this;
};
DOMVisual.prototype.getVisible = function () {
    return this.visible;
};

/**
    Sets the cursor.
*/
DOMVisual.prototype.setCursor = function (cursor) {
    this.element.style.cursor = cursor;
    return this;
};

/**
    Very rough...
    (some more thoughts must be done on this)
rethink this... maybe this should be a parameter of setPosition ???
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
        easingFunction: easingFunction || 'easein'
    };
    setDirty(this, 'matrix');
    return this;
};
DOMVisual.prototype.clearTransition = function () {
    // force update
    dirty.update();
    // remove the transition
    delete this.transition;
    setDirty(this, 'matrix');
};
DOMVisual.prototype.setOpacity = function (opacity) {
    this.opacity = opacity;
    setDirty(this, 'matrix');
    return this;
};
DOMVisual.prototype.setBackgroundImage = function (url, repeat, position) {
    repeat = repeat || 'repeat';
    var style = this.element.style;
    if (url !== null) {
        style.backgroundImage = 'url(' + url + ')';
        style.backgroundRepeat = 'repeat';
    } else {
        style.backgroundImage = null;
    }
    return this;
};

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
/**
    DOM update (we essentially treat the DOM as an output thing)
*/
DOMVisual.prototype.updateMatrixRepresentation = function () {
    if (this.element && this.name !== 'stage') {
        var matrix = this.matrix,
            style = this.element.style,
            htmlFlowing = this.htmlFlowing,
            transition = this.transition,
            opacity = this.opacity,
            transform;
        // opacity FIXME: not sure this should be here
        if (opacity !== undefined) {
            style.webkitOpacity = opacity;

        } else {
            style.webkitOpacity = null;
        }
        // transitions FIXME: not sure this should be here
        if (transition) {
            style.webkitTransitionProperty = 'all';
            style.webkitTransitionDuration = transition.duration;
            style.webkitTransitionTimingFunction = transition.easingFunction;
        } else {
            style.webkitTransitionProperty = null;
            style.webkitTransitionDuration = null;
            style.webkitTransitionTimingFunction = null;
        }
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
                // 3d transform
                style.left = '0px';
                style.top = '0px';
                transform = 'matrix(' + matrix[0] + ', ' + matrix[1] + ', ' + matrix[4] + ', ' + matrix[5] + ', ' + matrix[12] + ', ' + matrix[13] + ')';
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
            styleDimensionsAdjustement = this.styleDimensionsAdjustment || [0, 0];
        if (!htmlFlowing) {
            style.width = adjust(dimensions[0], styleDimensionsAdjustement[0]) + 'px';
            style.height = adjust(dimensions[1], styleDimensionsAdjustement[1]) + ' px';
            style.position = 'absolute';
            style.display = this.visible ? 'block' : 'none';
        } else {
            // clear our stuff
            if (this.htmlFlowingApplySizing) {
                style.width = adjust(dimensions[0], styleDimensionsAdjustement[0]) + 'px';
                style.height = adjust(dimensions[1], styleDimensionsAdjustement[1]) + 'px';
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
DOMVisual.prototype.updateStyleRepresentation = function () {
    var cssClass,
        element = this.element,
        styleData,
        jsData,
        v,
        style;
    // FIXME note: what if we have no style at all whatsoever? Why do this at all?
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
DOMVisual.prototype.updateOpacityRepresentation = function () {
    var element = this.element;
    if (element) {
        if (this.opacity) {
            element.opacity = this.opacity;
        } else {
            element.opacity = null;
        }
    }
};

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


DOMVisual.prototype.getConfigurationSheet = function () {
    return { "class": {}, "style": {} };
};

/**
    Returns the computed matrix of this element
    (if the element uses html flowing)
    This can go wrong (the values may not be already good... apparently)
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


/**
    Returns the computed dimension of this element
    (if the element uses html flowing)
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


/**
    For adding a child that is implemented as plain html.
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
    For adding a child that is implemented as plain text.
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
    Sets the html of a DOMVisual. This removes all children.
    (note: we could have an option to keep the children... since we can
    easily remove them first, and re add them after).
*/
DOMVisual.prototype.setInnerHTML = function (html) {
    this.removeAllChildren();
    this.element.innerHTML = html;
    setDirty(this, 'matrix', 'dimensions', 'style');
    return this;
};

/**
    Sets the text of a DOMVisual. This removes all children.
*/
DOMVisual.prototype.setInnerText = function (text) {
    this.removeAllChildren();
    this.element.innerHTML = '';
    this.element.appendChild(document.createTextNode(text));
    setDirty(this, 'matrix', 'dimensions', 'style');
    return this;
};

/**
    Sets html attributes. This should not be useful most of the time...
*/
DOMVisual.prototype.setElementAttributes = function (attr) {
    var element = this.element;
    forEachProperty(attr, function (v, n) {
        element.setAttribute(String(n), String(v));
    });
    return this;
};

/**
    Sets style attributes (see styles.js for what is supported).

    Note:
        - some functions could be removed because they overlap on this one

        - Clearing : set with null or undefined (+ uniformize this with
            setElementAttributes).

        - These attributes OVERRRIDE what is defined in the styles.


        - FIXME: there is a clash between the setHtmlFlowing thing and this.
*/
DOMVisual.prototype.setStyleAttributes = function (attr) {
    if (!this.styleAttributes) {
        this.styleAttributes = {};
    }
    apply(this.styleAttributes, attr);
    setDirty(this, 'style');
    return this;
};


/////////////////
// a general container
function DOMElement(config, groupData) {
    DOMVisual.call(this, config, groupData, document.createElement('div'));
}
DOMElement.prototype = new DOMVisual();
DOMElement.createPreview = function () {
    return new (exports.DOMImg)({url: 'domvisual/lib/elementpreview.png'});
};

DOMElement.prototype.getConfigurationSheet = function () {
    return {
        "class": null,
        "style": require('config').styleConfig('Style:')
    };
};
/////////////////
// an img element
function DOMImg(config) {
    DOMVisual.call(this, config, null, document.createElement('img'));
}
DOMImg.prototype = new DOMVisual();
DOMImg.createPreview = function () {
    return new (DOMImg)({url: 'domvisual/lib/imagepreview.png'});
};

DOMImg.prototype.setUrl = function (url) {
    this.element.src = url;
    return this;
};
DOMImg.prototype.getConfigurationSheet = function () {
    return {
        "class": null,
        "style": null,
        "url": require('config').imageUrlConfig('Url')
    };
};

/////////////////
// A video tag
function DOMVideo(config) {
    DOMVisual.call(this, config, null, document.createElement('video'));
}
DOMVideo.prototype = new DOMVisual();
DOMVideo.createPreview = function () {
    return new (DOMImg)({url: 'domvisual/lib/videopreview.png'});
};

DOMVideo.prototype.setUrl = function (url) {
    this.element.src = url;
    return this;
};
DOMVideo.prototype.getConfigurationSheet = function () {
    return {
        "class": null,
        "style": null,
        "url": require('config').inputConfig('Url')
    };
};


/////////////////
// An input tag
function DOMInput(config) {
    DOMVisual.call(this, config, null, document.createElement('input'));
}
DOMInput.prototype = new DOMVisual();
DOMInput.prototype.setType = function (type) {
    this.element.type = type;
    return this;
};
DOMInput.prototype.getType = function () {
    return this.element.type;
};
DOMInput.prototype.setText = function (text) {
    if (text === undefined || text === null) {
        text = '';
    } else {
        text = String(text);
    }
    this.element.value = text;
    return this;
};
DOMInput.prototype.setValue = DOMInput.prototype.setText;
DOMInput.prototype.getText = function () {
    return this.element.value;
};
DOMInput.prototype.getValue = DOMInput.prototype.getText;
DOMInput.prototype.enable = function (enable) {
    this.element.disabled = !enable;
    return this;
};
DOMInput.prototype.setChecked = function (state) {
    this.element.checked = state;
    return this;
};
DOMInput.prototype.getChecked = function (state) {
    return this.element.checked === true;
};

DOMInput.prototype.getConfigurationSheet = function () {
    return { "class": {}, "style": {}, "text": {}, "type": {} };
};

///////////////
// A combo box
function DOMSelect(config) {
    DOMVisual.call(this, config, null, document.createElement('select'));
}
DOMSelect.prototype = new DOMVisual();
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
DOMSelect.prototype.setSelectedIndex = function (n) {
    this.element.selectedIndex = n;
    return this;
};
DOMSelect.prototype.getSelectedIndex = function () {
    return this.element.selectedIndex;
};
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
DOMSelect.prototype.getSelectedOption = function () {
    var index = this.getSelectedIndex(),
        ret = null;
    if (index >= 0 && index !== null) {
        ret = this.options[index] || null;
    }
    return ret;
};

DOMSelect.prototype.enable = function (enable) {
    this.element.disabled = !enable;
};
DOMSelect.prototype.getConfigurationSheet = function () {
    return { "options": {} };
};

///////////
// Canvas
function DOMCanvas(config) {
    DOMVisual.call(this, config, null, document.createElement('canvas'));
}
DOMCanvas.prototype = new DOMVisual();

DOMCanvas.prototype.setWidth = function (w) {
    this.element.setAttribute('width', w);
    return this;
};
DOMCanvas.prototype.setHeight = function (h) {
    this.element.setAttribute('height', h);
    return this;
};
DOMCanvas.prototype.getContext2D = function () {
    // return the 2d context
    return this.element.getContext('2d');
};
DOMCanvas.prototype.toDataURL = function () {
    return this.element.toDataURL.apply(this.element, arguments);
};
DOMCanvas.prototype.getConfigurationSheet = function () {
    return { "width": {}, "height": {} };
};


exports.getVisualNames = function () {
    return [ 'DOMElement', 'DOMImg', 'DOMVideo' ];
};
exports.DOMElement = DOMElement;
exports.DOMImg = DOMImg;
exports.DOMVideo = DOMVideo;
exports.DOMInput = DOMInput;
exports.DOMSelect = DOMSelect;
exports.DOMCanvas = DOMCanvas;

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
    viz.setLayout(
        {

            dimensions: [100, 100, 0],
            positions: {
                root: {
                    matrix: [ 100, 0, 0, 0,   0, 100, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
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
exports.makeKeyString = keycodes.makeKeyString;
exports.decorateVk = keycodes.decorateVk;
