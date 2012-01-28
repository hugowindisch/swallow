/**
    model.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var glmatrix = require('glmatrix'),
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    edit = require('./edit'),
    Command = edit.Command,
    CommandGroup = edit.CommandGroup,
    CommandChain = edit.CommandChain;
/**
    A document can have multiple groups. Each of them have an independent
    command chain.
    
    This is the format of the data we edit:    
        {
            dimensions: [ 640, 400, 0],
            positions: {
                toolbox: {
                    type: "TransformPosition",
                    matrix: [ 200, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 0 ],
                    scalemode: 'distort'
                },
                viewer: {
                    type: "TransformPosition",
                    matrix: [ 440, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   200, 0, 0, 0 ],
                    scalemode: 'distort'
                }                
            },
            children: {
                toolbox: {
                    factory: "editor",
                    type: "Toolbox",
                    position: "toolbox",
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "domvisual.DOMVisual": {
                            "cssClass": [ "toolbox" ]
                        }
                    }                
                },
                viewer: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "viewer",
                    enableScaling: false,
                    depth: 1,
                    config: {
                        "domvisual.DOMVisual": {
                            "cssClass": [ "viewer" ]
                        }
                    }                
                }
            }
        }

*/
function Group(documentData) {
    documentData = documentData || { positions: {}, children: {}, dimensions: [300, 300, 0]};
    this.commandChain = new CommandChain();
    this.documentData = documentData;
}
// these are getters (stuff that inspect the Group model)
Group.prototype.getCommandChain = function () {
    return this.commandChain;
};
// these are the commands (stuff that actually modifies the Group model)
Group.prototype.getUniquePositionName = function () {
    var i = 0,
        positions = this.documentData.positions,
        name;
    while (true) {
        name = 'pos' + i;
        if (!positions[name]) {
            return name;
        }
        i += 1;        
    }
    // this point cannot be reached
};
/**
    Calls doCmd on the command chain.
*/
Group.prototype.doCommand = function (cmd) {
    return this.commandChain.doCommand(cmd);
};
/**
    Creates a command group (that allows to atomically perform multiple
    commands at once)
*/
Group.prototype.cmdCommandGroup = function (name, message, hint) {
    return new CommandGroup(name, message, hint);
};
/**
    Adds a new position to the model.
*/
Group.prototype.cmdAddPosition = function (name, position) {
    var that = this;
    return new Command(
        function () {
            var documentData = that.documentData;
            documentData.positions[name] = position;
        },
        function () {
            var documentData = that.documentData;
            delete documentData.positions[name];
        },
        'cmdAddPosition',
        "Add position " + name,
        { model: this, name: name, position: position }
    );
};
Group.prototype.cmdRemovePosition = function (name) {
    var that = this,
        position;
    return new Command(
        function () {            
            var documentData = that.documentData;
            position = documentData.positions[name];
            delete documentData.positions[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.positions[name] = position;
        },
        'cmdRemovePosition',
        "Remove position " + name,
        { model: this, name: name, position: position }
    );
};
Group.prototype.cmdUpdatePosition = function (name, position) {
    var that = this,
        oldPosition = this.documentData.positions[name];
    return new Command(
        function () {
            var documentData = that.documentData;
            documentData.positions[name] = position;
        },
        function () {
            var documentData = that.documentData;
            documentData.positions[name] = oldPosition;
        },
        'cmdUpdatePosition',
        "Update position " + name,
        { model: this, name: name, position: position }
    );
};
Group.prototype.cmdTransformPosition = function (name, transform) {
    var that = this,
        matrix = this.documentData.positions[name].matrix;
    return new Command(
        function () {
            var documentData = that.documentData;
            documentData.positions[name].matrix = mat4.multiply(transform, matrix, mat4.create());
        },
        function () {
            var documentData = that.documentData;
            documentData.positions[name].matrix = matrix;
        },
        'cmdTransformPosition',
        "Transform position " + name,
        { model: this, name: name, transform: transform }
    );
};
Group.prototype.cmdRenamePosition = function (name, newname) {
    var that = this;
    return new Command(
        function () {
            var documentData = that.documentData;
            documentData.positions[newname] = documentData.positions[name];
            delete documentData.positions[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.positions[name] = documentData.positions[newname];
            delete documentData.positions[newname];
        },
        'cmdRenamePosition',
        "Rename position " + name + ' as ' + newname,
        { model: this, name: name, newname: newname }
    );
    
};


/**
    Adds a new visual to the model.
*/
Group.prototype.cmdAddVisual = function (name, visual) {
    var that = this;
    return new Command(
        function () {
            var documentData = that.documentData;
            documentData.children[name] = visual;
        },
        function () {
            var documentData = that.documentData;
            delete documentData.children[name];
        },
        'cmdAddVisual',
        "Add visual " + name,
        { model: this, name: name, visual: visual }
    );
};
Group.prototype.cmdRemoveVisual = function (name) {
    var that = this,
        visual;
    return new Command(
        function () {            
            var documentData = that.documentData;
            visual = documentData.children[name];
            delete documentData.children[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.children[name] = visual;
        },
        'cmdRemoveVisual',
        "Remove visual " + name,
        { model: this, name: name, visual: visual }
    );
};
Group.prototype.cmdUpdateVisual = function (name, visual) {
    var that = this;
    return new Command(
        function () {
            var newpos = visual,
                documentData = that.documentData,
                postion = documentData.children[name];
            documentData.children[name] = newpos;
        },
        function () {
            var newpos = visual,
                documentData = that.documentData,
                postion = documentData.children[name];
            documentData.children[name] = newpos;
        },
        'cmdUpdateVisual',
        "Update visual " + name,
        { model: this, name: name, visual: visual }
    );
};
Group.prototype.cmdRenameVisual = function (name, newname) {
    var that = this;
    return new Command(
        function () {
            var documentData = that.documentData;
            documentData.children[newname] = documentData.children[name];
            delete documentData.children[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.children[name] = documentData.children[newname];
            delete documentData.children[newname];
        },
        'cmdRenameVisual',
        "Rename visual " + name + ' as ' + newname,
        { model: this, name: name, newname: newname }
    );    
};

///////////////////////
Group.prototype.cmdSetDimensions = function (dimensions) {
    var that = this;
    return new Command(
        function () {
            var documentData = that.documentData,
                dim = documentData.dimensionsm;
            documentData.dimensions = dimensions;
            dimensions = dim;
        },
        function () {
            var documentData = that.documentData,
                dim = documentData.dimensions;
            documentData.dimensions = dimensions;
            dimensions = dim;
        },
        'cmdSetDimensions',
        "Set dimensions",
        { model: this, dimensions: dimensions }
    );
};


/**
    The master document is consituted of many different groups.
*/
// we don't want this. we will be editing one group at a time
// that's it one group, one file nothing more.
// there will be many group files in a project
/*function Document() {
    this.commandChain = new (edit.CommandChain)();
    this.documentData = {};
}
// these are getters
Document.prototype.getCommandChain = function () {
    return this.commandChain;
};
// these are the commands (stuff that actually modifies the Group model)
Document.prototype.cmdAddGroup = function (name, group) {
    var that = this;
    this.commandChain.doCommand(
        function () {
            var documentData = that.documentData;
            documentData.groups[name] = group;
        },
        function () {
            var documentData = that.documentData;
            delete documentData.groups[name];
        },
        "Add group " + name,
        { model: this, name: name, group: group }
    );
};
Document.prototype.cmdRemoveGroup = function (name) {
    var that = this,
        group;
    this.commandChain.doCommand(
        function () {            
            var documentData = that.documentData;
            group = documentData.groups[name];
            delete documentData.groups[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.groups[name] = group;
        },
        "Remove group " + name,
        { model: this, name: name, group: group }
    );
};
Document.prototype.cmdRenameGroup = function (name, newname) {
    var that = this;
    this.commandChain.doCommand(
        function () {
            var documentData = that.documentData;
            documentData.groups[newname] = documentData.groups[name];
            delete documentData.groups[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.groups[name] = documentData.groups[newname];
            delete documentData.groups[newname];
        },
        "Rename group " + name + ' as ' + newname,
        { model: this, name: name, newname: newname }
    );    
}; */
exports.Group = Group;

