exports.groups = {
    "Help": {
        "description": "",
        "privateVisual": true,
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
                    "style": "style"
                }
            },
            "packages": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "packages",
                    "innerText": "",
                    "style": "style"
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
            "make": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "make",
                    "title": "Make",
                    "url": "helpviewer/img/make.png"
                }
            },
            "packageName": {
                "factory": "baseui",
                "type": "Label",
                "config": {
                    "position": "packageName",
                    "text": "",
                    "bold": true
                }
            }
        },
        "positions": {
            "help": {
                "matrix": [
                    400,
                    0,
                    0,
                    0,
                    0,
                    328,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    192,
                    64,
                    0,
                    1
                ],
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
                "matrix": [
                    176,
                    0,
                    0,
                    0,
                    0,
                    328,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    8,
                    64,
                    0,
                    1
                ],
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
                "matrix": [
                    600,
                    0,
                    0,
                    0,
                    0,
                    392,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0.000023484230041503906,
                    7.999992847442627,
                    0,
                    1
                ],
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
                "matrix": [
                    600,
                    0,
                    0,
                    0,
                    0,
                    56,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ],
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
                "matrix": [
                    40,
                    0,
                    0,
                    0,
                    0,
                    40,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    8,
                    8,
                    0,
                    1
                ],
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
                "matrix": [
                    80,
                    0,
                    0,
                    0,
                    0,
                    40,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    56.00000762939453,
                    8,
                    0,
                    1
                ],
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
            "make": {
                "matrix": [
                    63.999969482421875,
                    0,
                    0,
                    0,
                    0,
                    28.40814971923828,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    528,
                    19.591848373413086,
                    0,
                    1
                ],
                "order": 7,
                "snapping": {
                    "left": "auto",
                    "right": "px",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "packageName": {
                "matrix": [
                    296,
                    0,
                    0,
                    0,
                    0,
                    24,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    192,
                    24,
                    0,
                    1
                ],
                "order": 6,
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
                    "fontFamily": "sans-serif",
                    "fontSize": 14,
                    "color": {
                        "r": 0,
                        "g": 0,
                        "b": 0,
                        "a": 1
                    }
                },
                "basedOn": [
                    {
                        "factory": "baseui",
                        "type": "Theme",
                        "style": "windowForeground"
                    }
                ]
            }
        },
        "overflowX": "visible",
        "overflowY": "visible"
    }
};

/**
    Exports all visual constructors in the specified module.
*/

exports.Help = require('/helpviewer/lib/Help').Help;

exports.Help = require('/helpviewer/lib/Help').Help;
