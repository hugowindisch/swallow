// The edited definition of this component
exports.definition = {
    groups: {
        // the editor
        Editor: {
            // authoring dimension
            dimensions: [ 640, 400, 0],
            positions: {
                menu: {
                    order: 3,
                    matrix: [ 640, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'px', bottom: 'auto' }
                },
                tools: {
                    order: 0,
                    matrix: [ 386, 0, 0, 0,   0, 64, 0, 0,    0, 0, 1, 0,   5, 29, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                panel: {
                    order: 1,
                    matrix: [ 390, 0, 0, 0,   0, 302, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'auto', bottom: 'px' }
                },
                viewer: {
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
                    order: 0,
                    matrix: [ 440, 0, 0, 0,   0, 480, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'auto', bottom: 'px' }
                },
                grid: {
                    order: 1,
                    matrix: [ 200, 0, 0, 0,   0, 200, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                decorations: {
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
                        "style": { factory: 'editor', type: 'GroupViewer', style: 'page' }
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
                    order: 0,
                    matrix: [ 400, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'auto', bottom: 'px' }
                },
                topLeft: {
                    order: 1,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, -10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                topRight: {
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, -10, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                bottomLeft: {
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, 400, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'auto', height: 'px', bottom: 'px' }
                },
                bottomRight: {
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
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                factoryName: {
                    order: 1,
                    matrix: [ 100, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   75, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                typeName: {
                    order: 2,
                    matrix: [ 200, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   75, 25, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                description: {
                    order: 3,
                    matrix: [ 300, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   180, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                configurationSheet: {
                    order: 5,
                    matrix: [ 360, 0, 0, 0,   0, 1, 0, 0,    0, 0, 1, 0,   0, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
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
                    order: 0,
                    matrix: [ 400, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', height: 'auto', bottom: 'px' }
                },
                topLeft: {
                    order: 1,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, -10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                topRight: {
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, -10, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                bottomLeft: {
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, 400, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'auto', height: 'px', bottom: 'px' }
                },
                bottomRight: {
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
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   0, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                library: {
                    order: 1,
                    matrix: [ 180, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   75, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                choices: {
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
                    order: 0,
                    matrix: [ 30, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                xLabel: {
                    order: 1,
                    matrix: [ 30, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                yLabel: {
                    order: 2,
                    matrix: [ 30, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   165, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                wLabel: {
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                hLabel: {
                    order: 4,
                    matrix: [ 30, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   165, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                opacityLabel: {
                    order: 5,
                    matrix: [ 30, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                opacityInput: {
                    order: 6,
                    matrix: [ 40, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   75, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                opacitySlider: {
                    order: 7,
                    matrix: [ 230, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   125, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                name: {
                    order: 10,
                    matrix: [ 120, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   75, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                x: {
                    order: 11,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   75, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                y: {
                    order: 12,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   215, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                w: {
                    order: 13,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   75, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                h: {
                    order: 14,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   215, 55, 0, 1 ],
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
            dimensions: [ 360, 170, 0],
            positions: {
                wLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                hLabel: {
                    order: 1,
                    matrix: [ 30, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   165, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                gridLabel: {
                    order: 1,
                    matrix: [ 30, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                w: {
                    order: 2,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   75, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                h: {
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   215, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                grid: {
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   75, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                descriptionLabel: {
                    order: 4,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateLabel: {
                    order: 5,
                    matrix: [ 200, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   25, 105, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateStylesLabel: {
                    order: 5,
                    matrix: [ 200, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   25, 130, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                description: {
                    order: 6,
                    matrix: [ 355, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 80, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateCheck: {
                    order: 7,
                    matrix: [ 15, 0, 0, 0,   0, 15, 0, 0,    0, 0, 1, 0,   5, 100, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateStylesCheck: {
                    order: 7,
                    matrix: [ 15, 0, 0, 0,   0, 15, 0, 0,    0, 0, 1, 0,   5, 125, 0, 1 ],
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
                        "text": "private component"
                    }
                },
                privateStylesLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "privateStylesLabel",
                    config: {
                        "text": "private styles"
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
                },
                privateStylesCheck: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "privateStylesCheck",
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
                    order: 0,
                    matrix: [ 280, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 2, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                enableView: {
                    order: 1,
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   290, 2, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                enableSelection: {
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
                    order: 0,
                    matrix: [ 150, 0, 0, 0,  0, 120, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                tl: {
                    order: 1,
                    matrix: [ 22, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                t: {
                    order: 2,
                    matrix: [ 82, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,  22, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                tr: {
                    order: 3,
                    matrix: [ 22, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0,   104, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                l: {
                    order: 4,
                    matrix: [ 22, 0, 0, 0,  0, 52, 0, 0, 0, 0, 1, 0,    0, 22, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                m: {
                    order: 5,
                    matrix: [ 82, 0, 0, 0,  0, 52, 0, 0, 0, 0, 1, 0,  22, 22, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                r: {
                    order: 6,
                    matrix: [ 22, 0, 0, 0,  0, 52, 0, 0, 0, 0, 1, 0,  104, 22, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                bl: {
                    order: 7,
                    matrix: [ 22, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0,  0, 74, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                b: {
                    order: 8,
                    matrix: [ 82, 0, 0, 0,  0, 22, 0, 0, 0, 0, 1, 0,  22, 74, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                br: {
                    order: 9,
                    matrix: [ 22, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0, 104, 74, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                txt: {
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
                    order: 0,
                    matrix: [ 150, 0, 0, 0,  0, 120, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
                },
                preview: {
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
            dimensions: [340, 60, 1],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                clear: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                radius: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: { text: "Corner", bold: true}
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "clear",
                    config: { value: true }
                },
                radius: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    position: "radius",
                    config: { label: "Radius:", value: 0, minValue: 0, maxValue: 100, check: true}
                }
            }
        },
        StyleSettingBorder: {
            dimensions: [340, 380, 1],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                clear: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                width: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleSolid: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   65, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleDashed: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   115, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleDotted: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   165, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleNone: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   215, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                colorLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                colorCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                color: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 160, 0, 0,  0, 0, 1, 0,   0, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: { text: "Corner", bold: true}
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "clear",
                    config: { value: true }
                },
                width: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    position: "width",
                    config: { label: "Width:", minValue: 0, maxValue: 30, value: 0, check: true }
                },
                styleLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "styleLabel",
                    config: { text: "Style:"}
                },
                styleSolid: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "styleSolid",
                    config: {
                        url: 'editor/lib/bssolid.png'
                    }
                },
                styleDashed: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "styleDashed",
                    config: {
                        url: 'editor/lib/bsdashed.png'
                    }
                },
                styleDotted: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "styleDotted",
                    config: {
                        url: 'editor/lib/bsdotted.png'
                    }
                },
                styleNone: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "styleNone",
                    config: {
                        url: 'editor/lib/bsnone.png'
                    }
                },
                styleCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "styleCheck",
                    config: { value: true }
                },
                colorLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "colorLabel",
                    config: { text: "Color:"}
                },
                colorCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "colorCheck",
                    config: { value: true }
                },
                color: {
                    factory: "baseui",
                    type: "ColorPicker",
                    position: "color",
                    config: { }
                }
            }
        },
        StyleSettingBackground: {
            dimensions: [340, 260, 1],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                clear: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                colorLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                colorCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                color: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 160, 0, 0,  0, 0, 1, 0,   0, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: { text: "Corner", bold: true}
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "clear",
                    config: { value: true }
                },
                colorLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "colorLabel",
                    config: { text: "Color:"}
                },
                colorCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "colorCheck",
                    config: { value: true }
                },
                color: {
                    factory: "baseui",
                    type: "ColorPicker",
                    position: "color",
                    config: { }
                }
            }
        },
        StyleSettingText: {
            dimensions: [340, 100, 1],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                clear: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontFamilyLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontFamily: {
                    order: 0,
                    matrix: [ 120, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   65, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontFamilyCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontSize: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontWeightLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontWeightNormal: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   65, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontWeightBold: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   115, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontWeightBolder: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   165, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontWeightLighter: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   215, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                fontWeightCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                colorLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                colorCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                color: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 160, 0, 0,  0, 0, 1, 0,   0, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: { text: "Corner", bold: true}
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "clear",
                    config: { value: true }
                },
                fontFamilyLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "fontFamilyLabel",
                    config: { text: "Family:"}
                },
                fontFamily: {
                    factory: "baseui",
                    type: "Input",
                    position: "fontFamily",
                    config: { }
                },
                fontFamilyCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "fontFamilyCheck",
                    config: { value: true }
                },
                fontSize: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    position: 'fontSize',
                    config: { label: 'Size:', value: 8, minValue: 8, maxValue: 60, check: true }
                },
                fontWeightLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "fontWeightLabel",
                    config: { text: "Weight:"}
                },
                fontWeightNormal: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "fontWeightNormal",
                    config: {
                        url: 'editor/lib/fsnormal.png'
                    }
                },
                fontWeightBold: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "fontWeightBold",
                    config: {
                        url: 'editor/lib/fsbold.png'
                    }
                },
                fontWeightBolder: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "fontWeightBolder",
                    config: {
                        url: 'editor/lib/fsbolder.png'
                    }
                },
                fontWeightLighter: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "fontWeightLighter",
                    config: {
                        url: 'editor/lib/fslight.png'
                    }
                },
                fontWeightCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "fontWeightCheck",
                    config: { value: true }
                },
                colorLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "colorLabel",
                    config: { text: "Color:"}
                },
                colorCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "colorCheck",
                    config: { value: true }
                },
                color: {
                    factory: "baseui",
                    type: "ColorPicker",
                    position: "color",
                    config: { }
                }
            }
        },
        StyleSettingShadow: {
            dimensions: [340, 100, 1],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                clear: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                offsetX: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                offsetY: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                blurRadius: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                spreadRadius: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                color: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 160, 0, 0,  0, 0, 1, 0,   0, 150, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: { text: "Corner", bold: true}
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "clear",
                    config: { value: true }
                },
                offsetX: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    position: 'offsetX',
                    config: { label: 'OffsetX:', value: 0, minValue: 0, maxValue: 100, check: true }
                },
                offsetY: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    position: 'offsetY',
                    config: { label: 'OffsetY:', value: 0, minValue: 0, maxValue: 100, check: true }
                },
                blurRadius: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    position: 'blurRadius',
                    config: { label: 'Blur:', value: 0, minValue: 0, maxValue: 100, check: true }
                },
                spreadRadius: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    position: 'spreadRadius',
                    config: { label: 'Spread:', value: 0, minValue: 0, maxValue: 100, check: true }
                },
                color: {
                    factory: "baseui",
                    type: "ColorPicker",
                    position: "color",
                    config: { }
                }
            }
        },
        StyleInfo: {
            dimensions: [110, 110, 1],
            positions: {
                selectionBox: {
                    order: 0,
                    matrix: [ 110, 0, 0, 0,  0, 110, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                background: {
                    order: 0,
                    matrix: [ 50, 0, 0, 0,   0, 50, 0, 0,    0, 0, 1, 0,   30, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                preview: {
                    order: 1,
                    matrix: [ 40, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   35, 15, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                label: {
                    order: 2,
                    matrix: [ 90, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   10, 70, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                selectionBox: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "selectionBox",
                    config: {
                        style: 'background'
                    }
                },
                background: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "background",
                    config: {
                        url: 'editor/lib/stylebgsmall.png'
                    }
                },
                preview: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "preview",
                    config: {
                    }
                },
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: {
                        textAlign: 'center'
                    }
                }
            }
        },
        StyleName: {
            dimensions: [360, 80, 9],
            positions: {
                styleNameLabel: {
                    order: 0,
                    matrix: [ 30, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   5, 5, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleName: {
                    order: 0,
                    matrix: [ 140, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   70, 5, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                basedOnLabel: {
                    order: 0,
                    matrix: [ 30, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   5, 35, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                basedOn: {
                    order: 0,
                    matrix: [ 140, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   70, 35, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                extendBtn: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 32, 0, 0,  0, 0, 1, 0,   220, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                deleteBtn: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 32, 0, 0,  0, 0, 1, 0,   290, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                styleNameLabel: {
                    factory: 'baseui',
                    type: 'Label',
                    position: 'styleNameLabel',
                    config: {
                        text: 'Style:'
                    }
                },
                styleName: {
                    factory: 'domvisual',
                    type: 'DOMInput',
                    position: 'styleName',
                    config: {
                    }
                },
                basedOnLabel: {
                    factory: 'baseui',
                    type: 'Label',
                    position: 'basedOnLabel',
                    config: {
                        text: 'Extends:'
                    }
                },
                basedOn: {
                    factory: 'baseui',
                    type: 'Label',
                    position: 'basedOn',
                    config: {
                    }
                },
                extendBtn: {
                    factory: 'baseui',
                    type: 'Button',
                    position: 'extendBtn',
                    config: {
                        text: 'Extend'
                    }
                },
                deleteBtn: {
                    factory: 'baseui',
                    type: 'Button',
                    position: 'deleteBtn',
                    config: {
                        text: 'Delete'
                    }
                }
            }
        },
        StylingHeading: {
            dimensions: [360, 150, 0],
            positions: {
                styleFeature: {
                    order: 0,
                    matrix: [ 150, 0, 0, 0,  0, 120, 0, 0,  0, 0, 1, 0,   15, 5, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                stylePreview: {
                    order: 1,
                    matrix: [ 150, 0, 0, 0,  0, 120, 0, 0,  0, 0, 1, 0,   180, 5, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
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
            }
        },
        Styling: {
            dimensions: [360, 1200, 0],
            positions: {
                styleName: {
                    order: 0,
                    matrix: [ 360, 0, 0, 0,  0, 200, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleHeading: {
                    order: 1,
                    matrix: [ 360, 0, 0, 0,  0, 200, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleEdit : {
                    order: 2,
                    matrix: [ 340, 0, 0, 0,  0, 290, 0, 0,  0, 0, 1, 0,   5, 140, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                localStylePicker : {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,   0, 20, 0, 0,   0, 0, 1, 0,   10, 250, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                stylePicker : {
                    order: 4,
                    matrix: [ 340, 0, 0, 0,   0, 20, 0, 0,   0, 0, 1, 0,   10, 700, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
            },
            children: {
                styleName: {
                    factory: 'editor',
                    type: 'StyleName',
                    position: null,
                    config: {
                    }
                },
                stylingHeading : {
                    factory: 'editor',
                    type: 'StylingHeading',
                    position: null,
                    config: {
                    }
                },
                localStylePicker : {
                    factory: 'editor',
                    type: 'StylePicker',
                    position: null,
                    config: {
                    }
                },
                stylePicker: {
                    factory: 'editor',
                    type: 'StylePicker',
                    position: null,
                    config: {
                    }
                }
            }
        },
        EmptyPosition: {
            dimensions: [100, 100, 0],
            positions: {
                pos: {
                    order: 0,
                    matrix: [ 100, 0, 0, 0,   0, 100, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
                },
                img: {
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
        LabelValueSliderCheck: {
            dimensions: [340, 25, 0],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                value: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   65, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                slider: {
                    order: 0,
                    matrix: [ 180, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   130, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                check: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   316, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    position: "label",
                    config: { text: "Size:"}
                },
                value: {
                    factory: "domvisual",
                    type: "DOMInput",
                    position: "value",
                    config: { text: "0"}
                },
                slider: {
                    factory: "baseui",
                    type: "Slider",
                    position: "slider",
                    config: { value: 0, minValue: 0, maxValue: 50 }
                },
                check: {
                    factory: "baseui",
                    type: "CheckBox",
                    position: "check",
                    config: { value: true }
                }
            }
        }
    }
};
