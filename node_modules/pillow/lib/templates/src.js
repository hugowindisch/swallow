{{verbatim}}
{{/verbatim}}
define('${filepath}', ['require', 'exports', 'module'].concat([ {{each dependencies}}'${$value}',{{/each}} ]), function (require, exports, module) {
{{html code}}
});
