/**
    themes.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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

*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    isArray = utils.isArray;

function bindStyle(style) {
    var that = this, i, l, deps = style.basedOn, bindings, dep, module, Constr, t;
    if (deps) {
        // this also prevents infinite
        delete style.basedOn;
        l = deps.length;
        bindings = [];
        style.bindings = bindings;
        for (i = 0; i < l; i += 1) {
            dep = deps[i];
            module = require(dep.factory);
            if (module) {
                Constr = module[dep.type];
                if (Constr) {
                    t = Constr.prototype.theme;
                    if (t) {
                        // add the style to the bindings
                        bindings.push({theme: t, style: dep.style});
                    }
                } else {
                    throw new Error('unresolved constructor ' + dep.type + ' in ' + dep.factory);                    
                }
            } else {
                throw new Error('unresolved module ' + dep.factory);
            }
        }
    }
}

function applyTheme(toTheme, fromTheme, all) {
    forEachProperty(fromTheme, function (prop, propname) {
        if (all || toTheme[propname]) {
            toTheme[propname] = prop;
        }
    });
}

function Theme(themeData) {
    // import everything
    applyTheme(this, themeData, true);
}

function applySkin(o, theme) {
    function createSkin(o) {
        var base = o.theme || new Theme();
        function F() {
        }
        F.prototype = base;
        o.theme = new F();
    }
    if (!o.hasOwnProperty('theme')) {
        createSkin(o);
    }
    applyTheme(o.theme, theme);
}

function getStyleData(style) {
    var results = [];
    function gS(s) {
        var bindings, i, l, binding, data;
        if (s) {
            // make sure the style is bound
            bindStyle(s);
            bindings = s.bindings;
            // do the dependencies first
            if (bindings) {
                l = bindings.length;
                for (i = 0; i < l; i += 1) {
                    binding = bindings[i];
                    gS(binding.theme[binding.style]);
                }
            }
            // then add the new stuff
            data = s.data;
            if (data) {
                results = results.concat(data);
            }
        }
    }
    gS(style);
    return results;
}
exports.getStyleData = getStyleData;
exports.applySkin = applySkin;
exports.Theme = Theme;
