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

/*


{
    stylename: {
        description: "description of the purpose of this style",
        basedOn: [
            // take the line styles from here
            { factory: xxx, type:, style: stylename }

        ],
        data: [ "cssThing1", "cssThing2" ]
    }
};

Themes should be settable through the config: this works if we set all
themes at once (with a themesheet)

We already have what is needed to:
- Have a theme attached to a constructor
- Have a customized theme in a component (a per instance customized theme)


What we want is a way to customize all child components of a given component

Skin (remote style override)
{
    factory : {
        // Theme
        type: {
            style {
            }
        }
    }
}

a) build the skin (remote style overrides)
    => to do this, for each type, we inherit from the standard skin, and apply
        specific styles
b) build the theme (local styles)

when creating children we pass them a 'skin'. If they do have a skin already
the question becomes: should their own children use their skin 'below them'
or not? (when is this decided?? when

Algo for creating the skin:
    for Each (factory,type) {
        - get its ***UNBOUND*** type.Theme
            ==> The binding operation cannot be destructive.
        - create a theme for it
        - apply the local stuff to the theme
    }


Algo for creating children:
    - pass them the skin
    - if they find themeselves in (skin[factory][type]) they use this as their local theme
    - when they create children they can either pass them Constructor.skin or
        this.

=>


THE TOPMOST PARENT ALWAYS WINS
A STYLE IS UNIQUE WITHIN A TREE
IT IS ALWAYS POSSIBLE TO NOT PROPAGATE A SKIN IN A BRANCH

FOR THE EDITOR: the editor does not reskin


*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach,
    isArray = utils.isArray,
    apply = utils.apply,
    deepCopy = utils.deepCopy,
    defaultSkin;


function bindStyle(style, skin) {
    var that = this, i, l, deps = style.basedOn, bindings, dep, module, Constr, t;
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
                throw new Error('unresolved theme ' + dep.factory + ' ' + dep.type);
            }
        }
    }
}

function applyTheme(toTheme, fromTheme, all) {
    forEachProperty(fromTheme, function (prop, propname) {
        if (all || toTheme[propname]) {
            // note: we deepcopy the prop because bindings may change
            // for the same property in two different skins
            toTheme[propname] = deepCopy(prop);
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
    A theme (a theme is a collection of styles)
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
Theme.prototype.getStyle = function (name) {
    return this.themeData[name];
};
Theme.prototype.getStyleData = function (name) {
    var style = this.getStyle(name);
    return getStyleData(style, this.skin);
};
Theme.prototype.getThemeData = function () {
    return this.themeData;
};

/*
    A skin defines remote types (overrides themes from many different
    components)

    Even if we don't explicitely override a component in a skin, it
    must be present because it may use dependencies defined in the current
    skin.
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
        // in this skin (and NEEDS to be defined... this is not necessarily the case).
        skinF[type] = new Theme(T.prototype.theme.themeData, this);
    } else {
        // we still want to nullify this theme so we don't redo this operation
        // every time.
        skinF[type] = null;
    }
    return skinF[type];
};
Skin.prototype.getTheme = function (factory, type) {
    var fact = this.skinData[factory];
    if (fact && fact.hasOwnProperty(type)) {
        return fact[type];
    }
    return this.makeTheme(factory, type);
};

exports.Theme = Theme;
exports.Skin = Skin;
exports.defaultSkin = defaultSkin;
