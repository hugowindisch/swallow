// The edited definition of this component
exports.definition = {
    groups: {
        // the editor
        Editor: {
            // authoring dimension
            dimensions: [ 640, 400, 0],
            positions: {
                menu: {
                    type: "Position",
                    order: 3,
                    matrix: [ 640, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'px', bottom: 'auto' }
                },
                tools: {
                    type: "Position",
                    order: 0,
                    matrix: [ 386, 0, 0, 0,   0, 64, 0, 0,    0, 0, 1, 0,   5, 29, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                panel: {
                    type: "Position",
                    order: 1,
                    matrix: [ 390, 0, 0, 0,   0, 302, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'auto', bottom: 'px' }
                },
                viewer: {
                    type: "Position",
                    order: 2,
                    matrix: [ 240, 0, 0, 0,   0, 376, 0, 0,    0, 0, 1, 0,   400, 24, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'auto', bottom: 'px' }
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
                    type: "Position",
                    order: 0,
                    matrix: [ 440, 0, 0, 0,   0, 480, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'auto', bottom: 'px' }
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
                    type: "Position",
                    order: 0,
                    matrix: [ 400, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'auto', bottom: 'px' }
                },
                topLeft: {
                    type: "Position",
                    order: 1,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, -10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                topRight: {
                    type: "Position",
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, -10, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                bottomLeft: {
                    type: "Position",
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, 400, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'auto', height: 'px', bottom: 'px' }
                },
                bottomRight: {
                    type: "Position",
                    order: 3,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, 400, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'auto', height: 'px', bottom: 'px' }
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
                    type: "Position",
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                factoryName: {
                    type: "Position",
                    order: 1,
                    matrix: [ 100, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   70, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                typeName: {
                    type: "Position",
                    order: 2,
                    matrix: [ 400, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   70, 25, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                description: {
                    type: "Position",
                    order: 3,
                    matrix: [ 300, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   180, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                visualProperties: {
                    type: "Position",
                    order: 4,
                    matrix: [ 400, 0, 0, 0,   0, 30, 0, 0,    0, 0, 1, 0,   0, 50, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                configurationSheet: {
                    type: "Position",
                    order: 5,
                    matrix: [ 400, 0, 0, 0,   0, 1, 0, 0,    0, 0, 1, 0,   0, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
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
        // the right viewer
        RotationBox: {
            dimensions: [ 400, 400, 0],
            positions: {
                selectionArea: {
                    type: "Position",
                    order: 0,
                    matrix: [ 400, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'auto', bottom: 'px' }
                },
                topLeft: {
                    type: "Position",
                    order: 1,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, -10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                topRight: {
                    type: "Position",
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, -10, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                bottomLeft: {
                    type: "Position",
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, 400, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'auto', height: 'px', bottom: 'px' }
                },
                bottomRight: {
                    type: "Position",
                    order: 3,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, 400, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'auto', height: 'px', bottom: 'px' }
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
                        "class": [ "editor_RotationBox_knob" ]
                    }
                },
                topRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topRight",
                    config: {
                        "class": [ "editor_RotationBox_knob" ]
                    }
                },
                bottomLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomLeft",
                    config: {
                        "class": [ "editor_RotationBox_knob" ]
                    }
                },
                bottomRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomRight",
                    config: {
                        "class": [ "editor_RotationBox_knob" ]
                    }
                }
            }
        },
        VisualList: {
            dimensions: [390, 80, 0],
            positions: {
                label: {
                    type: "Position",
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                library: {
                    type: "Position",
                    order: 1,
                    matrix: [ 180, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   80, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                choices: {
                    type: "Position",
                    order: 2,
                    matrix: [ 380, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   10, 50, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
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
            dimensions: [390, 130, 0],
            positions: {
                nameLabel: {
                    type: "Position",
                    order: 0,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                xLabel: {
                    type: "Position",
                    order: 1,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                yLabel: {
                    type: "Position",
                    order: 2,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                wLabel: {
                    type: "Position",
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                hLabel: {
                    type: "Position",
                    order: 4,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                opacityLabel: {
                    type: "Position",
                    order: 5,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                opacityInput: {
                    type: "Position",
                    order: 6,
                    matrix: [ 40, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   75, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                opacitySlider: {
                    type: "Position",
                    order: 7,
                    matrix: [ 220, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                name: {
                    type: "Position",
                    order: 10,
                    matrix: [ 120, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                x: {
                    type: "Position",
                    order: 11,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                y: {
                    type: "Position",
                    order: 12,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                w: {
                    type: "Position",
                    order: 13,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                h: {
                    type: "Position",
                    order: 14,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
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
                opacityLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "opacityLabel",
                    config: {
                        "text": "Opacity:"
                    }
                },
                opacityInput: {
                    factory: "baseui",
                    type: "Input",
                    position: "opacityInput",
                    config: {
                        "text": "100"
                    }
                },
                opacitySlider: {
                    factory: "baseui",
                    type: "Slider",
                    position: "opacitySlider",
                    config: {
                        "minValue": 0,
                        "maxValue": 100,
                        "value": 100
                    }
                },

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
                    type: "Position",
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                hLabel: {
                    type: "Position",
                    order: 1,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   125, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                w: {
                    type: "Position",
                    order: 2,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                h: {
                    type: "Position",
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   175, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                descriptionLabel: {
                    type: "Position",
                    order: 4,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateLabel: {
                    type: "Position",
                    order: 5,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   25, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                description: {
                    type: "Position",
                    order: 6,
                    matrix: [ 380, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateCheck: {
                    type: "Position",
                    order: 7,
                    matrix: [ 15, 0, 0, 0,   0, 15, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
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
                    type: "Position",
                    order: 0,
                    matrix: [ 280, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 2, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                enableView: {
                    type: "Position",
                    order: 1,
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   290, 2, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                enableSelection: {
                    type: "Position",
                    order: 2,
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   320, 2, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
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
        },
        EmptyPosition: {
            dimensions: [100, 100, 0],
            positions: {
                pos: {
                    type: "Position",
                    order: 0,
                    matrix: [ 100, 0, 0, 0,   0, 100, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
                }
            },
            children: {
                pos: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "pos",
                    config: {
                        style: "background"
                    }
                }
            }
        },
        SnapButton: {
            dimensions: [18, 18, 0],
            positions: {
                pos: {
                    type: "Position",
                    order: 0,
                    matrix: [ 18, 0, 0, 0,   0, 18, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
                }
            },
            children: {
                pos: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "pos",
                    config: {
                        url: "editor/lib/snappx.png"
                    }
                }
            }
        },

    }
};
