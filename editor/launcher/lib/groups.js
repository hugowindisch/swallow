exports.groups = {
    "Launcher": {
        "description": "The project management screen.",
        "private": true,
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
                    "style": "style0"
                }
            },
            "moduleList": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "moduleList",
                    "innerText": "",
                    "style": "style0"
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
                    "style": "style"
                }
            },
            "pos0": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos0",
                    "innerText": "",
                    "style": "style1"
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
                    "style": "style2"
                }
            }
        },
        "positions": {
            "pos": {
                "matrix": {
                    "0": 984,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 624,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 8,
                    "13": 8,
                    "14": 2,
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
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
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
                    "13": 112,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
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
                    "13": 112,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
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
                    "5": 384,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 40,
                    "13": 144,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
                }
            },
            "moduleList": {
                "matrix": {
                    "0": 616,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 384,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 352,
                    "13": 144,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "px",
                    "bottom": "px",
                    "height": "auto"
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
                    "13": 552,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "auto",
                    "bottom": "px",
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
                    "13": 552,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "auto",
                    "bottom": "px",
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
                    "13": 552,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "auto",
                    "bottom": "px",
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
                    "13": 552,
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
                    "left": "cpx",
                    "right": "cpx",
                    "width": "auto",
                    "top": "auto",
                    "bottom": "px",
                    "height": "px"
                }
            },
            "pos0": {
                "matrix": {
                    "0": 1000,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 640,
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
                    "bottom": "px",
                    "height": "auto"
                }
            },
            "pos1": {
                "matrix": {
                    "0": 200,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 0,
                    "11": 0,
                    "12": 776,
                    "13": 24,
                    "14": 42,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
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
            "pos2": {
                "matrix": {
                    "0": 224,
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
                    "12": 32,
                    "13": 24,
                    "14": 1,
                    "15": 1,
                    "byteLength": 64,
                    "byteOffset": 0,
                    "buffer": {
                        "byteLength": 64
                    },
                    "length": 16
                },
                "order": 11,
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
            "style": {
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
                    "borderTopLeftRadius": 20,
                    "borderTopRightRadius": 20,
                    "borderBottomLeftRadius": 20,
                    "borderBottomRightRadius": 20
                }
            },
            "style0": {
                "jsData": {
                    "borderTopStyle": "solid",
                    "borderTopWidth": 2,
                    "borderBottomWidth": 2,
                    "borderBottomStyle": "solid"
                }
            },
            "style1": {
                "jsData": {
                    "backgroundColor": {
                        "r": 100,
                        "g": 100,
                        "b": 100,
                        "a": 1
                    }
                }
            },
            "style2": {
                "jsData": {
                    "fontSize": 31.711111111111112,
                    "fontFamily": "arial",
                    "fontWeight": "bold"
                }
            }
        },
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
                    "style": "select"
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
        "private": true,
        "privateTheme": true,
        "dimensions": [
            600,
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
            }
        },
        "positions": {
            "background": {
                "matrix": {
                    "0": 600,
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
                    "13": -0.0000019073486328125,
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
                    "14": 0.5714285969734192,
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
                    "12": 520,
                    "13": 72,
                    "14": 0.5714285969734192,
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
                    "14": 0.5714285969734192,
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
                    "12": 304,
                    "13": 72,
                    "14": 1.5714285373687744,
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
                    "12": 376,
                    "13": 72,
                    "14": 2.5714285373687744,
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
var constructors = {};
exports.exportConstructors = function (to) {

    constructors.Launcher = to.Launcher = require('/launcher/lib/Launcher').Launcher;

    constructors.Package = to.Package = require('/launcher/lib/Package').Package;

    constructors.VisualModule = to.VisualModule = require('/launcher/lib/VisualModule').VisualModule;

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
            visual,
            vis;
        if (p.query && p.query.visual) {
            visual = p.query.visual;
            vis = new (constructors[visual])({});
            domvisual.createFullScreenApplication(vis);
        }
    }
};