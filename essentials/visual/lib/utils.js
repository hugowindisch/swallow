/**
    utils.js

        A bunch of javascript utilities.

    Copyright (c) Hugo Windisch 2012 All Rights Reserved    
*/
exports.forAllProperties = function (object, f) {
    var p;
    if (object) {
        for (p in object) {
            if (object.hasOwnProperty(p)) {
                f(object[p], p, object);
            }
        }
    }
}

