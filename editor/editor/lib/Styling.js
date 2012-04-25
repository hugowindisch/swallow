/**
    Styling.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    StyleInfo = require('./StyleInfo').StyleInfo,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    deepCopy = utils.deepCopy,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    styleFeatures = {
        tl: {
            FeatureEditor: require('./StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Top Left Corner', feature: 'tl' }
        },
        tr: {
            FeatureEditor: require('./StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Top Right Corner', feature: 'tr' }
        },
        bl: {
            FeatureEditor: require('./StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Bottom Left Corner', feature: 'bl' }
        },
        br: {
            FeatureEditor: require('./StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Bottom Right Corner', feature: 'br' }
        }

    };

/*
    Let's directly use this as style names
    s, tl
                t
                tr
                l
                m
                r
                bl
                b
                br
                txt
*/

function Styling(config) {
    this.editedStyle = {};
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Styling);
    this.updateList(Styling.dependencyManager.getStyleList());

    var feature = this.getChild('styleFeature'),
        that = this;
    feature.on('select', function (featureName) {
        var styleEdit = that.getChild('styleEdit'),
            f = styleFeatures[featureName];
        if (styleEdit) {
            that.removeChild(styleEdit);
        }
        if (f) {
            styleEdit = new (f.FeatureEditor)(f.config);
            styleEdit.setEditedStyle(that.editedStyle);
            that.addChild(styleEdit, 'styleEdit');
            styleEdit.setPosition('styleEdit');
            styleEdit.on('change', function (feature, value) {
                console.log('style change!!!');
                // that.editedStyle[feature] = value;
            });
            styleEdit.on('reset', function (feature) {
                delete that.editedStyle[feature];
                console.log('reset!!!!!!!!!!!!!!!!!!');
            });
        }
    });

}
Styling.prototype = new (domvisual.DOMElement)();
Styling.prototype.getConfigurationSheet = function () {
    return { };
};



//FIXME: this is yuck! we need the editor to be passed to the visuals that are
// used in configuration sheets. This has to be tought more thoroughly.
// Doing this will remove the need for this yuck function.
Styling.init = function (editor) {
    Styling.dependencyManager = editor.getDependencyManager();
};

Styling.prototype.setData = function (st) {
    var styleList = this.children.styleList,
        styleListChildren = styleList.children,
        selected = null;

    // this is a style as in (factory, type, style)
    this.editedStyle = deepCopy(st);
    forEachProperty(styleListChildren, function (ch) {
        var data = ch.getEditedStyle();
        if (data.factory === st.factory && data.type === st.type && data.style === st.style) {
            selected = ch;
        }
    });
    this.select(selected);
};
Styling.prototype.getData = function () {
    var data = null;
    if (this.selected) {
        data = this.selected.getEditedStyle();
    }
    return data;
};
Styling.prototype.select = function (st) {
    if (st !== this.selected) {
        if (this.selected) {
            this.selected.select(false);
        }
        this.selected = st;
        if (st !== null) {
            this.selected.select(true);
        }
    }
    // update all feature editors

    this.updateStylePreview();
};
Styling.prototype.updateStylePreview = function () {
    if (this.selected) {
        this.children.stylePreview.setEditedStyle(this.selected.getEditedStyle());
    } else {
        this.children.stylePreview.setEditedStyle(null);
    }
};
Styling.prototype.updateList = function (list) {
    var that = this,
        styleList = this.children.styleList;
    function stringDiff(s1, s2) {
        return s1 < s2 ? -1 : (s1 > s2 ? 1 : 0);
    }
    list.sort(function (s1, s2) {
        var d = stringDiff(s1.factory, s2.factory);
        if (d === 0) {
            d = stringDiff(s1.type, s2.type);
            if (d === 0) {
                d = stringDiff(s1.style, s2.style);
            }
        }
        return d;
    });
    // clear all children
    styleList.removeAllChildren();
    // regenerate all children
    forEach(list, function (st) {
        var ch = new StyleInfo({editedStyle: st});
        ch.setHtmlFlowing({position: 'relative'}, true);
        styleList.addChild(ch);
        ch.on('click', function () {
            that.select(ch);
            that.emit('change', ch.getEditedStyle());
        });
    });
    this.setDimensions([groups.Styling.dimensions[0], list.length * 60 + 10, 1]);
};
exports.Styling = Styling;
