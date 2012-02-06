var baseui = require('baseui'),
    MenuItem = baseui.MenuItem;
    
exports.setup = function (editor) {
    var viewer = editor.getViewer(),
        selectedTool,
        selectTool,
        drawTool,
        zoomInTool,
        zoomOutTool;

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
        null,        // null, array of items, function
        null,
        'editor/lib/plugin/select.png',    
        true,        // null, array of items, function (note: defaults to true if undefined)
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
        null,        // null, array of items, function
        null,
        'editor/lib/plugin/draw.png',    
        true,        // null, array of items, function (note: defaults to true if undefined)
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
        null,        // null, array of items, function
        null,
        'editor/lib/plugin/zoomin.png',    
        true,        // null, array of items, function (note: defaults to true if undefined)
        function () {
            return selectedTool === this;
        }   // null, true, false, function
    );
    // zoom out tool (magnifier -)
    zoomOutTool = new MenuItem(
        'Zoom Out',
        function () {
            viewer.popZoom();            
        },
        null,        // null, array of items, function
        null,
        'editor/lib/plugin/zoomout.png',    
        true
    );
    editor.toolbar.push(selectTool, drawTool, zoomInTool, zoomOutTool);
};
