/**
    menuitem.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var utils = require('utils'),
    domvisual = require('domvisual'),
    events = require('events'),
    makeKeyString = domvisual.makeKeyString,
    decorateVk = domvisual.decorateVk,
    isFunction = utils.isFunction;

// accelerator
function Accelerator(
    vkCode,
    altk,
    shiftk,
    ctrlk,
    metak
) {
    this.vkCode = vkCode;
    this.altk = Boolean(altk);
    this.shiftk = Boolean(shiftk);
    this.ctrlk = Boolean(ctrlk);
    this.metak = Boolean(metak);
}
Accelerator.prototype.toKeyString = function () {
    return makeKeyString(this.vkCode, this.altk, this.shiftk, this.ctrlk, this.metak);
};
Accelerator.prototype.toDecoratedVk = function () {
    return decorateVk(this.vkCode, this.altk, this.shiftk, this.ctrlk, this.metak);  
};
        
// it is fundamentally here that internationalization will be implemented
// for menus
function MenuItem(
    text,
    action,
    subMenu,        // null, array of items, function
    accelerator,
    icon,    
    enabled,        // null, array of items, function (note: defaults to true if undefined)
    checkedState,   // null, true, false, function
    checkedMode     // 'radio', 'check', function returning 'radio' or 'check'
) {
    this.setText(text);
    this.setAction(action);
    this.setAccelerator(accelerator);  
    this.setIcon(icon);
    this.setSubMenu(subMenu);
    this.setEnabled(enabled);
    this.setCheckedState(checkedState);
    this.setCheckedMode(checkedMode);
}
MenuItem.prototype = new (events.EventEmitter)();
MenuItem.prototype.setText = function (text) {
    // text
    if (isFunction(text)) {
        this.getText = text;
    } else {
        this.text = text;
    }
    this.emit('change');
};
MenuItem.prototype.getText = function () {
    return this.text;
};
MenuItem.prototype.setAction = function (action) {
    // action
    if (isFunction(action)) {
        this.actionFcn = action;
    }
    this.emit('change');
};
MenuItem.prototype.action = function () {
    // call the function
    if (this.actionFcn) {
        this.actionFcn();
    }
    // emit an event (this is intentionally after)
    this.emit('action');
};
MenuItem.prototype.setAccelerator = function (accelerator) {
    // accelerator
    if (isFunction(accelerator)) {
        this.getAccelerator = accelerator;
    } else {
        this.accelerator = accelerator;
    }
    this.emit('change');
};
MenuItem.prototype.getAccelerator = function () {
    return this.accelerator;
};
MenuItem.prototype.setIcon = function (icon) {
    // icon
    if (isFunction(icon)) {
        this.getIcon = icon;
    } else {
        this.icon = icon;
    }
    this.emit('change');
};
MenuItem.prototype.getIcon = function () {
    return this.icon;
};
MenuItem.prototype.setEnabled = function (enabled) {
    // enabled
    if (isFunction(enabled)) {
        this.getEnabled = enabled;
    } else {
        this.enabled = (enabled !== false);
    }
    this.emit('change');
};
MenuItem.prototype.getEnabled = function () {
    return this.enabled;
};
MenuItem.prototype.setSubMenu = function (subMenu) {
    // submenu
    if (isFunction(subMenu)) {
        this.getSubMenu = subMenu;
    } else {
        this.subMenu = subMenu;
    }
    this.emit('change');
};
MenuItem.prototype.getSubMenu = function () {
    return this.subMenu;
};
MenuItem.prototype.setCheckedState = function (checkedState) {
    // checked state
    if (isFunction(checkedState)) {
        this.getCheckedState = checkedState;
    } else {
        this.checkedState = checkedState;
    }
    this.emit('change');
};
MenuItem.prototype.getCheckedState = function () {
    return this.checkedState;
};
MenuItem.prototype.setCheckedMode = function (checkedMode) {
    // checked mode
    if (isFunction(checkedMode)) {
        this.getCheckedMode = checkedMode;
    } else {
        checkedMode = checkedMode || 'checked';
        this.checkedMode = checkedMode;
    }
    this.emit('change');
};
MenuItem.prototype.getCheckedMode = function () {
    return this.checkedMode;
};
exports.MenuItem = MenuItem;
exports.Accelerator = Accelerator;

