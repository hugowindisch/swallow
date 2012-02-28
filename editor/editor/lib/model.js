/**
    model.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var glmatrix = require('glmatrix'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
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
                    layer: 0,
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
                    layer: 1,
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
    this.normalizeChildrenOrders();
}
// these are getters (stuff that inspect the Group model)
Group.prototype.getCommandChain = function () {
    return this.commandChain;
};

Group.prototype.normalizeChildrenOrders = function () {
    var d = [], i, l, di, children = this.documentData.children;
    // collect
    forEachProperty(children, function (o, name) {
        d.push({name: name, order: o.order});
    });
    // sort
    d.sort(function (o1, o2) {
        return o1.order - o2.order;
    });
    // redistribute
    l = d.length;
    for (i = 0; i < l; i += 1) {
        di = d[i];
        children[di.name].order = i;
    }
};

// makes a name unique
function makeUniqueName(radical, test) {
    var re = /[0-9]$/,
        term = re.exec(radical),
        tl = term ? term.length : 0,
        rad = radical.slice(0, -tl),
        r = rad,
        n = 0;
        
    while (test(r)) {
        r = rad + String(n);
        n += 1;
    }
    return r;
}

// these are the commands (stuff that actually modifies the Group model)
Group.prototype.getUniquePositionName = function (radical, optionalCheck) {
    var positions = this.documentData.positions;
    radical = radical || 'pos';
    return makeUniqueName(
        radical,
        function (r) {
            return positions[r] !== undefined  || (optionalCheck && optionalCheck(r));
        }
    );
};

Group.prototype.getUniqueVisualName = function (radical, optionalCheck) {
    var children = this.documentData.children;
    radical = radical || 'vis';
    return makeUniqueName(
        radical,
        function (r) {
            return children[r] !== undefined || (optionalCheck && optionalCheck(r));
        }
    );
};

Group.prototype.getNumberOfPositions = function () {
    var n = 0;
    forEachProperty(this.documentData.children, function () {
        n += 1;
    });
    return n;
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
            forEachProperty(documentData.children, function (c) {
                if (c.position === name) {
                    c.position = newname;
                }
            });
            delete documentData.positions[name];
        },
        function () {
            var documentData = that.documentData;
            documentData.positions[name] = documentData.positions[newname];
            forEachProperty(documentData.children, function (c) {
                if (c.position === newname) {
                    c.position = name;
                }
            });
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
Group.prototype.cmdSetVisualConfig = function (name, config) {
    var documentData = this.documentData,
        oldConfig = documentData.children[name].config;
    return new Command(
        function () {
            documentData.children[name].config = config;
        },
        function () {
            documentData.children[name].config = oldConfig;
        },
        'cmdSetVisualConfig',
        'Set visual config ' + name,
        { model: this, name: name }
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
Group.prototype.cmdSetVisualOrder = function (nameOrderMap, message) {
    var children = this.documentData.children,
        nom = {};
    forEachProperty(children, function (c, name) {
        if (nameOrderMap[name] !== undefined) {
            nom[name] = c.order;
        }
    });
    return new Command(
        function () {
            var child;
            forEachProperty(nameOrderMap, function (order, n) {
                child = children[n];
                if (child) {
                    child.order = order;
                }
            });
        },
        function () {
            var child;
            forEachProperty(nom, function (order, n) {
                child = children[n];
                if (child) {
                    child.order = order;
                }
            });
        },
        'cmdSetVisualOrder',
        message || "Set visual order",
        { model: this }
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

exports.Group = Group;

