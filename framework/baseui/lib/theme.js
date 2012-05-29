/**
    theme.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
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
    // borders
    sectionBorder: {
        data: [ 'baseui_theme_outlineColor' ],
        private: true
    },
    // button
    buttonBackground: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillNormal']
    },
    pressedButtonBackground: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillPressed']
    },
    buttonText: {
        data: [ 'baseui_theme_centered', 'baseui_theme_middle', 'baseui_theme_controlFont', 'baseui_theme_textColor' ],
        private: true
    },
    pressedButtonText: {
        data: [ 'baseui_theme_centered', 'baseui_theme_middle', 'baseui_theme_controlFont', 'baseui_theme_textColor' ],
        private: true
    },
    // horizontal menu
    menuTitleBackground: {
        data: [ 'basui_theme_outlineTransparent' ],
        private: true
    },
    highLightedMenuTitleBackground: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineTopRounded', 'baseui_theme_controlFillNormal' ],
        private: true
    },
    menuTitleText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuItemSpacing', 'baseui_theme_outlineTransparent' ],
        private: true
    },
    highLightedMenuTitleText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuItemSpacing', 'baseui_theme_outlineColor' ],
        private: true
    },
    menuBar: {
        data: [ 'baseui_theme_menuBar' ],
        private: true
    },
    // vertical menu
    menuBox: {
        data: [ 'baseui_theme_outlineSmallRounded', 'baseui_theme_menuBoxColor', 'baseui_theme_outlineColor', 'baseui_theme_outlineShadow' ],
        private: true
    },
    menuItem: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_menuItem' ],
        private: true
    },
    menuItemSelected: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_highlightColor', 'baseui_theme_textHighlightColor', 'baseui_theme_menuItem' ],
        private: true
    },
    menuItemDisabled: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuBox_color', 'baseui_theme_textDisabledColor', 'baseui_theme_menuItem' ],
        private: true
    },
    horizontalSeparator: {
        data: [ 'baseui_theme_borderBottom'],
        private: true
    },
    // toolbox tool
    tool: {
        data: [ 'baseui_theme_outlineTransparent', 'baseui_theme_toolSize' ],
        private: true
    },
    highlightedTool: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillNormal', 'baseui_theme_toolSize'],
        private: true
    },
    grayedTool: {
        data: [ 'baseui_theme_outlineTransparent', 'baseui_theme_transparency', 'baseui_theme_toolSize'],
        private: true
    },
    pressedTool: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillPressed', 'baseui_theme_toolSize'],
        private: true
    },
    verticalSeparator: {
        data: [ ],
        private: true
    },
    // label text
    labelText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor' ],
        private: true
    },
    // input text
    inputText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor' ],
        private: true
    },
    // folder
    expandedFolder: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_bgImgExpandedFolder', 'baseui_theme_bold' ],
        private: true
    },
    contractedFolder: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_bgImgContractedFolder', 'baseui_theme_bold' ],
        private: true
    },
    // window background (the darker part of a window, for controls etc)
    windowBackground: {
        data: [ 'baseui_theme_windowBackground' ],
        private: true
    },
    // window foreground (the working area of a window)
    windowForeground: {
        data: [ 'baseui_theme_windowForeground', 'baseui_theme_outlineColor' ]
    },
    windowDarkerForeground: {
        data: [ 'baseui_theme_windowDarkerForeground', 'baseui_theme_outlineColor' ]
    },
    // image picker
    imagePickerImage: {
        data: [ 'baseui_theme_outlineTransparent' ],
        private: true
    },
    imagePickerImageSelected: {
        data: [ 'baseui_theme_outlineColor' ],
        private: true
    }
});
exports.Theme = Theme;
