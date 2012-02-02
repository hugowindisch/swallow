/**
    themes.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/

/*


{
    stylename: {
        basedOn: [
            // take the line styles from here
            { factory: xxx, type:, style: stylename }
            
        ],
        data: [ "cssThing1", "cssThing2" ]
    }
};

Themes should be settable through the config: this works if we set all
themes at once (with a themesheet)


---------------
WARNING
--------------

FIXME: IM NOT SURE THE EVENT STUFF SHOULD BE HERE AT ALL... OR MAYBE IT SHOULD
but we need to be able to BREAK the referencing that events produce (just like
we do with DOM events), otherwise instances will never be freed.

MAYBE a simpler 'dirty all the tree' thing would be more appropriate when some
one changes a theme (i.e. not a skin)



*/
var utils = require('utils'),
    events = require('events'),
    EventEmitter = events.EventEmitter,
    forEachProperty = utils.forEachProperty,
    isArray = utils.isArray;

function bindStyle(theme, style) {
    var that = this, i, l, deps = style.basedOn, bindings, dep, module, Constr, t;
    if (deps) {
        // this also prevents infinite
        delete theme.basedOn;
        l = deps.length;
        bindings = [];
        theme.bindings = bindings;
        for (i = 0; i < l; i += 1) {
            dep = deps[i];
            module = require(dep.factory);
            if (module) {
                Constr = module[dep.type];
                if (Constr) {
                    t = Constr.prototype.theme;
                    if (t) {
                        // make theme dependent on t
                        t.removeListener('themeDirty', theme.themeDirty);
                        t.removeListener('cleanTheme', theme.cleanTheme);
                        t.on('themeDirty', theme.themeDirty);
                        t.on('cleanTheme', theme.cleanTheme);
                        // add the style to the bindings
                        bindings.push({theme: t, style: dep.style});
                    }
                }
            }
        }
    }
}

function applyTheme(toTheme, fromTheme, all) {
    var changed = false;
    forEachProperty(fromTheme, function (prop, propname) {
        if (all || toTheme[propname]) {
            toTheme[propname] = prop;
            bindStyle(toTheme, prop);
        }
    });
    if (changed) {
        // this will 'mark' all our dependencies
        toTheme.emit('themeDirty');
        // this will only fire one themeChange per theme
        toTheme.emit('cleanTheme');
    }
}

function Theme(themeData) {
    var that = this;
    // define some handlers
    this.themeDirty = function () {
        that.dirty = true;
        that.emit('themeDirty');
    };
    this.cleanTheme = function () {
        if (that.dirty) {
            delete that.dirty;
            that.emit('themeChanged');
        }
    };
    // import everything
    applyTheme(this, themeData, true);
}

Theme.prototype = new EventEmitter();

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

function getStyle(theme, stylename) {
    var results = [];
    function gS(theme, stylename) {
        var s = theme[stylename], bindings, i, l, binding, data;
        if (s) {
            bindings = s.bindings;
            // do the dependencies first
            if (bindings) {
                l = bindings.length;
                for (i = 0; i < l; i += 1) {
                    binding = bindings[i];
                    gS(binding.theme, binding.style);
                }
            }
            // then add the new stuff
            data = s.data;
            if (data) {
                if (isArray(data)) {
                    l = data.length;
                    for (i = 0; i < l; i += 1) {
                        results.push(data[i]);
                    }                    
                } else {
                    results.push(data);
                }
            }
        }
    }
    gS(theme, stylename);
    return results;
}
exports.getStyle = getStyle;
exports.applySkin = applySkin;
exports.Theme = Theme;
