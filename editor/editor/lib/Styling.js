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
    var skin = {};
    if (!isString(this.editedStyle)) {
        throw new Error('local style expected');
    }
    skin[this.editedStyle] = deepCopy(this.localStyle);
    skin[this.editedStyle].jsData[feature] = value;
    this.editor.getViewer().previewStyleChange(skin);
    this.updateStylePreview(feature, value);
};

Styling.prototype.setEditor = function (editor) {
    this.editor = editor;
    // we can retrieve the style list here and configure the style picker
    var sl = editor.getDependencyManager().getStyleList();
    this.children.stylePicker.setStyleList(sl);
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

Styling.prototype.updateStylePreview = function (optionalFeature, optionalValue) {
    var group = this.editor.getViewer().getGroup(),
        es = this.editedStyle,
        miniTheme = {};

    miniTheme[es] = deepCopy(group.documentData.theme[es]);
    if (optionalFeature) {
        miniTheme[es].jsData[optionalFeature] = optionalValue;
    }
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

    // udpate the style preview
    this.updateStylePreview();
};

Styling.prototype.getData = function () {
    return this.editedStyle;
};

exports.Styling = Styling;
