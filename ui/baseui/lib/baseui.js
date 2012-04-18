/**
    baseui.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/


/*

Tools in toolbars are just a different representation of items in menus

MenuItem
    - getText
    - getKey
    - getAccelerator
    - getIcon
    - getType
        - checked
        - submenu
    - getSubMenu
    - getCheckedState
    - getCheckedType (radio | check)

    Fires:
        'changed'
        'selected'

HorizontalMenu

VerticalMenu

Toolbar (just a different way of representing menu items)

*/

var domvisual = require('domvisual'),
    menuitem = require('./menuitem'),
    glmatrix = require('glmatrix');

exports.Toolbar = require('./toolbar').Toolbar;
exports.VerticalMenu = require('./verticalmenu').VerticalMenu;
exports.HorizontalMenu = require('./horizontalmenu').HorizontalMenu;
exports.Folder = require('./folder').Folder;
exports.Theme = require('./theme').Theme;
exports.Button = require('./button').Button;
exports.ImagePicker = require('./imagepicker').ImagePicker;
exports.MenuItem = menuitem.MenuItem;
exports.Accelerator = menuitem.Accelerator;
exports.Label = require('./label').Label;
exports.Input = require('./input').Input;
exports.Slider = require('./slider').Slider;

// note: this should be last
// we want this to be able to run as a standalone application
/**(function () {
    var MenuItem = exports.MenuItem,
        HorizontalMenu = exports.HorizontalMenu,
        Accelerator = exports.Accelerator,
        subMenu3 = [
            new MenuItem("SubSubItem1", null, null, null, null, false),
            new MenuItem("SubSubItem2", null, null, null, null, false)
        ],
        subMenu2 = [
            new MenuItem("SubSubItem1", function () { alert('ss1'); }),
            new MenuItem("SubSubItem2", null, subMenu3)
        ],
        subMenu = [
            new MenuItem("SubItem1", function () { alert('sub1'); }, null, new Accelerator('VK_A', false, false, true)),
            new MenuItem("SubItem.....2", null, null, null, null, false),
            new MenuItem("SubItem3", null, subMenu2)
        ];
    if (require.main === module) {
        domvisual.createFullScreenApplication(new HorizontalMenu({
            items: [
                new MenuItem("Item1"),
                new MenuItem("Item2", null, subMenu3),
                new MenuItem("Item3", null, subMenu)
            ]
        }));
    }
}());*/

/*(function () {
    var Folder = exports.Folder;
    if (require.main === module) {
        domvisual.createFullScreenApplication(new Folder({
            text: "hello",
            internal: {
                factory: 'baseui',
                type: 'Folder',
                config: { text: 'another', internal: { factory: 'domvisual', type: 'DOMElement' } }
            }
        }));
    }
}());*/


(function () {
    var Button = exports.Button,
        root,
        but,
        label,
        input,
        folder,
        imagePicker,
        MenuItem = exports.MenuItem,
        Folder = exports.Folder,
        ImagePicker = exports.ImagePicker,
        HorizontalMenu = exports.HorizontalMenu,
        Accelerator = exports.Accelerator,
        Toolbar = exports.Toolbar,
        subMenu3 = [
            new MenuItem("SubSubItem1", null, null, null, 'http://cdn1.iconfinder.com/data/icons/orb/16/10.png', false),
            new MenuItem("SubSubItem2", null, null, null, 'http://cdn1.iconfinder.com/data/icons/orb/16/10.png', true),
            new MenuItem("SubSubItem2", null, null, null, 'http://cdn1.iconfinder.com/data/icons/orb/16/10.png', true, true)
        ],
        subMenu2 = [
            new MenuItem("SubSubItem1", function () { alert('ss1'); }),
            new MenuItem("SubSubItem2", null, subMenu3)
        ],
        subMenu = [
            new MenuItem("SubItem1", function () { alert('sub1'); }, null, new Accelerator('VK_A', false, false, true)),
            new MenuItem("SubItem.....2", null, null, null, null, false),
            new MenuItem("SubItem3", null, subMenu2)
        ],
        men,
        tb;

    if (require.main === module) {
        root = new (domvisual.DOMElement)({});
        // button
        but = new Button({text: "Hello!!!"});
        but.setMatrix(glmatrix.mat4.translate(glmatrix.mat4.identity(), [ 100, 100, 0]));
        but.setDimensions([100, 32, 1]);
        root.addChild(but, 'but');

        // menu
        men = new HorizontalMenu({
            items: [
                new MenuItem("Item1"),
                new MenuItem("Item2", null, subMenu3),
                new MenuItem("Item3", null, subMenu)
            ]
        });
        men.setMatrix(glmatrix.mat4.translate(glmatrix.mat4.identity(), [ 100, 300, 0]));
        men.setDimensions([500, 20, 1]);
        root.addChild(men, 'men');

        // toolbar
        tb = new Toolbar({ items: subMenu3});
        tb.setMatrix(glmatrix.mat4.translate(glmatrix.mat4.identity(), [ 100, 200, 0]));
        tb.setDimensions([200, 32, 1]);
        root.addChild(tb, 'tb');

        // label
        label = new (exports.Label)({ text: 'a label'});
        label.setMatrix(glmatrix.mat4.translate(glmatrix.mat4.identity(), [ 100, 400, 0]));
        label.setDimensions([200, 32, 1]);
        root.addChild(label, 'label');

        // input
        input = new (exports.Input)({ text: 'a label'});
        input.setMatrix(glmatrix.mat4.translate(glmatrix.mat4.identity(), [ 100, 450, 0]));
        input.setDimensions([200, 32, 1]);
        root.addChild(input, 'input');

        // folder
        folder = new Folder({
            text: "hello",
            internal: {
                factory: 'baseui',
                type: 'Folder',
                config: { text: 'another', internal: { factory: 'domvisual', type: 'DOMElement' } }
            }
        });
        folder.setMatrix(glmatrix.mat4.translate(glmatrix.mat4.identity(), [ 100, 500, 0]));
        folder.setDimensions([200, 200, 1]);
        root.addChild(folder, 'folder');

        // image picker
        imagePicker = new ImagePicker({urls: [
            'http://cdn1.iconfinder.com/data/icons/orb/16/10.png',
            'http://cdn1.iconfinder.com/data/icons/orb/16/10.png']});
        imagePicker.setMatrix(glmatrix.mat4.translate(glmatrix.mat4.identity(), [ 500, 500, 0]));
        imagePicker.setDimensions([400, 40, 1]);
        root.addChild(imagePicker, 'imagePicker');

        // go!
        domvisual.createFullScreenApplication(root);
    }
}());
