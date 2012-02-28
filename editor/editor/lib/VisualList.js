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
    this.reload();
}
VisualList.prototype = new (domvisual.DOMElement)();
VisualList.prototype.select = function (vi, apply) {
    var sel = this.selected,
        ret = false;
    if (vi !== sel) {
        if (sel) {
            sel.select(false);
        }
        this.selected = vi;
        if (apply === true) {
            this.applySelectedPosition();
        }
        if (vi) {
            vi.select(true);
        }
        ret = true;
    }
    return ret;
};
VisualList.prototype.selectByTypeInfo = function (ti) {
    if (ti) {    
        var factory = ti.factory,
            type = ti.type,
            that = this,
            editor = this.editor;
        forEachProperty(this.children, function (c) {
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
            console.log(selTypeInfo);
            // updated
            if (selectedChild) {
                group.doCommand(group.cmdUpdateVisual(
                    selectedName,
                    {
                        factory: selTypeInfo.factory,
                        type: selTypeInfo.type,
                        position: selectedName,
                        enableScaling: selectedChild.enableScaling,
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
                        enableScaling: false,
// FIXME: BROKEN!
                        order: 0, // ????
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
    this.removeAllChildren();
    var data = '',
        that = this;
    http.get({ path: '/visual'}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data),
                i,
                l = jsonData.length,
                c;
            function onClick() {
                that.select(this, true);
            }
            function packageLoaded(err) {
                console.log('package loaded !!!! ' + err);
            }
            for (i = 0; i < l; i += 1) {
                c = new VisualInfo({ typeInfo: jsonData[i]});
                c.init(that.editor);
                // FIXME: this needs some thinking... I want to flow the thing,
                // and doing so 
                c.setHtmlFlowing({position: 'relative'}, true);
                that.addChild(c);
                c.on('click', onClick);
                define.meat.loadPackage(jsonData[i].factory, packageLoaded);
            }
        });
    });
};

VisualList.prototype.init = function (editor) {
    var viewer = editor.getViewer(),        
        container = this.parent,
        that = this;
    this.editor = editor;
    
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


exports.VisualList = VisualList;
