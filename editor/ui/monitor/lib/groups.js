exports.groups = {
    "Monitor": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            400,
            400,
            1
        ],
        "gridSize": 8,
        "children": {
            "pos": {
                "factory": "baseui",
                "type": "ImageViewer",
                "config": {
                    "position": "pos",
                    "url": "monitor/img/swallow.png"
                }
            },
            "pos0": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos0",
                    "innerText": "",
                    "style": "style"
                }
            }
        },
        "positions": {
            "pos": {
                "matrix": {
                    "0": 300,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 219,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 0,
                    "11": 0,
                    "12": 50,
                    "13": 90.5,
                    "14": 97,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "cpx",
                    "bottom": "cpx",
                    "height": "auto"
                }
            },
            "pos0": {
                "matrix": {
                    "0": 400,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 400,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 0,
                    "13": 0,
                    "14": 2,
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
                    "right": "px",
                    "width": "auto",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
                }
            }
        },
        "theme": {
            "style": {
                "jsData": {
                    "backgroundColor": {
                        "r": 220,
                        "g": 220,
                        "b": 220,
                        "a": 1
                    }
                }
            }
        },
        "overflowX": "visible",
        "overflowY": "visible",
        "privateStyles": false
    }
};

/**
    Exports all visual constructors in the specified module.
*/
exports.Monitor = require('/monitor/lib/Monitor').Monitor;
