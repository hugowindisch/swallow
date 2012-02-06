var baseui = require('baseui'),
    MenuItem = baseui.MenuItem;
    
exports.setup = function (editor) {
    var viewer = editor.getViewer(),
        selectedTool,
        selectTool,
        drawTool,
        zoomInTool,
        zoomOutTool,
        undoTool,
        redoTool,
        menus = editor.menus;

    function getCommandChain() {
        var group = viewer.getGroup(),
            chain;
        if (group) {
            chain = group.commandChain;
        }
        return chain;
    }

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
    // undo
    undoTool = new MenuItem(
        function () {
            var chain = getCommandChain(),
                msg = chain ? chain.getUndoMessage() : '';
            return 'Undo ' + (msg || '');
        },
        function () {
            getCommandChain().undo();
        },
        null,
        null,
        null,
        function () {
            var chain = getCommandChain(),
                msg = chain ? chain.getUndoMessage() : '';
            return msg !== null;
        }
    );
    // redo
    redoTool = new MenuItem(
        function () {
            var chain = getCommandChain(),
                msg = chain ? chain.getRedoMessage() : '';
            return 'Redo ' + (msg || '');
        },
        function () {
            getCommandChain().redo();
        },
        null,
        null,
        null,
        function () {
            var chain = getCommandChain(),
                msg = chain ? chain.getRedoMessage() : '';
            return msg !== null;
        }
    );      
    // redo
    menus.tool.push(selectTool, drawTool, zoomInTool, zoomOutTool);
    menus.edit.push(undoTool, redoTool);
};
