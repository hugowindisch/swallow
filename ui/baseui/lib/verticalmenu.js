/**
    verticalmenu.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    isFunction = utils.isFunction;
    

function VerticalMenu(config) {
    var that = this;
    domvisual.DOMElement.call(this, config);

    // Menu variables
    //////////////////
    // we are the top of the menu stack
    this.parentMenu = null;
    this.highlighted = null;
    // set a key handler for accelerators
    this.on('keydown', function (evt) {
        if (!that.children.subMenu) {
            that.handleKey(evt);
        }
    });
}
VerticalMenu.prototype = new (domvisual.DOMElement)();
VerticalMenu.prototype.theme = new (visual.Theme)({
    menuBox: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'menuBox' }
        ]
    },
    menuItem: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'menuItem' }
        ]
    },
    menuItemSelected: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'menuItemSelected' }
        ]
    },
    menuItemDisabled: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'menuItemDisabled' }
        ]
    },
    menuItemSeparator: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'horizontalSeparator' }
        ]
    }
});
/**
    Handles keys
*/
VerticalMenu.prototype.handleKey = function (evt) {
    var nH, maxH = this.numItems, parentMenu = this.parentMenu;
    if (this.highlighted) {
        nH = Number(this.highlighted.name);
        switch (evt.decoratedVk) {
        case 'VK_UP':
            nH -= 1;
            if (nH < 0) {
                nH = maxH - 1; 
            }
            this.highlightItem(String(nH));
            break;
        case 'VK_DOWN':
            nH += 1;
            if (nH === maxH) {
                nH = 0;
            }
            this.highlightItem(String(nH));
            break; 
        case 'VK_LEFT':
            if (this.children.subMenu && this.children.subMenu.highlighted) {
                // highlight it
                this.children.subMenu.highlightItem(null);
            } else if (parentMenu) {
                parentMenu.handleKey(evt);
            }
            break;
        case 'VK_RIGHT':
            if (this.children.subMenu) {
                // highlight it
                this.children.subMenu.highlightItem('0');
            } else if (this.parentMenu) {
                this.parentMenu.handleKey(evt);
            }
            break;
        case 'VK_ENTER':
        case 'VK_SPACE':
        case 'VK_RETURN':
            this.action();
            break;
        case 'VK_ESCAPE':
            this.hideMenuStack();
            break;
        }
    } else if (parentMenu) {
        parentMenu.handleKey(evt);
    }
};
/**
    Performs the action.
*/
VerticalMenu.prototype.action = function () {
    var highlighted = this.highlighted;
    if (highlighted) {
        if (!highlighted.item.getSubMenu()) {
            this.hideMenuStack();
            this.highlighted.item.action();
        }
    }
};
/**
    Hides the whole menu stack
*/
VerticalMenu.prototype.hideMenuStack = function () {
    var parent = this.parentMenu;
    while (parent) {
        parent.highlightItem(null);
        parent = parent.parentMenu;
    }
};
/**
    Highlights an item.
*/
VerticalMenu.prototype.highlightItem = function (itemName) {
    var c,
        table = this.children.table,
        toHighlight,
        subItems,
        subMenu,
        smMat,
        smDim;
    // if some item is already highlighted
    if (this.highlighted) {
        this.highlighted.setStyle('menuItem');
        if (this.children.subMenu) {
            this.removeChild(this.children.subMenu);
        }        
    }
    toHighlight = table.children[itemName];
    if (toHighlight) {
        this.highlighted = toHighlight;    
        toHighlight.setStyle('menuItemSelected');
        // do we have a submenu for this item?
        subItems = toHighlight.item.getSubMenu();
        if (subItems) {
            // we need to create a sub menu
            subMenu = new VerticalMenu({ items: subItems});
            this.addChild(subMenu, 'subMenu');
            subMenu.parentMenu = this;
            // we want to position it semi intelligently                
            smMat = mat4.create(toHighlight.getComputedMatrix());
            smDim = toHighlight.getComputedDimensions();
            smMat[12] += smDim[0];
            subMenu.setMatrix(smMat);
        } else if (this.children.subMenu) {
            this.removeChild(this.children.subMenu);
        }
    } else {
        this.highlighted = null;
    }
};
/**
    It is way easier to create something like this in HTML (because the
    automatic layouting fits this thing so well).
*/
VerticalMenu.prototype.updateChildren = function () {
    // we want to remove all our children
    this.removeAllChildren();
    // we want to create a table that will contain all our items
    this.addHtmlChild(
        'table',
        '',
        {'style': 'menuBox' },
        'table'
    );
    
    // we now want to iterate our items and create children for them
    var items = this.getItems(),
        i,
        l = items.length,
        item,
        numEnabledItems = 0;
    this.numItems = 0;
    for (i = 0; i < l; i += 1) {
        item = items[i];
        if (item === null) {
            this.createSeparator();
        } else {
            numEnabledItems = this.createItemHtml(item, i, numEnabledItems, l);
        }
    }
    this.numItems = numEnabledItems;
};
VerticalMenu.prototype.createSeparator = function () {
    var table = this.children.table,
        c = table.addHtmlChild(
            'tr', 
            '',
            { style: 'menuItem' },
            name
        ),
        line = c.addHtmlChild('td', '', { style: 'menuItemSeparator' });
    line.setElementAttributes({colspan: 4});
    line.addHtmlChild('div', '');

};
VerticalMenu.prototype.createItemHtml = function (item, index, numEnabled, numIndex) {
    var that = this,
        enabled = item.getEnabled(),
        table = this.children.table,
        name = enabled ? String(numEnabled) : "da" + index,
        accel,
        icon,
        radio,
        checked,
        checkimg = item.getCheckedMode() === 'radio' ? 'baseui/lib/menuradio.png' : 'baseui/lib/menucheck.png',
        c = table.addHtmlChild(
            'tr', 
            '',
            { style: enabled ? 'menuItem' : 'menuItemDisabled' },
            name
        );

    if (enabled) {
        numEnabled += 1;
    }
    
    // keep the item
    c.item = item;
    // checked
    checked = item.getCheckedState();
    c.addHtmlChild(
        'td',
        checked ? ('<img src = ' + checkimg + ' ></img>') : '',
        {  },
        'check'
    );
    // icon
    icon = item.getIcon();
    c.addHtmlChild(
        'td',
        icon ? ('<img src = ' + icon + ' ></img>') : '',
        {  },
        'icon'
    );
    
    // add the stuff we want in our row
    c.addTextChild(
        'td',
        item.getText(),
        {  },
        'it'
    );
    // accelerator
    accel = item.getAccelerator();
    c.addTextChild(
        'td',
        accel ? accel.toKeyString() : '',
        {  },
        'accel'
    );
    // to this child we want to add a handler
    if (enabled) {
        c.setCursor('pointer');
        c.on('mouseup', function () {
            that.action();        
        });
        c.on('mouseover', function () {
            // if something is already highlighted
            that.highlightItem(name);
        });
    }
    return numEnabled;
};
VerticalMenu.prototype.setItems = function (items) {
    if (isFunction(items)) {
        this.getItems = items;
    } else {
        this.items = items;
    }
    this.updateChildren();
};
VerticalMenu.prototype.getItems = function () {
    return this.items;
};
VerticalMenu.prototype.getConfigurationSheet = function () {
    return { items: {} };
};
exports.VerticalMenu = VerticalMenu;

