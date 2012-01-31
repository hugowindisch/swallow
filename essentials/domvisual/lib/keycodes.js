/**
    keycodes.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
// the translation of keycodes to strings has to do with i18n
// a stringname


var utils = require('utils'),
    isString = utils.isString,
    isNumber = utils.isNumber,
    numToVk = {
        '3': 'VK_CANCEL',
        '6': 'VK_HELP',
        '8': 'VK_BACK_SPACE',
        '9': 'VK_TAB',
        '12': 'VK_CLEAR',
        '13': 'VK_RETURN',
        '14': 'VK_ENTER',
        '16': 'VK_SHIFT',
        '17': 'VK_CONTROL',
        '18': 'VK_ALT',
        '19': 'VK_PAUSE',
        '20': 'VK_CAPS_LOCK',
        '27': 'VK_ESCAPE',
        '32': 'VK_SPACE',
        '33': 'VK_PAGE_UP',
        '34': 'VK_PAGE_DOWN',
        '35': 'VK_END',
        '36': 'VK_HOME',
        '37': 'VK_LEFT',
        '38': 'VK_UP',
        '39': 'VK_RIGHT',
        '40': 'VK_DOWN',
        '41': 'VK_SELECT',
        '42': 'VK_PRINT',
        '43': 'VK_EXECUTE',
        '44': 'VK_PRINTSCREEN',
        '45': 'VK_INSERT',
        '46': 'VK_DELETE',
        '48': 'VK_0',
        '49': 'VK_1',
        '50': 'VK_2',
        '51': 'VK_3',
        '52': 'VK_4',
        '53': 'VK_5',
        '54': 'VK_6',
        '55': 'VK_7',
        '56': 'VK_8',
        '57': 'VK_9',
        '59': 'VK_SEMICOLON',
        '61': 'VK_EQUALS',
        '65': 'VK_A',
        '66': 'VK_B',
        '67': 'VK_C',
        '68': 'VK_D',
        '69': 'VK_E',
        '70': 'VK_F',
        '71': 'VK_G',
        '72': 'VK_H',
        '73': 'VK_I',
        '74': 'VK_J',
        '75': 'VK_K',
        '76': 'VK_L',
        '77': 'VK_M',
        '78': 'VK_N',
        '79': 'VK_O',
        '80': 'VK_P',
        '81': 'VK_Q',
        '82': 'VK_R',
        '83': 'VK_S',
        '84': 'VK_T',
        '85': 'VK_U',
        '86': 'VK_V',
        '87': 'VK_W',
        '88': 'VK_X',
        '89': 'VK_Y',
        '90': 'VK_Z'
    },
    vkToText = {
        'VK_CANCEL': 'Cancel',
        'VK_HELP': 'Help',
        'VK_BACK_SPACE': 'Bksp',
        'VK_TAB': 'Tab',
        'VK_CLEAR': 'Clear',
        'VK_RETURN': 'Return',
        'VK_ENTER': 'Enter',
        'VK_SHIFT': 'Shift',
        'VK_CONTROL': 'Ctrl',
        'VK_ALT': 'Alt',
        'VK_PAUSE': 'Pause',
        'VK_CAPS_LOCK': 'CapsLock',
        'VK_ESCAPE': 'Esc',
        'VK_SPACE': 'Space',
        'VK_PAGE_UP': 'PgUp',
        'VK_PAGE_DOWN': 'PgDn',
        'VK_END': 'End',
        'VK_HOME': 'Home',
        'VK_LEFT': 'Left',
        'VK_UP': 'Up',
        'VK_RIGHT': 'Right',
        'VK_DOWN': 'Down',
        'VK_SELECT': 'Select',
        'VK_PRINT': 'Print',	 
        'VK_EXECUTE': 'Exec',
        'VK_PRINTSCREEN': 'PrtScr',
        'VK_INSERT': 'Ins',
        'VK_DELETE': 'Del',
        'VK_0': '0',
        'VK_1': '1', 
        'VK_2': '2', 
        'VK_3': '3',	 
        'VK_4': '4',
        'VK_5': '5',
        'VK_6': '6',
        'VK_7': '7',
        'VK_8': '8',
        'VK_9': '9',
        'VK_SEMICOLON': ';',
        'VK_EQUALS': '=',
        'VK_A': 'A',
        'VK_B': 'B',
        'VK_C': 'C',
        'VK_D': 'D',
        'VK_E': 'E',
        'VK_F': 'F',
        'VK_G': 'G',
        'VK_H': 'H',
        'VK_I': 'I',
        'VK_J': 'J',
        'VK_K': 'K',
        'VK_L': 'L',
        'VK_M': 'M',
        'VK_N': 'N',
        'VK_O': 'O',
        'VK_P': 'P',
        'VK_Q': 'Q',
        'VK_R': 'R',
        'VK_S': 'S',
        'VK_T': 'T',
        'VK_U': 'U',
        'VK_V': 'V',
        'VK_W': 'W',
        'VK_X': 'X',
        'VK_Y': 'Y',
        'VK_Z': 'Z'
    };

function addS(s, s2) {
    if (s.length) {
        s += '+';
    }
    s += s2;
    return s;
}

function decorate(
    s, 
    altk,
    shiftk,
    ctrlk,
    metak
) {
    var r = '';
    if (ctrlk) {
        r = addS(r, 'Ctrl');
    }
    if (altk) {
        r = addS(r, 'Alt');
    }
    if (shiftk) {
        r = addS(r, 'Shift');
    }
    if (metak) {
        r = addS(r, 'Meta');
    }
    return addS(r, s);
}

function decorateVk(
    vkCode,
    altk,
    shiftk,
    ctrlk,
    metak
) {
    return decorate(vkCode, altk, shiftk, ctrlk, metak);
}

// this should probably be moved in a more general place
function makeKeyString(
    vkCode,
    altk,
    shiftk,
    ctrlk,
    metak
) {
    return decorate(vkToText[vkCode], altk, shiftk, ctrlk, metak);
}
exports.makeKeyString = makeKeyString;
exports.decorateVk = decorateVk;
exports.numToVk = function (num) {
    return numToVk[num];
};
/*
VK_CONTEXT_MENU	93	 
VK_NUMPAD0	96	0 on the numeric keypad.
VK_NUMPAD1	97	1 on the numeric keypad.
VK_NUMPAD2	98	2 on the numeric keypad.
VK_NUMPAD3	99	3 on the numeric keypad.
VK_NUMPAD4	100	4 on the numeric keypad.
VK_NUMPAD5	101	5 on the numeric keypad.
VK_NUMPAD6	102	6 on the numeric keypad.
VK_NUMPAD7	103	7 on the numeric keypad.
VK_NUMPAD8	104	8 on the numeric keypad.
VK_NUMPAD9	105	9 on the numeric keypad.
VK_MULTIPLY	106	* on the numeric keypad.
VK_ADD	107	+ on the numeric keypad.
VK_SEPARATOR	108	 
VK_SUBTRACT	109	- on the numeric keypad.
VK_DECIMAL	110	Decimal point on the numeric keypad.
VK_DIVIDE	111	/ on the numeric keypad.
VK_F1	112	F1 key.
VK_F2	113	F2 key.
VK_F3	114	F3 key.
VK_F4	115	F4 key.
VK_F5	116	F5 key.
VK_F6	117	F6 key.
VK_F7	118	F7 key.
VK_F8	119	F8 key.
VK_F9	120	F9 key.
VK_F10	121	F10 key.
VK_F11	122	F11 key.
VK_F12	123	F12 key.
VK_F13	124	F13 key.
VK_F14	125	F14 key.
VK_F15	126	F15 key.
VK_F16	127	F16 key.
VK_F17	128	F17 key.
VK_F18	129	F18 key.
VK_F19	130	F19 key.
VK_F20	131	F20 key.
VK_F21	132	F21 key.
VK_F22	133	F22 key.
VK_F23	134	F23 key.
VK_F24	135	F24 key.
VK_NUM_LOCK	144	Num Lock key.
VK_SCROLL_LOCK	145	Scroll Lock key.
VK_COMMA	188	Comma (",") key.
VK_PERIOD	190	Period (".") key.
VK_SLASH	191	Slash ("/") key.
VK_BACK_QUOTE	192	Back tick ("`") key.
VK_OPEN_BRACKET	219	Open square bracket ("[") key.
VK_BACK_SLASH	Mac: 220; Windows: 222	Back slash ("\") key.
VK_CLOSE_BRACKET	221	Close square bracket ("]") key.
VK_QUOTE	Mac: 222; Windows: 192	Quote ('"') key.
VK_META	224	Meta (Command on Mac) key.
VK_KANA	21	Linux support for this keycode was added in Gecko 4.0.
VK_HANGUL	21	Linux support for this keycode was added in Gecko 4.0.
VK_JUNJA	23	Linux support for this keycode was added in Gecko 4.0.
VK_FINAL	24	Linux support for this keycode was added in Gecko 4.0.
VK_HANJA	25	Linux support for this keycode was added in Gecko 4.0.
VK_KANJI	25	Linux support for this keycode was added in Gecko 4.0.
VK_CONVERT	28	Linux support for this keycode was added in Gecko 4.0.
VK_NONCONVERT	29	Linux support for this keycode was added in Gecko 4.0.
VK_ACCEPT	30	Linux support for this keycode was added in Gecko 4.0.
VK_MODECHANGE	31	Linux support for this keycode was added in Gecko 4.0.
VK_SELECT	41	Linux support for this keycode was added in Gecko 4.0.
VK_PRINT	42	Linux support for this keycode was added in Gecko 4.0.
VK_EXECUTE	43	Linux support for this keycode was added in Gecko 4.0.
VK_SLEEP	95	Linux support for this keycode was added in Gecko 4.0.
*/
