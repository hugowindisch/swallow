/**
    VisualModule.js

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
/*globals window */
var visual = require('visual'),
    domvisual = require('domvisual'),
    http = require('http'),
    group = require('/launcher/lib/groups').groups.VisualModule;

function VisualModule(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, group);
    var that = this;

    this.setCursor('pointer');
    this.on('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.emit('select', this.selected);
    });
    if (this.selected === undefined) {
        this.setSelected(false);
    }
    this.getChild('run').on('click', function () {
        var ti = that.typeInfo;
        window.open(ti.factory + '.' + ti.type + '.html', '_blank');
    });
    this.getChild('publish').on('click', function () {
        var ti = that.typeInfo;
        http.get({ path: '/publish/' + ti.factory + '.' + ti.type}, function (res) {
            res.on('error', function (e) {
                alert('Error loading');
            });
        });

    });
    this.getChild('monitor').on('click', function () {
        var ti = that.typeInfo,
            req = http.request(
                { method: 'POST', path: '/monitor/' + ti.factory + '.' + ti.type},
                function (res) {
                    res.on('error', function (e) {
                        alert('Error setting monitored application');
                    });
                }
            );
        req.end();
    });
    this.getChild('edit').on('click', function () {
        var ti = that.typeInfo;
        window.open(ti.factory + '.' + ti.type + '.edit', '_blank');
    });
    this.getChild('delete').on('click', function () {
        var ti = that.typeInfo,
            req = http.request(
                {
                    method: 'DELETE',
                    path: '/package/' + ti.factory + '/visual/' + ti.type
                },
                function (res) {
                    res.on('error', function (e) {
                        alert('Error deleting');
                    });
                }
            );
        req.end();
    });
}
VisualModule.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'launcher', 'VisualModule');
VisualModule.prototype.getConfigurationSheet = function () {
    return {  };
};
VisualModule.prototype.setName = function (name) {
    this.getChild('name').setText(name);
};
VisualModule.prototype.setDescription = function (description) {
    this.getChild('description').setText(description);
};
VisualModule.prototype.setPreview = function (Preview) {
    var preview;
    if (Preview.createPreview) {
        // specific preview
        preview = Preview.createPreview();
    } else {
        // generic preview
        preview = new Preview({});
        preview.setOverflow('hidden');
        preview.enableScaling(true);
    }
    preview.setPosition('preview');
    preview.enableInteractions(false);
    this.addChild(preview, 'preview');
};
VisualModule.prototype.setTypeInfo = function (typeInfo) {
    this.typeInfo = typeInfo;
};

VisualModule.prototype.setSelected = function (s) {
    this.selected = s;
    this.getChild('edit').setVisible(s);
    this.getChild('run').setVisible(s);
    this.getChild('publish').setVisible(s);
    this.getChild('monitor').setVisible(s);
    this.getChild('delete').setVisible(s);



    this.getChild('background').setTransition(500).setStyle(s ? 'select' : 'normal');
};

VisualModule.prototype.setMonitored = function (m) {
    this.getChild('monitored').setVisible(m);
};


exports.VisualModule = VisualModule;
