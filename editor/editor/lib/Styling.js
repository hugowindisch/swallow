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
            attributes: {
                radius: 'borderTopLeftRadius'
            },
            FeatureEditor: require('./StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Top Left Corner' }
        },
        tr: {
            attributes: {
                radius: 'borderTopRightRadius'
            },
            FeatureEditor: require('./StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Top Right Corner' }
        },
        bl: {
            attributes: {
                radius: 'borderBottomLeftRadius'
            },
            FeatureEditor: require('./StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Bottom Left Corner' }
        },
        br: {
            attributes: {
                radius: 'borderBottomRightRadius'
            },
            FeatureEditor: require('./StyleSettingCorner').StyleSettingCorner,
            config: { label: 'Bottom Right Corner' }
        },
        l: {
            attributes: {
                style: 'borderLeftStyle',
                color: 'borderLeftColor',
                width: 'borderLeftWidth'
            },
            FeatureEditor: require('./StyleSettingBorder').StyleSettingBorder,
            config: { label: 'Left Border' }
        },
        r: {
            attributes: {
                style: 'borderRightStyle',
                color: 'borderRightColor',
                width: 'borderRightWidth'
            },
            FeatureEditor: require('./StyleSettingBorder').StyleSettingBorder,
            config: { label: 'Right Border' }
        },
        t: {
            attributes: {
                style: 'borderTopStyle',
                color: 'borderTopColor',
                width: 'borderTopWidth'
            },
            FeatureEditor: require('./StyleSettingBorder').StyleSettingBorder,
            config: { label: 'Top Border' }
        },
        b: {
            attributes: {
                style: 'borderBottomStyle',
                color: 'borderBottomColor',
                width: 'borderBottomWidth'
            },
            FeatureEditor: require('./StyleSettingBorder').StyleSettingBorder,
            config: { label: 'Bottom Border' }
        },
        m: {
            attributes: {
                color: 'backgroundColor',
            },
            FeatureEditor: require('./StyleSettingBackground').StyleSettingBackground,
            config: { label: 'Background' }
        },
        txt: {
            attributes: {
                color: 'color',
                family: 'fontFamily',
                weight: 'fontWeight',
                size: 'fontSize'
            },
            FeatureEditor: require('./StyleSettingText').StyleSettingText,
            config: { label: 'Text' }
        },
        s: {
            attributes: {
                shadow: 'boxShadow'
            },
            FeatureEditor: require('./StyleSettingShadow').StyleSettingShadow,
            config: { label: 'Shadow' }
        }

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
            f = styleFeatures[featureName],
            attributes = f.attributes;
        that.makeLocalStyle();
        if (styleEdit) {
            that.removeChild(styleEdit);
        }
        if (f) {
            styleEdit = new (f.FeatureEditor)(f.config);
            styleEdit.setStyleData(styleAttributesToEditorAttributes(
                attributes,
                that.localStyle.jsData || {}
            ));
            that.addChild(styleEdit, 'styleEdit', 2);
            styleEdit.setPosition('styleEdit');
            styleEdit.setHtmlFlowing(flowing, true);
            styleEdit.on('change', function (value) {
                that.setLocalStyleFeature(editorAttributesToStyleAttributes(attributes, value));
            });
            styleEdit.on('preview', function (value) {
                that.previewLocalStyleFeature(editorAttributesToStyleAttributes(attributes, value));
            });
            styleEdit.on('reset', function (value) {
                styleFeature.clearFeatureHighlight(featureName);
                that.removeChild(styleEdit);
                that.setLocalStyleFeature(editorAttributesToStyleAttributes(attributes, value));
                that.notifyDOMChanged();
            });
            // make sure the thing is highlighted
            styleFeature.setFeatureHighlight(featureName);
        }
        that.notifyDOMChanged();
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
    // we must react to document changes (because what we do here is special,
    // we issues style change commands and want to react to them).
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
    if (isSameStyle(style, this.editedStyle)) {
        style = null;
    }
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

Styling.prototype.setLocalStyleFeature = function (features) {
    if (!this.localStyle) {
        throw new Error('local style expected');
    }
    var viewer = this.editor.getViewer(),
        group = viewer.getGroup(),
        localStyleData = this.localStyle.jsData,
        stylingHeading = this.getChild('stylingHeading'),
        skin,
        stylePreview = stylingHeading.getChild('stylePreview');
    group.doCommand(group.cmdSetStyleFeatures(this.editedStyle, features));
    // update the local style
    forEachProperty(features, function (v, f) {
        if (v === null) {
            delete localStyleData[f];
        } else {
            localStyleData[f] = v;
        }
    });
    skin = viewer.getPreviewTheme();
    stylePreview.previewStyleChange(skin);
    this.getChild('localStylePicker').previewStyleChange(skin);
};

Styling.prototype.previewLocalStyleFeature = function (features) {
    var editor = this.editor,
        group = editor.getViewer().getGroup(),
        skin = deepCopy(group.documentData.theme),
        stylingHeading = this.getChild('stylingHeading'),
        ss,
        stylePreview = stylingHeading.getChild('stylePreview');

    if (!this.localStyle) {
        throw new Error('local style expected');
    }
    ss = skin[this.editedStyle] = deepCopy(this.localStyle);
    ss = ss.jsData;
    // update the local style
    forEachProperty(features, function (v, f) {
        if (v === null) {
            delete ss[f];
        } else {
            ss[f] = v;
        }
    });
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
    this.notifyDOMChanged();

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
    var activeFeatures = {},
        localStyleJsData = {},
        stylingHeading = this.getChild('stylingHeading'),
        styleFeature = stylingHeading.getChild('styleFeature');
    if (this.localStyle) {
        localStyleJsData = this.localStyle.jsData || localStyleJsData;
    }
    forEachProperty(styleFeatures, function (data, feature) {
        forEachProperty(data.attributes, function (attr, attrName) {
            if (localStyleJsData[attr] !== undefined) {
                activeFeatures[feature] = true;
            }
        });
    });
    styleFeature.setStyleFeatures(activeFeatures);
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
    // this will let an outer container grow to our generated content
    this.notifyDOMChanged();

};

Styling.prototype.getData = function () {
    return this.editedStyle;
};

exports.Styling = Styling;
