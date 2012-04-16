/**
    LayoutAnchors.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    glmatrix = require('glmatrix'),
    ConfigurationSheet = require('./ConfigurationSheet').ConfigurationSheet,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3;

function LayoutAnchors(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LayoutAnchors);
}
LayoutAnchors.prototype = new (domvisual.DOMElement)();
LayoutAnchors.prototype.theme = new (visual.Theme)({
    hLine: {
        data: [
            'editor_LayoutAnchorsHorizontal', 'editor_LayoutAnchorsPx', 'editor_SelectionBox_knob'
        ]
    }
});
LayoutAnchors.prototype.getConfigurationSheet = function () {
    return { orientation: {} };
};


LayoutAnchors.prototype.setContentRect = function (cr) {
    var pr = this.pageRect,
        prmin = pr[0],
        prmax = pr[1],
        prminx = prmin[0],
        prminy = prmin[1],
        prmaxx = prmax[0],
        prmaxy = prmax[1],
        prmidx = (prminx + prmaxx) / 2,
        prmidy = (prminy + prmaxy) / 2,
        xmin = cr[0][0],
        xmax = cr[1][0],
        ymin = cr[0][1],
        ymax = cr[1][1],
        xmid = (xmin + xmax) / 2,
        ymid = (ymin + ymax) / 2,
        small = 30,
        big = 40,
        d,
        d2;
    this.removeAllChildren();
    // right connector
    if ((prmaxx - xmax) > small) {
        this.h(xmax, prmaxx, ymid);
        if (ymid > prmaxy) {
            this.v(prmaxx, ymid, prmaxy);
        } else if (ymid < prminy) {
            this.v(prmaxx, prminy, ymid);
        }
    } else {
        d = xmax + big;
        this.h(xmax, d, ymid);
        if (ymid > prmidy) {
            d2 = small + ymid - prmaxy;
            if (d2 < small) {
                d2 = big;
            }
            this.v(d, ymid, ymid - d2);
            this.h(d, prmaxx, ymid - d2);
        } else {
            d2 = small + prminy - ymid;
            if (d2 < small) {
                d2 = big;
            }
            this.v(d, ymid, ymid + d2);
            this.h(d, prmaxx, ymid + d2);
        }
    }
    // left connector
    if ((xmin - prminx) > small) {
        this.h(xmin, prminx, ymid);
        if (ymid > prmaxy) {
            this.v(prminx, ymid, prmaxy);
        } else if (ymid < prminy) {
            this.v(prminx, prminy, ymid);
        }
    } else {
        d = xmin - big;
        this.h(xmin, d, ymid);
        if (ymid > prmidy) {
            d2 = small + ymid - prmaxy;
            if (d2 < small) {
                d2 = big;
            }
            this.v(d, ymid, ymid - d2);
            this.h(d, prminx, ymid - d2);
        } else {
            d2 = small + prminy - ymid;
            if (d2 < small) {
                d2 = big;
            }
            this.v(d, ymid, ymid + d2);
            this.h(d, prminx, ymid + d2);
        }
    }

    // bottom connector
    if ((prmaxy - ymax) > small) {
        this.v(xmid, ymax, prmaxy);
        if (xmid > prmaxx) {
            this.h(xmid, prmaxx, prmaxy);
        } else if (xmid < prminx) {
            this.h(xmid, prminx, prmaxy);
        }
    } else {
        d = ymax + big;
        this.v(xmid, ymax, d);
        if (xmid > prmidx) {
            d2 = small + xmid - prmaxx;
            if (d2 < small) {
                d2 = big;
            }
            this.h(xmid, xmid - d2, d);
            this.v(xmid - d2, prmaxy, d);
        } else {
            d2 = small + prminx - xmid;
            if (d2 < small) {
                d2 = big;
            }
            this.h(xmid, xmid + d2, d);
            this.v(xmid + d2, prmaxy, d);
        }
    }
    // top connector
    if ((ymin - prminy) > small) {
        this.v(xmid, ymin, prminy);
        if (xmid < prminx) {
            this.h(xmid, prminx, prminy);
        } else if (xmid > prmaxx) {
            this.h(xmid, prmaxx, prminy);
        }
    } else {
        d = ymin - big;
        this.v(xmid, ymin, d);
        if (xmid > prmidx) {
            d2 = small + xmid - prmaxx;
            if (d2 < small) {
                d2 = big;
            }
            this.h(xmid, xmid - d2, d);
            this.v(xmid - d2, prminy, d);
        } else {
            d2 = small + prminx - xmid;
            if (d2 < small) {
                d2 = big;
            }
            this.h(xmid, xmid + d2, d);
            this.v(xmid + d2, prminy, d);
        }
    }

    // h connector
    this.h(xmin, xmax, ymid);

    // v connector
    this.v(xmid, ymin, ymax);
};

LayoutAnchors.prototype.h = function (x1, x2, y, style) {
    var child = new (domvisual.DOMElement)({}), x;
    if (x2 < x1) {
        x = x2;
        x2 = x1;
        x1 = x;
    }
    child.setDimensions([x2 - x1, 1, 1]);
    child.setMatrix([1, 0, 0, 0,   0, 1, 0, 0,  0, 0, 1, 0,  x1, y, 0, 1]);
    child.setStyle('hLine');
    this.addChild(child);
};

LayoutAnchors.prototype.v = function (x, y1, y2, style) {
    var child = new (domvisual.DOMElement)({}), y;
    if (y2 < y1) {
        y = y2;
        y2 = y1;
        y1 = y;
    }
    child.setDimensions([1, y2 - y1, 1]);
    child.setMatrix([1, 0, 0, 0,   0, 1, 0, 0,  0, 0, 1, 0,  x, y1, 0, 1]);
    child.setStyle('hLine');
    this.addChild(child);
};


LayoutAnchors.prototype.setPageRect = function (pr) {
    this.pageRect = pr;
};


exports.LayoutAnchors = LayoutAnchors;
