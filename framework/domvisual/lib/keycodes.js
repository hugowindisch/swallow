/**
    keycodes.js
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
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
    ctrlk,
    altk,
    metak,
    shiftk
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
    ctrlk,
    altk,
    metak,
    shiftk
) {
    return decorate(vkCode, ctrlk, altk, metak, shiftk);
}

// this should probably be moved in a more general place
function makeKeyString(
    vkCode,
    ctrlk,
    altk,
    metak,
    shiftk
) {
    return decorate(vkToText[vkCode], ctrlk, altk, metak, shiftk);
}
exports.makeKeyString = makeKeyString;
exports.decorateVk = decorateVk;
exports.numToVk = function (num) {
    return numToVk[num];
};
