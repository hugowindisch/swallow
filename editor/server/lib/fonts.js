"use strict";
/**
    fonts.js

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
var fs = require('fs'),
    path = require('path'),
    installedFonts = [],
    genericFamilies = [
        'cursive',
        'fantasy',
        'monospace',
        'sans-serif',
        'serif'
    ],
    installedFamilies = [],
    families = [];
// we will discover the fonts once when we startup so we are very
// happy to do this synchronously
function scanFonts(publicFolder, folder) {
    var ret = [],
        isTTF = /\.ttf$/;
    fs.readdirSync(folder).forEach(function (f) {
        var p = path.join(folder, f),
            stat = fs.statSync(p),
            m;
        console.log(f);
        if (stat.isDirectory()) {
            ret = ret.concat(scanFonts(publicFolder, p));
        } else {
            m = isTTF.exec(f);
            if (m) {
                ret.push({
                    family: f.slice(0, -4),
                    url: path.relative(publicFolder, p)
                });
            }
        }
    });
    return ret;
}

function findFonts(publicFolder, folder) {
    scanFonts(publicFolder, folder).forEach(function (f) {
        installedFonts.push(f);
        installedFamilies.push(f.family);
    });
    installedFamilies.forEach(function (f) {
        families.push(f);
    });
    genericFamilies.forEach(function (f) {
        families.push(f);
    });
    exports.families = families.sort();
}
exports.findFonts = findFonts;
exports.installedFonts = installedFonts;
exports.genericFamilies = genericFamilies;
exports.installedFamilies = installedFamilies;
exports.families = families;
