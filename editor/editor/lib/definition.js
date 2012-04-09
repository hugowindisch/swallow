// The edited definition of this component
exports.definition = {
    groups: {
        // the editor
        Editor: {
            // authoring dimension
            dimensions: [ 640, 400, 0],
            positions: {
                menu: {
                    type: "AbsolutePosition",
                    order: 3,
                    matrix: [ 640, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                tools: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 386, 0, 0, 0,   0, 64, 0, 0,    0, 0, 1, 0,   5, 29, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                panel: {
                    type: "AbsolutePosition",
                    order: 1,
                    matrix: [ 390, 0, 0, 0,   0, 302, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'bottom' }
                },
                viewer: {
                    type: "AbsolutePosition",
                    order: 2,
                    matrix: [ 240, 0, 0, 0,   0, 376, 0, 0,    0, 0, 1, 0,   400, 24, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                }
            },
            children: {
                menu: {
                    factory: 'baseui',
                    type: 'HorizontalMenu',
                    position: 'menu',
                    config: {
                    }
                },
                tools: {
                    factory: "baseui",
                    type: "Toolbar",
                    position: "tools",

                    config: {
                    }
                },
                panel: {
                    factory: "editor",
                    type: "Panel",
                    position: "panel",
                    config: {
                        "style": "panel"
                    }
                },
                viewer: {
                    factory: "editor",
                    type: "GroupViewer",
                    position: "viewer",
                    config: {
                    }
                }
            }
        },
        // the right viewer
        GroupViewer: {
            dimensions: [ 440, 480, 0],
            positions: {
                editArea: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 440, 0, 0, 0,   0, 480, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                }
            },
            children: {
                visuals: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: null,
                    config: {
                        "style": "page"
                    }
                },
                positions: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: null,
                    config: {
                    }
                },
                decorations: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "editArea",
                    config: {
                    }
                }
            }
        },
        // the right viewer
        SelectionBox: {
            dimensions: [ 400, 400, 0],
            positions: {
                selectionArea: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 400, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                },
                topLeft: {
                    type: "AbsolutePosition",
                    order: 1,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, -10, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                topRight: {
                    type: "AbsolutePosition",
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, -10, 0, 1 ],
                    snapping: { leftTo: 'right', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                bottomLeft: {
                    type: "AbsolutePosition",
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, 400, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'bottom', bottomTo: 'bottom' }
                },
                bottomRight: {
                    type: "AbsolutePosition",
                    order: 3,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, 400, 0, 1 ],
                    snapping: { leftTo: 'right', rightTo: 'right', topTo: 'bottom', bottomTo: 'bottom' }
                }
            },
            children: {
                selectionArea: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "selectionArea",

                    config: {
                        "class": [ "editor_SelectionBox_selectionArea" ]
                    }
                },
                topLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topLeft",
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }
                },
                topRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topRight",
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }
                },
                bottomLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomLeft",
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }
                },
                bottomRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomRight",
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }
                }
            }
        },
        VisualInfo: {
            dimensions: [390, 50, 0],
            positions: {
                preview: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                factoryName: {
                    type: "AbsolutePosition",
                    order: 1,
                    matrix: [ 100, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   70, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                typeName: {
                    type: "AbsolutePosition",
                    order: 2,
                    matrix: [ 400, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   70, 25, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                description: {
                    type: "AbsolutePosition",
                    order: 3,
                    matrix: [ 300, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   180, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                visualProperties: {
                    type: "AbsolutePosition",
                    order: 4,
                    matrix: [ 400, 0, 0, 0,   0, 30, 0, 0,    0, 0, 1, 0,   0, 50, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                configurationSheet: {
                    type: "AbsolutePosition",
                    order: 5,
                    matrix: [ 400, 0, 0, 0,   0, 1, 0, 0,    0, 0, 1, 0,   0, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }
            },
            children: {
                factoryName: {
                    factory: "baseui",
                    type: "Label",
                    position: "factoryName",
                    config: {
                        "text": "factory name"
                    }
                },
                typeName: {
                    factory: "baseui",
                    type: "Label",
                    position: "typeName",
                    config: {
                        "text": "type name"
                    }
                },
                description: {
                    factory: "baseui",
                    type: "Label",
                    position: "description",
                    config: {
                    }
                }
            }
        },
        VisualList: {
            dimensions: [390, 80, 0],
            positions: {
                label: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 10, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                library: {
                    type: "AbsolutePosition",
                    order: 1,
                    matrix: [ 180, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   80, 10, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                choices: {
                    type: "AbsolutePosition",
                    order: 2,
                    matrix: [ 380, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   10, 50, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: {
                        "text": "Library:"
                    }
                },
                library: {
                    factory: "domvisual",
                    type: "DOMSelect",
                    position: "library",
                    config: {
                        "options": [ "fake" ]
                    }
                },
                choices: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "choices",
                    config: {
                    }
                }
            }
        },
        SelectionInfo: {
            dimensions: [390, 140, 0],
            positions: {
                nameLabel: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                xLabel: {
                    type: "AbsolutePosition",
                    order: 1,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                yLabel: {
                    type: "AbsolutePosition",
                    order: 2,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                wLabel: {
                    type: "AbsolutePosition",
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                hLabel: {
                    type: "AbsolutePosition",
                    order: 4,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                positionLabel: {
                    type: "AbsolutePosition",
                    order: 5,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapLeftLabel: {
                    type: "AbsolutePosition",
                    order: 6,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   75, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapRightLabel: {
                    type: "AbsolutePosition",
                    order: 7,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapTopLabel: {
                    type: "AbsolutePosition",
                    order: 8,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapBottomLabel: {
                    type: "AbsolutePosition",
                    order: 9,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   225, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },

                name: {
                    type: "AbsolutePosition",
                    order: 10,
                    matrix: [ 120, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                x: {
                    type: "AbsolutePosition",
                    order: 11,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                y: {
                    type: "AbsolutePosition",
                    order: 12,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                w: {
                    type: "AbsolutePosition",
                    order: 13,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                h: {
                    type: "AbsolutePosition",
                    order: 14,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                position: {
                    type: "AbsolutePosition",
                    order: 15,
                    matrix: [ 150, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                transform: {
                    type: "AbsolutePosition",
                    order: 16,
                    matrix: [ 150, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   210, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },

                snapLeft: {
                    type: "AbsolutePosition",
                    order: 17,
                    matrix: [ 15, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   55, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapRight: {
                    type: "AbsolutePosition",
                    order: 18,
                    matrix: [ 15, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   105, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapTop: {
                    type: "AbsolutePosition",
                    order: 19,
                    matrix: [ 15, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   155, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapBottom: {
                    type: "AbsolutePosition",
                    order: 20,
                    matrix: [ 15, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   205, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }

            },
            children: {
                nameLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "nameLabel",
                    config: {
                        "text": "name:"
                    }
                },
                xLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "xLabel",
                    config: {
                        "text": "x:"
                    }
                },
                yLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "yLabel",
                    config: {
                        "text": "y:"
                    }
                },
                wLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "wLabel",
                    config: {
                        "text": "w:"
                    }
                },
                hLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "hLabel",
                    config: {
                        "text": "h:"
                    }
                },
                positionLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "positionLabel",
                    config: {
                        "text": "layout:"
                    }
                },
                snapLeftLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "snapLeftLabel",
                    config: {
                        "text": "left"
                    }
                },
                snapRightLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "snapRightLabel",
                    config: {
                        "text": "right"
                    }
                },
                snapTopLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "snapTopLabel",
                    config: {
                        "text": "top"
                    }
                },
                snapBottomLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "snapBottomLabel",
                    config: {
                        "text": "bottom"
                    }
                },

                name: {
                    factory: "baseui",
                    type: "Input",
                    position: "name",
                    config: {
                        "text": ""
                    }
                },
                x: {
                    factory: "baseui",
                    type: "Input",
                    position: "x",
                    config: {
                        "text": "0"
                    }
                },
                y: {
                    factory: "baseui",
                    type: "Input",
                    position: "y",
                    config: {
                        "text": "0"
                    }
                },
                w: {
                    factory: "baseui",
                    type: "Input",
                    position: "w",
                    config: {
                        "text": "0"
                    }
                },
                h: {
                    factory: "baseui",
                    type: "Input",
                    position: "h",
                    config: {
                        "text": "0"
                    }
                },
                position: {
                    factory: "domvisual",
                    type: "DOMSelect",
                    position: "position",
                    config: {
                        "options": [ "AbsolutePosition", "TransformPosition" ]
                    }
                },
                transform: {
                    factory: "domvisual",
                    type: "DOMSelect",
                    position: "transform",
                    config: {
                        "options": [ "distort", "fitw", "fith", "showall", "cover" ]
                    }
                },
                snapLeft: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "snapLeft",
                    config: {
                        "type": "checkbox"
                    }
                },
                snapRight: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "snapRight",
                    config: {
                        "type": "checkbox"
                    }
                },
                snapTop: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "snapTop",
                    config: {
                        "type": "checkbox"
                    }
                },
                snapBottom: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "snapBottom",
                    config: {
                        "type": "checkbox"
                    }
                },

            }
        },
        VisualProperties: {
            dimensions: [390, 30, 0],
            positions: {
                scalingLabel: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }
            },
            children: {
                scalingLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "scalingLabel",
                    config: {
                        "text": "resize:" // rescales / resizes
                    }
                }
            }
        },
        ConfigurationSheet: {
            dimensions: [ 400, 1, 0],
            positions: {},
            children: {}
        },
        ComponentInfo: {
            dimensions: [ 390, 115, 0],
            positions: {
                wLabel: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                hLabel: {
                    type: "AbsolutePosition",
                    order: 1,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                w: {
                    type: "AbsolutePosition",
                    order: 2,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                h: {
                    type: "AbsolutePosition",
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                descriptionLabel: {
                    type: "AbsolutePosition",
                    order: 4,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                privateLabel: {
                    type: "AbsolutePosition",
                    order: 5,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   25, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                description: {
                    type: "AbsolutePosition",
                    order: 6,
                    matrix: [ 380, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                privateCheck: {
                    type: "AbsolutePosition",
                    order: 7,
                    matrix: [ 15, 0, 0, 0,   0, 15, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }
            },
            children: {
                wLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "wLabel",
                    config: {
                        "text": "w:"
                    }
                },
                hLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "hLabel",
                    config: {
                        "text": "h:"
                    }
                },
                descriptionLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "descriptionLabel",
                    config: {
                        "text": "description:"
                    }
                },
                privateLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "privateLabel",
                    config: {
                        "text": "private"
                    }
                },
                w: {
                    factory: "baseui",
                    type: "Input",
                    position: "w",
                    config: {
                        "text": "0"
                    }
                },
                h: {
                    factory: "baseui",
                    type: "Input",
                    position: "h",
                    config: {
                        "text": "0"
                    }
                },
                description: {
                    factory: "baseui",
                    type: "Input",
                    position: "description",
                    config: {
                        "text": ""
                    }
                },
                privateCheck: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "privateCheck",
                    config: {
                        "type": "checkbox"
                    }
                }
            }
        },
        LayerInfo: {
            dimensions: [390, 25, 1],
            positions: {
                name: {
                    type: "AbsolutePosition",
                    order: 0,
                    matrix: [ 280, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 2, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                enableView: {
                    type: "AbsolutePosition",
                    order: 1,
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   290, 2, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                enableSelection: {
                    type: "AbsolutePosition",
                    order: 2,
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   320, 2, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }

            },
            children: {
                name: {
                    factory: "baseui",
                    type: "Label",
                    position: "name",
                    config: {
                    }
                },
                enableView: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "enableView",
                    config: {
                        url: 'editor/lib/enableView.png'
                    }
                },
                enableSelection: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "enableSelection",
                    config: {
                        url: 'editor/lib/enableSelect.png'
                    }
                },
            }
        },
        Layering: {
            dimensions: [390, 100, 0],
            positions: {
            },
            children: {
            }
        }
    }
};
