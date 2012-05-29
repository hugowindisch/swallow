exports.groups = {{html groups}};

/**
    Exports all visual constructors in the specified module.
*/
var constructors = {};
exports.exportConstructors = function (to) {
{{each constructors}}
    constructors.${$value.name} = to.${$value.name} = require('${path}').${$value.name};
{{/each}}
    return exports;
};


/**
    Runs a given visual full screen.
*/
exports.run = function (mainModule) {
    if (require.main === mainModule) {
        var url = require('url'),
            domvisual = require('domvisual'),
            p = url.parse(document.URL, true),
            visual,
            vis;
        if (p.query && p.query.visual) {
            visual = p.query.visual;
            vis = new (constructors[visual])({});
            domvisual.createFullScreenApplication(vis);
        }
    }
};
