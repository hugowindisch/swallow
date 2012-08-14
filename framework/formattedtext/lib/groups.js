exports.groups = {
    "FormattedText": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            600,
            400,
            0
        ],
        "gridSize": 8,
        "children": {},
        "positions": {}
    }
};

/**
    Exports all visual constructors in the specified module.
*/

exports.FormattedText = require('/formattedtext/lib/FormattedText').FormattedText;
