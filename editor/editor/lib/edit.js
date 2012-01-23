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
CommandChain.prototype.doCommand = function (
    doCmd,
    undoCmd,
    name,
    message,
    hint
) {
    this.commands.push(new Command(doCmd, undoCmd, message, hint));
    this.undoneCommands = [];
    doCmd(hint);
    this.emit('do', name, message, hint);
};
CommandChain.prototype.undo = function () {
    if (this.commands.length > 0) {
        var cmd = this.commands.pop(),
            hint = cmd.hint;
        this.undoneCommands.push(cmd);
        cmd.undoCmd(hint);
        this.emit('undo', cmd.name, cmd.message, hint);
    }
};
CommandChain.prototype.redo = function () {
    if (this.undoneCommands.length > 0) {
        var cmd = this.undoneCommands.pop(),
            hint = cmd.hint;
        this.commands.push(cmd);
        cmd.doCmd(hint);
        this.emit('redo', cmd.name, cmd.message, hint);
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
exports.CommandChain = CommandChain;

