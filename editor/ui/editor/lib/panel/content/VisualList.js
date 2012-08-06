/**
    VisualList.js

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
    VisualInfo = require('./VisualInfo').VisualInfo,
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty;

function VisualList(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualList);
}
VisualList.prototype = new (domvisual.DOMElement)();

VisualList.prototype.select = function (vi, apply) {
    var sel = this.selected,
        ret = false,
        editor = this.editor,
        choices = this.children.choices,
        docInfo = editor.getDocInfo(),
        alwaysShow = this.alwaysShow,
        filteredFactory = this.children.library.getSelectedOption(),
        f,
        editedFactory = docInfo.factory;
    if (vi !== sel) {
        if (sel) {
            sel.select(false);
            f = sel.getTypeInfo().factory;
            sel.setVisible(alwaysShow[f] || editedFactory === f || filteredFactory === f);
        }
        this.selected = vi;
        if (apply === true) {
            this.applySelectedPosition();
        }
        if (vi) {
            vi.select(true);
            vi.setVisible(true);
        }
        ret = true;
    }
    return ret;
};
VisualList.prototype.selectByTypeInfo = function (ti) {
    if (ti) {
        var factory = ti.factory,
            choices = this.children.choices,
            type = ti.type,
            that = this,
            editor = this.editor;
        if (!forEachProperty(choices.children, function (c) {
            // skip separators
            if (c instanceof VisualInfo) {
                var cti = c.getTypeInfo();
                if (cti.factory === factory && cti.type === type) {
                    that.select(c);
                    return true;
                }
            }
        })) {
            // missing, we must add it
            this.select(this.addVisualInfo(factory, type));
        }
    } else {
        this.select(null);
    }
};
VisualList.prototype.applySelectedPosition = function () {
    var viewer = this.editor.getViewer(),
        group = viewer.getGroup(),
        cmdGroup = group.cmdCommandGroup('setContent', 'Set Content'),
        documentData = group.documentData,
        children = documentData.children,
        sel = this.selected,
        selection = viewer.getSelection(),
        selTypeInfo;

    if (viewer.getSelectionLength() > 0) {
        if (sel) {
            selTypeInfo = sel.getTypeInfo();
            forEachProperty(selection, function (pos, posName) {
                var selectedChild = children[posName];
                // updated
                if (selectedChild) {
                    cmdGroup.add(group.cmdUpdateVisual(
                        posName,
                        {
                            factory: selTypeInfo.factory,
                            type: selTypeInfo.type,
                            config: {
                                position: posName
                            }
                        }
                    ));
                } else {
                    cmdGroup.add(group.cmdAddVisual(
                        posName,
                        {
                            factory: selTypeInfo.factory,
                            type: selTypeInfo.type,
                            config: {
                                position: posName
                            }
                        }
                    ));
                }
            });
            group.doCommand(cmdGroup);
        } else {
            forEachProperty(selection, function (pos, posName) {
                // clear the content from the box
                if (children[posName]) {
                    cmdGroup.add(group.cmdRemoveVisual(posName));
                }
            });
            group.doCommand(cmdGroup);
        }
    } else {
        // if our selection is not empty
        if (sel) {
            selTypeInfo = sel.getTypeInfo();
            // change the default visual in the groupviewer to match that
            viewer.setDefaultVisual({
                factory: selTypeInfo.factory,
                type: selTypeInfo.type,
                config: {}
            });
        } else {
            // otherwise, clear the default visual
            viewer.setDefaultVisual(null);
        }
    }
};
VisualList.prototype.addVisualInfo = function (factory, type) {
    var editor = this.editor,
        choices = this.children.choices,
        docInfo = editor.getDocInfo(),
        that = this;

    function onClick() {
        that.select(this, true);
    }
    function add(factory, type) {
        var c = null, f, T;
        f = require(factory);
        if (f) {
            T = f[type];
            if (T && (T.prototype instanceof visual.Visual) && (!T.prototype.privateVisual || docInfo === null || (factory === docInfo.factory))) {
                c = new VisualInfo({ typeInfo: {factory: factory, type: type}});
                c.init(that.editor);
                c.setHtmlFlowing({position: 'relative'}, true);
                choices.addChild(c);
                c.on('select', onClick);
            }
        }
        return c;
    }
    return add(factory, type);
};

VisualList.prototype.updateVisualList = function () {
    var editor = this.editor,
        packageManager = editor.getDependencyManager(),
        visualList = packageManager.getVisualList(),
        alwaysShow = this.alwaysShow,
        choices = this.children.choices,
        docInfo = editor.getDocInfo(),
        filteredFactory = this.children.library.getSelectedOption(),
        that = this;
    // remove all children
    choices.removeAllChildren();
    // create the always visible choices first
    forEachProperty(visualList, function (json, factory) {
        if (alwaysShow[factory] && json.visuals) {
            forEach(json.visuals, function (type) {
                that.addVisualInfo(factory, type);
            });
        }
    });
    // add a separator
    choices.addChild(
        (new (domvisual.DOMElement)()).setHtmlFlowing({position: 'relative'}, true).setDimensions([1, 20, 1]),
        'separator'
    );
    // then the other ones
    forEachProperty(visualList, function (json, factory) {
        if (!alwaysShow[factory] && filteredFactory === factory && json.visuals) {
            forEach(json.visuals, function (type) {
                that.addVisualInfo(factory, type);
            });
        }
    });
};

VisualList.prototype.init = function (editor) {
    var viewer = editor.getViewer(),
        container = this.parent,
        that = this;
    this.editor = editor;
    this.alwaysShow = { domvisual: true };

    // a new box has been selected
    function newBoxSelected() {
        var typeInfo;
        // select what's in the selection
        if (viewer.getSelectionLength() > 0) {
            typeInfo = viewer.getSelectionTypeInfo();

        } else {
            typeInfo = viewer.getDefaultVisual();
        }
        that.selectByTypeInfo(typeInfo);
    }

    function fullUpdate() {
        var docInfo = editor.getDocInfo();
        that.initFactories();
        that.children.library.setSelectedOption(docInfo.factory);
        that.updateVisualList();
        newBoxSelected();
    }

    // change in the dependency manager
    editor.getDependencyManager().on('change', function (visualList, packages, typeInfo) {
        var docInfo = editor.getDocInfo();
        if (!typeInfo || docInfo === null || typeInfo.factory !== docInfo.factory || typeInfo.type !== docInfo.type) {
            fullUpdate();
        }
    });

    viewer.on('selectionChanged', newBoxSelected);
    viewer.on('setGroup', fullUpdate);

    this.getChild('library').on('change', function (evt) {
        that.updateVisualList();
        newBoxSelected();
    });
    this.getChild('unsetContent').on('click', function (evt) {
        that.select(null, true);
    });

};

VisualList.prototype.initFactories = function () {
    var editor = this.editor,
        packageManager = editor.getDependencyManager(),
        visualList = packageManager.getVisualList(),
        factArray = [],
        alwaysShow = this.alwaysShow || {};

    forEachProperty(visualList, function (json, factory) {
        if (json.visuals) {
            forEach(json.visuals, function (type) {
                factArray.push(factory);
                return true;
            });
        }
    });
    factArray.sort(function (i1, i2) {
        return i1 > i2;
    });
    this.children.library.setOptions(factArray);
};


exports.VisualList = VisualList;
