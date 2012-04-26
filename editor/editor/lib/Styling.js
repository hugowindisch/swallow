/**
    Styling.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    isString = utils.isString,
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

function isLocalStyle(st) {
    return isString(st);
}

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
    this.editedStyle = null;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Styling);
//    this.updateList(Styling.dependencyManager.getStyleList());

    var feature = this.getChild('styleFeature'),
        that = this;
    feature.on('select', function (featureName) {
        var styleEdit = that.getChild('styleEdit'),
            f = styleFeatures[featureName];
        that.makeLocalStyle();
        if (styleEdit) {
            that.removeChild(styleEdit);
        }
        if (f) {
            styleEdit = new (f.FeatureEditor)(f.config);
            styleEdit.setStyleData(that.localStyle);
            that.addChild(styleEdit, 'styleEdit');
            styleEdit.setPosition('styleEdit');
            styleEdit.on('change', function (feature, value) {
                that.setLocalStyleFeature(feature, value);
            });
            styleEdit.on('preview', function (feature, value) {
                that.previewLocalStyleFeature(feature, value);
            });
            styleEdit.on('reset', function (feat) {
                feature.clearFeatureHighlight(feat);
                that.removeChild(styleEdit);
                that.clearLocalStyleFeature(feat);
            });
            // make sure the thing is highlighted
            feature.setFeatureHighlight(featureName);
        }
    });
}
Styling.prototype = new (domvisual.DOMElement)();
Styling.prototype.getConfigurationSheet = function () {
    return { };
};
Styling.prototype.clearLocalStyleFeature = function (feature) {
    if (!isString(this.editedStyle)) {
        throw new Error('local style expected');
    }
    var group = this.editor.getViewer().getGroup();
    group.doCommand(group.cmdSetStyleFeature(this.editedStyle, feature, null));
    this.updateStylePreview();
};
Styling.prototype.setLocalStyleFeature = function (feature, value) {
    if (!isString(this.editedStyle)) {
        throw new Error('local style expected');
    }
    var group = this.editor.getViewer().getGroup();
    group.doCommand(group.cmdSetStyleFeature(this.editedStyle, feature, value));
    this.updateStylePreview();
};
Styling.prototype.previewLocalStyleFeature = function (feature, value) {
    if (!isString(this.editedStyle)) {
        throw new Error('local style expected');
    }
    this.updateStylePreview();
};

Styling.prototype.setEditor = function (editor) {
    this.editor = editor;
};

Styling.prototype.makeLocalStyle = function () {
    var group = this.editor.getViewer().getGroup(), editedStyle;
    // if the currently edited style is not a local style
    if (!isLocalStyle(this.editedStyle)) {
        editedStyle = group.getUniqueStyleName();
        // add the style
        group.doCommand(group.cmdAddStyle(editedStyle));
        // set the data
        this.setData(editedStyle);
        // change the current style
        this.emit('change', editedStyle);
    }
};

Styling.prototype.updateFeatureSelector = function () {
    var styleFeature = this.children.styleFeature;
    styleFeature.setStyleData(this.localStyle);
};

Styling.prototype.updateStylePreview = function () {
    var group = this.editor.getViewer().getGroup(),
        es = this.editedStyle,
        miniTheme = {};

    miniTheme[es] = deepCopy(group.documentData.theme[es]);
    this.children.stylePreview.setStyleData(
        this.editedStyle,
        miniTheme
    );

};

Styling.prototype.setData = function (st) {
    var group = this.editor.getViewer().getGroup();
    //this.localStyle = group.documentData.theme[this.editeStyle];

    // this is a style as in (factory, type, style)
    this.editedStyle = st;
    // if the style is a local style
    if (isLocalStyle(this.editedStyle)) {
        this.localStyle = group.documentData.theme[this.editedStyle];
    } else {
        delete this.localStyle;
    }

    // update the feature selector
    this.updateFeatureSelector();

// this is bad... we should hook this to the groupviewer and make it usurpate the
    // udpate the style preview
    this.updateStylePreview();

/*
    var styleList = this.children.styleList,
        styleListChildren = styleList.children,
        selected = null;


    forEachProperty(styleListChildren, function (ch) {
        var data = ch.getEditedStyle();
        if (data.factory === st.factory && data.type === st.type && data.style === st.style) {
            selected = ch;
        }
    });
    this.select(selected); */
};
Styling.prototype.getData = function () {
    return this.editedStyle;
/*    var data = null;
    if (this.selected) {
        data = this.selected.getEditedStyle();
    }
    return data;*/
};
/*
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
*/
/*Styling.prototype.updateStylePreview = function () {
    this.children.stylePreview.setEditedStyle(this.selectedStyle);
    if (this.selectedStyle) {
        this.children.stylePreview.setEditedStyle(this.selected.getEditedStyle());
    } else {
        this.children.stylePreview.setEditedStyle(null);
    }
};*/
/*Styling.prototype.updateList = function (list) {
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
};*/
exports.Styling = Styling;
