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
                    matrix: [ 200, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   0, 0, 0, 0 ],
                    scalemode: 'distort'
                },
                viewer: {
                    type: "TransformPosition",
                    matrix: [ 440, 0, 0, 0,   0, 400, 0, 0,    0, 0, 1, 0,   200, 0, 0, 0 ],
                    scalemode: 'distort'
                }                
            },
            children: {
                toolbox: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "toolbox",        // maybe: NO position should be layout by the natural flowing
                    enableScaling: false,
                    depth: 0,
                    config: {
                        "domvisual.DOMVisual": {
                            "cssClass": [ "swagup", "editor", "toolbox" ]
                        }
                    }                
                },
                viewer: {
                    factory: "domvisual",
                    type: "DOMElement",
                    position: "viewer",
                    enableScaling: false,
                    depth: 1,
                    config: {
                        "domvisual.DOMVisual": {
                            "cssClass": [ "swagup", "editor", "viewer" ]
                        }
                    }                
                }
            }
        },
        // the left toolbox
// THIS, USING FLOW POSITIONS AND AUTO SIZE IS SOMEHOW THE MOST COMPLICATED THING FOR
// THE EDITOR... MAYBE WE SHOULD ONLY USE CSS FOR THIS KIND OF STUFF
        ToolBox: {
            // this could be empty, if all our content is flowed
            dimensions: [ 200, 480, 0],
            positions: {
            },
            children: {
            }
        },
        // the right viewer
        Viewer: {
            dimensions: [ 440, 480, 0],
            positions: {
            },
            children: {
            }
        }
    }
};

