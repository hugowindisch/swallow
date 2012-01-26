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
            console.log('selected');
            // only modal tools should bother doing this
            viewer.enableBoxSelection(null, null, null);
        },
        function () {
            console.log('deSelected');
        }
    );
    // paint
    toolbox.addTool(
        'editor/lib/plugin/select.png',
        'paint',
        function (fcnPopTool) {
            console.log('selected');
            viewer.enableBoxSelection(
                null,
                null,
                function (mat, nmat) {
                    var group = viewer.getGroup();
                    group.cmdAddPosition(
                        group.getUniquePositionName(),
                        {
                            matrix: mat,
                            type: "AbsolutePosition",
                            snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                        }   
                    );
                }
            );
            
        },
        function () {
            console.log('deSelected');
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
            console.log('deSelected');
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
