exports.groups = {
    "Icon": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            48,
            48,
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
                    "style": {
                        "factory": "newsreader",
                        "type": "GlobalStyling",
                        "style": "icon"
                    }
                }
            },
            "img": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "img",
                    "url": "newsreader/img/movies.png"
                }
            }
        },
        "positions": {
            "pos": {
                "matrix": {
                    "0": 48,
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
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 0,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "img": {
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
                    "12": 8,
                    "13": 8,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 1,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            }
        },
        "theme": {},
        "overflowX": "visible",
        "overflowY": "visible",
        "privateVisual": false,
        "privateStyles": false
    },
    "GlobalStyling": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            600,
            400,
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
                    "style": "titleBar"
                }
            },
            "pos0": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos0",
                    "innerText": "Title",
                    "style": "style0"
                }
            },
            "pos1": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos1",
                    "innerText": "",
                    "style": "icon"
                }
            },
            "pos2": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "pos2",
                    "innerText": "lorem ipsum",
                    "style": "mainText"
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
                    "5": 80,
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
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
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
                    "0": 488,
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
                    "12": 111.99999237060547,
                    "13": 16,
                    "14": 0.3636363744735718,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
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
            "pos1": {
                "matrix": {
                    "0": 80,
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
                    "12": 0,
                    "13": 0,
                    "14": 0.7272727489471436,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 2,
                "snapping": {
                    "left": "px",
                    "right": "auto",
                    "width": "px",
                    "top": "auto",
                    "bottom": "px",
                    "height": "px"
                }
            },
            "pos2": {
                "matrix": {
                    "0": 472,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 152,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 56,
                    "13": 136,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
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
            }
        },
        "theme": {
            "style0": {
                "jsData": {
                    "fontFamily": "sans-serif",
                    "fontSize": 38.15555555555556,
                    "fontWeight": "bold",
                    "color": {
                        "r": 255,
                        "g": 255,
                        "b": 255,
                        "a": 1
                    }
                }
            },
            "icon": {
                "jsData": {
                    "borderTopLeftRadius": 17.77777777777778,
                    "borderTopRightRadius": 17.77777777777778,
                    "borderBottomLeftRadius": 17.77777777777778,
                    "borderBottomRightRadius": 17.77777777777778,
                    "borderTopStyle": "solid",
                    "borderLeftStyle": "solid",
                    "borderLeftWidth": 4.5,
                    "borderRightStyle": "solid",
                    "borderRightWidth": 4.5,
                    "borderBottomStyle": "solid",
                    "borderBottomWidth": 4.5,
                    "borderTopWidth": 4.5,
                    "borderLeftColor": {
                        "r": 180.09375,
                        "g": 0,
                        "b": 0,
                        "a": 0.475
                    },
                    "borderRightColor": {
                        "r": 180.09375,
                        "g": 0,
                        "b": 0,
                        "a": 0.475
                    },
                    "borderBottomColor": {
                        "r": 180.09375,
                        "g": 0,
                        "b": 0,
                        "a": 0.475
                    },
                    "borderTopColor": {
                        "r": 180.09375,
                        "g": 0,
                        "b": 0,
                        "a": 0.475
                    },
                    "backgroundImage": {
                        "colors": [
                            {
                                "r": 132,
                                "g": 0,
                                "b": 0,
                                "a": 1
                            },
                            {
                                "r": 132,
                                "g": 0,
                                "b": 0,
                                "a": 1
                            },
                            {
                                "r": 255,
                                "g": 0,
                                "b": 0,
                                "a": 1
                            }
                        ],
                        "stops": [
                            0,
                            1,
                            0.555
                        ],
                        "type": "vertical"
                    },
                    "boxShadow": {
                        "offsetX": 0,
                        "offsetY": 0,
                        "blurRadius": 10,
                        "spreadRadius": 0,
                        "color": {
                            "r": 89.25,
                            "g": 0,
                            "b": 0,
                            "a": 1
                        }
                    }
                },
                "basedOn": [
                    {
                        "factory": "newsreader",
                        "type": "GlobalStyling",
                        "style": "titleBar"
                    }
                ]
            },
            "titleBar": {
                "jsData": {
                    "backgroundImage": {
                        "colors": [
                            {
                                "r": 255,
                                "g": 255,
                                "b": 255,
                                "a": 1
                            },
                            {
                                "r": 148.21875,
                                "g": 0,
                                "b": 0,
                                "a": 1
                            },
                            {
                                "r": 189.65625,
                                "g": 0,
                                "b": 0,
                                "a": 1
                            },
                            {
                                "r": 255,
                                "g": 0,
                                "b": 0,
                                "a": 1
                            }
                        ],
                        "stops": [
                            0.89,
                            1,
                            0.075,
                            0.76
                        ],
                        "type": "vertical"
                    },
                    "boxShadow": {
                        "offsetX": 0,
                        "offsetY": 0,
                        "blurRadius": 26.111111111111114,
                        "spreadRadius": 0,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0,
                            "a": 1
                        }
                    }
                }
            },
            "mainText": {
                "jsData": {
                    "fontFamily": "sans-serif",
                    "fontSize": 14
                }
            }
        },
        "overflowX": "visible",
        "overflowY": "visible",
        "privateVisual": false,
        "privateStyles": false
    },
    "Reader": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            320,
            356,
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
                    "style": {
                        "factory": "newsreader",
                        "type": "GlobalStyling",
                        "style": "titleBar"
                    }
                }
            }
        },
        "positions": {
            "content": {
                "matrix": {
                    "0": 320,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 356,
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
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 0,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "right": {
                "matrix": {
                    "0": 320,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 356,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 320,
                    "13": 0,
                    "14": 1,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 1,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "left": {
                "matrix": {
                    "0": 320,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 356,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": -320,
                    "13": 0,
                    "14": 1,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 2,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "pos": {
                "matrix": {
                    "0": 320,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 64,
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
                    "length": 16,
                    "byteLength": 64,
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
            }
        },
        "theme": {},
        "overflowX": "visible",
        "overflowY": "visible",
        "privateVisual": false,
        "privateStyles": false
    },
    "Categories": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            320,
            356,
            1
        ],
        "gridSize": 8,
        "children": {
            "bg": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "bg",
                    "innerText": "",
                    "style": "style"
                }
            }
        },
        "positions": {
            "d0": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 32,
                    "13": 16,
                    "14": 2.5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 1,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d1": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 132.57144165039062,
                    "13": 16,
                    "14": 4.5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 2,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d2": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 233.1428680419922,
                    "13": 16,
                    "14": 3.5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 3,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d3": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 32,
                    "13": 107.42857360839844,
                    "14": 3,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 4,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d4": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 132.57144165039062,
                    "13": 107.42857360839844,
                    "14": 5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 5,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d5": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 233.1428680419922,
                    "13": 107.42857360839844,
                    "14": 4,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 6,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d6": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 32,
                    "13": 198.85714721679688,
                    "14": 3,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 7,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d7": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 132.57144165039062,
                    "13": 198.85714721679688,
                    "14": 5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 8,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d8": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 233.1428680419922,
                    "13": 198.85714721679688,
                    "14": 4,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 9,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d9": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 32,
                    "13": 281.14288330078125,
                    "14": 3,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 10,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d10": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 132.57144165039062,
                    "13": 281.14288330078125,
                    "14": 5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 11,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "d11": {
                "matrix": {
                    "0": 54.857147216796875,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 54.857147216796875,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 233.1428680419922,
                    "13": 281.14288330078125,
                    "14": 4,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 12,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s0": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 271.475830078125,
                    "13": -95.13856506347656,
                    "14": 2.5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 13,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s1": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 334.0188903808594,
                    "13": -33.23244094848633,
                    "14": 4.5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 14,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s2": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 396.5619201660156,
                    "13": 28.67366600036621,
                    "14": 3.5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 15,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s3": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": -45.36174774169922,
                    "13": -104.83087158203125,
                    "14": 3,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 22,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s4": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 17.181293487548828,
                    "13": -42.924747467041016,
                    "14": 5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 23,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s5": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 409.4967346191406,
                    "13": 345.39544677734375,
                    "14": 5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 19,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s6": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": -101.64004516601562,
                    "13": -47.97356033325195,
                    "14": 3,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 24,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s7": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 290.6754150390625,
                    "13": 340.3466491699219,
                    "14": 6,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 20,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s8": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 353.21844482421875,
                    "13": 402.2527770996094,
                    "14": 5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 21,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s9": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": -77.4495620727539,
                    "13": 257.3767395019531,
                    "14": 3,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 16,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s10": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": -14.906523704528809,
                    "13": 319.2828674316406,
                    "14": 5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 17,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "s11": {
                "matrix": {
                    "0": 34.114383697509766,
                    "1": 33.76697540283203,
                    "2": 0,
                    "3": 0,
                    "4": -33.76697540283203,
                    "5": 34.114383697509766,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 47.63652038574219,
                    "13": 381.1889953613281,
                    "14": 4,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 18,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            },
            "bg": {
                "matrix": {
                    "0": 320,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 352,
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
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
                },
                "order": 0,
                "snapping": {
                    "left": "%",
                    "right": "%",
                    "width": "auto",
                    "top": "%",
                    "bottom": "%",
                    "height": "auto"
                }
            }
        },
        "theme": {
            "style": {
                "jsData": {
                    "backgroundImage": {
                        "colors": [
                            {
                                "r": 192,
                                "g": 192,
                                "b": 192,
                                "a": 1
                            },
                            {
                                "r": 64,
                                "g": 64,
                                "b": 64,
                                "a": 1
                            }
                        ],
                        "stops": [
                            1,
                            0
                        ],
                        "type": "vertical"
                    }
                }
            }
        },
        "overflowX": "visible",
        "overflowY": "visible",
        "privateVisual": false,
        "privateStyles": false
    },
    "Topic": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            320,
            80,
            1
        ],
        "gridSize": 8,
        "children": {
            "image": {
                "factory": "domvisual",
                "type": "DOMImg",
                "config": {
                    "position": "image"
                }
            },
            "title": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "title",
                    "innerText": "",
                    "style": "style0"
                }
            },
            "short": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "short",
                    "innerText": "",
                    "style": {
                        "factory": "newsreader",
                        "type": "GlobalStyling",
                        "style": "mainText"
                    }
                }
            }
        },
        "positions": {
            "image": {
                "matrix": {
                    "0": 64,
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
                    "12": 8,
                    "13": 8,
                    "14": 1,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
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
            "title": {
                "matrix": {
                    "0": 232,
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
                    "12": 80,
                    "13": 8,
                    "14": 4.44444465637207,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
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
            "short": {
                "matrix": {
                    "0": 232,
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
                    "12": 80,
                    "13": 32,
                    "14": 5.285714149475098,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
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
        "theme": {
            "style": {
                "jsData": {
                    "fontWeight": "bold"
                }
            },
            "style0": {
                "jsData": {
                    "fontWeight": "bold"
                },
                "basedOn": [
                    {
                        "factory": "newsreader",
                        "type": "GlobalStyling",
                        "style": "mainText"
                    }
                ]
            }
        },
        "overflowX": "visible",
        "overflowY": "visible",
        "privateVisual": false,
        "privateStyles": false
    },
    "TopicText": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            320,
            356,
            1
        ],
        "gridSize": 8,
        "children": {
            "text": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "text",
                    "innerText": "",
                    "style": {
                        "factory": "newsreader",
                        "type": "GlobalStyling",
                        "style": "mainText"
                    }
                }
            },
            "title": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "title",
                    "innerText": "",
                    "style": {
                        "factory": "newsreader",
                        "type": "GlobalStyling",
                        "style": "style0"
                    }
                }
            },
            "button": {
                "factory": "newsreader",
                "type": "Icon",
                "config": {
                    "position": "button"
                }
            }
        },
        "positions": {
            "text": {
                "matrix": {
                    "0": 304,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 272,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 8,
                    "13": 72,
                    "14": 3,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
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
            "title": {
                "matrix": {
                    "0": 232,
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
                    "12": 80,
                    "13": 8,
                    "14": 1,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
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
                    "bottom": "auto",
                    "height": "px"
                }
            },
            "button": {
                "matrix": {
                    "0": 48,
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
                    "12": 8,
                    "13": 4,
                    "14": 0.5,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
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
            "topicPlaceHolder": {
                "matrix": {
                    "0": 304,
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
                    "12": 8,
                    "13": 360,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
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
            }
        },
        "theme": {},
        "overflowX": "visible",
        "overflowY": "visible",
        "privateVisual": false,
        "privateStyles": false
    },
    "TopicList": {
        "description": "",
        "private": true,
        "privateTheme": true,
        "dimensions": [
            320,
            356,
            1
        ],
        "gridSize": 8,
        "children": {
            "topics": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "topics"
                }
            },
            "button": {
                "factory": "newsreader",
                "type": "Icon",
                "config": {
                    "position": "button"
                }
            },
            "title": {
                "factory": "domvisual",
                "type": "DOMElement",
                "config": {
                    "position": "title",
                    "innerText": "News",
                    "style": {
                        "factory": "newsreader",
                        "type": "GlobalStyling",
                        "style": "style0"
                    }
                }
            }
        },
        "positions": {
            "topics": {
                "matrix": {
                    "0": 320,
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 288,
                    "6": 0,
                    "7": 0,
                    "8": 0,
                    "9": 0,
                    "10": 1,
                    "11": 0,
                    "12": 0,
                    "13": 64,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
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
            "button": {
                "matrix": {
                    "0": 48,
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
                    "12": 8,
                    "13": 4,
                    "14": 0,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
                    "buffer": {
                        "byteLength": 64
                    }
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
            "title": {
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
                    "12": 80,
                    "13": 8,
                    "14": 2.441558361053467,
                    "15": 1,
                    "byteOffset": 0,
                    "length": 16,
                    "byteLength": 64,
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
                    "bottom": "auto",
                    "height": "px"
                }
            }
        },
        "theme": {},
        "overflowX": "visible",
        "overflowY": "visible",
        "privateVisual": false,
        "privateStyles": false
    }
};

/**
    Exports all visual constructors in the specified module.
*/

exports.Icon = require('/newsreader/lib/Icon').Icon;

exports.GlobalStyling = require('/newsreader/lib/GlobalStyling').GlobalStyling;

exports.Reader = require('/newsreader/lib/Reader').Reader;

exports.Categories = require('/newsreader/lib/Categories').Categories;

exports.Topic = require('/newsreader/lib/Topic').Topic;

exports.TopicText = require('/newsreader/lib/TopicText').TopicText;

exports.TopicList = require('/newsreader/lib/TopicList').TopicList;

exports.TopicText = require('/newsreader/lib/TopicText').TopicText;
