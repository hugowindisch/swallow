var utils = require('utils'),
    events = require('events'),
    forEachProperty = utils.forEachProperty;

/*
{
    'data1': [ selectedUrl, unselectedUrl, DOMImg]
}
}
*/
function ImageOption(options, optionalCheck) {
    this.options = options;
    var that = this,
        i,
        l = arguments.length,
        c;
    forEachProperty(options, function (o, name) {
        o[2].on('click', function () {
            that.setSelectedValue(name);
            if (optionalCheck) {
                optionalCheck.setValue(true);
            }
            that.emit('change', that.selected);
        });
    });
    if (optionalCheck) {
        optionalCheck.on('change', function (c) {
            if (!c) {
                that.setSelectedValue(null);
            }
            that.emit('change', that.selected);
        });
    }
}
ImageOption.prototype = new (events.EventEmitter)();
ImageOption.prototype.setSelectedValue = function (c) {
    var sel = this.selected,
        selOption;
    if (sel) {
        selOption = this.options[sel];
        selOption[2].setUrl(selOption[1]);
        delete this.selected;
    }
    selOption = this.options[c];
    if (selOption) {
        this.selected = c;
        selOption[2].setUrl(selOption[0]);
    }
};
ImageOption.prototype.getSelectedValue = function (c) {
    return this.selected;
};

exports.ImageOption = ImageOption;
