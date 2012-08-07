/**
    model.js

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
var glmatrix = require('glmatrix'),
    utils = require('utils'),
    visual = require('visual'),
    Theme = visual.Theme,
    Skin = visual.Skin,
    defaultSkin = visual.defaultSkin,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    deepCopy = utils.deepCopy,
    isString = utils.isString,
    isObject = utils.isObject,
    deepEqual = utils.deepEqual,
    prune = utils.prune,
    ensure = utils.ensure,
    ensured = utils.ensured,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    edit = require('./edit'),
    convertScaleToSize = visual.convertScaleToSize,
    Command = edit.Command,
    CommandGroup = edit.CommandGroup,
    CommandChain = edit.CommandChain;
/**
=====
HINTS
=====


Hints that we use:
------------------
    layeringChanged: true
        (when the layering ui element should be regenerated)
    clearSelection: true
        (when the viewer's selection should be cleared)
    name
        (in cmdAddPosition)
    styleChanged
        (some style was changed)

Unused hints should probably be removed to prevent confusion.

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
    if (!d.overflowX) {
        d.overflowX = 'visible';
    }
    if (!d.overflowY) {
        d.overflowY = 'visible';
    }
    this.normalizeDocumentSkin();
};
/**
    Normalizes the skin (removing the skin altoghether if it is empty).
*/
Group.prototype.normalizeDocumentSkin = function () {
    var documentData = this.documentData;
    if (documentData.skin && prune(documentData.skin) === 0) {
        delete documentData.skin;
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
    really exist.

    So, we need to somehow trick things and this function does that.
*/
Group.prototype.createBoundThemeFromData = function (optionalThemeData, optionalSkinData) {
    optionalThemeData = optionalThemeData || deepCopy(this.documentData.theme);
    optionalSkinData = optionalSkinData || deepCopy(this.documentData.skin);

    var docInfo = this.docInfo,
        docFactory = docInfo.factory,
        docType = docInfo.type,
        skin,
        theme;

    // we create a fake skin. This is only a theme resolver, and it will
    // resolve the theme of the currently edited thing, to the theme
    // that we create here.
    function EditedDocumendSkin() {
        this.getTheme = function (factory, type) {
            if (factory === docFactory && docType === type) {
                return theme;
            } else {
                return skin.getTheme(factory, type);
            }
        };
    }

    skin = optionalSkinData ? new Skin(optionalSkinData) : defaultSkin;
    theme = new Theme(optionalThemeData, new EditedDocumendSkin());
    // add a function that will help us display decorations on styles
    theme.getStyleDecoration = function (factory, type, style) {
        var s,
            sdf,
            sdft,
            sdfts,
            bo;
        if (factory === null && type === null) {
            s = optionalThemeData[style];
            if (s && s.basedOn && s.basedOn.length > 0) {
                bo = s.basedOn[0];
                if (bo.factory === docFactory && bo.type === docType) {
                    return 'sublocal';
                }
                return 'subremote';
            }
        } else if (optionalSkinData) {
            sdf = optionalSkinData[factory];
            if (sdf) {
                sdft = sdf[type];
                if (sdft) {
                    sdfts = sdft[style];
                    if (sdfts) {
                        return 'skin';
                    }
                }
            }
        }
        return null;
    };
    return theme;
};

/**
    Creates a selection copy (including the local styles).
*/
Group.prototype.getSnapshot = function (selection) {
    var documentData = this.documentData,
        positions = documentData.positions,
        children = documentData.children,
        res = {
            positions: {},
            children: {},
            theme: documentData.theme,
            docInfo: this.docInfo
        },
        c;
    forEachProperty(selection, function (p, n) {
        c = children[n];
        res.positions[n] = p;
        if (c) {
            res.children[n] = c;
        }
    });
    return JSON.stringify(res);
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

/**
    Pastes a selection copy, potentially regenerating the styles.
    (dealing with the styles is the more complicated part)
*/
Group.prototype.pasteSnapshot = function (str, inPlace) {
    str = String(str);
    var that = this,
        clipboardData,
        documentData = this.documentData,
        children = documentData.children,
        c,
        positions = documentData.positions,
        cmdGroup = this.cmdCommandGroup('cmdPaste', 'Paste', { clearSelection: true }),
        order = this.getTopmostOrder(),
        minorder,
        offset,
        posmap = {},
        usedmap = {},
        usedStyleMap = {};
    // silently ignore crap
    try {
        clipboardData = JSON.parse(str);
    } catch (e) {
        return;
    }
    if (!(clipboardData.children && clipboardData.positions && clipboardData.theme && clipboardData.docInfo)) {
        return;
    }
    function check(n) {
        return usedmap[n];
    }
    function checkStyle(n) {
        return usedStyleMap[n];
    }
    function rndOffset() {
        return Math.round(Math.random() * 8) * 4 - 16;
    }
    forEachProperty(clipboardData, function (p, n) {
        // min order
        if (minorder === undefined || p.order < minorder) {
            minorder = p.order;
        }
    });

    // offset for positioning
    if (inPlace) {

        offset = [0, 0];
    } else {
        offset = [rndOffset(), rndOffset()];
    }
    forEachProperty(clipboardData.positions, function (p, n) {
        var uniqueName = that.getUniquePositionName(n, check),
            cp = deepCopy(p),
            c = clipboardData.children[n],
            newc;
        // fixes a style (so that it is locally added if it refers to
        // a style in the source document... (we copy styles from the origin
        // document... maybe we should only do this if origin and dest
        // are the same).
        function fixStyle(st) {
            var cbStyle,
                di = clipboardData.docInfo;
            // is the style an inner style of the clipboard data, that
            // is not present in an exactly similar form locally?
            if (isString(st) && !deepEqual(documentData.theme[st], clipboardData.theme[st])) {
                cbStyle = clipboardData.theme[st];
            } else if (isObject(st) && st.factory === di.factory && st.type === di.type && !deepEqual(documentData.theme[st.style], clipboardData.theme[st.style])) {
                cbStyle = clipboardData.theme[st.style];
            }
            // add the style locally if it is the case
            if (cbStyle) {
                // do the same job to all dependencies
                if (cbStyle.basedOn) {
                    forEach(cbStyle.basedOn, function (bst, index) {
                        var fixed = fixStyle(bst);
                        if (fixed !== bst) {
                            cbStyle.basedOn[index] = {
                                factory: that.docInfo.factory,
                                type: that.docInfo.type,
                                style: fixed
                            };
                        }
                    });
                }
                // add the result
                st = that.getUniqueStyleName(null, checkStyle);
                usedStyleMap[st] = true;
                cmdGroup.add(that.cmdAddStyle(st, cbStyle));
            }
            return st;
        }

        cp.matrix[12] += offset[0];
        cp.matrix[13] += offset[1];
        posmap[n] = uniqueName;
        usedmap[uniqueName] = true;
        cp.order = order + p.order - minorder;
        // we are ready to add the position
        cmdGroup.add(that.cmdAddPosition(uniqueName, cp));
        if (c) {
            newc = deepCopy(c);
            newc.config.position = uniqueName;
            // here we must fix local styles that are missing or different
            // by adding them to the document.
            forEachStyleConfig(newc.factory, newc.type, function (prop) {
                newc.config[prop] = fixStyle(newc.config[prop]);
            });
            cmdGroup.add(that.cmdAddVisual(uniqueName, newc));
        }
    });
    this.doCommand(cmdGroup);
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
        { model: this, name: name, position: position, clearSelection: true, layeringChanged: true }
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
        { model: this, name: name, position: position, layeringChanged: true }
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
        { model: this, name: name, position: position, layeringChanged: true }
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
Group.prototype.cmdClearTransformationPosition = function (name, authoringDimensions) {
    var that = this,
        m = this.documentData.positions[name].matrix;
    return new Command(
        function () {
            var documentData = that.documentData,
                pos = documentData.positions[name],
                d = authoringDimensions;
            if (!d) {
                d = convertScaleToSize(m).dimensions;
            }
            pos.matrix = mat4.create([d[0], 0, 0, 0,   0, d[1], 0, 0,   0, 0, d[2], 0,   m[12], m[13], m[13], 1]);
        },
        function () {
            var documentData = that.documentData,
                pos = documentData.positions[name];
            pos.matrix = m;
        },
        'cmdClearTransformationPosition',
        "Clear Transformation " + name,
        { model: this, name: name }
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
        { model: this, name: name, enable: enable, layeringChanged: true }
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
        { model: this, name: name, enable: enable, layeringChanged: true }
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
                    if (csn !== 'px' && csn !== '%' && csn !== 'cpx') {
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
        { model: this, name: name, layeringChanged: true }
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
    function toggle() {
        var documentData = that.documentData,
            n;
        documentData.positions[newname] = documentData.positions[name];
        forEachProperty(documentData.children, function (c) {
            if (c.config.position === name) {
                c.config.position = newname;
            }
        });
        delete documentData.positions[name];
        n = newname;
        newname = name;
        name = n;
    }
    return new Command(
        toggle,
        toggle,
        'cmdRenamePosition',
        "Rename position " + name + ' as ' + newname,
        { model: this, name: name, newname: newname, layeringChanged: true }
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
    function doUndo() {
        var children = that.documentData.children,
            old = children[name];
        if (visual) {
            children[name] = visual;
        } else {
            delete children[name];
        }
        visual = old;
    }
    return new Command(
        doUndo,
        doUndo,
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
        { model: this, name: name, visualConfig: true }
    );
};
Group.prototype.cmdSetVisualOnlyInEditor = function (name, onlyInEditor) {
    var documentData = this.documentData;
    function doUndo() {
        var child = documentData.children[name],
            old = Boolean(child.onlyInEditor);
        if (onlyInEditor) {
            child.onlyInEditor = true;
        } else {
            delete child.onlyInEditor;
        }
        onlyInEditor = old;
    }
    return new Command(
        doUndo,
        doUndo,
        'cmdSetVisualOnlyInEditor',
        'Set onlyInEditor ' + name,
        { model: this, name: name, onlyInEditor: onlyInEditor }
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
        { model: this, layeringChanged: true }
    );

};

///////////////////////
Group.prototype.cmdSetComponentProperties = function (
    dimensions,
    description,
    priv,
    gridSize,
    privateStyles,
    overflowX,
    overflowY
) {
    var that = this;
    function doUndo() {
        var documentData = that.documentData,
            dim = documentData.dimensions,
            descr = documentData.description,
            gs = documentData.gridSize,
            prv = documentData.privateVisual,
            prvStyles = documentData.privateStyles,
            ofx = documentData.overflowX,
            ofy = documentData.overflowY;
        documentData.dimensions = dimensions;
        documentData.description = description;
        documentData.privateVisual = priv;
        documentData.privateStyles = privateStyles;
        documentData.gridSize = gridSize;
        documentData.overflowX = overflowX;
        documentData.overflowY = overflowY;
        dimensions = dim;
        description = descr;
        priv = prv;
        privateStyles = prvStyles;
        gridSize = gs;
        overflowX = ofx;
        overflowY = ofy;
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
        { model: this, name: name, styleChanged: true }
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
        { model: this, name: name, styleChanged: true }
    );
};

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
                        tType.style = newname;
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
        { model: this, name: name, styleChanged: true }
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
                jsData[f] = deepCopy(v);
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
        { model: this, name: name, styleChanged: true }
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
        { model: this, name: name, styleChanged: true }
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
        { model: this, name: name, styleChanged: true }
    );
};
Group.prototype.cmdSetRemoteStyleSkinFeatures = function (factory, type, style, features) {
    var that = this,
        oldJSData;
    return new Command(
        function () {
            var documentData = that.documentData,
                skinS,
                jsData;
            // make sure there is a skin
            skinS = ensure(documentData, 'skin', factory, type, style);
            oldJSData = skinS.jsData;
            if (!oldJSData) {
                oldJSData = null;
                skinS.jsData = {};
            } else {
                oldJSData = deepCopy(oldJSData);
            }
            jsData = skinS.jsData;

            forEachProperty(features, function (f, fname) {
                if (f === null) {
                    delete jsData[fname];
                } else {
                    jsData[fname] = deepCopy(f);
                }
            });
        },
        function () {
            var documentData = that.documentData;
            if (oldJSData) {
                documentData.skin[factory][type][style].jsData = oldJSData;
            } else {
                delete documentData.skin[factory][type][style];
                that.normalizeDocumentSkin();
            }
        },
        'cmdSetRemoteStyleSkinFeatures',
        'Skin remote style features',
        { model: this, styleChanged: true }
    );
};
Group.prototype.cmdRemoveRemoteStyleSkin = function (factory, type, style) {
    var that = this,
        old;
    return new Command(
        function () {
            var documentData = that.documentData;
            old = ensured(documentData, 'skin', factory, type, style);
            if (old) {
                delete documentData.skin[factory][type][style];
                that.normalizeDocumentSkin();
            }
        },
        function () {
            var documentData = that.documentData;
            if (old) {
                ensure(documentData, 'skin', factory, type);
                documentData.skin[factory][type][style] = old;
            }
        },
        'cmdRemoveRemoteStyleSkin',
        'Remove remote style skin',
        { model: this, styleChanged: true }
    );
};

exports.Group = Group;
