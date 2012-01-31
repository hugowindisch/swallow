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
    menuitem = require('./menuitem');

exports.Toolbar = require('./toolbar').Toolbar;
exports.VerticalMenu = require('./verticalmenu').VerticalMenu;
exports.HorizontalMenu = require('./horizontalmenu').HorizontalMenu;
exports.Folder = require('./folder').Folder;
exports.MenuItem = menuitem.MenuItem;
exports.Accelerator = menuitem.Accelerator;

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

(function () {
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
}());


