/**
    Categories.js
*/
var visual = require('visual'),
    domvisual = require('domvisual'),
    packageName = 'newsreader',
    className = 'Categories',
    group = require('./groups').groups.Categories,
    Icon = require('./Icon').Icon,
    utils = require('utils'),
    forEach = utils.forEach,
    catinfo = require('./catinfo');

function Categories(config) {
    domvisual.DOMElement.call(this, config, group);
    this.getChild('bg').setOpacity(0.5);
}
Categories.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
Categories.prototype.getConfigurationSheet = function () {
    return {  };
};
Categories.prototype.setTopicList = function (jsonData) {
    var cats = {},
        numCat = 0,
        that = this;
    function addCat(cat) {
        var nc = numCat,
            i;
        if (!cats[cat]) {
            cats[cat] = true;
            i = new Icon({img: catinfo[cat].icon});
            that.addChild(i);
            i.setPosition('s' + nc);
            setTimeout(function () {
                i.setTransition(300);
                i.setPosition('d' + nc);
                visual.update();
            }, 1);
            i.on('mousedown', function () {
                that.emit('poppage');
                that.emit('changecat', cat);
            });
            numCat += 1;
        }
    }
    // process the data
    forEach(jsonData, function (t) {
        addCat(t.category);
    });
    // add the all category
    addCat('all');
};
exports.Categories = Categories;
