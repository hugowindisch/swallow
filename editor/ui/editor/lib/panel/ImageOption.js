/**
    ImageOption.js

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
var utils = require('utils'),
    events = require('events'),
    forEachProperty = utils.forEachProperty;

/*
{
    'data1': [ selectedUrl, unselectedUrl, DOMImg]
}
}
*/
function ImageOption(options, optionalCheck) {
    this.options = options;
    this.optionalCheck = optionalCheck;
    var that = this,
        i,
        l = arguments.length,
        c;
    forEachProperty(options, function (o, name) {
        o[2].on('click', function () {
            that.setSelectedValue(name);
            if (optionalCheck) {
                optionalCheck.setValue(true);
            }
            that.emit('change', that.selected);
        });
    });
    if (optionalCheck) {
        optionalCheck.on('change', function (c) {
            if (!c) {
                that.setSelectedValue(null);
            }
            that.emit('change', that.selected);
        });
    }
}
ImageOption.prototype = new (events.EventEmitter)();
ImageOption.prototype.setSelectedValue = function (c) {
    var sel = this.selected,
        selOption;
    if (sel) {
        selOption = this.options[sel];
        selOption[2].setUrl(selOption[1]);
        delete this.selected;
    }
    selOption = this.options[c];
    if (selOption) {
        this.selected = c;
        selOption[2].setUrl(selOption[0]);
    }
    if (this.optionalCheck) {
        this.optionalCheck.setValue(Boolean(selOption));
    }
};
ImageOption.prototype.getSelectedValue = function (c) {
    return this.selected;
};

exports.ImageOption = ImageOption;
