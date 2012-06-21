var assert = require('../lib/assert');
exports.run = function (test, done) {
    // done with no errors
    test(assert, true);
    test(assert, false);
    // we don't want async testing and will never call done
    done();
};
