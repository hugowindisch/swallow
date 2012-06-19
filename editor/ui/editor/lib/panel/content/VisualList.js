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
    var that = this;
    this.getChild('library').on('change', function (evt) {
        that.filterFactories();
    });
    this.getChild('unsetContent').on('click', function (evt) {
        that.select(null, true);
    });

}
VisualList.prototype = new (domvisual.DOMElement)();
VisualList.prototype.filterFactories = function () {
    var editor = this.editor,
        choices = this.children.choices,
        docInfo = editor.getDocInfo(),
        filteredFactory = this.children.library.getSelectedOption(),
        editedFactory = docInfo.factory,
        alwaysShow = this.alwaysShow,
        selected = this.selected;
    forEachProperty(choices.children, function (c) {
        // skip separators
        if (c instanceof VisualInfo) {
            var cti = c.getTypeInfo(),
                f = cti.factory;
            c.setVisible(alwaysShow[f] || filteredFactory === f || c === selected);
        }
    });
};
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
        forEachProperty(choices.children, function (c) {
            // skip separators
            if (c instanceof VisualInfo) {
                var cti = c.getTypeInfo();
                if (cti.factory === factory && cti.type === type) {
                    that.select(c);
                }
            }
        });
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
VisualList.prototype.updateVisualList = function () {
    var editor = this.editor,
        packageManager = editor.getDependencyManager(),
        visualList = packageManager.getVisualList(),
        jsd,
        alwaysShow = this.alwaysShow,
        choices = this.children.choices,
        docInfo = editor.getDocInfo(),
        editedFactory = docInfo.factory,
        ve,
        that = this;
    function onClick() {
        that.select(this, true);
    }
    function add(factory, type) {
        var c, f, T;
        if (!(factory === docInfo.factory && type === docInfo.type)) {
            f = require(factory);
            if (f) {
                T = f[type];
                if (T && (T.prototype instanceof visual.Visual) && (!T.prototype.privateVisual || (factory === docInfo.factory))) {
                    c = new VisualInfo({ typeInfo: {factory: factory, type: type}});
                    c.init(that.editor);
                    c.setHtmlFlowing({position: 'relative'}, true);
                    choices.addChild(c);
                    c.on('click', onClick);

                }
            }
        }

    }
    // remove all children
    choices.removeAllChildren();
    // create the always visible choices first
    forEachProperty(visualList, function (json, factory) {
        if (alwaysShow[factory] && json.visuals) {
            forEach(json.visuals, function (type) {
                add(factory, type);
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
        if (!alwaysShow[factory] && json.visuals) {
            forEach(json.visuals, function (type) {
                add(factory, type);
            });

        }
    });
    // then setup the factory selector
    that.setFactories(visualList);
    that.filterFactories();
};

VisualList.prototype.init = function (editor) {
    var viewer = editor.getViewer(),
        container = this.parent,
        docInfo = editor.getDocInfo(),
        that = this;
    this.editor = editor;
    this.alwaysShow = { domvisual: true };

    this.updateVisualList();
    editor.getDependencyManager().on('change', function (visualList, packages, typeInfo) {
        if (!typeInfo || typeInfo.factory !== docInfo.factory || typeInfo.type !== docInfo.type) {
            that.updateVisualList();
        }
    });
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

    viewer.on('selectionChanged', newBoxSelected);
};

VisualList.prototype.setFactories = function (factories) {
    var factArray = [],
        docInfo = this.editor.getDocInfo(),
        alwaysShow = this.alwaysShow || {};
    forEachProperty(factories, function (f, name) {
        // don't show the factories that are always present
        if (!alwaysShow[name] && f.visuals && f.visuals.length > 0) {
            factArray.push(name);
        }
    });
    factArray.sort(function (i1, i2) {
        return i1 > i2;
    });
    this.children.library.setOptions(factArray);
};


exports.VisualList = VisualList;
