exports.groups = {
    "Launcher": {
        "description": "The project management screen.",
        "privateVisual": true,
        "privateTheme": true,
        "dimensions": [
            1000,
            640,
            1
        ],
        "gridSize": 8,
        "children": {
            "pos7": {
                "factory": "baseui",
                "type": "Label",
                "config": {
                    "position": "pos7",
                    "text": "Packages:",
                    "bold": true
                }
            },
            "pos8": {
                "factory": "baseui",
                "type": "Label",
                "config": {
                    "position": "pos8",
                    "text": "Visual Modules:",
                    "bold": true
                }
            },
            "packageList": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "packageList",
                    "innerText": "",
                    "style": "list"
                }
            },
            "moduleList": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "moduleList",
                    "innerText": "",
                    "style": "list"
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
            },
            "pos": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos",
                    "innerText": "",
                    "style": "dialog"
                }
            },
            "pos0": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos0",
                    "innerText": "",
                    "style": "background"
                }
            },
            "pos1": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "pos1",
                    "url": "launcher/img/swallow.png"
                }
            },
            "pos2": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos2",
                    "innerText": "Launcher",
                    "style": "maintitle"
                }
            },
            "pos3": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos3",
                    "innerText": "",
                    "style": "titleBar"
                }
            },
            "monitor": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "monitor",
                    "title": "Monitor",
                    "url": "launcher/img/monitor.png"
                }
            },
            "share": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "share",
                    "title": "Share",
                    "url": "launcher/img/share.png"
                }
            },
            "test": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "test",
                    "title": "Test And Lint",
                    "url": "launcher/img/test.png"
                }
            },
            "trace": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "trace",
                    "title": "Trace",
                    "url": "launcher/img/trace.png"
                }
            },
            "github": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "github",
                    "title": "GitHub",
                    "url": "launcher/img/github.png"
                }
            },
            "web": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "web",
                    "title": "Website",
                    "url": "launcher/img/web.png"
                }
            },
            "help": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "help",
                    "title": "Help",
                    "url": "launcher/img/help.png"
                }
            }
        },
        "positions": {
            "pos": {
                "matrix": [
                    976,
                    0,
                    0,
                    0,
                    0,
                    504,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    16,
                    96,
                    0,
                    1
                ],
                "order": 2,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
                }
            },
            "pos7": {
                "matrix": [
                    264,
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
                    40,
                    112,
                    0,
                    1
                ],
                "order": 9,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos8": {
                "matrix": [
                    264,
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
                    312,
                    112,
                    0,
                    1
                ],
                "order": 10,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "packageList": {
                "matrix": [
                    264,
                    0,
                    0,
                    0,
                    0,
                    384,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    40,
                    144,
                    0,
                    1
                ],
                "order": 3,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
                }
            },
            "moduleList": {
                "matrix": [
                    656,
                    0,
                    0,
                    0,
                    0,
                    384,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    312,
                    144,
                    0,
                    1
                ],
                "order": 4,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
                }
            },
            "packageAdd": {
                "matrix": [
                    48,
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
                    40,
                    544,
                    0,
                    1
                ],
                "order": 6,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "auto",
                    "bottom": "px",
                    "height": "px"
                }
            },
            "packageAddName": {
                "matrix": [
                    208,
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
                    96,
                    544,
                    0,
                    1
                ],
                "order": 5,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "auto",
                    "bottom": "px",
                    "height": "px"
                }
            },
            "moduleAddName": {
                "matrix": [
                    208,
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
                    368,
                    544,
                    0,
                    1
                ],
                "order": 7,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "auto",
                    "bottom": "px",
                    "height": "px"
                }
            },
            "moduleAdd": {
                "matrix": [
                    48,
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
                    312,
                    544,
                    0,
                    1
                ],
                "order": 8,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "auto",
                    "bottom": "px",
                    "height": "px"
                }
            },
            "pos0": {
                "matrix": [
                    1000,
                    0,
                    0,
                    0,
                    0,
                    640,
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
            "pos1": {
                "matrix": [
                    54.79449462890625,
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
                    17.20550537109375,
                    8,
                    0,
                    1
                ],
                "order": 11,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos2": {
                "matrix": [
                    224,
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
                    80,
                    8,
                    0,
                    1
                ],
                "order": 12,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "pos3": {
                "matrix": [
                    1000,
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
            "monitor": {
                "matrix": [
                    32,
                    0,
                    0,
                    0,
                    0,
                    32,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    752,
                    16,
                    0,
                    1
                ],
                "order": 13,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "share": {
                "matrix": [
                    32,
                    0,
                    0,
                    0,
                    0,
                    32,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    784,
                    16,
                    0,
                    1
                ],
                "order": 14,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "test": {
                "matrix": [
                    32,
                    0,
                    0,
                    0,
                    0,
                    32,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    816,
                    16,
                    0,
                    1
                ],
                "order": 15,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "trace": {
                "matrix": [
                    32,
                    0,
                    0,
                    0,
                    0,
                    32,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    848,
                    16,
                    0,
                    1
                ],
                "order": 16,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "github": {
                "matrix": [
                    32,
                    0,
                    0,
                    0,
                    0,
                    32,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    928,
                    16,
                    0,
                    1
                ],
                "order": 17,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "web": {
                "matrix": [
                    32,
                    0,
                    0,
                    0,
                    0,
                    32,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    960,
                    16,
                    0,
                    1
                ],
                "order": 18,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "help": {
                "matrix": [
                    32,
                    0,
                    0,
                    0,
                    0,
                    32,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    880,
                    16,
                    0,
                    1
                ],
                "order": 19,
                "snapping": {
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            }
        },
        "theme": {
            "background": {
                "jsData": {
                    "backgroundColor": {
                        "r": 220,
                        "g": 220,
                        "b": 220,
                        "a": 1
                    }
                }
            },
            "list": {
                "jsData": {
                    "backgroundColor": {
                        "r": 1000,
                        "g": 1000,
                        "b": 230,
                        "a": 1
                    }
                }
            },
            "dialog": {
                "jsData": {
                    "backgroundColor": {
                        "r": 240,
                        "g": 240,
                        "b": 240,
                        "a": 1
                    },
                    "boxShadow": {
                        "offsetX": 0,
                        "offsetY": 0,
                        "blurRadius": 22.77777777777778,
                        "spreadRadius": 0,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0,
                            "a": 1
                        }
                    },
                    "borderTopLeftRadius": 10,
                    "borderTopRightRadius": 10,
                    "borderBottomLeftRadius": 10,
                    "borderBottomRightRadius": 10
                }
            },
            "maintitle": {
                "jsData": {
                    "fontSize": 31.711111111111112,
                    "fontFamily": "arial",
                    "fontWeight": "bold"
                }
            },
            "titleBar": {
                "jsData": {
                    "borderTopLeftRadius": 0,
                    "borderTopRightRadius": 0,
                    "borderBottomLeftRadius": 0,
                    "borderBottomRightRadius": 0,
                    "borderBottomStyle": "solid",
                    "borderBottomWidth": 1,
                    "borderBottomColor": {
                        "r": 255,
                        "g": 255,
                        "b": 255,
                        "a": 1
                    },
                    "backgroundImage": {
                        "colors": [
                            {
                                "r": 255,
                                "g": 255,
                                "b": 255,
                                "a": 1
                            },
                            {
                                "r": 190,
                                "g": 190,
                                "b": 190,
                                "a": 1
                            }
                        ],
                        "stops": [
                            1,
                            0.022222222222222223
                        ],
                        "type": "vertical"
                    }
                },
                "basedOn": [
                    {
                        "factory": "launcher",
                        "type": "Launcher",
                        "style": "dialog",
                        "name": "dialog"
                    }
                ]
            }
        },
        "overflowX": "visible",
        "overflowY": "visible",
        "privateStyles": false
    },
    "Package": {
        "description": "",
        "privateVisual": true,
        "privateTheme": true,
        "dimensions": [
            264,
            40,
            1
        ],
        "gridSize": 8,
        "children": {
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
            },
            "background": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "background",
                    "innerText": "",
                    "style": "normal"
                }
            }
        },
        "positions": {
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
                    "14": 0,
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
            },
            "background": {
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
            }
        },
        "theme": {
            "normal": {
                "jsData": {
                    "borderBottomWidth": 1,
                    "borderBottomStyle": "solid",
                    "borderBottomColor": {
                        "r": 200,
                        "g": 200,
                        "b": 200,
                        "a": 1
                    }
                }
            },
            "highlight": {
                "jsData": {
                    "boxShadow": {
                        "offsetX": 0,
                        "offsetY": 0,
                        "blurRadius": 13.333333333333334,
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
                        "factory": "launcher",
                        "type": "Package",
                        "style": "normal"
                    }
                ]
            },
            "select": {
                "jsData": {
                    "backgroundColor": {
                        "r": 250,
                        "g": 250,
                        "b": 250,
                        "a": 1
                    }
                },
                "basedOn": [
                    {
                        "factory": "launcher",
                        "type": "Package",
                        "style": "normal"
                    }
                ]
            }
        },
        "overflowX": "visible",
        "overflowY": "visible",
        "privateStyles": false
    },
    "VisualModule": {
        "description": "",
        "privateVisual": true,
        "privateTheme": true,
        "dimensions": [
            656,
            112,
            1
        ],
        "gridSize": 8,
        "children": {
            "background": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "background",
                    "innerText": "",
                    "style": "normal"
                }
            },
            "edit": {
                "factory": "baseui",
                "type": "Button",
                "config": {
                    "position": "edit",
                    "text": "Edit"
                }
            },
            "run": {
                "factory": "baseui",
                "type": "Button",
                "config": {
                    "position": "run",
                    "text": "Run"
                }
            },
            "delete": {
                "factory": "baseui",
                "type": "Button",
                "config": {
                    "position": "delete",
                    "text": "Delete"
                }
            },
            "name": {
                "factory": "baseui",
                "type": "Label",
                "config": {
                    "position": "name",
                    "text": "Name",
                    "bold": true
                }
            },
            "description": {
                "factory": "baseui",
                "type": "Label",
                "config": {
                    "position": "description",
                    "text": "Description"
                }
            },
            "publish": {
                "factory": "baseui",
                "type": "Button",
                "config": {
                    "position": "publish",
                    "text": "Publish"
                }
            },
            "monitor": {
                "factory": "baseui",
                "type": "Button",
                "config": {
                    "position": "monitor",
                    "text": "Monitor"
                }
            },
            "monitored": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "monitored",
                    "url": "launcher/img/monitor.png"
                }
            }
        },
        "positions": {
            "background": {
                "matrix": {
                    "0": 656,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 112,
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
                    "right": "px",
                    "width": "auto",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                },
                "enableDisplay": true
            },
            "preview": {
                "matrix": {
                    "0": 120,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 80,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 16,
                    "13": 16,
                    "14": 0,
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
            "edit": {
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
                    "12": 160,
                    "13": 72,
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
            "run": {
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
                    "12": 232,
                    "13": 72,
                    "14": 0,
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
                    "12": 576,
                    "13": 72,
                    "14": 0,
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
                    "left": "auto",
                    "right": "px",
                    "width": "px",
                    "top": "px",
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "name": {
                "matrix": {
                    "0": 424,
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
                    "12": 160,
                    "13": 16,
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
            "description": {
                "matrix": {
                    "0": 424,
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
                    "12": 160,
                    "13": 40,
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
            "publish": {
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
                    "12": 376,
                    "13": 72,
                    "14": 0,
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
            },
            "monitor": {
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
                    "12": 304,
                    "13": 72,
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
            "monitored": {
                "matrix": {
                    "0": 32,
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
                    "12": 608,
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
                "order": 9,
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
        "theme": {
            "select": {
                "jsData": {},
                "basedOn": [
                    {
                        "factory": "launcher",
                        "type": "Package",
                        "style": "select"
                    }
                ]
            },
            "normal": {
                "jsData": {},
                "basedOn": [
                    {
                        "factory": "launcher",
                        "type": "Package",
                        "style": "normal"
                    }
                ]
            },
            "highlight": {
                "jsData": {},
                "basedOn": [
                    {
                        "factory": "launcher",
                        "type": "Package",
                        "style": "highlight"
                    }
                ]
            }
        },
        "overflowX": "visible",
        "overflowY": "visible",
        "privateStyles": true
    }
};

/**
    Exports all visual constructors in the specified module.
*/

exports.Launcher = require('/launcher/lib/Launcher').Launcher;

exports.Package = require('/launcher/lib/Package').Package;

exports.VisualModule = require('/launcher/lib/VisualModule').VisualModule;

exports.Launcher = require('/launcher/lib/Launcher').Launcher;
