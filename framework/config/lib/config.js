/**
    config.js
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
/*globals define */

/**
* This package provides functions that can be used in configuration sheets.
* Configuration sheets lets a visual component declare some properties that
* will be configurable in the editor.
*
* @package config
*/
var utils = require('utils'),
    forEachProperty = utils.forEachProperty,
    isObject = utils.isObject;

/**
* loadConstructor
* @api private
*/
function loadConstructor(
    factory,
    type,
    cb
) {
    var visual = require('visual');
    // 1. load the factory
    visual.loadPackage(factory, null, false, false, function (err) {
        var p, Constr;
        if (err) {
            return cb(err);
        }
        try {
            p = require(factory);
        } catch (e) {
            return cb(e);
        }
        Constr = p[type];
        if (Constr) {
            cb(null, Constr);
        } else {
            return cb(new Error('Constructor not found ' + type));
        }
    });
}

/**
* leftRightConfig
* @api private
*/
function leftRightConfig(
    labelTxt,
    factory,
    type,
    config,
    lineHeight,
    lineWidth,
    labelWidth,
    cb
) {
    // intentionally here
    var domvisual = require('domvisual'),
        visual = require('visual'),
        baseui = require('baseui');

    loadConstructor(factory, type, function (err, Constr) {
        var cnt, label, editor;
        if (err) {
            return cb(err);
        }
        // create the graphic elements that we need
        cnt = new (domvisual.DOMElement)({});
        label = new (baseui.Label)({ text: labelTxt});
        editor = new Constr(config);
        cnt.addChild(label, 'label');
        cnt.addChild(editor, 'data');
        label.setDimensions([labelWidth, lineHeight, 1]);
        label.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, 0, 0, 1]);
        editor.setDimensions([lineWidth - labelWidth - 20, lineHeight, 1]);
        editor.setMatrix(
            [ 1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  labelWidth + 5, 0, 0, 1]
        );
        cnt.setDimensions([lineWidth, lineHeight + 10, 1]);
        cb(null, cnt);
    });
}

/**
* topBottomConfig
* @api private
*/
function topBottomConfig(
    labelTxt,
    factory,
    type,
    config,
    lineWidth,
    lineHeight,
    labelHeight,
    cb
) {
    // intentionally here
    var domvisual = require('domvisual'),
        visual = require('visual'),
        baseui = require('baseui');

    loadConstructor(factory, type, function (err, Constr) {
        var cnt, label, editor;
        if (err) {
            return cb(err);
        }
        // create the graphic elements that we need
        cnt = new (domvisual.DOMElement)({});
        label = new (baseui.Label)({ text: labelTxt});
        editor = new Constr(config);
        cnt.addChild(label, 'label');
        cnt.addChild(editor, 'data');
        label.setDimensions([lineWidth - 10, labelHeight, 1]);
        label.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, 0, 0, 1]);
        editor.setDimensions([lineWidth - 10, lineHeight - labelHeight, 1]);
        editor.setMatrix(
            [ 1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, labelHeight, 0, 1]
        );
        cnt.setDimensions([lineWidth, lineHeight, 1]);
        cb(null, cnt);
    });
}

/**
* Returns a input config element (that can be used in getConfigurationSheet to
* edit a string)
* @param {String} label The label that should be used.
* @returns A function that will let the editor create the appropriate input element
* @memberOf config
*/
function inputConfigFullLine(label) {
    return function (editor, cb) {
        topBottomConfig(
            label,
            'baseui',
            'Input',
            {},
            360,
            50,
            25,
            function (err, ctrl) {
                if (err) {
                    return cb(err);
                }
                // we should setup the editor that we got,
                // to add set data and get data and notification
                ctrl.setData = function (txt) {
                    ctrl.children.data.setText(txt);
                };
                ctrl.getData = function () {
                    return ctrl.children.data.getText();
                };
                cb(err, ctrl);
            }
        );
    };
}

/**
* Returns a input config element (that can be used in getConfigurationSheet to
* edit a string)
* @param {String} label The label that should be used.
* @returns A function that will let the editor create the appropriate input element
* @memberOf config
*/
function inputConfig(label) {
    return function (editor, cb) {
        leftRightConfig(
            label,
            'baseui',
            'Input',
            {},
            25,
            360,
            100,
            function (err, ctrl) {
                if (err) {
                    return cb(err);
                }
                // we should setup the editor that we got,
                // to add set data and get data and notification
                ctrl.setData = function (txt) {
                    ctrl.children.data.setText(txt);
                };
                ctrl.getData = function () {
                    return ctrl.children.data.getText();
                };
                cb(err, ctrl);
            }
        );
    };
}

/**
* Returns a boolean config element (that can be used in getConfigurationSheet to
* edit a Boolean).
* @param {String} label The label that should be used.
* @returns A function that will let the editor create the appropriate input element
* @memberOf config
*/
function booleanConfig(label) {
    return function (editor, cb) {
        leftRightConfig(
            label,
            'baseui',
            'CheckBox',
            {},
            25,
            145,
            100,
            function (err, ctrl) {
                if (err) {
                    return cb(err);
                }
                // we should setup the editor that we got,
                // to add set data and get data and notification
                ctrl.children.data.setValue(false);
                ctrl.setData = function (v) {
                    ctrl.children.data.setValue(v);
                };
                ctrl.getData = function () {
                    return ctrl.children.data.getValue();
                };
                ctrl.children.data.on('change', function (v) {
                    ctrl.emit('change', v);
                });
                cb(err, ctrl);
            }
        );
    };
}

/**
* Returns a style config element (that can be used in getConfigurationSheet to
* edit a style).
* @param {String} label The label that should be used.
* @returns A function that will let the editor create the appropriate input element
* @memberOf config
*/
function styleConfig(labelTxt) {
    function sc(mainEditor, cb) {
        // intentionally here
        var domvisual = require('domvisual'),
            visual = require('visual'),
            baseui = require('baseui'),
            e = require('editor'); // obviously loaded

        function create() {
            var cnt, editor,
                lineWidth = 360, labelHeight = 25,
                cdim;
            function domChanged() {
                var dim = editor.getComputedDimensions();
                if (!cdim || cdim[0] !== dim[0] || cdim[1] !== dim[1]) {
                    cdim = dim;
                    cnt.requestDimensions(
                        [lineWidth, labelHeight + cdim[1], 1]
                    );
                }
            }
            // create the graphic elements that we need
            cnt = new (domvisual.DOMElement)({});
            editor = new (e.Styling)({
                editor: mainEditor,
                eventHandlers: {
                    'domchanged': domChanged
                }
            });

            cnt.addChild(editor, 'data');
            editor.on('change', function (data) {
                cnt.emit('change', data);
            });
            cnt.setData = function (txt) {
                editor.setData(txt);
            };
            cnt.getData = function () {
                return editor.getData();
            };
            editor.setMatrix(
                [ 1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, labelHeight, 0, 1]
            );
            cb(null, cnt);
        }
        create();
    }
    // this lets the editor identify that this config element has some style
    // references (names) that must be updated when some styles are removed
    // or renamed
    sc.getStylesFromData = function (data) {
        return { main: data };
    };
    sc.updateDataFromStyles = function (data, styles) {
        return styles.main;
    };
    return sc;
}


/**
* Returns a style config element (that can be used in getConfigurationSheet to
* edit a style).
* @param {String} label The label that should be used.
* @returns A function that will let the editor create the appropriate input element
* @memberOf config
*/
function styleSheetConfig(labelTxt) {
    function sc(mainEditor, cb) {
        // intentionally here
        var domvisual = require('domvisual'),
            visual = require('visual'),
            baseui = require('baseui'),
            e = require('editor'); // obviously loaded

        function create() {
            var cnt, label, editor,
                lineWidth = 360, labelHeight = 25,
                cdim;
            // create the graphic elements that we need
            editor = new (e.StyleSheet)({editor: mainEditor});
            cb(null, editor);
        }
        create();
    }
    // this lets the editor identify that this config element has some style
    // references (names) that must be updated when some styles are removed
    // or renamed
    sc.getStylesFromData = function (data) {
        var res = {};
        forEachProperty(data, function (d, dname) {
            if (isObject(d) && d.style) {
                res[dname] = d.style;
            }
        });
        return res;
    };
    sc.updateDataFromStyles = function (data, styles) {
        forEachProperty(styles, function (s, sname) {
            if (s === null) {
                delete data[sname].style;
            } else {
                data[sname].style = s;
            }
        });
        return data;
    };


    return sc;
}


/**
* Returns a style config element (that can be used in getConfigurationSheet to
* edit a style).
* @param {String} label The label that should be used.
* @returns A function that will let the editor create the appropriate input element
* @memberOf config
*/
function formattedTextConfig(labelTxt) {
    function sc(mainEditor, cb) {
        // intentionally here
        var domvisual = require('domvisual'),
            visual = require('visual'),
            baseui = require('baseui'),
            e = require('editor'); // obviously loaded

        function create() {
            var cnt, label, editor,
                lineWidth = 360, labelHeight = 25,
                cdim;
            // create the graphic elements that we need
            editor = new (e.FormattedText)({editor: mainEditor, label: labelTxt});
            cb(null, editor);
        }
        create();
    }
    return sc;
}


/**
* Returns an image config element (that can be used in getConfigurationSheet to
* edit an image).
* @param {String} label The label that should be used.
* @returns A function that will let the editor create the appropriate input element
* @memberOf config
*/
function imageUrlConfig(label) {
    return function (editor, cb) {
        var http = require('http'),
            editorInfo = editor.getDocInfo(),
            data = '';

        http.get(
            { path: '/swallow/package/' + editorInfo.factory + '/image'},
            function (res) {
                res.on('data', function (d) {
                    data += d;
                });
                res.on('end', function () {
                    var jsonData = JSON.parse(data);
                    topBottomConfig(
                        label,
                        'baseui',
                        'ImagePicker',
                        { urls: jsonData },
                        360,
                        200,
                        25,
                        function (err, ctrl) {
                            if (err) {
                                return cb(err);
                            }
                            // we should setup the editor that we got,
                            // to add set data and get data and notification
                            ctrl.setData = function (txt) {
                                ctrl.children.data.setSelectedUrl(txt);
                            };
                            ctrl.getData = function () {
                                return ctrl.children.data.getSelectedUrl();
                            };
                            ctrl.children.data.on('change', function (sel) {
                                ctrl.emit('change', sel);
                            });
                            cb(err, ctrl);
                        }
                    );


                });
                res.on('error', function (e) {
                    cb(e);
                });
            }
        );
    };
}

exports.leftRightConfig = leftRightConfig;
exports.inputConfig = inputConfig;
exports.booleanConfig = booleanConfig;
exports.inputConfigFullLine = inputConfigFullLine;
exports.imageUrlConfig = imageUrlConfig;
exports.styleConfig = styleConfig;
exports.styleSheetConfig = styleSheetConfig;
exports.formattedTextConfig = formattedTextConfig;
