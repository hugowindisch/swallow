/**
    select.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var baseui = require('baseui'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    MenuItem = baseui.MenuItem;

function getCommandChain(viewer) {
    var group = viewer.getGroup(),
        chain;
    if (group) {
        chain = group.commandChain;
    }
    return chain;
}
function getDocumentData(viewer) {
    var group = viewer.getGroup(),
        dd;
    if (group) {
        dd = group.documentData;
    }
    return dd;
}


function setupToolMenu(editor) {
    var viewer = editor.getViewer(),
        selectedTool,
        selectTool,
        drawTool,
        zoomInTool,
        zoomOutTool,
        menus = editor.menus;


    // this implements the modality of tools
    function setModal(t) {
        var st = selectedTool;
        selectedTool = t;
        // the checked state changed
        if (st) {
            st.emit('change');
        }
        if (t) {
            t.emit('change');
        }
    }

    
    // select tool (arrow)
    selectTool = new MenuItem(
        'Select',
        function () {
            setModal(this);
            viewer.enableBoxSelection(
                null,
                null,
                function (mat, nmat) {
                    // this should be determined by the keys
                    viewer.clearSelection(nmat);
                    viewer.selectByMatrix(nmat);
                    viewer.updateSelectionControlBox();
                }
            );
        },
        null,
        null,
        'editor/lib/plugin/select.png',    
        true,
        function () {
            return selectedTool === this;
        }
    );
    // draw tool (box)
    drawTool = new MenuItem(
        'Draw',
        function () {
            setModal(this);
            viewer.enableBoxSelection(
                null,
                null,
                function (mat, nmat) {
                    var group = viewer.getGroup();
                    group.doCommand(group.cmdAddPosition(
                        group.getUniquePositionName(),
                        {
                            matrix: mat,
                            type: "AbsolutePosition",
                            snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                        }   
                    ));
                }
            );
        },
        null,
        null,
        'editor/lib/plugin/draw.png',    
        true,
        function () {
            return selectedTool === this;
        }
    );
    // zoom in tool (magnifier)
    zoomInTool = new MenuItem(
        'Zoom In',
        function () {
            var prevSel = selectedTool;
            setModal(this);
            viewer.enableBoxSelection(
                null,
                null,
                function (mat, nmat) {
                    viewer.pushZoom(nmat);
                    setModal(prevSel);
                }
            );
        },
        null,
        null,
        'editor/lib/plugin/zoomin.png',    
        true,
        function () {
            return selectedTool === this;
        }
    );
    // zoom out tool (magnifier -)
    zoomOutTool = new MenuItem(
        'Zoom Out',
        function () {
            viewer.popZoom();            
        },
        null,
        null,
        'editor/lib/plugin/zoomout.png',    
        true
    );
    
    menus.tool.push(selectTool, drawTool, zoomInTool, zoomOutTool);
}

function setupEditMenu(editor) {
    var viewer = editor.getViewer(),
        undoTool,
        redoTool,
        menus = editor.menus;
    // undo
    undoTool = new MenuItem(
        function () {
            var chain = getCommandChain(viewer),
                msg = chain ? chain.getUndoMessage() : '';
            return 'Undo ' + (msg || '');
        },
        function () {
            getCommandChain(viewer).undo();
        },
        null,
        null,
        null,
        function () {
            var chain = getCommandChain(viewer),
                msg = chain ? chain.getUndoMessage() : '';
            return msg !== null;
        }
    );
    // redo
    redoTool = new MenuItem(
        function () {
            var chain = getCommandChain(viewer),
                msg = chain ? chain.getRedoMessage() : '';
            return 'Redo ' + (msg || '');
        },
        function () {
            getCommandChain(viewer).redo();
        },
        null,
        null,
        null,
        function () {
            var chain = getCommandChain(viewer),
                msg = chain ? chain.getRedoMessage() : '';
            return msg !== null;
        }
    );
    menus.edit.push(undoTool, redoTool);
}

function setupObjectMenu(editor) {
    var viewer = editor.getViewer(),
        selectionUpTool, 
        selectionDownTool, 
        selectionToTopTool, 
        selectionToBottomTool,
        menus = editor.menus;
        
    function selectionNotEmpty() {
        return !viewer.selectionIsEmpty();
    }

    function normalizeDepths(orders) {
        var d = [], res = {}, i, l, di;
        // collect
        forEachProperty(orders, function (o, name) {
            d.push({name: name, order: o});
        });
        // sort
        d.sort(function (o1, o2) {
            return o1.order - o2.order;
        });
        // redistribute
        l = d.length;
        for (i = 0; i < l; i += 1) {
            di = d[i];
            res[di.name] = di.order;
        }
        return res;
    }
    // selection up
    selectionUpTool = new MenuItem(
        'Move Up',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                newOrders = {},
                no;
            // compute new depths
            forEachProperty(dd.children, function (c, name) {
                no = c.order;
                if (viewer.visualIsSelected(name)) {
                    no += 1.5;
                }
                newOrders[name] = no;
            });
            // normalize depths
            newOrders = normalizeDepths(newOrders);
            // apply orders
            group.doCommand(group.cmdSetVisualOrder(newOrders, 'Move Up'));
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // selection down
    selectionDownTool = new MenuItem(
        'Move Down',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                newOrders = {},
                no;
            // compute new depths
            forEachProperty(dd.children, function (c, name) {
                no = c.order;
                if (viewer.visualIsSelected(name)) {
                    no -= 1.5;
                }
                newOrders[name] = no;
            });
            // normalize depths
            newOrders = normalizeDepths(newOrders);
            // apply orders
            group.doCommand(group.cmdSetVisualOrder(newOrders, 'Move Down'));
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // selection to top
    selectionToTopTool = new MenuItem(
        'Move To Top',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                numpos = group.getNumberOfPositions(),
                newOrders = {},
                no;
            // compute new depths
            forEachProperty(dd.children, function (c, name) {
                no = c.order;
                if (viewer.visualIsSelected(name)) {
                    no += numpos;
                }
                newOrders[name] = no;
            });
            // normalize depths
            newOrders = normalizeDepths(newOrders);
            // apply orders
            group.doCommand(group.cmdSetVisualOrder(newOrders, 'Move To Top'));
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // selection to bottom
    selectionToBottomTool = new MenuItem(
        'Move To Bottom',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                numpos = group.getNumberOfPositions(),
                newOrders = {},
                no;
            // compute new depths
            forEachProperty(dd.children, function (c, name) {
                no = c.order;
                if (viewer.visualIsSelected(name)) {
                    no -= numpos;
                }
                newOrders[name] = no;
            });
            // normalize depths
            newOrders = normalizeDepths(newOrders);
            // apply orders
            group.doCommand(group.cmdSetVisualOrder(newOrders, 'Move To Bottom'));
        },
        null,
        null,
        null,
        selectionNotEmpty
    );

    menus.object.push(
        selectionUpTool, 
        selectionDownTool, 
        selectionToTopTool, 
        selectionToBottomTool
    );
}
    
exports.setup = function (editor) {
    // update the menus
    setupToolMenu(editor);
    setupEditMenu(editor);
    setupObjectMenu(editor);
};

