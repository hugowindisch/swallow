/**
    SelectionInfo.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function SelectionInfo(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.SelectionInfo);
}
SelectionInfo.prototype = new (domvisual.DOMElement)();
SelectionInfo.prototype.getConfigurationSheet = function () {
    return {  };
};
SelectionInfo.prototype.init = function (editor) {
    var viewer = editor.getViewer(),
        container = this.parent,
        children = this.children;

    function enablePositionControls(enable) {
        forEach(
            ['position', 'transform', 'snapLeft', 'snapRight', 'snapBottom', 'snapTop', 'snapRight'],
            function (n) {
                children[n].enable(enable);
            }
        );
    }
    function updatePositionControls(position) {
        var controls = {
                "AbsolutePosition": [ 
                    'snapLeft', 
                    'snapRight', 
                    'snapBottom', 
                    'snapTopLabel', 
                    'snapLeftLabel', 
                    'snapRightLabel', 
                    'snapBottomLabel', 
                    'snapTopLabel'
                ],
                "TransformPosition": [
                    'transform'
                ]
            },
            snapping,
            positionType = position.type;
        // visibility
        forEachProperty(controls, function (cSet, cName) {
            var enable = cName === positionType;
            forEach(cSet, function (n) {
                children[n].setVisible(enable);
            });
        });
        // content
        switch (positionType) {
        case 'AbsolutePosition':
            snapping = position.snapping;
            children.snapLeft.setChecked(snapping.leftTo === 'right');
            children.snapRight.setChecked(snapping.rightTo === 'right');
            children.snapTop.setChecked(snapping.topTo === 'bottom');
            children.snapBottom.setChecked(snapping.bottomTo === 'bottom');
            break;
        case 'TransformPosition':
            children.transform.setSelectedOption(position.scaleMode);
            break;
        }
        children.position.setSelectedOption(positionType);
    }


    function update(rect) {
        if (rect) {
            children.x.setText(rect[0][0].toFixed(1));
            children.y.setText(rect[0][1].toFixed(1));
            children.w.setText((rect[1][0] - rect[0][0]).toFixed(1));
            children.h.setText((rect[1][1] - rect[0][1]).toFixed(1));
            container.setVisible(true);
        } else {
            container.setVisible(false);
        }
        if (viewer.getSelectionLength() === 1) {
            children.name.setText(viewer.getSelectedName());
            children.name.enable(true);
            enablePositionControls(true);
            updatePositionControls(viewer.getSelectedPosition());
            
        } else {
            children.name.setText('');
            children.name.enable(false);
            enablePositionControls(false);
        }
    }
    viewer.on('updateSelectionControlBox', update);
    viewer.on('previewSelectionRect', update);

    function toNumber(s) {
        var n = Number(s);
        if (isNaN(n)) {
            n = 0;
        }
        return n;
    }
    function positionOptionsChanged() {
        var positionType = children.position.getSelectedOption(),
            res = {},
            group = viewer.getGroup();
        switch (positionType) {
        case 'AbsolutePosition':
            res.type = positionType;
            res.snapping = {
                leftTo: children.snapLeft.getChecked() ? 'right' : 'left',
                rightTo: children.snapRight.getChecked() ? 'right' : 'left',
                topTo: children.snapTop.getChecked() ? 'bottom' : 'top',
                bottomTo: children.snapBottom.getChecked() ? 'bottom' : 'top'
            };
            break;
        case 'TransformPosition':
            res.type = positionType;
            res.scaleMode = children.transform.getSelectedOption();
            break;
        default:
            return;
        }
        res.matrix = viewer.getSelectedPosition().matrix;
        group.doCommand(group.cmdUpdatePosition(viewer.getSelectedName(), res));
    }
    forEach(
        ['position', 'transform', 'snapLeft', 'snapRight', 'snapBottom', 'snapTop', 'snapRight'],
        function (c) {
            children[c].on('change', positionOptionsChanged);
        }
    );
    function selectionBoxChanged() {
        var x = toNumber(children.x.getText()),
            y = toNumber(children.y.getText()),
            w = toNumber(children.w.getText()),
            h = toNumber(children.h.getText()),
            selRect = viewer.getSelectionRect(),
            transform = mat4.identity(),
            selection = viewer.getSelection(),
            group = viewer.getGroup(),
            cg;
        if (w < 1) {
            w = 1;
        }
        if (h < 1) {
            h = 1;
        }
        
        mat4.translate(transform, [x, y, 0]);
        mat4.scale(transform, [w / (selRect[1][0] - selRect[0][0]), h / (selRect[1][1] - selRect[0][1]), 1]);
        mat4.translate(transform, [-selRect[0][0], -selRect[0][1], 0]);

        cg = group.cmdCommandGroup('transform', 'Transform a group');
        // transform the whole selection
        forEachProperty(selection, function (sel, name) {
            cg.add(group.cmdTransformPosition(name, transform));
        });
        group.doCommand(cg);
        
    }
    children.x.on('change', selectionBoxChanged);
    children.y.on('change', selectionBoxChanged);
    children.w.on('change', selectionBoxChanged);
    children.h.on('change', selectionBoxChanged);
    children.name.on('change', function () {
        var txt = this.getText(),
            group = viewer.getGroup(),
            documentData = group.documentData,
            selName = viewer.getSelectedName(),
            cg;
            
        if (txt !== selName) {
            if (documentData.positions[txt] === undefined && documentData.children[txt] === undefined) {
                if (txt.length > 0) {
                    cg = group.cmdCommandGroup('rename', 'Rename a group', { from: selName, to: txt });
                    cg.add(group.cmdRenamePosition(selName, txt));
                    if (documentData.children[selName]) {
                        cg.add(group.cmdRenameVisual(selName, txt));
                    }
                    group.doCommand(cg);
                } else {
                    alert('empty name ' + txt);
                }
                
            } else {
                alert('name already taken ' + txt);
            }
        }
        this.getText();
    });

};

exports.SelectionInfo = SelectionInfo;
