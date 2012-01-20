exports.setup = function (editor) {
    editor.addTool(
        'editor/lib/plugin/select.png',
        function () {
            console.log('selected');
        },
        function () {
            console.log('deSelected');
        }
    );
    editor.addTool(
        'editor/lib/plugin/select.png',
        function () {
            console.log('selected');
        },
        function () {
            console.log('deSelected');
        }
    );
};
