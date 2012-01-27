// The edited definition of this component
exports.definition = {
    groups: {
        // the editor
        Editor: {
            // authoring dimension
            dimensions: [ 640, 400, 0],
            /*positions: {
                toolbox: {
                    type: "AbsolutePosition",
                    matrix: [ 200, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 0 ],
                    snapping: { leftTo: 'left', rightTo: 'left', topTo: 'top', bottomTo: 'bottom' }
                },
                viewer: {
                    type: "AbsolutePosition",
                    matrix: [ 440, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   200, 0, 0, 0 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                }                
            },*/
            positions: {
                toolbox: {
                    type: "TransformPosition",
                    matrix: [ 200, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    scalemode: 'distort'
                },
                viewer: {
                    type: "TransformPosition",
                    matrix: [ 440, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   200, 0, 0, 1 ],
                    scalemode: 'distort'
                }                
            },
            children: {
                toolbox: {
                    factory: "editor",   // BAD: WORKAROUND
                    type: "Toolbox",
                    position: "toolbox",        // maybe: NO position should be layout by the natural flowing
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "class": [ "editorEditortoolbox" ]
                    }                
                },
                viewer: {
                    factory: "editor",
                    type: "GroupViewer",
                    position: "viewer",
                    enableScaling: false,
                    depth: 1,
                    config: {
                        "class": [ "editor_Editor_viewer" ]
                    }                
                }
            }
        },
        // the left toolbox
// THIS, USING FLOW POSITIONS AND AUTO SIZE IS SOMEHOW THE MOST COMPLICATED THING FOR
// THE EDITOR... MAYBE WE SHOULD ONLY USE CSS FOR THIS KIND OF STUFF
        Toolbox: {
            // this could be empty, if all our content is flowed
            dimensions: [ 200, 480, 1],
            positions: {
                tools: {
                    type: "AbsolutePosition",
                    matrix: [ 200, 0, 0, 0,   0, 100, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'top' }
                },
                tooldata: {
                    type: "AbsolutePosition",
                    matrix: [ 200, 0, 0, 0,   0, 380, 0, 0,    0, 0, 1, 0,   0, 100, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                }                
            },
            children: {
                tools: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "tools",
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "class": [ "editor_Toolbox_tools" ]
                    }                
                },
                tooldata: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "tooldata",
                    enableScaling: false,
                    depth: 1,
                    config: {
                        "class": [ "editor_Toolbox_tooldata" ]
                    }                
                }
            }
        },
        Tool: {
            // this could be empty, if all our content is flowed
            dimensions: [ 20, 20, 0],
            positions: {
                image: {
                    type: "AbsolutePosition",
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { leftTo: 'left', rightTo: 'right', topTo: 'top', bottomTo: 'bottom' }
                }
            },
            children: {
                image: {
                    factory: "domvisual",
                    type: "DOMImg",
                    position: "image",
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "class": [ "editor_Tool_image" ]
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
                    depth: 0,
                    config: {
                        "class": [ "editor_GroupViewer_visuals" ]
                    }                
                },
                positions: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: null,
                    enableScaling: false,
                    depth: 1,
                    config: {
                        "class": [ "transparent" ]
                    }                
                },
                decorations: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "editArea",
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "class": [ "transparent" ]
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
                    depth: 0,
                    config: {
                        "class": [ "editor_SelectionBox_selectionArea" ]
                    }                
                },
                topLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topLeft",
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }                
                },
                topRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "topRight",
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }                
                },
                bottomLeft: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomLeft",
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }                
                },
                bottomRight: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "bottomRight",
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "class": [ "editor_SelectionBox_knob" ]
                    }                
                }                
            }
        }        
    }
};

