exports.groups = {
    "TestViewer": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            600,
            400,
            0
        ],
        "gridSize": 8,
        "children": {
            "pos0": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos0",
                    "innerText": "",
                    "style": {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "background"
                    }
                }
            },
            "pos": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos",
                    "innerText": "",
                    "style": {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "titleBar"
                    }
                }
            },
            "pos2": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "pos2",
                    "url": "testviewer/img/swallow.png"
                }
            },
            "pos3": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos3",
                    "innerText": "Tests",
                    "style": {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "maintitle"
                    }
                }
            },
            "results": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "results",
                    "innerText": "",
                    "style": {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "list"
                    }
                }
            }
        },
        "positions": {
            "pos": {
                "matrix": {
                    "0": 600,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 48,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 0,
                    "13": 0,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "byteLength": 64,
                    "length": 16,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 1,
                "snapping": {
                    "left": "px",
                    "right": "px",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos0": {
                "matrix": {
                    "0": -600,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": -400,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 600,
                    "13": 400,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "byteLength": 64,
                    "length": 16,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 0,
                "snapping": {
                    "left": "px",
                    "right": "px",
                    "width": "auto",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
                }
            },
            "pos2": {
                "matrix": {
                    "0": 43.83561706542969,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 32,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 0,
                    "11": 0,
                    "12": 8,
                    "13": 8,
                    "14": 8,
                    "15": 1,
                    "byteOffset": 0,
                    "byteLength": 64,
                    "length": 16,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 3,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos3": {
                "matrix": {
                    "0": 104,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 32,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 56,
                    "13": 8,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "byteLength": 64,
                    "length": 16,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 4,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "results": {
                "matrix": {
                    "0": 584,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 336,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 8,
                    "13": 56,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "byteLength": 64,
                    "length": 16,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 2,
                "snapping": {
                    "left": "px",
                    "right": "px",
                    "width": "auto",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
                }
            }
        },
        "theme": {},
        "overflowX": "visible",
        "overflowY": "visible"
    }
};

/**
    Exports all visual constructors in the specified module.
*/
var constructors = {};
exports.exportConstructors = function (to) {

    constructors.TestViewer = to.TestViewer = require('/testviewer/lib/TestViewer').TestViewer;

    constructors.TestViewer = to.TestViewer = require('/testviewer/lib/TestViewer').TestViewer;

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