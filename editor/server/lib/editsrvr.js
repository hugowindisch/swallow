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


function getUrls() {
    var urls = [];
    urls.push({
        filter: /^\/$/,
        handler: function (req, res, match) {
            // response comes from the http server
            res.setHeader("Location", "/swallow/make/launcher.Launcher.html");
            res.writeHead(302);
            res.end();
        }
    });
    urls.push({
        filter: /^\/swallow\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.html$/,
        handler: servevisualcomponent.serveVisualComponent(false, false)
    });
    urls.push({
        filter: /^\/swallow\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.mon$/,
        handler: servevisualcomponent.serveVisualComponent(false, true)
    });
    urls.push({
        filter: /^\/swallow\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.edit$/,
        handler: servevisualcomponent.serveVisualComponent(true, false)
    });
    urls.push({
        filter: /^\/swallow\/make\/(.*)$/,
        handler: pillow.makeAndServe
    });
    urls.push({
        filter: /^\/swallow\/publish\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)$/,
        handler: servevisualcomponent.publishVisualComponent
    });
    // sets the currently monitored application
    urls.push({
        filter: /^\/swallow\/monitor\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)$/,
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
        filter: /^\/swallow\/package\/([a-z][a-zA-Z0-9]+)\/visual\/([A-Z][a-zA-Z0-9]+)$/,
        handler: servevisual.serveVisual
    });
    urls.push({
        filter: /^\/swallow\/package\/([a-z][a-zA-Z0-9]+)$/,
        handler: servepackage.servePackage
    });
    urls.push({
        filter: /^\/swallow\/package\/([a-z][a-zA-Z0-9]+)\/image$/,
        handler: serveimagelist.serveImageList
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
    options.newPackages = path.join(work, 'packages');
    options.dstFolder = path.join(work, 'generated');
    options.publishFolder = path.join(work, 'publish');
    options.srcFolder = options.srcFolder || [
        path.join(swallowroot, 'framework'),
        path.join(swallowroot, 'editor', 'ui'),
        path.join(swallowroot, 'samples'),
        options.newPackages
    ];
    return options;
};

function getDefaultOptions() {
    var options = pillow.processArgs(
            process.argv.slice(2),
            pillow.argFilters);

    // patch the options
    return fixOptions(options);
}

exports.run = function () {
    var options = getDefaultOptions();
        work = options.work,
        packages = options.newPackages;

    // Make sure we have the directory structure that we need before
    // we start.
    // Note: no need for parallelism here (we are starting up). Let's
    // check that the work folder
    // exists and that the packages folder exists
    // we will not create the work folder but we will create the
    // packages folder if it is missing
    try {
        // do we have a work directory?
        if (fs.statSync(work).isDirectory()) {
            try {
                // do we have a packages directory in our work directory?
                if (!fs.statSync(packages).isDirectory()) {
                    console.log(packages + ' is not a directory, exiting');
                    return;
                }
            } catch (e) {
                try {
                    // can we actually create the packages directory
                    fs.mkdirSync(packages);
                } catch (err) {
                    console.log(
                        'Could not create ' + packages + ' because of ' + err
                    );
                    return;
                }
            }
            // we are now ready to run
            pillow.serve(getUrls(), options);

        } else {
            console.log(work + ' is not a directory, exiting');
            return;
        }
    } catch (error) {
        console.log('Cannot access work directory, error ' + error);
        return;
    }
};

exports.getMiddleWare = function (options) {
    options = options || fixOptions({});
    return pillow.getMiddleWare(getUrls(), options);
}

// allow this file to be executed directly
if (process.argv[1] === __filename) {
    exports.run();
}
