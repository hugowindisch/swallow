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
    ssevents = require('./services/ssevents');


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

jqtpl.template(
    'mainJs',
    fs.readFileSync(
        path.join(__dirname, 'templates/main.js')
    ).toString()
);


function getUrls(options) {
    var urls = pillow.getUrls(options);
    urls.unshift({
        filter: /^\/$/,
        handler: function (req, res, match) {
            // response comes from the http server
            res.setHeader("Location", "/make/launcher.Launcher.html");
            res.writeHead(302);
            res.end();
        }
    });

    urls.unshift({
        filter: /^\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.html$/,
        handler: servevisualcomponent.serveVisualComponent(options, false, false)
    });
    urls.unshift({
        filter: /^\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.mon$/,
        handler: servevisualcomponent.serveVisualComponent(options, false, true)
    });
    urls.unshift({
        filter: /^\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.edit$/,
        handler: servevisualcomponent.serveVisualComponent(options, true, false)
    });
    urls.unshift({
        filter: /^\/publish\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)$/,
        handler: function (req, res, match) {
            servevisualcomponent.publishVisualComponent(req, res, match, options);
        }
    });
    // sets the currently monitored application
    urls.unshift({
        filter: /^\/monitor\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)$/,
        handler: servevisualcomponent.monitor
    });
    urls.unshift({
        filter: /^\/monitor$/,
        handler: servevisualcomponent.monitor
    });
    urls.unshift({
        filter: /^\/m$/,
        handler: servevisualcomponent.redirectToMonitored
    });
    urls.push({
        filter: /^\/package$/,
        handler: function (req, res, match) {
            servepackagelist.servePackageList(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/package\/([a-z][a-zA-Z0-9]+)\/visual\/([A-Z][a-zA-Z0-9]+)$/,
        handler: function (req, res, match) {
            servevisual.serveVisual(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/package\/([a-z][a-zA-Z0-9]+)$/,
        handler: function (req, res, match) {
            servepackage.servePackage(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/package\/([a-z][a-zA-Z0-9]+)\/image$/,
        handler: function (req, res, match) {
            serveimagelist.serveImageList(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/events$/,
        handler: function (req, res, match) {
            ssevents.serveEvents(req, res, match, options);
        }
    });
    urls.push({
        filter: /^\/makehelp$/,
        handler: function (req, res, match) {
            servehelp.serveRebuildHelp(req, res, match, options);
        }
    });
    return urls;
}

exports.run = function () {
    var options = pillow.processArgs(
            process.argv.slice(2),
            pillow.argFilters
        ),
        swallowroot = path.join(__dirname, '../../..'),
        work = path.join(swallowroot, 'work'),
        packages;
    // choose appropriate defaults for all options
    options.css = true;
    options.cacheext = options.cacheext || [ 'png', 'jpg' ];
    options.work = options.work || work;
    work = options.work;
    options.newPackages = path.join(work, 'packages');
    options.dstFolder = path.join(work, 'generated');
    options.publishFolder = path.join(work, 'publish');
    packages = path.join(work, 'packages');
    options.srcFolder = options.srcFolder || [
        path.join(swallowroot, 'framework'),
        path.join(swallowroot, 'editor', 'ui'),
        packages
    ];
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
            pillow.serve(getUrls(options), options.port);

        } else {
            console.log(work + ' is not a directory, exiting');
            return;
        }
    } catch (error) {
        console.log('Cannot access work directory, error ' + error);
        return;
    }
};

// allow this file to be executed directly
if (process.argv[1] === __filename) {
    exports.run();
}
