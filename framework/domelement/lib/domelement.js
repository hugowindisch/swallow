/**
    domelement.js
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
var domquery = require('domquery'),
    utils = require('utils'),
    domvisual = require('domvisual'),
    forEach = utils.forEach;

/**
* @api private
*/
function DomElement(elements) {
    this.elements = elements;
}

/**
* Sets a style
*/
DomElement.prototype.setStyle = function (skin, factory, type, style) {
    var styleData = skin.getTheme(
            factory,
            type
        ).getStyleData(style);
    if (styleData.jsData) {
        forEach(this.elements, function (elem) {
            domvisual.styleToCss(elem.style, styleData.jsData);
        });
    }
    return this;
};

/**
* Sets some margins
*/
DomElement.prototype.setMargins = function (left, top, right, bottom) {
    forEach(this.elements, function (elem) {
        var s = elem.style;
        s.marginLeft = left;
        s.marginRight = right;
        s.marginTop = top;
        s.marginBottom = bottom;
    });
    return this;
};

/**
* Sets some padding.
*/
DomElement.prototype.setPadding = function (left, top, right, bottom) {
    forEach(this.elements, function (elem) {
        var s = elem.style;
        s.paddingLeft = left;
        s.paddingRight = right;
        s.paddingTop = top;
        s.paddingBottom = bottom;
    });
    return this;
};

/**
* Connects a visual.
*/
DomElement.prototype.setVisual = function (factory, type, config, optionalWidth, optionalHeight) {
    forEach(this.elements, function (elem) {
        domvisual.createVisual(elem, factory, type, config, optionalWidth, optionalHeight);
    });

    return this;
};

module.exports = function (selector, from) {
    return new DomElement(domquery(selector, from));
};
