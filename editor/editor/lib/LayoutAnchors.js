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
    SnapButton = require('./SnapButton').SnapButton,
    mat4 = glmatrix.mat4,
    vec3 = glmatrix.vec3,
    anchorColor = {
        px: 'editor_layoutAnchorPx',
        '%': 'editor_layoutAnchorPercent'
    };

function LayoutAnchors(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.LayoutAnchors);
}
LayoutAnchors.prototype = new (domvisual.DOMElement)();
LayoutAnchors.prototype.theme = new (visual.Theme)({
    hLine: {
        data: [
            'editor_LayoutAnchorHorizontal'
        ]
    },
    vLine: {
        data: [
            'editor_LayoutAnchorVertical'
        ]
    }
});


LayoutAnchors.prototype.getConfigurationSheet = function () {
    return { orientation: {} };
};

LayoutAnchors.prototype.setPageRect = function (pr) {
    this.pageRect = pr;
};

LayoutAnchors.prototype.setAnchors = function (anchors) {
    this.anchors = anchors;
};

LayoutAnchors.prototype.setContentRect = function (cr) {
    var pr = this.pageRect,
        that = this,
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
        d2,
        sb,
        a,
        ac,
        anchors = this.anchors;
    this.removeAllChildren();

    // right connector
    a = anchors.right;
    ac = anchorColor[a];
    if (ac) {
        if ((prmaxx - xmax) > small) {
            this.h(xmax, prmaxx, ymid, ac);
            if (ymid > prmaxy) {
                this.v(prmaxx, ymid, prmaxy, ac);
            } else if (ymid < prminy) {
                this.v(prmaxx, prminy, ymid, ac);
            }
        } else {
            d = xmax + big;
            this.h(xmax, d, ymid, ac);
            if (ymid > prmidy) {
                d2 = small + ymid - prmaxy;
                if (d2 < small) {
                    d2 = big;
                }
                this.v(d, ymid, ymid - d2, ac);
                this.h(d, prmaxx, ymid - d2, ac);
            } else {
                d2 = small + prminy - ymid;
                if (d2 < small) {
                    d2 = big;
                }
                this.v(d, ymid, ymid + d2, ac);
                this.h(d, prmaxx, ymid + d2, ac);
            }
        }
    }
    // left connector
    a = anchors.left;
    ac = anchorColor[a];
    if (ac) {
        if ((xmin - prminx) > small) {
            this.h(xmin, prminx, ymid, ac);
            if (ymid > prmaxy) {
                this.v(prminx, ymid, prmaxy, ac);
            } else if (ymid < prminy) {
                this.v(prminx, prminy, ymid, ac);
            }
        } else {
            d = xmin - big;
            this.h(xmin, d, ymid, ac);
            if (ymid > prmidy) {
                d2 = small + ymid - prmaxy;
                if (d2 < small) {
                    d2 = big;
                }
                this.v(d, ymid, ymid - d2, ac);
                this.h(d, prminx, ymid - d2, ac);
            } else {
                d2 = small + prminy - ymid;
                if (d2 < small) {
                    d2 = big;
                }
                this.v(d, ymid, ymid + d2, ac);
                this.h(d, prminx, ymid + d2, ac);
            }
        }
    }

    // bottom connector
    a = anchors.bottom;
    ac = anchorColor[a];
    if (ac) {
        if ((prmaxy - ymax) > small) {
            this.v(xmid, ymax, prmaxy, ac);
            if (xmid > prmaxx) {
                this.h(xmid, prmaxx, prmaxy, ac);
            } else if (xmid < prminx) {
                this.h(xmid, prminx, prmaxy, ac);
            }
        } else {
            d = ymax + big;
            this.v(xmid, ymax, d, ac);
            if (xmid > prmidx) {
                d2 = small + xmid - prmaxx;
                if (d2 < small) {
                    d2 = big;
                }
                this.h(xmid, xmid - d2, d, ac);
                this.v(xmid - d2, prmaxy, d, ac);
            } else {
                d2 = small + prminx - xmid;
                if (d2 < small) {
                    d2 = big;
                }
                this.h(xmid, xmid + d2, d, ac);
                this.v(xmid + d2, prmaxy, d, ac);
            }
        }
    }
    // top connector
    a = anchors.top;
    ac = anchorColor[a];
    if (ac) {
        if ((ymin - prminy) > small) {
            this.v(xmid, ymin, prminy, ac);
            if (xmid < prminx) {
                this.h(xmid, prminx, prminy, ac);
            } else if (xmid > prmaxx) {
                this.h(xmid, prmaxx, prminy, ac);
            }
        } else {
            d = ymin - big;
            this.v(xmid, ymin, d, ac);
            if (xmid > prmidx) {
                d2 = small + xmid - prmaxx;
                if (d2 < small) {
                    d2 = big;
                }
                this.h(xmid, xmid - d2, d, ac);
                this.v(xmid - d2, prminy, d, ac);
            } else {
                d2 = small + prminx - xmid;
                if (d2 < small) {
                    d2 = big;
                }
                this.h(xmid, xmid + d2, d, ac);
                this.v(xmid + d2, prminy, d, ac);
            }
        }
    }

    // h connector
    a = anchors.width;
    ac = anchorColor[a];
    if (ac) {
        this.h(xmin, xmax, ymid, ac);
    }

    // v connector
    a = anchors.height;
    ac = anchorColor[a];
    if (ac) {
        this.v(xmid, ymin, ymax, ac);
    }

    // all snap buttons
    sb = new SnapButton({snapping: anchors.left});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmin - 20, ymid - 9, 0, 1]);
    this.addChild(sb, 'sbLeft');
    sb.on('change', function (snapping) {
        that.emit('anchor', { left: snapping });
    });

    sb = new SnapButton({snapping: anchors.right});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmax + 4, ymid - 9, 0, 1]);
    this.addChild(sb, 'sbRight');
    sb.on('change', function (snapping) {
        that.emit('anchor', { right: snapping });
    });

    sb = new SnapButton({snapping: anchors.top});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmid - 9, ymin - 20, 0, 1]);
    this.addChild(sb, 'sbTop');
    sb.on('change', function (snapping) {
        that.emit('anchor', { top: snapping });
    });

    sb = new SnapButton({snapping: anchors.bottom});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmid - 9, ymax + 4, 0, 1]);
    this.addChild(sb, 'sbBottom');
    sb.on('change', function (snapping) {
        that.emit('anchor', { bottom: snapping });
    });

    sb = new SnapButton({snapping: anchors.height});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmid - 9, ymin + 4, 0, 1]);
    this.addChild(sb, 'sbHeight');
    sb.on('change', function (snapping) {
        that.emit('anchor', { height: snapping });
    });


    sb = new SnapButton({snapping: anchors.width});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmin + 4, ymid - 9, 0, 1]);
    this.addChild(sb, 'sbWidth');
    sb.on('change', function (snapping) {
        that.emit('anchor', { width: snapping });
    });

};

LayoutAnchors.prototype.h = function (x1, x2, y, classes) {
    var child = new (domvisual.DOMElement)({}), x;
    if (x2 < x1) {
        x = x2;
        x2 = x1;
        x1 = x;
    }
    child.setDimensions([x2 - x1, 1, 1]);
    child.setMatrix([1, 0, 0, 0,   0, 1, 0, 0,  0, 0, 1, 0,  x1, y, 0, 1]);
    child.setStyle('hLine');
    if (classes) {
        child.setClass(classes);
    }
    this.addChild(child);
};

LayoutAnchors.prototype.v = function (x, y1, y2, classes) {
    var child = new (domvisual.DOMElement)({}), y;
    if (y2 < y1) {
        y = y2;
        y2 = y1;
        y1 = y;
    }
    child.setDimensions([1, y2 - y1, 1]);
    child.setMatrix([1, 0, 0, 0,   0, 1, 0, 0,  0, 0, 1, 0,  x, y1, 0, 1]);
    child.setStyle('vLine');
    if (classes) {
        child.setClass(classes);
    }
    this.addChild(child);
};

exports.LayoutAnchors = LayoutAnchors;
