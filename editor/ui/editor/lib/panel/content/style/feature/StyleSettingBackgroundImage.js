/**
    StyleSettingBackgroundImageImage.js

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
    utils = require('utils'),
    http = require('http'),
    isArray = utils.isArray,
    isString = utils.isString,
    deepCopy = utils.deepCopy,
    groups = require('/editor/lib/definition').definition.groups;

function StyleSettingBackgroundImage(config) {
    var children = this.children,
        that = this;
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingBackgroundImage);
    this.getChild('gradient').on('preview', function (v) {
        that.updateData(v);
        that.emit('preview', that.styleData);
    });
    this.getChild('gradient').on('change', function (v) {
        that.updateData(v);
        that.emit('change', that.styleData);
    });
    this.getChild('clear').on('click', function () {
        that.emit('reset', {});
    });
    this.getChild('imageSource').on('change', function (d) {
        switch (d) {
        case 'gradient':
            that.showGradient();
            break;
        case 'url':
            that.showImage();
            break;
        }
    });
    this.getChild('image').on('change', function (s) {
        that.updateData(s);
        that.emit('change', that.styleData);
    });

    // repeat
    function resetRepeatUI() {
        var d = {
                repeat: [ 'repeat', 'repeat' ]
            },
            c;
        c = that.getChild('repeatXMode');
        if (!c.getSelectedValue()) {
            c.setSelectedValue(d.repeat[0]);
        }
        c = that.getChild('repeatYMode');
        if (!c.getSelectedValue()) {
            c.setSelectedValue(d.repeat[0]);
        }
        return d;
    }

    function updateRepeatData() {
        var d;
        if (!that.getChild('repeatCheck').getValue()) {
            resetRepeatUI();
            that.getChild('repeatCheck').setValue(true);
        }
        if (that.selected !== undefined) {
            d = {
                repeat: [
                    that.getChild('repeatXMode').getSelectedValue(),
                    that.getChild('repeatYMode').getSelectedValue()
                ]
            };
            if (!that.styleData.bgr) {
                that.styleData.bgr = [];
            }
            that.styleData.bgr[that.selected] = d;
            that.emit('change', that.styleData);
        }
    }
    this.getChild('repeatXMode').on('change', updateRepeatData);
    this.getChild('repeatYMode').on('change', updateRepeatData);
    this.getChild('repeatCheck').on('change', function (c) {
        var d;
        if (!c) {
            that.getChild('repeatXMode').setSelectedValue(null);
            that.getChild('repeatYMode').setSelectedValue(null);
            d = null;
        } else {
            d = resetRepeatUI();
        }
        if (that.selected !== undefined) {
            if (!that.styleData.bgr) {
                that.styleData.bgr = [];
            }
            that.styleData.bgr[that.selected] = d;
            that.emit('change', that.styleData);
        }
    });

    // size
    // ----
    function resetSizeUI() {
        var d = {
                size: [ 'auto', 'auto' ],
                value: [ 0, 0]
            },
            c;
        c = that.getChild('sizeXMode');
        if (!c.getSelectedValue()) {
            c.setSelectedValue(d.size[0]);
        }
        c = that.getChild('sizeYMode');
        if (!c.getSelectedValue()) {
            c.setSelectedValue(d.size[0]);
        }
        c = that.getChild('sizeXValue');
        if (!c.getValue()) {
            c.setValue(d.value[0]);
        }
        c = that.getChild('sizeYValue');
        if (!c.getValue()) {
            c.setValue(d.value[0]);
        }
        return d;
    }
    function updateSizeData(evtName) {
        var d;
        if (!that.getChild('sizeCheck').getValue()) {
            resetSizeUI();
            that.getChild('sizeCheck').setValue(true);
        }
        if (that.selected !== undefined) {
            d =  {
                size: [
                    that.getChild('sizeXMode').getSelectedValue(),
                    that.getChild('sizeYMode').getSelectedValue()
                ],
                value: [
                    that.getChild('sizeXValue').getValue(),
                    that.getChild('sizeYValue').getValue()
                ]
            };
            if (!that.styleData.bgs) {
                that.styleData.bgs = (d === null ? null : [d]);
            } else {
                that.styleData.bgs[that.selected] = d;
            }
            that.emit(evtName, that.styleData);
        }
    }

    function changeSizeData() {
        updateSizeData('change');
    }
    function previewSizeData() {
        updateSizeData('preview');
    }
    this.getChild('sizeXMode').on('change', changeSizeData);
    this.getChild('sizeXValue').on('change', changeSizeData);
    this.getChild('sizeXValue').on('preview', previewSizeData);
    this.getChild('sizeYMode').on('change', changeSizeData);
    this.getChild('sizeYValue').on('change', changeSizeData);
    this.getChild('sizeYValue').on('preview', previewSizeData);
    this.getChild('sizeCheck').on('change', function (c) {
        var d;
        if (!c) {
            that.getChild('sizeXMode').setSelectedValue(null);
            that.getChild('sizeYMode').setSelectedValue(null);
            that.getChild('sizeYValue').setValue(0);
            that.getChild('sizeXValue').setValue(0);
            d = null;
        } else {
            d = resetSizeUI();
        }
        if (that.selected !== undefined) {
            if (!that.styleData.bgs) {
                that.styleData.bgs = (d === null ? null : [d]);
            } else {
                that.styleData.bgs[that.selected] = d;
            }
            that.emit('change', that.styleData);
        }
    });

    // itemlist
    this.getChild('itemList').on('delete', function (n) {
        this.deleteItem(n);
        that.deleteData(n);
    }).on('select', function (n) {
        this.selectItem(n);
        that.selectData(n);
    });

}
StyleSettingBackgroundImage.prototype = new (domvisual.DOMElement)();
StyleSettingBackgroundImage.prototype.getConfigurationSheet = function () {
    return {  };
};
StyleSettingBackgroundImage.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingBackgroundImage.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingBackgroundImage.prototype.getNewGradient = function () {
    return {
        stops: [0, 1],
        colors: [
            {r: 0, g: 0, b: 0, a: 1},
            {r: 255, g: 255, b: 255, a: 1}
        ],
        type: 'vertical'
    };
};
StyleSettingBackgroundImage.prototype.getDefaultStyleData = function () {
    return {
        bgi: [ this.getNewGradient() ]
    };
};
/*
    bgp: 'backgroundPosition',
    bgs: 'backgroundSize',
    bgr: 'backgroundRepeat',
    bga: 'backgroundAttachment'
*/
StyleSettingBackgroundImage.prototype.setStyleData = function (st) {
    var sd = this.styleData = deepCopy(st),
        bgi = sd.bgi,
        that = this;
    // no style data
    if (!bgi) {
        sd = this.styleData = this.getDefaultStyleData();
        bgi = sd.bgi;
    } else if (!isArray(bgi)) {
        bgi = sd.bgi = [sd.bgi];
    }
    this.getChild('itemList').addItems(bgi.length
    ).selectItem(0);
    this.selectData(0);

};

StyleSettingBackgroundImage.prototype.showGradient = function () {
    this.getChild('image').setVisible(false);
    this.getChild('gradient').setVisible(true);
    this.getChild('imageSource').setSelectedValue('gradient');
};

StyleSettingBackgroundImage.prototype.showImage = function () {
    this.getChild('image').setVisible(true);
    this.getChild('gradient').setVisible(false);
    this.getChild('imageSource').setSelectedValue('url');
};

StyleSettingBackgroundImage.prototype.selectData = function (n) {
    this.selected = n;
    var sd = this.styleData,
        dat = sd.bgi[n];
    if (!dat) {
        dat = this.styleData.bgi[n] = this.getNewGradient();
    }
    if (isString(dat)) {
        this.showImage();
    } else {
        this.showGradient();
        this.getChild('gradient').setValue(dat);
    }
    // size
    if (!sd.bgs) {
        sd.bgs = [];
    }
    if (!sd.bgs[n]) {
        sd.bgs[n] = null;
    }
    if (sd.bgs && sd.bgs[n]) {
        dat = sd.bgs[n];
        this.getChild('sizeXMode'
        ).setSelectedValue(dat.size[0]);
        this.getChild('sizeXValue'
        ).setValue(dat.value[0]);
        this.getChild('sizeYMode'
        ).setSelectedValue(dat.size[1]);
        this.getChild('sizeYValue'
        ).setValue(dat.value[1]);
        this.getChild('sizeCheck').setValue(true);
    } else {
        this.getChild('sizeCheck').setValue(false);
    }

    // repeat
    if (!sd.bgr) {
        sd.bgr = [];
    }
    if (!sd.bgr[n]) {
        sd.bgr[n] = null;
    }
    if (sd.bgr && sd.bgr[n]) {
        dat = sd.bgr[n];
        this.getChild('repeatXMode').setSelectedValue(dat.repeat[0]);
        this.getChild('repeatYMode').setSelectedValue(dat.repeat[1]);
        this.getChild('repeatCheck').setValue(true);
    } else {
        this.getChild('repeatCheck').setValue(false);
    }

};

StyleSettingBackgroundImage.prototype.deleteData = function (n) {
    delete this.styleData.bgi[n];
    if (this.styleData.bgr) {
        delete this.styleData.bgr[n];
    }
    if (this.styleData.bgs) {
        delete this.styleData.bgs[n];
    }
    this.selectData(0);
    this.emit('change', this.styleData);
};

StyleSettingBackgroundImage.prototype.updateData = function (d) {
    if (this.selected !== undefined) {
        this.styleData.bgi[this.selected] = d;
    }
};

StyleSettingBackgroundImage.prototype.setEditor = function (editor) {
    this.editor = editor;
    this.loadImageUrls();
};

StyleSettingBackgroundImage.prototype.loadImageUrls = function () {
    var docInfo = this.editor.getDocInfo(),
        data = '',
        that = this;
    http.get(
        '/swallow/package/' + docInfo.factory + '/image',
        function (res) {
            res.on('data', function (d) {
                data += d;
            });
            res.on('end', function () {
                var jsonData = JSON.parse(data);
                that.getChild('image').setUrls(jsonData);
            });
        }
    );
};

exports.StyleSettingBackgroundImage = StyleSettingBackgroundImage;
