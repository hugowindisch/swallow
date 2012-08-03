/**
    Layering.js

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
    utils = require('utils'),
    LayerInfo = require('./LayerInfo').LayerInfo,
    forEachProperty = utils.forEachProperty,
    forEach = utils.forEach;

function Layering(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.Layering);
}
Layering.prototype = new (domvisual.DOMElement)();
Layering.prototype.setTypeInfo = function (ti) {
    this.children.factoryName.setText(ti.factory);
    this.children.typeName.setText(ti.type);
};
Layering.prototype.getConfigurationSheet = function () {
    return { typeInfo: {} };
};
Layering.prototype.init = function (editor) {
    var viewer = editor.getViewer(),
        that = this;
    this.editor = editor;
    function refresh() {
        that.updateList();
    }
    // we don't want to update this if not update is needed
    viewer.on('selectionChanged', refresh);
    function checkIfLayeringChanged(command, name, message, hint, forEachSubCommand) {
        var layeringChanged = false;
        function check(name, message, hint) {
            if (hint && hint.layeringChanged) {
                layeringChanged = true;
            }
        }
        if (forEachSubCommand) {
            forEachSubCommand(check);
        }
        check(name, message, hint);
        if (layeringChanged) {
            refresh();
        }
    }
    viewer.on('command', checkIfLayeringChanged);
    viewer.on('setGroup', refresh);
    refresh();
};
Layering.prototype.updateList = function () {
    var viewer = this.editor.getViewer(),
        group = viewer.getGroup(),
        that = this,
        prevName,
        documentData,
        positions,
        it = [];

    if (group) {
        documentData = group.documentData;
        positions = documentData.positions;
        forEachProperty(documentData.positions, function (c, name) {
            it.push({name: name, order: c.order});
        });
        it.sort(function (i1, i2) {
            return i2.order - i1.order;
        });
        // remove the children that are not in the list
        forEachProperty(this.children, function (c, name) {
            if (!documentData.children[name]) {
                that.removeChild(name);
            }
        });
        // add the ones that are missing and update the others
        forEach(it, function (i) {
            var name = i.name,
                ch = that.getChild(name);

            if (!ch) {
                ch = new LayerInfo({contentName: name, viewer: viewer});
                ch.setHtmlFlowing({position: 'relative'}, true);
                that.addChild(ch, name);
            } else {
                // simply update it
                ch.updateAll();
            }
            that.orderAfter(name, prevName);
            prevName = name;
        });
        this.requestDimensions([
            groups.Layering.dimensions[0],
            // FIXME
            // quite a hack. We compensate for the borders because
            // the style is css based and has a 1 pixel border... quite ugly!
            it.length * (groups.LayerInfo.dimensions[1] + 2) + 10, 1
        ]);
    } else {
        this.removeAllChildren();
    }
};

exports.Layering = Layering;
