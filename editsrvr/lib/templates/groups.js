exports.groups = {groups|s};

/**
    Exports all visual constructors in the specified module.
*/
var constructors = {};
exports.exportConstructors = function (to) {
{{each constructors}}
    constructors.${$value} = to.${$value} = require('${path}').${$value};
{{/each}}
    return exports;
};


/**
    Runs a given visual full screen.
*/
exports.run = function(mainModule) {
    if (require.main === mainModule) {
        var url = require('url'),
            domvisual = require('domvisual'),
            p = url.parse(document.URL, true),
            visual = p.query.visual,
            vis = new (constructors[visual])({});
        domvisual.createFullScreenApplication(vis);
    }
}
