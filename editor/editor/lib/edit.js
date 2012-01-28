/**
    edit.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

var events = require('events');
function Command(doCmd, undoCmd, name, message, hint) {
    this.doCmd = doCmd;
    this.undoCmd = undoCmd;
    this.name = name;
    this.message = message;
    this.hint = hint;
}
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

/**
    A command chain can do/undo/redo and emits do/undo/redo events while doing
    so.
*/
function CommandChain() {
    events.EventEmitter.call(this);
    this.commands = [];
    this.undoneCommands = [];
}
CommandChain.prototype = new (events.EventEmitter)(); 
CommandChain.prototype.doCommand = function (cmd) {
    this.commands.push(cmd);
    this.undoneCommands = [];
    cmd.doCmd();
    this.emit('do', cmd.name, cmd.message, cmd.hint);
};
CommandChain.prototype.undo = function () {
    if (this.commands.length > 0) {
        var cmd = this.commands.pop();
        this.undoneCommands.push(cmd);
        cmd.undoCmd();
        this.emit('undo', cmd.name, cmd.message, cmd.hint);
    }
};
CommandChain.prototype.redo = function () {
    if (this.undoneCommands.length > 0) {
        var cmd = this.undoneCommands.pop();
        this.commands.push(cmd);
        cmd.doCmd();
        this.emit('redo', cmd.name, cmd.message, cmd.hint);
    }
};
CommandChain.prototype.getUndoMessage = function () {
    var commands = this.commands,
        l = commands.length;
    if (l > 0) {
        return commands[l - 1];
    }
    return null;
};
CommandChain.prototype.getRedoMessage = function () {
    var commands = this.undoneCommands,
        l = commands.length;
    if (l > 0) {
        return commands[l - 1];
    }
    return null;
};
exports.Command = Command;
exports.CommandGroup = CommandGroup;
exports.CommandChain = CommandChain;

