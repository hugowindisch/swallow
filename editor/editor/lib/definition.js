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
                },
                grid: {
                    type: "Position",
                    order: 1,
                    matrix: [ 200, 0, 0, 0,   0, 200, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                decorations: {
                    type: "Position",
                    order: 2,
                    matrix: [ 440, 0, 0, 0,   0, 480, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'auto', bottom: 'px' }
                },

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
                grid: {
                    factory: "domvisual",
                    type: "DOMCanvas",
                    position: "grid",
                    config: { width: 100, height: 100 }
                },
                decorations: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "decorations",
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
            dimensions: [360, 50, 0],
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
                    matrix: [ 200, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   70, 25, 0, 1 ],
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
                    matrix: [ 360, 0, 0, 0,   0, 1, 0, 0,    0, 0, 1, 0,   0, 80, 0, 1 ],
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
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   0, 10, 0, 1 ],
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
                    matrix: [ 380, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   0, 50, 0, 1 ],
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
            dimensions: [ 360, 1, 0],
            positions: {},
            children: {}
        },
        ComponentInfo: {
            dimensions: [ 360, 140, 0],
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
                gridLabel: {
                    type: "Position",
                    order: 1,
                    matrix: [ 30, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
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
                grid: {
                    type: "Position",
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   55, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                descriptionLabel: {
                    type: "Position",
                    order: 4,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateLabel: {
                    type: "Position",
                    order: 5,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   25, 105, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                description: {
                    type: "Position",
                    order: 6,
                    matrix: [ 355, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateCheck: {
                    type: "Position",
                    order: 7,
                    matrix: [ 15, 0, 0, 0,   0, 15, 0, 0,    0, 0, 1, 0,   5, 105, 0, 1 ],
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
                gridLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "gridLabel",
                    config: {
                        "text": "grid:"
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
                grid: {
                    factory: "baseui",
                    type: "Input",
                    position: "grid",
                    config: {
                        "text": "8"
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
            dimensions: [360, 25, 1],
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
        StyleFeatureSelector: {
            dimensions: [150, 120, 1],
            positions: {
                s: {
                    type: "Position",
                    order: 0,
                    matrix: [ 150, 0, 0, 0,  0, 120, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                tl: {
                    type: "Position",
                    order: 1,
                    matrix: [ 22, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                t: {
                    type: "Position",
                    order: 2,
                    matrix: [ 82, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,  22, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                tr: {
                    type: "Position",
                    order: 3,
                    matrix: [ 22, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0,   104, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                l: {
                    type: "Position",
                    order: 4,
                    matrix: [ 22, 0, 0, 0,  0, 52, 0, 0, 0, 0, 1, 0,    0, 22, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                m: {
                    type: "Position",
                    order: 5,
                    matrix: [ 82, 0, 0, 0,  0, 52, 0, 0, 0, 0, 1, 0,  22, 22, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                r: {
                    type: "Position",
                    order: 6,
                    matrix: [ 22, 0, 0, 0,  0, 52, 0, 0, 0, 0, 1, 0,  104, 22, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                bl: {
                    type: "Position",
                    order: 7,
                    matrix: [ 22, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0,  0, 74, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                b: {
                    type: "Position",
                    order: 8,
                    matrix: [ 82, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0,  22, 74, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                br: {
                    type: "Position",
                    order: 9,
                    matrix: [ 22, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0, 104, 74, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                txt: {
                    type: "Position",
                    order: 10,
                    matrix: [ 35, 0, 0, 0,  0, 39, 0, 0,  0, 0, 1, 0, 27, 27, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                s: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 's',
                    config: {
                        url: 'editor/lib/sp_s.png'
                    }
                },
                tl: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'tl',
                    config: {
                        url: 'editor/lib/sp_tl.png'
                    }
                },
                t: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 't',
                    config: {
                        url: 'editor/lib/sp_t.png'
                    }
                },
                tr: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'tr',
                    config: {
                        url: 'editor/lib/sp_tr.png'
                    }
                },
                l: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'l',
                    config: {
                        url: 'editor/lib/sp_l.png'
                    }
                },
                m: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'm',
                    config: {
                        url: 'editor/lib/sp_m.png'
                    }
                },
                r: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'r',
                    config: {
                        url: 'editor/lib/sp_r.png'
                    }
                },
                bl: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'bl',
                    config: {
                        url: 'editor/lib/sp_bl.png'
                    }
                },
                b: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'b',
                    config: {
                        url: 'editor/lib/sp_b.png'
                    }
                },
                br: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'br',
                    config: {
                        url: 'editor/lib/sp_br.png'
                    }
                },
                txt: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'txt',
                    config: {
                        url: 'editor/lib/sp_txt.png'
                    }
                }
            }
        },
        StylePreview: {
            dimensions: [150, 120, 1],
            positions: {
                background: {
                    type: "Position",
                    order: 0,
                    matrix: [ 150, 0, 0, 0,  0, 120, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
                },
                preview: {
                    type: "Position",
                    order: 1,
                    matrix: [ 76, 0, 0, 0,  0, 60, 0, 0, 0, 0, 1, 0,   37, 30, 0, 1],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
                }
            },
            children: {
                background: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    position: 'background',
                    config: {
                        url: 'editor/lib/previewbg.png'
                    }
                },
                preview: {
                    factory: 'domvisual',
                    type: 'DOMElement',
                    position: 'preview',
                    config: {
                    }
                }
            }
        },
        StylePicker: {
            dimensions: [340, 100, 1],
            positions: {
            },
            children: {
            }
        },
        StyleSettingCorner: {
            dimensions: [340, 100, 1],
            positions: {
                label: {
                    type: "Position",
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                clear: {
                    type: "Position",
                    order: 0,
                    matrix: [ 100, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   240, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                radiusLabel: {
                    type: "Position",
                    order: 0,
                    matrix: [ 100, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                radiusValue: {
                    type: "Position",
                    order: 0,
                    matrix: [ 100, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   105, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                radiusSlider: {
                    type: "Position",
                    order: 0,
                    matrix: [ 130, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   210, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
/*                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: { text: "Corner"}
                },
                clear: {
                    factory: "baseui",
                    type: "Button",
                    position: "clear",
                    config: { text: "Clear"}
                },
                radiusLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "radiusLabel",
                    config: { text: "Radius:"}
                },
                radiusValue: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "radiusValue",
                    config: { value: "0"}
                },
                radiusSlider: {
                    factory: "baseui",
                    type: "Slider",
                    position: "radiusSlider",
                    config: { value: 0 }
                }*/
            }
        },
        StyleSettingBorder: {
            dimensions: [340, 100, 1],
            positions: {
            },
            children: {
            }
        },
        StyleSettingBackground: {
            dimensions: [340, 100, 1],
            positions: {
            },
            children: {
            }
        },
        StyleSettingText: {
            dimensions: [340, 100, 1],
            positions: {
            },
            children: {
            }
        },
        StyleSettingShadow: {
            dimensions: [340, 100, 1],
            positions: {
            },
            children: {
            }
        },
        StyleInfo: {
            dimensions: [360, 60, 1],
            positions: {
                selectionBox: {
                    type: "Position",
                    order: 0,
                    matrix: [ 350, 0, 0, 0,  0, 45, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                preview: {
                    type: "Position",
                    order: 1,
                    matrix: [ 140, 0, 0, 0,   0, 30, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                edit: {
                    type: "Position",
                    order: 2,
                    matrix: [ 20, 0, 0, 0,   0, 30, 0, 0,    0, 0, 1, 0,   290, 2, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                'delete': {
                    type: "Position",
                    order: 3,
                    matrix: [ 20, 0, 0, 0,   0, 30, 0, 0,    0, 0, 1, 0,   290, 27, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                selectionBox: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "selectionBox",
                    config: {
                        style: {factory: 'baseui', type: 'Theme', style: 'pressedButtonBackground'}
                    }
                },
                preview: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "preview",
                    config: {
                    }
                }
            }
        },
        Styling: {
            dimensions: [390, 100, 0],
            positions: {
                styleFeature: {
                    type: "Position",
                    order: 0,
                    matrix: [ 150, 0, 0, 0,  0, 120, 0, 0,  0, 0, 1, 0,   15, 5, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                stylePreview: {
                    type: "Position",
                    order: 1,
                    matrix: [ 150, 0, 0, 0,  0, 120, 0, 0,  0, 0, 1, 0,   180, 5, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleEdit : {
                    type: "Position",
                    order: 2,
                    matrix: [ 340, 0, 0, 0,  0, 100, 0, 0, 0, 0, 0, 1, 0,   5, 130, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleList : {
                    type: "Position",
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 120, 0, 0, 0, 0, 0, 1, 0,   160, 5, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
            },
            children: {
                styleFeature: {
                    factory: 'editor',
                    type: 'StyleFeatureSelector',
                    position: 'styleFeature',
                    config: {
                    }
                },
                stylePreview: {
                    factory: 'editor',
                    type: 'StylePreview',
                    position: 'stylePreview',
                    config: {

                    }
                },
                styleList: {
                    factory: 'domvisual',
                    type: 'DOMElement',
                    position: 'styleList',
                    config: {
                    }
                }
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
                },
                img: {
                    type: "Position",
                    order: 0,
                    matrix: [ 24, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   2, 2, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
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
                },
                img: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "img",
                    config: {
                        url: "editor/lib/topleft.png"
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
