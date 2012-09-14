/**
    select.js

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
/*globals window */
var baseui = require('baseui'),
    utils = require('utils'),
    glmatrix = require('glmatrix'),
    vec3 = glmatrix.vec3,
    mat4 = glmatrix.mat4,
    forEachProperty = utils.forEachProperty,
    deepCopy = utils.deepCopy,
    Accelerator = baseui.Accelerator,
    MenuItem = baseui.MenuItem,
    licenseText;

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
            vec3.add(selectionRect[1], translate, vec3.create())
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
        newTool,
        editOtherTool,
        saveTool,
        saveOtherTool,
        saveAllTool,
        closeTool,
        closeOtherTool,
        menus = editor.menus;

    editOtherTool = new MenuItem(
        'Edit Visual:',
        null,
        function () {
            var groups = editor.getGroups(),
                items = [],
                selected = editor.getSelectedGroup();
            forEachProperty(groups, function (g) {
                items.push(new MenuItem(
                    g.docInfo.factory + '.' + g.docInfo.type,
                    function () {
                        editor.editGroup(g.docInfo.factory, g.docInfo.type);
                    },
                    null,
                    null,
                    null,
                    true,
                    g === selected
                ));
            });
            return items;
        },
        null,
        null,
        function () {
            return utils.keys(editor.getGroups()).length > 1;
        }
    );
    saveTool = new MenuItem(
        'Save',
        function () {
            var group = editor.getSelectedGroup();
            editor.saveGroup(group.docInfo.factory, group.docInfo.type);
        },
        null,
        new Accelerator('VK_S', true),
        null,
        function () {
            return !editor.getSelectedGroup().getCommandChain().isOnSavePoint();
        }
    );

    saveOtherTool = new MenuItem(
        'Save Visual:',
        null,
        function () {
            var groups = editor.getGroups(),
                items = [],
                selected = editor.getSelectedGroup();
            forEachProperty(groups, function (g) {
                items.push(new MenuItem(
                    g.docInfo.factory + '.' + g.docInfo.type,
                    function () {
                        editor.saveGroup(g.docInfo.factory, g.docInfo.type);
                    },
                    null,
                    null,
                    null,
                    function () {
                        return !g.getCommandChain().isOnSavePoint();
                    },
                    g === selected
                ));
            });
            return items;
        },
        null,
        null,
        function () {
            return editor.hasUnsavedGroups();
        }
    );

    saveAllTool = new MenuItem(
        'Save All',
        function () {
            editor.saveAllGroups();
        },
        null,
        null,
        null,
        function () {
            return editor.hasUnsavedGroups();
        }
    );

    closeTool = new MenuItem(
        'Close',
        function () {
            var docInfo = editor.getDocInfo();
            editor.closeGroup(docInfo.factory, docInfo.type);
        },
        null,
        null,
        null,
        function () {
            return utils.keys(editor.getGroups()).length > 1;
        }
    );
    closeOtherTool = new MenuItem(
        'Close Visual:',
        null,
        function () {
            var groups = editor.getGroups(),
                items = [],
                selected = editor.getSelectedGroup();
            forEachProperty(groups, function (g) {
                items.push(new MenuItem(
                    g.docInfo.factory + '.' + g.docInfo.type,
                    function () {
                        editor.closeGroup(g.docInfo.factory, g.docInfo.type);
                    },
                    null,
                    null,
                    null,
                    true,
                    g === selected
                ));
            });
            return items;
        },
        null,
        null,
        function () {
            return utils.keys(editor.getGroups()).length > 1;
        }
    );

    newTool = new MenuItem(
        'New...',
        function () {
            // FIXME, very crude
            var result = window.prompt('name', ''),
                sres = result.split('.'),
                factory,
                type;
            if (sres.length > 1) {
                factory = sres[0];
                type = sres[1];
            } else if (result.length > 0) {
                type = sres[0];
                factory = editor.getSelectedGroup().docInfo.factory;
            }
            // create
            editor.newGroup(factory, type);
        }
    );
    menus.file.push(
        newTool,
        null,
        editOtherTool,
        null,
        saveTool,
        saveAllTool,
        saveOtherTool,
        null,
        closeTool,
        closeOtherTool
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
            viewer.setCursor(null);
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
                        viewer.setCursor('move');
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
        'editor/img/plugin/select.png',
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
            viewer.setCursor('crosshair');
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
                        vis.config.position = posName;
                        cmdGroup.add(group.cmdAddVisual(posName, vis));
                    }
                    group.doCommand(cmdGroup);
                },
                true
            );
        },
        null,
        null,
        'editor/img/plugin/draw.png',
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
            viewer.setCursor(null);
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
        'editor/img/plugin/zoomin.png',
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
        'editor/img/plugin/zoomout.png',
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
        pasteInPlaceTool,
        deleteTool,
        ls = window.localStorage,
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
        var group = viewer.getGroup();
        ls.clipboard = group.getSnapshot(viewer.getSelection());
    }

    function paste(inPlace) {
        var group = viewer.getGroup();
        group.pasteSnapshot(ls.clipboard);
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
            paste(false);
        },
        null,
        new Accelerator('VK_V', true),
        null,
        function () {
            return ls.clipboard !== null;
        }
    );
    pasteInPlaceTool = new MenuItem(
        'Paste In Place',
        function () {
            paste(true);
        },
        null,
        null,
        null,
        function () {
            return ls.clipboard !== null;
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
        pasteInPlaceTool,
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
        clearTransformationTool,
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
            var p = c.config.position;
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
                var p = c.config.position;
                if (selection[p]) {
                    cmdGroup.add(group.cmdRemoveVisual(p));
                }
            });
            // do the combined command
            group.doCommand(cmdGroup);
        },
        null,
        new Accelerator('VK_U', true),
        'editor/img/plugin/unsetcontent.png'
    );

    clearTransformationTool = new MenuItem(
        'Clear Transformations',
        function () {
            viewer.untransformSelection();
        },
        null,
        null,
        null,
        selectionNotEmpty
    );

    // setup auto update of some tools
    (function () {
        function signalChange() {
            unsetContentTool.emit('change');
            unsetContentTool.setEnabled(selectionHasNonEmptyPositions());
        }
        // updates the document title
        function updateTabTitle() {
            var group = viewer.getGroup(),
                groups = editor.getGroups(),
                commandChain,
                title = '',
                details = [],
                docInfo;

            if (group) {
                commandChain = group.getCommandChain();
                docInfo = group.docInfo;
                title = (commandChain.isOnSavePoint() ? '' : '* ') +
                    'Edit: ' + docInfo.type;
                forEachProperty(groups, function (g, n) {
                    if (g.docInfo.factory !== docInfo.factory || g.docInfo.type !== docInfo.type) {
                        details.push((g.commandChain.isOnSavePoint() ? '' : '*') + g.docInfo.factory + '.' + g.docInfo.type);
                    }
                });
                if (details.length > 0) {
                    title = title + ' (and ' + details.join(', and ') + ')';
                }
                document.title = title;
            }
        }
        // FIXME: this should be done with the normal event thing
        window.onbeforeunload = function (evt) {
            if (editor.hasUnsavedGroups()) {
                return 'You have unsaved groups.';
            }
        };
        function commandExecuted() {
            updateTabTitle();
            signalChange();
        }
        viewer.on('setGroup', updateTabTitle);
        viewer.on('setSavePoint', updateTabTitle);
        viewer.on('command', commandExecuted);
        viewer.on('selectionChanged', signalChange);
        updateTabTitle();
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
        unsetContentTool,
        clearTransformationTool
    );

}
function setupViewMenu(editor) {
    var ls = window.localStorage,
        showGrid,
        showAnchors,
        showOutlines,
        zoomPage,
        zoomAll,
        zomm100,
        menus = editor.menus,
        viewer = editor.getViewer();

    // align left tool
    showGrid = new MenuItem(
        'Show Grid',
        function () {
            var v = !viewer.getShowGrid();
            ls.showGrid = v;
            viewer.setShowGrid(v);
        },
        null,
        null,
        'editor/img/plugin/showgrid.png',
        true,
        function () {
            return viewer.getShowGrid();
        }
    );
    viewer.setShowGrid(ls.showGrid === undefined ? true : ls.showGrid === 'true');
    showAnchors = new MenuItem(
        'Show Anchors',
        function () {
            var v = !viewer.getShowAnchors();
            ls.showAnchors = v;
            viewer.setShowAnchors(v);
        },
        null,
        null,
        'editor/img/plugin/showanchors.png',
        true,
        function () {
            return viewer.getShowAnchors();
        }
    );
    viewer.setShowAnchors(ls.showAnchors === undefined ? true : ls.showAnchors === 'true');
    showOutlines = new MenuItem(
        'Show Outlines',
        function () {
            var v = !viewer.getShowOutlines();
            ls.showOutlines = v;
            viewer.setShowOutlines(!viewer.getShowOutlines());
        },
        null,
        null,
        'editor/img/plugin/showoutlines.png',
        true,
        function () {
            return viewer.getShowOutlines();
        }
    );
    viewer.setShowOutlines(ls.showOutlines === undefined ? true : ls.showOutlines === 'true');

    zoomPage = new MenuItem(
        'Zoom to Page',
        function () {
            viewer.zoomToPage();
        }
    );

    zoomAll = new MenuItem(
        'Zoom to Content',
        function () {
            viewer.zoomToContent();
        }
    );

    zomm100 = new MenuItem(
        'Zoom 100%',
        function () {
            viewer.zoom100();
        }
    );

    menus.view.push(
        showGrid,
        showAnchors,
        showOutlines,
        null,
        zoomPage,
        zoomAll,
        zomm100
    );
}

function setupRunMenu(editor) {
    var runTool,
        publishTool,
        monitorTool,
        menus = editor.menus;

    // run tool
    runTool = new MenuItem(
        'Run',
        function () {
            var docInfo = editor.getViewer().getGroup().docInfo;
            editor.runGroup(docInfo.factory, docInfo.type);
        },
        null,
        null,
        'editor/img/plugin/run.png'
    );
    // publish tool
    publishTool = new MenuItem(
        'Publish (to publish folder)',
        function () {
            editor.publishGroup();
        }
    );
    // monitor tool
    monitorTool = new MenuItem(
        'Monitor',
        function () {
            editor.monitorGroup();
        }
    );

    menus.run.push(
        runTool,
        publishTool,
        monitorTool
    );
}


// license text
licenseText = 'The SwallowApps Editor, an interactive application builder for creating html applications.\n\nCopyright (C) 2012  Hugo Windisch\n\n Licensed under the GPLv3';

function setupHelpMenu(editor) {
    var helpTool,
        aboutTool,
        readmeTool,
        manualTool,
        sourcesTool,
        wikiTool,
        bugTool,
        overviewTutorialTool,
        menus = editor.menus;
    // run tool
    helpTool = new MenuItem(
        'Documentation...',
        function () {
            window.open('/swallow/make/helpviewer.Help.html', '_blank');
        }
    );
    readmeTool = new MenuItem(
        'Readme...',
        function () {
            window.open('https://github.com/hugowindisch/swallow/blob/master/README.md', '_blank');
        }
    );
    manualTool = new MenuItem(
        'Manual...',
        function () {
            window.open('https://github.com/hugowindisch/swallow/blob/master/MANUAL.md', '_blank');
        }
    );
    sourcesTool = new MenuItem(
        'Sources...',
        function () {
            window.open('https://github.com/hugowindisch/swallow', '_blank');
        }
    );
    wikiTool = new MenuItem(
        'Development Wiki...',
        function () {
            window.open('https://github.com/hugowindisch/swallow/wiki', '_blank');
        }
    );
    bugTool = new MenuItem(
        'Bug Tracking...',
        function () {
            window.open('https://github.com/hugowindisch/swallow/issues', '_blank');
        }
    );

    // run tool
    aboutTool = new MenuItem(
        'About...',
        function () {
            alert(licenseText);
        }
    );

    // tutorials
    overviewTutorialTool = new MenuItem(
        'Tutorial: Overview...',
        function () {
            var Tutorial = require('./tutorial').Tutorial,
                nt = new Tutorial({
                    code: "m0os24I4PUc"
                });
            nt.runFullScreen();
        }
    );
    menus.help.push(
        helpTool,
        null,
        overviewTutorialTool,
        null,
        readmeTool,
        manualTool,
        null,
        sourcesTool,
        wikiTool,
        bugTool,
        null,
        aboutTool
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
    setupHelpMenu(editor);
};
