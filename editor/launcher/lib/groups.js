exports.groups = {
    "Launcher": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            1000,
            700,
            1
        ],
        "gridSize": 8,
        "children": {
            "pos7": {
                "factory": "baseui",
                "type": "Label",
                "config": {
                    "position": "pos7",
                    "text": "Packages:"
                }
            },
            "pos8": {
                "factory": "baseui",
                "type": "Label",
                "config": {
                    "position": "pos8",
                    "text": "Visual Modules:"
                }
            },
            "packageList": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "packageList"
                }
            },
            "moduleList": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "moduleList"
                }
            },
            "packageAdd": {
                "factory": "baseui",
                "type": "Button",
                "config": {
                    "position": "packageAdd",
                    "text": "Add"
                }
            },
            "packageAddName": {
                "factory": "baseui",
                "type": "Input",
                "config": {
                    "position": "packageAddName"
                }
            },
            "moduleAddName": {
                "factory": "baseui",
                "type": "Input",
                "config": {
                    "position": "moduleAddName"
                }
            },
            "moduleAdd": {
                "factory": "baseui",
                "type": "Button",
                "config": {
                    "position": "moduleAdd",
                    "text": "Add"
                }
            }
        },
        "positions": {
            "pos": {
                "matrix": {
                    "0": 296,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 584,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 24,
                    "13": 56,
                    "14": 0,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 0,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos0": {
                "matrix": {
                    "0": 648,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 584,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 336,
                    "13": 56,
                    "14": 1,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 1,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos7": {
                "matrix": {
                    "0": 264,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 24,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 40,
                    "13": 64,
                    "14": 0,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 8,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos8": {
                "matrix": {
                    "0": 264,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 24,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 352,
                    "13": 64,
                    "14": 0.5333333611488342,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 9,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "packageList": {
                "matrix": {
                    "0": 264,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 480,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 40,
                    "13": 96,
                    "14": 0,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 2,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "moduleList": {
                "matrix": {
                    "0": 616,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 480,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 352,
                    "13": 96,
                    "14": 0,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
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
            "packageAdd": {
                "matrix": {
                    "0": 48,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 24,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 40,
                    "13": 592,
                    "14": 0.29629629850387573,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
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
            "packageAddName": {
                "matrix": {
                    "0": 208,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 24,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 96,
                    "13": 592,
                    "14": 0,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
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
            "moduleAddName": {
                "matrix": {
                    "0": 208,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 24,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 416,
                    "13": 592,
                    "14": 1,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
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
            "moduleAdd": {
                "matrix": {
                    "0": 48,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 24,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 360,
                    "13": 592,
                    "14": 1.2962963581085205,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 7,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            }
        },
        "theme": {},
        "overflowX": "visible",
        "overflowY": "visible",
        "privateStyles": true
    },
    "Package": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            264,
            40,
            1
        ],
        "gridSize": 8,
        "children": {
            "pos": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos",
                    "innerText": "",
                    "style": "style"
                }
            },
            "name": {
                "factory": "baseui",
                "type": "Label",
                "config": {
                    "position": "name",
                    "text": "PackageName"
                }
            },
            "delete": {
                "factory": "baseui",
                "type": "Button",
                "config": {
                    "position": "delete",
                    "text": "Delete"
                }
            }
        },
        "positions": {
            "pos": {
                "matrix": {
                    "0": 264,
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
                    "12": 0,
                    "13": 0,
                    "14": 0,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 0,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "name": {
                "matrix": {
                    "0": 168,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 24,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 7.999994277954102,
                    "13": 8,
                    "14": 0.3076923191547394,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 1,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "delete": {
                "matrix": {
                    "0": 64,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 24,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 192,
                    "13": 8,
                    "14": 0,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 2,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            }
        },
        "theme": {
            "style": {
                "jsData": {
                    "borderLeftStyle": "none",
                    "borderRightStyle": "none",
                    "borderBottomStyle": "none",
                    "borderTopStyle": "none",
                    "boxShadow": {
                        "offsetX": 0,
                        "offsetY": 0,
                        "blurRadius": 7.777777777777778,
                        "spreadRadius": 0,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0,
                            "a": 1
                        }
                    }
                },
                "basedOn": [
                    {
                        "factory": "baseui",
                        "type": "Theme",
                        "style": "windowDarkerForeground"
                    }
                ]
            }
        },
        "overflowX": "visible",
        "overflowY": "visible",
        "privateStyles": true
    },
    "VisualModule": {
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
        "positions": {},
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

    constructors.Launcher = to.Launcher = require('/launcher/lib/Launcher').Launcher;

    constructors.Package = to.Package = require('/launcher/lib/Package').Package;

    constructors.VisualModule = to.VisualModule = require('/launcher/lib/VisualModule').VisualModule;

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
            visual = p.query.visual,
            vis = new (constructors[visual])({});
        domvisual.createFullScreenApplication(vis);
    }
};
