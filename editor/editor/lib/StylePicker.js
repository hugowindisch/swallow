/**
    StylePicker.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    baseui = require('baseui'),
    StyleInfo = require('./StyleInfo').StyleInfo,
    utils = require('utils'),
    forEach = utils.forEach,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;


/*
Editable Styles (defined in ____)
*  *  *  *
*  *  *

From <this component>
*  *  *  *
*  *

From <the currently selected component>
*  *  *  *

From <the same component as the currently selected style>
* *  * *

(all this will be flowed)
*/

function StylePicker(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StylePicker);
}
StylePicker.prototype = new (domvisual.DOMElement)();
StylePicker.prototype.getConfigurationSheet = function () {
    return {  };
};

/**
    Sets the list of styles that we will be using
*/
StylePicker.prototype.setStyleList = function (sl) {
    this.styleList = sl;
    this.updateAll();
};

/**
    Generates a given style section.
*/
StylePicker.prototype.createStyleSection = function (title, selFcn) {
    var txt = new (baseui.Label)({text: title}),
        that = this;
    txt.setHtmlFlowing({});
    this.addChild(txt);
    forEach(this.styleList, function (st) {
        var ch;
        if (selFcn(st)) {
            ch = new StyleInfo();
            ch.setEditedStyle(st);
            ch.setHtmlFlowing({display: 'inline-block', position: 'relative'}, true);
            that.addChild(ch);
        }
    });
};
/**
    Regenerates the whole thing
*/
StylePicker.prototype.updateAll = function () {
    this.removeAllChildren();
    this.createStyleSection('all', function (st) { return true; });
};
/*
    var styleList = this.children.styleList,
        styleListChildren = styleList.children,
        selected = null;


    forEachProperty(styleListChildren, function (ch) {
        var data = ch.getEditedStyle();
        if (data.factory === st.factory && data.type === st.type && data.style === st.style) {
            selected = ch;
        }
    });
    this.select(selected); */

/*
Styling.prototype.select = function (st) {
    if (st !== this.selected) {
        if (this.selected) {
            this.selected.select(false);
        }
        this.selected = st;
        if (st !== null) {
            this.selected.select(true);
        }
    }
    // update all feature editors

    this.updateStylePreview();
};
*/
/*Styling.prototype.updateStylePreview = function () {
    this.children.stylePreview.setEditedStyle(this.selectedStyle);
    if (this.selectedStyle) {
        this.children.stylePreview.setEditedStyle(this.selected.getEditedStyle());
    } else {
        this.children.stylePreview.setEditedStyle(null);
    }
};*/
/*Styling.prototype.updateList = function (list) {
    var that = this,
        styleList = this.children.styleList;
    function stringDiff(s1, s2) {
        return s1 < s2 ? -1 : (s1 > s2 ? 1 : 0);
    }
    list.sort(function (s1, s2) {
        var d = stringDiff(s1.factory, s2.factory);
        if (d === 0) {
            d = stringDiff(s1.type, s2.type);
            if (d === 0) {
                d = stringDiff(s1.style, s2.style);
            }
        }
        return d;
    });
    // clear all children
    styleList.removeAllChildren();
    // regenerate all children
    forEach(list, function (st) {
        var ch = new StyleInfo({editedStyle: st});
        ch.setHtmlFlowing({position: 'relative'}, true);
        styleList.addChild(ch);
        ch.on('click', function () {
            that.select(ch);
            that.emit('change', ch.getEditedStyle());
        });
    });
    this.setDimensions([groups.Styling.dimensions[0], list.length * 60 + 10, 1]);
};*/

exports.StylePicker = StylePicker;
