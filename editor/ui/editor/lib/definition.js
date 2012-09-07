/**
    definition.js

    The SwallowApps Editor, an interactive application builder for creating
    html applications.

    Copyright (C) 2012  Hugo Windisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/
// The edited definition of this component
exports.definition = {
    groups: {
        // the editor
        Editor: {
            // authoring dimension
            dimensions: [ 640, 400, 0],
            icon: "editor/img/favicon.png",
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
                    config: {
                        position: 'menu'
                    }
                },
                tools: {
                    factory: "baseui",
                    type: "Toolbar",
                    config: {
                        position: "tools"
                    }
                },
                panel: {
                    factory: "editor",
                    type: "Panel",
                    config: {
                        "style": "panel",
                        position: "panel"
                    }
                },
                viewer: {
                    factory: "editor",
                    type: "GroupViewer",
                    config: {
                        position: "viewer"
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
                }
            },
            children: {
                visuals: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        "style": { factory: 'editor', type: 'GroupViewer', style: 'page' },
                        position: null
                    }
                },
                grid: {
                    factory: "domvisual",
                    type: "DOMCanvas",
                    config: {
                        width: 100,
                        height: 100,
                        position: "grid"
                    }
                },
                decorations: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        position: "decorations"
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
                },
                top: {
                    order: 1,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   195, -10, 0, 1 ],
                    snapping: { left: 'cpx', right: 'cpx', width: 'auto', top: 'px', height: 'px', bottom: 'auto' }
                },
                right: {
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   400, 195, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'cpx', height: 'auto', bottom: 'cpx' }
                },
                bottom: {
                    order: 2,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   195, 400, 0, 1 ],
                    snapping: { left: 'cpx', right: 'cpx', width: 'auto', top: 'auto', height: 'px', bottom: 'px' }
                },
                left: {
                    order: 3,
                    matrix: [ 10, 0, 0, 0,   0, 10, 0, 0,    0, 0, 1, 0,   -10, 195, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'cpx', height: 'auto', bottom: 'cpx' }
                }

            },
            children: {
                selectionArea: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        "class": [ "editor_SelectionBox_selectionArea" ],
                        position: "selectionArea"
                    }
                },
                topLeft: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/sbtl.png",
                        position: "topLeft"
                    }
                },
                top: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/sbt.png",
                        position: "top"
                    }
                },
                topRight: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/sbtr.png",
                        position: "topRight"
                    }
                },
                right: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/sbr.png",
                        position: "right"
                    }
                },
                bottomLeft: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/sbbl.png",
                        position: "bottomLeft"
                    }
                },
                bottom: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/sbb.png",
                        position: "bottom"
                    }
                },
                bottomRight: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/sbbr.png",
                        position: "bottomRight"
                    }
                },
                left: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/sbl.png",
                        position: "left"
                    }
                }
            }
        },
        VisualInfo: {
            dimensions: [360, 60, 0],
            positions: {
                selectionBox : {
                    order: 0,
                    matrix: [ 360, 0, 0, 0,   0, 60, 0, 0,    0, 0, 1, 0,   0, 0, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
                },
                preview: {
                    order: 1,
                    matrix: [ 60, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   5, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                name: {
                    order: 2,
                    matrix: [ 220, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   75, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                description: {
                    order: 4,
                    matrix: [ 220, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   75, 25, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                button: {
                    order: 5,
                    matrix: [ 56, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   300, 5, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                instanciate: {
                    order: 6,
                    matrix: [ 20, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   336, 30, 0, 1 ],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'auto', height: 'px' }
                },
                configurationSheet: {
                    order: 7,
                    matrix: [ 360, 0, 0, 0,   0, 1, 0, 0,    0, 0, 1, 0,   0, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'px', height: 'auto' }
                }
            },
            children: {
                selectionBox: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        "style": "selected",
                        position: "selectionBox"
                    }
                },
                name: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "factory name",
                        "bold": true,
                        position: "name"
                    }
                },
                button: {
                    factory: "baseui",
                    type: "Button",
                    config: {
                        position: 'button',
                        text: 'Edit'
                    }
                },
                instanciate: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        position: "instanciate",
                        url: 'editor/img/enableinstanciation.png',
                        title: 'Instanciate'
                    }
                },
                description: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        position: "description"
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
                    matrix: [ 16, 0, 0, 0,   0, 16, 0, 0,    0, 0, 1, 0,   -16, -16, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                topRight: {
                    order: 2,
                    matrix: [ 16, 0, 0, 0,   0, 16, 0, 0,    0, 0, 1, 0,   400, -16, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'px', height: 'px', bottom: 'auto' }
                },
                bottomLeft: {
                    order: 2,
                    matrix: [ 16, 0, 0, 0,   0, 16, 0, 0,    0, 0, 1, 0,   -16, 400, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'auto', height: 'px', bottom: 'px' }
                },
                bottomRight: {
                    order: 3,
                    matrix: [ 16, 0, 0, 0,   0, 16, 0, 0,    0, 0, 1, 0,   400, 400, 0, 1 ],
                    snapping: { left: 'auto', right: 'px', width: 'px', top: 'auto', height: 'px', bottom: 'px' }
                }
            },
            children: {
                selectionArea: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        "class": [ "editor_SelectionBox_selectionArea" ],
                        position: "selectionArea"
                    }
                },
                topLeft: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/rbtl.png",
                        position: "topLeft"
                    }
                },
                topRight: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/rbtr.png",
                        position: "topRight"
                    }
                },
                bottomLeft: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/rbbl.png",
                        position: "bottomLeft"
                    }
                },
                bottomRight: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        "url": "editor/img/rbbr.png",
                        position: "bottomRight"
                    }
                }
            }
        },
        VisualList: {
            dimensions: [390, 80, 0],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,   0, 20, 0, 0,    0, 0, 1, 0,   5, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                library: {
                    order: 1,
                    matrix: [ 240, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   75, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                unsetContent: {
                    order: 2,
                    matrix: [ 24, 0, 0, 0,   0, 24, 0, 0,    0, 0, 1, 0,   330, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                choices: {
                    order: 3,
                    matrix: [ 380, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   0, 50, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "Package:",
                        position: "label"
                    }
                },
                library: {
                    factory: "domvisual",
                    type: "DOMSelect",
                    config: {
                        "options": [ "fake" ],
                        position: "library"
                    }
                },
                unsetContent: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/plugin/unsetcontent.png',
                        position: 'unsetContent',
                        cursor: 'pointer',
                        title: 'Unset Content'
                    }
                },
                choices: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        position: "choices"
                    }
                }
            }
        },
        SelectionInfo: {
            dimensions: [390, 290, 0],
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
                },
                threeD: {
                    order: 14,
                    matrix: [ 340, 0, 0, 0,   0, 25, 0, 0,    0, 0, 1, 0,   5, 130, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                xRotation: {
                    order: 14,
                    matrix: [ 340, 0, 0, 0,   0, 25, 0, 0,    0, 0, 1, 0,   5, 160, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                yRotation: {
                    order: 14,
                    matrix: [ 340, 0, 0, 0,   0, 25, 0, 0,    0, 0, 1, 0,   5, 190, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                zDepth: {
                    order: 14,
                    matrix: [ 340, 0, 0, 0,   0, 25, 0, 0,    0, 0, 1, 0,   5, 220, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                perspective: {
                    order: 14,
                    matrix: [ 340, 0, 0, 0,   0, 25, 0, 0,    0, 0, 1, 0,   5, 250, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                nameLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "name:",
                        position: "nameLabel"
                    }
                },
                xLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "x:",
                        position: "xLabel"
                    }
                },
                yLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "y:",
                        position: "yLabel"
                    }
                },
                wLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "w:",
                        position: "wLabel"
                    }
                },
                hLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "h:",
                        position: "hLabel"
                    }
                },
                name: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "",
                        position: "name"
                    }
                },
                x: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "0",
                        position: "x"
                    }
                },
                y: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "0",
                        position: "y"
                    }
                },
                w: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "0",
                        position: "w"
                    }
                },
                h: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "0",
                        position: "h"
                    }
                },
                opacityLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "Opacity:",
                        position: "opacityLabel"
                    }
                },
                opacityInput: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "100",
                        position: "opacityInput"
                    }
                },
                opacitySlider: {
                    factory: "baseui",
                    type: "Slider",
                    config: {
                        "minValue": 0,
                        "maxValue": 100,
                        "value": 100,
                        position: "opacitySlider"
                    }
                },
                threeD: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "3D (Experimental):",
                        bold: true,
                        position: "threeD"
                    }
                },
                xRotation: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "X angle:",
                        value: 0,
                        minValue: 0,
                        maxValue: 360,
                        position: "xRotation",
                        checkVisible: false
                    }
                },
                yRotation: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "Y angle:",
                        value: 0,
                        minValue: 0,
                        maxValue: 360,
                        position: "yRotation",
                        checkVisible: false
                    }
                },
                zDepth: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "z Depth:",
                        value: 0,
                        minValue: 0,
                        maxValue: 1000,
                        position: "zDepth",
                        checkVisible: false
                    }
                },
                perspective: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "Fading:",
                        value: 0,
                        minValue: 0,
                        maxValue: 1000,
                        position: "perspective",
                        checkVisible: false
                    }
                }

            }
        },
        ConfigurationSheet: {
            dimensions: [ 360, 1, 0],
            positions: {},
            children: {}
        },
        ComponentInfo: {
            dimensions: [ 360, 230, 0],
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

                overflowXLabel : {
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowXVisible: {
                    order: 3,
                    matrix: [ 28, 0, 0, 0,   0, 28, 0, 0,    0, 0, 1, 0,   75, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowXHidden: {
                    order: 3,
                    matrix: [ 28, 0, 0, 0,   0, 28, 0, 0,    0, 0, 1, 0,   105, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowXAuto: {
                    order: 3,
                    matrix: [ 28, 0, 0, 0,   0, 28, 0, 0,    0, 0, 1, 0,   135, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowXScroll: {
                    order: 3,
                    matrix: [ 28, 0, 0, 0,   0, 28, 0, 0,    0, 0, 1, 0,   165, 55, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowYLabel : {
                    order: 3,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 85, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowYVisible: {
                    order: 3,
                    matrix: [ 28, 0, 0, 0,   0, 28, 0, 0,    0, 0, 1, 0,   75, 85, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowYHidden: {
                    order: 3,
                    matrix: [ 28, 0, 0, 0,   0, 28, 0, 0,    0, 0, 1, 0,   105, 85, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowYAuto: {
                    order: 3,
                    matrix: [ 28, 0, 0, 0,   0, 28, 0, 0,    0, 0, 1, 0,   135, 85, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                overflowYScroll: {
                    order: 3,
                    matrix: [ 28, 0, 0, 0,   0, 28, 0, 0,    0, 0, 1, 0,   165, 85, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                descriptionLabel: {
                    order: 4,
                    matrix: [ 60, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 115, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateLabel: {
                    order: 5,
                    matrix: [ 200, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   25, 165, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateStylesLabel: {
                    order: 5,
                    matrix: [ 200, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   25, 190, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                description: {
                    order: 6,
                    matrix: [ 355, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   5, 140, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateCheck: {
                    order: 7,
                    matrix: [ 15, 0, 0, 0,   0, 15, 0, 0,    0, 0, 1, 0,   5, 160, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                privateStylesCheck: {
                    order: 7,
                    matrix: [ 15, 0, 0, 0,   0, 15, 0, 0,    0, 0, 1, 0,   5, 185, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                wLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "w:",
                        position: "wLabel"
                    }
                },
                hLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "h:",
                        position: "hLabel"
                    }
                },
                gridLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "grid:",
                        position: "gridLabel"
                    }
                },
                descriptionLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "description:",
                        position: "descriptionLabel"
                    }
                },
                privateLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "private component",
                        position: "privateLabel"
                    }
                },
                privateStylesLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "private styles",
                        position: "privateStylesLabel"
                    }
                },
                w: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "0",
                        position: "w"
                    }
                },
                h: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "0",
                        position: "h"
                    }
                },
                grid: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "8",
                        position: "grid"
                    }
                },
                description: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        "text": "",
                        position: "description"
                    }
                },
                privateCheck: {
                    factory: "domvisual",
                    type: "DOMInput",
                    config: {
                        "type": "checkbox",
                        position: "privateCheck"
                    }
                },
                privateStylesCheck: {
                    factory: "domvisual",
                    type: "DOMInput",
                    config: {
                        "type": "checkbox",
                        position: "privateStylesCheck"
                    }
                },
                overflowXLabel : {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "xoverflow:",
                        position: "overflowXLabel"
                    }
                },
                overflowXVisible: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ofxvisible.png',
                        position: "overflowXVisible"
                    }
                },
                overflowXHidden: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ofxhidden.png',
                        position: "overflowXHidden"
                    }
                },
                overflowXAuto: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ofxauto.png',
                        position: "overflowXAuto"
                    }
                },
                overflowXScroll: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ofxscroll.png',
                        position: "overflowXScroll"
                    }
                },
                overflowYLabel : {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        "text": "yoverflow:",
                        position: "overflowYLabel"
                    }
                },
                overflowYVisible: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ofyvisible.png',
                        position: "overflowYVisible"
                    }
                },
                overflowYHidden: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ofyhidden.png',
                        position: "overflowYHidden"
                    }
                },
                overflowYAuto: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ofyauto.png',
                        position: "overflowYAuto"
                    }
                },
                overflowYScroll: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ofyscroll.png',
                        position: "overflowYScroll"
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
                    config: {
                        position: "name"
                    }
                },
                enableView: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/enableView.png',
                        title: 'Enable Viewing',
                        position: "enableView"
                    }
                },
                enableSelection: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/enableSelect.png',
                        title: 'Enable Selection',
                        position: "enableSelection"
                    }
                }
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
                },
                bgi: {
                    order: 11,
                    matrix: [ 14, 0, 0, 0,  0, 16, 0, 0,  0, 0, 1, 0, 82, 50, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                s: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_s.png',
                        title: 'Shadow',
                        position: 's'
                    }
                },
                tl: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_tl.png',
                        title: 'Top Left Corner',
                        position: 'tl'
                    }
                },
                t: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_t.png',
                        title: 'Top Border',
                        position: 't'
                    }
                },
                tr: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_tr.png',
                        title: 'Top Right Corner',
                        position: 'tr'
                    }
                },
                l: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_l.png',
                        title: 'Left Border',
                        position: 'l'
                    }
                },
                m: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_m.png',
                        title: 'Background Color',
                        position: 'm'
                    }
                },
                r: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_r.png',
                        title: 'Right Border',
                        position: 'r'
                    }
                },
                bl: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_bl.png',
                        title: 'Bottom Left Corner',
                        position: 'bl'
                    }
                },
                b: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_b.png',
                        title: 'Bottom Border',
                        position: 'b'
                    }
                },
                br: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_br.png',
                        title: 'Bottom Right Corner',
                        position: 'br'
                    }
                },
                txt: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_txt.png',
                        title: 'Text',
                        position: 'txt'
                    }
                },
                bgi: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/sp_bgi.png',
                        title: 'Background Image',
                        position: 'bgi'
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
                    config: {
                        url: 'editor/img/previewbg.png',
                        position: 'background'
                    }
                },
                preview: {
                    factory: 'domvisual',
                    type: 'DOMElement',
                    config: {
                        position: 'preview'
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
            dimensions: [340, 105, 1],
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
                synch: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                synchCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                radius: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Corner",
                        bold: true,
                        position: "label"
                    }
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "clear"
                    }
                },
                synch: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "All corners in synch",
                        position: "synch"
                    }
                },
                synchCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: false,
                        position: "synchCheck"
                    }
                },
                radius: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "Radius:",
                        value: 0,
                        minValue: 0,
                        maxValue: 100,
                        check: true,
                        position: "radius"
                    }
                }
            }
        },
        StyleSettingBorder: {
            dimensions: [340, 330, 1],
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
                synch: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                synchCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                width: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleSolid: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   65, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleDashed: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   115, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleDotted: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   165, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleNone: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   215, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                styleCheck: {
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
                    matrix: [ 340, 0, 0, 0,  0, 160, 0, 0,  0, 0, 1, 0,   0, 150, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Border",
                        bold: true,
                        position: "label"
                    }
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "clear"
                    }
                },
                synch: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "All borders in synch",
                        position: "synch"
                    }
                },
                synchCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: false,
                        position: "synchCheck"
                    }
                },
                width: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "Width:",
                        minValue: 0,
                        maxValue: 30,
                        value: 0,
                        check: true,
                        position: "width"
                    }
                },
                styleLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Style:",
                        position: "styleLabel"
                    }
                },
                styleSolid: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/bssolid.png',
                        position: "styleSolid"
                    }
                },
                styleDashed: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/bsdashed.png',
                        position: "styleDashed"
                    }
                },
                styleDotted: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/bsdotted.png',
                        position: "styleDotted"
                    }
                },
                styleNone: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/bsnone.png',
                        position: "styleNone"
                    }
                },
                styleCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "styleCheck"
                    }
                },
                colorLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Color:",
                        position: "colorLabel"
                    }
                },
                colorCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "colorCheck"
                    }
                },
                color: {
                    factory: "baseui",
                    type: "ColorPicker",
                    config: {
                        position: "color"
                    }
                }
            }
        },
        StyleSettingBackground: {
            dimensions: [340, 240, 1],
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
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Corner",
                        bold: true,
                        position: "label"
                    }
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "clear"
                    }
                },
                colorLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Color:",
                        position: "colorLabel"
                    }
                },
                colorCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "colorCheck"
                    }
                },
                color: {
                    factory: "baseui",
                    type: "ColorPicker",
                    config: {
                        position: "color"
                    }
                }
            }
        },
        StyleSettingBackgroundImage: {
            dimensions: [340, 640, 1],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                clear: {
                    order: 1,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                itemList: {
                    order: 2,
                    matrix: [ 340, 0, 0, 0,  0, 32, 0, 0,  0, 0, 1, 0,   0, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                ///
                sizeLabel: {
                    order: 3,
                    matrix: [ 300, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 80, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                sizeCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 80, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                sizeXMode: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 110, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                sizeXValue: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 140, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                sizeYMode: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 170, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                sizeYValue: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 200, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                ///
                repeatLabel: {
                    order: 3,
                    matrix: [ 300, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 230, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                repeatCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 230, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                repeatXMode: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 260, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                repeatYMode: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 290, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                ///
                imageSource: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 320, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

/////////////////////////////////////
                gradient: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 300, 0, 0,  0, 0, 1, 0,  0, 350, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                image: {
                    order: 3,
                    matrix: [ 340, 0, 0, 0,  0, 300, 0, 0,  0, 0, 1, 0,  0, 350, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Background Image",
                        bold: true,
                        position: "label"
                    }
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "clear"
                    }
                },
                itemList: {
                    factory: "editor",
                    type: "ItemList",
                    config: {
                        position: "itemList"
                    }
                },
///////////////
                ///
                sizeLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Size",
                        bold: true,
                        position: "sizeLabel"
                    }
                },
                sizeCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "sizeCheck"
                    }
                },
                sizeXMode: {
                    factory: 'editor',
                    type: 'LabelChoicesCheck',
                    config: {
                        label: "X:",
                        choices: {
                            'absolute': [
                                'editor/img/absolute_s.png',
                                'editor/img/absolute.png'
                            ],
                            'percent': [
                                'editor/img/percent_s.png',
                                'editor/img/percent.png'
                            ],
                            'auto': [
                                'editor/img/auto_s.png',
                                'editor/img/auto.png'
                            ],
                            'cover': [
                                'editor/img/cover_s.png',
                                'editor/img/cover.png'
                            ],
                            'contain': [
                                'editor/img/contain_s.png',
                                'editor/img/contain.png'
                            ]
                        },
                        checkVisible: false,
                        position: 'sizeXMode'
                    }
                },
                sizeXValue: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    config: {
                        label: 'Value:',
                        value: 8,
                        minValue: 0,
                        maxValue: 100,
                        checkVisible: false,
                        position: 'sizeXValue'
                    }
                },
                sizeYMode: {
                    factory: 'editor',
                    type: 'LabelChoicesCheck',
                    config: {
                        label: "Y:",
                        choices: {
                            'absolute': [
                                'editor/img/absolute_s.png',
                                'editor/img/absolute.png'
                            ],
                            'percent': [
                                'editor/img/percent_s.png',
                                'editor/img/percent.png'
                            ],
                            'auto': [
                                'editor/img/auto_s.png',
                                'editor/img/auto.png'
                            ],
                            'cover': [
                                'editor/img/cover_s.png',
                                'editor/img/cover.png'
                            ],
                            'contain': [
                                'editor/img/contain_s.png',
                                'editor/img/contain.png'
                            ]
                        },
                        checkVisible: false,
                        position: 'sizeYMode'
                    }
                },
                sizeYValue: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    config: {
                        label: 'Value:',
                        value: 8,
                        minValue: 0,
                        maxValue: 100,
                        checkVisible: false,
                        position: 'sizeYValue'
                    }
                },
                ///
                repeatLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Repeat",
                        bold: true,
                        position: "repeatLabel"
                    }
                },
                repeatCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "repeatCheck"
                    }
                },
                repeatXMode: {
                    factory: 'editor',
                    type: 'LabelChoicesCheck',
                    config: {
                        label: "X:",
                        choices: {
                            'no-repeat': [
                                'editor/img/norepeat_s.png',
                                'editor/img/norepeat.png'
                            ],
                            'repeat': [
                                'editor/img/repeat_s.png',
                                'editor/img/repeat.png'
                            ],
                            'space': [
                                'editor/img/space_s.png',
                                'editor/img/space.png'
                            ],
                            'round': [
                                'editor/img/round_s.png',
                                'editor/img/round.png'
                            ]
                        },
                        checkVisible: false,
                        position: 'repeatXMode'
                    }
                },
                repeatYMode: {
                    factory: 'editor',
                    type: 'LabelChoicesCheck',
                    config: {
                        label: "X:",
                        choices: {
                            'no-repeat': [
                                'editor/img/norepeat_s.png',
                                'editor/img/norepeat.png'
                            ],
                            'repeat': [
                                'editor/img/repeat_s.png',
                                'editor/img/repeat.png'
                            ],
                            'space': [
                                'editor/img/space_s.png',
                                'editor/img/space.png'
                            ],
                            'round': [
                                'editor/img/round_s.png',
                                'editor/img/round.png'
                            ]
                        },
                        checkVisible: false,
                        position: 'repeatYMode'
                    }
                },
                ///
                imageSource: {
                    factory: 'editor',
                    type: 'LabelChoicesCheck',
                    config: {
                        label: "Source:",
                        choices: {
                            'url': [
                                'editor/img/url_s.png',
                                'editor/img/url.png'
                            ],
                            'gradient': [
                                'editor/img/gradient_s.png',
                                'editor/img/gradient.png'
                            ]
                        },
                        checkVisible: false,
                        boldLabel: true,
                        position: 'imageSource'
                    }
                },
//////
                gradient: {
                    factory: "baseui",
                    type: "GradientEditor",
                    config: {
                        position: "gradient"
                    }
                },
                image: {
                    factory: "baseui",
                    type: "ImagePicker",
                    config: {
                        position: "image"
                    }
                }
            }
        },
        StyleSettingText: {
            dimensions: [340, 360, 1],
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
                fontWeightCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                textAlignLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                textAlignLeft: {
                    order: 0,
                    matrix: [ 23, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   65, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                textAlignRight: {
                    order: 0,
                    matrix: [ 23, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   95, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                textAlignCenter: {
                    order: 0,
                    matrix: [ 23, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   135, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                textAlignJustify: {
                    order: 0,
                    matrix: [ 23, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   165, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },

                textAlignCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                colorLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 150, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                colorCheck: {
                    order: 0,
                    matrix: [ 24, 0, 0, 0,  0, 24, 0, 0,  0, 0, 1, 0,   316, 150, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                color: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 160, 0, 0,  0, 0, 1, 0,   0, 180, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Corner",
                        bold: true,
                        position: "label"
                    }
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "clear"
                    }
                },
                fontFamilyLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Family:",
                        position: "fontFamilyLabel"
                    }
                },
                fontFamily: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        position: "fontFamily"
                    }
                },
                fontFamilyCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "fontFamilyCheck"
                    }
                },
                fontSize: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    config: {
                        label: 'Size:',
                        value: 8,
                        minValue: 4,
                        maxValue: 120,
                        check: true,
                        position: 'fontSize'
                    }
                },
                fontWeightLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Weight:",
                        position: "fontWeightLabel"
                    }
                },
                fontWeightNormal: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/fsnormal.png',
                        position: "fontWeightNormal"
                    }
                },
                fontWeightBold: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/fsbold.png',
                        position: "fontWeightBold"
                    }
                },
                fontWeightCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "fontWeightCheck"
                    }
                },

                textAlignLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Align:",
                        position: "textAlignLabel"
                    }
                },
                textAlignLeft: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/faleft.png',
                        position: "textAlignLeft"
                    }
                },
                textAlignRight: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/faright.png',
                        position: "textAlignRight"
                    }
                },
                textAlignCenter: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/facenter.png',
                        position: "textAlignCenter"
                    }
                },
                textAlignJustify: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/fajustify.png',
                        position: "textAlignJustify"
                    }
                },
                textAlignCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "textAlignCheck"
                    }
                },
                colorLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Color:",
                        position: "colorLabel"
                    }
                },
                colorCheck: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "colorCheck"
                    }
                },
                color: {
                    factory: "baseui",
                    type: "ColorPicker",
                    config: {
                        position: "color"
                    }
                }
            }
        },
        StyleSettingShadow: {
            dimensions: [340, 360, 1],
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
                insetLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 150, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                insetOuter: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   65, 150, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                insetInner: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   115, 150, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                color: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 160, 0, 0,  0, 0, 1, 0,   0, 180, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Corner",
                        bold: true,
                        position: "label"
                    }
                },
                clear: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "clear"
                    }
                },
                offsetX: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    config: {
                        label: 'OffsetX:',
                        value: 0,
                        minValue: -100,
                        maxValue: 100,
                        check: true,
                        checkVisible: false,
                        position: 'offsetX'
                    }
                },
                offsetY: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    config: {
                        label: 'OffsetY:',
                        value: 0,
                        minValue: -100,
                        maxValue: 100,
                        check: true,
                        checkVisible: false,
                        position: 'offsetY'
                    }
                },
                blurRadius: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    config: {
                        label: 'Blur:',
                        value: 0,
                        minValue: 0,
                        maxValue: 100,
                        check: true,
                        checkVisible: false,
                        position: 'blurRadius'
                    }
                },
                spreadRadius: {
                    factory: 'editor',
                    type: 'LabelValueSliderCheck',
                    config: {
                        label: 'Spread:',
                        value: 0,
                        minValue: -100,
                        maxValue: 100,
                        check: true,
                        checkVisible: false,
                        position: 'spreadRadius'
                    }
                },
                insetLabel: {
                    factory: 'baseui',
                    type: 'Label',
                    config: {
                        text: 'Inset:',
                        position: 'insetLabel'
                    }
                },
                insetOuter: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ssouter.png',
                        position: "insetOuter"
                    }
                },
                insetInner: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/ssinner.png',
                        position: "insetInner"
                    }
                },
                color: {
                    factory: "baseui",
                    type: "ColorPicker",
                    config: {
                        position: "color"
                    }
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
                    order: 1,
                    matrix: [ 50, 0, 0, 0,   0, 50, 0, 0,    0, 0, 1, 0,   30, 10, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                preview: {
                    order: 2,
                    matrix: [ 40, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   35, 15, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                decoration: {
                    order: 3,
                    matrix: [ 22, 0, 0, 0,   0, 22, 0, 0,    0, 0, 1, 0,   22, 38, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                label: {
                    order: 4,
                    matrix: [ 90, 0, 0, 0,   0, 40, 0, 0,    0, 0, 1, 0,   10, 70, 0, 1 ],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                selectionBox: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        style: 'background',
                        position: "selectionBox"
                    }
                },
                background: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: 'editor/img/stylebgsmall.png',
                        position: "background"
                    }
                },
                preview: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        position: "preview"
                    }
                },
                decoration: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        position: 'decoration'
                    }
                },
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        textAlign: 'center',
                        position: "label"
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
                    config: {
                        text: 'Style:',
                        position: 'styleNameLabel'
                    }
                },
                styleName: {
                    factory: 'domvisual',
                    type: 'DOMInput',
                    config: {
                        position: 'styleName'
                    }
                },
                basedOnLabel: {
                    factory: 'baseui',
                    type: 'Label',
                    config: {
                        text: 'Extends:',
                        position: 'basedOnLabel'
                    }
                },
                basedOn: {
                    factory: 'baseui',
                    type: 'Label',
                    config: {
                        position: 'basedOn'
                    }
                },
                extendBtn: {
                    factory: 'baseui',
                    type: 'Button',
                    config: {
                        text: 'Extend',
                        position: 'extendBtn'
                    }
                },
                deleteBtn: {
                    factory: 'baseui',
                    type: 'Button',
                    config: {
                        text: 'Delete',
                        position: 'deleteBtn'
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
                    config: {
                        position: 'styleFeature'
                    }
                },
                stylePreview: {
                    factory: 'editor',
                    type: 'StylePreview',
                    config: {
                        position: 'stylePreview'
                    }
                }
            }
        },
        StyleSheet: {
            dimensions: [ 360, 80, 0],
            positions: {
                selectorsLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   5, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                selectors: {
                    order: 1,
                    matrix: [ 240, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   80, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                selectorLabel: {
                    order: 2,
                    matrix: [ 60, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   5, 25, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                selector: {
                    order: 3,
                    matrix: [ 240, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   80, 25, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                parts: {
                    order: 4,
                    matrix: [ 340, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   5, 50, 0, 1],
                    snapping: { left: 'px', right: 'px', width: 'auto', top: 'px', bottom: 'px', height: 'auto' }
                }
            },
            children: {
                selectorsLabel: {
                    factory: 'baseui',
                    type: 'Label',
                    config: {
                        position: 'selectorsLabel',
                        text: 'Selectors:'
                    }
                },
                selectors: {
                    factory: 'domvisual',
                    type: 'DOMInput',
                    config: {
                        position: 'selectors'
                    }
                },
                selectorLabel: {
                    factory: 'baseui',
                    type: 'Label',
                    config: {
                        position: 'selectorLabel',
                        text: 'Selector:'
                    }
                },
                selector: {
                    factory: 'domvisual',
                    type: 'DOMSelect',
                    config: {
                        position: 'selector'
                    }
                },
                parts: {
                    factory: 'domvisual',
                    type: 'DOMElement',
                    config: {
                        position: 'parts'
                    }
                }
            }
        },
        LeftRightTopBottom: {
            dimensions: [ 360, 160, 0],
            positions: {
                title: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 5, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                left: {
                    order: 0,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 35, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                right: {
                    order: 1,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 65, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                top: {
                    order: 2,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 95, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                bottom: {
                    order: 2,
                    matrix: [ 340, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   0, 125, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                title: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        position: 'title',
                        bold: true
                    }
                },
                left: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "Left:",
                        value: 0,
                        minValue: 0,
                        maxValue: 100,
                        check: true,
                        position: "left"
                    }
                },
                right: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "Right:",
                        value: 0,
                        minValue: 0,
                        maxValue: 100,
                        check: true,
                        position: "right"
                    }
                },
                top: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "Top:",
                        value: 0,
                        minValue: 0,
                        maxValue: 100,
                        check: true,
                        position: "top"
                    }
                },
                bottom: {
                    factory: "editor",
                    type: "LabelValueSliderCheck",
                    config: {
                        label: "Bottom:",
                        value: 0,
                        minValue: 0,
                        maxValue: 100,
                        check: true,
                        position: "bottom"
                    }
                }
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
                    matrix: [ 340, 0, 0, 0,  0, 10, 0, 0,  0, 0, 1, 0,   5, 140, 0, 1],
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
                }
            },
            children: {
                styleName: {
                    factory: 'editor',
                    type: 'StyleName',
                    config: {
                        position: null
                    }
                },
                stylingHeading : {
                    factory: 'editor',
                    type: 'StylingHeading',
                    config: {
                        position: null
                    }
                },
                localStylePicker : {
                    factory: 'editor',
                    type: 'StylePicker',
                    config: {
                        position: null
                    }
                },
                stylePicker: {
                    factory: 'editor',
                    type: 'StylePicker',
                    config: {
                        position: null
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
                    config: {
                        style: "background",
                        position: "pos"
                    }
                },
                img: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        url: "editor/img/topleft.png",
                        position: "img"
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
                    config: {
                        url: "editor/img/snappx.png",
                        position: "pos"
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
                    config: {
                        text: "Size:",
                        position: "label"
                    }
                },
                value: {
                    factory: "domvisual",
                    type: "DOMInput",
                    config: {
                        text: "0",
                        position: "value"
                    }
                },
                slider: {
                    factory: "baseui",
                    type: "Slider",
                    config: {
                        value: 0,
                        minValue: 0,
                        maxValue: 50,
                        position: "slider"
                    }
                },
                check: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "check"
                    }
                }
            }
        },
        LabelChoicesCheck: {
            dimensions: [340, 25, 0],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   0, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                choices: {
                    order: 0,
                    matrix: [ 240, 0, 0, 0,  0, 22, 0, 0,  0, 0, 1, 0,   65, 0, 0, 1],
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
                    config: {
                        text: "Size:",
                        position: "label"
                    }
                },
                choices: {
                    factory: "domvisual",
                    type: "DOMElement",
                    config: {
                        position: "choices"
                    }
                },
                check: {
                    factory: "baseui",
                    type: "CheckBox",
                    config: {
                        value: true,
                        position: "check"
                    }
                }
            }
        },
        Item: {
            // authoring dimension
            dimensions: [ 32, 32, 0],
            positions: {
                background: {
                    order: 0,
                    matrix: [ 32, 0, 0, 0, 0, 32, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                    snapping: {
                        left: 'px',
                        right: 'px',
                        width: 'auto',
                        top: 'px',
                        bottom: 'px',
                        height: 'auto'
                    }
                },
                deleteBtn: {
                    order: 1,
                    matrix: [ 16, 0, 0, 0, 0, 16, 0, 0, 0, 0, 1, 0, 16, 16, 0, 1 ],
                    snapping: {
                        left: 'px',
                        right: 'px',
                        width: 'auto',
                        top: 'cpx',
                        bottom: 'cpx',
                        height: 'auto'
                    }
                }
            },
            children: {
                background: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        position: "background",
                        url: 'editor/img/bgimage.png',
                        title: 'Select Image'
                    }
                },
                deleteBtn: {
                    factory: "domvisual",
                    type: "DOMImg",
                    config: {
                        position: "deleteBtn",
                        url: 'editor/img/removestop.png',
                        visible: false,
                        title: 'Delete Image'
                    }
                }
            }
        },
        FormattedText: {
            dimensions: [340, 170, 0],
            positions: {
                label: {
                    order: 0,
                    matrix: [ 200, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   5, 0, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                sourceLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   5, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                sourceInline: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   70, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                sourceUrl: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   120, 30, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                encodingLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   5, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                encodingText: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   70, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                encodingHtml: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   120, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                encodingMd: {
                    order: 0,
                    matrix: [ 47, 0, 0, 0,  0, 20, 0, 0,  0, 0, 1, 0,   170, 60, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                textLabel: {
                    order: 0,
                    matrix: [ 60, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   5, 90, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                },
                text: {
                    order: 0,
                    matrix: [ 350, 0, 0, 0,  0, 25, 0, 0,  0, 0, 1, 0,   5, 120, 0, 1],
                    snapping: { left: 'px', right: 'auto', width: 'px', top: 'px', bottom: 'auto', height: 'px' }
                }
            },
            children: {
                label: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Text:",
                        position: "label",
                        bold: true
                    }
                },
                sourceLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Source:",
                        position: "sourceLabel"
                    }
                },
                sourceInline: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/tsinline.png',
                        position: 'sourceInline'
                    }
                },
                sourceUrl: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/tsurl.png',
                        position: 'sourceUrl'
                    }
                },
                encodingLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Encoding:",
                        position: "encodingLabel"
                    }
                },
                encodingText: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/tetext.png',
                        position: 'encodingText'
                    }
                },
                encodingHtml: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/tehtml.png',
                        position: 'encodingHtml'
                    }
                },
                encodingMd: {
                    factory: 'domvisual',
                    type: 'DOMImg',
                    config: {
                        url: 'editor/img/temd.png',
                        position: 'encodingMd'
                    }
                },
                textLabel: {
                    factory: "baseui",
                    type: "Label",
                    config: {
                        text: "Text:",
                        position: "textLabel"
                    }
                },
                text: {
                    factory: "baseui",
                    type: "Input",
                    config: {
                        position: "text"
                    }
                }
            }
        }
    }
};
