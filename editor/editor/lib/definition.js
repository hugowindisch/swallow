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
                tooldata: {
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
                tooldata: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "tooldata",
                    enableScaling: false,
                    order: 1,
                    config: {
                        "style": "tooldata"
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
        }        
    }
};

