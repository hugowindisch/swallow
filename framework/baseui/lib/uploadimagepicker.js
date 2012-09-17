/**
    UploadImagePicker.js
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
    utils = require('utils'),
    config = require('config'),
    group = {
        // authoring dimension
        dimensions: [ 400, 200, 0],
        positions: {
            picker: {
                order: 0,
                matrix: [ 400, 0, 0, 0, 0, 175, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            upload: {
                order: 1,
                matrix: [ 400, 0, 0, 0, 0, 25, 0, 0, 0, 0, 1, 0, 0, 175, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'auto',
                    bottom: 'px',
                    height: 'px'
                }
            }
        },
        children: {
            picker: {
                factory: "baseui",
                type: "ImagePicker",
                config: {
                    position: "picker"
                }
            },
            upload: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    position: "upload"
                }
            }
        }
    };

function UploadImagePicker(config) {
    var that = this,
        fileupload;

    this.uploadUrl = '';

    domvisual.DOMElement.call(this, config, group);
    // add some hooks:
    fileupload = '<form method="POST" enctype="multipart/form-data" action="' +
        this.uploadUrl +
        '" target = "_blank">' +
        '<INPUT TYPE=FILE NAME="upfile">' +
        '<INPUT TYPE=SUBMIT VALUE="Submit">' +
        '</form>';
        //+ '<iframe name="avoidPageChange" ></iframe>';

    this.getChild('picker').on('change', function (e) {
        that.emit('change', e);
    });

    this.getChild('upload').addHtmlChild('div', fileupload, null, 'fileupload');

}

UploadImagePicker.prototype = new (domvisual.DOMElement)();

UploadImagePicker.prototype.getDescription = function () {
    return "A ImagePicker with an Upload button";
};

UploadImagePicker.prototype.setUrls = function (urls) {
    return this.getChild('picker').setUrls(urls);
};

UploadImagePicker.prototype.setSelectedUrl = function (url) {
    return this.getChild('picker').setSelectedUrl(url);
};
UploadImagePicker.prototype.getSelectedUrl = function (url) {
    return this.getChild('picker').getSelectedUrl(url);
};
UploadImagePicker.prototype.setUploadUrl = function (url) {
    this.uploadUrl = url;
    return this;
};
UploadImagePicker.prototype.getUploadUrl = function () {
    return this.uploadUrl;
};


exports.UploadImagePicker = UploadImagePicker;
