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
function getTransform(viewer, xl, constrain, selectionRect) {
    var translate = vec3.create(xl),
        abs = Math.abs,
        min = Math.min,
        srt = [
            vec3.add(selectionRect[0], translate, vec3.create()),
            vec3.add(selectionRect[1], translate, vec3.create()),
        ],
        srSnapped = [
            viewer.snapPositionToGrid(vec3.create(srt[0])),
            viewer.snapPositionToGrid(vec3.create(srt[1]))
        ],
        d1,
        d2,
        i;
    // grids (snapping)
    for (i = 0; i < 2; i += 1) {
        d1 = srt[0][i] - srSnapped[0][i];
        d2 = srt[1][i] - srSnapped[1][i];
        if (abs(d1) <= abs(d2)) {
            translate[i] -= d1;
        } else {
            translate[i] -= d2;
        }
    }

    // constrains
    if (constrain) {
        if (abs(translate[0]) > abs(translate[1])) {
            translate[1] = 0;
        } else {
            translate[0] = 0;
        }
    }
    return mat4.translate(
        mat4.identity(),
        translate
    );
}


function setupFileMenu(editor) {
    var viewer = editor.getViewer(),
        saveTool,
        newTool,
        menus = editor.menus;

    saveTool = new MenuItem(
        'Save',
        function () {
            editor.saveGroup();
        },
        null,
        new Accelerator('VK_S', true)
    );
    newTool = new MenuItem(
        'New...',
        function () {
            // FIXME, very crude
            var result = window.prompt('name', ''),
                sres = result.split(' '),
                factory,
                type;
            if (sres.length > 1) {
                factory = sres[0];
                type = sres[1];
            } else if (result.length > 0) {
                type = sres[0];
                factory = editor.getDocInfo().factory;
            }
            // create
            editor.newGroup(factory, type, function (err) {
                if (!err) {
                    window.open('/static/editor.html?factory=' + factory + '&type=' + type, '_blank');
                }
            });
        }
    );
    menus.file.push(
        saveTool,
        newTool
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
            var dragging = false,
                draggingWait = true,
                toggleControlBoxModeWhenFinished = true,
                layoutAnchorsVisibility,
                selectionRect,
                selectionControlBoxVisibility;

            function select(evt, nmat) {
                viewer.selectByMatrix(nmat, !evt.shiftKey, evt.ctrlKey, !evt.ctrlKey);
                viewer.updateSelectionControlBox();
            }

            viewer.enableBoxSelection(
                function (mat, nmat, startpos, endpos, evt) {
                    toggleControlBoxModeWhenFinished = true;
                    if (!evt.ctrlKey && !viewer.itemAtPositionIsSelected(startpos)) {
                        toggleControlBoxModeWhenFinished = false;
                        select(evt, nmat);
                        viewer.resetSelectionControlBoxMode();
                    }
                    selectionRect = viewer.getSelectionRect();
                    if (!evt.ctrlKey && viewer.itemAtPositionIsSelected([mat[12], mat[13], mat[14]])) {
                        dragging = true;
                        draggingWait = true;
                        selectionControlBoxVisibility = viewer.showSelectionControlBox(false);
                        layoutAnchorsVisibility = viewer.showLayoutAnchors(false);
                    } else {
                        dragging = false;
                    }
                    return !dragging;
                },
                function (mat, nmat, startpos, endpos, evt) {
                    var delta;
                    if (dragging) {
                        // this will force a minimal displacement to enter dragging mode
                        if (draggingWait) {
                            delta = Math.max(
                                Math.abs(startpos[0] - endpos[0]),
                                Math.abs(startpos[1] - endpos[1])
                            );
                            draggingWait = delta < 3;
                        }
                        if (!draggingWait) {
                            viewer.previewSelectionTransformation(
                                getTransform(
                                    viewer,
                                    [mat[0], mat[5], mat[10]],
                                    evt.ctrlKey,
                                    selectionRect
                                )
                            );
                        }
                    }
                },
                function (mat, nmat, startpos, endpos, evt) {
                    var transform,
                        selection,
                        cmdGroup,
                        group;
                    if (dragging) {
                        if (draggingWait) {
                            // not enough dragging, we will simply toggle the
                            // selection gizmos (translation <-> rotation)
                            viewer.showSelectionControlBox(selectionControlBoxVisibility);
                            viewer.showLayoutAnchors(layoutAnchorsVisibility);
                            if (toggleControlBoxModeWhenFinished) {
                                viewer.toggleSelectionControlBoxMode();
                            }
                        } else {
                            group = viewer.getGroup();
                            // we want to move the selection.
                            transform = getTransform(
                                viewer,
                                [mat[0], mat[5], mat[10]],
                                evt.ctrlKey,
                                selectionRect
                            );
                            selection = viewer.getSelection();
                            cmdGroup = group.cmdCommandGroup('moveSelection', 'Move Selection');

                            // for everything in the selection
                            forEachProperty(selection, function (p, n) {
                                cmdGroup.add(group.cmdTransformPosition(n, transform));
                            });
                            // do the combined command
                            group.doCommand(cmdGroup);
                            viewer.resetSelectionControlBoxMode();
                            viewer.showSelectionControlBox(selectionControlBoxVisibility);
                            viewer.showLayoutAnchors(layoutAnchorsVisibility);
                        }
                    } else {
                        select(evt, nmat);
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
                    var group = viewer.getGroup(),
                        posName = group.getUniquePositionName(),
                        cmdGroup = group.cmdCommandGroup('drawPosition', 'Add Position', { clearSelection: true }),
                        vis = viewer.getDefaultVisual(),
                        abs = Math.abs;
                    if (abs(mat[0]) < 32 && abs(mat[5]) < 32) {
                        mat[0] = 32;
                        mat[5] = 32;
                    }
                    mat[10] = 1;
                    cmdGroup.add(group.cmdAddPosition(
                        posName,
                        {
                            matrix: mat,
                            order: group.getTopmostOrder(),
                            snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                        }
                    ));
                    if (vis) {
                        vis = deepCopy(vis);
                        vis.position = posName;
                        cmdGroup.add(group.cmdAddVisual(posName, vis));
                    }
                    group.doCommand(cmdGroup);
                },
                true
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
                    if (prevSel) {
                        prevSel.action();
                    }
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

    selectTool.action();
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
                order = group.getTopmostOrder(),
                minorder,
                posmap = {},
                usedmap = {};

            function check(n) {
                return usedmap[n];
            }
            forEachProperty(clipboard.positions, function (p, n) {
                if (minorder === undefined || p.order < minorder) {
                    minorder = p.order;
                }
            });
            forEachProperty(clipboard.positions, function (p, n) {
                var uniqueName = group.getUniquePositionName(n, check), cp;
                posmap[n] = uniqueName;
                usedmap[uniqueName] = true;
                cp = deepCopy(p);
                cp.order = order + p.order - minorder;
                cmdGroup.add(group.cmdAddPosition(uniqueName, cp));
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
        moveUpTool,
        moveDownTool,
        moveLeftTool,
        moveRightTool,
        unsetContentTool,
        menus = editor.menus;

    function selectionNotEmpty() {
        return !viewer.selectionIsEmpty();
    }
    function selectionTwoOrMore() {
        return viewer.getSelectionLength() > 1;
    }
    function selectionHasNonEmptyPositions() {
        var group = viewer.getGroup(),
            documentData = group.documentData,
            children = documentData.children,
            selection = viewer.getSelection(),
            cmdGroup = group.cmdCommandGroup('unsetContent', 'Unset Content'),
            ret = false;
        forEachProperty(children, function (c, n) {
            var p = c.position;
            if (selection[p]) {
                ret = true;
            }
        });
        return ret;
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
        'Decrease Depth',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                newOrders = {},
                no;
            // compute new depths
            forEachProperty(dd.positions, function (c, name) {
                no = c.order;
                if (viewer.positionIsSelected(name)) {
                    no += 1.5;
                }
                newOrders[name] = no;
            });
            // normalize depths
            newOrders = normalizeDepths(newOrders);
            // apply orders
            group.doCommand(group.cmdSetVisualOrder(newOrders, 'Decrease Depth'));
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // selection down
    selectionDownTool = new MenuItem(
        'Increase Depth',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                newOrders = {},
                no;
            // compute new depths
            forEachProperty(dd.positions, function (c, name) {
                no = c.order;
                if (viewer.positionIsSelected(name)) {
                    no -= 1.5;
                }
                newOrders[name] = no;
            });
            // normalize depths
            newOrders = normalizeDepths(newOrders);
            // apply orders
            group.doCommand(group.cmdSetVisualOrder(newOrders, 'Increase Depth'));
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // selection to top
    selectionToTopTool = new MenuItem(
        'To Topmost Depth',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                numpos = group.getNumberOfPositions(),
                newOrders = {},
                no;
            // compute new depths
            forEachProperty(dd.positions, function (c, name) {
                no = c.order;
                if (viewer.positionIsSelected(name)) {
                    no += numpos;
                }
                newOrders[name] = no;
            });
            // normalize depths
            newOrders = normalizeDepths(newOrders);
            // apply orders
            group.doCommand(group.cmdSetVisualOrder(newOrders, 'To Topmost Depth'));
        },
        null,
        null,
        null,
        selectionNotEmpty
    );
    // selection to bottom
    selectionToBottomTool = new MenuItem(
        'To Bottommost Depth',
        function () {
            var group = viewer.getGroup(),
                dd = getDocumentData(viewer),
                numpos = group.getNumberOfPositions(),
                newOrders = {},
                no;
            // compute new depths
            forEachProperty(dd.positions, function (c, name) {
                no = c.order;
                if (viewer.positionIsSelected(name)) {
                    no -= numpos;
                }
                newOrders[name] = no;
            });
            // normalize depths
            newOrders = normalizeDepths(newOrders);
            // apply orders
            group.doCommand(group.cmdSetVisualOrder(newOrders, 'To Bottommost Depth'));
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
        selectionTwoOrMore
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
        selectionTwoOrMore
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
        selectionTwoOrMore
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
        selectionTwoOrMore
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
        selectionTwoOrMore
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
        selectionTwoOrMore
    );

    // move tools
    moveUpTool = new MenuItem(
        'Move Up',
        function () {
            var group = viewer.getGroup(),
                selectionRect = viewer.getSelectionRect(),
                transform,
                selection,
                cmdGroup;
            // we want to move the selection.
            transform = getTransform(
                viewer,
                [0, -group.documentData.gridSize, 0],
                false,
                selectionRect
            );
            selection = viewer.getSelection();
            cmdGroup = group.cmdCommandGroup('moveUp', 'Move Up');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        new Accelerator('VK_UP', true),
        null,
        selectionNotEmpty
    );
    moveDownTool = new MenuItem(
        'Move Down',
        function () {
            var group = viewer.getGroup(),
                selectionRect = viewer.getSelectionRect(),
                transform,
                selection,
                cmdGroup;
            // we want to move the selection.
            transform = getTransform(
                viewer,
                [0, group.documentData.gridSize, 0],
                false,
                selectionRect
            );
            selection = viewer.getSelection();
            cmdGroup = group.cmdCommandGroup('moveDown', 'Move Down');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        new Accelerator('VK_DOWN', true),
        null,
        selectionNotEmpty
    );
    moveLeftTool = new MenuItem(
        'Move Left',
        function () {
            var group = viewer.getGroup(),
                selectionRect = viewer.getSelectionRect(),
                transform,
                selection,
                cmdGroup;
            // we want to move the selection.
            transform = getTransform(
                viewer,
                [-group.documentData.gridSize, 0, 0],
                false,
                selectionRect
            );
            selection = viewer.getSelection();
            cmdGroup = group.cmdCommandGroup('moveLeft', 'Move Left');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        new Accelerator('VK_LEFT', true),
        null,
        selectionNotEmpty
    );
    moveRightTool = new MenuItem(
        'Move Right',
        function () {
            var group = viewer.getGroup(),
                selectionRect = viewer.getSelectionRect(),
                transform,
                selection,
                cmdGroup;
            // we want to move the selection.
            transform = getTransform(
                viewer,
                [group.documentData.gridSize, 0, 0],
                false,
                selectionRect
            );
            selection = viewer.getSelection();
            cmdGroup = group.cmdCommandGroup('moveRight', 'Move Right');

            // for everything in the selection
            forEachProperty(selection, function (p, n) {
                cmdGroup.add(group.cmdTransformPosition(n, transform));
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        new Accelerator('VK_RIGHT', true),
        null,
        selectionNotEmpty
    );

    unsetContentTool = new MenuItem(
        'Unset Content',
        function () {
            var group = viewer.getGroup(),
                documentData = group.documentData,
                children = documentData.children,
                selection = viewer.getSelection(),
                cmdGroup = group.cmdCommandGroup('unsetContent', 'Unset Content');

            // for everything in the selection
            forEachProperty(children, function (c, n) {
                var p = c.position;
                if (selection[p]) {
                    cmdGroup.add(group.cmdRemoveVisual(p));
                }
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        new Accelerator('VK_U', true),
        'editor/lib/plugin/unsetcontent.png',
        selectionHasNonEmptyPositions
    );

    // setup auto update of some tools
    (function () {
        var group = viewer.getGroup(),
            documentData = group.documentData,
            commandChain = group.getCommandChain();
        function signalChange(evt) {
            unsetContentTool.emit('change');
        }
        commandChain.on('undo', signalChange);
        commandChain.on('redo', signalChange);
        commandChain.on('do', signalChange);
    }());

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
        alignMiddleTool,
        null,
        moveUpTool,
        moveDownTool,
        moveLeftTool,
        moveRightTool,
        null,
        unsetContentTool
    );

}
function setupViewMenu(editor) {
    var showGrid,
        showAnchors,
        menus = editor.menus,
        viewer = editor.getViewer();

    // align left tool
    showGrid = new MenuItem(
        'Show Grid',
        function () {
            viewer.setShowGrid(!viewer.getShowGrid());
        },
        null,
        null,
        'editor/lib/plugin/showgrid.png',
        true,
        function () {
            return viewer.getShowGrid();
        }
    );
    showAnchors = new MenuItem(
        'Show Anchors',
        function () {
            viewer.setShowAnchors(!viewer.getShowAnchors());
        },
        null,
        null,
        'editor/lib/plugin/showanchors.png',
        true,
        function () {
            return viewer.getShowAnchors();
        }
    );

    menus.view.push(
        showGrid,
        showAnchors
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
    setupViewMenu(editor);
    setupRunMenu(editor);
};
