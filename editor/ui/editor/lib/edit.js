/**
    edit.js

    The SwallowApps Editor, an interactive application builder for creating
    html applications.

    Copyright (C) 2012  Hugo Windisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

var events = require('events'),
    utils = require('utils'),
    forEach = utils.forEach;
function Command(doCmd, undoCmd, name, message, hint) {
    this.doCmd = doCmd;
    this.undoCmd = undoCmd;
    this.name = name;
    this.message = message || '';
    this.hint = hint;
}
Command.prototype.getForEachSubCommand = function () {
    return null;
};
Command.prototype.isEmpty = function () {
    return false;
};

function CommandGroup(name, message, hint) {
    this.name = name;
    this.message = message;
    this.hint = hint;
    this.commands = [];
}

CommandGroup.prototype.doCmd = function () {
    var i,
        commands = this.commands,
        l = commands.length;
    for (i = 0; i < l; i += 1) {
        commands[i].doCmd();
    }
};
CommandGroup.prototype.undoCmd = function () {
    var i,
        commands = this.commands,
        l = commands.length;
    for (i = l - 1; i >= 0; i -= 1) {
        commands[i].undoCmd();
    }
};
CommandGroup.prototype.add = function (cmd) {
    this.commands.push(cmd);
    return this;
};
CommandGroup.prototype.getForEachSubCommand = function () {
    var commands = this.commands;
    return function (fcn) {
        forEach(commands, function (c) {
            fcn(c.name, c.message, c.hint, c.getForEachSubCommand());
        });
    };
};
CommandGroup.prototype.isEmpty = function () {
    return this.commands.length === 0;
};


/**
    A command chain can do/undo/redo and emits do/undo/redo events while doing
    so.
*/
function CommandChain() {
    events.EventEmitter.call(this);
    this.commands = [];
    this.undoneCommands = [];
    this.savePoint = null;
}
CommandChain.prototype = new (events.EventEmitter)();
CommandChain.prototype.doCommand = function (cmd) {
    // skip empty groups
    if (!cmd.isEmpty()) {
        this.commands.push(cmd);
        this.undoneCommands = [];
        cmd.doCmd();
        this.emit('command', 'do', cmd.name, cmd.message, cmd.hint, cmd.getForEachSubCommand());
    }
};
CommandChain.prototype.undo = function () {
    if (this.commands.length > 0) {
        var cmd = this.commands.pop();
        this.undoneCommands.push(cmd);
        cmd.undoCmd();
        this.emit('command', 'undo', cmd.name, cmd.message, cmd.hint, cmd.getForEachSubCommand());
    }
};
CommandChain.prototype.redo = function () {
    if (this.undoneCommands.length > 0) {
        var cmd = this.undoneCommands.pop();
        this.commands.push(cmd);
        cmd.doCmd();
        this.emit('command', 'redo', cmd.name, cmd.message, cmd.hint, cmd.getForEachSubCommand());
    }
};
CommandChain.prototype.getUndoMessage = function () {
    var commands = this.commands,
        l = commands.length;
    if (l > 0) {
        return commands[l - 1].message;
    }
    return null;
};
CommandChain.prototype.getRedoMessage = function () {
    var commands = this.undoneCommands,
        l = commands.length;
    if (l > 0) {
        return commands[l - 1].message;
    }
    return null;
};
CommandChain.prototype.setSavePoint = function () {
    var commands = this.commands,
        l = commands.length;
    if (l > 0) {
        this.savePoint = commands[l - 1];
    } else {
        this.savePoint = null;
    }
    this.emit('setSavePoint');
};
CommandChain.prototype.isOnSavePoint = function () {
    var commands = this.commands,
        l = commands.length,
        ret;
    if (l > 0) {
        ret = (this.savePoint === commands[l - 1]);
    } else {
        ret = this.savePoint === null;
    }
    return ret;
};

exports.Command = Command;
exports.CommandGroup = CommandGroup;
exports.CommandChain = CommandChain;
