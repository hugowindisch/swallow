/**
    menuitem.js
    Copyright (C) 2012 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.

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
    ctrlk,
    altk,
    metak,
    shiftk
) {
    this.vkCode = vkCode;
    this.altk = Boolean(altk);
    this.shiftk = Boolean(shiftk);
    this.ctrlk = Boolean(ctrlk);
    this.metak = Boolean(metak);
}

Accelerator.prototype.toKeyString = function () {
    return makeKeyString(
        this.vkCode,
        this.ctrlk,
        this.altk,
        this.metak,
        this.shiftk
    );
};

Accelerator.prototype.toDecoratedVk = function () {
    return decorateVk(
        this.vkCode,
        this.ctrlk,
        this.altk,
        this.metak,
        this.shiftk
    );
};

// it is fundamentally here that internationalization will be implemented
// for menus
function MenuItem(
    text,
    action,
    subMenu,        // null, array of items, function
    accelerator,
    icon,
    enabled,        // null, array of items, function
                    // (note: defaults to true if undefined)
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
    return this;
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
    return this;
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
    return this;
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
    return this;
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
    return this;
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
    return this;
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
    return this;
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
    return this;
};

MenuItem.prototype.getCheckedMode = function () {
    return this.checkedMode;
};

exports.MenuItem = MenuItem;
exports.Accelerator = Accelerator;
