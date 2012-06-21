var assert = require('assert'),
    events = require('events'),
    tester = new events.EventEmitter();

tester.run = function () {
    // done with no errors
    tester.emit('done', null);
};
module.exports = tester;
