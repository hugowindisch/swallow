/**
    Help.js

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

/**
* This package implements the help viewer and is not currently
* documented.
*
* @package helpviewer
* @skipdoc
*/
/*! */

var visual = require('visual'),
    domvisual = require('domvisual'),
    group = require('/helpviewer/lib/groups').groups.Help,
    http = require('http'),
    doxhtml = require('doxhtml'),
    utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    forEachSortedProperty = utils.forEachSortedProperty;

function Help(config) {
    var that = this;
    domvisual.DOMElement.call(this, config, group);
    this.showPackages();
    this.getChild('make').on('click', function () {
        that.makeHelp();
    }).setCursor('pointer');

}

Help.prototype = visual.inheritVisual(
    domvisual.DOMElement,
    group,
    'helpviewer',
    'Help'
);

Help.prototype.getConfigurationSheet = function () {
    return {  };
};

Help.prototype.makeHelp = function () {
    var that = this,
        req = http.request(
            { method: 'POST', path: '/makehelp' },
            function (res) {
                res.on('end', function (e) {
                    that.showPackages();
                });
            }
        );
    req.end();

};

Help.prototype.showPackages = function () {
    var data = '',
        that = this,
        packages = this.getChild('packages'),
        path = '/package';
    packages.setOverflow('auto').removeAllChildren();
    http.get({ path: path}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data);
            forEachSortedProperty(jsonData, function (descr, name) {
                var ch = packages.addTextChild('div', name);
                ch.on('click', function () {
                    that.showHelp(name);
                }).on('mouseover', function () {
                    this.setStyleAttributes({
                        color: { r: 150, g: 150, b: 150, a: 1}
                    });
                }).on('mouseout', function () {
                    this.setStyleAttributes({ color: null});
                }).setCursor(
                    'pointer'
                ).setHtmlFlowing({
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    paddingTop: '4px'
                });
            });
        });
        res.on('error', function (e) {
            alert('Error loading');
        });
    });
};

Help.prototype.showHelp = function (packageName) {
    var data = '',
        that = this,
        help = this.getChild('help'),
        pName = this.getChild('packageName'),
        helpPath = '/make/' + packageName + '/' + packageName + '.dox.json';
    help.setOverflow('auto');
    help.removeAllChildren();
    http.get({ path: helpPath}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data);
            help.addTextChild(
                'div'
            ).setHtmlFlowing({
                paddingLeft: '10px',
                paddingRight: '10px'
            }).setInnerHTML(
                doxhtml.jsonToHtml(jsonData)
            );
            pName.setText(packageName);
        });
        res.on('error', function (e) {
            alert('Error loading');
        });
    });
};

exports.Help = Help;
