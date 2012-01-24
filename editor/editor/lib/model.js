/**
    model.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var edit = require('./edit');
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
    this.commandChain = new (edit.CommandChain)();
    this.documentData = documentData;
}
// these are getters (stuff that inspect the Group model)
Group.prototype.getCommandChain = function () {
    return this.commandChain;
};
// these are the commands (stuff that actually modifies the Group model)
/**
    Adds a new position to the model.
*/
Group.prototype.cmdAddPosition = function (name, position) {
    var that = this;
    this.commandChain.doCommand(
        function () {
            var documentData = that.documentData;
            documentData.positions[name] = position;
        },
        function () {
            var documentData = that.documentData;
            delete documentData.positions[name];
        },
        "Add position " + name,
        { model: this, name: name, position: position }
    );
};
Group.prototype.cmdRemovePosition = function (name) {
    var that = this,
        position;
    this.commandChain.doCommand(
        function () {            
            var documentData = that.documentData;
            position = documentData.positions[name];
            delete documentData.positions[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.positions[name] = position;
        },
        "Remove position " + name,
        { model: this, name: name, position: position }
    );
};
Group.prototype.cmdUpdatePosition = function (name, position) {
    var that = this;
    this.commandChain.doCommand(
        function () {
            var newpos = position,
                documentData = that.documentData,
                postion = documentData.positions[name];
            documentData.positions[name] = newpos;
        },
        function () {
            var newpos = position,
                documentData = that.documentData,
                postion = documentData.positions[name];
            documentData.positions[name] = newpos;
        },
        "Update position " + name,
        { model: this, name: name, position: position }
    );
};
Group.prototype.cmdRenamePosition = function (name, newname) {
    var that = this;
    this.commandChain.doCommand(
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
        "Rename position " + name + ' as ' + newname,
        { model: this, name: name, newname: newname }
    );
    
};


/**
    Adds a new visual to the model.
*/
Group.prototype.cmdAddVisual = function (name, visual) {
    var that = this;
    this.commandChain.doCommand(
        function () {
            var documentData = that.documentData;
            documentData.children[name] = visual;
        },
        function () {
            var documentData = that.documentData;
            delete documentData.children[name];
        },
        "Add visual " + name,
        { model: this, name: name, visual: visual }
    );
};
Group.prototype.cmdRemoveVisual = function (name) {
    var that = this,
        visual;
    this.commandChain.doCommand(
        function () {            
            var documentData = that.documentData;
            visual = documentData.children[name];
            delete documentData.children[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.children[name] = visual;
        },
        "Remove visual " + name,
        { model: this, name: name, visual: visual }
    );
};
Group.prototype.cmdUpdateVisual = function (name, visual) {
    var that = this;
    this.commandChain.doCommand(
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
        "Update visual " + name,
        { model: this, name: name, visual: visual }
    );
};
Group.prototype.cmdRenameVisual = function (name, newname) {
    var that = this;
    this.commandChain.doCommand(
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
        "Rename visual " + name + ' as ' + newname,
        { model: this, name: name, newname: newname }
    );    
};

///////////////////////
Group.prototype.cmdSetDimensions = function (dimensions) {
    var that = this;
    this.commandChain.doCommand(
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
        "Set dimensions",
        { model: this, dimensions: dimensions }
    );
};


/**
    The master document is consituted of many different groups.
*/
function Document() {
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
};
exports.Group = Group;
exports.Document = Document;
