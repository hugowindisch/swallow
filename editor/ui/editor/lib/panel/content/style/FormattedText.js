/**
    FormattedText.js

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
    ImageOption = require('/editor/lib/panel/ImageOption').ImageOption,
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty;


function FormattedText(config) {
    var that = this;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.FormattedText);

    function emitChange() {
        that.emit('change', that.getData());
    }

    this.textSource = new ImageOption({
        'inline':  [ 'editor/img/tsinline_s.png', 'editor/img/tsinline.png', this.getChild('sourceInline') ],
        'url': [ 'editor/img/tsurl_s.png', 'editor/img/tsurl.png', this.getChild('sourceUrl') ]
    });

    this.textSource.on('change', function (d) {
        that.formattedText.src = d;
        emitChange();
    });

    this.textEncoding = new ImageOption({
        'text':  [ 'editor/img/tetext_s.png', 'editor/img/tetext.png', this.getChild('encodingText') ],
        'html': [ 'editor/img/tehtml_s.png', 'editor/img/tehtml.png', this.getChild('encodingHtml') ],
        'markdown': [ 'editor/img/temd_s.png', 'editor/img/temd.png', this.getChild('encodingMd') ]
    });

    this.textEncoding.on('change', function (d) {
        that.formattedText.encoding = d;
        emitChange();
    });

    this.getChild('text').on('change', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        that.formattedText.text = this.getText();
        emitChange();
    });

    // set some default data
    this.setData();
}
FormattedText.prototype = new (domvisual.DOMElement)();

FormattedText.prototype.setData = function (d) {
    d = d || {
        src: 'inline',
        encoding: 'text',
        text: ''
    };
    this.formattedText = d;
    this.textSource.setSelectedValue(d.src);
    this.textEncoding.setSelectedValue(d.encoding);
    this.getChild('text').setText(d.text);
};

FormattedText.prototype.getData = function () {
    return this.formattedText;
};

FormattedText.prototype.setLabel = function (labelText) {
    this.getChild('label').setText(labelText);
};

FormattedText.prototype.setEditor = function (editor) {
    this.editor = editor;
};

exports.FormattedText = FormattedText;
