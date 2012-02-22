/**
    select.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var baseui = require('baseui'),
    utils = require('utils'),
    glmatrix = require('glmatrix'),    
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    forEachProperty = utils.forEachProperty,
    deepCopy = utils.deepCopy,
    Accelerator = baseui.Accelerator,
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

function setupFileMenu(editor) {
    var viewer = editor.getViewer(),
        saveTool,
        menus = editor.menus;

    saveTool = new MenuItem(
        'Save',
        function () {        
            editor.saveGroup();
        },
        null,
        new Accelerator('VK_S', true)
    );
    menus.file.push(
        saveTool
    );
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
            var dragging = false;
            viewer.enableBoxSelection(
                function (mat, nmat, startpos, endpos, evt) {
                    if (!evt.ctrlKey && viewer.selectedItemAtPosition([mat[12], mat[13], mat[14]])) {
                        dragging = true;
                    } else {
                        dragging = false;
                    }
                    return !dragging;
                },
                function (mat, nmat) {
                    var transform;                    
                    if (dragging) {
                        // we want to move the selection.
                        transform = mat4.translate(
                            mat4.identity(),
                            [mat[0], mat[5], mat[10]]
                        );
                        viewer.previewSelectionTransformation(transform);
                    }
                },
                function (mat, nmat, startpos, endpos, evt) {
                    var transform,
                        selection,
                        cmdGroup,
                        group;
                    if (dragging) {
                        group = viewer.getGroup();
                        // we want to move the selection.
                        transform = mat4.translate(
                            mat4.identity(),
                            [mat[0], mat[5], mat[10]]
                        );
                        selection = viewer.getSelection();
                        cmdGroup = group.cmdCommandGroup('moveSelection', 'Move Selection');
                        

                        // for everything in the selection
                        forEachProperty(selection, function (p, n) {
                            cmdGroup.add(group.cmdTransformPosition(n, transform));
                        });
                        // do the combined command
                        group.doCommand(cmdGroup);
                        
                    } else {                    
                        // this should be determined by the keys
                        if (!evt.ctrlKey) {
                            viewer.clearSelection(nmat);
                        }
                        viewer.selectByMatrix(nmat, !evt.shiftKey);                    
                        viewer.updateSelectionControlBox();
                    }
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
    
    menus.tool.push(
        selectTool, 
        drawTool, 
        zoomInTool, 
        null,
        zoomOutTool
    );
}

function setupEditMenu(editor) {
    var viewer = editor.getViewer(),
        undoTool,
        redoTool,
        cutTool,
        copyTool,
        pasteTool,
        deleteTool,
        clipboard = null,
        menus = editor.menus;

    function selectionNotEmpty() {
        return !viewer.selectionIsEmpty();
    }
        
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
        new Accelerator('VK_Z', true),
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
        new Accelerator('VK_Y', true),
        null,
        function () {
            var chain = getCommandChain(viewer),
                msg = chain ? chain.getRedoMessage() : '';
            return msg !== null;
        }
    );
    function copy() {
        clipboard = viewer.getSelectionCopy();
    }
    function deleteSelected(cmdName, message) {
        var group = viewer.getGroup(),
            documentData = group.documentData,
            children = documentData.children,
            c,
            positions = documentData.positions,
            selection = viewer.getSelection(),
            cmdGroup = group.cmdCommandGroup(cmdName, message);
            
        forEachProperty(selection, function (p, n) {
            cmdGroup.add(group.cmdRemovePosition(n));
            c = children[n];
            if (c) {
                cmdGroup.add(group.cmdRemoveVisual(n));
            }
        });
        group.doCommand(cmdGroup);
    }
    
    cutTool = new MenuItem(
        'Cut',
        function () {
            copy();
            deleteSelected();
        },
        null,
        new Accelerator('VK_X', true),
        null,
        selectionNotEmpty
    );
        
    copyTool = new MenuItem(
        'Copy',
        function () {
            copy();
        },
        null,
        new Accelerator('VK_C', true),
        null,
        selectionNotEmpty
    );
    pasteTool = new MenuItem(
        'Paste',
        function () {
            var group = viewer.getGroup(),
                documentData = group.documentData,
                children = documentData.children,
                c,
                positions = documentData.positions,
                selection = viewer.getSelection(),
                cmdGroup = group.cmdCommandGroup('cmdPaste', 'Paste'),
                posmap = {},
                usedmap = {};
               
            function check(n) {
                return usedmap[n];
            }
            forEachProperty(clipboard.positions, function (p, n) {
                var uniqueName = group.getUniquePositionName(n, check);
                posmap[n] = uniqueName;
                usedmap[uniqueName] = true;
                cmdGroup.add(group.cmdAddPosition(uniqueName, deepCopy(p)));
            });
            usedmap = {};
            forEachProperty(clipboard.children, function (c, n) {
                var uniqueName = group.getUniqueVisualName(n, check),
                    newc = deepCopy(c);
                newc.position = posmap[newc.position];
                usedmap[uniqueName] = true;
                cmdGroup.add(group.cmdAddVisual(uniqueName, newc));
            });
            group.doCommand(cmdGroup);
        },
        null,
        new Accelerator('VK_V', true),
        null,
        function () {
            return clipboard !== null;
        }
    );
    deleteTool = new MenuItem(
        'Delete',
        function () {
            deleteSelected();
        },
        null,
        new Accelerator('VK_D', true),
        null,
        selectionNotEmpty
    );
    
    menus.edit.push(
        undoTool, 
        redoTool,
        null,
        cutTool,
        copyTool,
        pasteTool,
        deleteTool
    );
}

function setupObjectMenu(editor) {
    var viewer = editor.getViewer(),
        selectionUpTool, 
        selectionDownTool, 
        selectionToTopTool, 
        selectionToBottomTool,
        alignLeftTool,
        alignRightTool,
        alignCenterTool,
        alignTopTool,
        alignBottomTool,
        alignMiddleTool,
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
            res[di.name] = i;
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
    // align left tool
    alignLeftTool = new MenuItem(
        'Align Left',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                selection = viewer.getSelection(),
                selectionRect = viewer.getSelectionRect(),
                positionRect,
                transform,
                cmdGroup = group.cmdCommandGroup('alignLeft', 'Align Left');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                positionRect = viewer.getPositionRect(n);
                transform = mat4.translate(
                    mat4.identity(), 
                    [selectionRect[0][0] - positionRect[0][0], 0, 0]
                );

                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // align left tool
    alignRightTool = new MenuItem(
        'Align Right',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                selection = viewer.getSelection(),
                selectionRect = viewer.getSelectionRect(),
                positionRect,
                transform,
                cmdGroup = group.cmdCommandGroup('alignRight', 'Align Right');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                positionRect = viewer.getPositionRect(n);
                transform = mat4.translate(
                    mat4.identity(), 
                    [selectionRect[1][0] - positionRect[1][0], 0, 0]
                );

                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // align left tool
    alignCenterTool = new MenuItem(
        'Align Center',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                selection = viewer.getSelection(),
                selectionRect = viewer.getSelectionRect(),
                positionRect,
                mid = (selectionRect[0][0] + selectionRect[1][0]) / 2,
                transform,
                cmdGroup = group.cmdCommandGroup('alignCenter', 'Align Center');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                positionRect = viewer.getPositionRect(n);
                var m = (positionRect[0][0] + positionRect[1][0]) / 2;                
                transform = mat4.translate(
                    mat4.identity(), 
                    [mid - m, 0, 0]
                );

                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // align top tool
    alignTopTool = new MenuItem(
        'Align Top',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                selection = viewer.getSelection(),
                selectionRect = viewer.getSelectionRect(),
                positionRect,
                transform,
                cmdGroup = group.cmdCommandGroup('alignTop', 'Align Top');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                positionRect = viewer.getPositionRect(n);
                transform = mat4.translate(
                    mat4.identity(), 
                    [0, selectionRect[0][1] - positionRect[0][1], 0]
                );

                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // align bottom tool
    alignBottomTool = new MenuItem(
        'Align Bottom',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                selection = viewer.getSelection(),
                selectionRect = viewer.getSelectionRect(),
                positionRect,
                transform,
                cmdGroup = group.cmdCommandGroup('alignBottom', 'Align Bottom');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                positionRect = viewer.getPositionRect(n);
                transform = mat4.translate(
                    mat4.identity(), 
                    [0, selectionRect[1][1] - positionRect[1][1], 0]
                );

                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // align left tool
    alignMiddleTool = new MenuItem(
        'Align Middle',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                selection = viewer.getSelection(),
                selectionRect = viewer.getSelectionRect(),
                positionRect,
                mid = (selectionRect[0][1] + selectionRect[1][1]) / 2,
                transform,
                cmdGroup = group.cmdCommandGroup('alignMiddle', 'Align Middle');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                positionRect = viewer.getPositionRect(n);
                var m = (positionRect[0][1] + positionRect[1][1]) / 2;                
                transform = mat4.translate(
                    mat4.identity(), 
                    [0, mid - m, 0]
                );

                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
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
        selectionToBottomTool,
        null,
        alignLeftTool,
        alignRightTool,
        alignCenterTool,
        null,
        alignTopTool,
        alignBottomTool,
        alignMiddleTool
    );
    
}
function setupRunMenu(editor) {
    var runTool,
        menus = editor.menus;
        
    // align left tool
    runTool = new MenuItem(
        'Run',
        function () {
            var docInfo = editor.getDocInfo();
            window.open("/static/" + docInfo.factory + '.html?visual=' + docInfo.type, '_blank');
        }
    );

    menus.run.push(
        runTool
    );
}

    
exports.setup = function (editor) {
    // update the menus
    setupFileMenu(editor);
    setupToolMenu(editor);
    setupEditMenu(editor);
    setupObjectMenu(editor);
    setupRunMenu(editor);
};

