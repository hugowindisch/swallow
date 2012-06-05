#!/usr/bin/node
/**
    editsrvr.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals __dirname */

var meatgrinder = require('meatgrinder'),
    jqtpl = require('jqtpl'),
    fs = require('fs'),
    path = require('path'),
    servevisual = require('./services/servevisual'),
    servepackage = require('./services/servepackage'),
    servepackagelist = require('./services/servepackagelist'),
    serveimagelist = require('./services/serveimagelist'),
    servevisualcomponent = require('./services/servevisualcomponent'),
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
    var urls = meatgrinder.getUrls(options);
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
        handler: servevisualcomponent.serveVisualComponent(options, false)
    });
    urls.unshift({
        filter: /^\/make\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)\.edit$/,
        handler: servevisualcomponent.serveVisualComponent(options, true)
    });
    urls.unshift({
        filter: /^\/publish\/([a-z][a-zA-Z0-9]+)\.([A-Z][a-zA-Z0-9]+)$/,
        handler: function (req, res, match) {
            servevisualcomponent.publishVisualComponent(req, res, match, options);
        }
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
    return urls;
}

meatgrinder.serve(
    getUrls(
        meatgrinder.processArgs(process.argv.slice(2))
    )
);
