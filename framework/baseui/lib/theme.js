/**
    theme.js
    Copyright (C) 2012 Hugo Windisch

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
*/

/*
    This provides the styling that is common to all ui components in baseui.
    Changing Theme.prototype.theme will re-theme all ui components.

    (so: this provides a way to harmoniously change the look of many apparented
    UI elements at once)

    See baseui.css.
*/
function Theme() {
}
Theme.prototype.privateStyles = false;
Theme.prototype.theme = new (require('visual').Theme)({
    // font
    controlText: {
        jsData: {
            "fontFamily": "sans-serif",
            "fontSize": 14,
            "color": { r: 0, g: 0, b: 0, a: 1 }
        }
    },
    controlTextCentered: {
        basedOn: [ { factory: 'baseui', type: 'Theme', style: 'controlText' } ],
        jsData: {
            "textAlign": "center"
        }
    },
    // button
    control: {
        jsData: {
            "borderTopLeftRadius": 8,
            "borderTopRightRadius": 8,
            "borderBottomLeftRadius": 8,
            "borderBottomRightRadius": 8,
            "backgroundColor": {
                "r": 250,
                "g": 250,
                "b": 250,
                "a": 1
            },
            "backgroundImage": {
                "colors": [
                    { r: 255, g: 255, b: 255, a: 1},
                    { r: 246, g: 246, b: 246, a: 1},
                    { r: 237, g: 237, b: 237, a: 1}
                ],
                "stops": [
                    0,
                    0.47,
                    1
                ],
                "type": "vertical"
            },
            "borderTopWidth": 1,
            "borderLeftStyle": "solid",
            "borderLeftWidth": 1,
            "borderRightStyle": "solid",
            "borderRightWidth": 1,
            "borderBottomStyle": "solid",
            "borderBottomWidth": 1,
            "borderTopStyle": "solid",
            "borderLeftColor": {
                "r": 206,
                "g": 206,
                "b": 206,
                "a": 1
            },
            "borderRightColor": {
                "r": 206,
                "g": 206,
                "b": 206,
                "a": 1
            },
            "borderBottomColor": {
                "r": 206,
                "g": 206,
                "b": 206,
                "a": 1
            },
            "borderTopColor": {
                "r": 206,
                "g": 206,
                "b": 206,
                "a": 1
            }
        }
    },
    controlBackground: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'control' }
        ],
        jsData: {
            "backgroundColor": {
                "r": 240,
                "g": 240,
                "b": 240,
                "a": 1
            },
            "backgroundImage": null
        }
    },
    controlPressed: {
        basedOn: [
            { factory: 'baseui', type: 'Theme', style: 'controlBackground' }
        ]
    },
    // window background (the darker part of a window, for controls etc)
    windowBackground: {
        jsData: {
            backgroundColor: { r: 224, g: 225, b: 224, a: 1 }
        }
    },
    // window foreground (the working area of a window)
    windowForeground: {
        jsData: {
            backgroundColor: { r: 255, g: 255, b: 255, a: 1 }
        }
    },
    windowDarkerForeground: {
        jsData: {
            backgroundColor: { r: 245, g: 245, b: 245, a: 1 }
        }
    },
    //////////////////////////////////////
    /// Weird stuff to be fixed from here
    // horizontal menu
    menuTitleBackground: {
        data: [ 'basui_theme_outlineTransparent' ],
        privateStyle: true
    },
    highLightedMenuTitleBackground: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineTopRounded', 'baseui_theme_controlFillNormal' ],
        privateStyle: true
    },
    menuTitleText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuItemSpacing', 'baseui_theme_outlineTransparent' ],
        privateStyle: true
    },
    highLightedMenuTitleText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuItemSpacing', 'baseui_theme_outlineColor' ],
        privateStyle: true
    },
    menuBar: {
        data: [ 'baseui_theme_menuBar' ],
        privateStyle: true
    },
    // vertical menu
    menuBox: {
        data: [ 'baseui_theme_outlineSmallRounded', 'baseui_theme_menuBoxColor', 'baseui_theme_outlineColor', 'baseui_theme_outlineShadow' ],
        privateStyle: true
    },
    menuItem: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_menuItem' ],
        privateStyle: true
    },
    menuItemSelected: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_highlightColor', 'baseui_theme_textHighlightColor', 'baseui_theme_menuItem' ],
        privateStyle: true
    },
    menuItemDisabled: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuBox_color', 'baseui_theme_textDisabledColor', 'baseui_theme_menuItem' ],
        privateStyle: true
    },
    horizontalSeparator: {
        data: [ 'baseui_theme_borderBottom'],
        privateStyle: true
    },
    // toolbox tool
    tool: {
        data: [ 'baseui_theme_outlineTransparent', 'baseui_theme_toolSize' ],
        privateStyle: true
    },
    highlightedTool: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillNormal', 'baseui_theme_toolSize'],
        privateStyle: true
    },
    grayedTool: {
        data: [ 'baseui_theme_outlineTransparent', 'baseui_theme_transparency', 'baseui_theme_toolSize'],
        privateStyle: true
    },
    pressedTool: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillPressed', 'baseui_theme_toolSize'],
        privateStyle: true
    },
    verticalSeparator: {
        data: [ ],
        privateStyle: true
    },
    // folder
    expandedFolder: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_bgImgExpandedFolder', 'baseui_theme_bold' ],
        privateStyle: true
    },
    contractedFolder: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_bgImgContractedFolder', 'baseui_theme_bold' ],
        privateStyle: true
    },
    // image picker
    imagePickerImage: {
        data: [ 'baseui_theme_outlineTransparent' ],
        privateStyle: true
    },
    imagePickerImageSelected: {
        data: [ 'baseui_theme_outlineColor' ],
        privateStyle: true
    }
});
exports.Theme = Theme;
