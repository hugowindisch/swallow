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
                    enableScaling: false,
                    order: 3,
                    config: {
                    }
                },
                tools: {
                    factory: "baseui",
                    type: "Toolbar",
                    position: "tools",
                    enableScaling: false,
                    order: 0,
                    config: {
                    }                
                },
                panel: {
                    factory: "editor",
                    type: "Panel",
                    position: "panel",
                    enableScaling: false,
                    order: 1,
                    config: {
                        "style": "panel"
                    }                
                },
                viewer: {
                    factory: "editor",
                    type: "GroupViewer",
                    position: "viewer",
                    enableScaling: false,
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
                    enableScaling: false,
                    order: 0,
                    config: {
                        "style": "page"
                    }                
                },
                positions: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: null,
                    enableScaling: false,
                    order: 1,
                    config: {
                    }                
                },
                decorations: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "editArea",
                    enableScaling: false,
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
                    enableScaling: false,
                    order: 0,
                    config: {
                        "class": [ "editor_SelectionBox_selectionArea" ]
                    }                
                },
                topLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topLeft",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }                
                },
                topRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topRight",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }                
                },
                bottomLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomLeft",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }                
                },
                bottomRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomRight",
                    enableScaling: false,
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
                    enableScaling: false,
                    order: 0,
                    config: {
                        "text": "factory name"
                    }                
                },
                typeName: {
                    factory: "baseui",
                    type: "Label",
                    position: "typeName",
                    enableScaling: false,
                    order: 1,
                    config: {
                        "text": "factory name"
                    }                
                }
            }
        },
        VisualList: {
            dimensions: [390, 400, 0],
            positions: {
            },
            children: {
            }
        },
        SelectionInfo: {
            dimensions: [390, 90, 0],
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
                }
            },
            children: {
                nameLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "nameLabel",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "text": "name:"
                    }                                    
                },
                xLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "xLabel",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "text": "x:"
                    }                
                },
                yLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "yLabel",
                    enableScaling: false,
                    order: 1,
                    config: {
                        "text": "y:"
                    }                
                },
                wLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "wLabel",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "text": "w:"
                    }                
                },
                hLabel: {
                    factory: "baseui",
                    type: "Label",
                    position: "hLabel",
                    enableScaling: false,
                    order: 1,
                    config: {
                        "text": "h:"
                    }                
                },
                name: {
                    factory: "baseui",
                    type: "Input",
                    position: "name",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "text": ""
                    }                
                },
                x: {
                    factory: "baseui",
                    type: "Input",
                    position: "x",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "text": "0"
                    }                
                },
                y: {
                    factory: "baseui",
                    type: "Input",
                    position: "y",
                    enableScaling: false,
                    order: 1,
                    config: {
                        "text": "0"
                    }                
                },
                w: {
                    factory: "baseui",
                    type: "Input",
                    position: "w",
                    enableScaling: false,
                    order: 0,
                    config: {
                        "text": "0"
                    }                
                },
                h: {
                    factory: "baseui",
                    type: "Input",
                    position: "h",
                    enableScaling: false,
                    order: 1,
                    config: {
                        "text": "0"
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
                    enableScaling: false,
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
        }
    }
};

