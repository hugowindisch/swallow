exports.setup = function (editor) {
    var toolbox = editor.getToolbox(),
        viewer = editor.getViewer();
// MODAL TOOLS HAVE 2 FUNCTIONS
// Ultimately: everything that is in the menus should be a tool
// all tools should be in the menus
// some tools should be in the toolbox
    // select
    toolbox.addTool(
        'editor/lib/plugin/select.png',
        'select',
        function (fcnPopTool) {
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
        function () {
        }
    );
    // paint
    toolbox.addTool(
        'editor/lib/plugin/select.png',
        'paint',
        function (fcnPopTool) {
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
        function () {
        }
    );
    // zoom rect
    toolbox.addTool(
        'editor/lib/plugin/select.png',
        'zoom',
        function (fcnPopTool) {
            viewer.enableBoxSelection(
                null,
                null,
                function (mat, nmat) {
                    viewer.pushZoom(nmat);
                    fcnPopTool();
                }
            );
        },
        function () {
        }
    );
    // zoom out
    toolbox.addTool(
        'editor/lib/plugin/select.png',
        'zoom',
        function (fcnPopTool) {
            viewer.popZoom();
        }
    );
    
};
