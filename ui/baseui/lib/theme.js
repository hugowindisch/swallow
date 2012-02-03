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
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuItemSpacing' ]
    },
    highLightedMenuTitleText: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuItemSpacing' ]
    },
    menuBar: {
        data: [ 'baseui_theme_menuBar' ]
    },
    // vertical menu
    menuBox: {
        data: [ 'baseui_theme_outlineSmallRounded', 'baseui_theme_menuBoxColor' ]
    },
    menuItem: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_textColor', 'baseui_theme_menuItem' ]
    },
    menuItemSelected: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_highlightColor', 'baseui_theme_textHighlightColor', 'baseui_theme_menuItem' ]
    },
    menuItemDisabled: {
        data: [ 'baseui_theme_controlFont', 'baseui_theme_menuBox_color', 'baseui_theme_textDisabledColor', 'baseui_theme_menuItem' ]
    }    
});
exports.Theme = Theme;


