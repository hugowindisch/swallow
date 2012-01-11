/**
    utils.js

        A bunch of javascript utilities.

    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/
exports.forEachProperty = function (object, f) {
    var p;
    if (object) {
        for (p in object) {
            if (object.hasOwnProperty(p)) {
                f(object[p], p, object);
            }
        }
    }
};
exports.isString = function (s) {
    return typeof (s) === 'string';
};
exports.isNumber = function (n) {
    return typeof (n) === 'number';
};

