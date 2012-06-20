/**
    TestViewer.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    http = require('http'),
    utils = require('utils'),
    forEach = utils.forEach,
    forEachProperty = utils.forEachProperty,
    forEachSortedProperty = utils.forEachSortedProperty,
    group = require('/testviewer/lib/groups').groups.TestViewer;

function TestViewer(config) {
    var that = this;
    domvisual.DOMElement.call(this, config, group);
    this.getChild(
        'results'
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
    // lazy: we load and lint in cascade
    if (!this.forPreview) {
        this.loadPackages(function (err) {
            if (!err) {
                that.makeLint(function (err) {
                    that.showLint();
                });
            }
        });
    }
}

TestViewer.createPreview = function () {
    var ret = new TestViewer({forPreview: true});
    ret.setOverflow('hidden');
    ret.enableScaling(true);
    return ret;
};

TestViewer.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'testviewer', 'TestViewer');

TestViewer.prototype.setForPreview = function (forPreview) {
    this.forPreview = forPreview;
};

TestViewer.prototype.getConfigurationSheet = function () {
    return {  };
};

TestViewer.prototype.loadPackages = function (cb) {
    var data = '',
        that = this,
        path = '/package';
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

TestViewer.prototype.makeLint = function (cb) {
    var that = this,
        path = '/makelint',
        req;
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

TestViewer.prototype.showLint = function () {
    var that = this,
        lintRes = {},
        toLoad = 1;

    function loaded() {
        toLoad -= 1;
        if (toLoad === 0) {
            forEachSortedProperty(lintRes, function (res, name) {
                that.logLintRecord(name, res);
            });
        }
    }

    forEachProperty(this.packages, function (p, name) {
        var data = '',
            path = '/make/' + name + '/' + name + '.lint.json';
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

    this.log('h2', packageName);
    forEachProperty(record, function (results, filename) {
        var erroneous = results !== true,
            sattr = erroneous ? { color: { r: 255, g: 0, b: 0, a: 1}} : null;
        that.log('h3', filename + (erroneous ? '' : ' ok'), sattr);
        if (erroneous) {
            forEach(results, function (err) {
                if (err === null) {
                    that.log('b', '(more)');
                } else {
                    that.log('b', err.id + ': ' + err.reason + ' at line ' + err.line, sattr);
                    that.log('pre', err.evidence, sattr);
                    that.log('pre', caret(err.character), sattr);
                }
            });
        }
    });
    this.separator();
};

TestViewer.prototype.log = function (tag, str, sattr) {
    var results = this.getChild('results').getChild('log');
    results.addHtmlChild(tag, str).setStyleAttributes(sattr);
};

TestViewer.prototype.separator = function () {
    var results = this.getChild('results').getChild('log');
    results.addHtmlChild('hr', '');
};

exports.TestViewer = TestViewer;
