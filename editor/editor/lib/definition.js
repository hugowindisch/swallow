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
                    matrix: [ 640, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                tools: {
                    type: "AbsolutePosition",
                    matrix: [ 386, 0, 0, 0,   0, 64, 0, 0,    0, 0, 1, 0,   5, 29, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                panel: {
                    type: "AbsolutePosition",
                    matrix: [ 390, 0, 0, 0,   0, 302, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'bottom' }
                },
                viewer: {
                    type: "AbsolutePosition",
                    matrix: [ 240, 0, 0, 0,   0, 376, 0, 0,    0, 0, 1, 0,   400, 24, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                }
            },
            children: {
                menu: {
                    factory: 'baseui',
                    type: 'HorizontalMenu',
                    position: 'menu',
                    order: 3,
                    config: {
                    }
                },
                tools: {
                    factory: "baseui",
                    type: "Toolbar",
                    position: "tools",
                    order: 0,
                    config: {
                    }
                },
                panel: {
                    factory: "editor",
                    type: "Panel",
                    position: "panel",
                    order: 1,
                    config: {
                        "style": "panel"
                    }
                },
                viewer: {
                    factory: "editor",
                    type: "GroupViewer",
                    position: "viewer",
                    order: 2,
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
                    matrix: [ 440, 0, 0, 0,   0, 480, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                }
            },
            children: {
                visuals: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: null,
                    order: 0,
                    config: {
                        "style": "page"
                    }
                },
                positions: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: null,
                    order: 1,
                    config: {
                    }
                },
                decorations: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "editArea",
                    order: 2,
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
                    matrix: [ 400, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                },
                topLeft: {
                    type: "AbsolutePosition",
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, -10, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                topRight: {
                    type: "AbsolutePosition",
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, -10, 0, 1 ],
                    snapping: { leftTo: 'right', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                bottomLeft: {
                    type: "AbsolutePosition",
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, 400, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'bottom', bottomTo: 'bottom' }
                },
                bottomRight: {
                    type: "AbsolutePosition",
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, 400, 0, 1 ],
                    snapping: { leftTo: 'right', rightTo: 'right', topTo: 'bottom', bottomTo: 'bottom' }
                }
            },
            children: {
                selectionArea: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "selectionArea",
                    order: 0,
                    config: {
                        "class": [ "editor_SelectionBox_selectionArea" ]
                    }
                },
                topLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topLeft",
                    order: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }
                },
                topRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topRight",
                    order: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }
                },
                bottomLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomLeft",
                    order: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }
                },
                bottomRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomRight",
                    order: 0,
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
                    matrix: [ 60, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                factoryName: {
                    type: "AbsolutePosition",
                    matrix: [ 100, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   70, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                typeName: {
                    type: "AbsolutePosition",
                    matrix: [ 400, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   70, 25, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                description: {
                    type: "AbsolutePosition",
                    matrix: [ 300, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   180, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                visualProperties: {
                    type: "AbsolutePosition",
                    matrix: [ 400, 0, 0, 0,   0, 30, 0, 0,    0, 0, 1, 0,   0, 50, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                configurationSheet: {
                    type: "AbsolutePosition",
                    matrix: [ 400, 0, 0, 0,   0, 1, 0, 0,    0, 0, 1, 0,   0, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }
            },
            children: {
                factoryName: {
                    factory: "baseui",
                    type: "Label",
                    position: "factoryName",
                    order: 0,
                    config: {
                        "text": "factory name"
                    }
                },
                typeName: {
                    factory: "baseui",
                    type: "Label",
                    position: "typeName",
                    order: 1,
                    config: {
                        "text": "type name"
                    }
                },
                description: {
                    factory: "baseui",
                    type: "Label",
                    position: "description",
                    order: 1,
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
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 10, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                library: {
                    type: "AbsolutePosition",
                    matrix: [ 180, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   80, 10, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                choices: {
                    type: "AbsolutePosition",
                    matrix: [ 380, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   10, 50, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    order: 0,
                    config: {
                        "text": "Library:"
                    }
                },
                library: {
                    factory: "domvisual",
                    type: "DOMSelect",
                    position: "library",
                    order: 1,
                    config: {
                        "options": [ "fake" ]
                    }
                },
                choices: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "choices",
                    order: 2,
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
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                xLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                yLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                wLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                hLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                positionLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapLeftLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   75, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapRightLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapTopLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapBottomLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   225, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },

                name: {
                    type: "AbsolutePosition",
                    matrix: [ 120, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                x: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                y: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                w: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                h: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                position: {
                    type: "AbsolutePosition",
                    matrix: [ 150, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                transform: {
                    type: "AbsolutePosition",
                    matrix: [ 150, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   210, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },

                snapLeft: {
                    type: "AbsolutePosition",
                    matrix: [ 15, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   55, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapRight: {
                    type: "AbsolutePosition",
                    matrix: [ 15, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   105, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapTop: {
                    type: "AbsolutePosition",
                    matrix: [ 15, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   155, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                snapBottom: {
                    type: "AbsolutePosition",
                    matrix: [ 15, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   205, 105, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }

            },
            children: {
                nameLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "nameLabel",
                    order: 0,
                    config: {
                        "text": "name:"
                    }
                },
                xLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "xLabel",
                    order: 0,
                    config: {
                        "text": "x:"
                    }
                },
                yLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "yLabel",
                    order: 1,
                    config: {
                        "text": "y:"
                    }
                },
                wLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "wLabel",
                    order: 0,
                    config: {
                        "text": "w:"
                    }
                },
                hLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "hLabel",
                    order: 1,
                    config: {
                        "text": "h:"
                    }
                },
                positionLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "positionLabel",
                    order: 1,
                    config: {
                        "text": "layout:"
                    }
                },
                snapLeftLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "snapLeftLabel",
                    order: 1,
                    config: {
                        "text": "left"
                    }
                },
                snapRightLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "snapRightLabel",
                    order: 1,
                    config: {
                        "text": "right"
                    }
                },
                snapTopLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "snapTopLabel",
                    order: 1,
                    config: {
                        "text": "top"
                    }
                },
                snapBottomLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "snapBottomLabel",
                    order: 1,
                    config: {
                        "text": "bottom"
                    }
                },

                name: {
                    factory: "baseui",
                    type: "Input",
                    position: "name",
                    order: 0,
                    config: {
                        "text": ""
                    }
                },
                x: {
                    factory: "baseui",
                    type: "Input",
                    position: "x",
                    order: 0,
                    config: {
                        "text": "0"
                    }
                },
                y: {
                    factory: "baseui",
                    type: "Input",
                    position: "y",
                    order: 1,
                    config: {
                        "text": "0"
                    }
                },
                w: {
                    factory: "baseui",
                    type: "Input",
                    position: "w",
                    order: 0,
                    config: {
                        "text": "0"
                    }
                },
                h: {
                    factory: "baseui",
                    type: "Input",
                    position: "h",
                    order: 1,
                    config: {
                        "text": "0"
                    }
                },
                position: {
                    factory: "domvisual",
                    type: "DOMSelect",
                    position: "position",
                    order: 1,
                    config: {
                        "options": [ "AbsolutePosition", "TransformPosition" ]
                    }
                },
                transform: {
                    factory: "domvisual",
                    type: "DOMSelect",
                    position: "transform",
                    order: 1,
                    config: {
                        "options": [ "distort", "fitw", "fith", "showall", "cover" ]
                    }
                },
                snapLeft: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "snapLeft",
                    order: 1,
                    config: {
                        "type": "checkbox"
                    }
                },
                snapRight: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "snapRight",
                    order: 1,
                    config: {
                        "type": "checkbox"
                    }
                },
                snapTop: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "snapTop",
                    order: 1,
                    config: {
                        "type": "checkbox"
                    }
                },
                snapBottom: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "snapBottom",
                    order: 1,
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
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }
            },
            children: {
                scalingLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "scalingLabel",
                    order: 1,
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
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                hLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                w: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                h: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 5, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                descriptionLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                privateLabel: {
                    type: "AbsolutePosition",
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   25, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                description: {
                    type: "AbsolutePosition",
                    matrix: [ 380, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                privateCheck: {
                    type: "AbsolutePosition",
                    matrix: [ 15, 0, 0, 0,   0, 15, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }
            },
            children: {
                wLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "wLabel",
                    order: 0,
                    config: {
                        "text": "w:"
                    }
                },
                hLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "hLabel",
                    order: 1,
                    config: {
                        "text": "h:"
                    }
                },
                descriptionLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "descriptionLabel",
                    order: 1,
                    config: {
                        "text": "description:"
                    }
                },
                privateLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "privateLabel",
                    order: 1,
                    config: {
                        "text": "private"
                    }
                },
                w: {
                    factory: "baseui",
                    type: "Input",
                    position: "w",
                    order: 0,
                    config: {
                        "text": "0"
                    }
                },
                h: {
                    factory: "baseui",
                    type: "Input",
                    position: "h",
                    order: 1,
                    config: {
                        "text": "0"
                    }
                },
                description: {
                    factory: "baseui",
                    type: "Input",
                    position: "description",
                    order: 1,
                    config: {
                        "text": ""
                    }
                },
                privateCheck: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "privateCheck",
                    order: 1,
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
                    matrix: [ 280, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 2, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                enableView: {
                    type: "AbsolutePosition",
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   290, 2, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                },
                enableSelection: {
                    type: "AbsolutePosition",
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   320, 2, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'top' }
                }

            },
            children: {
                name: {
                    factory: "baseui",
                    type: "Label",
                    position: "name",
                    order: 1,
                    config: {
                    }
                },
                enableView: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "enableView",
                    order: 1,
                    config: {
                        url: 'editor/lib/enableView.png'
                    }
                },
                enableSelection: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "enableSelection",
                    order: 1,
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
        },

    }
};
