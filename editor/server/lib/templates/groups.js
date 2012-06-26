exports.groups = {{html groups}};

/**
    Exports all visual constructors in the specified module.
*/
{{each constructors}}
exports.${$value.name} = require('${path}').${$value.name};
{{/each}}
