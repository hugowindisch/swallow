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
        localStylePicker = this.getChild('localStylePicker'),
        stylePicker = this.getChild('stylePicker'),
        styleName = this.getChild('styleName'),
        styleNameName =  styleName.getChild('styleName'),
        deleteBtn = styleName.getChild('deleteBtn'),
        extendBtn = styleName.getChild('extendBtn'),
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
            that.addChild(styleEdit, 'styleEdit', 2);
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
    localStylePicker.setHtmlFlowing(flowing, false);
    stylePicker.setHtmlFlowing(flowing, false);
    this.getChild('styleName').setHtmlFlowing(flowing, true);

    stylePicker.on('select', function (st) {
        that.pickStyle(st);
    });
    localStylePicker.on('select', function (st) {
        that.pickStyle(st.style);
    });
    styleNameName.on('change', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        that.renameStyle(styleNameName.getText());
    });
    extendBtn.on('pressed', function () {
        that.extendLocalStyle();
    });
    deleteBtn.on('pressed', function () {
        that.deleteLocalStyle();
    });
}
Styling.prototype = new (domvisual.DOMElement)();
Styling.prototype.getConfigurationSheet = function () {
    return { };
};
Styling.prototype.makeExtendedStyle = function (st) {
    var group = this.editor.getViewer().getGroup(),
        docInfo,
        editedStyle,
        newStyle;
    // if the currently edited style is not a local style
    editedStyle = group.getUniqueStyleName();
    // create the style
    newStyle = {
        jsData: {}
    };
    if (st !== null) {
        if (isString(st)) {
            docInfo = this.editor.getDocInfo();
            newStyle.basedOn = [{factory: docInfo.factory, type: docInfo.type, style: st}];
        } else {
            newStyle.basedOn = [deepCopy(st)];
        }
    }
    // add the style
    group.doCommand(group.cmdAddStyle(editedStyle, newStyle));
    // set the data
    this.setData(editedStyle);
    // change the current style
    this.emit('change', editedStyle);
};

Styling.prototype.pickStyle = function (style) {
    this.setData(style);
    this.emit('change', style);
};

Styling.prototype.renameStyle = function (name) {
    var editor = this.editor,
        docInfo = editor.getDocInfo(),
        group = editor.getViewer().getGroup();
    if (!group.documentData.theme[name]) {
        group.doCommand(group.cmdRenameStyleAndReferences(this.editedStyle, docInfo.factory, docInfo.type, name));
        this.editedStyle = name;
        this.updateLocalStyleList();
    } else {
        // reset the displayed name
        this.updateStyleName();
    }
};

Styling.prototype.extendLocalStyle = function () {
    this.makeExtendedStyle(this.editedStyle);
};
Styling.prototype.deleteLocalStyle = function () {
    var editor = this.editor,
        docInfo = editor.getDocInfo(),
        group = editor.getViewer().getGroup();
    group.doCommand(group.cmdRemoveStyleAndReferences(docInfo.factory, docInfo.type, this.editedStyle));
    this.setData(null);
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
    var editor = this.editor,
        group = editor.getViewer().getGroup(),
        skin = deepCopy(group.documentData.theme),
        stylingHeading = this.getChild('stylingHeading'),
        stylePreview = stylingHeading.getChild('stylePreview');

    if (!isString(this.editedStyle)) {
        throw new Error('local style expected');
    }
    skin[this.editedStyle] = deepCopy(this.localStyle);
    skin[this.editedStyle].jsData[feature] = value;
    skin = group.createBoundThemeFromData(skin);
    this.editor.getViewer().previewStyleChange(skin);
    stylePreview.previewStyleChange(skin);
    stylePreview.setStyle(this.editedStyle);
    this.getChild('localStylePicker').previewStyleChange(skin);
};

Styling.prototype.computeNonLocalStyleList = function () {
    // the dependency manager will get us a list that does
    // not correctly take into account the currently edited document
    var editor = this.editor,
        docInfo = editor.getDocInfo(),
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
    // FIXME: set data is not called when there is no data in the selection (this is kinda
    // bad and should be fixed but until then this will put adequate defaults.
    this.updateStyleName();
    this.updateStylePickers();

};
Styling.prototype.makeLocalStyle = function () {
    var group = this.editor.getViewer().getGroup(), editedStyle,
        newStyle;
    // if the currently edited style is not a local style
    if (!isLocalStyle(this.editedStyle)) {
        this.makeExtendedStyle(this.editedStyle);
    }
};

Styling.prototype.updateFeatureSelector = function () {
    var stylingHeading = this.getChild('stylingHeading'),
        styleFeature = stylingHeading.getChild('styleFeature');
    styleFeature.setStyleData(this.localStyle);
};

Styling.prototype.updateStylePreview = function (optionalFeature, optionalValue) {
    var viewer = this.editor.getViewer(),
        stylingHeading = this.getChild('stylingHeading'),
        stylePreview = stylingHeading.getChild('stylePreview');

    stylePreview.setStyle(this.editedStyle);
    stylePreview.previewStyleChange(viewer.getPreviewTheme());
};

Styling.prototype.updateStyleName = function () {
    var group = this.editor.getViewer().getGroup(),
        es = this.editedStyle,
        localStyle = this.localStyle,
        styleName = this.getChild('styleName'),
        styleNameName = styleName.getChild('styleName'),
        styleNameExtendBtn = styleName.getChild('extendBtn'),
        styleNameDeleteBtn = styleName.getChild('deleteBtn'),
        basedOnLabel = styleName.getChild('basedOnLabel'),
        basedOn = styleName.getChild('basedOn'),
        bo,
        basedOnName;
    if (localStyle) {
        styleNameName.enable(true);
        styleNameExtendBtn.setVisible(true);
        styleNameDeleteBtn.setVisible(true);
        styleNameName.setText(this.editedStyle);
        basedOnLabel.setVisible(true);
        basedOn.setVisible(true);
        basedOnName = '';
        if (localStyle.basedOn && localStyle.basedOn.length > 0) {
            bo = localStyle.basedOn[0];
            if (isString(bo)) {
                basedOnName = bo;
            } else {
                basedOnName = bo.style;
            }
        }
        basedOn.setText(basedOnName);
    } else {
        styleNameName.enable(false);
        styleNameExtendBtn.setVisible(false);
        styleNameDeleteBtn.setVisible(false);
        styleNameName.setText(this.editedStyle ? this.editedStyle.style : '');
        basedOnLabel.setVisible(false);
        basedOn.setVisible(false);
    }
};

Styling.prototype.updateStylePickers = function () {
    var children = this.children;
    children.stylePicker.highlight(this.editedStyle);
    children.localStylePicker.highlight(this.editedStyle);
    children.localStylePicker.previewStyleChange(this.editor.getViewer().getPreviewTheme());
};

Styling.prototype.setData = function (st) {
    var group = this.editor.getViewer().getGroup(),
        styleEdit = this.getChild('styleEdit');
    // this is a style as in (factory, type, style)
    this.editedStyle = st;
    // if the style is a local style
    if (isLocalStyle(this.editedStyle)) {
        this.localStyle = deepCopy(group.documentData.theme[this.editedStyle]);
    } else {
        delete this.localStyle;
    }

    // remove the local style editor
    if (styleEdit) {
        this.removeChild(styleEdit);
    }

    // udpate the local style list
    this.updateLocalStyleList();

    // update the style pickers
    this.updateStylePickers();

    // update the feature selector
    this.updateFeatureSelector();

    // udpate the style preview
    this.updateStylePreview();

    // update the style name
    this.updateStyleName();
};

Styling.prototype.getData = function () {
    return this.editedStyle;
};

exports.Styling = Styling;
