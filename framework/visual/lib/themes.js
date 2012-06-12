/**
    themes.js

    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

/*
VERY SIMPLE YET ACCURATE DESCRIPTION
====================================
- A skin is a theme finder (resolves factory,type to a theme potentially null or
a theme)
- A theme defines a series of named styles (potentially inheriting from other
styles)
*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    isArray = utils.isArray,
    apply = utils.apply,
    deepCopy = utils.deepCopy,
    defaultSkin;

/*
* Makes a style directly point to its dependencies.
* @private
*/
function bindStyle(style, skin) {
    var that = this,
        i,
        l,
        deps = style.basedOn,
        bindings,
        dep,
        module,
        Constr,
        t;
    if (!style.bindings && deps) {
        l = deps.length;
        bindings = [];
        style.bindings = bindings;
        for (i = 0; i < l; i += 1) {
            dep = deps[i];
            try {
                t = skin.getTheme(dep.factory, dep.type);
                bindings.push({theme: t, style: dep.style});
            } catch (e) {
                throw new Error(
                    'unresolved theme ' +
                        dep.factory +
                        ' ' +
                        dep.type
                );
            }
        }
    }
}

/*
* Applies a theme.
* @private
*/
function applyTheme(toTheme, fromTheme, all) {
    forEachProperty(fromTheme, function (prop, propname) {
        var tt = toTheme[propname];
        if (all || tt) {
            tt = toTheme[propname] = {};
            // note: we deepcopy the prop because bindings may change
            // for the same property in two different skins
            forEachProperty(prop, function (v, name) {
                if (name !== 'bindings') {
                    tt[name] = v;
                }
            });
        }
    });
}

// this is the default skin, that resolves non skinned themes
defaultSkin = {
    getTheme: function (factory, type) {
        var f = require(factory);
        return f[type].prototype.theme;
    }
};

/*
* Returns the style data for a given style in the given skin.
* @private
*/
function getStyleData(style, skin) {
    var results = { data: [], jsData: {} };
    skin = skin || defaultSkin;
    function gS(s) {
        var bindings, i, l, binding, data, jsData;
        if (s) {
            // make sure the style is bound
            bindStyle(s, skin);
            bindings = s.bindings;
            // do the dependencies first
            if (bindings) {
                l = bindings.length;
                for (i = 0; i < l; i += 1) {
                    binding = bindings[i];
                    gS(binding.theme.getStyle(binding.style));
                }
            }
            // then add the new stuff
            data = s.data;
            if (data) {
                results.data = results.data.concat(data);
            }
            jsData = s.jsData;
            if (jsData) {
                forEachProperty(jsData, function (p, pname) {
                    results.jsData[pname] = p;
                });
            }
        }
    }
    gS(style);
    return results;
}

/*
* A theme (a theme is a collection of styles)
* @private
*/
function Theme(themeData, skin) {
    // support null theme data by returning a null theme.
    if (themeData === null) {
        return null;
    }
    // import everything
    this.themeData = {};
    this.skin = skin;
    applyTheme(this.themeData, themeData, true);
}

/*
* Returns a style from this theme.
* @private
*/
Theme.prototype.getStyle = function (name) {
    return this.themeData[name];
};

/*
* Returns the style data for a style in this theme.
* @private
*/
Theme.prototype.getStyleData = function (name) {
    var style = this.getStyle(name);
    return getStyleData(style, this.skin);
};

/*
* Returns the theme data.
* @private
*/
Theme.prototype.getThemeData = function () {
    return this.themeData;
};

/*
* Returns the skin in this theme.
* @private
*/
Theme.prototype.getSkin = function () {
    return this.skin;
};

/*
* @constructor A skin defines remote styles (overrides themes from many
* different components)
* Even if we don't explicitely override a component in a skin, it
* must be present because it may use dependencies defined in the current
* skin.
* @private
*/
function Skin(skinData) {
    if (skinData === null) {
        return null;
    }
    var that = this;
    this.skinData = {};
    forEachProperty(skinData, function (types, factory) {
        var f = that.skinData[factory] = {},
            fact = require(factory);
        forEachProperty(types, function (styleData, Type) {
            // if we inherit from the base theme, we may have some bindings
            // that rely on stuff that we redefine. So we don't want these
            // bindings, so, basically we don't want to inherit anything
            var th = fact[Type].prototype.theme,
                sd = apply(apply({}, th ? th.themeData : {}), styleData),
                t = f[Type] = new Theme(sd, that);
        });
    });
}

/*
* Constructs the skin private version of a theme.
* @private
*/
Skin.prototype.makeTheme = function (factory, type) {
    var fact = require(factory),
        T = fact[type],
        skinF;

    if (!(skinF = this.skinData[factory])) {
        skinF = this.skinData[factory] = {};
    }
    // if this factory has some kind of a theme
    if (T.prototype.theme) {
        // we want our private version of this theme
        // FIXME: in practice we could find if the given theme has dependencies
        // in this skin (and NEEDS to be defined... this is not necessarily
        // the case).
        skinF[type] = new Theme(T.prototype.theme.themeData, this);
    } else {
        // we still want to nullify this theme so we don't redo this operation
        // every time.
        skinF[type] = null;
    }
    return skinF[type];
};

/*
* Returns a theme from this skin.
* @private
*/
Skin.prototype.getTheme = function (factory, type) {
    var fact = this.skinData[factory];
    if (fact && fact.hasOwnProperty(type)) {
        return fact[type];
    }
    return this.makeTheme(factory, type);
};

/*
* Returns the skin data.
* @private
*/
Skin.prototype.getSkinData = function () {
    return this.skinData;
};

exports.Theme = Theme;
exports.Skin = Skin;
exports.defaultSkin = defaultSkin;
