/**
    StyleUtils.js

    The SwallowApps Editor, an interactive application builder for creating
    html applications.

    Copyright (C) 2012  Hugo Windisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/
var utils = require('utils'),
    isString = utils.isString,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    deepCopy = utils.deepCopy,
    apply = utils.apply,
    styleFeatures = {
        tl: {
            attributes: {
                radius: 'borderTopLeftRadius'
            },
            FeatureEditor: require('./feature/StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Top Left Corner' }
        },
        tr: {
            attributes: {
                radius: 'borderTopRightRadius'
            },
            FeatureEditor: require('./feature/StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Top Right Corner' }
        },
        bl: {
            attributes: {
                radius: 'borderBottomLeftRadius'
            },
            FeatureEditor: require('./feature/StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Bottom Left Corner' }
        },
        br: {
            attributes: {
                radius: 'borderBottomRightRadius'
            },
            FeatureEditor: require('./feature/StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Bottom Right Corner' }
        },
        l: {
            attributes: {
                style: 'borderLeftStyle',
                color: 'borderLeftColor',
                width: 'borderLeftWidth'
            },
            FeatureEditor: require('./feature/StyleSettingBorder').StyleSettingBorder,
            config: { label: 'Left Border' }
        },
        r: {
            attributes: {
                style: 'borderRightStyle',
                color: 'borderRightColor',
                width: 'borderRightWidth'
            },
            FeatureEditor: require('./feature/StyleSettingBorder').StyleSettingBorder,
            config: { label: 'Right Border' }
        },
        t: {
            attributes: {
                style: 'borderTopStyle',
                color: 'borderTopColor',
                width: 'borderTopWidth'
            },
            FeatureEditor: require('./feature/StyleSettingBorder').StyleSettingBorder,
            config: { label: 'Top Border' }
        },
        b: {
            attributes: {
                style: 'borderBottomStyle',
                color: 'borderBottomColor',
                width: 'borderBottomWidth'
            },
            FeatureEditor: require('./feature/StyleSettingBorder').StyleSettingBorder,
            config: { label: 'Bottom Border' }
        },
        m: {
            attributes: {
                color: 'backgroundColor'
            },
            FeatureEditor: require('./feature/StyleSettingBackground').StyleSettingBackground,
            config: { label: 'Background' }
        },
        txt: {
            attributes: {
                color: 'color',
                family: 'fontFamily',
                align: 'textAlign',
                weight: 'fontWeight',
                size: 'fontSize'
            },
            FeatureEditor: require('./feature/StyleSettingText').StyleSettingText,
            config: { label: 'Text' }
        },
        s: {
            attributes: {
                shadow: 'boxShadow'
            },
            FeatureEditor: require('./feature/StyleSettingShadow').StyleSettingShadow,
            config: { label: 'Shadow' }
        },
        bgi: {
            attributes: {
                bgi: 'backgroundImage',
                bgp: 'backgroundPosition',
                bgs: 'backgroundSize',
                bgr: 'backgroundRepeat',
                bga: 'backgroundAttachment'
            },
            FeatureEditor: require('./feature/StyleSettingBackgroundImage').StyleSettingBackgroundImage,
            config: { label: 'BackgroundImage' }
        }
    },
    allCorners = [ 'tl', 'tr', 'bl', 'br' ],
    allBorders = [ 'l', 'r', 'b', 't' ],
    styleSync = {
        tl: allCorners,
        tr: allCorners,
        bl: allCorners,
        br: allCorners,
        l: allBorders,
        r: allBorders,
        t: allBorders,
        b: allBorders
    };

function isLocalStyle(st) {
    return isString(st);
}

function isSameStyle(s1, s2) {
    var sameStyle;
    if (typeof s1 !== typeof s2) {
        sameStyle = false;
    } else if (s1 === null) {
        sameStyle = (s2 === null);
    } else if (isString(s1)) {
        sameStyle = (s1 === s2);
    } else if (s2 !== null) {
        sameStyle = (s1.factory === s2.factory && s1.type === s2.type && s1.style === s2.style);
    } else {
        sameStyle = false;
    }
    return sameStyle;
}

function styleAttributesToEditorAttributes(selector, data) {
    var result = {};
    forEachProperty(selector, function (attrName, editorName) {
        var d = data[attrName];
        if (d) {
            result[editorName] = d;
        }
    });
    return result;
}

function editorAttributesToStyleAttributes(selector, data) {
    var result = {};
    forEachProperty(selector, function (attrName, editorName) {
        var d = data[editorName];
        if (d === undefined) {
            d = null;
        }
        result[attrName] = d;
    });
    return result;
}

function editorAttributesToStyleAttributesSync(featureName, data, sync) {
    var ss = styleSync[featureName],
        res = {};
    if (sync && ss) {
        forEach(ss, function (s) {
            res = apply(res, editorAttributesToStyleAttributes(styleFeatures[s].attributes, deepCopy(data)));
        });
        return res;
    } else {
        return editorAttributesToStyleAttributes(styleFeatures[featureName].attributes, data);
    }
}

exports.styleFeatures = styleFeatures;

exports.isLocalStyle = isLocalStyle;

exports.isSameStyle = isSameStyle;

exports.styleAttributesToEditorAttributes = styleAttributesToEditorAttributes;

exports.editorAttributesToStyleAttributes = editorAttributesToStyleAttributes;

exports.editorAttributesToStyleAttributesSync = editorAttributesToStyleAttributesSync;
