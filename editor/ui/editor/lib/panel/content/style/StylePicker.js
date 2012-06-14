/**
    StylePicker.js

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
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    baseui = require('baseui'),
    StyleInfo = require('./StyleInfo').StyleInfo,
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty,
    forEachSortedProperty = utils.forEachSortedProperty,
    isString = utils.isString;


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
    Use a local theme.
*/
StylePicker.prototype.previewStyleChange = function (skin) {
    forEachProperty(this.children, function (c, n) {
        var es;
        if (c instanceof StyleInfo) {
            c.previewStyleChange(skin);
        }
    });
};


/**
    Highlights a style if it is present in the picker
*/
StylePicker.prototype.highlight = function (style) {
    if (isString(style)) {
        style = { factory: null, type: null, style: style };
    } else if (style === null) {
        style = { factory: null, type: null, style: null };
    }
    forEachProperty(this.children, function (c, n) {
        var es;
        if (c instanceof StyleInfo) {
            es = c.getEditedStyle();
            c.highlight(es.factory === style.factory && es.type === style.type && es.style === style.style);
        }
    });
};

/**
    Generates all the sections that we want to create
*/
StylePicker.prototype.generateSections = function () {
    var factoryMap = {};
    forEach(this.styleList, function (s) {
        var factory = s.factory,
            type = s.type,
            style = s.style,
            m = factoryMap[factory],
            styleMap;
        if (m === undefined) {
            m = factoryMap[factory] = {};
        }
        styleMap = m[type];
        if (styleMap === undefined) {
            styleMap = m[type] = {};
        }
        styleMap[style] = s;
    });
    return factoryMap;
};

/**
    Generates a given style section.
*/
StylePicker.prototype.createStyleSection = function (title, styleMap) {
    var txt = new (baseui.Label)({text: title}),
        that = this;
    txt.setHtmlFlowing({marginTop: '20px', marginBottom: '10px' });
    txt.setStyleAttributes({ fontWeight: 'bold' });
    this.addChild(txt);
    forEachSortedProperty(styleMap, function (st) {
        var ch = new StyleInfo();
        ch.setEditedStyle(st);
        ch.setHtmlFlowing({display: 'inline-block', position: 'relative'}, true);
        ch.on('click', function () {
            that.emit('select', ch.getEditedStyle());
        });
        that.addChild(ch);
    });
};
/**
    Regenerates the whole thing
*/
StylePicker.prototype.updateAll = function () {
    var sections = this.generateSections(),
        sarr,
        that = this,
        dim;
    this.removeAllChildren();
    forEachSortedProperty(sections, function (fact, factName) {
        forEachSortedProperty(fact, function (type, typeName) {
            var title;
            if (factName === 'null' && typeName === 'null') {
                title = 'Local styles';
            } else {
                title = 'In package ' + factName + ' module ' + typeName;
            }
            that.createStyleSection(title, type);
        });
    });
    // this will let an outer container grow to our generated content
    that.notifyDOMChanged();

};
exports.StylePicker = StylePicker;
