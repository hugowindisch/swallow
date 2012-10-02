/**
    Skinning.js

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
    StyleUtils = require('./StyleUtils'),
    styleFeatures = StyleUtils.styleFeatures,
    isLocalStyle = StyleUtils.isLocalStyle,
    isSameStyle = StyleUtils.isSameStyle,
    styleAttributesToEditorAttributes = StyleUtils.styleAttributesToEditorAttributes,
    editorAttributesToStyleAttributes = StyleUtils.editorAttributesToStyleAttributes,
    editorAttributesToStyleAttributesSync = StyleUtils.editorAttributesToStyleAttributesSync;

function Skinning(config) {
    this.editedStyle = null;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Skinning);

    var stylingHeading = this.getChild('stylingHeading'),
        styleFeature = stylingHeading.getChild('styleFeature'),
        flowing = {position: 'relative'},
        stylePicker = this.getChild('stylePicker'),
        editor = this.editor,
        viewer = editor.getViewer(),
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
            if (styleEdit.setEditor) {
                styleEdit.setEditor(editor);
            }
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
    stylePicker.setHtmlFlowing(flowing, false);

    stylePicker.on('select', function (st) {
        that.pickStyle(st);
    });
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
            viewer.removeListener('command', detectStyleChanges);
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
    viewer.on('command', detectStyleChanges);
}
Skinning.prototype = new (domvisual.DOMElement)();
Skinning.prototype.getConfigurationSheet = function () {
    return { };
};
Skinning.prototype.setEditor = function (editor) {
    this.editor = editor;
};
Skinning.prototype.setStyleList = function (list) {
    this.children.stylePicker.setStyleList(list);
    this.pickStyle(list[0]);
};

Skinning.prototype.pickStyle = function (style) {
    if (!isSameStyle(style, this.editedStyle)) {
        this.setData(style);
    }
};

Skinning.prototype.setLocalStyleFeature = function (features) {
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
    this.getChild('stylePicker').previewStyleChange(previewTheme);
    this.updateFeatureSelector();
};

Skinning.prototype.previewLocalStyleFeature = function (features) {
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
    this.getChild('stylePicker').previewStyleChange(localTheme);

};


Skinning.prototype.updateFeatureSelector = function () {
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

Skinning.prototype.updateStylePreview = function (optionalFeature, optionalValue) {
    var viewer = this.editor.getViewer(),
        stylingHeading = this.getChild('stylingHeading'),
        stylePreview = stylingHeading.getChild('stylePreview');

    stylePreview.setStyle(this.editedStyle);
    stylePreview.previewStyleChange(viewer.getPreviewTheme());
};

Skinning.prototype.handleStyleChange = function () {
    if (!this.preventUpdates) {
        // reset the whole shebang... not perfect, but better than...
        this.setData(this.editedStyle);
    }
};


Skinning.prototype.updateStylePickers = function () {
    var children = this.children,
        theme = this.editor.getViewer().getPreviewTheme();
    children.stylePicker.highlight(this.editedStyle);
    children.stylePicker.previewStyleChange(theme);
};

Skinning.prototype.getSkinData = function (factory, type, style) {
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

Skinning.prototype.setData = function (st) {
    var group = this.editor.getViewer().getGroup(),
        styleEdit = this.getChild('styleEdit');
    // this is a style as in (factory, type, style)
    this.editedStyle = st;
    // if the style is a local style
    if (this.editedStyle !== null) {
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

    // update the style pickers
    this.updateStylePickers();

    // update the feature selector
    this.updateFeatureSelector();

    // udpate the style preview
    this.updateStylePreview();

    // this will let an outer container grow to our generated content
    this.notifyDOMChanged();

};

Skinning.prototype.getData = function () {
    return this.editedStyle;
};

exports.Skinning = Skinning;
