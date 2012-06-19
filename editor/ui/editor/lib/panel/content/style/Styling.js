/**
    Styling.js

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
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    utils = require('utils'),
    isString = utils.isString,
    StyleInfo = require('./StyleInfo').StyleInfo,
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
        if (styleEdit) {
            that.removeChild(styleEdit);
        }
        if (f) {
            // create a new local style if needed
            if (that.editedStyle === null) {
                that.makeExtendedStyle(null);
            }
            styleEdit = new (f.FeatureEditor)(f.config);
            styleEdit.setStyleData(styleAttributesToEditorAttributes(
                attributes,
                that.editedStyleData.jsData || {}
            ));
            that.addChild(styleEdit, 'styleEdit', 2);
            styleEdit.setHtmlFlowing(flowing, true);
            styleEdit.on('change', function (value, sync) {
                that.setLocalStyleFeature(editorAttributesToStyleAttributesSync(featureName, value, sync));
            });
            styleEdit.on('preview', function (value, sync) {
                that.previewLocalStyleFeature(editorAttributesToStyleAttributesSync(featureName, value, sync));
            });
            styleEdit.on('reset', function (value, sync) {
                that.removeChild(styleEdit);
                that.setLocalStyleFeature(editorAttributesToStyleAttributesSync(featureName, value, sync));
                that.notifyDOMChanged();
            });
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
        this.preventUpdates = true;
        group.doCommand(group.cmdRenameStyleAndReferences(this.editedStyle, docInfo.factory, docInfo.type, name));
        delete this.preventUpdates;
        this.setData(name);
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
    if (this.editedStyleIsLocal) {
        this.preventUpdates = true;
        group.doCommand(group.cmdRemoveStyleAndReferences(docInfo.factory, docInfo.type, this.editedStyle));
        delete this.preventUpdates;
        this.setData(null);
    } else {
        this.preventUpdates = true;
        group.doCommand(group.cmdRemoveRemoteStyleSkin(this.editedStyle.factory,  this.editedStyle.type, this.editedStyle.style));
        delete this.preventUpdates;
        this.updateStylePickers();
        this.updateStylePreview();
    }
};

Styling.prototype.setLocalStyleFeature = function (features) {
    if (!this.editedStyleData) {
        throw new Error('local style expected');
    }
    var viewer = this.editor.getViewer(),
        group = viewer.getGroup(),
        localStyleData = this.editedStyleData.jsData,
        stylingHeading = this.getChild('stylingHeading'),
        previewTheme,
        stylePreview = stylingHeading.getChild('stylePreview');
    this.preventUpdates = true;
    if (this.editedStyleIsLocal) {
        group.doCommand(group.cmdSetStyleFeatures(this.editedStyle, features));
    } else {
        group.doCommand(group.cmdSetRemoteStyleSkinFeatures(this.editedStyle.factory,  this.editedStyle.type, this.editedStyle.style, features));
    }
    delete this.preventUpdates;
    // update the local style
    forEachProperty(features, function (v, f) {
        if (v === null) {
            delete localStyleData[f];
        } else {
            localStyleData[f] = v;
        }
    });
    previewTheme = viewer.getPreviewTheme();
    stylePreview.previewStyleChange(previewTheme);
    if (this.editedStyleIsLocal) {
        this.getChild('localStylePicker').previewStyleChange(previewTheme);
    } else {
        this.getChild('stylePicker').previewStyleChange(previewTheme);
        this.getChild('localStylePicker').previewStyleChange(previewTheme);
    }
    this.updateFeatureSelector();
};

Styling.prototype.previewLocalStyleFeature = function (features) {
    var editor = this.editor,
        group = editor.getViewer().getGroup(),
        localTheme = deepCopy(group.documentData.theme),
        localSkin = deepCopy(group.documentData.skin),
        stylingHeading = this.getChild('stylingHeading'),
        es = this.editedStyle,
        ss,
        stylePreview = stylingHeading.getChild('stylePreview');

    if (!this.editedStyleData) {
        throw new Error('local style expected');
    }

    if (this.editedStyleIsLocal) {
        ss = localTheme[this.editedStyle] = deepCopy(this.editedStyleData);
        ss = ss.jsData;
    } else {
        localSkin = localSkin || {};
        ss = localSkin[es.factory];
        if (!ss) {
            ss = localSkin[es.factory] = {};
        }
        ss = ss[es.type];
        if (!ss) {
            ss = localSkin[es.factory][es.type] = {};
        }
        ss = ss[es.style];
        if (!ss) {
            ss = localSkin[es.factory][es.type][es.style] = { jsData: {}};
        }
        ss = ss.jsData;
    }

    // update the local style
    forEachProperty(features, function (v, f) {
        if (v === null) {
            delete ss[f];
        } else {
            ss[f] = v;
        }
    });
    localTheme = group.createBoundThemeFromData(localTheme, localSkin);
    this.editor.getViewer().previewStyleChange(localTheme);
    stylePreview.previewStyleChange(localTheme);
    this.getChild('localStylePicker').previewStyleChange(localTheme);
    this.getChild('stylePicker').previewStyleChange(localTheme);

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
    var commandChain = editor.getViewer().getGroup().commandChain,
        that = this;
    this.editor = editor;

    // we can retrieve the style list here and configure the style picker
    this.children.stylePicker.setStyleList(this.computeNonLocalStyleList());
    this.updateLocalStyleList();
    // FIXME: set data is not called when there is no data in the selection (this is kinda
    // bad and should be fixed but until then this will put adequate defaults.
    this.updateStyleName();
    this.updateStylePickers();
    this.notifyDOMChanged();

    // FIXME: this is quite a hack. we hook ourself on the command chain and
    // unhook ourself only if we get notified and detect we are no longer
    // 'hooked to the stage'... It will not break but it is quite ugly.
    function detectStyleChanges(command, name, message, hint, forEachSubCommand) {
        var styleChanged = false;
        function check(name, message, hint) {
            if (hint && hint.styleChanged) {
                styleChanged = true;
            }
        }
        if (!that.connectedToTheStage) {
            // quite a hack!
            commandChain.removeListener('command', detectStyleChanges);
        } else {
            if (forEachSubCommand) {
                forEachSubCommand(check);
            }
            check(name, message, hint);
            if (styleChanged) {
                that.handleStyleChange();
            }
        }
    }
    commandChain.on('command', detectStyleChanges);

};

Styling.prototype.updateFeatureSelector = function () {
    var activeFeatures = {},
        localStyleJsData = {},
        stylingHeading = this.getChild('stylingHeading'),
        styleFeature = stylingHeading.getChild('styleFeature');

    if (this.editedStyle) {
        localStyleJsData = this.editedStyleData.jsData || localStyleJsData;
        forEachProperty(styleFeatures, function (data, feature) {
            forEachProperty(data.attributes, function (attr, attrName) {
                if (localStyleJsData[attr] !== undefined) {
                    activeFeatures[feature] = true;
                }
            });
        });
    }
    styleFeature.setStyleFeatures(activeFeatures);
};

Styling.prototype.updateStylePreview = function (optionalFeature, optionalValue) {
    var viewer = this.editor.getViewer(),
        stylingHeading = this.getChild('stylingHeading'),
        stylePreview = stylingHeading.getChild('stylePreview');

    stylePreview.setStyle(this.editedStyle);
    stylePreview.previewStyleChange(viewer.getPreviewTheme());
};

Styling.prototype.handleStyleChange = function () {
    if (!this.preventUpdates) {
        // reset the whole shebang... not perfect, but better than...
        this.setData(this.editedStyle);
    }
};

Styling.prototype.updateStyleName = function () {
    var group = this.editor.getViewer().getGroup(),
        es = this.editedStyle,
        editedStyleData = this.editedStyleData,
        styleName = this.getChild('styleName'),
        styleNameName = styleName.getChild('styleName'),
        styleNameExtendBtn = styleName.getChild('extendBtn'),
        styleNameDeleteBtn = styleName.getChild('deleteBtn'),
        basedOnLabel = styleName.getChild('basedOnLabel'),
        basedOn = styleName.getChild('basedOn'),
        bo,
        basedOnName;
    if (this.editedStyleIsLocal) {
        styleNameName.enable(true);
        styleNameExtendBtn.setVisible(true);
        styleNameDeleteBtn.setVisible(true);
        styleNameDeleteBtn.setText('Delete');
        styleNameName.setText(this.editedStyle);
        basedOnLabel.setVisible(true);
        basedOn.setVisible(true);
        basedOnName = '';
        if (editedStyleData.basedOn && editedStyleData.basedOn.length > 0) {
            bo = editedStyleData.basedOn[0];
            if (isString(bo)) {
                basedOnName = bo;
            } else {
                basedOnName = bo.style;
            }
        }
        basedOn.setText(basedOnName);
    } else {
        styleNameName.enable(false);
        styleNameExtendBtn.setVisible(true);
        styleNameDeleteBtn.setVisible(true);
        styleNameDeleteBtn.setText('Unskin');
        styleNameName.setText(this.editedStyle ? this.editedStyle.style : '');
        basedOnLabel.setVisible(false);
        basedOn.setVisible(false);
    }
};

Styling.prototype.updateStylePickers = function () {
    var children = this.children,
        theme = this.editor.getViewer().getPreviewTheme();
    children.stylePicker.highlight(this.editedStyle);
    children.stylePicker.previewStyleChange(theme);
    children.localStylePicker.highlight(this.editedStyle);
    children.localStylePicker.previewStyleChange(theme);
};

Styling.prototype.getSkinData = function (factory, type, style) {
    var documentData = this.editor.getViewer().getGroup().documentData,
        skin = documentData.skin,
        st;
    if (skin) {
        st = skin[factory];
        if (st) {
            st = st[type];
            if (st) {
                st = st[style];
            }
        }
    }
    return st ? deepCopy(st) : { jsData: {} };
};

Styling.prototype.setData = function (st) {
    var group = this.editor.getViewer().getGroup(),
        styleEdit = this.getChild('styleEdit');
    // this is a style as in (factory, type, style)
    this.editedStyle = st;
    // if the style is a local style
    if (isLocalStyle(this.editedStyle)) {
        this.editedStyleData = deepCopy(group.documentData.theme[this.editedStyle]);
        this.editedStyleIsLocal = true;
    } else if (this.editedStyle !== null) {
        this.editedStyleData = this.getSkinData(this.editedStyle.factory, this.editedStyle.type, this.editedStyle.style);
        this.editedStyleIsLocal = false;
    } else {
        this.editedStyleData = null;
        this.editedStyleIsLocal = false;
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
