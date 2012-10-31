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
/*globals FormData */
var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    forEach = utils.forEach,
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
            }
        },
        children: {
            picker: {
                factory: "baseui",
                type: "ImagePicker",
                config: {
                    position: "picker"
                }
            }
        }
    };

function UploadImagePicker(config) {
    var that = this,
        fileupload,
        picker;

    this.uploadUrl = '';

    domvisual.DOMElement.call(this, config, group);
    // add some hooks:
    picker = this.getChild('picker');
    picker.on('change', function (e) {
        that.emit('change', e);
    }).on('drop', function (evt) {
        var formData = new FormData(),
            http = require('http'),
            req;
        forEach(evt.dataTransfer.files, function (file) {
            formData.append(file.name, file);
        });
        req = http.request(
            {
                method: 'POST',
                path: that.uploadUrl
            },
            function (res) {
                res.on('error', function (e) {
                });
                res.on('end', function () {
                    // maybe here, we should initiate the reload
                    // of the whole image thing?
                    that.download();
                });
            }
        );
        req.end(formData);
        evt.stopPropagation();
        evt.preventDefault();
    }).on('dragover', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    });

    //this.download();
}

UploadImagePicker.prototype = new (domvisual.DOMElement)();

UploadImagePicker.prototype.getDescription = function () {
    return "A ImagePicker with an Upload button";
};

UploadImagePicker.prototype.setUrls = function (urls) {
    return this.getChild('picker').setUrls(urls);
};
UploadImagePicker.prototype.setMultipleSelection = function (ms) {
    this.getChild('picker').setMultipleSelection(ms);
    return this;
};
UploadImagePicker.prototype.getSelection = function () {
    return this.getChild('picker').getSelection();
};
UploadImagePicker.prototype.setSelection = function (s) {
    this.getChild('picker').setSelection(s);
    return this;
};
UploadImagePicker.prototype.setSelectedUrl = function (url) {
    this.getChild('picker').setSelectedUrl(url);
    return this;
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
UploadImagePicker.prototype.setDownloadUrl = function (url) {
    this.downloadUrl = url;
};
UploadImagePicker.prototype.download = function (cb) {
    var http = require('http'),
        that = this,
        data = '';
    cb = cb || function () {};

    http.get(
        { path: this.downloadUrl },
        function (res) {
            res.on('data', function (d) {
                data += d;
            });
            res.on('end', function () {
                var jsonData = JSON.parse(data);
                that.setUrls(jsonData);
                cb(null);
            });
            res.on('error', function (e) {
                cb(e);
            });
        }
    );
};
exports.UploadImagePicker = UploadImagePicker;
