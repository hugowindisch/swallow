/**
    domquery.js
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
/*jslint regexp: false*/

/**
* This package provides a way of querying and manipulating the dom by using
* selectors.
*
* @package domquery
*/

function eqs(s1, s2) {
    return (typeof s1 === 'string') &&
        (typeof s2 === 'string') &&
        (s1.toLowerCase() === s2.toLowerCase());
}

var utils = require('utils'),
    domvisual = require('domvisual'),
    visual = require('visual'),
    forEach = utils.forEach,
    isString = utils.isString,
    isArray = utils.isArray,
    // checks for the different parts that we need
    eatWhite = /^ +/,
    selElement = /^((([a-zA-Z0-9]+)|\*)\|)?(([a-zA-Z0-9]+)|\*)/,
    selModifiers = [
        // attribute
        {
            filter: /^\[([a-zA-Z0-9]*)\]/,
            action: function (m, tests) {
                tests.push(function (elem) {
                    return elem.getAttribute(m[1]) !== null;
                });
                return tests;
            }
        },
        // attribute with equality
        {
            filter: /^\[([a-zA-Z0-9\-]*)([~\^$\*|])?="([^"]*)"\]/,
            action: function (m, tests) {
                switch (m[2]) {
                case '~':
                    tests.push(function (elem) {
                        var v = elem.getAttribute(m[1]),
                            ret = false;
                        if (isString(v)) {
                            v = v.split(' ');
                            forEach(v, function (s) {
                                if (s === m[3]) {
                                    ret = true;
                                }
                            });
                        }
                        return ret;
                    });
                    break;
                case '^':
                    tests.push(function (elem) {
                        var s = elem.getAttribute(m[1]),
                            ret = false;
                        if (isString(s)) {
                            ret = m[3].indexOf(s) === 0;
                        }
                        return ret;
                    });
                    break;
                case '$':
                    tests.push(function (elem) {
                        var s = elem.getAttribute(m[1]),
                            ret = false;
                        if (isString(s)) {
                            ret = m[3].lastIndexOf(s) ===
                                (m[3].length - s.length);
                        }
                        return ret;
                    });
                    break;
                case '*':
                    tests.push(function (elem) {
                        var s = elem.getAttribute(m[1]),
                            ret = false;
                        if (isString(s)) {
                            ret = m[3].indexOf(s) !== -1;
                        }
                        return ret;
                    });
                    break;
                case '|':
                    tests.push(function (elem) {
                        var s = elem.getAttribute(m[1]),
                            ret = false;
                        if (isString(s)) {
                            s = s.split('-');
                            ret = (m[3] === s[0]);
                        }
                        return ret;
                    });
                    break;
                default:
                    tests.push(function (elem) {
                        return elem.getAttribute(m[1]) === m[3];
                    });
                    break;
                }
                return tests;
            }
        },
        // double semicolon
        {
            filter: /^::[a-zA-Z0-9\-]+/,
            action: function (m, tests) {
                // FIXME: not supported
                return tests;
            }
        },
        // class
        {
            filter: /^\.([a-zA-Z0-9\-]+)/,
            action: function (m, tests) {
                tests.push(function (elem) {
                    return eqs(elem.getAttribute('class'), m[1]);
                });
                return tests;
            }
        },
        // id
        {
            filter: /^#([a-zA-Z0-9\-]+)/,
            action: function (m, tests) {
                tests.push(function (elem) {
                    return eqs(elem.getAttribute('id'), m[1]);
                });
                return tests;
            }
        },
        // semicolon
        {
            filter: /^:([a-zA-Z0-9\-]+)(\(([a-zA-Z0-9]+)\))?/,
            action: function (m, tests) {
                switch (m[1]) {
                case 'root':
                    tests.push(function (elem) {
                        return document.documentElement === elem;
                    });
                    break;
                case 'nth-child':
                    tests.push(function (elem) {
                        var n = Number(m[3]),
                            ret = false;
                        if (n !== undefined && elem.parentNode) {
                            ret = elem.parentNode.childNodes.item(n) === elem;
                        }
                        return ret;
                    });
                    break;
                case 'nth-of-type':
                    // FIXME: not supported
                    break;
                case 'nth-last-of-type':
                    // FIXME: not supported
                    break;
                case 'first-child':
                    tests.push(function (elem) {
                        return elem.parentNode.firstChild === elem;
                    });
                    break;
                case 'last-child':
                    tests.push(function (elem) {
                        return elem.parentNode.lastChild === elem;
                    });
                    break;
                case 'first-of-type':
                    // FIXME: not supported
                    break;
                case 'last-of-type':
                    // FIXME: not supported
                    break;
                case 'only-child':
                    tests.push(function (elem) {
                        return elem.parentNode.lastChild === elem &&
                            elem.parentNode.firstChild === elem;
                    });
                    break;
                case 'only-of-type':
                    // FIXME: not supported
                    break;
                case 'empty':
                    tests.push(function (elem) {
                        return elem.firstChild === null;
                    });
                    break;
                case 'link':
                    tests.push(function (elem) {
                        return eqs(elem.nodeName, 'link');
                    });
                    break;
                case 'visited':
                    // FIXME: not supported
                    break;
                case 'active':
                    // FIXME: not supported
                    break;
                case 'hover':
                    // FIXME: not supported
                    break;
                case 'focus':
                    // FIXME: not supported
                    break;
                case 'target':
                    // FIXME: not supported
                    break;
                case 'lang':
                    tests.push(function (elem) {
                        return eqs(elem.lang, m[3]);
                    });
                    break;
                case 'enabled':
                    tests.push(function (elem) {
                        return elem.disabled === false;
                    });
                    break;
                case 'disabled':
                    tests.push(function (elem) {
                        return elem.disabled === true;
                    });
                    break;
                case 'checked':
                    tests.push(function (elem) {
                        return elem.checked === true;
                    });
                    break;
                }
                return tests;
            }
        }
    ],
    selRelationships = [
        {
            filter: /^ *>/,
            action: function (m, t) {
                return t.childOf();
            }
        },
        {
            filter: /^ *\+/,
            action: function (m, t) {
                return t.immediatelyPrecededBy();
            }
        },
        {
            filter: /^ *~/,
            action: function (m, t) {
                return t.precededBy();
            }
        },
        {
            filter: /^ +/,
            action: function (m, t) {
                return t.descendantOf();
            }
        }
    ];


function Test() {
    this.tests = [];
}

Test.prototype.push = function (t) {
    this.tests.push(t);
};

Test.prototype.descendantOf = function () {
    var n = new Test(),
        that = this;
    n.push(function (elem) {
        while (elem) {
            elem = elem.parentNode;
            if (elem !== null && that.test(elem)) {
                return true;
            }
        }
        return false;
    });
    return n;
};

Test.prototype.childOf = function () {
    var n = new Test(),
        that = this;
    n.push(function (elem) {
        if (elem) {
            elem = elem.parentNode;
            if (elem !== null && that.test(elem)) {
                return true;
            }
        }
        return false;
    });
    return n;
};

Test.prototype.precededBy = function () {
    var n = new Test(),
        that = this;
    n.push(function (elem) {
        while (elem) {
            elem = elem.previousSibling;
            if (elem !== null && elem.nodeType === 1 && that.test(elem)) {
                return true;
            }
        }
        return false;
    });
    return n;
};

Test.prototype.immediatelyPrecededBy = function () {
    var n = new Test(),
        that = this;
    n.push(function (elem) {
        if (elem) {
            elem = elem.previousSibling;
            if (elem !== null && elem.nodeType === 1 && that.test(elem)) {
                return true;
            }
        }
        return false;
    });
    return n;
};

Test.prototype.test = function (elem) {
    var ret = true;
    forEach(this.tests, function (t) {
        if (ret && !t(elem)) {
            ret = false;
        }
    });
    return ret;
};

function parseSelector(s) {
    var tests = new Test();
    // parse whitespace
    function parseWhite() {
        var m = eatWhite.exec(s);
        if (m) {
            s = s.slice(m[0].length);
        }
    }

    // the element itself
    function parseElement() {
        var m = selElement.exec(s),
            ret = false,
            ns,
            nn;
        if (m) {
            ns = m[2];
            nn = m[4];
            s = s.slice(m[0].length);
            if (ns !== undefined) {
                tests.push(function (elem) {
                    // FIXME: this is not properly tested
                    var nns = elem.nodeName.split(':');
                    if (nns.length === 2) {
                        if (nn === '*') {
                            return eqs(nns[0], ns);
                        }
                        return eqs(nns[0], ns) && eqs(nns[1], nn);
                    }
                    return false;
                });
            } else {
                tests.push(function (elem) {
                    return nn === '*' || eqs(nn, elem.nodeName);
                });
            }
            ret = true;
        }
        return ret;
    }

    // modifiers to an element
    function parseModifier() {
        var i,
            l = selModifiers.length,
            mod,
            m,
            ret = false;
        for (i = 0; i < l; i += 1) {
            mod = selModifiers[i];
            m = mod.filter.exec(s);
            if (m) {
                s = s.slice(m[0].length);
                tests = mod.action(m, tests);
                ret = true;
                break;
            }
        }
        return ret;
    }

    // relationship between elements
    function parseRelationShip() {
        var i,
            l = selRelationships.length,
            mod,
            m,
            ret = false;
        for (i = 0; i < l; i += 1) {
            mod = selRelationships[i];
            m = mod.filter.exec(s);
            if (m) {
                s = s.slice(m[0].length);
                tests = mod.action(m, tests);
                ret = true;
                break;
            }
        }
        return ret;
    }

    // parse s
    while (s.length > 0) {
        // skip white stuff
        parseWhite();
        // parse an element
        parseElement();
        // modifiers (multiple)
        while (true) {
            if (!parseModifier()) {
                break;
            }
        }
        // relationship
        if (!parseRelationShip(s)) {
            if (s.length === 0) {
                break;
            } else {
                console.log('failed to parse ' + s);
                throw new Error('Failed to parse: ' + s);
            }
        }
    }
    return tests;
}

function DomQuery() {
    this.results = [];
}

DomQuery.prototype.add = function (elem) {
    this.results.push(elem);
};

DomQuery.prototype.getResults = function () {
    return this.results;
};

DomQuery.prototype.getLength = function () {
    return this.results.length;
};

DomQuery.prototype.forEach = function (f) {
    forEach(this.results, f);
    return this;
};

DomQuery.prototype.setStyle = function (skin, factory, type, style) {
    var styleData = skin.getTheme(
            factory,
            type
        ).getStyleData(style);
    if (styleData.jsData) {
        forEach(this.results, function (elem) {
            domvisual.styleToCss(elem.style, styleData.jsData);
        });
    }
    return this;
};

DomQuery.prototype.setMargins = function (left, top, right, bottom) {
    left = left || 0;
    top = top || left;
    right = right || left;
    bottom = bottom || left;

    forEach(this.results, function (elem) {
        var s = elem.style;
        s.marginLeft = left;
        s.marginRight = right;
        s.marginTop = top;
        s.marginBottom = bottom;
    });
    return this;
};

DomQuery.prototype.setPadding = function (left, top, right, bottom) {
    left = left || 0;
    top = top || left;
    right = right || left;
    bottom = bottom || left;
    forEach(this.results, function (elem) {
        var s = elem.style;
        s.paddingLeft = left;
        s.paddingRight = right;
        s.paddingTop = top;
        s.paddingBottom = bottom;
    });
    return this;
};

DomQuery.prototype.setVisual = function (factory, type, config, optionalWidth, optionalHeight) {
    forEach(this.results, function (elem) {
        domvisual.createVisual(elem, factory, type, config, optionalWidth, optionalHeight);
    });

    return this;
};

function dq(selector, from) {
    from = from || document.documentElement;
    var tests = parseSelector(selector),
        res = new DomQuery();
    function walk(elem) {
        var c;
        if (tests.test(elem)) {
            res.add(elem);
        }
        for (c = elem.firstChild; c !== null; c = c.nextSibling) {
            if (c.nodeType === 1) {
                walk(c);
            }
        }
    }
    walk(from);
    return res;
}

module.exports = dq;
