/**
    LayoutAnchors.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('/editor/lib/definition').definition.groups,
    ConfigurationSheet = require('/editor/lib/panel/content/ConfigurationSheet').ConfigurationSheet,
    SnapButton = require('./SnapButton').SnapButton,
    anchorColor = {
        px: 'editor_layoutAnchorPx',
        cpx: 'editor_layoutAnchorCpx',
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
        target,
        anchors = this.anchors;
    this.removeAllChildren();

    // right connector
    a = anchors.right;
    ac = anchorColor[a];
    if (ac) {
        target = (a === 'cpx' ? prmidx : prmaxx);
        if ((target - xmax) > small) {
            this.h(xmax, target, ymid, ac);
            if (ymid > prmaxy) {
                this.v(target, ymid, prmaxy, ac);
            } else if (ymid < prminy) {
                this.v(target, prminy, ymid, ac);
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
                this.h(d, target, ymid - d2, ac);
            } else {
                d2 = small + prminy - ymid;
                if (d2 < small) {
                    d2 = big;
                }
                this.v(d, ymid, ymid + d2, ac);
                this.h(d, target, ymid + d2, ac);
            }
        }
    }
    // left connector
    a = anchors.left;
    ac = anchorColor[a];
    if (ac) {
        target = (a === 'cpx' ? prmidx : prminx);
        if ((xmin - target) > small) {
            this.h(xmin, target, ymid, ac);
            if (ymid > prmaxy) {
                this.v(target, ymid, prmaxy, ac);
            } else if (ymid < prminy) {
                this.v(target, prminy, ymid, ac);
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
                this.h(d, target, ymid - d2, ac);
            } else {
                d2 = small + prminy - ymid;
                if (d2 < small) {
                    d2 = big;
                }
                this.v(d, ymid, ymid + d2, ac);
                this.h(d, target, ymid + d2, ac);
            }
        }
    }

    // bottom connector
    a = anchors.bottom;
    ac = anchorColor[a];
    if (ac) {
        target = (a === 'cpx' ? prmidy : prmaxy);
        if ((target - ymax) > small) {
            this.v(xmid, ymax, target, ac);
            if (xmid > prmaxx) {
                this.h(xmid, prmaxx, target, ac);
            } else if (xmid < prminx) {
                this.h(xmid, prminx, target, ac);
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
                this.v(xmid - d2, target, d, ac);
            } else {
                d2 = small + prminx - xmid;
                if (d2 < small) {
                    d2 = big;
                }
                this.h(xmid, xmid + d2, d, ac);
                this.v(xmid + d2, target, d, ac);
            }
        }
    }
    // top connector
    a = anchors.top;
    ac = anchorColor[a];
    if (ac) {
        target = (a === 'cpx' ? prmidy : prminy);
        if ((ymin - target) > small) {
            this.v(xmid, ymin, target, ac);
            if (xmid < prminx) {
                this.h(xmid, prminx, target, ac);
            } else if (xmid > prmaxx) {
                this.h(xmid, prmaxx, target, ac);
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
                this.v(xmid - d2, target, d, ac);
            } else {
                d2 = small + prminx - xmid;
                if (d2 < small) {
                    d2 = big;
                }
                this.h(xmid, xmid + d2, d, ac);
                this.v(xmid + d2, target, d, ac);
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
    sb = new SnapButton({snapping: anchors.left, cpx: true});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmin - 20, ymid - 9, 0, 1]);
    this.addChild(sb, 'sbLeft');
    sb.on('change', function (snapping) {
        that.emit('anchor', { left: snapping, width: 'auto', right: 'snap' });
    });

    sb = new SnapButton({snapping: anchors.right, cpx: true});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmax + 4, ymid - 9, 0, 1]);
    this.addChild(sb, 'sbRight');
    sb.on('change', function (snapping) {
        that.emit('anchor', { right: snapping, width: 'auto', left: 'snap' });
    });

    sb = new SnapButton({snapping: anchors.top, cpx: true});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmid - 9, ymin - 20, 0, 1]);
    this.addChild(sb, 'sbTop');
    sb.on('change', function (snapping) {
        that.emit('anchor', { top: snapping, height: 'auto', bottom: 'snap'});
    });

    sb = new SnapButton({snapping: anchors.bottom, cpx: true});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmid - 9, ymax + 4, 0, 1]);
    this.addChild(sb, 'sbBottom');
    sb.on('change', function (snapping) {
        that.emit('anchor', { bottom: snapping, height: 'auto', top: 'snap' });
    });

    sb = new SnapButton({snapping: anchors.height});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmid - 9, ymin + 4, 0, 1]);
    this.addChild(sb, 'sbHeight');
    sb.on('change', function (snapping) {
        that.emit('anchor', { height: snapping, top: 'auto', bottom: 'snap' });
    });

    sb = new SnapButton({snapping: anchors.height});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmid - 9, ymax - 20, 0, 1]);
    this.addChild(sb, 'sbHeightB');
    sb.on('change', function (snapping) {
        that.emit('anchor', { height: snapping, bottom: 'auto', top: 'snap' });
    });


    sb = new SnapButton({snapping: anchors.width});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmin + 4, ymid - 9, 0, 1]);
    this.addChild(sb, 'sbWidth');
    sb.on('change', function (snapping) {
        that.emit('anchor', { width: snapping, left: 'auto', right: 'snap' });
    });

    sb = new SnapButton({snapping: anchors.width});
    sb.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  xmax - 20, ymid - 9, 0, 1]);
    this.addChild(sb, 'sbWidthR');
    sb.on('change', function (snapping) {
        that.emit('anchor', { width: snapping, right: 'auto', left: 'snap' });
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
