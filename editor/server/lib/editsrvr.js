#! /usr/bin/env node
/**
    editsrvr.js

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
/*globals __dirname, __filename */
/*jslint regexp: false */

var pillow = require('pillow'),
    jqtpl = require('jqtpl'),
    fs = require('fs'),
    path = require('path'),
    servevisual = require('./services/servevisual'),
    servepackage = require('./services/servepackage'),
    servepackagelist = require('./services/servepackagelist'),
    serveimagelist = require('./services/serveimagelist'),
    serveassets = require('./services/serveassets'),
    servevisualcomponent = require('./services/servevisualcomponent'),
    servehelp = require('./services/servehelp'),
    servetests = require('./services/servetests'),
    ssevents = require('./services/ssevents'),
    swallowroot = path.join(__dirname, '../../..'),
    work = path.join(swallowroot, 'work');


jqtpl.template(
    'jsFile',
    fs.readFileSync(
        path.join(__dirname, 'templates/visual.js')
    ).toString()
);

jqtpl.template(
    'groupFile',
    fs.readFileSync(
        path.join(__dirname, 'templates/groups.js')
    ).toString()
);

jqtpl.template(
    'visualComponent',
    fs.readFileSync(
        path.join(__dirname, 'templates/visualComponent.html')
    ).toString()
);

jqtpl.template(
    'packageJson',
    fs.readFileSync(
        path.join(__dirname, 'templates/packageJson')
    ).toString()
);


function getUrls(forMiddleWare) {
    var urls = [];
    if (!forMiddleWare) {
        urls.push({
            filter: /^\/$/,
            handler: function (req, res, match) {
                // response comes from the http server
                res.setHeader("Location", "/swallow/make/launcher.Launcher.html");
                res.writeHead(302);
                res.end();
            }
        });
    }
    urls.push({
        filter: /^\/swallow\/make\/([a-z][a-zA-Z0-9_]+)\.([A-Z][a-zA-Z0-9]+)\.html$/,
        handler: servevisualcomponent.serveVisualComponent(false, false)
    });
    urls.push({
        filter: /^\/swallow\/make\/([a-z][a-zA-Z0-9_]+)\.([A-Z][a-zA-Z0-9]+)\.mon$/,
        handler: servevisualcomponent.serveVisualComponent(false, true)
    });
    urls.push({
        filter: /^\/swallow\/make\/(.*)$/,
        handler: pillow.makeAndServe
    });
    urls.push({
        filter: /^\/swallow\/publish\/([a-z][a-zA-Z0-9_]+)\.([A-Z][a-zA-Z0-9]+)$/,
        handler: servevisualcomponent.publishVisualComponent
    });
    // sets the currently monitored application
    urls.push({
        filter: /^\/swallow\/monitor\/([a-z][a-zA-Z0-9_]+)\.([A-Z][a-zA-Z0-9]+)$/,
        handler: servevisualcomponent.monitor
    });
    urls.push({
        filter: /^\/swallow\/monitor$/,
        handler: servevisualcomponent.monitor
    });
    urls.push({
        filter: /^\/swallow\/m$/,
        handler: servevisualcomponent.redirectToMonitored
    });
    urls.push({
        filter: /^\/swallow\/package$/,
        handler: servepackagelist.servePackageList
    });
    urls.push({
        filter: /^\/swallow\/package\/([a-z][a-zA-Z0-9_]+)\/visual\/([A-Z][a-zA-Z0-9]+)$/,
        handler: servevisual.serveVisual
    });
    urls.push({
        filter: /^\/swallow\/package\/([a-z][a-zA-Z0-9_]+)$/,
        handler: servepackage.servePackage
    });
    urls.push({
        filter: /^\/swallow\/package\/([a-z][a-zA-Z0-9_]+)\/image$/,
        handler: serveimagelist.serveImageList
    });
    urls.push({
        filter: /^\/swallow\/package\/([a-z][a-zA-Z0-9_]+)\/uploadassets$/,
        handler: serveassets.serveUploadAssets
    });
    urls.push({
        filter: /^\/swallow\/events$/,
        handler: ssevents.serveEvents
    });
    urls.push({
        filter: /^\/swallow\/makehelp$/,
        handler: servehelp.serveRebuildHelp
    });
    urls.push({
        filter: /^\/swallow\/makelint$/,
        handler: servetests.serveRebuildLint
    });
    urls.push({
        filter: /^\/swallow\/maketest$/,
        handler: servetests.serveRebuildTest
    });
    urls.push({
        filter: /^\/swallow\/testhttp(.*)$/,
        handler: servetests.serveTestHttp
    });
    urls.push({
        filter: /^\/swallow\/testevent\/([a-z][a-zA-Z0-9]+)$/,
        handler: servetests.serveTestEvent
    });
    return urls;
}

function fixOptions(options) {
    options.css = true;
    options.cacheext = options.cacheext || [ 'png', 'jpg' ];
    options.work = options.work || work;
    options.newPackages = path.join(options.work, 'packages');
    options.dstFolder = path.join(options.work, 'generated');
    options.publishFolder = path.join(options.work, 'publish');
    options.srcFolder = options.srcFolder || [
        path.join(swallowroot, 'framework'),
        path.join(swallowroot, 'editor', 'ui'),
        path.join(swallowroot, 'samples'),
        options.newPackages
    ];
    return options;
}

function getDefaultOptions() {
    var options = pillow.processArgs(process.argv.slice(2), pillow.argFilters);
    // patch the options
    return fixOptions(options);
}

function createWorkingFolders(options) {
    var work = options.work,
        packages = options.newPackages;

    // create the work directory if it is missing
    if (!fs.existsSync(work)) {
        fs.mkdirSync(work);
    }
    // create the package directory if it is missing
    if (!fs.existsSync(packages)) {
        fs.mkdirSync(packages);
    }
}

exports.run = function () {
    var options = getDefaultOptions();

    // Make sure we have the directory structure that we need before
    // we start.
    createWorkingFolders(options);
    // we are now ready to run
    pillow.serve(getUrls(false), options);
};

exports.getMiddleWare = function (options) {
    if (typeof options !== 'function') {
        options = fixOptions(options || {});
        // Make sure we have the directory structure that we need before
        // we start.
        createWorkingFolders(options);
    }
    // return the middleware
    return pillow.getMiddleWare(getUrls(true), options);
};

// allow this file to be executed directly
if (process.argv[1] === __filename) {
    exports.run();
}
