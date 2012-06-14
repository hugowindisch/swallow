/**
    serve.js

    Copyright (C) 2012 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
*/
/*globals __filename */
var http = require('http'),
    scan = require('./scan'),
    urls = require('./urls'),
    url = require('url');

/**
    This function will serve the 'urls' mappings ({regexp: function})
    passing req, res and the match from the regexp to function.
*/
function serve(urls, port) {
    port = port || 1337;
    http.createServer(function (req, res) {
        var i,
            l = urls.length,
            m,
            h,
            parsedUrl = url.parse(req.url),
            pathname = parsedUrl.pathname,
            success;
        for (i = 0; i < l; i += 1) {
            h = urls[i];
            m = h.filter.exec(pathname);
            if (m) {
                try {
                    h.handler(req, res, m);
                    success = true;
                } catch (e) {
                    console.log('*** Exception In ' + req.url + ' error ' + e);
                }
                break;
            }
        }
        if (!success) {
            res.writeHead(404);
            res.end();
        }
    }).listen(port, '0.0.0.0');
    console.log('Server running on local host port ' + port);
}
// library support
exports.serve = serve;
exports.getUrls = urls.getUrls;
exports.makeAll = scan.makeAll;
exports.makePackage = scan.makePackage;
exports.makeFile = scan.makeFile;
exports.processArgs = scan.processArgs;
exports.argFilters = scan.argFilters;
exports.findPackages = scan.findPackages;
