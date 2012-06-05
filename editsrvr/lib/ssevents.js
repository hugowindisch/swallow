/**
    ssevents.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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
