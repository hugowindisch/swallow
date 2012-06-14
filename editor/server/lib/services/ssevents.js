/**
    ssevents.js

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
var events = require('events'),
    theMessageCount = 0,
    emitter = new events.EventEmitter();

function serveEvents(req, res, match, options) {
    // setup the response and socket
    req.socket.setTimeout(1000000);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
    // create our event handler
    function eventHandler(message, data) {
        theMessageCount += 1; // Increment our message count
        res.write('id: ' + theMessageCount + '\n');
        res.write('event: ' + message + '\n');
        res.write("data: " + JSON.stringify(data) + '\n\n'); // Note the extra newline
    }
    // hook it to the emitter
    emitter.on('sse', eventHandler);

    req.on('close', function () {
        emitter.removeListener('sse', eventHandler);
    });
}

function emit(type, data) {
    emitter.emit('sse', type, data);
}

exports.serveEvents = serveEvents;
exports.emit = emit;
