/**
    StyleSheet.js

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
    LeftRightTopBottom = require('./LeftRightTopBottom').LeftRightTopBottom,
    Styling = require('./Styling').Styling,
    hasTextAttributes = domvisual.hasTextAttributes,
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty,
    isString = utils.isString,
    isObject = utils.isObject;

/*
    format of a stylesheet:

    {
        // this is the 'base' style. it can be empty
        // it will be assigned to the box or 'body'
        "": {
            style: {
                factory:
                type:
                style:
            }
        },
        // this is a selector for a child
        "h1 .abc": {
            style: {
                factory:
                type:
                style:
            }
            marginLeft
            marginRight
            marginTop
            marginBottom

            paddingLeft
            paddingTop
            paddingBottom
            paddingRight
        }
    }
*/

function parseSelectors(str) {
    var ret = [],
        leadingWhite = /^\s*/,
        trailingWhite = /\s*$/;
    forEach(str.split(','), function (s) {
        var m = leadingWhite.exec(s);
        if (m) {
            s = s.slice(m[0].length);
        }
        m = trailingWhite.exec(s);
        if (m) {
            s = s.slice(0, s.length - m[0].length);
        }
        if (s.length > 0) {
            ret.push(s);
        }
    });
    return ret;
}

function StyleSheet(config) {
    var that = this;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSheet);

    // when the input changes,
    this.getChild('selectors').on('change', function () {
        that.setSelectorString(this.getText());
        that.emit('change', that.styleSheetData);
    });
    this.getChild('selector').on('change', function () {
        that.updateParts();
    });

    // backflip to adapt an abolutely positioned thing to it content size
    this.getChild('parts').on('domchanged', function () {
        this.requestDimensions(this.getComputedDimensions());
    });

    if (this.styleSheetData === undefined) {
        this.setData({});
    }
}
StyleSheet.prototype = new (domvisual.DOMElement)();
StyleSheet.prototype.setSelectorString = function (ss) {
    var sels = parseSelectors(ss),
        ssd = this.styleSheetData,
        newSsd = {};
    forEach(sels, function (s) {
        if (ssd[s] === undefined) {
            newSsd[s] = {};
        } else {
            newSsd[s] = ssd[s];
        }
    });
    this.styleSheetData = newSsd;
    this.updateControls();
};
StyleSheet.prototype.setData = function (d) {
    this.styleSheetData = d;
    this.updateControls();
};
StyleSheet.prototype.getData = function () {
    return this.styleSheetData;
};
StyleSheet.prototype.updateControls = function () {
    var ssd = this.styleSheetData,
        props = [];
    forEachProperty(ssd, function (d, n) {
        props.push(n);
    });
    this.getChild('selectors').setText(props.join(', '));
    props.unshift('Background');
    this.getChild('selector').setOptions(props);
    this.updateParts();
};
StyleSheet.prototype.updateParts = function () {
    var parts = this.getChild('parts'),
        ssd = this.styleSheetData,
        option = this.getChild('selector').getSelectedOption(),
        so = ssd[option],
        c,
        docInfo = this.editor.getDocInfo(),
        that = this;
    parts.removeAllChildren();
    function setOption(o, opt, value) {
        if (value === null || value === undefined) {
            delete o[opt];
        } else {
            o[opt] = value;
        }
    }
    function fullStyle(s) {
        if (isString(s)) {
            s = {
                factory: docInfo.factory,
                type: docInfo.type,
                style: s
            };
        }
        return s;
    }
    function localStyle(s) {
        if (isObject(s) && s.factory === docInfo.factory && s.type === docInfo.type) {
            s = s.style;
        }
        return s;
    }
    switch (this.getChild('selector').getSelectedIndex()) {
    case -1:
        // do nothing
        break;
    case 0:
        // add the style sheet only
        c = new Styling({editor: this.editor});
        parts.addChild(c, 'styling');
        c.setHtmlFlowing({position: 'relative'}, false
        ).on('change', function (v) {
            if (v !== null && v !== undefined) {
                ssd[''] = {
                    style: fullStyle(v)
                };
            } else {
                delete ssd[''];
            }
            that.emit('change', ssd);
        });
        if (so && so.style) {
            c.setData(localStyle(so.style));
        }

        break;
    default:
        // add
        c = new LeftRightTopBottom({
            title: 'Margins',
            left: so.marginLeft,
            right: so.marginRight,
            top: so.marginTop,
            bottom: so.marginBottom
        });
        parts.addChild(c, 'margins');
        c.setHtmlFlowing({position: 'relative'}, true
        ).on('change', function (left, right, top, bottom) {
            setOption(so, 'marginLeft', left);
            setOption(so, 'marginRight', right);
            setOption(so, 'marginTop', top);
            setOption(so, 'marginBottom', bottom);
            that.emit('change', ssd);
        }).on('preview', function (left, right, top, bottom) {
            setOption(so, 'marginLeft', left);
            setOption(so, 'marginRight', right);
            setOption(so, 'marginTop', top);
            setOption(so, 'marginBottom', bottom);
            that.emit('preview', ssd);
        });
        c = new LeftRightTopBottom({
            title: 'Padding',
            left: so.paddingLeft,
            right: so.paddingRight,
            top: so.paddingTop,
            bottom: so.paddingBottom
        });
        parts.addChild(c, 'padding');
        c.setHtmlFlowing({position: 'relative'}, true
        ).on('change', function (left, right, top, bottom) {
            setOption(so, 'paddingLeft', left);
            setOption(so, 'paddingRight', right);
            setOption(so, 'paddingTop', top);
            setOption(so, 'paddingBottom', bottom);
            that.emit('change', ssd);
        }).on('preview', function (left, right, top, bottom) {
            setOption(so, 'paddingLeft', left);
            setOption(so, 'paddingRight', right);
            setOption(so, 'paddingTop', top);
            setOption(so, 'paddingBottom', bottom);
            that.emit('preview', ssd);
        });
        c = new Styling({editor: this.editor});
        parts.addChild(c, 'styling');
        c.setHtmlFlowing({position: 'relative'}, false
        ).on('change', function (v) {
            if (v !== null && v !== undefined) {
                so.style = fullStyle(v);
            } else {
                delete so.style;
            }
            that.emit('change', ssd);
        });
        if (so && so.style) {
            c.setData(localStyle(so.style));
        }

        break;
    }
    // FIXME: perhaps... we could set things up do this would never have
    // to be explicitly called.
    parts.notifyDOMChanged();
};
StyleSheet.prototype.getConfigurationSheet = function () {
    return { };
};
StyleSheet.prototype.setEditor = function (editor) {
    this.editor = editor;
};

exports.StyleSheet = StyleSheet;
