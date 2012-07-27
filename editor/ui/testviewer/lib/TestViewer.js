/**
    TestViewer.js
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
/**
* This package implements the test viewer and is not currently
* documented.
*
* @package testviewer
* @skipdoc
*/
/*! */

var visual = require('visual'),
    domvisual = require('domvisual'),
    http = require('http'),
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty,
    forEachSortedProperty = utils.forEachSortedProperty,
    group = require('./groups').groups.TestViewer;
/*globals define */

function TestViewer(config) {
    var that = this;
    domvisual.DOMElement.call(this, config, group);
    this.getChild('lint').on('click', function () {
        that.runLint();
    });
    this.getChild('test').on('click', function () {
        that.runTest();
    });
    this.clear();
    this.enableTests(true);
    this.log('Choose Lint or Test to start testing');
}

TestViewer.prototype = visual.inheritVisual(
    domvisual.DOMElement,
    group,
    'testviewer',
    'TestViewer'
);

TestViewer.prototype.setForPreview = function (forPreview) {
    this.forPreview = forPreview;
};

TestViewer.prototype.getConfigurationSheet = function () {
    return {  };
};

TestViewer.prototype.clear = function () {
    this.getChild(
        'results'
    ).removeAllChildren(
    ).setOverflow(
        'auto'
    ).addTextChild(
        'div',
        '',
        null,
        'log'
    ).setHtmlFlowing({
        paddingLeft: '10px',
        paddingRight: '10px'
    });

};

TestViewer.prototype.log = function (str, tag, error) {
    var sattr = error ? { color: { r: 255, g: 0, b: 0, a: 1}} : null,
        results = this.getChild('results').getChild('log');
    tag = tag || 'p';
    results.addHtmlChild(tag, str).setStyleAttributes(sattr);
};

TestViewer.prototype.separator = function () {
    var results = this.getChild('results').getChild('log');
    results.addHtmlChild('hr', '');
};

TestViewer.prototype.loadPackages = function (cb) {
    var data = '',
        that = this,
        path = '/swallow/package';
    http.get({ path: path}, function (res) {
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            var jsonData = JSON.parse(data);
            that.packages = jsonData;
            if (cb) {
                cb(null);
            }
        });
        res.on('error', function (e) {
            if (cb) {
                cb(e);
            }
        });
    });
};

TestViewer.prototype.runLint = function () {
    var that = this;
    this.clear();
    that.log('Loading packages...');
    that.enableTests(false);
    function whenDone(err) {
        if (err) {
            that.log('Error while linting: ' + err);
        } else {
            that.log('done linting');
        }
        that.enableTests(true);
    }
    this.loadPackages(function (err) {
        if (err) {
            return whenDone(err);
        }
        that.makeLint(function (err) {
            if (err) {
                return whenDone(err);
            }
            that.separator();
            that.showLint(whenDone);
        });
    });
};

TestViewer.prototype.makeLint = function (cb) {
    var that = this,
        path = '/swallow/makelint',
        req;
    that.log('Regenerating lint results...');
    req = http.request({ path: path, method: 'POST'}, function (res) {
        res.on('end', function () {
            if (cb) {
                cb(null);
            }
        });
        res.on('error', function (e) {
            if (cb) {
                cb(e);
            }
        });
    });
    req.end();
};

TestViewer.prototype.showLint = function (cb) {
    var that = this,
        lintRes = {},
        toLoad = 1;

    function loaded() {
        toLoad -= 1;
        if (toLoad === 0) {
            forEachSortedProperty(lintRes, function (res, name) {
                that.logLintRecord(name, res);
            });
            cb(null);
        }
    }

    forEachProperty(this.packages, function (p, name) {
        var data = '',
            path = '/swallow/make/' + name + '/' + name + '.lint.json';
        toLoad += 1;
        http.get(
            { path: path},
            function (res) {
                res.on('data', function (d) {
                    data += d;
                });
                res.on('end', function () {
                    lintRes[name] = JSON.parse(data);
                    loaded();
                });
                res.on('error', function () {
                    loaded();
                });
            }
        );
    });
    loaded();
};

TestViewer.prototype.logLintRecord = function (packageName, record) {
    var that = this;
    function caret(pos) {
        var s = '';
        while (pos > 1) {
            s += ' ';
            pos -= 1;
        }
        s += '^';
        return s;
    }

    this.log(packageName, 'h2');
    forEachProperty(record, function (results, filename) {
        var erroneous = results !== true,
            skipped = erroneous && (results[0].evidence.indexOf('/*jslint fails') >= 0),
            statusStr = erroneous ?
                (skipped ? ' ** skipped (not jslint compliant) **' : '') :
                ' ok';
        that.log(filename + statusStr, 'h3', erroneous);
        if (erroneous && !skipped) {
            forEach(results, function (err) {
                if (err === null) {
                    that.log('(lint stopped, too many errors)', 'b');
                } else {
                    that.log(err.id +
                        ': ' +
                        err.reason +
                        ' at line ' +
                        err.line, 'b', true
                    );
                    that.log(err.evidence, 'pre', true);
                    that.log(caret(err.character), 'pre', true);
                }
            });
        }
    });
    this.separator();
};

TestViewer.prototype.enableTests = function (enable) {
    this.testsEnabled = enable;
    if (enable) {
        this.getChild('lint').setOpacity(1).setCursor('pointer');
        this.getChild('test').setOpacity(1).setCursor('pointer');
    } else {
        this.getChild('lint').setOpacity(0.5).setCursor(null);
        this.getChild('test').setOpacity(0.5).setCursor(null);
    }

};

TestViewer.prototype.runTest = function () {
    var that = this;
    this.clear();
    that.log('Loading package list...');
    this.enableTests(false);
    function whenDone(err) {
        that.separator();
        if (err) {
            that.log('Error while testing: ' + err);
        } else {
            that.log('done testing');
        }
        that.enableTests(true);
        // because of the fucked up dual app domain
        visual.update();
    }
    this.loadPackages(function (err) {
        if (err) {
            return whenDone(err);
        }
        that.makeTest(function (err) {
            if (err) {
                return whenDone(err);
            }
            that.showTest(whenDone);
        });
    });
};

TestViewer.prototype.makeTest = function (cb) {
    var that = this,
        path = '/swallow/maketest',
        req;
    that.log('Rebuilding test packages...');
    req = http.request({ path: path, method: 'POST'}, function (res) {
        res.on('end', function () {
            if (cb) {
                cb(null);
            }
        });
        res.on('error', function (e) {
            if (cb) {
                cb(e);
            }
        });
    });
    req.end();
};

TestViewer.prototype.showTest = function (cb) {
    var toRun = [],
        that = this,
        willTest = '',
        willNotTest = '';


    that.log('Testing...');
    forEachSortedProperty(this.packages, function (pack, name) {
        var scripts = pack.scripts;
        if (scripts && scripts.test) {
            // we should run this test
            toRun.push(pack);
            // update the string of what we will test
            if (willTest !== '') {
                willTest += ', ';
            }
            willTest += name;
        } else {
            // update the string of what we will not test
            if (willNotTest !== '') {
                willNotTest += ', ';
            }
            willNotTest += name;
        }
    });

    that.log('WARNING: The following packages don\'t have a test script : ' +
        willNotTest +
        ' and will not be tested!', 'b', true);
    that.log('Packages that will be tested: ' + willTest);

    that.separator();

    function runTest(runned, cb) {
        if (runned < toRun.length) {
            var pack = toRun[runned];
            that.log('Testing package ' + pack.name, 'h1');
            that.loadPackageForTesting(pack.name, function (err, testRequire) {
                if (err) {
                    that.log('Error loading ' + pack.name + ' skipping', 'b');
                }
                that.runPackageTests(
                    testRequire,
                    pack.name,
                    pack.scripts.test,
                    function (err) {
                        if (err) {
                            that.log(
                                'Error running test script for package ' +
                                pack.name +
                                ' skipping', 'b'
                            );
                        }
                        runTest(runned + 1, cb);
                    }
                );
            });
        } else {
            return cb(null);
        }
    }

    // we will run all tests sequencially
    runTest(0, cb);

};

TestViewer.prototype.loadPackageForTesting = function (packageName, cb) {
    this.log('Loading package ' +
        packageName +
        ' in its own app domain...', 'div'
    );
    // We create an application domain
    var appDomain = define.pillow.createApplicationDomain();
    // We load the package 'for testing'
    visual.loadPackage(packageName, appDomain, true, true, function (err) {
        if (err) {
            return cb(err);
        }
        cb(null, define.pillow.makeRequire(appDomain, ''));
    });
};

TestViewer.prototype.runPackageTests = function (
    testRequire,
    packName,
    testscript,
    cb
) {
    this.log('Running test script for package ' + packName + ' ...', 'div');
    testscript = testscript.split('.');
    testscript.pop();
    testscript = testscript.join('.');
    var module = packName + '/' + testscript,
        pack,
        err,
        done,
        errors = 0,
        testsDone = false,
        timeout = null,
        that = this;

    // watch dog
    function watchDogClear() {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
    }
    function watchDogRestart() {
        watchDogClear();
        timeout = setTimeout(
            function () {
                that.log('*** TIMEOUT! this seems to be stalled!');
                done();
            },
            1000
        );
    }
    // async testing stuff
    function test(f) {
        var l = arguments.length,
            i = 1,
            args = [],
            ret;
        test.total += 1;
        while (i < l) {
            args.push(arguments[i]);
            i += 1;
        }
        try {
            ret = f.apply(this, args);
        } catch (e) {
            if (!testsDone) {
                watchDogRestart();
                that.log('ERROR: ' + e, null, true);
                errors += 1;
            }
        }
        return ret;
    }
    test.total = -1;
    // all tests done
    done = function () {
        if (!testsDone) {
            watchDogClear();
            testsDone = true;
            if (errors) {
                that.log(
                    errors +
                        ' error' +
                        (errors === 1 ? '' : 's') +
                        ' in ' +
                        test.total +
                        ' tests',
                    null,
                    true
                );
            } else {
                that.log('No error in ' + test.total + ' tests');
            }
            cb(null);
        }
    };

    // start testing
    try {
        pack = testRequire(packName + '/' + testscript);
    } catch (e) {
        err = e;
    }
    // reporting
    if (err) {
        this.log('ERROR: ' + err, null, true);
        cb(null);
    } else {
        if (typeof pack.run === 'function') {
            this.log('Starting asynchronous testing through run...');
            watchDogRestart();
            // FIXME: we would need some kind of heartbeat
            // this call will return true if it wants async testing
            test(function () {
                return pack.run(test, done);
            });
            // if we had errors just running run, it is unlikely that
            // done will be called
            if (errors) {
                done();
            }
        } else {
            this.log('no run function in test script... probably intentional');
            this.log('ok');
            cb(null);
        }
    }
};

exports.TestViewer = TestViewer;
