/**
    StyleSettingShadow.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    groups = require('./definition').definition.groups,
    utils = require('utils'),
    ImageOption = require('./ImageOption').ImageOption,
    apply = utils.apply;

function StyleSettingShadow(config) {
    // call the baseclass
    domvisual.DOMElement.call(this, config, groups.StyleSettingShadow);
    var children = this.children,
        that = this;

    function makeShadow() {
        if (!that.styleData.shadow) {
            that.styleData.shadow = {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 0,
                spreadRadius: 0,
                color: {r: 0, g: 0, b: 0, a: 1 }
            };
        }
        return that.styleData.shadow;
    }

    children.offsetX.on('change', function (v) {
        var shadow = makeShadow();
        shadow.offsetX = v || 0;
        that.emit('change', that.styleData);
    });
    children.offsetX.on('preview', function (v) {
        var shadow = makeShadow();
        shadow.offsetX = v || 0;
        that.emit('preview', that.styleData);
    });

    children.offsetY.on('change', function (v) {
        var shadow = makeShadow();
        shadow.offsetY = v || 0;
        that.emit('change', that.styleData);
    });
    children.offsetY.on('preview', function (v) {
        var shadow = makeShadow();
        shadow.offsetY = v || 0;
        that.emit('preview', that.styleData);
    });

    children.blurRadius.on('change', function (v) {
        var shadow = makeShadow();
        shadow.blurRadius = v || 0;
        that.emit('change', that.styleData);
    });
    children.blurRadius.on('preview', function (v) {
        var shadow = makeShadow();
        shadow.blurRadius = v || 0;
        that.emit('preview', that.styleData);
    });

    children.spreadRadius.on('change', function (v) {
        var shadow = makeShadow();
        shadow.spreadRadius = v || 0;
        that.emit('change', that.styleData);
    });
    children.spreadRadius.on('preview', function (v) {
        var shadow = makeShadow();
        shadow.spreadRadius = v || 0;
        that.emit('preview', that.styleData);
    });


    children.color.on('change', function (v) {
        var shadow = makeShadow();
        shadow.color = v;
        that.emit('change', that.styleData);
    });
    children.color.on('preview', function (v) {
        var shadow = makeShadow();
        shadow.color = v;
        that.emit('preview', that.styleData);
    });

    this.insetStyle = new ImageOption({
        'outer':  [ 'editor/img/ssouter_s.png', 'editor/img/ssouter.png', children.insetOuter ],
        'inner': [ 'editor/img/ssinner_s.png', 'editor/img/ssinner.png', children.insetInner ]
    });
    this.insetStyle.on('change', function (v) {
        var shadow = makeShadow();
        if (v === 'inner') {
            shadow.inset = true;
        } else {
            delete shadow.inset;
        }
        that.emit('change', that.styleData);
    });


    children.clear.on('click', function () {
        that.styleData = {};
        that.emit('reset', that.styleData);
    });


}
StyleSettingShadow.prototype = new (domvisual.DOMElement)();

StyleSettingShadow.prototype.getConfigurationSheet = function () {
    return { label: null };
};
StyleSettingShadow.prototype.setLabel = function (txt) {
    this.children.label.setText(txt);
};
StyleSettingShadow.prototype.setStyleData = function (st) {
    var children = this.children,
        shadow;
    this.styleData = apply({}, st);

    shadow = this.styleData.shadow || {};
    children.offsetX.setValue(shadow.offsetX);
    children.offsetY.setValue(shadow.offsetY);
    children.blurRadius.setValue(shadow.blurRadius);
    children.spreadRadius.setValue(shadow.spreadRadius);
    children.color.setValue(shadow.color || { r: 0, g: 0, b: 0, a: 1});
    this.insetStyle.setSelectedValue(shadow.inset ? 'inner' : 'outer');
};


exports.StyleSettingShadow = StyleSettingShadow;
