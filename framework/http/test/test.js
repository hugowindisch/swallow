var assert = require('assert');

exports.run = function (test, done) {
    // done with no errors
    test(assert, true);
    test(assert, false);
    done();
};
