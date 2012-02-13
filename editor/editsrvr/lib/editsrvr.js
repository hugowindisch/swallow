#!/usr/local/bin/node
/**
    editsrvr.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*jslint regexp: false */
var meatgrinder = require('meatgrinder');

function serveVisual(req, res, options) {
    console.log('serveVisual ');
    console.log(req);
}

function getUrls(options) {
    var urls = meatgrinder.getUrls(options);
    urls.push({
        filter: /^\/visual\/(.*)$/, 
        handler: function (req, res, match) {
            serveVisual(req, res, match, options);
        }
    });
    return urls;
}

meatgrinder.serve(
    getUrls(
        meatgrinder.processArgs(process.argv.slice(2))
    )
);
