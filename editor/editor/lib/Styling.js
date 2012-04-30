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

    var stylingHeading = this.getChild('stylingHeading'),
        styleFeature = stylingHeading.getChild('styleFeature'),
        flowing = {position: 'relative'},
        that = this;
    styleFeature.on('select', function (featureName) {
        var styleEdit = that.getChild('styleEdit'),
            f = styleFeatures[featureName];
        that.makeLocalStyle();
        if (styleEdit) {
            that.removeChild(styleEdit);
        }
        if (f) {
            styleEdit = new (f.FeatureEditor)(f.config);
            styleEdit.setStyleData(that.localStyle);
            that.addChild(styleEdit, 'styleEdit', 1);
            styleEdit.setPosition('styleEdit');
            styleEdit.setHtmlFlowing(flowing, true);
            styleEdit.on('change', function (feature, value) {
                that.setLocalStyleFeature(feature, value);
            });
            styleEdit.on('preview', function (feature, value) {
                that.previewLocalStyleFeature(feature, value);
            });
            styleEdit.on('reset', function (feat) {
                styleFeature.clearFeatureHighlight(feat);
                that.removeChild(styleEdit);
                that.clearLocalStyleFeature(feat);
            });
            // make sure the thing is highlighted
            styleFeature.setFeatureHighlight(featureName);
        }
    });
    // flow all our children
    stylingHeading.setHtmlFlowing(flowing, true);
    this.getChild('localStylePicker').setHtmlFlowing(flowing, true);
    this.getChild('stylePicker').setHtmlFlowing(flowing, true);
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

Styling.prototype.computeNonLocalStyleList = function () {
    // the dependency manager will get us a list that does
    // not correctly take into account the currently edited document
    var editor = this.editor,
        docInfo = editor.getDocInfo,
        factory = docInfo.factory,
        type = docInfo.type,
        sl = editor.getDependencyManager().getStyleList(),
        filteredSl = [];

    // here we must remove the local styles from the stylelist
    forEach(sl, function (s) {
        if (s.factory !== factory || s.type !== type) {
            filteredSl.push(s);
        }
    });
    return filteredSl;
};

Styling.prototype.computeLocalStyleList = function () {
    var editor = this.editor,
        group = editor.getViewer().getGroup(),
        documentData = group.documentData,
        sl = [];
    forEachProperty(documentData.theme, function (st, name) {
        sl.push({factory: null, type: null, style: name});
    });
    return sl;
};

Styling.prototype.updateLocalStyleList = function () {
    this.children.localStylePicker.setStyleList(this.computeLocalStyleList());
};


Styling.prototype.setEditor = function (editor) {
    this.editor = editor;
    // we can retrieve the style list here and configure the style picker
    this.children.stylePicker.setStyleList(this.computeNonLocalStyleList());
    this.updateLocalStyleList();
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
    var stylingHeading = this.getChild('stylingHeading'),
        styleFeature = stylingHeading.getChild('styleFeature');
    styleFeature.setStyleData(this.localStyle);
};

Styling.prototype.updateStylePreview = function (optionalFeature, optionalValue) {
    var group = this.editor.getViewer().getGroup(),
        es = this.editedStyle,
        stylingHeading = this.getChild('stylingHeading'),
        stylePreview = stylingHeading.getChild('stylePreview'),
        miniTheme = {};

    miniTheme[es] = deepCopy(group.documentData.theme[es]);
    if (optionalFeature) {
        miniTheme[es].jsData[optionalFeature] = optionalValue;
    }
    stylePreview.setStyleData(
        this.editedStyle,
        miniTheme
    );

};

Styling.prototype.setData = function (st) {
    var group = this.editor.getViewer().getGroup();
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
