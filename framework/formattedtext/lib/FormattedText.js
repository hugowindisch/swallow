/**
    FormattedText.js
    Copyright (C) 2012 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = 'formattedtext',
    className = 'FormattedText',
    markdown = require('markdown'),
    http = require('http'),
    domquery = require('domquery'),
    domelement = require('domelement'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    group = require('./groups').groups.FormattedText;

function FormattedText(config) {
    domvisual.DOMElement.call(this, config, group);
}
FormattedText.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);

FormattedText.prototype.getConfigurationSheet = function () {
    var config = require('config');
    return {
        text: config.formattedTextConfig('Formatted Text'),
        styleSheet: config.styleSheetConfig('Blah')
    };
};

FormattedText.prototype.loadText = function (url, cb) {
    var data = '',
        that = this;
    http.get(url, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            if (cb) {
                cb(null, data);
            }
        });
        res.on('error', function (e) {
            if (cb) {
                cb(e);
            }
        });
    });
    return this;
};


FormattedText.prototype.setText = function (txt) {
    var that = this;

    function updateText(encoding, text) {
        that.removeAllChildren();
        switch (encoding) {
        case 'text':
            that.addTextChild('div', text, null, 'txt');
            break;
        case 'html':
            that.addHtmlChild('div', text, null, 'txt');
            break;
        case 'markdown':
            // updateText(txt)
            break;
        }
        if (that.ss) {
            that.setStyleSheet(that.ss);
        }
    }

    this.txt = txt;
    if (txt.src === 'url') {
        this.loadText(txt.text, function (err, data) {
            if (!err) {
                updateText(txt.encoding, data);
            }
        });
    } else {
        updateText(txt.encoding, txt.text);
    }
};

FormattedText.prototype.setStyleSheet = function (ss) {
    var that = this,
        skin,
        de;
    this.ss = ss;
    forEachProperty(ss, function (prop, propname) {
        if (propname === '') {
            if (prop.style) {
                that.setStyle(prop.style);
            }
        } else {
            de = domelement(propname, that.getChild('txt').element);
            if (prop.style) {
                // FIXME: THIS DOES NOT WORK, AT LEAST IN THE EDITOR. HOW
                // DO WE LET EDITED STUFF KNOW THE APPROPRIATE DEFAULT SKIN...
                skin = visual.defaultSkin;
                de.setStyle(
                    skin,
                    prop.style.factory,
                    prop.style.type,
                    prop.style.style
                );
            }
            de.setMargins(
                prop.marginLeft,
                prop.marginTop,
                prop.marginRight,
                prop.marginBottom
            ).setPadding(
                prop.paddingLeft,
                prop.paddingTop,
                prop.paddingRight,
                prop.paddingBottom
            );
        }
    });
};
exports.FormattedText = FormattedText;
