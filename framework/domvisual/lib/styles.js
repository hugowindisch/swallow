/**
    styles.js
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
    inset
    offsetX
    offsetY
    blurRadius
    spreadRadius
    color

BackgroundPosition
------------------
    position[2] (string)
    offset[2] (string)
    value[2] (number)

BackgroundSize
--------------
    size[2] (string)
    value[2] (number)

BackgroundRepeat
----------------
    repeat[2] string

BackgroundAttachment
----------------
    attachment[2] string

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
color:                                      Color
textAlign:                                  String (left, right, center)

backgroundColor:                            Color
backgroundImage:                            (currently: ) gradient or array of
                                                gradients
backgroundPosition:                         BackgroundPosition
backgroundSize:                             BackgroundSize
backgroundRepeat:                           BackgroundRepeat
backgroundAttachment                        BackgroundAttachment


boxShadow:                                  <offset-x>
                                            <offset-y>
                                            <blur-radius>
                                            spreadradius
                                            color
*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    attributeToCss,
    attributeToCssString,
    min = Math.min,
    max = Math.max,
    abs = Math.abs,
    round = Math.round,
    isArray = utils.isArray,
    isString = utils.isString,
    isObject = utils.isObject,
    browser = require('./browser').getBrowser(),
    gradientToCssString,
    colorToCSSString,
    nullStyle = '',
    textAttributes = {
        fontFamily: true,
        fontSize: true,
        fontWeight: true,
        color: true,
        textAlign: true
    };

function hasTextAttributes(jsData) {
    var ret = false;
    forEachProperty(jsData, function (d, name) {
        if (textAttributes[name]) {
            ret = true;
        }
    });
    return ret;
}

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

function colorToCSSStringWebkitAndMozilla(c) {
    if (c.r !== undefined) {
        // rgba
        return 'rgba(' +
            round(c.r) +
            ',' +
            round(c.g) +
            ',' +
            round(c.b) +
            ',' +
            c.a +
            ')';
    } else {
        // hsla
        return 'hsla(' +
            round(c.h) +
            ',' +
            round(c.s) +
            '%,' +
            round(c.l) +
            '%,' +
            c.a +
            ')';

    }
}
function colorToCSSStringMSIE(c) {
    if (c.r !== undefined) {
        // rgba
        return 'rgb(' +
            round(c.r) +
            ',' +
            round(c.g) +
            ',' +
            round(c.b) +
            ')';
    } else {
        // hsla
        return 'hsl(' +
            round(c.h) +
            ',' +
            round(c.s) +
            '%,' +
            round(c.l) +
            ')';

    }
}

colorToCSSString = ({
    'AppleWebKit': colorToCSSStringWebkitAndMozilla,
    'Mozilla': colorToCSSStringWebkitAndMozilla,
    'MSIE': colorToCSSStringMSIE
})[browser] ||
    function () {
        return nullStyle;
    };

function gradientToCSSStringMozilla(gradient) {
    var angle = (gradient.type === 'horizontal') ? 0 : -90,
        res = '-moz-linear-gradient(' + angle + 'deg, ',
        colors = gradient.colors,
        stops = gradient.stops,
        l = colors.length,
        ind = [],
        is,
        i;
    for (i = 0; i < l; i += 1) {
        ind.push(i);
    }
    ind.sort(function (i1, i2) {
        return stops[i1] - stops[i2];
    });
    for (i = 0; i < l; i += 1) {
        is = ind[i];
        res += (colorToCSSString(colors[is]) + ' ' +
            Math.round(stops[is] * 100) + '%');
        res += (i < l - 1) ? ', ' : ')';
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

gradientToCssString = ({
    'AppleWebKit': gradientToCSSStringWebkit,
    'Mozilla': gradientToCSSStringMozilla
})[browser] ||
    function () {
        return nullStyle;
    };

function imageUrlToCssString(url) {
    return 'url(' + url + ')';
}

function multiple(v, single) {
    var ret = null;
    if (isArray(v)) {
        forEach(v, function (p) {
            if (ret === null) {
                ret = single(p);
            } else {
                ret = ret + ', ' + single(p);
            }
        });
    } else if (v) {
        ret = single(v);
    }
    return ret;
}

function backgroundImageToCssString(img) {
    function singleImageToCssString(img) {
        if (isString(img)) {
            return imageUrlToCssString(img);
        } else if (isObject(img) && img.colors && img.stops && img.type) {
            return gradientToCssString(img);
        }
        return null;
    }
    return multiple(img, singleImageToCssString);
}

function backgroundPositionToCSSString(pos) {
    function single(pos) {
        var ret = '';
        if (pos) {
            ret = pos.position[0] + ' ' +
                pos.value[0] +
                (pos.offset[0] === 'absolute' ? 'px ' : '% ') +
                pos.position[1] + ' ' +
                pos.value[1] +
                (pos.offset[1] === 'absolute' ? 'px ' : '% ');
        }
        return ret;
    }
    return multiple(pos, single);
}

function backgroundSizeToCSSString(size) {
    function single(size) {
        var ret = '';
        if (size) {
            switch (size.size[0]) {
            case 'percent':
                ret += size.value[0] + '%';
                break;
            case 'absolute':
                ret += size.value[0] + 'px';
                break;
            default:
                ret += size.size[0];
                break;
            }
            ret += ' ';
            switch (size.size[1]) {
            case 'percent':
                ret += size.value[1] + '%';
                break;
            case 'absolute':
                ret += size.value[1] + 'px';
                break;
            default:
                ret += size.size[1];
                break;
            }
        }
        return ret;
    }
    return multiple(size, single);
}

function backgroundRepeatToCSSString(repeat) {
    function single(repeat) {
        var ret = '';
        if (repeat) {
            ret = repeat.repeat[0] + ' ' + repeat.repeat[1];
        }
        return ret;
    }
    return multiple(repeat, single);
}

function backgroundAttachmentToCssString(attachment) {
    function single(att) {
        var ret = '';
        if (att) {
            ret = att.attachment[0] + ' ' + att.attachment[1];
        }
        return ret;
    }
    return multiple(attachment, single);
}

function boxShadowToCSSString(v) {
    return (v.inset ?  'inset ' : '') +
        v.offsetX + 'px ' +
        v.offsetY + 'px ' +
        v.blurRadius + 'px ' +
        v.spreadRadius + 'px ' +
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
    color: colorToCSSString,
    textAlign: passThroughCSSString,
    // background
    backgroundColor: colorToCSSString,
    backgroundImage: backgroundImageToCssString,
    backgroundRepeat: backgroundRepeatToCSSString,
    backgroundAttachment: backgroundAttachmentToCssString,
    backgroundPosition: backgroundPositionToCSSString,
    backgroundSize: backgroundSizeToCSSString,
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
    backgroundImage: function (style, value) {
        style.backgroundImage = value;
    },
    backgroundRepeat: function (style, value) {
        style.backgroundRepeat = value;
    },
    backgroundAttachment: function (style, value) {
        style.backgroundAttachment = value;
    },
    backgroundPosition: function (style, value) {
        style.backgroundPosition = value;
    },
    backgroundSize: function (style, value) {
        style.backgroundSize = value;
    },
    // shadow
    boxShadow: function (style, value) {
        //<offset-x> <offset-y> <blur-radius> spreadradius
        style.boxShadow =
            style.mozBoxShadow =
            style.webkitBoxShadow = value;
    }
};

function styleToCss(style, jsData) {
    forEachProperty(attributeToCss, function (fcn, prop) {
        var dat = jsData[prop];
        try {
            if (dat !== undefined) {
                fcn(style, attributeToCssString[prop](dat));
            } else {
                fcn(style, nullStyle);
            }
        } catch (e) {
            // IE FUCKING PICKY
        }
    });
}

function getStyleDimensionAdjustment(jsData) {
    var wa,
        ha,
        bsl = jsData.borderLeftStyle,
        bsr = jsData.borderRightStyle,
        bst = jsData.borderTopStyle,
        bsb = jsData.borderBottomStyle;

    function w(width, style) {
        if (!style || style === 'none') {
            return 0;
        }
        return width || 0;
    }

    wa = w(jsData.borderLeftWidth, jsData.borderLeftStyle) +
        w(jsData.borderRightWidth, jsData.borderRightStyle);
    ha = w(jsData.borderTopWidth, jsData.borderTopStyle) +
        w(jsData.borderBottomWidth, jsData.borderBottomStyle);

    if (wa || ha) {
        return [wa, ha, 0];
    }
    return null;
}

exports.styleToCss = styleToCss;
exports.nullStyle = nullStyle;
exports.getStyleDimensionAdjustment = getStyleDimensionAdjustment;
exports.hasTextAttributes = hasTextAttributes;
