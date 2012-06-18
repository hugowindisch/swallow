exports.groups = {
    "Help": {
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
            "help": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "help",
                    "innerText": "",
                    "style": {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "list"
                    }
                }
            },
            "packages": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "packages",
                    "innerText": "",
                    "style": {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "list"
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
                        "style": "background"
                    }
                }
            },
            "pos0": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos0",
                    "innerText": "",
                    "style": {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "titleBar"
                    }
                }
            },
            "pos1": {
                "factory": "baseui",
                "type": "ImageViewer",
                "config": {
                    "position": "pos1",
                    "url": "helpviewer/img/swallow.png"
                }
            },
            "pos2": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos2",
                    "innerText": "Help",
                    "style": {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "maintitle"
                    }
                }
            },
            "pos3": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos3",
                    "innerText": "",
                    "style": {
                        "factory": "baseui",
                        "type": "Theme",
                        "style": "controlText"
                    }
                }
            },
            "make": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "make",
                    "url": "helpviewer/img/make.png"
                }
            }
        },
        "positions": {
            "help": {
                "matrix": {
                    "0": 440,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 328,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 152,
                    "13": 64,
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
                    "bottom": "px",
                    "height": "auto"
                }
            },
            "packages": {
                "matrix": {
                    "0": 136,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 328,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 8,
                    "13": 64,
                    "14": 1,
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
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
                }
            },
            "pos": {
                "matrix": {
                    "0": 600,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 392,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 0.000023484230041503906,
                    "13": 7.999992847442627,
                    "14": 0.3076923191547394,
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
            "pos0": {
                "matrix": {
                    "0": 600,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 56,
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
                "order": 3,
                "snapping": {
                    "left": "px",
                    "right": "px",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos1": {
                "matrix": {
                    "0": 40,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 40,
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
            "pos2": {
                "matrix": {
                    "0": 80,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 40,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 56.00000762939453,
                    "13": 8,
                    "14": 0.8888888955116272,
                    "15": 1,
                    "byteOffset": 0,
                    "byteLength": 64,
                    "length": 16,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 5,
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
                    "0": 312,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 16,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 152,
                    "13": 24,
                    "14": 16.5,
                    "15": 1,
                    "byteOffset": 0,
                    "byteLength": 64,
                    "length": 16,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 6,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "make": {
                "matrix": {
                    "0": 63.999969482421875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 28.40814971923828,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 0,
                    "11": 0,
                    "12": 528,
                    "13": 19.591848373413086,
                    "14": 16.88888931274414,
                    "15": 1,
                    "byteOffset": 0,
                    "byteLength": 64,
                    "length": 16,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 7,
                "snapping": {
                    "left": "auto",
                    "right": "px",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
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

    constructors.Help = to.Help = require('/helpviewer/lib/Help').Help;

    constructors.Help = to.Help = require('/helpviewer/lib/Help').Help;

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