/**
    VisualList.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    VisualInfo = require('./VisualInfo').VisualInfo,
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    http = require('http'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function VisualList(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.VisualList);
    var that = this,
        library = this.children.library;
    library.on('change', function (evt) {
        that.filterFactories();
    });
}
VisualList.prototype = new (domvisual.DOMElement)();
VisualList.prototype.filterFactories = function () {
    var editor = this.editor,
        choices = this.children.choices,
        docInfo = editor.getDocInfo(),
        filteredFactory = this.children.library.getSelectedOption(),
        editedFactory = docInfo.factory,
        selected = this.selected;
    forEachProperty(choices.children, function (c) {
        var cti = c.getTypeInfo(),
            f = cti.factory;
        c.setVisible(editedFactory === f || filteredFactory === f || c === selected);
    });
};
VisualList.prototype.select = function (vi, apply) {
    var sel = this.selected,
        ret = false,
        editor = this.editor,
        choices = this.children.choices,
        docInfo = editor.getDocInfo(),
        filteredFactory = this.children.library.getSelectedOption(),
        f,
        editedFactory = docInfo.factory;

    if (vi !== sel) {
        if (sel) {
            sel.select(false);
            f = sel.getTypeInfo().factory;
            sel.setVisible(editedFactory === f || filteredFactory === f);
        }
        this.selected = vi;
        if (apply === true) {
            this.applySelectedPosition();
        }
        if (vi) {
            vi.select(true);
            sel.setVisible(true);
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
            var cti = c.getTypeInfo();
            if (cti.factory === factory && cti.type === type) {
                that.select(c);
            }
        });
    } else {
        this.select(null);
    }
};
VisualList.prototype.applySelectedPosition = function () {
    var viewer = this.editor.getViewer(),
        group = viewer.getGroup(),
        documentData = group.documentData,
        sel = this.selected,
        selectedName,
        selectedChild,
        selTypeInfo;

    if (viewer.getSelectionLength() !== 1) {
        throw ('Unexpected selection length');
    } else {
        selectedName = viewer.getSelectedName();
        selectedChild = documentData.children[selectedName];
        //selectedChild = documentData.children[selectedName];
        if (sel) {
            selTypeInfo = sel.getTypeInfo();
            // updated
            if (selectedChild) {
                group.doCommand(group.cmdUpdateVisual(
                    selectedName,
                    {
                        factory: selTypeInfo.factory,
                        type: selTypeInfo.type,
                        position: selectedName,
                        order: selectedChild.order,
                        config: {
                        }
                    }
                ));
            } else {
                group.doCommand(group.cmdAddVisual(
                    selectedName,
                    {
                        factory: selTypeInfo.factory,
                        type: selTypeInfo.type,
                        position: selectedName,
                        order: group.getTopmostOrder(),
                        config: {
                        }
                    }
                ));
            }
        } else {
            // clear the content from the box
            if (selectedChild) {
                group.doCommand(group.cmdRemoveVisual(selectedName));
            }
        }
        if (sel) {
            selTypeInfo = sel.getTypeInfo();
        }
        //group.
    }

};
VisualList.prototype.reload = function () {
    var data = '',
        editor = this.editor,
        choices = this.children.choices,
        docInfo = editor.getDocInfo(),
        editedFactory = docInfo.factory,
        that = this;
    choices.removeAllChildren();
    http.get({ path: '/visual'}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data),
                i,
                l = jsonData.length,
                jsd,
                c,
                factories = {};
            function onClick() {
                that.select(this, true);
            }
            function packageLoaded(err) {
            }
            for (i = 0; i < l; i += 1) {
                jsd = jsonData[i];
                if ((!jsd.private || jsd.factory === editedFactory) && !(jsd.factory === docInfo.factory && jsd.type === docInfo.type)) {
                    // keep a list of factories
                    factories[jsd.factory] = jsd.factory;
                    c = new VisualInfo({ typeInfo: jsd});
                    c.init(that.editor);
                    // FIXME: this needs some thinking... I want to flow the thing,
                    // and doing so
                    c.setHtmlFlowing({position: 'relative'}, true);
                    choices.addChild(c);
                    c.on('click', onClick);
                    define.meat.loadPackage(jsonData[i].factory, packageLoaded);
                }
            }
            that.setFactories(factories);
            that.filterFactories();
        });
    });
};

VisualList.prototype.init = function (editor) {
    var viewer = editor.getViewer(),
        container = this.parent,
        that = this;
    this.editor = editor;

    this.reload();
    // a new box has been selected
    function newBoxSelected() {
        var selectedChild,
            selectedTypeInfo,
            group = viewer.getGroup();
        if (viewer.getSelectionLength() === 1) {

            container.setVisible(true);
            // here we want to get the selection
            selectedChild = group.documentData.children[viewer.getSelectedName()];
            if (selectedChild) {
                selectedTypeInfo = {factory: selectedChild.factory, type: selectedChild.type};
            }
            that.selectByTypeInfo(selectedTypeInfo);
        } else {
            container.setVisible(false);
        }
    }

    viewer.on('updateSelectionControlBox', newBoxSelected);
};

VisualList.prototype.setFactories = function (factories) {
    var factArray = [];
    forEachProperty(factories, function (f, name) {
        factArray.push(name);
    });
    factArray.sort(function (i1, i2) {
        return i1 > i2;
    });
    this.children.library.setOptions(factArray);
};


exports.VisualList = VisualList;
