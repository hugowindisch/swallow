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
{
    colors: [Color, Color, ...],
    stops: [Number, Number, ...],
    type: 'horizontal', 'vertical'
}

BoxShadow
---------
    offsetX
    offsetY
    blurRadius
    spreadRadius
    color

Attributes Supported so far
===========================



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
color:                                      Color
textAlign:                                  String (left, right, center)

backgroundColor:                            Color
backgroundImage:                            tbd
backgroundPosition:                         tbd
backgroundRepeat:                           tbd

boxShadow:                                  <offset-x> <offset-y> <blur-radius> spreadradius color

*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    attributeToCss,
    attributeToCssString,
    min = Math.min,
    max = Math.max,
    abs = Math.abs,
    round = Math.round;

function hslaToRgba(hsla) {
    var h = hsla.h / 360,
        s = hsla.s / 100,
        l = hsla.l / 100,
        r,
        g,
        b,
        tmp1,
        tmp2,
        tmp3;

    function test(tmp3) {
        var res;
        if (tmp3 < 0) {
            tmp3 = tmp3 + 1;
        } else if (tmp3 > 1) {
            tmp3 = tmp3 - 1;
        }

        if ((6 * tmp3) < 1) {
            res = tmp1 + (tmp2 - tmp1) * 6 * tmp3;
        } else if ((2 * tmp3) < 1) {
            res = tmp2;
        } else if ((3 * tmp3) < 2) {
            res = tmp1 + (tmp2 - tmp1) * ((2 / 3) - tmp3) * 6;
        } else {
            res = tmp1;
        }
        return res;
    }

    if (s === 0) {
        r = abs(l * 255);
        return { r: r, g: r, b: r, a: hsla.a };
    } else {
        // tmp2
        if (l < 0.5) {
            tmp2 = l * (1 + s);
        } else {
            tmp2 = l + s - l * s;
        }
        // tmp1
        tmp1 = 2 * l - tmp2;
        // tmp3
        // r, g, b
        r = test(h + 1 / 3);
        g = test(h);
        b = test(h - 1 / 3);
        r = round(r * 255);
        g = round(g * 255);
        b = round(b * 255);
        return { r: r, g: g, b: b, a: hsla.a };
    }
}

function rgbaToHsla(rgba) {
    var r = rgba.r / 255,
        g = rgba.g / 255,
        b = rgba.b / 255,
        minv = min(min(r, g), b),
        maxv = max(max(r, g), b),
        l = (minv + maxv) / 2,
        h,
        s;

    if (minv === maxv) {
        h = s = 0;
    } else {
        if (l < 0.5) {
            s = (maxv - minv) / (maxv + minv);
        } else {
            s = (maxv - minv) / (2 - maxv - minv);
        }
        if (r === maxv) {
            h = (g - b) / (maxv - minv);
        } else if (g === maxv) {
            h = 2 + (b - r) / (maxv - minv);
        } else if (b === maxv) {
            h = 4 + (r - g) / (maxv - minv);
        }
        h = round(h * 60);
        if (h < 0) {
            h = h + 360;
        }
        s = round(s * 100);
    }
    l = round(l * 100);
    return {
        h: h,
        s: s,
        l: l,
        a: rgba.a
    };
}

function colorToCSSString(c) {
    if (c.r !== undefined) {
        // rgba
        return 'rgba(' + round(c.r) + ',' + round(c.g) + ',' + round(c.b) + ',' + c.a + ')';
    } else {
        // hsla
        return 'hsla(' + round(c.h) + ',' + round(c.s) + '%,' + round(c.l) + '%,' + c.a + ')';

    }
}

function gradientToCSSStringMoz(gradient) {
    var angle = (gradient.type === 'horizontal') ? 0 : -90,
        res = '-moz-linear-gradient(' + angle + 'deg, ',
        colors = gradient.colors,
        stops = gradient.stops,
        l = colors.length,
        i;
    for (i = 0; i < l; i += 1) {
        res += (colorToCSSString(colors[i]) + ' ' +
            Math.round(stops[i] * 100) + '%');
        res += (i < l - 1) ? ',' : ')';
    }
    return res;
}

function gradientToCSSStringWebkit(gradient) {
    var res = '-webkit-gradient(',
        stops = gradient.stops,
        colors = gradient.colors,
        l = stops.length,
        i;

    switch (gradient.type) {
    case 'horizontal':
        res += 'linear,left top,right top,';
        break;
    case 'vertical':
        res += 'linear,left top,left bottom,';
        break;
    }
    for (i = 0; i < l; i += 1) {
        res += ('color-stop(' + stops[i] + ',' +
            colorToCSSString(colors[i]) + ')');
        res += (i < l - 1) ? ',' : ')';
    }
    return res;
}

function boxShadowToCSSString(v) {
    return v.offsetX + ' px ' +
        v.offsetY + ' px ' +
        v.blurRadius + ' px ' +
        v.spreadRadius + ' px ' +
        colorToCSSString(v.color);
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
    textAlign: passThroughCSSString,
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
    textAlign: function (style, value) {
        style.textAlign = value;
    },
    // background
    backgroundColor: function (style, value) {
        style.backgroundColor = value;
    },
    // shadow
    boxShadow: function (style, value) {
        //<offset-x> <offset-y> <blur-radius> spreadradius
        style.boxShadow =
            style.mozBoxShadow =
            style.webkitShadow = value;
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
