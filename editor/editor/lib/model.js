/**
    model.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
var glmatrix = require('glmatrix'),
    utils = require('utils'),
    visual = require('visual'),
    Theme = visual.Theme,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    deepCopy = utils.deepCopy,
    isString = utils.isString,
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
                    order: 0,
                    matrix: [ 200, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 0 ],
                    scalemode: 'distort'
                },
                viewer: {
                    order: 1,
                    matrix: [ 440, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   200, 0, 0, 0 ],
                    scalemode: 'distort'
                }
            },
            children: {
                toolbox: {
                    factory: "editor",
                    type: "Toolbox",
                    position: "toolbox",
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
                    config: {
                        "domvisual.DOMVisual": {
                            "cssClass": [ "viewer" ]
                        }
                    }
                }
            }
        }

*/
function Group(documentData, docInfo) {
    documentData = documentData || { positions: {}, children: {}, dimensions: [300, 300, 0]};
    this.commandChain = new CommandChain();
    this.documentData = documentData;
    this.docInfo = docInfo;
    this.normalizeDocument();
    this.normalizeOrders();
}
// these are getters (stuff that inspect the Group model)
Group.prototype.getCommandChain = function () {
    return this.commandChain;
};
/**
    Repair any anomalies in the document format.
*/
Group.prototype.normalizeDocument = function () {
    var d = this.documentData;
    if (!d.gridSize) {
        d.gridSize = 8;
    }
    if (!d.dimensions) {
        d.dimensions = [ 800, 600, 1 ];
    }
    if (!d.positions) {
        d.positions = {};
    }
    if (!d.children) {
        d.children = {};
    }
    if (!d.theme) {
        d.theme = {};
    }
};
/**
    Fixes z orders.
*/
Group.prototype.normalizeOrders = function () {
    var d = [], i, l, di, positions = this.documentData.positions;
    // collect
    forEachProperty(positions, function (o, name) {
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
        positions[di.name].order = i;
    }
};

// makes a name unique
function makeUniqueName(radical, test) {
    var re = /[0-9]$/,
        term = re.exec(radical),
        tl = term ? term[0].length : 0,
        rad = term ? radical.slice(0, -term[0].length) : radical,
        r = rad,
        n = 0;
    while (test(r)) {
        r = rad + String(n);
        n += 1;
    }
    return r;
}

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

Group.prototype.getUniqueStyleName = function (radical, optionalCheck) {
    var theme = this.documentData.theme;
    radical = radical || 'style';
    return makeUniqueName(
        radical,
        function (r) {
            return theme[r] !== undefined || (optionalCheck && optionalCheck(r));
        }
    );
};


Group.prototype.getNumberOfPositions = function () {
    var n = 0;
    forEachProperty(this.documentData.positions, function () {
        n += 1;
    });
    return n;
};

Group.prototype.getTopmostOrder = function () {
    var order = 0;
    forEachProperty(this.documentData.positions, function (c) {
        if (c.order >= order) {
            order = c.order + 1;
        }
    });
    return order;
};
/*
    It is difficult to preview the styles in the editor. Why? because
    the style sheets have references to factories (a factory may have a
    style sheet) while the factory of the type being edited does not
    really exist. The styling system was not designed to be edited easily,
    it was designed for being used.

    So, we need to somehow trick things and this function does that. It will
    create a style sheet that matches the current documentData and that
    resolves inner depdendencies correctly. This could break if the styling
    system changes.

    Also note that this function is called by the group viewer that maintains
    a valid local theme at all times (that can be used by other ui elements).

    Also note that we don't support multiple inner bindings at this time
    but that they are theoretically possible.
*/
Group.prototype.createBoundThemeFromData = function (optionalSkin) {
    optionalSkin = optionalSkin || deepCopy(this.documentData.theme);
    var theme = new Theme(optionalSkin),
        docInfo = this.docInfo,
        docFactory = docInfo.factory,
        docType = docInfo.type;
    forEachProperty(theme, function (s, name) {
        var bindings = [];
        if (s.basedOn) {
            forEach(s.basedOn, function (sref) {
                if (sref.factory === docFactory && sref.type === docType) {
                    bindings.push({theme: theme, style: sref.style});
                }
            });
        }
        if (bindings.length > 0) {
            s.bindings = bindings;
            delete s.basedOn;
        }
    });
    return theme;
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
Group.prototype.cmdEnableSelectPosition = function (name, enable) {
    var that = this,
        prev = this.documentData.positions[name].enableSelect;
    return new Command(
        function () {
            that.documentData.positions[name].enableSelect = enable;
        },
        function () {
            that.documentData.positions[name].enableSelect = prev;
        },
        'cmdEnableSelectPosition',
        'Enable Selection ' + name + ' ' + enable,
        { model: this, name: name, enable: enable }
    );
};
Group.prototype.cmdEnableDisplayPosition = function (name, enable) {
    var that = this,
        prev = this.documentData.positions[name].enableDisplay;
    return new Command(
        function () {
            that.documentData.positions[name].enableDisplay = enable;
        },
        function () {
            that.documentData.positions[name].enableDisplay = prev;
        },
        'cmdEnableDisplayPosition',
        'Enable Display ' + name + ' ' + enable,
        { model: this, name: name, enable: enable }
    );
};
Group.prototype.cmdSetPositionSnapping = function (name, snapping) {
    var that = this,
        prev = {};
    return new Command(
        function () {
            var cs = that.documentData.positions[name].snapping;
            forEachProperty(snapping, function (s, n) {
                var csn = cs[n];
                // this allows to force consistency (always having 2 things snapped out of 3)
                if (s === 'snap') {
                    if (csn !== 'px' && csn !== '%') {
                        prev[n] = csn;
                        cs[n] = 'px';
                    }
                } else if (s !== 'unknown') {
                    prev[n] = cs[n] ? cs[n] : 'unknown';
                    cs[n] = s;
                }
            });
        },
        function () {
            forEachProperty(prev, function (s, n) {
                var cs = that.documentData.positions[name].snapping;
                if (s !== 'unknown') {
                    cs[n] = s;
                } else {
                    delete cs[n];
                }
            });
        },
        'cmdSetPositionSnapping',
        'Set Snapping ' + name,
        { model: this, name: name }
    );
};
Group.prototype.cmdSetPositionOpacity = function (name, opacity) {
    var that = this,
        prev;
    function swap() {
        var pos = that.documentData.positions[name];
        prev = pos.opacity;
        if (opacity === null || opacity === undefined || opacity >= 1) {
            delete pos.opacity;
        } else {
            pos.opacity = opacity;
        }
        opacity = prev;
    }
    return new Command(
        swap,
        swap,
        'cmdSetPositionOpacity',
        'Set Opacity ' + name,
        { model: this, name: name }
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
    var positions = this.documentData.positions,
        nom = {};
    forEachProperty(positions, function (c, name) {
        if (nameOrderMap[name] !== undefined) {
            nom[name] = c.order;
        }
    });
    return new Command(
        function () {
            var pos;
            forEachProperty(nameOrderMap, function (order, n) {
                pos = positions[n];
                if (pos) {
                    pos.order = order;
                }
            });
        },
        function () {
            var pos;
            forEachProperty(nom, function (order, n) {
                pos = positions[n];
                if (pos) {
                    pos.order = order;
                }
            });
        },
        'cmdSetVisualOrder',
        message || "Set visual order",
        { model: this }
    );

};

///////////////////////
Group.prototype.cmdSetComponentProperties = function (dimensions, description, priv, gridSize, privateStyles) {
    var that = this;
    function doUndo() {
        var documentData = that.documentData,
            dim = documentData.dimensions,
            descr = documentData.description,
            gs = documentData.gridSize,
            prv = documentData.private,
            prvStyles = documentData.privateStyles;
        documentData.dimensions = dimensions;
        documentData.description = description;
        documentData.private = priv;
        documentData.privateStyles = privateStyles;
        documentData.gridSize = gridSize;
        dimensions = dim;
        description = descr;
        priv = prv;
        privateStyles = prvStyles;
        gridSize = gs;
    }
    return new Command(
        doUndo,
        doUndo,
        'cmdSetComponentProperties',
        'Set component properties',
        { model: this, dimensions: dimensions }
    );
};

////////////////////////////
// styles

Group.prototype.cmdAddStyle = function (name, def) {
    var that = this;
    def = def || { jsData: {} };
    return new Command(
        function () {
            var documentData = that.documentData,
                theme = documentData.theme;
            theme[name] = def;
        },
        function () {
            var documentData = that.documentData,
                theme = documentData.theme;
            delete theme[name];
        },
        'cmdAddStyle',
        'Add Style ' + name,
        { model: this, name: name }
    );
};
Group.prototype.cmdRemoveStyle = function (name) {
    var that = this,
        prev;
    return new Command(
        function () {
            var documentData = that.documentData,
                theme = documentData.theme;
            prev = theme[name];
            delete theme[name];
        },
        function () {
            var documentData = that.documentData,
                theme = documentData.theme;
            theme[name] = prev;
        },
        'cmdRemoveStyle',
        'Remove Style ' + name,
        { model: this, name: name }
    );
};

/*
    This is pretty ugly and twisted but... don't know how to do it differently
    at this time
*/
function forEachStyleConfig(visFactory, visType, fcn) {
    var f = require(visFactory),
        sheet = f[visType].prototype.getConfigurationSheet.call(null);
    forEachProperty(sheet, function (prop, propName) {
        if (prop && prop.isStyleConfig === true) {
            fcn(propName);
        }
    });
}

Group.prototype.cmdRemoveStyleAndReferences = function (factory, type, style) {
    var that = this,
        documentData = this.documentData,
        cmdGroup = this.cmdCommandGroup('cmdRemoveStyleAndReferences', 'Remove Style ' + name, { model: this, name: name});
    // remove all references to this style from visuals
    forEachProperty(documentData.children, function (c, childName) {
        var config = deepCopy(c.config),
            change = false;
        forEachStyleConfig(c.factory, c.type, function (prop) {
            var s = config[prop];
            if (isString(s)) {
                if (s === style) {
                    change = true;
                    delete config[prop];
                }
            } else if (s.factory === factory && s.type === type && s.style === style) {
                change = true;
                delete config[prop];
            }
        });
        if (change) {
            cmdGroup.add(that.cmdSetVisualConfig(childName, config));
        }
    });
    // remove all references to this style from other styles
    forEachProperty(documentData.theme, function (s, sName) {
        var basedOn = s.basedOn;
        if (basedOn) {
            forEach(basedOn, function (b) {
                if (b.factory === factory && b.type === type && b.style === style) {
                    cmdGroup.add(that.cmdUnsetStyleBase(sName, factory, type, style));
                }
            });
        }
    });
    // remove the style
    cmdGroup.add(that.cmdRemoveStyle(style));

    // return the command group
    return cmdGroup;

};
Group.prototype.cmdRenameStyleAndReferences = function (name, factory, type, newname) {
    var that = this,
        oldname = name;
    function toggleNames() {
        var documentData = that.documentData,
            theme = documentData.theme,
            style = theme[oldname],
            n;
        delete theme[oldname];
        theme[newname] = style;

        // do this in the children too
        forEachProperty(documentData.children, function (c) {
            var config = c.config;
            forEachStyleConfig(c.factory, c.type, function (prop) {
                var s = config[prop];
                if (isString(s)) {
                    if (s === oldname) {
                        config[prop] = newname;
                    }
                } else {
                    if (s.factory === factory && s.type === type && s.style === oldname) {
                        config[prop].style = newname;
                    }
                }
            });
        });
        // and do this in references to other styles (basedOn) within this
        // document
        forEachProperty(documentData.theme, function (t) {
            var basedOn = t.basedOn;
            if (basedOn) {
                forEach(basedOn, function (tType) {
                    if (tType.factory === factory && tType.type === type && tType.style === oldname) {
                        tType.name = newname;
                    }
                });
            }
        });

        // swap names
        n = oldname;
        oldname = newname;
        newname = n;
    }
    return new Command(
        toggleNames,
        toggleNames,
        'cmdRenameStyle',
        'Rename Style ' + name + ' to ' + newname,
        { model: this, name: name }
    );
};
// note: use null value for features to clear them and non null to assign them
Group.prototype.cmdSetStyleFeatures = function (name, features) {
    var that = this;
    function toggle() {
        var documentData = that.documentData,
            theme = documentData.theme,
            style = theme[name],
            jsData = style.jsData,
            oldv = {};
        forEachProperty(features, function (v, f) {
            var old = jsData[f];
            oldv[f] = (old === undefined) ? null : old;

            if (v !== null) {
                jsData[f] = v;
            } else {
                delete jsData[f];
            }

        });
        features = oldv;
    }
    return new Command(
        toggle,
        toggle,
        'cmdSetStyleFeatures',
        'Change Style ' + name,
        { model: this, name: name }
    );
};
Group.prototype.cmdSetStyleBase = function (name, baseStyleFactory, baseStyleType, baseStyleName) {
    var that = this,
        basedOn = [{factory: baseStyleFactory, type: baseStyleType, style: baseStyleName}];
    function toggle() {
        var documentData = that.documentData,
            theme = documentData.theme,
            style = theme[name],
            oldb = style.basedOn;
        style.basedOn = basedOn;
        basedOn = oldb;
    }
    return new Command(
        toggle,
        toggle,
        'cmdSetStyleBase',
        'Change Style Base ' + name,
        { model: this, name: name }
    );
};
Group.prototype.cmdUnsetStyleBase = function (name, factory, type, style) {
    var that = this,
        prevBase;
    return new Command(
        function () {
            var documentData = that.documentData,
                theme = documentData.theme,
                style = theme[name],
                basedOn = [];
            prevBase = style.basedOn;
            forEach(style.basedOn, function (s) {
                if (s.factory !== factory || s.type !== type || s.style !== style) {
                    basedOn.push(s);
                }
            });
            style.basedOn = basedOn;
        },
        function () {
            var documentData = that.documentData,
                theme = documentData.theme,
                style = theme[name];
            style.basedOn = prevBase;
        },
        'cmdUnsetStyleBase',
        'Remove Style Base',
        { model: this, name: name }
    );
};
exports.Group = Group;
