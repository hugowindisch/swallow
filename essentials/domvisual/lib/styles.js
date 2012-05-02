/**
    styles.js

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*
We use a js representation of styles that is javascript based and
stored in our documents. We want a simple structure easy to manipulate and
convert to style. We want just like in css attributes to be fine grained
and easy to combine. It must be easy to manipulate with the graphic editor.
Ideally we have a one level (flat) set of attributes and the values it
accepts.

Note: could this not only apply to dom visuals? probably.

Attribute types
===============
Color
-----
{ r: g: b: a: }
{ h: s: l: a: }


Gradient
--------
tbd

BoxShadow
---------
    offsetX
    offsetY
    blurRadius
    spreadRadius

Attributes Supported so far
===========================

color:                                      Color

border<Left|Right|Top|Bottom>Style          String (none dotted dashed solid ...)
border<Left|Right|Top|Bottom>Color          Color
border<Left|Right|Top|Bottom>Width:         Number
borderTopLeftRadius                         Number
borderTopRightRadius                        Number
borderBottomLeftRadius                      Number
borderBottomRightRadius                     Number

fontFamily                                  String
fontSize                                    Number
fontWeight                                  String  (normal bold bolder lighter)
padding<Left|Right|Top|Bottom>              Number

backgroundColor:                            Color
backgroundImage:                            tbd
backgroundPosition:                         tbd
backgroundRepeat:                           tbd

boxShadow:                                  <offset-x> <offset-y> <blur-radius> spreadradius color

*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    attributeToCss,
    attributeToCssString;

function colorToCSSString(color) {
}
function boxShadowToCSSString(v) {
    return v.offsetX + 'px' +
        v.offsetY + 'px' +
        v.blurRadius + 'px' +
        v.spreadRadius + 'px';
}
function passThroughCSSString(v) {
    return v;
}
function dimToCSSString(v) {
    return v + 'px';
}

attributeToCssString = {
    // borders
    borderLeftStyle: passThroughCSSString,
    borderLeftColor: colorToCSSString,
    borderLeftWidth: dimToCSSString,
    borderRightStyle: passThroughCSSString,
    borderRightColor: colorToCSSString,
    borderRightWidth: dimToCSSString,
    borderTopStyle: passThroughCSSString,
    borderTopColor: colorToCSSString,
    borderTopWidth: dimToCSSString,
    borderBottomStyle: passThroughCSSString,
    borderBottomColor: colorToCSSString,
    borderBottomWidth: dimToCSSString,
    // corners
    borderTopLeftRadius: dimToCSSString,
    borderTopRightRadius: dimToCSSString,
    borderBottomLeftRadius: dimToCSSString,
    borderBottomRightRadius: dimToCSSString,
    // text
    fontFamily: passThroughCSSString,
    fontSize: dimToCSSString,
    fontWeight: passThroughCSSString,
    paddingLeft: dimToCSSString,
    paddingRight: dimToCSSString,
    paddingTop: dimToCSSString,
    paddingBottom: dimToCSSString,
    color: colorToCSSString,
    // background
    backgroundColor: colorToCSSString,
    // shadow
    boxShadow: boxShadowToCSSString
};

attributeToCss = {
    // borders
    borderLeftStyle: function (style, value) {
        style.borderLeftStyle = value;
    },
    borderLeftColor: function (style, value) {
        style.borderLeftColor = value;
    },
    borderLeftWidth: function (style, value) {
        style.borderLeftWidth = value;
    },
    borderRightStyle: function (style, value) {
        style.borderRightStyle = value;
    },
    borderRightColor: function (style, value) {
        style.borderRightColor = value;
    },
    borderRightWidth: function (style, value) {
        style.borderRightWidth = value;
    },
    borderTopStyle: function (style, value) {
        style.borderTopStyle = value;
    },
    borderTopColor: function (style, value) {
        style.borderTopColor = value;
    },
    borderTopWidth: function (style, value) {
        style.borderTopWidth = value;
    },
    borderBottomStyle: function (style, value) {
        style.borderBottomStyle = value;
    },
    borderBottomColor: function (style, value) {
        style.borderBottomColor = value;
    },
    borderBottomWidth: function (style, value) {
        style.borderBottomWidth = value;
    },

    // corners
    borderTopLeftRadius: function (style, value) {
        style.webkitBorderTopLeftRadius =
            style.mozBorderRadiusTopleft =
            style.borderTopLeftRadius = value;
    },
    borderTopRightRadius: function (style, value) {
        style.webkitBorderTopRightRadius =
            style.mozBorderRadiusTopRight =
            style.borderTopRightRadius = value;
    },
    borderBottomLeftRadius: function (style, value) {
        style.webkitBorderBottomLeftRadius =
            style.mozBorderRadiusBottomLeft =
            style.borderBottomLeftRadius = value;
    },
    borderBottomRightRadius: function (style, value) {
        style.webkitBorderBottomRightRadius =
            style.mozBorderRadiusBottomRight =
            style.borderBottomRightRadius = value;
    },
    // text
    fontFamily: function (style, value) {
        style.fontFamily = value;
    },
    fontSize: function (style, value) {
        style.fontSize = value;
    },
    fontWeight: function (style, value) {
        style.fontWeight = value;
    },
    paddingLeft: function (style, value) {
        style.paddingLeft = value;
    },
    paddingRight: function (style, value) {
        style.paddingRight = value;
    },
    paddingTop: function (style, value) {
        style.paddingTop = value;
    },
    paddingBottom: function (style, value) {
        style.paddingBottom = value;
    },
    color: function (style, value) {
        style.color = value;
    },
    // background
    backgroundColor: function (style, value) {
        style.backgroundColor = value;
    },
    // shadow
    boxShadow: function (style, value) {
        //<offset-x> <offset-y> <blur-radius> spreadradius
        style.boxShadow = value;
    }
};

function clearStyle(style) {
    forEachProperty(attributeToCss, function (fcn, prop) {
        fcn(style, null);
    });
}
function styleToCss(style, jsData) {
    forEachProperty(attributeToCss, function (fcn, prop) {
        var dat = jsData[prop];
        if (dat !== undefined) {
            fcn(style, attributeToCssString[prop](dat));
        } else {
            fcn(style, null);
        }
    });
}

exports.clearStyle = clearStyle;
exports.styleToCss = styleToCss;
