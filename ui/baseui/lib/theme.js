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
        data: [ 'baseui_theme_centered', 'baseui_theme_middle', 'baseui_theme_controlFont' ]
    },
    pressedButtonText: {
        data: [ 'baseui_theme_centered', 'baseui_theme_middle', 'baseui_theme_controlFont' ]
    }
});
exports.Theme = Theme;
