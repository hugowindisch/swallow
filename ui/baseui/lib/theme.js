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
Theme.prototype.theme = new (require('visual').Theme)({
    // borders
    sectionBorder: {
        data: [ 'baseui_theme_outlineColor' ]
    },
    // button
    buttonBackground: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillNormal']
    },
    pressedButtonBackground: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillPressed']
    },
    buttonText: {
        data: [ 'baseui_theme_centered', 'baseui_theme_middle', 'baseui_theme_controlFont', 'baseui_theme_textColor' ]
    },
    pressedButtonText: {
        data: [ 'baseui_theme_centered', 'baseui_theme_middle', 'baseui_theme_controlFont', 'baseui_theme_textColor' ]
    },
    // horizontal menu
    menuTitleBackground: {
        data: [ 'basui_theme_outlineTransparent' ]
    },
    highLightedMenuTitleBackground: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineTopRounded', 'baseui_theme_controlFillNormal' ]
    },
    menuTitleText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuItemSpacing', 'baseui_theme_outlineTransparent' ]
    },
    highLightedMenuTitleText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuItemSpacing', 'baseui_theme_outlineColor' ]
    },
    menuBar: {
        data: [ 'baseui_theme_menuBar' ]
    },
    // vertical menu
    menuBox: {
        data: [ 'baseui_theme_outlineSmallRounded', 'baseui_theme_menuBoxColor', 'baseui_theme_outlineColor', 'baseui_theme_outlineShadow' ]
    },
    menuItem: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_menuItem' ]
    },
    menuItemSelected: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_highlightColor', 'baseui_theme_textHighlightColor', 'baseui_theme_menuItem' ]
    },
    menuItemDisabled: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuBox_color', 'baseui_theme_textDisabledColor', 'baseui_theme_menuItem' ]
    },
    horizontalSeparator: {
        data: [ 'baseui_theme_borderBottom']
    },
    // toolbox tool
    tool: {
        data: [ 'baseui_theme_outlineTransparent', 'baseui_theme_toolSize' ]
    },
    highlightedTool: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillNormal', 'baseui_theme_toolSize']
    },
    grayedTool: {
        data: [ 'baseui_theme_outlineTransparent', 'baseui_theme_transparency', 'baseui_theme_toolSize']
    },
    pressedTool: {
        data: [ 'baseui_theme_outlineColor', 'baseui_theme_outlineRounded', 'baseui_theme_controlFillPressed', 'baseui_theme_toolSize']
    },
    verticalSeparator: {
        data: [ ]
    },
    // label text
    labelText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor' ]
    },
    // input text
    inputText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor' ]
    },
    // folder
    expandedFolder: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_bgImgExpandedFolder', 'baseui_theme_bold' ]
    },
    contractedFolder: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_bgImgContractedFolder', 'baseui_theme_bold' ]
    },
    // window background (the darker part of a window, for controls etc)
    windowBackground: {
        data: [ 'baseui_theme_windowBackground' ]
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
        data: [ 'baseui_theme_outlineTransparent' ] 
    },
    imagePickerImageSelected: {
        data: [ 'baseui_theme_outlineColor' ] 
    }
});
exports.Theme = Theme;


